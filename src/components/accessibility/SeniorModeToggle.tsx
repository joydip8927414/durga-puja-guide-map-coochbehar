"use client";

import React from "react";
import { Accessibility } from "lucide-react";
import { usePreferences } from "../preferences/PreferenceProvider";

export function SeniorModeToggle({ className = "" }: { className?: string }) {
  const { seniorMode, toggleSeniorMode, language } = usePreferences();

  const label =
    language === "bn"
      ? "বয়োজ্যেষ্ঠ মোড (বড় হরফ)"
      : "Senior Citizen Mode (Larger Text)";

  return (
    <button
      type="button"
      onClick={toggleSeniorMode}
      aria-pressed={seniorMode}
      aria-label={label}
      title={label}
      className={`touch-target-min px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer focus-ring flex items-center gap-2 select-none ${
        seniorMode
          ? "bg-[#D97706]/15 border-[#D97706] text-[#B45309] dark:text-[#F59E0B] font-bold"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
      } ${className}`}
    >
      <Accessibility className={`w-4 h-4 ${seniorMode ? "text-[#D97706]" : "text-slate-500"}`} aria-hidden="true" />
      <span>{seniorMode ? "Senior Mode: ON" : "Senior Mode"}</span>
    </button>
  );
}
