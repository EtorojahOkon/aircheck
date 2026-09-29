"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, Download, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingPlayerProps {
  recordingUrl: string;
  sessionName: string;
}

export function RecordingPlayer({ recordingUrl, sessionName }: RecordingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  // WebM duration handling — safely determine duration without trapping currentTime at the end
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    setCurrentTime(0);
    setPlaying(false);

    const onMeta = () => {
      if (isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
      } else {
        // Temporarily seek to end to read duration for streaming webm, then seek back to 0
        const onSeeked = () => {
          if (isFinite(el.duration) && el.duration > 0) {
            setDuration(el.duration);
          }
          el.currentTime = 0;
          el.removeEventListener("seeked", onSeeked);
        };
        el.addEventListener("seeked", onSeeked, { once: true });
        el.currentTime = 1e10;
      }
    };

    const onDurationChange = () => {
      if (isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
      }
    };

    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onDurationChange);

    return () => {
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onDurationChange);
    };
  }, [recordingUrl]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;

    if (playing && !el.paused) {
      el.pause();
      setPlaying(false);
    } else {
      if (el.ended || (duration && el.currentTime >= duration - 0.2)) {
        el.currentTime = 0;
      }
      try {
        await el.play();
        setPlaying(true);
      } catch (err) {
        console.error("[RecordingPlayer] Playback error:", err);
        setPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = recordingUrl;
    a.download = `${sessionName.replace(/\s+/g, "-").toLowerCase()}-recording.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-3xl bg-zinc-900/40 p-5 md:p-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-tight text-white">
              Session Recording
            </h3>
            <p className="text-xs text-zinc-500 truncate max-w-[180px]">{sessionName}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="h-8 text-xs rounded-full border-border/60 bg-card hover:bg-secondary text-foreground gap-1.5 px-3"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>

      {/* Waveform / progress bar */}
      <div
        className="h-2 rounded-full bg-white/10 cursor-pointer overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={toggle}
          className="h-11 w-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-colors shadow-lg"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        <span className="text-xs font-mono text-zinc-400">
          {formatTime(currentTime)}{duration ? ` / ${formatTime(duration)}` : ""}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={recordingUrl}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={handleEnded}
        preload="auto"
        className="hidden"
      />
    </div>
  );
}
