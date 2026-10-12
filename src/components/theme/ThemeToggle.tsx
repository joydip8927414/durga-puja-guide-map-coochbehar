"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { usePreferences } from "../preferences/PreferenceProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = usePreferences();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`touch-target-min w-11 h-11 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-[#881337]" aria-hidden="true" />
      )}
    </button>
  );
}
