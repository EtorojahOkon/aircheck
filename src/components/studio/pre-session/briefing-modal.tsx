"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStudioStore } from "@/store/studio-store";
import { PersonalityPreset, StudioSession, GuestInfo } from "@/types/studio";
import {
  Radio,
  Users,
  Bot,
  FileText,
  Upload,
  Volume2,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { VOICE_OPTIONS, PERSONALITY_OPTIONS } from "@/lib/studio";

interface PreSessionBriefingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: StudioSession;
  onGoLive: () => void;
}

export function PreSessionBriefingModal({
  open,
  onOpenChange,
  session,
  onGoLive,
}: PreSessionBriefingModalProps) {
  const { updateSession, settings } = useStudioStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("intel");

  // Multi-guest state initialization
  const [guests, setGuests] = useState<GuestInfo[]>(() => {
    if (session.guests && session.guests.length > 0) {
      return session.guests;
    }
    return [{ id: `guest-${Date.now()}`, name: "", bio: "" }];
  });

  const [outline, setOutline] = useState(session.outline || "");
  const [voice, setVoice] = useState(
    session.voice || settings.defaultVoice || "alba",
  );
  const [personality, setPersonality] = useState<PersonalityPreset>(
    session.personality || settings.personality || "professional",
  );

  const handleAddGuest = () => {
    setGuests((prev) => [
      ...prev,
      { id: `guest-${Date.now()}-${prev.length + 1}`, name: "", bio: "" },
    ]);
  };

  const handleRemoveGuest = (id: string) => {
    setGuests((prev) => {
      const filtered = prev.filter((g) => g.id !== id);
      return filtered.length > 0
        ? filtered
        : [{ id: `guest-${Date.now()}`, name: "", bio: "" }];
    });
  };

  const handleUpdateGuest = (id: string, updates: Partial<GuestInfo>) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    );
  };

  const handleOutlineUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setOutline(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveData = (shouldGoLive = false) => {
    const validGuests = guests.filter((g) => g.name.trim());
    updateSession(session.id, {
      guests: validGuests,
      guestName: validGuests[0]?.name || undefined,
      guestBio: validGuests[0]?.bio || undefined,
      outline: outline.trim() || undefined,
      voice,
      personality,
      briefingCompleted: true,
    });

    onOpenChange(false);
    if (shouldGoLive) {
      onGoLive();
    }
  };

  const handleQuickLive = () => {
    updateSession(session.id, {
      voice: settings.defaultVoice || "alba",
      personality: settings.personality || "professional",
      briefingCompleted: true,
    });
    onOpenChange(false);
    onGoLive();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-full bg-zinc-950 border-zinc-800 text-foreground rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-studio-violet to-purple-600 flex items-center justify-center text-white shadow-md">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Pre-Session Briefing
                  <Badge
                    variant="outline"
                    className="bg-primary/10 border-primary/30 text-primary text-[10px] uppercase font-mono px-2 py-0.5 rounded-full"
                  >
                    {session.name}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400">
                  Brief {settings.agentName} with guests context and episode
                  outline for live fact-checking.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden pt-4"
        >
          <TabsList className="grid grid-cols-2 bg-zinc-900/80 p-1 rounded-2xl border border-white/5 flex-shrink-0">
            <TabsTrigger
              value="intel"
              className="rounded-xl font-bold text-xs flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Users className="h-3.5 w-3.5" />
              Guests &amp; Outline Intel
            </TabsTrigger>
            <TabsTrigger
              value="agent"
              className="rounded-xl font-bold text-xs flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Bot className="h-3.5 w-3.5" />
              Voice &amp; Co-Host Tone
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GUESTS & OUTLINE INTEL */}
          <TabsContent
            value="intel"
            className="flex-1 overflow-y-auto space-y-5 pt-4 pr-1 focus:outline-none"
          >
            {/* Multiple Guests Section */}
            <div className="space-y-3 bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <label className="text-sm font-bold text-white block">
                    Show Guests ({guests.length})
                  </label>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddGuest}
                  className="rounded-xl text-xs h-7 gap-1.5 border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  Add Guest
                </Button>
              </div>

              <p className="text-xs text-zinc-400">
                {settings.agentName} will reference each guest&apos;s bio to
                fact-check claims and verify specific talking points.
              </p>

              {/* Guest cards */}
              <div className="space-y-3 pt-1">
                {guests.map((guest, index) => (
                  <div
                    key={guest.id}
                    className="bg-zinc-950/80 border border-white/10 rounded-2xl p-3.5 space-y-2.5 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-primary/20 text-primary text-[11px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-zinc-300">
                          {guest.name ? guest.name : `Guest #${index + 1}`}
                        </span>
                      </div>

                      {guests.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGuest(guest.id)}
                          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove guest"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        value={guest.name}
                        onChange={(e) =>
                          handleUpdateGuest(guest.id, { name: e.target.value })
                        }
                        placeholder="Guest Full Name & Title (e.g. Dr. Jane Smith, AI Researcher)"
                        className="bg-zinc-900 border-zinc-800 rounded-xl font-semibold text-white text-xs h-9 focus-visible:ring-primary"
                      />

                      <textarea
                        value={guest.bio || ""}
                        onChange={(e) =>
                          handleUpdateGuest(guest.id, { bio: e.target.value })
                        }
                        placeholder="Guest background, company, notable claims, book titles, or key stats..."
                        rows={2}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGuest}
                  className="w-full rounded-2xl border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-950/40 hover:bg-zinc-900/60 text-xs text-zinc-300 gap-2 h-9 py-2"
                >
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  Add Another Guest
                </Button>
              </div>
            </div>

            {/* Episode Outline */}
            <div className="space-y-3 bg-zinc-900/40 border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <label className="text-sm font-bold text-white block">
                    Episode Outline / Segments
                  </label>
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt,.md"
                    onChange={handleOutlineUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl text-xs h-7 gap-1.5 border-zinc-800 bg-zinc-900 text-zinc-300"
                  >
                    <Upload className="h-3 w-3" />
                    Upload .txt / .md
                  </Button>
                </div>
              </div>

              <p className="text-xs text-zinc-400">
                Paste or upload your show structure. {settings.agentName} will
                anticipate segment shifts and generate chapter markers
                automatically.
              </p>

              <textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="1. Introduction & Market Recap&#10;2. Deep Dive into AI Voice Agents&#10;3. Guest Discussion on Production Workflow&#10;4. Q&A and Closing Thoughts..."
                rows={4}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
              />
            </div>
          </TabsContent>

          {/* TAB 2: VOICE & CO-HOST TONE */}
          <TabsContent
            value="agent"
            className="flex-1 overflow-y-auto space-y-5 pt-4 pr-1 focus:outline-none"
          >
            {/* Personality Presets */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-bold text-white block">
                  Personality Preset for this Session
                </label>
                <p className="text-xs text-zinc-400">
                  Adjusts how {settings.agentName} talks when called and handles
                  earpiece cues.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {PERSONALITY_OPTIONS.map((item) => {
                  const isSelected = personality === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPersonality(item.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-zinc-900/40 border-white/5 hover:border-zinc-700 hover:bg-zinc-900/80"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">
                            {item.title}
                          </span>
                          {isSelected && (
                            <span className="text-xs text-primary font-bold flex items-center gap-1">
                              <Check className="h-3.5 w-3.5" /> Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Voice Selection */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-bold text-white block">
                  AI Voice Selector
                </label>
                <p className="text-xs text-zinc-400">
                  Choose the voice model for this session&apos;s audio replies.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {VOICE_OPTIONS.map((v) => {
                  const isSelected = voice === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVoice(v.id)}
                      className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between min-h-[76px] ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-zinc-900/40 border-white/5 hover:border-zinc-700 hover:bg-zinc-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm text-white">
                          {v.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-white/10 text-zinc-400 rounded-md"
                        >
                          {v.tag}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-1">
                        {v.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 mt-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleSaveData(false)}
            className="rounded-full text-xs text-zinc-400 hover:text-white"
          >
            Save &amp; Stay Standby
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleQuickLive}
              className="rounded-full border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold px-4"
            >
              Skip to Live
            </Button>

            <Button
              type="button"
              onClick={() => handleSaveData(true)}
              className="rounded-full px-6 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Go Live Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
