export const TOTAL_BARS = 48;

export const TONE_PROFILES: Record<string, number[]> = {
  rimshot: [
    4, 6, 12, 28, 65, 95, 82, 45, 24, 18, 22, 18, 14, 12, 10, 12, 16, 20, 26,
    32, 24, 18, 14, 12, 14, 12, 10, 12, 14, 18, 24, 48, 88, 100, 75, 42, 24, 16,
    14, 12, 10, 8, 6, 4, 4, 4, 4, 4,
  ],
  airhorn: [
    4, 8, 16, 42, 78, 94, 98, 86, 68, 54, 64, 86, 96, 92, 78, 58, 44, 60, 82,
    94, 98, 84, 66, 48, 62, 84, 96, 90, 74, 52, 38, 26, 18, 14, 12, 10, 8, 6, 6,
    4, 4, 4, 4, 4, 4, 4, 4, 4,
  ],
  applause: [
    6, 12, 26, 48, 72, 58, 80, 92, 68, 82, 94, 86, 72, 84, 92, 78, 68, 84, 90,
    82, 74, 86, 94, 82, 70, 80, 88, 76, 64, 78, 86, 72, 58, 44, 32, 24, 18, 14,
    12, 10, 8, 6, 4, 4, 4, 4, 4, 4,
  ],
  boom: [
    12, 24, 48, 78, 96, 100, 94, 86, 76, 66, 56, 46, 38, 30, 24, 20, 16, 14, 12,
    10, 8, 8, 6, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4,
  ],
  chime: [
    4, 6, 10, 18, 34, 58, 92, 100, 86, 65, 48, 36, 28, 22, 18, 14, 12, 10, 8, 8,
    6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4,
  ],
  trombone: [
    8, 14, 32, 64, 82, 74, 60, 48, 62, 74, 62, 48, 38, 52, 64, 50, 36, 28, 42,
    54, 40, 28, 20, 16, 12, 10, 8, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4,
  ],
  crickets: [
    4, 8, 14, 20, 45, 60, 40, 25, 50, 70, 45, 20, 10, 30, 60, 40, 15, 10, 40,
    65, 35, 15, 10, 35, 60, 30, 15, 10, 25, 50, 25, 10, 8, 6, 4, 4, 4, 4, 4,
    4, 4, 4, 4, 4, 4, 4, 4, 4,
  ],
};

export interface SoundTone {
  id?: string;
  label: string;
  key: string;
  hotkey: string;
  icon: string;
  tagline: string;
  desc?: string;
  accent: string;
  soundUrl?: string;
  triggerKeyword?: string;
  isCustom?: boolean;
}

export type SoundPad = SoundTone;

export const DEFAULT_PADS: SoundPad[] = [
  {
    id: "pad-rimshot",
    label: "Rimshot",
    key: "rimshot",
    hotkey: "1",
    icon: "🥁",
    tagline: "Punchline & Jokes",
    desc: "Crisp stick hit and snare drop on comedic timing",
    accent: "text-amber-400",
    soundUrl: "/sounds/rimshot.mp3",
    triggerKeyword: "bad joke",
  },
  {
    id: "pad-airhorn",
    label: "Airhorn",
    key: "airhorn",
    hotkey: "2",
    icon: "📢",
    tagline: "Hype & Energy",
    desc: "Dual sawtooth brass blast for high-energy announcements",
    accent: "text-orange-400",
    soundUrl: "/sounds/air-horn.mp3",
    triggerKeyword: "hype",
  },
  {
    id: "pad-applause",
    label: "Applause",
    key: "applause",
    hotkey: "3",
    icon: "👏",
    tagline: "Wins & Guest Intros",
    desc: "Warm crowd clapping burst on milestones and shoutouts",
    accent: "text-emerald-400",
    soundUrl: "/sounds/applause.mp3",
    triggerKeyword: "applause",
  },
  {
    id: "pad-crickets",
    label: "Crickets",
    key: "crickets",
    hotkey: "4",
    icon: "🦗",
    tagline: "Awkward Silence",
    desc: "Quiet insect chirps on dry jokes or silent moments",
    accent: "text-rose-400",
    soundUrl: "/sounds/crickets.mp3",
    triggerKeyword: "awkward silence",
  },
  {
    id: "pad-chime",
    label: "Bell Chime",
    key: "chime",
    hotkey: "5",
    icon: "🔔",
    tagline: "Facts & Stats",
    desc: "Clean crystal bell accent on verified fact checks",
    accent: "text-cyan-400",
    soundUrl: "/sounds/bell.mp3",
    triggerKeyword: "fact check",
  },
  {
    id: "pad-trombone",
    label: "Sad Trombone",
    key: "trombone",
    hotkey: "6",
    icon: "🎺",
    tagline: "Fails & Groans",
    desc: "Descending stepped wah-wah on funny host slip-ups",
    accent: "text-violet-400",
    soundUrl: "/sounds/trombone.mp3",
    triggerKeyword: "epic fail",
  },
];

export const TONES: SoundTone[] = DEFAULT_PADS;

const DEFAULT_AUDIO_MAP: Record<string, string> = {
  rimshot: "/sounds/rimshot.mp3",
  airhorn: "/sounds/air-horn.mp3",
  applause: "/sounds/applause.mp3",
  crickets: "/sounds/crickets.mp3",
  chime: "/sounds/bell.mp3",
  bell: "/sounds/bell.mp3",
  boom: "/sounds/bell.mp3",
  trombone: "/sounds/trombone.mp3",
};

export const playSound = (soundOrKey: string) => {
  if (typeof window === "undefined" || !soundOrKey) return;

  let audioSrc = soundOrKey;

  if (
    !audioSrc.startsWith("data:") &&
    !audioSrc.startsWith("/") &&
    !audioSrc.startsWith("http")
  ) {
    try {
      // Dynamic require avoids top-level circular module evaluation
      const { useStudioStore } = require("@/store/studio-store");
      const customPads = useStudioStore.getState()?.settings?.soundboardPads;
      const matchedPad = customPads?.find(
        (p: SoundPad) => p.key === soundOrKey || p.id === soundOrKey,
      );
      if (matchedPad?.soundUrl) {
        audioSrc = matchedPad.soundUrl;
      } else {
        audioSrc = DEFAULT_AUDIO_MAP[soundOrKey] || "/sounds/bell.mp3";
      }
    } catch {
      audioSrc = DEFAULT_AUDIO_MAP[soundOrKey] || "/sounds/bell.mp3";
    }
  }

  try {
    const audio = new Audio(audioSrc);
    audio.volume = 0.9;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("[Soundboard] Audio playback warning:", err);
      });
    }
  } catch (err) {
    console.error("[Soundboard] Audio playback error:", err);
  }
};

export const playDemoSound = (type: string) => {
  playSound(type);
};
