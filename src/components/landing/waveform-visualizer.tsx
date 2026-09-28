"use client";

import { TONE_PROFILES, TOTAL_BARS } from "@/lib/soundboard";

interface AudioWaveformVisualizerProps {
  isPlaying: boolean;
  activeKey: string | null;
}

export function AudioWaveformVisualizer({
  isPlaying,
  activeKey,
}: AudioWaveformVisualizerProps) {
  const profile = activeKey ? TONE_PROFILES[activeKey] : TONE_PROFILES.rimshot;

  return (
    <div className="w-full h-32 flex items-center justify-between gap-[3px] py-4 select-none">
      {Array.from({ length: TOTAL_BARS }).map((_, i) => {
        const peakHeight = profile[i] ?? 4;
        const staggerDelay = isPlaying ? `${(i * 7) % 180}ms` : "0ms";
        const height = isPlaying ? `${Math.max(6, peakHeight)}%` : "3px";

        return (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              isPlaying
                ? "bg-gradient-to-t from-primary/60 via-primary to-primary/60 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                : "bg-zinc-800 opacity-60"
            }`}
            style={{
              height,
              minWidth: "2px",
              maxWidth: "6px",
              transition: isPlaying
                ? `height 350ms cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}, background-color 200ms ease, box-shadow 300ms ease`
                : "height 400ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms ease, box-shadow 300ms ease",
            }}
          />
        );
      })}
    </div>
  );
}
