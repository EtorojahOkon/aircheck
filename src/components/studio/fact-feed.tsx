"use client";

import { CheckCircle2, Search, Bookmark } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FactItem } from "@/types/studio";

interface FactCheckFeedProps {
  facts: FactItem[];
  onPinFact?: (fact: FactItem) => void;
}

export function FactCheckFeed({ facts, onPinFact }: FactCheckFeedProps) {
  return (
    <Card className="rounded-3xl bg-zinc-900/40 h-[340px] ring-0 flex flex-col">
      <CardHeader className="p-5  pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-black flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-white flex items-center gap-2">
                Live Fact Feed
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 min-h-0">
        {facts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <Search className="h-10 w-10 stroke-1 mb-3 text-zinc-600" />
            <h4 className="font-bold text-sm text-zinc-200 mb-1">
              Listening for factual queries...
            </h4>
            <p className="text-xs text-zinc-400 max-w-[220px]">
              Ask &ldquo;When did Voyager 1 launch?&rdquo; or wonder about
              numbers and Jamie will whisper the answer.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[300px] p-5">
            <div className="space-y-3.5 pr-2">
              {facts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10 hover:shadow-lg hover:border-white/10 group"
                >
                  {/* Query Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-zinc-200 leading-snug">
                      Q: &ldquo;{item.query}&rdquo;
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400 whitespace-nowrap bg-black/50 border border-white/10 px-2 py-0.5 rounded-full">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Verified Answer */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 mb-2.5 shadow-inner">
                    <p className="text-xs sm:text-sm font-bold text-zinc-300 leading-relaxed">
                      {item.fact}
                    </p>
                  </div>

                  {/* Source & Actions */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="truncate max-w-[170px]">
                        {item.source || "AssemblyAI Verified"}
                      </span>
                    </div>

                    <button
                      onClick={() => onPinFact?.(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white p-1 rounded-lg hover:bg-white/10 text-zinc-400"
                      title="Save to show notes"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
