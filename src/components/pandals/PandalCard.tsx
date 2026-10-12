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
      className={`relative rounded-2xl bg-white dark:bg-stone-900 border border-[#E7E0D2] dark:border-stone-700 p-4 shadow-sm flex flex-col justify-between pandal-card-hover ${className}`}
    >
      <div>
        {/* Top Badges & Save Control */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {tier === "top_5" && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C8102E] text-white">
                ★ Heritage
              </span>
            )}
            {tier === "top_10" && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0F0] text-[#C8102E] border border-[#FECACA]">
                Top 10
              </span>
            )}
            {tier === "top_20" && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F4F1E8] text-[#78716C] border border-[#E7E0D2]">
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
            className={`touch-target-min w-10 h-10 -mr-1.5 -mt-1.5 rounded-xl flex items-center justify-center transition-colors focus-ring cursor-pointer shrink-0 ${
              isSaved
                ? "text-[#D4A72C] bg-[#FFF8E7] border border-[#D4A72C]/30"
                : "text-[#A8A29E] hover:text-[#78716C] hover:bg-[#F4F1E8]"
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
        <h3 className="text-base font-semibold text-[#292524] dark:text-stone-100 leading-snug">
          {name}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#78716C] dark:text-stone-400">
          <MapPin className="w-3.5 h-3.5 text-[#A8A29E] shrink-0" aria-hidden="true" />
          <span className="truncate">{zone}</span>
        </div>

        {/* Milestone Note */}
        {milestoneYear && (
          <p className="mt-1.5 text-xs text-[#78716C] dark:text-stone-400">
            {milestoneYear}
          </p>
        )}

        {/* Transport & Latest Report Metadata */}
        <div className="mt-3 pt-2.5 border-t border-[#E7E0D2] dark:border-stone-700 flex flex-wrap items-center justify-between gap-2 text-xs text-[#78716C] dark:text-stone-400">
          <div className="flex items-center gap-1">
            {vehicleAllowed === "all_vehicles" ? (
              <span className="inline-flex items-center gap-1 text-[#292524] dark:text-stone-300">
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                Toto / Parking Near
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#292524] dark:text-stone-300">
                <Footprints className="w-3.5 h-3.5 text-[#D97706]" />
                Walk Zone (~100m)
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#A8A29E]">
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
          className="touch-target-min w-full py-2.5 px-3 rounded-xl bg-[#FFFDF7] hover:bg-[#FFF8E7] dark:bg-stone-800 dark:hover:bg-stone-700 border border-[#E7E0D2] dark:border-stone-700 text-xs sm:text-sm font-semibold text-[#292524] dark:text-stone-200 transition-colors focus-ring cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5 text-[#C8102E]" />
          <span>View on Map & Details</span>
        </button>
      </div>
    </article>
  );
}
