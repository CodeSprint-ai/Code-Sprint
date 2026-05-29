import { Difficulty } from "@/features/problems/types/problems.types";

export const formatDifficulty = (d: Difficulty) =>
  d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
