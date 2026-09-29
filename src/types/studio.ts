import { SoundPad } from "@/lib/soundboard";

export interface FactItem {
  id: number;
  query: string;
  fact: string;
  source?: string;
  timestamp: string;
}

export interface ChapterItem {
  id: number;
  title: string;
  timestamp: string;
}

export interface TranscriptEntry {
  id: number;
  speaker: "host" | "agent";
  text: string;
  timestamp: string;
}

export interface GuestInfo {
  id: string;
  name: string;
  bio?: string;
}

export type StudioSFX =
  | "rimshot"
  | "applause"
  | "crickets"
  | "airhorn"
  | "boom"
  | "trombone"
  | "chime";

export type PersonalityPreset = "professional" | "witty" | "factual";

export interface StudioSession {
  id: string;
  name: string;
  facts: FactItem[];
  chapters: ChapterItem[];
  transcript: TranscriptEntry[];
  lastWhisper: string | null;
  recordingUrl?: string;
  hasRecording?: boolean;
  guests?: GuestInfo[];
  guestName?: string;
  guestBio?: string;
  outline?: string;
  voice?: string;
  personality?: PersonalityPreset;
  briefingCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudioSettings {
  agentName: string;
  defaultVoice: string;
  personality: PersonalityPreset;
  soundboardPads: SoundPad[];
}
