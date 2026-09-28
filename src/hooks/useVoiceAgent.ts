"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { playDemoSound } from "@/lib/soundboard";
import { useStudioStore } from "@/store/studio-store";
import { STUDIO_AGENT_PROMPT } from "@/lib/ai/prompts";
import {
  MAX_BUFFER_AHEAD_S,
  MIC_SAMPLE_RATE,
  PLAYBACK_SAMPLE_RATE,
  createAudioContext,
  decodePcm16Base64,
  encodePcm16Base64,
} from "../lib/ai/audio";
import { AGENT_TOOLS } from "../lib/ai/tools";

const WS_URL = "wss://agents.assemblyai.com/v1/ws";
const PAD_HIGHLIGHT_MS = 600;
const TRANSCRIPT_TYPES = new Set([
  "transcript",
  "agent_transcript",
  "reply.transcript",
]);

type ToolArgs = Record<string, any>;
type PendingToolResult = { call_id: string; result: string };

function send(socket: WebSocket, payload: object) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  }
}

export function useVoiceAgent(sessionId: string) {
  const { updateSession, setActiveSession } = useStudioStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [activePad, setActivePad] = useState<string | null>(null);

  // Connection + mic
  const ws = useRef<WebSocket | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const micCtx = useRef<AudioContext | null>(null);
  const micSource = useRef<MediaStreamAudioSourceNode | null>(null);
  const micProcessor = useRef<ScriptProcessorNode | null>(null);

  // Playback
  const playCtx = useRef<AudioContext | null>(null);
  const nextPlayTime = useRef(0);

  // Tool results are sent after `reply.done`, per the AssemblyAI protocol
  const pendingToolResults = useRef<PendingToolResult[]>([]);

  const getSession = () => useStudioStore.getState().sessions[sessionId];

  // ---------------------------------------------------------------- teardown

  const cutBroadcast = useCallback(() => {
    ws.current?.close();
    micStream.current?.getTracks().forEach((track) => track.stop());
    micProcessor.current?.disconnect();
    micSource.current?.disconnect();
    micCtx.current?.close();
    playCtx.current?.close();

    ws.current = null;
    micStream.current = null;
    micProcessor.current = null;
    micSource.current = null;
    micCtx.current = null;
    playCtx.current = null;

    setIsConnecting(false);
  }, []);

  // ------------------------------------------------------------------- tools

  const triggerPad = useCallback((effect: string) => {
    playDemoSound(effect);
    setActivePad(effect);
    setTimeout(() => setActivePad(null), PAD_HIGHLIGHT_MS);
  }, []);

  /** Runs a tool call and returns the result object to send back to the agent. */
  const runTool = useCallback(
    (name: string, args: ToolArgs): object => {
      const timestamp = new Date().toLocaleTimeString();

      switch (name) {
        case "trigger_sfx":
          triggerPad(args.effect);
          return { status: "triggered", effect: args.effect };

        case "display_fact_card":
          updateSession(sessionId, {
            facts: [
              {
                id: Date.now(),
                query: args.query,
                fact: args.fact,
                source: args.source_or_year,
                timestamp,
              },
              ...(getSession().facts || []),
            ],
            lastWhisper: args.fact,
          });
          return { status: "displayed", fact: args.fact };

        case "add_chapter_marker":
          updateSession(sessionId, {
            chapters: [
              ...(getSession().chapters || []),
              { id: Date.now(), title: args.chapter_title, timestamp },
            ],
            lastWhisper: `Chapter: ${args.chapter_title}`,
          });
          return { status: "marked", chapter: args.chapter_title };

        default:
          return { status: "unknown_tool" };
      }
    },
    [sessionId, updateSession, triggerPad],
  );

  // ------------------------------------------------------------------- audio

  const playReplyAudio = useCallback((base64: string) => {
    const ctx = playCtx.current;
    if (!ctx) return;

    const samples = decodePcm16Base64(base64);
    const buffer = ctx.createBuffer(1, samples.length, PLAYBACK_SAMPLE_RATE);
    buffer.copyToChannel(samples, 0);

    const node = ctx.createBufferSource();
    node.buffer = buffer;
    node.connect(ctx.destination);

    const isBehind = nextPlayTime.current < ctx.currentTime;
    const isTooFarAhead =
      nextPlayTime.current - ctx.currentTime > MAX_BUFFER_AHEAD_S;
    if (isBehind || isTooFarAhead) {
      nextPlayTime.current = ctx.currentTime;
    }

    node.start(nextPlayTime.current);
    nextPlayTime.current += buffer.duration;
  }, []);

  const startMicStreaming = useCallback(
    (socket: WebSocket, stream: MediaStream) => {
      const ctx = createAudioContext(MIC_SAMPLE_RATE);
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        const samples = e.inputBuffer.getChannelData(0);
        send(socket, {
          type: "input.audio",
          audio: encodePcm16Base64(samples),
        });
      };

      source.connect(processor);
      processor.connect(ctx.destination);

      micCtx.current = ctx;
      micSource.current = source;
      micProcessor.current = processor;
    },
    [],
  );

  // ---------------------------------------------------------------- messages

  const handleMessage = useCallback(
    (socket: WebSocket, msg: any) => {
      switch (msg.type) {
        case "reply.audio": {
          const audio = msg.data || msg.audio;
          if (audio) playReplyAudio(audio);
          break;
        }

        case "tool.call": {
          const { call_id, name, arguments: args } = msg;
          const result = runTool(name, args);
          pendingToolResults.current.push({
            call_id,
            result: JSON.stringify(result),
          });
          break;
        }

        case "reply.done": {
          const pending = pendingToolResults.current.splice(0);
          for (const { call_id, result } of pending) {
            send(socket, { type: "tool.result", call_id, result });
          }
          break;
        }

        default:
          if (TRANSCRIPT_TYPES.has(msg.type)) {
            updateSession(sessionId, {
              lastWhisper: msg.text || msg.transcript,
            });
          }
      }
    },
    [sessionId, updateSession, playReplyAudio, runTool],
  );

  // ------------------------------------------------------------------ go live

  const goOnAir = useCallback(async () => {
    try {
      setIsConnecting(true);

      const tokenRes = await fetch("/api/token");
      if (!tokenRes.ok) {
        throw new Error(`Failed to fetch token: ${tokenRes.statusText}`);
      }
      const { token } = await tokenRes.json();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.current = stream;

      const playback = createAudioContext(PLAYBACK_SAMPLE_RATE);
      playCtx.current = playback;
      nextPlayTime.current = playback.currentTime;

      const socket = new WebSocket(`${WS_URL}?token=${token}`);
      ws.current = socket;

      socket.onopen = () => {
        setIsConnecting(false);
        setActiveSession(sessionId);
        updateSession(sessionId, { lastWhisper: "You're live on air." });

        send(socket, {
          type: "session.update",
          session: {
            system_prompt: STUDIO_AGENT_PROMPT,
            greeting: "Connected. You're live, let's go.",
            tools: AGENT_TOOLS,
          },
        });

        startMicStreaming(socket, stream);
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("[AirCheck WS]", msg.type, msg);
        handleMessage(socket, msg);
      };

      socket.onclose = cutBroadcast;
    } catch (err: any) {
      console.error("Failed to go on air:", err);
      cutBroadcast();
      setActiveSession(null);
      updateSession(sessionId, {
        lastWhisper: `Connection error: ${err.message}`,
      });
    }
  }, [
    sessionId,
    updateSession,
    setActiveSession,
    cutBroadcast,
    startMicStreaming,
    handleMessage,
  ]);

  useEffect(() => cutBroadcast, [cutBroadcast]);

  return { goOnAir, cutBroadcast, isConnecting, activePad, triggerPad };
}
