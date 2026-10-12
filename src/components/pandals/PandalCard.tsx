"use client";

import React from "react";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Footprints,
  Car,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { StatusBadge, StatusLevel } from "../ui/StatusBadge";
import { Button } from "../ui/Button";

export interface PandalCardProps {
  id: string;
  codeName: string;
  name: string;
  zone: string;
  tier: "top_5" | "top_10" | "top_20" | "general";
  crowdLevel?: "LOW" | "MED" | "HIGH";
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
      className={`group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#881337] dark:hover:border-[#F59E0B] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Top Badges: Tier & Bookmark Control */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {tier === "top_5" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#881337] text-white">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                Top 5 Heritage
              </span>
            )}
            {tier === "top_10" && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#9F1239]/15 text-[#881337] dark:text-rose-300 dark:bg-[#9F1239]/30">
                Top 10
              </span>
            )}
            {tier === "top_20" && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
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
            title={isSaved ? "Saved in itinerary" : "Save to itinerary"}
            className={`touch-target-min w-11 h-11 rounded-full flex items-center justify-center transition-colors focus-ring cursor-pointer shrink-0 ${
              isSaved
                ? "bg-[#D97706]/15 text-[#D97706] dark:text-[#F59E0B]"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Pandal Title & Zone */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#881337] dark:group-hover:text-[#F59E0B] transition-colors leading-snug">
          {name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-[#881337] dark:text-[#F59E0B] shrink-0" aria-hidden="true" />
          <span className="truncate">{zone}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-[11px] text-slate-400">#{codeName}</span>
        </div>

        {/* Milestone / Heritage Details */}
        {milestoneYear && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium italic">
            {milestoneYear}
          </p>
        )}

        {/* Accessibility & Transport Indicator */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          {vehicleAllowed === "all_vehicles" ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <Car className="w-3.5 h-3.5" />
              Toto / Vehicle Parking Near
            </span>
          ) : vehicleAllowed === "two_wheeler_only" ? (
            <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
              <Footprints className="w-3.5 h-3.5" />
              Two-wheeler / 100m Walk Zone
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Footprints className="w-3.5 h-3.5" />
              Pedestrian Corridor Only
            </span>
          )}

          {isVerified ? (
            <span className="ml-auto text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
              ✓ Verified
            </span>
          ) : (
            <span className="ml-auto text-[10px] uppercase font-medium text-slate-400">
              Dev Candidate
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-2">
        <Button
          variant="outline"
          fullWidth
          onClick={() => onSelect && onSelect(id)}
          className="text-xs sm:text-sm py-2.5 hover:border-[#881337] hover:text-[#881337] dark:hover:border-[#F59E0B] dark:hover:text-[#F59E0B]"
        >
          <span>View Details & Route</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </article>
  );
}
