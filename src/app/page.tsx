"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  ShieldAlert,
  PhoneCall,
  Droplet,
  Compass,
  Bookmark,
  CheckCircle2,
  Users,
  AlertTriangle,
  Info,
  Map as MapIcon,
  Navigation,
  Accessibility,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation, NavItemKey } from "@/components/layout/BottomNavigation";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterChip } from "@/components/ui/FilterChip";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PandalCard, PandalCardProps } from "@/components/pandals/PandalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePreferences } from "@/components/preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";
import { ModalShell } from "@/components/ui/ModalShell";
import { PandalMapView } from "@/components/map/PandalMapView";

// Grounded fixtures from official Step 2 schema/seed data
const PANDAL_DATA: PandalCardProps[] = [
  {
    id: "pandal-1",
    codeName: "boro-debi-bari",
    name: "Boro Debi Temple (Debibari)",
    zone: "Cooch Behar Town (Madan Mohan Bari Ward)",
    tier: "top_5",
    crowdLevel: "MED",
    reportTime: "10m ago",
    vehicleAllowed: "two_wheeler_only",
    milestoneYear: "Est. 1510 (500+ Years Heritage)",
    isVerified: true,
  },
  {
    id: "pandal-2",
    codeName: "subhash-pally-club",
    name: "Subhash Pally Sarbojanin Durga Puja",
    zone: "Subhash Pally / Ward 10",
    tier: "top_10",
    crowdLevel: "LOW",
    reportTime: "25m ago",
    vehicleAllowed: "two_wheeler_only",
    milestoneYear: "50th Year Golden Jubilee",
    isVerified: false,
  },
  {
    id: "pandal-3",
    codeName: "guriahati-club",
    name: "Guriahati Netaji Sangha & Club",
    zone: "Guriahati Gram Panchayat",
    tier: "top_10",
    crowdLevel: "MED",
    reportTime: "15m ago",
    vehicleAllowed: "all_vehicles",
    milestoneYear: "40+ Years Tradition",
    isVerified: false,
  },
  {
    id: "pandal-4",
    codeName: "khagrabari-club",
    name: "Khagrabari Milan Sangha",
    zone: "Khagrabari Bypass Zone",
    tier: "top_20",
    crowdLevel: "LOW",
    reportTime: "30m ago",
    vehicleAllowed: "all_vehicles",
    milestoneYear: "35 Years Tradition",
    isVerified: false,
  },
  {
    id: "pandal-5",
    codeName: "rocky-club",
    name: "Rocky Club Sarbojanin Durgotsav",
    zone: "New Town / Kalighat Road",
    tier: "top_10",
    crowdLevel: "HIGH",
    reportTime: "5m ago",
    vehicleAllowed: "two_wheeler_only",
    milestoneYear: "45+ Years Theme Puja",
    isVerified: false,
  },
];

