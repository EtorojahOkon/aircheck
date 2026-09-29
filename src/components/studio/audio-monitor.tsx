"use client";

import { Headphones, Mic, Cpu } from "lucide-react";

interface AudioMonitorProps {
  isOnAir: boolean;
  lastWhisper: string | null;
}

export function AudioMonitor({ lastWhisper }: AudioMonitorProps) {
  return (
    <div className="rounded-3xl  bg-zinc-900/40 p-5 md:p-8 space-y-6">
      {/* Top Monitor Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center font-bold">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight text-white">
                Live Studio Master Monitor
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2"></div>
      </div>

      {/* In-Ear Producer Whisper Speech Box */}
      <div className="rounded-2xl bg-white/5 p-5 space-y-3 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Cpu className="h-3.5 w-3.5 text-violet-400" />
            <span>Voice Agent</span>
          </div>
        </div>

        <p className="text-sm md:text-base italic text-zinc-200 font-medium leading-relaxed pl-3.5 border-l-2 border-violet-500">
          {lastWhisper}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Mic className="h-3.5 w-3.5" />
            Microphone clean
          </span>
        </div>
      </div>
    </div>
  );
}
