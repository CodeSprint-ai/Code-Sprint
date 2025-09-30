import { Difficulty } from "@/types/problems";

export const formatDifficulty = (d: Difficulty) =>
  d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
