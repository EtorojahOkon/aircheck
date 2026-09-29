import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { StudioSession, StudioSettings } from "@/types/studio";
import { DEFAULT_PADS, SoundPad } from "@/lib/soundboard";

const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  agentName: "Jamie",
  defaultVoice: "ivy",
  personality: "professional",
  soundboardPads: DEFAULT_PADS,
};

interface StudioState {
  sessions: Record<string, StudioSession>;
  activeSessionId: string | null;
  settings: StudioSettings;

  setActiveSession: (id: string | null) => void;
  createSession: (name: string) => StudioSession;
  setSession: (session: StudioSession) => void;
  updateSession: (id: string, data: Partial<StudioSession>) => void;
  deleteSession: (id: string) => void;

  // Global Settings Actions
  updateSettings: (data: Partial<StudioSettings>) => void;
  addSoundPad: (pad: SoundPad) => void;
  updateSoundPad: (id: string, pad: Partial<SoundPad>) => void;
  deleteSoundPad: (id: string) => void;
  resetSoundPads: () => void;
  resetAllSettings: () => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionId: null,
      settings: DEFAULT_STUDIO_SETTINGS,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setActiveSession: (id) => set({ activeSessionId: id }),

      createSession: (name: string) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newSession: StudioSession = {
          id,
          name,
          facts: [],
          chapters: [],
          transcript: [],
          lastWhisper: null,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          sessions: { ...state.sessions, [id]: newSession },
        }));

        return newSession;
      },

      setSession: (session) =>
        set((state) => ({
          sessions: { ...state.sessions, [session.id]: session },
          activeSessionId: session.id,
        })),

      updateSession: (id, data) =>
        set((state) => {
          const existing = state.sessions[id];
          if (!existing) return state;

          return {
            sessions: {
              ...state.sessions,
              [id]: {
                ...existing,
                ...data,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        }),

      deleteSession: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.sessions;
          return {
            sessions: rest,
            activeSessionId:
              state.activeSessionId === id ? null : state.activeSessionId,
          };
        }),

      updateSettings: (data) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...data,
          },
        })),

      addSoundPad: (pad) =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundboardPads: [
              ...(state.settings.soundboardPads || DEFAULT_PADS),
              pad,
            ],
          },
        })),

      updateSoundPad: (id, padUpdate) =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundboardPads: (state.settings.soundboardPads || DEFAULT_PADS).map(
              (pad) =>
                pad.id === id || pad.key === id
                  ? { ...pad, ...padUpdate }
                  : pad,
            ),
          },
        })),

      deleteSoundPad: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundboardPads: (
              state.settings.soundboardPads || DEFAULT_PADS
            ).filter((pad) => pad.id !== id && pad.key !== id),
          },
        })),

      resetSoundPads: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundboardPads: DEFAULT_PADS,
          },
        })),

      resetAllSettings: () =>
        set(() => ({
          settings: DEFAULT_STUDIO_SETTINGS,
        })),
    }),
    {
      name: "aircheck-studio",
      storage: createJSONStorage(() => indexedDBStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // blob: URLs are tab-scoped — strip them before writing to IndexedDB
      partialize: (state) => ({
        ...state,
        sessions: Object.fromEntries(
          Object.entries(state.sessions).map(([id, session]) => [
            id,
            { ...session, recordingUrl: undefined },
          ]),
        ),
      }),
    },
  ),
);
