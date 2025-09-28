import { create } from "zustand";

interface IUserDetailsState {
  details: {
    name: string;
    email: string;
    createdAt: string;
  };
  updateDetails: (details: Partial<{ name: string; email: string }>) => void;
}

export const useUserDetails = create<IUserDetailsState>((set, get) => ({
  details: {
    name: "",
    email: "",
    createdAt: "",
  },
  updateDetails: () => set((state) => ({ ...state, details: state.details })),
}));
