"use client";

import { useState, useEffect } from "react";
import { useParams, redirect, useRouter } from "next/navigation";
import { StudioHeader } from "@/components/studio/header";
import { TranscriptCard } from "@/components/studio/transcript-card";
import { RecordingPlayer } from "@/components/studio/recording-player";
import { FactCheckFeed } from "@/components/studio/fact-feed";
import { SoundboardPad } from "@/components/studio/soundboard-pad";
import { ChapterTimeline } from "@/components/studio/chapter-feed";
import { EpisodeExportModal } from "@/components/studio/export";
import { StudioSettingsModal } from "@/components/studio/settings/studio-settings-modal";
import { PreSessionBriefingModal } from "@/components/studio/pre-session/briefing-modal";
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
    activeSessionId,
    _hasHydrated,
    updateSession,
  } = useStudioStore();

  const [exportOpen, setExportOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);
  const [justCutBroadcast, setJustCutBroadcast] = useState(false);

  const sessionId = params.id as string;
  const session = Object.values(sessions).find((s) => s.id === sessionId);
  const isActiveSession = activeSessionId === sessionId;

  const { goOnAir, cutBroadcast, isConnecting } = useVoiceAgent(sessionId);

  // Automatically open briefing modal once navigated to if not live yet
  useEffect(() => {
    if (
      _hasHydrated &&
      session &&
      !session.briefingCompleted &&
      !isActiveSession
    ) {
      setBriefingOpen(true);
    }
  }, [_hasHydrated, session, isActiveSession]);

  useEffect(() => {
    // Only try to fetch if we KNOW it has a recording but missing URL
    if (
      _hasHydrated &&
      session &&
      session.hasRecording &&
      !session.recordingUrl &&
      !isActiveSession
    ) {
      import("idb-keyval").then(({ get }) => {
        get(`recording_${session.id}`).then((blob) => {
          if (blob) {
            updateSession(session.id, {
              recordingUrl: URL.createObjectURL(blob),
            });
          }
        });
      });
    }
  }, [
    _hasHydrated,
    session?.id,
    session?.recordingUrl,
    session?.hasRecording,
    isActiveSession,
    updateSession,
  ]);

  // Show the "Recording saved" banner only once the URL is actually ready
  useEffect(() => {
    if (justCutBroadcast && session?.recordingUrl) {
      setJustCutBroadcast(false);
      setSavedNotification(true);
      const t = setTimeout(() => setSavedNotification(false), 6000);
      return () => clearTimeout(t);
    }
  }, [justCutBroadcast, session?.recordingUrl]);

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
      setJustCutBroadcast(true);
      return;
    }

    if (!session.briefingCompleted) {
      setBriefingOpen(true);
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
        createdAt={session.createdAt}
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
            <TranscriptCard
              transcript={session.transcript ?? []}
              isOnAir={isActiveSession}
              sessionName={session.name}
            />
          </section>

          <div className="lg:col-span-8 flex flex-col gap-6 order-1 lg:order-2">
            {savedNotification && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-sm">
                  Recording saved! Scroll down to listen to playback.
                </span>
              </div>
            )}
            {/* Center Stage: Soundboard */}
            <SoundboardPad onOpenSettings={() => setSettingsOpen(true)} />
            {/* Bottom Section: Chapter Timeline */}
            <div className="w-full">
              <ChapterTimeline chapters={session.chapters} />
            </div>
            {/* Post-session recording playback */}
            {!isActiveSession && session.recordingUrl && (
              <RecordingPlayer
                recordingUrl={session.recordingUrl}
                sessionName={session.name}
              />
            )}
          </div>
        </div>
      </main>

      {/* Pre-Session Briefing Modal */}
      <PreSessionBriefingModal
        key={`${session.id}-${briefingOpen}`}
        open={briefingOpen}
        onOpenChange={setBriefingOpen}
        session={session}
        onGoLive={async () => {
          await goOnAir();
        }}
      />

      {/* Show Notes Export Dialog */}
      <EpisodeExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        facts={session.facts}
        chapters={session.chapters}
        transcript={session.transcript ?? []}
        elapsedTime={calculateElapsedTime(session.createdAt)}
        recordingUrl={session.recordingUrl}
        sessionName={session.name}
      />

      {/* Studio Global Settings Modal */}
      <StudioSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
