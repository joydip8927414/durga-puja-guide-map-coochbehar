"use client";

import React from "react";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Footprints,
  Car,
  Clock,
  Navigation,
} from "lucide-react";
import { StatusBadge, StatusLevel } from "../ui/StatusBadge";

export interface PandalCardProps {
  id: string;
  codeName: string;
  name: string;
  zone: string;
  tier: "top_5" | "top_10" | "top_20" | "general";
  crowdLevel?: "LOW" | "MED" | "HIGH";
  reportTime?: string;
  vehicleAllowed?: "none" | "two_wheeler_only" | "all_vehicles";
  milestoneYear?: string | null;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (id: string) => void;
  isVerified?: boolean;
  className?: string;
}

export function PandalCard({
  id,
  codeName,
  name,
  zone,
  tier,
  crowdLevel = "MED",
  reportTime = "15m ago",
  vehicleAllowed = "two_wheeler_only",
  milestoneYear,
  isSaved = false,
  onToggleSave,
  onSelect,
  isVerified = false,
  className = "",
}: PandalCardProps) {
  const crowdStatusMap: Record<string, StatusLevel> = {
    LOW: "low",
    MED: "moderate",
    HIGH: "heavy",
  };

  const crowdLabels: Record<string, string> = {
    LOW: "Low Crowd",
    MED: "Moderate Crowd",
    HIGH: "Heavy Crowd",
  };

  return (
    <article
      className={`relative rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Badges & Save Control */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {tier === "top_5" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#9F1239] text-white">
                Top 5 Heritage
              </span>
            )}
            {tier === "top_10" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-[#9F1239] border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
                Top 10
              </span>
            )}
            {tier === "top_20" && (
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                Top 20
              </span>
            )}
            <StatusBadge
              level={crowdStatusMap[crowdLevel] || "moderate"}
              label={crowdLabels[crowdLevel]}
              size="sm"
            />
          </div>

          {/* Bookmark Button (48px min touch target) */}
          <button
            type="button"
            onClick={() => onToggleSave && onToggleSave(id)}
            aria-label={isSaved ? `Remove ${name} from saved` : `Save ${name} to itinerary`}
            title={isSaved ? "Saved" : "Save"}
            className={`touch-target-min w-10 h-10 -mr-1.5 -mt-1.5 rounded-lg flex items-center justify-center transition-colors focus-ring cursor-pointer shrink-0 ${
              isSaved
                ? "text-[#D97706]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Pandal Name & Zone */}
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">
          {name}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="truncate">{zone}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-[11px] text-slate-400">#{codeName}</span>
        </div>

        {/* Milestone Note */}
        {milestoneYear && (
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
            {milestoneYear}
          </p>
        )}

        {/* Transport & Latest Report Metadata */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            {vehicleAllowed === "all_vehicles" ? (
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                Toto / Parking Near
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Footprints className="w-3.5 h-3.5 text-amber-600" />
                Walk Zone (~100m)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{reportTime}</span>
            {isVerified && <span className="text-emerald-600 font-medium ml-1">✓ Verified</span>}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2">
        <button
          type="button"
          onClick={() => onSelect && onSelect(id)}
          className="touch-target-min w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors focus-ring cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5 text-[#9F1239]" />
          <span>View on Map & Details</span>
        </button>
      </div>
    </article>
  );
}
