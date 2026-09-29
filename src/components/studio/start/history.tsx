"use client";

import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  FolderClock,
  Trash2,
  Radio,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStudioStore } from "@/store/studio-store";
import { StudioSession } from "@/types/studio";
import { formatSessionDate } from "@/lib/utils";

export interface SessionHistoryItem {
  id: string;
  name: string;
  date: string;
  factsCount: number;
  chaptersCount: number;
}

export function RecentSessions() {
  const { sessions, deleteSession } = useStudioStore();

  const studioSessions = Object.values(sessions).reverse() as StudioSession[];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground font-bold">
            <FolderClock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Recent Sessions
            </h2>
            <p className="text-sm text-muted-foreground">
              Continue a previous recording or review generated notes
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
          {studioSessions.length > 0 &&
            `${studioSessions.length} Saved Session${
              studioSessions.length > 1 ? "s" : ""
            }`}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studioSessions.length > 0 ? (
          studioSessions.map((session: StudioSession) => (
            <Card
              key={session.id}
              className="rounded-3xl bg-card transition-all group flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-bold text-base transition-colors truncate">
                      {session.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatSessionDate(session.createdAt)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteSession(session.id);
                    }}
                    className="text-muted-foreground/50 cursor-pointer hover:text-destructive transition-colors p-1 rounded-lg hover:bg-destructive/10"
                    title="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Telemetry Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-xs bg-emerald-500/10 border-emerald-500/20 text-emerald-500 gap-1 font-medium"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {session.facts.length} Facts
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full px-2.5 py-0.5 text-xs bg-studio-amber/10 border-studio-amber/30 text-studio-amber-foreground dark:text-studio-amber gap-1 font-medium"
                  >
                    <Bookmark className="h-3 w-3" />
                    {session.chapters.length} Chapters
                  </Badge>
                  {session.hasRecording && (
                    <Badge
                      variant="outline"
                      className="rounded-full px-2.5 py-0.5 text-xs bg-indigo-500/10 border-indigo-500/20 text-indigo-400 gap-1 font-medium"
                    >
                      <Radio className="h-3 w-3" />
                      Recorded
                    </Badge>
                  )}
                </div>

                {/* Action Link */}
                <div className="pt-2">
                  <Link
                    href={`/studio/${session.id}`}
                    className={buttonVariants({
                      variant: "secondary",
                      className:
                        "w-full rounded-2xl font-semibold text-xs justify-between group/btn hover:bg-primary hover:text-primary-foreground transition-all",
                    })}
                  >
                    <span>Re-Enter Studio Control</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="rounded-3xl bg-card/50 p-8 md:p-12 text-center relative overflow-hidden">
              <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-secondary/80 border border-border/60 flex items-center justify-center text-muted-foreground shadow-inner">
                  <Radio className="h-8 w-8 stroke-1 text-primary animate-pulse" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-lg tracking-tight text-foreground">
                    No studio sessions yet
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start your first broadcast above to unlock real-time fact
                    checking, audio timeline chapters, and soundboard cues.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
