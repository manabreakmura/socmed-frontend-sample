import { create } from "zustand";

type State = {
  user: {
    id: number;
    email: string;
    username: string;
  } | null;
};

type Action = {
  setUser: (user: State["user"]) => void;
};

export const useAuthStore = create<State & Action>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