export default function Home() {
  const { language } = usePreferences();
  const strings = UI_STRINGS[language];

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavItemKey>("home");

  // Filtering & search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [savedPandalIds, setSavedPandalIds] = useState<Set<string>>(new Set(["pandal-1"]));

  // Modals
  const [selectedPandalModal, setSelectedPandalModal] = useState<PandalCardProps | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);

  // Toggle bookmark / save
  const handleToggleSave = (id: string) => {
    setSavedPandalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered pandals
  const filteredPandals = useMemo(() => {
    return PANDAL_DATA.filter((pandal) => {
      if (selectedTier !== "all") {
        if (selectedTier === "top_5" && pandal.tier !== "top_5") return false;
        if (selectedTier === "top_10" && pandal.tier !== "top_5" && pandal.tier !== "top_10")
          return false;
        if (
          selectedTier === "top_20" &&
          pandal.tier !== "top_5" &&
          pandal.tier !== "top_10" &&
          pandal.tier !== "top_20"
        )
          return false;
        if (selectedTier === "low_crowd" && pandal.crowdLevel !== "LOW") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pandal.name.toLowerCase().includes(q);
        const matchesZone = pandal.zone.toLowerCase().includes(q);
        const matchesCode = pandal.codeName.toLowerCase().includes(q);
        if (!matchesName && !matchesZone && !matchesCode) return false;
      }

      return true;
    });
  }, [selectedTier, searchQuery]);

  // Saved Pandals list
  const savedPandals = useMemo(() => {
    return PANDAL_DATA.filter((p) => savedPandalIds.has(p.id));
  }, [savedPandalIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] pb-20 md:pb-10 text-slate-900 dark:text-slate-100">
      {/* 1. Practical Header */}
      <Header
        onSearchClick={() => document.getElementById("pandal-search-input")?.focus()}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Desktop Navigation Tabs (Visible on md+) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "home"
                ? "border-[#9F1239] text-[#9F1239] dark:text-[#F59E0B]"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {strings.navHome}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pandals")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "pandals"
                ? "border-[#9F1239] text-[#9F1239] dark:text-[#F59E0B]"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {language === "bn" ? "মণ্ডপ তালিকা" : "Pandals"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "map"
                ? "border-[#9F1239] text-[#9F1239] dark:text-[#F59E0B]"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>{strings.navMap}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "saved"
                ? "border-[#9F1239] text-[#9F1239] dark:text-[#F59E0B]"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {strings.navSaved} ({savedPandalIds.size})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("more")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === "more"
                ? "border-[#9F1239] text-[#9F1239] dark:text-[#F59E0B]"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            {strings.navMore}
          </button>
        </div>
      </div>

      {/* 2. Main Content Body according to Active Tab */}

      {/* --- TAB: MAP (Map-First View) --- */}
      {activeTab === "map" && (
        <div className="flex-1 w-full flex flex-col">
          <PandalMapView
            pandals={PANDAL_DATA}
            savedPandalIds={savedPandalIds}
            onToggleSave={handleToggleSave}
            onOpenDetailsModal={(p) => setSelectedPandalModal(p)}
          />
        </div>
      )}

      {/* --- TAB: HOME --- */}
      {activeTab === "home" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
          {/* A. Compact Context Header (Calm, practical, no giant marketing hero) */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {language === "bn" ? "কোচবিহার দুর্গোৎসব পরিক্রমা" : "Cooch Behar Durga Puja 2026"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {strings.tagline}
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("map")}
                  className="shadow-2xs text-xs font-semibold"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Open Interactive Map</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveTab("pandals")}
                  className="text-xs"
                >
                  <Compass className="w-3.5 h-3.5 text-[#9F1239]" />
                  <span>All Pandals</span>
                </Button>
              </div>
            </div>
          </div>

          {/* B. Search & Quick Filters */}
          <div className="space-y-3">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              placeholder={strings.searchPlaceholder}
            />

            {/* Horizontally scrollable quick filters */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <FilterChip
                label={strings.all}
                active={selectedTier === "all"}
                count={PANDAL_DATA.length}
                onClick={() => setSelectedTier("all")}
              />
              <FilterChip
                label={strings.top5}
                active={selectedTier === "top_5"}
                onClick={() => setSelectedTier("top_5")}
              />
              <FilterChip
                label={strings.top10}
                active={selectedTier === "top_10"}
                onClick={() => setSelectedTier("top_10")}
              />
              <FilterChip
                label={strings.top20}
                active={selectedTier === "top_20"}
                onClick={() => setSelectedTier("top_20")}
              />
              <FilterChip
                label="Low Crowd"
                active={selectedTier === "low_crowd"}
                onClick={() => setSelectedTier("low_crowd")}
              />
            </div>
          </div>

          {/* C. Quick Actions Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("map")}
              className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
            >
              <MapPin className="w-4 h-4 text-[#9F1239] mb-1.5" />
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                Pandal Map
              </div>
              <div className="text-[11px] text-slate-500">Live geo pins</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pandals")}
              className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
            >
              <Compass className="w-4 h-4 text-[#9F1239] mb-1.5" />
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                Explore All
              </div>
              <div className="text-[11px] text-slate-500">Directory list</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
            >
              <Bookmark className="w-4 h-4 text-[#D97706] mb-1.5" />
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                My Route
              </div>
              <div className="text-[11px] text-slate-500">{savedPandalIds.size} saved</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveServiceModal("police")}
              className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
            >
              <ShieldAlert className="w-4 h-4 text-emerald-600 mb-1.5" />
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                Helplines
              </div>
              <div className="text-[11px] text-slate-500">Police & Medical</div>
            </button>
          </div>

          {/* D. Crowd Status Legend (Clean & Compact) */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              {strings.crowdLegendTitle}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 rounded-md bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{strings.crowdLow}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border border-amber-100 dark:border-amber-900">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">{strings.crowdMed}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-md bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 border border-rose-100 dark:border-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="truncate">{strings.crowdHigh}</span>
              </div>
            </div>
          </div>

          {/* E. Pandal Directory Grid */}
          <section id="pandal-list-section">
            <SectionHeading
              title={selectedTier === "all" ? "Featured Pandals" : `Filtered (${filteredPandals.length})`}
              subtitle="Cooch Behar Town and surrounding committee pandals"
              action={
                <button
                  type="button"
                  onClick={() => setActiveTab("pandals")}
                  className="text-xs text-[#9F1239] font-semibold hover:underline"
                >
                  View All ({PANDAL_DATA.length})
                </button>
              }
            />

            {filteredPandals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPandals.map((pandal) => (
                  <PandalCard
                    key={pandal.id}
                    {...pandal}
                    isSaved={savedPandalIds.has(pandal.id)}
                    onToggleSave={handleToggleSave}
                    onSelect={() => setSelectedPandalModal(pandal)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MapPin}
                title="No pandals match filters"
                description={`No results found for "${searchQuery}". Please check your search query or reset filters.`}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTier("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                }
              />
            )}
          </section>

          {/* F. Essential Services Quick Access Cards */}
          <section>
            <SectionHeading
              title={strings.essentialServices}
              subtitle="Verified municipal and emergency facilities"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setActiveServiceModal("police")}
                className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
              >
                <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {strings.policeAssistance}
                </div>
                <div className="text-[11px] text-slate-500">112 / Sadar Police</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveServiceModal("hospital")}
                className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
              >
                <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-700 flex items-center justify-center mb-2">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {strings.nearbyHospitals}
                </div>
                <div className="text-[11px] text-slate-500">MJN Hospital • 102</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveServiceModal("toilets")}
                className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
              >
                <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {strings.toilets}
                </div>
                <div className="text-[11px] text-slate-500">Terminus & Madan Mohan</div>
              </button>

              <button
                type="button"
                onClick={() => setActiveServiceModal("water")}
                className="touch-target-min p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left cursor-pointer focus-ring shadow-2xs"
              >
                <div className="w-8 h-8 rounded-md bg-cyan-50 text-cyan-700 flex items-center justify-center mb-2">
                  <Droplet className="w-4 h-4" />
                </div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {strings.drinkingWater}
                </div>
                <div className="text-[11px] text-slate-500">Debibari & Sagar Dighi</div>
              </button>
            </div>
          </section>

          {/* G. Practical Disclaimer Notice */}
          <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {strings.disclaimerTitle}:
              </span>{" "}
              {strings.disclaimerText}
            </div>
          </div>
        </main>
      )}

      {/* --- TAB: PANDALS (Full Directory) --- */}
      {activeTab === "pandals" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {language === "bn" ? "সকল মণ্ডপ তালিকা" : "Pandal Directory"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cooch Behar heritage landmarks and registered committee pandals
            </p>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by pandal name or zone..."
          />

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <FilterChip
              label="All"
              active={selectedTier === "all"}
              count={PANDAL_DATA.length}
              onClick={() => setSelectedTier("all")}
            />
            <FilterChip
              label="Top 5"
              active={selectedTier === "top_5"}
              onClick={() => setSelectedTier("top_5")}
            />
            <FilterChip
              label="Top 10"
              active={selectedTier === "top_10"}
              onClick={() => setSelectedTier("top_10")}
            />
            <FilterChip
              label="Top 20"
              active={selectedTier === "top_20"}
              onClick={() => setSelectedTier("top_20")}
            />
            <FilterChip
              label="Low Crowd"
              active={selectedTier === "low_crowd"}
              onClick={() => setSelectedTier("low_crowd")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPandals.map((pandal) => (
              <PandalCard
                key={`all-${pandal.id}`}
                {...pandal}
                isSaved={savedPandalIds.has(pandal.id)}
                onToggleSave={handleToggleSave}
                onSelect={() => setSelectedPandalModal(pandal)}
              />
            ))}
          </div>
        </main>
      )}

      {/* --- TAB: SAVED (Route Planner / Bookmarks) --- */}
      {activeTab === "saved" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {strings.savedSectionTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Your personalized Puja itinerary and sequential visit route
            </p>
          </div>

          {savedPandals.length > 0 ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
                <span>
                  <strong>{savedPandals.length} pandals saved</strong> in your custom route
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("map")}
                  className="text-xs py-1.5 px-3 h-8 min-h-0"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View Route on Map</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPandals.map((pandal) => (
                  <PandalCard
                    key={`saved-${pandal.id}`}
                    {...pandal}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                    onSelect={() => setSelectedPandalModal(pandal)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No pandals bookmarked yet"
              description={strings.savedEmptyState}
              action={
                <Button variant="primary" size="sm" onClick={() => setActiveTab("pandals")}>
                  Explore Pandals
                </Button>
              }
            />
          )}
        </main>
      )}

      {/* --- TAB: MORE (Emergency & Cultural Info) --- */}
      {activeTab === "more" && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {language === "bn" ? "জরুরি তথ্য ও সহায়তা" : "Emergency & Essential Guide"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Important civic contacts and senior support for Cooch Behar Durga Puja
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#9F1239]" />
                Police Assistance & Lost and Found
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cooch Behar Kotwali Police Station Sadar operates special Puja assistance booths at Debibari, Subhash Pally, and Central Bus Terminus.
              </p>
              <div className="text-xs font-mono font-semibold text-[#9F1239] pt-1">
                Emergency: 112 • Kotwali Sadar: 03582-222303
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#9F1239]" />
                Medical Care & Ambulance
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Maharaja Jitendra Narayan Medical College & Hospital (MJN Hospital) 24x7 emergency response wing.
              </p>
              <div className="text-xs font-mono font-semibold text-[#9F1239] pt-1">
                Ambulance: 102 • MJN Hospital: 03582-222238
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-[#D97706]" />
                Senior Citizen & Family Assistance
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Priority senior rest benches and wheelchair ramps are maintained at Boro Debi Debibari and major ward gates. Enable &quot;Senior Citizen Mode&quot; in the header for larger text size.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* 3. Mobile Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* 4. Pandal Details Modal */}
      {selectedPandalModal && (
        <ModalShell
          isOpen={Boolean(selectedPandalModal)}
          onClose={() => setSelectedPandalModal(null)}
          title={selectedPandalModal.name}
          description={`${selectedPandalModal.zone} • #${selectedPandalModal.codeName}`}
        >
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                Heritage & Community Background:
              </span>
              <p>{selectedPandalModal.milestoneYear || "Sarbojanin Durgotsav Committee"}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                Transport & Walking Access:
              </span>
              <p>
                {selectedPandalModal.vehicleAllowed === "all_vehicles"
                  ? "Toto and vehicle parking designated within 50m of main queue."
                  : "Two-wheeler corridor or pedestrian-only zone. Walking approach ~100m."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleSave(selectedPandalModal.id)}
              >
                {savedPandalIds.has(selectedPandalModal.id) ? "Saved in Route" : "Save to Route"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedPandalModal(null);
                  setActiveTab("map");
                }}
              >
                <Navigation className="w-3.5 h-3.5 mr-1" />
                View on Map
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* 5. Emergency Service Modal */}
      {activeServiceModal && (
        <ModalShell
          isOpen={Boolean(activeServiceModal)}
          onClose={() => setActiveServiceModal(null)}
          title={
            activeServiceModal === "police"
              ? "Police Assistance Booths"
              : activeServiceModal === "hospital"
              ? "Medical Aid & Hospitals"
              : activeServiceModal === "toilets"
              ? "Public Restrooms"
              : "Drinking Water Points"
          }
          description="Verified 24x7 municipal facilities across Cooch Behar"
        >
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {activeServiceModal === "police" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Kotwali Police Sadar Control:
                </p>
                <p className="font-mono text-base text-[#9F1239] font-bold">
                  03582-222303 / 112
                </p>
                <p className="text-slate-500">
                  Booths: Debibari N.N. Road, Subhash Pally, Sagar Dighi North.
                </p>
              </div>
            )}

            {activeServiceModal === "hospital" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  MJN Medical College & Hospital (Emergency Ward):
                </p>
                <p className="font-mono text-base text-[#9F1239] font-bold">
                  03582-222238 / 102
                </p>
                <p className="text-slate-500">
                  24x7 doctor on call and emergency ambulance bay.
                </p>
              </div>
            )}

            {activeServiceModal === "toilets" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Sanitized Restroom Blocks:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Central Bus Terminus Municipal Toilet Block</li>
                  <li>Madan Mohan Bari Visitor Complex</li>
                  <li>Sagar Dighi Park Complex</li>
                </ul>
              </div>
            )}

            {activeServiceModal === "water" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Drinking Water Kiosks:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Debibari Public Drinking Water Post</li>
                  <li>Madan Mohan Bari Temple Compound</li>
                  <li>Station Road Kiosk</li>
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setActiveServiceModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
