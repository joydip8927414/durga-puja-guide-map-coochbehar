"use client";

import React, { useState } from "react";
import {
  Compass,
  Search,
  Languages,
  Menu,
  Sparkles,
  MapPin,
  Bookmark,
  Info,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { SeniorModeToggle } from "../accessibility/SeniorModeToggle";
import { usePreferences } from "../preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";
import { ModalShell } from "../ui/ModalShell";

export interface HeaderProps {
  onSearchClick?: () => void;
}

export function Header({ onSearchClick }: HeaderProps) {
  const { language, toggleLanguage } = usePreferences();
  const strings = UI_STRINGS[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#881337] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#9F1239]">
              <Compass className="w-6 h-6 text-[#F59E0B]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
                {strings.appName}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden xs:block">
                Cooch Behar, West Bengal
              </p>
            </div>
          </div>

          {/* Controls: Search, Language, Theme, Senior Mode, Secondary Menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Quick Search Shortcut button for Mobile Header */}
            {onSearchClick && (
              <button
                type="button"
                onClick={onSearchClick}
                aria-label={strings.searchAriaLabel}
                className="touch-target-min w-11 h-11 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring cursor-pointer sm:hidden"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Language Toggle (Bengali / English) */}
            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={strings.langToggleAria}
              title={strings.langToggleAria}
              className="touch-target-min px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Languages className="w-4 h-4 text-[#881337] dark:text-[#F59E0B]" aria-hidden="true" />
              <span>{language === "en" ? "বাংলা" : "ENG"}</span>
            </button>

            {/* Light / Dark Theme Toggle */}
            <ThemeToggle />

            {/* Senior Mode Toggle (Visible on tablet/desktop, in menu on mobile) */}
            <div className="hidden md:block">
              <SeniorModeToggle />
            </div>

            {/* Secondary Menu Button for accessibility dialog / info */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open information and navigation menu"
              className="touch-target-min w-11 h-11 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-ring cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation & Information Modal */}
      <ModalShell
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={strings.appName}
        description="Festival guide settings, accessibility, and emergency contacts"
      >
        <div className="space-y-6">
          {/* Senior Mode in Menu for Mobile */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              Accessibility Preferences
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              {strings.seniorModeDesc}
            </p>
            <SeniorModeToggle className="w-full justify-center" />
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
              Guide Shortcuts
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <a
                href="#pandals-section"
                onClick={() => setIsMenuOpen(false)}
                className="touch-target-min px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-[#881337] flex items-center gap-3 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#881337] dark:text-[#F59E0B]" />
                <span>Explore Top Pandals</span>
              </a>
              <a
                href="#essential-services"
                onClick={() => setIsMenuOpen(false)}
                className="touch-target-min px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-[#881337] flex items-center gap-3 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Emergency Services & Helplines</span>
              </a>
              <a
                href="#saved-section"
                onClick={() => setIsMenuOpen(false)}
                className="touch-target-min px-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-[#881337] flex items-center gap-3 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Bookmark className="w-4 h-4 text-[#D97706]" />
                <span>My Saved Itinerary</span>
              </a>
            </div>
          </div>

          {/* Verified Notice & Police Helpline */}
          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-[#881337] dark:text-rose-300 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Police Control Room
            </p>
            <p>Kotwali Police Station: 03582-222303 / 112</p>
            <p>District Emergency Assistance: 1077</p>
          </div>
        </div>
      </ModalShell>
    </header>
  );
}
