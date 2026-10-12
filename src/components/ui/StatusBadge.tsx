import React from "react";
import { Users, AlertTriangle, CheckCircle2 } from "lucide-react";

export type StatusLevel = "low" | "moderate" | "heavy" | "verified" | "advisory";

export interface StatusBadgeProps {
  level: StatusLevel;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({
  level,
  label,
  size = "md",
  className = "",
}: StatusBadgeProps) {
  const configs = {
    low: {
      defaultLabel: "Low Crowd",
      icon: CheckCircle2,
      style:
        "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    },
    moderate: {
      defaultLabel: "Moderate Crowd",
      icon: Users,
      style:
        "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800",
    },
    heavy: {
      defaultLabel: "Heavy Crowd",
      icon: AlertTriangle,
      style:
        "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800",
    },
    verified: {
      defaultLabel: "Verified Landmark",
      icon: CheckCircle2,
      style:
        "bg-[#881337]/10 text-[#881337] border-[#881337]/20 dark:bg-[#9F1239]/20 dark:text-rose-200 dark:border-[#9F1239]/40",
    },
    advisory: {
      defaultLabel: "Candidate Fixture",
      icon: AlertTriangle,
      style:
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    },
  };

  const current = configs[level];
  const IconComponent = current.icon;
  const displayLabel = label || current.defaultLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm"
      } ${current.style} ${className}`}
    >
      <IconComponent className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}
