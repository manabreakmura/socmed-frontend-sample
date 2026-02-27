import { create } from "zustand";

type State = {
  auth: {
    id: number;
    email: string;
    username: string;
  } | null;
};

type Action = {
  setAuth: (auth: State["auth"]) => void;
};

export const useAuthStore = create<State & Action>((set) => ({
  auth: null,
  setAuth: (auth) => set({ auth }),
}));
