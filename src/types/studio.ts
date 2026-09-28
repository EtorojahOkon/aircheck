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

export type StudioSFX =
  | "rimshot"
  | "applause"
  | "crickets"
  | "airhorn"
  | "boom"
  | "trombone"
  | "chime";

export interface StudioSession {
  id: string;
  name: string;
  facts: FactItem[];
  chapters: ChapterItem[];
  lastWhisper: string | null;
  createdAt: string;
  updatedAt: string;
}
