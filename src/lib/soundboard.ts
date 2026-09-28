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
};

export interface SoundTone {
  label: string;
  key: string;
  hotkey: string;
  icon: string;
  tagline: string;
  desc: string;
  accent: string;
}

export const TONES: SoundTone[] = [
  {
    label: "Rimshot",
    key: "rimshot",
    hotkey: "1",
    icon: "🥁",
    tagline: "Punchline & Jokes",
    desc: "Crisp stick hit and snare drop on comedic timing",
    accent: "text-amber-400",
  },
  {
    label: "Airhorn",
    key: "airhorn",
    hotkey: "2",
    icon: "📢",
    tagline: "Hype & Energy",
    desc: "Dual sawtooth brass blast for high-energy announcements",
    accent: "text-orange-400",
  },
  {
    label: "Applause",
    key: "applause",
    hotkey: "3",
    icon: "👏",
    tagline: "Wins & Guest Intros",
    desc: "Warm crowd clapping burst on milestones and shoutouts",
    accent: "text-emerald-400",
  },
  {
    label: "Boom Drop",
    key: "boom",
    hotkey: "4",
    icon: "💥",
    tagline: "Dramatic Reveals",
    desc: "Sub-bass 808 drop for plot twists and big takes",
    accent: "text-rose-400",
  },
  {
    label: "Chime",
    key: "chime",
    hotkey: "5",
    icon: "🔔",
    tagline: "Facts & Stats",
    desc: "Clean crystal bell accent on verified fact checks",
    accent: "text-cyan-400",
  },
  {
    label: "Sad Trombone",
    key: "trombone",
    hotkey: "6",
    icon: "🎺",
    tagline: "Fails & Groans",
    desc: "Descending stepped wah-wah on funny host slip-ups",
    accent: "text-violet-400",
  },
];

export const playDemoSound = (type: string) => {
  if (typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AudioCtx();
  const t = ctx.currentTime;

  switch (type) {
    case "rimshot": {
      // High-pitched stick hit + snare sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.15);
      gain.gain.setValueAtTime(0.8, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.15);
      break;
    }

    case "boom": {
      // Thunderous kick drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 1.0);
      gain.gain.setValueAtTime(0.95, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.0);
      break;
    }

    case "airhorn": {
      // Dual-oscillator sawtooth blast
      [493.88, 740].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.45, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.55);
      });
      break;
    }

    case "applause": {
      // Filtered noise burst simulating crowd claps
      const bufferSize = ctx.sampleRate * 1.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 0.6;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.4, t + 0.3);
      gain.gain.linearRampToValueAtTime(0.01, t + 1.2);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(t);
      source.stop(t + 1.2);
      break;
    }

    case "trombone": {
      // Descending stepped pitch slide (wah-wah-wah-waah)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.linearRampToValueAtTime(245, t + 0.35);
      osc.frequency.linearRampToValueAtTime(225, t + 0.7);
      osc.frequency.linearRampToValueAtTime(185, t + 1.3);
      gain.gain.setValueAtTime(0.42, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 1.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.3);
      break;
    }

    case "chime":
    default: {
      // Bright bell chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, t);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.linearRampToValueAtTime(0.01, t + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
      break;
    }
  }
};
