import { StartHeader } from "@/components/studio/start/header";
import { SessionForm } from "@/components/studio/start/form";
import { RecentSessions } from "@/components/studio/start/history";

export default function StudioLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <StartHeader />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 space-y-16">
        <SessionForm />
        <RecentSessions />
      </main>
    </div>
  );
}
