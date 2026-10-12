"use client";

import React from "react";
import { Home, Compass, Map, ImageIcon, MoreHorizontal } from "lucide-react";
import { usePreferences } from "../preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";

export type NavItemKey = "home" | "pandals" | "map" | "gallery" | "saved" | "more";

export interface BottomNavigationProps {
  activeTab?: NavItemKey;
  onTabChange?: (tab: NavItemKey) => void;
}

export function BottomNavigation({
  activeTab = "map",
  onTabChange,
}: BottomNavigationProps) {
  const { language } = usePreferences();
  const strings = UI_STRINGS[language];

  const navItems: Array<{
    key: NavItemKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isCenterMap?: boolean;
  }> = [
    { key: "home",    label: strings.navHome,                               icon: Home },
    { key: "pandals", label: language === "bn" ? "মণ্ডপ" : "Pandals",     icon: Compass },
    { key: "map",     label: strings.navMap,                                icon: Map, isCenterMap: true },
    { key: "gallery", label: language === "bn" ? "গ্যালারি" : "Gallery",   icon: ImageIcon },
    { key: "more",    label: strings.navMore,                               icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF7] dark:bg-[#1C1917] border-t border-[#E7E0D2] dark:border-[#44403C] shadow-sm md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-end px-1 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          if (item.isCenterMap) {
            return (
              <button
                key={item.key}
                type="button"
                id={`nav-${item.key}`}
                onClick={() => onTabChange && onTabChange(item.key)}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                className="flex flex-col items-center justify-end pb-1 gap-1 -mt-4 focus-ring select-none cursor-pointer group"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? "bg-[#C8102E] text-white ring-4 ring-[#C8102E]/20 scale-105"
                      : "bg-[#9F1239] text-white hover:bg-[#C8102E]"
                  }`}
                >
                  <Map className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    isActive ? "text-[#C8102E] dark:text-[#F59E0B]" : "text-[#78716C] dark:text-stone-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              id={`nav-${item.key}`}
              onClick={() => onTabChange && onTabChange(item.key)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={`touch-target-min flex flex-col items-center justify-center gap-0.5 transition-colors select-none focus-ring cursor-pointer ${
                isActive
                  ? "text-[#C8102E] dark:text-[#F59E0B]"
                  : "text-[#78716C] dark:text-stone-400 hover:text-[#292524] dark:hover:text-stone-200"
              }`}
            >
              <div className={`relative ${isActive ? "text-[#C8102E]" : ""}`}>
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.2]" : "stroke-[1.7]"}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#D4A72C]" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight truncate max-w-[56px] ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
