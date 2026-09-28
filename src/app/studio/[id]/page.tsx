"use client";

import { useState } from "react";
import { useParams, redirect, useRouter } from "next/navigation";
import { StudioHeader } from "@/components/studio/header";
import { AudioMonitor } from "@/components/studio/audio-monitor";
import { FactCheckFeed } from "@/components/studio/fact-feed";
import { SoundboardPad } from "@/components/studio/soundboard-pad";
import { ChapterTimeline } from "@/components/studio/chapter-feed";
import { EpisodeExportModal } from "@/components/studio/export";
import { PageLoader } from "@/components/ui/page-loader";
import { useStudioStore } from "@/store/studio-store";
import { calculateElapsedTime } from "@/lib/utils";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";

export default function StudioSessionPage() {
  const params = useParams();
  const router = useRouter();
  const {
    sessions,
    setActiveSession,
    updateSession,
    activeSessionId,
    _hasHydrated,
  } = useStudioStore();

  const [exportOpen, setExportOpen] = useState(false);

  const sessionId = params.id as string;
  const session = Object.values(sessions).find((s) => s.id === sessionId);
  const isActiveSession = activeSessionId === sessionId;

  const { goOnAir, cutBroadcast, isConnecting } = useVoiceAgent(sessionId);

  if (!_hasHydrated) {
    return <PageLoader />;
  }

  if (!session) {
    redirect("/studio");
  }

  const handleToggleOnAir = async () => {
    if (isActiveSession) {
      cutBroadcast();
      setActiveSession(null);
      return;
    }
    await goOnAir();
  };

  const handleEndSession = () => {
    cutBroadcast();
    setActiveSession(null);
    router.push("/studio");
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Studio Header */}
      <StudioHeader
        sessionTitle={session.name}
        isOnAir={isActiveSession}
        isConnecting={isConnecting}
        elapsedTime={calculateElapsedTime(session.createdAt)}
        onToggleOnAir={handleToggleOnAir}
        onOpenExport={() => setExportOpen(true)}
        onEndSession={handleEndSession}
      />

      {/* Main Studio Control Room Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Control Tools & Fact Check Feed (4 cols on lg) */}
          <section className="lg:col-span-4 order-2 lg:order-1 h-full flex flex-col gap-6">
            <FactCheckFeed facts={session.facts} />
            <AudioMonitor
              isOnAir={isActiveSession}
              lastWhisper={session.lastWhisper}
            />
          </section>

          {/* Center & Right Area (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
            {/* Center Stage: Soundboard */}
            <SoundboardPad />
            {/* Bottom Section: Chapter Timeline */}
            <div className="w-full">
              <ChapterTimeline chapters={session.chapters} />
            </div>
          </div>
        </div>
      </main>

      {/* Show Notes Export Dialog */}
      <EpisodeExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        facts={session.facts}
        chapters={session.chapters}
        elapsedTime={calculateElapsedTime(session.createdAt)}
      />
    </div>
  );
}
