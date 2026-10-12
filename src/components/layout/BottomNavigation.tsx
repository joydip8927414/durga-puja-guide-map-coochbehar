"use client";

import React from "react";
import { Home, Compass, Map, Bookmark, MoreHorizontal } from "lucide-react";
import { usePreferences } from "../preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";

export type NavItemKey = "home" | "explore" | "map" | "saved" | "more";

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
  }> = [
    { key: "home", label: strings.navHome, icon: Home },
    { key: "explore", label: strings.navExplore, icon: Compass },
    { key: "map", label: strings.navMap, icon: Map },
    { key: "saved", label: strings.navSaved, icon: Bookmark },
    { key: "more", label: strings.navMore, icon: MoreHorizontal },
  ];

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onTabChange && onTabChange(item.key)}
              aria-current={isActive ? "page" : undefined}
              className={`touch-target-min flex flex-col items-center justify-center gap-1 transition-colors select-none focus-ring rounded-xl cursor-pointer ${
                isActive
                  ? "text-[#881337] dark:text-[#F59E0B] font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-[#881337]/10 dark:bg-[#F59E0B]/15" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              </div>
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
