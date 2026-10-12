"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Navigation,
  Bookmark,
  BookmarkCheck,
  Compass,
  Plus,
  Minus,
  Footprints,
  Car,
  Clock,
  Layers,
  MapPin,
  X,
} from "lucide-react";
import { PandalCardProps } from "../pandals/PandalCard";
import { StatusBadge } from "../ui/StatusBadge";
import { FilterChip } from "../ui/FilterChip";

export interface PandalMapViewProps {
  pandals: PandalCardProps[];
  savedPandalIds: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenDetailsModal: (pandal: PandalCardProps) => void;
  className?: string;
}

// Bounding coordinates for Cooch Behar town view
// Cooch Behar center: 26.3239 N, 89.4510 E
interface MapCoordinatePoint {
  id: string;
  name: string;
  codeName: string;
  lat: number;
  lng: number;
  pandal: PandalCardProps;
}

export function PandalMapView({
  pandals,
  savedPandalIds,
  onToggleSave,
  onOpenDetailsModal,
  className = "",
}: PandalMapViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPandalId, setSelectedPandalId] = useState<string | null>(pandals[0]?.id || null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRouteLine, setShowRouteLine] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);

  // Geographic mapping to SVG coordinates
  // Range: Lat 26.305 to 26.355, Lng 89.420 to 89.480
  const minLat = 26.305;
  const maxLat = 26.355;
  const minLng = 89.42;
  const maxLng = 89.48;

  // Convert lat/lng to percentage X/Y
  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Latitude is inverted on Y axis (higher lat = higher up = lower Y)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  };

  // Mock geographic placements aligned with real Cooch Behar localities
  const geoPoints: MapCoordinatePoint[] = useMemo(() => {
    const coordsMap: Record<string, { lat: number; lng: number }> = {
      "boro-debi-bari": { lat: 26.3245, lng: 89.4522 },
      "subhash-pally-club": { lat: 26.3288, lng: 89.4455 },
      "guriahati-club": { lat: 26.3122, lng: 89.4678 },
      "khagrabari-club": { lat: 26.3456, lng: 89.4312 },
      "rocky-club": { lat: 26.3195, lng: 89.4421 },
    };

    return pandals.map((p) => {
      const c = coordsMap[p.codeName] || { lat: 26.3239, lng: 89.451 };
      return {
        id: p.id,
        name: p.name,
        codeName: p.codeName,
        lat: c.lat,
        lng: c.lng,
        pandal: p,
      };
    });
  }, [pandals]);

  // Filtered map pins
  const filteredPins = useMemo(() => {
    return geoPoints.filter((pt) => {
      if (showNearbyOnly) {
        // Town center radius only
        if (pt.codeName === "khagrabari-club" || pt.codeName === "guriahati-club") return false;
      }
      if (selectedFilter === "top_5" && pt.pandal.tier !== "top_5") return false;
      if (selectedFilter === "top_10" && pt.pandal.tier !== "top_5" && pt.pandal.tier !== "top_10")
        return false;
      if (selectedFilter === "low_crowd" && pt.pandal.crowdLevel !== "LOW") return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          pt.name.toLowerCase().includes(q) ||
          pt.pandal.zone.toLowerCase().includes(q) ||
          pt.codeName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [geoPoints, selectedFilter, searchQuery, showNearbyOnly]);

  const selectedPandal = useMemo(() => {
    return pandals.find((p) => p.id === selectedPandalId) || null;
  }, [pandals, selectedPandalId]);

  return (
    <div
      className={`relative w-full h-[calc(100vh-8.5rem)] md:h-[calc(100vh-5.5rem)] bg-[#EBF2F7] dark:bg-[#0F172A] overflow-hidden select-none flex flex-col ${className}`}
    >
      {/* 1. Top Controls Bar: Search & Filter Pills */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 max-w-xl mx-auto pointer-events-none">
        {/* Search Bar */}
        <div className="pointer-events-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center px-3 py-1.5 gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pandals on map..."
            className="w-full text-xs sm:text-sm bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 py-1"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
            {filteredPins.length} shown
          </span>
        </div>

        {/* Compact Filter Row */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <FilterChip
            label="All"
            count={pandals.length}
            active={selectedFilter === "all" && !showNearbyOnly}
            onClick={() => {
              setSelectedFilter("all");
              setShowNearbyOnly(false);
            }}
            className="shadow-2xs text-xs py-1 px-2.5 h-8 min-h-0"
          />
          <FilterChip
            label="Top 5"
            active={selectedFilter === "top_5"}
            onClick={() => setSelectedFilter("top_5")}
            className="shadow-2xs text-xs py-1 px-2.5 h-8 min-h-0"
          />
          <FilterChip
            label="Top 10"
            active={selectedFilter === "top_10"}
            onClick={() => setSelectedFilter("top_10")}
            className="shadow-2xs text-xs py-1 px-2.5 h-8 min-h-0"
          />
          <FilterChip
            label="Low Crowd"
            active={selectedFilter === "low_crowd"}
            onClick={() => setSelectedFilter("low_crowd")}
            className="shadow-2xs text-xs py-1 px-2.5 h-8 min-h-0"
          />
        </div>
      </div>

      {/* 2. Map Canvas (Clean Vector Map Representation with Real Road Geometry of Cooch Behar) */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "50% 50%",
          }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Map Base Canvas */}
          <rect width="1000" height="800" fill="#F1F5F9" />
          <rect width="1000" height="800" fill="url(#grid)" />

          {/* Torsa River representation (flows southwest through Cooch Behar) */}
          <path
            d="M 120 0 Q 250 250 320 400 T 260 800"
            fill="none"
            stroke="#BAE6FD"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 120 0 Q 250 250 320 400 T 260 800"
            fill="none"
            stroke="#7DD3FC"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <text x="210" y="320" fill="#0284C7" fontSize="11" fontWeight="600" opacity="0.8">
            Torsa River
          </text>

          {/* Sagar Dighi Water Body */}
          <rect x="520" y="370" width="80" height="60" rx="10" fill="#7DD3FC" stroke="#38BDF8" strokeWidth="2" />
          <text x="532" y="405" fill="#0369A1" fontSize="10" fontWeight="bold">
            Sagar Dighi
          </text>

          {/* Major Roads / Arterial Corridors of Cooch Behar */}
          {/* N.N. Road / Station Road */}
          <path d="M 200 420 L 850 390" fill="none" stroke="#CBD5E1" strokeWidth="12" />
          <path d="M 200 420 L 850 390" fill="none" stroke="#FFFFFF" strokeWidth="8" />

          {/* B.S. Road (Bhabaniganj Street) */}
          <path d="M 560 120 L 550 720" fill="none" stroke="#CBD5E1" strokeWidth="10" />
          <path d="M 560 120 L 550 720" fill="none" stroke="#FFFFFF" strokeWidth="6" />

          {/* Bypass Connector to Khagrabari */}
          <path d="M 320 180 L 820 160" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <path d="M 320 180 L 820 160" fill="none" stroke="#FFFFFF" strokeWidth="5" />

          {/* Guriahati Link Road */}
          <path d="M 550 480 L 880 680" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <path d="M 550 480 L 880 680" fill="none" stroke="#FFFFFF" strokeWidth="5" />

          {/* Cooch Behar Palace Ground area */}
          <rect x="420" y="240" width="90" height="70" rx="8" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1.5" />
          <text x="432" y="280" fill="#15803D" fontSize="10" fontWeight="bold">
            Rajbari Park
          </text>

          {/* Route Line Connector if active */}
          {showRouteLine && (
            <path
              d="M 550 400 L 480 340 L 720 580 L 380 220"
              fill="none"
              stroke="#9F1239"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
          )}

          {/* Interactive Pandal Markers */}
          {filteredPins.map((pt) => {
            const pos = getMapPosition(pt.lat, pt.lng);
            // Map percentage to 1000x800 SVG canvas
            const cx = (pos.x / 100) * 1000;
            const cy = (pos.y / 100) * 800;
            const isSelected = pt.id === selectedPandalId;

            // Marker colors based on crowd status
            const markerBg =
              pt.pandal.crowdLevel === "LOW"
                ? "#10B981"
                : pt.pandal.crowdLevel === "HIGH"
                ? "#E11D48"
                : "#F59E0B";

            return (
              <g
                key={pt.id}
                onClick={() => setSelectedPandalId(pt.id)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                {/* Selected pulse ring */}
                {isSelected && (
                  <circle cx={cx} cy={cy - 22} r="26" fill="#9F1239" opacity="0.18" />
                )}

                {/* Marker Pin Body */}
                <path
                  d={`M ${cx} ${cy} L ${cx - 14} ${cy - 24} A 14 14 0 1 1 ${cx + 14} ${cy - 24} Z`}
                  fill={isSelected ? "#9F1239" : "#FFFFFF"}
                  stroke={isSelected ? "#881337" : "#64748B"}
                  strokeWidth={isSelected ? "2" : "1.5"}
                  filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.2))"
                />

                {/* Status Indicator Dot inside Pin */}
                <circle cx={cx} cy={cy - 24} r="6.5" fill={markerBg} />

                {/* Label Tag below marker */}
                <rect
                  x={cx - 50}
                  y={cy + 4}
                  width="100"
                  height="18"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#CBD5E1"
                  strokeWidth="0.8"
                />
                <text
                  x={cx}
                  y={cy + 16}
                  fill="#1E293B"
                  fontSize="9.5"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {pt.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 3. Floating Map Controls (Right Side) */}
        <div className="absolute right-3 bottom-36 sm:bottom-32 z-20 flex flex-col gap-2">
          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
            aria-label="Zoom in on map"
            className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 focus-ring"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
            aria-label="Zoom out on map"
            className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 focus-ring"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Center / Locate Me */}
          <button
            type="button"
            onClick={() => {
              setZoomLevel(1);
              setSelectedPandalId(pandals[0]?.id || null);
            }}
            aria-label="Reset map center"
            title="Recenter Map"
            className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 focus-ring"
          >
            <Compass className="w-4 h-4 text-[#9F1239]" />
          </button>
        </div>

        {/* 4. Floating Action Pills (Left Bottom - Inspired by Screenshot) */}
        <div className="absolute left-3 bottom-36 sm:bottom-32 z-20 flex flex-col gap-2">
          {/* Nearby Pandals Toggle */}
          <button
            type="button"
            onClick={() => setShowNearbyOnly((prev) => !prev)}
            aria-pressed={showNearbyOnly}
            className={`touch-target-min px-3 py-2 rounded-lg text-xs font-semibold shadow-md border transition-colors flex items-center gap-1.5 ${
              showNearbyOnly
                ? "bg-[#9F1239] text-white border-[#9F1239]"
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Nearby Pandals</span>
          </button>

          {/* Route Line Toggle */}
          <button
            type="button"
            onClick={() => setShowRouteLine((r) => !r)}
            aria-pressed={showRouteLine}
            className={`touch-target-min px-3 py-2 rounded-lg text-xs font-semibold shadow-md border transition-colors flex items-center gap-1.5 ${
              showRouteLine
                ? "bg-[#9F1239] text-white border-[#9F1239]"
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>{showRouteLine ? "Hide Route" : "Show Route"}</span>
          </button>
        </div>
      </div>

      {/* 5. Selected Pandal Information Overlay Panel (Bottom Sheet style) */}
      {selectedPandal && (
        <div className="absolute bottom-16 md:bottom-2 left-2 right-2 sm:left-4 sm:right-auto sm:w-96 z-30">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 transition-all">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {selectedPandal.tier.replace("_", " ")}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                  {selectedPandal.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedPandal.zone} • #{selectedPandal.codeName}
                </p>
              </div>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => onToggleSave(selectedPandal.id)}
                aria-label="Save pandal"
                className={`touch-target-min w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 ${
                  savedPandalIds.has(selectedPandal.id)
                    ? "text-[#D97706] bg-amber-50"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {savedPandalIds.has(selectedPandal.id) ? (
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Status / Transport Tags */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <StatusBadge
                level={
                  selectedPandal.crowdLevel === "LOW"
                    ? "low"
                    : selectedPandal.crowdLevel === "HIGH"
                    ? "heavy"
                    : "moderate"
                }
                size="sm"
              />
              <span className="flex items-center gap-1">
                {selectedPandal.vehicleAllowed === "all_vehicles" ? (
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Footprints className="w-3.5 h-3.5 text-amber-600" />
                )}
                {selectedPandal.vehicleAllowed === "all_vehicles" ? "Toto Access" : "Walk Corridor"}
              </span>
              <span className="flex items-center gap-1 text-slate-400 ml-auto">
                <Clock className="w-3 h-3" />
                15m ago
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenDetailsModal(selectedPandal)}
                className="touch-target-min py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-semibold text-center focus-ring cursor-pointer"
              >
                Details & Gates
              </button>
              <button
                type="button"
                onClick={() => setShowRouteLine(true)}
                className="touch-target-min py-2 px-3 rounded-lg bg-[#9F1239] hover:bg-[#881337] text-white text-xs font-semibold text-center focus-ring cursor-pointer flex items-center justify-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>Navigate Route</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
