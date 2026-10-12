"use client";

import React, { useState } from "react";
import {
  Compass,
  Search,
  Languages,
  Menu,
  MapPin,
  Bookmark,
  PhoneCall,
  Accessibility,
} from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { usePreferences } from "../preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";
import { ModalShell } from "../ui/ModalShell";

export interface HeaderProps {
  onSearchClick?: () => void;
  onNavigateTab?: (tab: "home" | "pandals" | "map" | "saved" | "more") => void;
}

export function Header({ onSearchClick, onNavigateTab }: HeaderProps) {
  const { language, toggleLanguage, seniorMode, toggleSeniorMode } = usePreferences();
  const strings = UI_STRINGS[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand & Emblem */}
          <div
            className="flex items-center gap-2.5 min-w-0 cursor-pointer"
            onClick={() => onNavigateTab && onNavigateTab("home")}
          >
            <div className="w-9 h-9 rounded-lg bg-[#9F1239] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Compass className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate block">
                {strings.appName}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                Cooch Behar • Interactive Map
              </span>
            </div>
          </div>

          {/* Quick Actions (Desktop & Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Search Shortcut button for Mobile Header */}
            {onSearchClick && (
              <button
                type="button"
                onClick={onSearchClick}
                aria-label={strings.searchAriaLabel}
                className="touch-target-min w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring cursor-pointer sm:hidden"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Language Toggle (Bengali / English) */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={strings.langToggleAria}
              title={strings.langToggleAria}
              className="touch-target-min px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer flex items-center gap-1"
            >
              <Languages className="w-3.5 h-3.5 text-[#9F1239]" aria-hidden="true" />
              <span>{language === "en" ? "বাংলা" : "ENG"}</span>
            </button>

            {/* Senior Mode Quick Button (Visible on md+) */}
            <button
              type="button"
              onClick={toggleSeniorMode}
              aria-pressed={seniorMode}
              aria-label="Toggle Senior Citizen Mode"
              title="Senior Citizen Mode: Larger text & touch targets"
              className={`touch-target-min px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-ring hidden sm:inline-flex items-center gap-1.5 ${
                seniorMode
                  ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <Accessibility className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{seniorMode ? "Senior: ON" : "Senior"}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle className="w-10 h-10" />

            {/* Secondary Menu Button for Emergency & Info */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open emergency & guide menu"
              className="touch-target-min w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Guide & Emergency Menu Modal */}
      <ModalShell
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={strings.appName}
        description="Navigation shortcuts, accessibility, and emergency hotlines"
      >
        <div className="space-y-4">
          {/* Senior Mode Toggle for Mobile */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 sm:hidden">
            <div>
              <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Senior Citizen Mode
              </p>
              <p className="text-[11px] text-slate-500">Larger text and simplified touch targets</p>
            </div>
            <button
              type="button"
              onClick={toggleSeniorMode}
              className={`touch-target-min px-3 py-1.5 rounded-md text-xs font-semibold border ${
                seniorMode
                  ? "bg-[#D97706] text-white border-[#D97706]"
                  : "bg-white text-slate-800 border-slate-300"
              }`}
            >
              {seniorMode ? "Enabled" : "Enable"}
            </button>
          </div>

          {/* Quick Destination Links */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Direct Navigation
            </span>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                if (onNavigateTab) onNavigateTab("map");
              }}
              className="touch-target-min w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#9F1239] flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#9F1239]" />
              <span>Full Screen Interactive Map</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                if (onNavigateTab) onNavigateTab("pandals");
              }}
              className="touch-target-min w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#9F1239] flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#9F1239]" />
              <span>Complete Pandal Directory</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                if (onNavigateTab) onNavigateTab("saved");
              }}
              className="touch-target-min w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#9F1239] flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 text-left cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-[#D97706]" />
              <span>My Saved Route & Pandals</span>
            </button>
          </div>

          {/* Emergency Hotlines */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#9F1239]" />
              Essential Emergency Contacts
            </span>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p>• Kotwali Police Station: 03582-222303 / 112</p>
              <p>• MJN Hospital Emergency: 03582-222238 / 102</p>
              <p>• Fire Station: 03582-222201 / 101</p>
            </div>
          </div>
        </div>
      </ModalShell>
    </header>
  );
}
