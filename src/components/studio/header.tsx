"use client";

import { useState } from "react";
import { Radio, RadioTower, FileDown, Volume2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EndSessionModal } from "@/components/studio/end-session";

interface StudioHeaderProps {
  sessionTitle: string;
  isOnAir: boolean;
  elapsedTime: string;
  onToggleOnAir: () => void;
  onOpenExport: () => void;
  isConnecting?: boolean;
}

export function StudioHeader({
  sessionTitle,
  isOnAir,
  elapsedTime,
  onToggleOnAir,
  onOpenExport,
  onEndSession,
  isConnecting,
}: StudioHeaderProps & { onEndSession?: () => void }) {
  const [showEndModal, setShowEndModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/85  px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Hub Navigation & Session Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEndModal(true)}
              className="flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="h-9 w-9 rounded-2xl bg-secondary group-hover:bg-secondary/80 flex items-center justify-center transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-studio-violet flex items-center justify-center text-white shadow-xs">
                <Radio className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-tight text-foreground line-clamp-1 max-w-[180px] sm:max-w-xs md:max-w-sm">
                    {sessionTitle}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-all ${
                    isOnAir
                      ? "bg-red-500/15 border-red-500/40 text-red-500 animate-live-pulse"
                      : "bg-secondary text-muted-foreground border-border/60"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                      isOnAir
                        ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                        : "bg-muted-foreground/60"
                    }`}
                  />
                  {isOnAir ? "ON AIR" : "STANDBY"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Center: Monospace Master Broadcast Clock */}
          <div className="flex items-center gap-2 bg-card border border-border/70 px-3.5 py-1.5 rounded-2xl shadow-xs">
            <RadioTower
              className={`h-4 w-4 ${
                isOnAir ? "text-primary animate-pulse" : "text-muted-foreground"
              }`}
            />
            <span className="text-[11px] uppercase font-mono text-muted-foreground tracking-wider hidden xs:inline">
              REC
            </span>
            <span className="font-mono-numbers font-mono text-base sm:text-lg font-bold tracking-wider text-studio-amber-foreground dark:text-studio-amber">
              {elapsedTime}
            </span>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* Export Show Notes Button */}
            <Button
              variant="outline"
              onClick={onOpenExport}
              className="rounded-2xl border-border/60 bg-card hover:bg-secondary text-xs sm:text-sm font-semibold gap-1.5 px-3 sm:px-4 shadow-xs"
            >
              <FileDown className="h-4 w-4 text-studio-amber-foreground dark:text-studio-amber" />
              <span className="hidden sm:inline">Export Notes</span>
            </Button>

            {/* Primary Action Button: Go On Air / Cut Broadcast */}
            <Button
              onClick={onToggleOnAir}
              disabled={isConnecting}
              className={`rounded-full font-bold text-xs sm:text-sm px-4 sm:px-6 shadow-sm transition-all gap-2 ${
                isOnAir
                  ? "bg-card hover:bg-secondary text-red-500 border border-red-500/40"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              <Volume2 className="h-4 w-4" />
              {isConnecting
                ? "Connecting..."
                : isOnAir
                  ? "Cut Broadcast"
                  : "Go On Air"}
            </Button>
          </div>
        </div>
      </header>

      <EndSessionModal
        open={showEndModal}
        onOpenChange={setShowEndModal}
        onConfirm={() => onEndSession?.()}
      />
    </>
  );
}
