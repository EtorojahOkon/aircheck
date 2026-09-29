"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollText, Mic, Cpu, Download, Copy, Check } from "lucide-react";
import { TranscriptEntry } from "@/types/studio";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/store/studio-store";

interface TranscriptCardProps {
  transcript: TranscriptEntry[];
  isOnAir: boolean;
  sessionName?: string;
}

export function TranscriptCard({
  transcript,
  isOnAir,
  sessionName = "session",
}: TranscriptCardProps) {
  const { settings } = useStudioStore();
  const agentName = settings?.agentName || "Producer";
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript.length]);

  const generateTranscriptText = () => {
    if (transcript.length === 0) return "No transcript recorded for this session.";
    const header = `Transcript: ${sessionName}\nProducer: ${agentName}\nExported: ${new Date().toLocaleString()}\n${"-".repeat(40)}\n\n`;
    const agentSpeakerTag = agentName.toUpperCase();
    return (
      header +
      transcript
        .map(
          (e) =>
            `[${e.timestamp}] ${e.speaker === "host" ? "HOST" : agentSpeakerTag}: ${e.text}`
        )
        .join("\n\n")
    );
  };

  const handleCopy = () => {
    if (transcript.length === 0 || typeof navigator === "undefined") return;
    navigator.clipboard.writeText(generateTranscriptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (transcript.length === 0 || typeof window === "undefined") return;
    const content = generateTranscriptText();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const filename = `${sessionName.replace(/\s+/g, "-").toLowerCase()}-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl bg-zinc-900/40 p-5 md:p-8 space-y-4 flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-white">
              Live Transcript
            </h3>
            <p className="text-xs text-zinc-500">Session conversation log</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOnAir && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}

          {transcript.length > 0 && (
            <>
              <Button
                variant="outline"
                size="xs"
                onClick={handleCopy}
                className="h-7 text-[11px] rounded-full border-border/60 bg-white/5 hover:bg-white/10 text-zinc-300 gap-1 px-2.5"
                title="Copy Transcript"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={handleDownload}
                className="h-7 text-[11px] rounded-full border-border/60 bg-white/5 hover:bg-white/10 text-zinc-300 gap-1 px-2.5"
                title="Export Transcript (.txt)"
              >
                <Download className="h-3 w-3 text-zinc-400" />
                <span>Export .txt</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 backdrop-blur-sm overflow-y-auto max-h-[280px] min-h-[120px] flex flex-col">
        {transcript.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-xs text-zinc-600 italic">
              {isOnAir ? "Listening…" : "Transcript will appear here when you go live."}
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2.5">
            {transcript.map((entry) => (
              <div key={entry.id} className="flex gap-2.5 items-start group">
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    entry.speaker === "host"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-violet-500/20 text-violet-400"
                  }`}
                >
                  {entry.speaker === "host" ? (
                    <Mic className="h-3 w-3" />
                  ) : (
                    <Cpu className="h-3 w-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        entry.speaker === "host" ? "text-blue-400" : "text-violet-400"
                      }`}
                    >
                      {entry.speaker === "host" ? "Host" : agentName}
                    </span>
                    <span className="text-[10px] text-zinc-600 font-mono">
                      {entry.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-snug break-words">
                    {entry.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}
