"use client";

import React, { useState } from "react";
import {
  Languages,
  Menu,
  MapPin,
  Bookmark,
  PhoneCall,
  Accessibility,
  X,
} from "lucide-react";
import { usePreferences } from "../preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";
import { NavItemKey } from "./BottomNavigation";

export interface HeaderProps {
  onNavigateTab?: (tab: NavItemKey) => void;
}

export function Header({ onNavigateTab }: HeaderProps) {
  const { language, toggleLanguage, seniorMode, toggleSeniorMode } = usePreferences();
  const strings = UI_STRINGS[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFFDF7] dark:bg-[#1C1917] border-b border-[#E7E0D2] dark:border-[#44403C] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            {/* Brand: small Durga avatar + app name */}
            <button
              type="button"
              className="flex items-center gap-2.5 min-w-0 cursor-pointer focus-ring rounded-lg"
              onClick={() => onNavigateTab && onNavigateTab("home")}
              aria-label="Go to home"
            >
              {/* Maa Durga avatar — small circular portrait */}
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#D4A72C] shrink-0 shadow-sm bg-[#FFF8E7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/maa-durga.jpg"
                  alt="Maa Durga — Cooch Behar Puja Guide"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight text-[#292524] dark:text-stone-100 truncate block leading-tight">
                  {strings.appName}
                </span>
                <span className="text-[11px] text-[#78716C] dark:text-stone-400 truncate block">
                  {language === "bn" ? "কোচবিহার • ইন্টারেক্টিভ ম্যাপ" : "Cooch Behar • Interactive Map"}
                </span>
              </div>
            </button>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Language Toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={strings.langToggleAria}
                title={strings.langToggleAria}
                className="touch-target-min px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[#E7E0D2] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#292524] dark:text-stone-200 hover:bg-[#FFF8E7] dark:hover:bg-stone-800 focus-ring transition-colors cursor-pointer flex items-center gap-1"
              >
                <Languages className="w-3.5 h-3.5 text-[#C8102E]" aria-hidden="true" />
                <span>{language === "en" ? "বাং" : "ENG"}</span>
              </button>

              {/* Senior Mode — desktop only */}
              <button
                type="button"
                onClick={toggleSeniorMode}
                aria-pressed={seniorMode}
                aria-label="Toggle Senior Citizen Mode"
                title="Senior Citizen Mode: Larger text & touch targets"
                className={`touch-target-min px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-ring hidden sm:inline-flex items-center gap-1.5 ${
                  seniorMode
                    ? "bg-[#FFF8E7] border-[#D4A72C] text-[#92400E] font-semibold"
                    : "bg-white dark:bg-stone-900 border-[#E7E0D2] dark:border-stone-700 text-[#78716C] dark:text-stone-300 hover:bg-[#FFF8E7]"
                }`}
              >
                <Accessibility className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>{seniorMode ? "Senior: ON" : "Senior"}</span>
              </button>

              {/* Menu button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open emergency & guide menu"
                className="touch-target-min w-10 h-10 rounded-lg flex items-center justify-center text-[#78716C] dark:text-stone-300 hover:bg-[#FFF8E7] dark:hover:bg-stone-800 focus-ring cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-over Menu Drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation and emergency menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <div className="relative ml-auto w-80 max-w-full bg-[#FFFDF7] dark:bg-[#1C1917] h-full shadow-2xl flex flex-col overflow-y-auto slide-up">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E0D2] dark:border-stone-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4A72C] bg-[#FFF8E7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/maa-durga.jpg" alt="Maa Durga" width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-sm text-[#292524] dark:text-stone-100">{strings.appName}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="touch-target-min w-9 h-9 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#F4F1E8] focus-ring cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-5 py-4 space-y-5">
              {/* Senior mode — mobile */}
              <div className="p-3.5 rounded-xl bg-[#FFF8E7] border border-[#E7E0D2] flex items-center justify-between gap-3 sm:hidden">
                <div>
                  <p className="font-semibold text-xs text-[#292524] dark:text-stone-100">Senior Citizen Mode</p>
                  <p className="text-[11px] text-[#78716C]">Larger text & simplified controls</p>
                </div>
                <button
                  type="button"
                  onClick={toggleSeniorMode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border touch-target-min ${
                    seniorMode
                      ? "bg-[#D4A72C] text-white border-[#D4A72C]"
                      : "bg-white text-[#292524] border-[#E7E0D2]"
                  }`}
                >
                  {seniorMode ? "Enabled" : "Enable"}
                </button>
              </div>

              {/* Navigation shortcuts */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-widest block mb-2">Quick Navigation</span>
                {[
                  { key: "map" as NavItemKey,     icon: MapPin,    label: "Interactive Pandal Map" },
                  { key: "pandals" as NavItemKey, icon: MapPin,    label: "Complete Pandal Directory" },
                  { key: "gallery" as NavItemKey, icon: MapPin,    label: "Pandal Gallery" },
                  { key: "saved" as NavItemKey,   icon: Bookmark,  label: "My Saved Route & Pandals" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    id={`menu-nav-${key}`}
                    onClick={() => { setIsMenuOpen(false); onNavigateTab?.(key); }}
                    className="touch-target-min w-full px-3 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E7E0D2] dark:border-stone-700 hover:border-[#D4A72C] flex items-center gap-3 text-xs sm:text-sm text-[#292524] dark:text-stone-200 text-left cursor-pointer transition-colors focus-ring"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#FFF0F0] flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                    </span>
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>

              {/* Emergency contacts */}
              <div className="p-4 rounded-xl bg-[#FFF0F0] border border-[#FECACA] space-y-2.5">
                <span className="text-xs font-bold text-[#9F1239] flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Emergency Contacts
                </span>
                <div className="text-xs text-[#292524] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#78716C]">Kotwali Police</span>
                    <a href="tel:03582222303" className="font-mono font-bold text-[#C8102E] focus-ring rounded">03582-222303</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#78716C]">MJN Hospital</span>
                    <a href="tel:03582222238" className="font-mono font-bold text-[#C8102E] focus-ring rounded">03582-222238</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#78716C]">Emergency</span>
                    <a href="tel:112" className="font-mono font-bold text-[#C8102E] focus-ring rounded">112</a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#78716C]">Ambulance</span>
                    <a href="tel:102" className="font-mono font-bold text-[#C8102E] focus-ring rounded">102</a>
                  </div>
                </div>
              </div>

              {/* Festival context */}
              <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D2] text-[11px] text-[#78716C] leading-relaxed">
                <span className="font-semibold text-[#292524] block mb-1">Crowd & Route Advisory</span>
                All crowd density and route information is community-contributed. Always follow instructions from Cooch Behar Police and on-duty volunteers during Saptami–Navami.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
