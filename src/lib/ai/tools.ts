export const SFX_EFFECTS = [
  "rimshot",
  "applause",
  "crickets",
  "airhorn",
  "boom",
  "trombone",
  "chime",
] as const;

export const AGENT_TOOLS = [
  {
    type: "function",
    name: "trigger_sfx",
    description:
      "Trigger a sound effect pad on the soundboard. Call this silently — do NOT speak when invoking. Choose based on context: rimshot (bad joke/pun), applause (achievement/big moment), crickets (awkward silence/boring answer), airhorn (hype/big reveal), boom (mic-drop statement), trombone (epic fail/embarrassment), chime (success/milestone/topic transition).",
    execution_mode: "hold",
    parameters: {
      type: "object",
      properties: {
        effect: {
          type: "string",
          enum: SFX_EFFECTS,
          description:
            "The sound effect to play. Must be one of the enum values.",
        },
      },
      required: ["effect"],
    },
  },
  {
    type: "function",
    name: "display_fact_card",
    description:
      "Display a verified fact card on the studio UI. Invoke when the host asks a factual question, states an uncertain or wrong fact, or says 'fact check that'. After invoking, whisper the answer in ≤12 words — be direct, no preamble.",
    execution_mode: "hold",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The exact question or claim being fact-checked",
        },
        fact: {
          type: "string",
          description: "The verified fact, stated concisely and directly",
        },
        source_or_year: {
          type: "string",
          description: "Source, year, or reference for the fact",
        },
      },
      required: ["query", "fact", "source_or_year"],
    },
  },
  {
    type: "function",
    name: "add_chapter_marker",
    description:
      "Add a chapter marker when the host clearly pivots to a new topic. Trigger on: 'Let's talk about...', 'Moving on to...', 'Next up...', 'Now let's get into...', 'Switching gears...', or any clear subject change. Do NOT speak when invoking — just mark the chapter silently.",
    execution_mode: "hold",
    parameters: {
      type: "object",
      properties: {
        chapter_title: {
          type: "string",
          description:
            "A clean 3–6 word title in Title Case describing the new topic",
        },
      },
      required: ["chapter_title"],
    },
  },
];
