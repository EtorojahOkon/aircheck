import { SoundPad } from "@/lib/soundboard";

export const SFX_EFFECTS = [
  "rimshot",
  "applause",
  "crickets",
  "airhorn",
  "boom",
  "trombone",
  "chime",
] as const;

export function getAgentTools(pads?: SoundPad[]) {
  const effectEnums =
    pads && pads.length > 0
      ? pads.map((p) => p.key)
      : (Array.from(SFX_EFFECTS) as string[]);

  const descriptionList =
    pads && pads.length > 0
      ? pads
          .map((p) => `${p.key} (${p.triggerKeyword || p.tagline || p.label})`)
          .join(", ")
      : "rimshot (bad joke/pun), applause (achievement/big moment), crickets (awkward silence/boring answer), airhorn (hype/big reveal), boom (mic-drop statement), trombone (epic fail/embarrassment), chime (success/milestone/topic transition)";

  return [
    {
      type: "function",
      name: "trigger_sfx",
      description: `Trigger a sound effect pad silently. DO NOT speak before, during, or after calling this tool. Choose based on context: ${descriptionList}.`,
      execution_mode: "interactive",
      parameters: {
        type: "object",
        properties: {
          effect: {
            type: "string",
            enum: effectEnums,
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
        "Display a fact card on the studio screen. Invoke this tool ONLY — do NOT speak, whisper, read out, or acknowledge the fact in any way. The card appears visually; your only job is to call this tool and then stay completely silent. No spoken output whatsoever.",
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
        "Add a chapter marker when the host clearly pivots to a new topic. DO NOT speak when invoking — call the tool silently and produce zero spoken output.",
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
}

export const AGENT_TOOLS = getAgentTools();
