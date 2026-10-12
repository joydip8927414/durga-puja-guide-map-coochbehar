"use client";

import React from "react";
import { Home, Compass, Map, Bookmark, MoreHorizontal } from "lucide-react";
import { usePreferences } from "../preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";

export type NavItemKey = "home" | "pandals" | "map" | "saved" | "more";

export interface BottomNavigationProps {
  activeTab?: NavItemKey;
  onTabChange?: (tab: NavItemKey) => void;
}

export function BottomNavigation({
  activeTab = "home",
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
    { key: "home", label: strings.navHome, icon: Home },
    { key: "pandals", label: language === "bn" ? "মণ্ডপ" : "Pandals", icon: Compass },
    { key: "map", label: strings.navMap, icon: Map, isCenterMap: true },
    { key: "saved", label: strings.navSaved, icon: Bookmark },
    { key: "more", label: strings.navMore, icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xs md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          if (item.isCenterMap) {
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onTabChange && onTabChange(item.key)}
                aria-current={isActive ? "page" : undefined}
                className="touch-target-min flex flex-col items-center justify-center -mt-3.5 focus-ring select-none cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform ${
                    isActive
                      ? "bg-[#9F1239] text-white ring-2 ring-rose-300"
                      : "bg-[#9F1239] text-white hover:bg-[#881337]"
                  }`}
                >
                  <Map className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] mt-0.5 font-bold tracking-tight ${
                    isActive ? "text-[#9F1239] dark:text-[#F59E0B]" : "text-slate-600 dark:text-slate-400"
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
              onClick={() => onTabChange && onTabChange(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={`touch-target-min flex flex-col items-center justify-center gap-1 transition-colors select-none focus-ring cursor-pointer ${
                isActive
                  ? "text-[#9F1239] dark:text-[#F59E0B] font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.2]" : "stroke-[1.7]"}`} />
              <span className="text-[10px] tracking-tight truncate max-w-[56px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
