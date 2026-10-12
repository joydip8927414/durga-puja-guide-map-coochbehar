import { CrowdDensity } from "@/types";

export interface CrowdWeightConfig {
  low: number;
  moderate: number;
  high: number;
  peak: number;
}

export const CROWD_SEVERITY_WEIGHTS: Record<CrowdDensity, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  peak: 4,
};

/**
 * Maps average crowd numeric score back to density enum
 */
export function scoreToCrowdDensity(score: number): CrowdDensity {
  if (score <= 1.5) return "low";
  if (score <= 2.5) return "moderate";
  if (score <= 3.5) return "high";
  return "peak";
}
