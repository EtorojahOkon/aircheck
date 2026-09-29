import { ShieldCheck, Smile, Zap } from "lucide-react";
import { PersonalityPreset } from "@/types/studio";

export interface VoiceOption {
  id: string;
  name: string;
  desc: string;
  tag: string;
}

export interface PersonalityOption {
  id: PersonalityPreset;
  title: string;
  desc: string;
  icon: typeof ShieldCheck;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: "ivy",
    name: "Ivy",
    desc: "US Female · Warm, natural & conversational",
    tag: "Recommended",
  },
  {
    id: "alba",
    name: "Alba",
    desc: "US Female · Clear, engaging & expressive",
    tag: "Host",
  },
  {
    id: "anna",
    name: "Anna",
    desc: "US Female · Crisp, professional & authoritative",
    tag: "Producer",
  },
  {
    id: "james",
    name: "James",
    desc: "US Male · Deep, grounded & confident",
    tag: "Podcast",
  },
  {
    id: "sophie",
    name: "Sophie",
    desc: "UK Female · Refined British accent",
    tag: "UK Accent",
  },
  {
    id: "diego",
    name: "Diego",
    desc: "US Male · Dynamic, energetic & lively",
    tag: "Dynamic",
  },
  {
    id: "arjun",
    name: "Arjun",
    desc: "US Male · Calm, analytical & measured",
    tag: "Analytical",
  },
];

export const PERSONALITY_OPTIONS: PersonalityOption[] = [
  {
    id: "professional",
    title: "Professional & Concise",
    desc: "Strictly high-signal producer. Direct whispers and instant silent chapter & SFX execution.",
    icon: ShieldCheck,
  },
  {
    id: "witty",
    title: "Witty & Playful",
    desc: "Sharp comedic timing and lively banter when called upon. Great for comedy and casual shows.",
    icon: Smile,
  },
  {
    id: "factual",
    title: "Straight Facts Only",
    desc: "Zero banter. Strictly verifies claims, timestamps chapters, and displays verified fact cards.",
    icon: Zap,
  },
];
