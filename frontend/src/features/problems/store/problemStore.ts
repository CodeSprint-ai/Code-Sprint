// src/stores/authStore.ts
import { create } from "zustand";
import { AuthStore, User } from "@/features/auth/types/auth.types";
import { ProblemStore } from "@/features/problems/types/problems.types";

export const useProblemStore = create<ProblemStore>((set, get) => ({
  isAddProblemPopupForm: false,
  setIsAddProblemPopupForm: (isAddProblemPopupForm) =>
    set({ isAddProblemPopupForm }),
}));
