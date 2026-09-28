export interface FactItem {
  id: string;
  query: string;
  fact: string;
  source?: string;
  timestamp: string;
}

export interface ChapterItem {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}
