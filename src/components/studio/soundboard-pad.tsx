"use client";

import { useState, useEffect, useCallback } from "react";
import { Volume2, Sliders, Music } from "lucide-react";
import { SoundPad, playSound } from "@/lib/soundboard";
import { useStudioStore } from "@/store/studio-store";

interface SoundboardPadProps {
  onOpenSettings?: () => void;
}

export function SoundboardPad({ onOpenSettings }: SoundboardPadProps) {
  const [activePad, setActivePad] = useState<string | null>(null);
  const settings = useStudioStore((state) => state.settings);
  const pads: SoundPad[] = settings?.soundboardPads || [];

  const handlePadClick = useCallback((pad: SoundPad) => {
    playSound(pad.soundUrl || pad.key);
    setActivePad(pad.key);
    setTimeout(() => {
      setActivePad(null);
    }, 700);
  }, []);

  // Global keyboard hotkey listener for soundboard pads
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in form controls
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      const pressedKey = e.key.toLowerCase();
      const matchedPad = pads.find(
        (p) => p.hotkey && p.hotkey.toLowerCase() === pressedKey,
      );

      if (matchedPad) {
        e.preventDefault();
        handlePadClick(matchedPad);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pads, handlePadClick]);

  return (
    <div className="rounded-3xl bg-zinc-900/40 p-5 space-y-5 border border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Studio Soundboard
            </h3>
            <p className="text-xs text-zinc-400">
              Trigger via hotkey or voice cues
            </p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            Manage Pads
          </button>
        )}
      </div>

      {/* Responsive Soundboard Pads */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pads.map((pad) => {
          const isActive = activePad === pad.key;
          return (
            <button
              key={pad.id || pad.key}
              onClick={() => handlePadClick(pad)}
              className={`relative text-left p-4 rounded-2xl border transition-all duration-150 select-none flex flex-col justify-between min-h-[96px] group ${
                isActive
                  ? "border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-[0.98]"
                  : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 active:scale-[0.97]"
              }`}
            >
              {/* Header row: Icon & Hotkey */}
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl transition-transform group-hover:scale-110 duration-150 filter drop-shadow-md">
                  {pad.icon || <Music className="h-5 w-5 text-amber-400" />}
                </span>
                <kbd
                  className={`px-2 py-0.5 text-[10px] font-mono rounded-full border transition-colors ${
                    isActive
                      ? "bg-amber-500 text-black border-amber-500"
                      : "bg-black/50 border-white/10 text-zinc-500"
                  }`}
                >
                  {pad.hotkey}
                </kbd>
              </div>

              {/* Pad Label & Subtitle */}
              <div className="mt-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-xs sm:text-sm tracking-tight transition-colors ${
                      isActive ? "text-amber-400" : "text-zinc-200"
                    }`}
                  >
                    {pad.label}
                  </span>
                  {isActive && (
                    <Volume2 className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium block truncate ${
                    isActive ? "text-amber-500/80" : "text-zinc-500"
                  }`}
                >
                  {pad.tagline || pad.triggerKeyword || "Audio FX"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
