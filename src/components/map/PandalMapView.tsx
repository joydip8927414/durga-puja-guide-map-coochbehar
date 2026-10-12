"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Navigation,
  Bookmark,
  BookmarkCheck,
  Compass,
  Plus,
  Minus,
  MapPin,
  X,
  LocateFixed,
  Route,
  ListFilter,
  Clock,
  Car,
  Footprints,
} from "lucide-react";
import { PandalCardProps } from "../pandals/PandalCard";
import { StatusBadge } from "../ui/StatusBadge";

export interface PandalMapViewProps {
  pandals: PandalCardProps[];
  savedPandalIds: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenDetailsModal: (pandal: PandalCardProps) => void;
  onNavigateToSubmit?: () => void;
  className?: string;
}

interface MapCoordinatePoint {
  id: string;
  name: string;
  codeName: string;
  lat: number;
  lng: number;
  pandal: PandalCardProps;
}

// Real approximate coordinates for Cooch Behar localities
const COORDS_MAP: Record<string, { lat: number; lng: number }> = {
  "boro-debi-bari":    { lat: 26.3245, lng: 89.4522 }, // Debibari / Madan Mohan Bari Ward
  "subhash-pally-club": { lat: 26.3288, lng: 89.4455 }, // Subhash Pally / Ward 10
  "guriahati-club":    { lat: 26.3122, lng: 89.4678 }, // Guriahati GP — south-east
  "khagrabari-club":   { lat: 26.3456, lng: 89.4312 }, // Khagrabari Bypass — north-west
  "rocky-club":        { lat: 26.3195, lng: 89.4421 }, // New Town / Kalighat Road
};

// SVG canvas for Cooch Behar bounding box
const MIN_LAT = 26.300;
const MAX_LAT = 26.360;
const MIN_LNG = 89.420;
const MAX_LNG = 89.485;

