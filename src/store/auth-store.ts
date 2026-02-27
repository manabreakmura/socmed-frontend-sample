import { create } from "zustand";

type State = {
  auth: {
    id: number;
    email: string;
    username: string;
  } | null;
  isLoading: boolean;
};

type Action = {
  setAuth: (auth: State["auth"]) => void;
  setIsLoading: (isLoading: State["isLoading"]) => void;
};

export const useAuthStore = create<State & Action>((set) => ({
  auth: null,
  isLoading: true,
  setAuth: (auth) => set({ auth }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
