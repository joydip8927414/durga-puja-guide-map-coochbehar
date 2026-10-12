"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
export type Language = "en" | "bn";

interface PreferenceContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  seniorMode: boolean;
  toggleSeniorMode: () => void;
}

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

// External store subscribers
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// Client-side snapshot getters
function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const val = localStorage.getItem("cb_puja_theme") as Theme | null;
    if (val === "dark" || val === "light") return val;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch {}
  return "light";
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const val = localStorage.getItem("cb_puja_lang") as Language | null;
    if (val === "bn" || val === "en") return val;
  } catch {}
  return "en";
}

function getSeniorModeSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem("cb_puja_senior_mode") === "true";
  } catch {}
  return false;
}

// Server snapshots
const getServerTheme = () => "light" as Theme;
const getServerLanguage = () => "en" as Language;
const getServerSeniorMode = () => false;

export function PreferenceProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerTheme);
  const language = useSyncExternalStore(subscribe, getLanguageSnapshot, getServerLanguage);
  const seniorMode = useSyncExternalStore(subscribe, getSeniorModeSnapshot, getServerSeniorMode);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("cb_puja_theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
    } catch {}
    notify();
  };

  const toggleLanguage = () => {
    const next: Language = language === "en" ? "bn" : "en";
    try {
      localStorage.setItem("cb_puja_lang", next);
    } catch {}
    notify();
  };

  const toggleSeniorMode = () => {
    const next = !seniorMode;
    try {
      localStorage.setItem("cb_puja_senior_mode", String(next));
      document.documentElement.classList.toggle("senior-mode", next);
    } catch {}
    notify();
  };

  return (
    <PreferenceContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        toggleLanguage,
        seniorMode,
        toggleSeniorMode,
      }}
    >
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferenceContext);
  if (!context) {
    return {
      theme: "light" as Theme,
      toggleTheme: () => {},
      language: "en" as Language,
      toggleLanguage: () => {},
      seniorMode: false,
      toggleSeniorMode: () => {},
    };
  }
  return context;
}
