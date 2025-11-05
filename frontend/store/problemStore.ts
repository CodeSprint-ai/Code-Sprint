// src/stores/authStore.ts
import { create } from "zustand";
import { AuthStore, User } from "../types/auth";
import { ProblemStore } from "@/types/problems";

export const useProblemStore = create<ProblemStore>((set, get) => ({
  isAddProblemPopupForm: false,
  setIsAddProblemPopupForm: (isAddProblemPopupForm) =>
    set({ isAddProblemPopupForm }),
}));
