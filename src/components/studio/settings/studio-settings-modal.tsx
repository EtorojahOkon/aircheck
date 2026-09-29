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
import { playSound, SoundPad } from "@/lib/soundboard";
import {
  Bot,
  Sliders,
  Volume2,
  Play,
  Trash2,
  Plus,
  RotateCcw,
  Check,
  Upload,
} from "lucide-react";
import { VOICE_OPTIONS, PERSONALITY_OPTIONS } from "@/lib/studio";

interface StudioSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudioSettingsModal({
  open,
  onOpenChange,
}: StudioSettingsModalProps) {
  const {
    settings,
    updateSettings,
    addSoundPad,
    updateSoundPad,
    deleteSoundPad,
    resetSoundPads,
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState("agent");
  const [editingPadId, setEditingPadId] = useState<string | null>(null);
  const [isAddingPad, setIsAddingPad] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHotkey, setNewHotkey] = useState("");
  const [newIcon, setNewIcon] = useState("🎵");
  const [newKeyword, setNewKeyword] = useState("");
  const [newSoundData, setNewSoundData] = useState<string | null>(null);
  const [newSoundName, setNewSoundName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !file.type.includes("audio") &&
      !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)
    ) {
      alert("Please upload a valid audio file (MP3 or WAV).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isEdit && editingPadId) {
        updateSoundPad(editingPadId, {
          soundUrl: base64,
          isCustom: true,
        });
      } else {
        setNewSoundData(base64);
        setNewSoundName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewPad = () => {
    if (!newLabel.trim()) return;

    const id = `custom-${Date.now()}`;
    const key = newLabel.toLowerCase().replace(/[^a-z0-9]/g, "_");

    const newPad: SoundPad = {
      id,
      label: newLabel.trim(),
      key,
      hotkey: newHotkey.trim() || `${(settings.soundboardPads.length % 9) + 1}`,
      icon: newIcon.trim() || "🎵",
      tagline: newKeyword.trim() || "Custom Sound",
      triggerKeyword: newKeyword.trim() || newLabel.trim().toLowerCase(),
      accent: "text-amber-400",
      soundUrl: newSoundData || "/sounds/bell.mp3",
      isCustom: true,
    };

    addSoundPad(newPad);
    setIsAddingPad(false);
    setNewLabel("");
    setNewHotkey("");
    setNewIcon("🎵");
    setNewKeyword("");
    setNewSoundData(null);
    setNewSoundName(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-full bg-zinc-950 border-zinc-800 text-foreground rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <DialogHeader className="pb-3 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-studio-violet to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                Studio Global Settings
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Configure your AI co-host, soundboard pads, and audio
                preferences across all sessions.
              </DialogDescription>
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
              value="agent"
              className="rounded-xl font-bold text-xs flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Bot className="h-3.5 w-3.5" />
              AI Co-Host
            </TabsTrigger>
            <TabsTrigger
              value="soundboard"
              className="rounded-xl font-bold text-xs flex items-center gap-2 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Soundboard
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: AI CO-HOST */}
          <TabsContent
            value="agent"
            className="flex-1 overflow-y-auto space-y-6 pt-4 pr-1 focus:outline-none"
          >
            {/* Agent Name */}
            <div className="space-y-3 bg-zinc-900/50 border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-white block">
                    Agent Name
                  </label>
                  <p className="text-xs text-zinc-400">
                    Rename your AI producer. Call &quot;Hey [Name]&quot; to
                    trigger responses on air.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-primary/10 border-primary/30 text-primary font-mono text-xs px-2.5 py-0.5 rounded-full"
                >
                  &quot;Hey {settings.agentName}&quot;
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={settings.agentName}
                  onChange={(e) =>
                    updateSettings({ agentName: e.target.value })
                  }
                  placeholder="e.g. Jamie, Alex, Nova"
                  className="bg-zinc-950 border-zinc-800 rounded-xl font-semibold text-white focus-visible:ring-primary"
                />
                <div className="flex gap-1.5">
                  {["Jamie", "Alex", "Nova"].map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSettings({ agentName: preset })}
                      className="rounded-xl text-xs border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Personality Presets */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-bold text-white block">
                  Co-Host Personality Preset
                </label>
                <p className="text-xs text-zinc-400">
                  Controls how your AI co-host speaks, responds to cues, and
                  interacts during broadcasts.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {PERSONALITY_OPTIONS.map((item) => {
                  const isSelected = settings.personality === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => updateSettings({ personality: item.id })}
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
                              <Check className="h-3.5 w-3.5" /> Active
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

            {/* Default Voice */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-bold text-white block">
                  Default AI Voice
                </label>
                <p className="text-xs text-zinc-400">
                  Pre-selected voice for upcoming podcast sessions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {VOICE_OPTIONS.map((voice) => {
                  const isSelected = settings.defaultVoice === voice.id;
                  return (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => updateSettings({ defaultVoice: voice.id })}
                      className={`text-left p-3 rounded-2xl border transition-all flex flex-col justify-between min-h-[76px] ${
                        isSelected
                          ? "bg-primary/10 border-primary"
                          : "bg-zinc-900/40 border-white/5 hover:border-zinc-700 hover:bg-zinc-900/80"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm text-white">
                          {voice.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-white/10 text-zinc-400 rounded-md"
                        >
                          {voice.tag}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-1">
                        {voice.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: SOUNDBOARD MANAGER */}
          <TabsContent
            value="soundboard"
            className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1 focus:outline-none"
          >
            <div className="flex items-center justify-between bg-zinc-900/40 border border-white/5 p-3 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-white block">
                  Custom Soundboard Manager
                </span>
                <span className="text-[11px] text-zinc-400">
                  {settings.soundboardPads?.length || 0} pads configured
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetSoundPads}
                  className="rounded-xl text-xs h-8 gap-1.5 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Defaults
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAddingPad(true)}
                  className="rounded-xl text-xs h-8 gap-1.5 bg-primary text-primary-foreground font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Pad
                </Button>
              </div>
            </div>

            {/* Add Pad Inline Form */}
            {isAddingPad && (
              <div className="bg-zinc-900/90 border border-primary/40 p-4 rounded-2xl space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> New Soundboard Pad
                  </span>
                  <button
                    onClick={() => setIsAddingPad(false)}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                      Label
                    </label>
                    <Input
                      placeholder="e.g. Laser SFX"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-xs h-8 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                      AI Trigger Keyword
                    </label>
                    <Input
                      placeholder="e.g. laser, sci-fi"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-xs h-8 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                      Hotkey (e.g. 7)
                    </label>
                    <Input
                      placeholder="Key"
                      value={newHotkey}
                      onChange={(e) => setNewHotkey(e.target.value)}
                      maxLength={2}
                      className="bg-zinc-950 border-zinc-800 text-xs h-8 rounded-lg text-white font-mono uppercase"
                    />
                  </div>
                </div>

                {/* Upload custom audio */}
                <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-xs text-zinc-300">
                      {newSoundName || "Upload Custom Audio (MP3 / WAV)"}
                    </span>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg text-xs h-7 border-zinc-700 bg-zinc-900 text-zinc-200"
                    >
                      Browse...
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAddingPad(false)}
                    className="rounded-lg text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNewPad}
                    disabled={!newLabel.trim()}
                    className="rounded-lg text-xs h-8 bg-primary font-bold"
                  >
                    Save Pad
                  </Button>
                </div>
              </div>
            )}

            {/* List of Pads */}
            <div className="space-y-2">
              {settings.soundboardPads?.map((pad) => {
                const isEditing = editingPadId === pad.id;
                return (
                  <div
                    key={pad.id || pad.key}
                    className="bg-zinc-900/40 border border-white/5 hover:border-zinc-700 p-3 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                  >
                    {/* Left: Icon, Label & Triggers */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-2xl filter drop-shadow">
                        {pad.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white truncate">
                            {pad.label}
                          </span>
                          <kbd className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-black/60 border border-white/10 text-zinc-400">
                            {pad.hotkey}
                          </kbd>
                          {pad.isCustom && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1 py-0 border-amber-500/40 text-amber-400 rounded-md"
                            >
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">
                          Trigger keyword: &quot;{pad.triggerKeyword || pad.key}
                          &quot;
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => playSound(pad.soundUrl || pad.key)}
                        className="h-8 w-8 rounded-xl bg-zinc-800/80 hover:bg-primary hover:text-primary-foreground text-zinc-300"
                        title="Test sound"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingPadId(isEditing ? null : pad.id || pad.key);
                        }}
                        className={`h-8 w-8 rounded-xl ${
                          isEditing
                            ? "bg-primary text-primary-foreground"
                            : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300"
                        }`}
                        title="Edit pad"
                      >
                        <Sliders className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteSoundPad(pad.id || pad.key)}
                        className="h-8 w-8 rounded-xl bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                        title="Delete pad"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Inline edit panel if expanded */}
                    {isEditing && (
                      <div className="col-span-full w-full mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">
                            Rename Label
                          </label>
                          <Input
                            value={pad.label}
                            onChange={(e) =>
                              updateSoundPad(pad.id || pad.key, {
                                label: e.target.value,
                              })
                            }
                            className="bg-zinc-950 border-zinc-800 text-xs h-7 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">
                            Trigger Keyword
                          </label>
                          <Input
                            value={pad.triggerKeyword || ""}
                            onChange={(e) =>
                              updateSoundPad(pad.id || pad.key, {
                                triggerKeyword: e.target.value,
                              })
                            }
                            className="bg-zinc-950 border-zinc-800 text-xs h-7 rounded-lg text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">
                            Replace Audio
                          </label>
                          <input
                            type="file"
                            ref={editFileInputRef}
                            accept="audio/*"
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editFileInputRef.current?.click()}
                            className="w-full text-xs h-7 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-300"
                          >
                            Upload File...
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between flex-shrink-0 mt-auto">
          <span className="text-xs text-zinc-500">
            Changes save automatically
          </span>
          <Button
            onClick={() => onOpenChange(false)}
            className="rounded-full px-6 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
