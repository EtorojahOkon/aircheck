"use client";

import { BookmarkCheck, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChapterItem } from "@/types/studio";

interface ChapterTimelineProps {
  chapters: ChapterItem[];
}

export function ChapterTimeline({ chapters }: ChapterTimelineProps) {
  return (
    <div className="rounded-3xl  bg-zinc-900/40 backdrop-blur-xl p-5 flex flex-col h-full min-h-[280px]">
      <div className="flex items-center justify-between mb-4 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white flex items-center justify-center font-bold ">
            <BookmarkCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              Session Chapters
            </h3>
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="flex-1 min-h-0">
        {chapters.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-zinc-500">
            <Clock className="h-8 w-8 stroke-1 mb-2 text-zinc-600" />
            <p className="text-xs text-zinc-300 font-medium">
              No chapter markers yet
            </p>
            <p className="text-[11px] text-zinc-500">
              Topic markers appear when you transition segments
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[180px]">
            <div className="space-y-2.5 pr-2">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-6 w-6 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center font-mono text-[11px] text-zinc-400 font-bold shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {chapter.title}
                    </span>
                  </div>

                  <span className="font-mono text-xs px-2 ml-2">
                    {chapter.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
