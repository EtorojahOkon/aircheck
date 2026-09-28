import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { StudioSession } from "@/types/studio";

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

interface StudioState {
  sessions: Record<string, StudioSession>;
  activeSessionId: string | null;

  setActiveSession: (id: string | null) => void;
  createSession: (name: string) => StudioSession;
  setSession: (session: StudioSession) => void;
  updateSession: (id: string, data: Partial<StudioSession>) => void;
  deleteSession: (id: string) => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      sessions: {},
      activeSessionId: null,

      setActiveSession: (id) => set({ activeSessionId: id }),

      createSession: (name: string) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const newSession: StudioSession = {
          id,
          name,
          facts: [],
          chapters: [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          sessions: { ...state.sessions, [id]: newSession },
          activeSessionId: id,
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
    }),
    {
      name: "aircheck-studio",
      storage: createJSONStorage(() => indexedDBStorage),
    },
  ),
);
