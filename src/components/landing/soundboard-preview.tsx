"use client";

import { useState, useRef } from "react";
import { Volume2 } from "lucide-react";
import { playDemoSound, SoundTone, TONES } from "@/lib/soundboard";
import { AudioWaveformVisualizer } from "./waveform-visualizer";

export function SoundboardPreview() {
  const [activeTone, setActiveTone] = useState<SoundTone | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTone = (tone: SoundTone) => {
    setActiveTone(tone);
    setIsPlaying(true);
    playDemoSound(tone.key);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsPlaying(false);
      setActiveTone(null);
    }, 950);
  };

  return (
    <section
      id="soundboard"
      className="py-24 md:py-32 bg-black relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-studio-violet/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Title, Description, and Reactive Flat-to-Wave Visualizer */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                A soundboard that plays itself.
              </h2>

              <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
                No more fumbling for physical buttons while you host. AirCheck
                analyzes your speech context live and drops the exact right tone
                at the right second.
              </p>
            </div>

            {/* Flat by default, comes alive with tone-specific wave contours */}
            <AudioWaveformVisualizer
              isPlaying={isPlaying}
              activeKey={activeTone?.key || null}
            />
          </div>

          {/* Right Column: Distinct Tone Cards Grid */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-4">
              {TONES.map((tone) => {
                const isActive = activeTone?.key === tone.key;
                return (
                  <button
                    key={tone.key}
                    onClick={() => triggerTone(tone)}
                    className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 select-none ${
                      isActive
                        ? "bg-zinc-900 border-primary shadow-xl scale-[0.98]"
                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/90 active:scale-[0.98]"
                    }`}
                  >
                    {/* Top Row: Icon, Label, and Hotkey / Volume Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110 duration-200">
                          {tone.icon}
                        </span>
                        <div>
                          <h3
                            className={`font-bold text-base transition-colors ${isActive ? "text-white" : "text-zinc-100 group-hover:text-white"}`}
                          >
                            {tone.label}
                          </h3>
                          <span
                            className={`text-xs font-medium ${tone.accent}`}
                          >
                            {tone.tagline}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <Volume2
                            className={`h-4 w-4 ${tone.accent} animate-bounce`}
                          />
                        ) : (
                          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">
                            {tone.hotkey}
                          </kbd>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {tone.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
