"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { playSound } from "@/lib/soundboard";
import { useStudioStore } from "@/store/studio-store";
import { getStudioAgentPrompt } from "@/lib/ai/prompts";
import { set as idbSet } from "idb-keyval";
import {
  MAX_BUFFER_AHEAD_S,
  MIC_SAMPLE_RATE,
  PLAYBACK_SAMPLE_RATE,
  createAudioContext,
  decodePcm16Base64,
  encodePcm16Base64,
} from "../lib/ai/audio";
import { getAgentTools, SFX_EFFECTS } from "../lib/ai/tools";
import { TranscriptEntry } from "@/types/studio";

const WS_URL = "wss://agents.assemblyai.com/v1/ws";
const PAD_HIGHLIGHT_MS = 600;


type ToolArgs = Record<string, any>;

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
  const recorder = useRef<MediaRecorder | null>(null);
  const recordingChunks = useRef<Blob[]>([]);

  // Playback
  const playCtx = useRef<AudioContext | null>(null);
  const nextPlayTime = useRef(0);
  const mixDestination = useRef<MediaStreamAudioDestinationNode | null>(null);
  const micToMixNode = useRef<MediaStreamAudioSourceNode | null>(null);

  // Debounce map for client-side keyword SFX — prevents re-firing within cooldown window
  const recentlyTriggeredKeywords = useRef<Map<string, number>>(new Map());

  const getSession = () => useStudioStore.getState().sessions[sessionId];

  // ---------------------------------------------------------------- teardown

  const cutBroadcast = useCallback(() => {
    // Stop recorder and save recording URL to session
    if (recorder.current && recorder.current.state !== "inactive") {
      const rec = recorder.current;
      const actualMimeType = rec.mimeType || "audio/webm";
      rec.onstop = () => {
        if (recordingChunks.current.length > 0) {
          const blob = new Blob(recordingChunks.current, { type: actualMimeType });
          const url = URL.createObjectURL(blob);
          useStudioStore.getState().updateSession(sessionId, { recordingUrl: url, hasRecording: true });
          idbSet(`recording_${sessionId}`, blob).catch(console.error);
        }
        recordingChunks.current = [];
      };
      try {
        rec.stop();
      } catch (err) {
        console.warn("[MediaRecorder] Stop error:", err);
      }
    }
    recorder.current = null;

    ws.current?.close();
    micStream.current?.getTracks().forEach((track) => track.stop());
    micProcessor.current?.disconnect();
    micSource.current?.disconnect();
    micToMixNode.current?.disconnect();
    micCtx.current?.close();
    playCtx.current?.close();

    ws.current = null;
    micStream.current = null;
    micProcessor.current = null;
    micSource.current = null;
    micToMixNode.current = null;
    micCtx.current = null;
    playCtx.current = null;
    mixDestination.current = null;

    setIsConnecting(false);
  }, [sessionId]);

  // ------------------------------------------------------------------- tools

  const triggerPad = useCallback((effect: string) => {
    playSound(effect);
    setActivePad(effect);
    setTimeout(() => setActivePad(null), PAD_HIGHLIGHT_MS);
  }, []);

  /**
   * Client-side keyword spotter — fires SFX immediately from the transcript
   * without waiting for an LLM tool.call round-trip.
   * Checks the pad's triggerKeyword first, then falls back to the pad key itself.
   */
  const checkKeywordTriggers = useCallback(
    (text: string) => {
      const settings = useStudioStore.getState().settings;
      const pads = settings?.soundboardPads;
      const now = Date.now();
      const COOLDOWN_MS = 4000;

      // Expire stale cooldowns
      recentlyTriggeredKeywords.current.forEach((ts, key) => {
        if (now - ts > COOLDOWN_MS) recentlyTriggeredKeywords.current.delete(key);
      });

      // Build a list of { key, keywords[] } — custom pads or defaults
      const effectivePads =
        pads && pads.length > 0
          ? pads.map((p) => ({
              key: p.key,
              keywords: [p.triggerKeyword, p.key].filter(Boolean) as string[],
            }))
          : SFX_EFFECTS.map((e) => ({ key: e, keywords: [e] }));

      const lower = text.toLowerCase();
      for (const { key, keywords } of effectivePads) {
        if (recentlyTriggeredKeywords.current.has(key)) continue;
        if (keywords.some((k) => lower.includes(k.toLowerCase()))) {
          recentlyTriggeredKeywords.current.set(key, now);
          triggerPad(key);
          return; // one sound at a time
        }
      }
    },
    [triggerPad],
  );

  /** Runs a tool call and returns the result object to send back to the agent. */
  const runTool = useCallback(
    (name: string, args: ToolArgs): object => {
      const timestamp = new Date().toLocaleTimeString();
      const currentSession = useStudioStore.getState().sessions[sessionId];
      const existingFacts = currentSession?.facts || [];
      const existingChapters = currentSession?.chapters || [];

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
              ...existingFacts,
            ],
            lastWhisper: args.fact,
          });
          return { status: "displayed", fact: args.fact };

        case "add_chapter_marker":
          updateSession(sessionId, {
            chapters: [
              ...existingChapters,
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
    if (mixDestination.current) {
      node.connect(mixDestination.current);
    }

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
    (socket: WebSocket, stream: MediaStream, mixStream: MediaStream) => {
      const ctx = createAudioContext(MIC_SAMPLE_RATE);
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(2048, 1, 1); // 2048 → ~128 ms chunks (was 4096 / ~256 ms)

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

      // Start MediaRecorder for post-session playback
      recordingChunks.current = [];
      let mimeType = "";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }
      }

      try {
        const rec = mimeType
          ? new MediaRecorder(mixStream, { mimeType })
          : new MediaRecorder(mixStream);
        rec.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordingChunks.current.push(e.data);
        };
        rec.start(1000);
        recorder.current = rec;
      } catch (err) {
        console.warn("[MediaRecorder] Failed to start recorder:", err);
      }
    },
    [],
  );

  // ---------------------------------------------------------------- messages



  const handleMessage = useCallback(
    (socket: WebSocket, msg: any) => {
      switch (msg.type) {
        case "reply.audio": {
          const audio = msg.audio ?? msg.data;
          if (audio) playReplyAudio(audio);
          break;
        }

        case "tool.call": {
          const { call_id, name, arguments: args } = msg;
          const result = runTool(name, args);
          // Send immediately — no need to wait for reply.done
          send(socket, { type: "tool.result", call_id, result: JSON.stringify(result) });
          break;
        }

        case "reply.done":
          // Tool results are sent immediately on tool.call; nothing to flush here
          break;

        case "session.error":
        case "error": {
          console.error("[AirCheck WS Error]", msg);
          const errMsg = msg.message || msg.error || JSON.stringify(msg);
          updateSession(sessionId, { lastWhisper: `Agent error: ${errMsg}` });
          break;
        }

        default:
          if (typeof msg.type === "string" && msg.type.includes("transcript") && !msg.type.includes("delta")) {
            const text = msg.text || msg.transcript;
            if (!text) break;
            const speaker: TranscriptEntry["speaker"] =
              msg.type.includes("user") || msg.type === "transcript" ? "host" : "agent";

            // Client-side keyword spotter: fire SFX instantly without LLM round-trip
            if (speaker === "host") {
              checkKeywordTriggers(text);
            }

            // Single atomic write: lastWhisper + transcript entry together
            const entry: TranscriptEntry = {
              id: Date.now(),
              speaker,
              text,
              timestamp: new Date().toLocaleTimeString(),
            };
            useStudioStore.setState((state) => {
              const session = state.sessions[sessionId];
              if (!session) return state;
              return {
                sessions: {
                  ...state.sessions,
                  [sessionId]: {
                    ...session,
                    lastWhisper: text,
                    transcript: [...session.transcript, entry],
                    updatedAt: new Date().toISOString(),
                  },
                },
              };
            });
          }
      }
    },
    [sessionId, playReplyAudio, runTool, checkKeywordTriggers],
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

      const dest = playback.createMediaStreamDestination();
      mixDestination.current = dest;

      const micToMix = playback.createMediaStreamSource(stream);
      micToMix.connect(dest);
      micToMixNode.current = micToMix;

      const socket = new WebSocket(`${WS_URL}?token=${token}`);
      ws.current = socket;

      socket.onopen = () => {
        setIsConnecting(false);
        setActiveSession(sessionId);
        updateSession(sessionId, { lastWhisper: "You're live on air." });

        const session = useStudioStore.getState().sessions[sessionId];
        const settings = useStudioStore.getState().settings;
        const systemPrompt = getStudioAgentPrompt({
          agentName: settings?.agentName,
          personality: session?.personality || settings?.personality,
          guests: session?.guests,
          guestName: session?.guestName,
          guestBio: session?.guestBio,
          outline: session?.outline,
          pads: settings?.soundboardPads,
        });
        const tools = getAgentTools(settings?.soundboardPads);

        const rawVoiceId = (
          session?.voice ||
          settings?.defaultVoice ||
          "ivy"
        ).toLowerCase();
        const validVoices = new Set([
          "ivy",
          "alba",
          "anna",
          "james",
          "sophie",
          "diego",
          "arjun",
        ]);
        const voiceId = validVoices.has(rawVoiceId) ? rawVoiceId : "ivy";

        send(socket, {
          type: "session.update",
          session: {
            system_prompt: systemPrompt,
            greeting: "Connected. You're live, let's go.",
            output: { voice: voiceId },
            tools,
          },
        });

        socket.onerror = (err) => console.error("[AirCheck WS]", err);

        startMicStreaming(socket, stream, dest.stream);
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