function toMapXY(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
  const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 100; // inverted: north = up
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

const CROWD_COLOR: Record<string, { fill: string; ring: string; text: string }> = {
  LOW:  { fill: "#16A34A", ring: "#BBF7D0", text: "Low Crowd" },
  MED:  { fill: "#D97706", ring: "#FDE68A", text: "Moderate Crowd" },
  HIGH: { fill: "#DC2626", ring: "#FECACA", text: "Heavy Crowd" },
};

export function PandalMapView({
  pandals,
  savedPandalIds,
  onToggleSave,
  onOpenDetailsModal,
  onNavigateToSubmit,
  className = "",
}: PandalMapViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "featured" | "heritage" | "nearby">("all");
  const [selectedPandalId, setSelectedPandalId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRoute, setShowRoute] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const geoPoints: MapCoordinatePoint[] = useMemo(() =>
    pandals.map((p) => {
      const c = COORDS_MAP[p.codeName] ?? { lat: 26.3239, lng: 89.451 };
      return { id: p.id, name: p.name, codeName: p.codeName, lat: c.lat, lng: c.lng, pandal: p };
    }),
  [pandals]);

  const filteredPins = useMemo(() => {
    return geoPoints.filter((pt) => {
      // Category filters
      if (selectedFilter === "featured" && pt.pandal.tier !== "top_5" && pt.pandal.tier !== "top_10") return false;
      if (selectedFilter === "heritage" && pt.pandal.tier !== "top_5") return false;
      if (selectedFilter === "nearby") {
        // Town-centre radius: exclude Guriahati and Khagrabari
        if (pt.codeName === "khagrabari-club" || pt.codeName === "guriahati-club") return false;
      }
      // Search
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
  }, [geoPoints, selectedFilter, searchQuery]);

  const selectedPandal = useMemo(
    () => pandals.find((p) => p.id === selectedPandalId) || null,
    [pandals, selectedPandalId]
  );

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) { setLocationDenied(true); return; }
    navigator.geolocation.getCurrentPosition(
      () => { /* In production: pan map to user position */ },
      () => setLocationDenied(true),
      { timeout: 6000 }
    );
  }, []);

  // Route path through saved pandals
  const routePoints = useMemo(() => {
    if (!showRoute) return [];
    return geoPoints
      .filter((pt) => savedPandalIds.has(pt.id))
      .map((pt) => toMapXY(pt.lat, pt.lng));
  }, [geoPoints, savedPandalIds, showRoute]);

  const filters: Array<{ key: typeof selectedFilter; label: string }> = [
    { key: "all",      label: "All Pandals" },
    { key: "featured", label: "Featured" },
    { key: "heritage", label: "Heritage" },
    { key: "nearby",   label: "Nearby" },
  ];

  return (
    <div
      className={`relative w-full bg-[#F4F1E8] dark:bg-[#1C1917] overflow-hidden select-none flex flex-col map-panel-mobile md:map-panel-desktop ${className}`}
    >
      {/* ── 1. Floating top bar: Durga avatar + search + filters ── */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Search row */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Maa Durga avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D4A72C] shadow-md shrink-0 bg-[#FFF8E7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/maa-durga.jpg"
              alt="Maa Durga — Puja Guide"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Search input */}
          <div className="flex-1 bg-white dark:bg-stone-900 rounded-xl shadow-md border border-[#E7E0D2] dark:border-stone-700 flex items-center px-3 py-2 gap-2">
            <Search className="w-4 h-4 text-[#78716C] shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pandals…"
              aria-label="Search pandals on map"
              className="w-full text-sm bg-transparent border-none outline-none text-[#292524] dark:text-stone-100 placeholder:text-[#A8A29E] py-0.5"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="p-1 text-[#A8A29E] hover:text-[#78716C] focus-ring rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Filter icon */}
            <button
              type="button"
              aria-label="Open filters"
              className="shrink-0 p-1 text-[#C8102E] hover:text-[#9F1239] focus-ring rounded"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={selectedFilter === f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border transition-all focus-ring cursor-pointer ${
                selectedFilter === f.key
                  ? "bg-[#C8102E] border-[#C8102E] text-white"
                  : "bg-white dark:bg-stone-900 border-[#E7E0D2] dark:border-stone-700 text-[#292524] dark:text-stone-200 hover:bg-[#FFF8E7]"
              }`}
            >
              {f.label}
              {f.key === "all" && (
                <span className={`ml-1 text-[10px] ${selectedFilter === "all" ? "opacity-75" : "text-[#78716C]"}`}>
                  ({filteredPins.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. SVG Map canvas ── */}
      <div className="relative flex-1 w-full overflow-hidden cursor-grab active:cursor-grabbing">
        <svg
          viewBox="0 0 1000 800"
          className="w-full h-full object-cover"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "50% 50%", transition: "transform 0.2s ease" }}
          aria-label="Interactive map of Cooch Behar pandal locations"
          role="img"
        >
          <defs>
            {/* Subtle warm grid */}
            <pattern id="warmgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D6D0C4" strokeWidth="0.4" />
            </pattern>
            {/* Marker drop shadow */}
            <filter id="marker-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000033" />
            </filter>
            {/* Gold glow for selected */}
            <filter id="gold-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor="#D4A72C" floodOpacity="0.5" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Warm base */}
          <rect width="1000" height="800" fill="#F0EBE0" />
          <rect width="1000" height="800" fill="url(#warmgrid)" />

          {/* Torsa River */}
          <path d="M 100 0 Q 240 240 310 395 T 248 800" fill="none" stroke="#BFD8F0" strokeWidth="40" strokeLinecap="round" />
          <path d="M 100 0 Q 240 240 310 395 T 248 800" fill="none" stroke="#93C5E8" strokeWidth="26" strokeLinecap="round" />
          <text x="195" y="300" fill="#2C85C1" fontSize="11" fontWeight="700" opacity="0.9" transform="rotate(-40, 195, 300)">Torsa River</text>

          {/* Sagar Dighi */}
          <ellipse cx="560" cy="398" rx="50" ry="35" fill="#93C5E8" stroke="#60A5D0" strokeWidth="1.5" />
          <text x="533" y="401" fill="#1E6B9C" fontSize="9.5" fontWeight="700">Sagar Dighi</text>

          {/* Rajbari Palace Park */}
          <rect x="430" y="248" width="85" height="65" rx="8" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="1.5" />
          <text x="446" y="280" fill="#047857" fontSize="9" fontWeight="700">Rajbari</text>
          <text x="441" y="292" fill="#047857" fontSize="9">Palace Park</text>

          {/* N.N. Road / Station Road (main artery) */}
          <path d="M 180 410 L 860 380" fill="none" stroke="#D4CAB8" strokeWidth="14" strokeLinecap="round" />
          <path d="M 180 410 L 860 380" fill="none" stroke="#FFFFFF"  strokeWidth="9"  strokeLinecap="round" />
          <text x="350" y="404" fill="#9D9487" fontSize="9" fontWeight="600">N.N. Road</text>

          {/* B.S. Road */}
          <path d="M 555 115 L 545 720" fill="none" stroke="#D4CAB8" strokeWidth="11" strokeLinecap="round" />
          <path d="M 555 115 L 545 720" fill="none" stroke="#FFFFFF"  strokeWidth="7"  strokeLinecap="round" />

          {/* Bypass road */}
          <path d="M 315 175 L 825 155" fill="none" stroke="#E2D9CB" strokeWidth="9" strokeLinecap="round" />
          <path d="M 315 175 L 825 155" fill="none" stroke="#FFFFFF"  strokeWidth="6" strokeLinecap="round" />
          <text x="400" y="148" fill="#B5A898" fontSize="8.5">Bypass Road</text>

          {/* Guriahati link road */}
          <path d="M 548 475 L 875 675" fill="none" stroke="#E2D9CB" strokeWidth="9" strokeLinecap="round" />
          <path d="M 548 475 L 875 675" fill="none" stroke="#FFFFFF"  strokeWidth="6" strokeLinecap="round" />

          {/* Route line — saved pandals */}
          {showRoute && routePoints.length > 1 && (
            <polyline
              points={routePoints.map((p) => `${(p.x / 100) * 1000},${(p.y / 100) * 800}`).join(" ")}
              fill="none"
              stroke="#C8102E"
              strokeWidth="5"
              strokeDasharray="10 7"
              strokeLinecap="round"
              opacity="0.85"
            />
          )}

          {/* Pandal Markers */}
          {filteredPins.map((pt) => {
            const { x: pctX, y: pctY } = toMapXY(pt.lat, pt.lng);
            const cx = (pctX / 100) * 1000;
            const cy = (pctY / 100) * 800;
            const isSelected = pt.id === selectedPandalId;
            const crowd = pt.pandal.crowdLevel ?? "MED";
            const colors = CROWD_COLOR[crowd] ?? CROWD_COLOR.MED;

            return (
              <g
                key={pt.id}
                onClick={() => setSelectedPandalId(isSelected ? null : pt.id)}
                className="cursor-pointer"
                style={{ transition: "transform 0.15s ease", transformOrigin: `${cx}px ${cy}px` }}
              >
                {/* Selection pulse ring */}
                {isSelected && (
                  <circle
                    cx={cx} cy={cy - 22}
                    r="30"
                    fill={colors.ring}
                    opacity="0.6"
                    className="marker-pulse"
                  />
                )}

                {/* Pin body */}
                <path
                  d={`M ${cx} ${cy} L ${cx - 13} ${cy - 22} A 13 13 0 1 1 ${cx + 13} ${cy - 22} Z`}
                  fill={isSelected ? "#C8102E" : "#FFFFFF"}
                  stroke={isSelected ? "#9F1239" : "#D4A72C"}
                  strokeWidth={isSelected ? 2.5 : 2}
                  filter={isSelected ? "url(#gold-glow)" : "url(#marker-shadow)"}
                />

                {/* Heritage tier crown / dot */}
                {pt.pandal.tier === "top_5" ? (
                  // Heritage gold star
                  <text
                    x={cx} y={cy - 18}
                    fill={isSelected ? "#FFF8E7" : "#D4A72C"}
                    fontSize="13"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >★</text>
                ) : (
                  // Crowd status dot
                  <circle cx={cx} cy={cy - 22} r="6" fill={colors.fill} />
                )}

                {/* Name label */}
                <rect
                  x={cx - 48} y={cy + 5}
                  width="96" height="17"
                  rx="4"
                  fill={isSelected ? "#C8102E" : "#FFFFFF"}
                  stroke={isSelected ? "#9F1239" : "#E7E0D2"}
                  strokeWidth="0.8"
                  opacity="0.96"
                />
                <text
                  x={cx} y={cy + 16}
                  fill={isSelected ? "#FFFFFF" : "#292524"}
                  fontSize="9"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {pt.name.split(" ").slice(0, 2).join(" ")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* ── 3. Floating right controls: Zoom & Recenter ── */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.2, z + 0.25))}
            aria-label="Zoom in"
            className="w-11 h-11 rounded-xl bg-white dark:bg-stone-900 shadow-md border border-[#E7E0D2] dark:border-stone-700 text-[#292524] dark:text-stone-200 flex items-center justify-center hover:bg-[#FFF8E7] focus-ring cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            aria-label="Zoom out"
            className="w-11 h-11 rounded-xl bg-white dark:bg-stone-900 shadow-md border border-[#E7E0D2] dark:border-stone-700 text-[#292524] dark:text-stone-200 flex items-center justify-center hover:bg-[#FFF8E7] focus-ring cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { setZoomLevel(1); setSelectedPandalId(null); }}
            aria-label="Reset map view"
            className="w-11 h-11 rounded-xl bg-white dark:bg-stone-900 shadow-md border border-[#E7E0D2] dark:border-stone-700 flex items-center justify-center hover:bg-[#FFF8E7] focus-ring cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#C8102E]" />
          </button>
        </div>

        {/* ── 4. Floating left actions ── */}
        <div className="absolute left-3 bottom-4 z-20 flex flex-col gap-2">
          {/* My Location */}
          <button
            type="button"
            onClick={handleLocate}
            aria-label="Use my location"
            title={locationDenied ? "Location access denied" : "Center on my location"}
            className={`touch-target-min px-3 py-2 rounded-xl text-xs font-semibold shadow-md border flex items-center gap-1.5 transition-colors focus-ring cursor-pointer ${
              locationDenied
                ? "bg-[#FFF0F0] border-[#FECACA] text-[#C8102E]"
                : "bg-white dark:bg-stone-900 border-[#E7E0D2] dark:border-stone-700 text-[#292524] dark:text-stone-200 hover:bg-[#FFF8E7]"
            }`}
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span>{locationDenied ? "Location off" : "My Location"}</span>
          </button>

          {/* Route toggle */}
          <button
            type="button"
            onClick={() => setShowRoute((r) => !r)}
            aria-pressed={showRoute}
            className={`touch-target-min px-3 py-2 rounded-xl text-xs font-semibold shadow-md border flex items-center gap-1.5 transition-colors focus-ring cursor-pointer ${
              showRoute
                ? "bg-[#C8102E] border-[#C8102E] text-white"
                : "bg-white dark:bg-stone-900 border-[#E7E0D2] dark:border-stone-700 text-[#292524] dark:text-stone-200 hover:bg-[#FFF8E7]"
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>{showRoute ? "Hide Route" : "Route Planner"}</span>
          </button>

          {/* Add pandal shortcut */}
          {onNavigateToSubmit && (
            <button
              type="button"
              onClick={onNavigateToSubmit}
              aria-label="Suggest a new pandal"
              className="touch-target-min px-3 py-2 rounded-xl text-xs font-semibold shadow-md border border-[#D4A72C] bg-[#FFF8E7] text-[#92400E] flex items-center gap-1.5 hover:bg-[#FEF3C7] focus-ring cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
              <span>Add Pandal</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 5. Selected Pandal Bottom Sheet ── */}
      {selectedPandal && (
        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 pb-safe slide-up">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-[#E7E0D2] dark:border-stone-700 overflow-hidden">
            {/* Gold accent top bar */}
            <div className="h-1 bg-gradient-to-r from-[#C8102E] to-[#D4A72C]" />

            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  {/* Tier badge */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {selectedPandal.tier === "top_5" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8102E] text-white">
                        ★ Heritage
                      </span>
                    )}
                    {selectedPandal.tier === "top_10" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF0F0] text-[#C8102E] border border-[#FECACA]">
                        Top 10
                      </span>
                    )}
                    {selectedPandal.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#292524] dark:text-stone-100 leading-tight">
                    {selectedPandal.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
                    <p className="text-xs text-[#78716C] truncate">{selectedPandal.zone}</p>
                  </div>
                </div>

                {/* Save / dismiss */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleSave(selectedPandal.id)}
                    aria-label={savedPandalIds.has(selectedPandal.id) ? "Remove from route" : "Save to route"}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors focus-ring cursor-pointer ${
                      savedPandalIds.has(selectedPandal.id)
                        ? "bg-[#FFF8E7] border-[#D4A72C] text-[#D4A72C]"
                        : "bg-white dark:bg-stone-800 border-[#E7E0D2] text-[#78716C] hover:text-[#292524]"
                    }`}
                  >
                    {savedPandalIds.has(selectedPandal.id) ? (
                      <BookmarkCheck className="w-4 h-4 fill-current" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPandalId(null)}
                    aria-label="Close pandal info"
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#E7E0D2] text-[#78716C] hover:bg-[#F4F1E8] focus-ring cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Crowd status + transport + time */}
              {selectedPandal.crowdLevel && (
                <div className="flex flex-wrap items-center gap-2 py-2.5 border-t border-[#E7E0D2] dark:border-stone-700 mb-3">
                  <StatusBadge
                    level={
                      selectedPandal.crowdLevel === "LOW"  ? "low"
                      : selectedPandal.crowdLevel === "HIGH" ? "heavy"
                      : "moderate"
                    }
                    size="sm"
                  />
                  <span className="flex items-center gap-1 text-xs text-[#78716C]">
                    {selectedPandal.vehicleAllowed === "all_vehicles" ? (
                      <Car className="w-3.5 h-3.5 text-[#16A34A]" />
                    ) : (
                      <Footprints className="w-3.5 h-3.5 text-[#D97706]" />
                    )}
                    {selectedPandal.vehicleAllowed === "all_vehicles" ? "Toto Access" : "Walk Corridor"}
                  </span>
                  {selectedPandal.reportTime && (
                    <span className="flex items-center gap-1 text-xs text-[#A8A29E] ml-auto">
                      <Clock className="w-3 h-3" />
                      {selectedPandal.reportTime}
                    </span>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onOpenDetailsModal(selectedPandal)}
                  className="touch-target-min py-2.5 px-3 rounded-xl bg-[#F4F1E8] hover:bg-[#E7E0D2] dark:bg-stone-800 dark:hover:bg-stone-700 text-[#292524] dark:text-stone-200 text-xs font-semibold text-center focus-ring cursor-pointer transition-colors"
                >
                  View Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoute(true);
                    if (!savedPandalIds.has(selectedPandal.id)) onToggleSave(selectedPandal.id);
                  }}
                  className="touch-target-min py-2.5 px-3 rounded-xl bg-[#C8102E] hover:bg-[#9F1239] text-white text-xs font-semibold text-center focus-ring cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Add to Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state when search yields no results */}
      {filteredPins.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg border border-[#E7E0D2] p-5 text-center mx-4 pointer-events-auto">
            <MapPin className="w-8 h-8 text-[#D4A72C] mx-auto mb-2" />
            <p className="font-semibold text-sm text-[#292524]">No pandals found</p>
            <p className="text-xs text-[#78716C] mt-1">Try adjusting your search or filters</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setSelectedFilter("all"); }}
              className="mt-3 px-4 py-2 rounded-lg bg-[#C8102E] text-white text-xs font-semibold focus-ring cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
