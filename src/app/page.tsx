"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
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

// Seed fixtures matching the official Step 2 schema/seed data
const INITIAL_PANDAL_CANDIDATES: PandalCardProps[] = [
  {
    id: "pandal-1",
    codeName: "boro-debi-bari",
    name: "Boro Debi Temple (Debibari)",
    zone: "Cooch Behar Town (Madan Mohan Bari Ward)",
    tier: "top_5",
    crowdLevel: "MED",
    vehicleAllowed: "two_wheeler_only",
    milestoneYear: "Est. 1510 (500+ Years Royal Heritage)",
    isVerified: true,
  },
  {
    id: "pandal-2",
    codeName: "subhash-pally-club",
    name: "Subhash Pally Sarbojanin Durga Puja",
    zone: "Subhash Pally / Ward 10",
    tier: "top_10",
    crowdLevel: "LOW",
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
    vehicleAllowed: "two_wheeler_only",
    milestoneYear: "45+ Years Theme Puja",
    isVerified: false,
  },
];

export default function Home() {
  const { language } = usePreferences();
  const strings = UI_STRINGS[language];

  // State
  const [activeTab, setActiveTab] = useState<NavItemKey>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [savedPandalIds, setSavedPandalIds] = useState<Set<string>>(new Set(["pandal-1"]));
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

  // Filter pandals
  const filteredPandals = useMemo(() => {
    return INITIAL_PANDAL_CANDIDATES.filter((pandal) => {
      // Tier filter
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
      }

      // Search query
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
    return INITIAL_PANDAL_CANDIDATES.filter((p) => savedPandalIds.has(p.id));
  }, [savedPandalIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-[#0F172A] pb-24 md:pb-12 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <Header onSearchClick={() => document.getElementById("main-search")?.focus()} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 sm:space-y-10">
        {/* 1. Festival Hero & Welcome Section */}
        <section aria-labelledby="hero-welcome-title" className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#881337] via-[#9F1239] to-[#70102e] text-white p-6 sm:p-10 shadow-lg border border-[#9F1239]">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F59E0B] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sharod Utsav 2026 • Cooch Behar</span>
            </div>
            <h2 id="hero-welcome-title" className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {strings.appName}
            </h2>
            <p className="text-sm sm:text-base text-rose-100 max-w-xl leading-relaxed">
              {strings.tagline}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a href="#pandals-section">
                <Button
                  variant="gold"
                  size="md"
                  className="shadow-md"
                >
                  <Compass className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span>{strings.explorePandals}</span>
                </Button>
              </a>
              <a href="#essential-services">
                <Button
                  variant="outline"
                  size="md"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
                >
                  <PhoneCall className="w-4 h-4 mr-2 text-[#F59E0B]" aria-hidden="true" />
                  <span>Emergency Helplines</span>
                </Button>
              </a>
            </div>
          </div>
          {/* Subtle background ornamentation */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        </section>

        {/* 2. Prominent Pandal Search Field */}
        <section aria-label="Pandal Search" className="max-w-3xl mx-auto w-full">
          <SearchInput
            id="main-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder={strings.searchPlaceholder}
            className="shadow-md"
          />
        </section>

        {/* 3. Quick-Access Filter Chips */}
        <section aria-label="Pandal Tier Filters" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            {strings.quickFilters}:
          </span>
          <FilterChip
            label={strings.all}
            active={selectedTier === "all"}
            count={INITIAL_PANDAL_CANDIDATES.length}
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
            label={strings.top30}
            active={selectedTier === "top_30"}
            onClick={() => setSelectedTier("top_30")}
          />
          <FilterChip
            label={strings.top40}
            active={selectedTier === "top_40"}
            onClick={() => setSelectedTier("top_40")}
          />
        </section>

        {/* 4. Crowd Status Legend */}
        <section aria-labelledby="crowd-legend-heading" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h3 id="crowd-legend-heading" className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {strings.crowdLegendTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 block">
                  {strings.crowdLow}
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400">
                  {strings.crowdLowDesc}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
              <Users className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200 block">
                  {strings.crowdMed}
                </span>
                <span className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-400">
                  {strings.crowdMedDesc}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-rose-900 dark:text-rose-200 block">
                  {strings.crowdHigh}
                </span>
                <span className="text-[11px] sm:text-xs text-rose-700 dark:text-rose-300">
                  {strings.crowdHighDesc}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Main Pandal Grid / Directory Section */}
        <section id="pandals-section" aria-labelledby="pandals-heading">
          <SectionHeading
            title={selectedTier === "all" ? strings.all : `Filtered (${filteredPandals.length})`}
            subtitle="Heritage and popular community pandals across Cooch Behar"
            action={
              <span className="text-xs text-slate-500 font-mono">
                Showing {filteredPandals.length} pandals
              </span>
            }
          />

          {filteredPandals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              title="No pandals found"
              description={`No pandals match the search term "${searchQuery}". Please check your spelling or clear filter chips.`}
              action={
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTier("all");
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          )}
        </section>

        {/* 6. Quick Access Cards: Essential Services (Police, Hospital, Toilet, Water) */}
        <section id="essential-services" aria-labelledby="services-heading">
          <SectionHeading
            title={strings.essentialServices}
            subtitle="24x7 verified emergency facilities and visitor care points"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setActiveServiceModal("police")}
              className="touch-target-min p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#881337] dark:hover:border-[#F59E0B] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {strings.policeAssistance}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Kotwali Sadar • 112
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveServiceModal("hospital")}
              className="touch-target-min p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#881337] dark:hover:border-[#F59E0B] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-3">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {strings.nearbyHospitals}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  MJN Hospital • 102
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveServiceModal("toilets")}
              className="touch-target-min p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#881337] dark:hover:border-[#F59E0B] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {strings.toilets}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Bus Terminus & Madan Mohan
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveServiceModal("water")}
              className="touch-target-min p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#881337] dark:hover:border-[#F59E0B] shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer focus-ring"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 flex items-center justify-center mb-3">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {strings.drinkingWater}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Debibari & Town Outposts
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* 7. Saved Route / Bookmarked Pandals Section */}
        <section id="saved-section" aria-labelledby="saved-heading">
          <SectionHeading
            title={strings.savedSectionTitle}
            subtitle="Custom route planner for your family and senior group"
            action={
              <span className="text-xs text-slate-500 font-mono">
                {savedPandals.length} bookmarked
              </span>
            }
          />
          {savedPandals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No saved pandals yet"
              description={strings.savedEmptyState}
            />
          )}
        </section>

        {/* 8. Concise Advisory & Disclaimer Notice */}
        <section aria-labelledby="disclaimer-title" className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h4 id="disclaimer-title" className="font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-100">
                {strings.disclaimerTitle}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                {strings.disclaimerText}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Pandal Detail Placeholder Modal */}
      {selectedPandalModal && (
        <ModalShell
          isOpen={Boolean(selectedPandalModal)}
          onClose={() => setSelectedPandalModal(null)}
          title={selectedPandalModal.name}
          description={`Zone: ${selectedPandalModal.zone} • Code: #${selectedPandalModal.codeName}`}
        >
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Heritage & Milestone:
              </p>
              <p>{selectedPandalModal.milestoneYear || "Annual Sarbojanin Durgotsav"}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Vehicle & Senior Accessibility:
              </p>
              <p>
                {selectedPandalModal.vehicleAllowed === "all_vehicles"
                  ? "Toto and vehicle access allowed near entrance queue."
                  : "Pedestrian-only or two-wheeler corridor. Recommended walking distance ~100m."}
              </p>
            </div>

            <p className="text-xs text-slate-500 italic">
              Interactive map navigation and live crowd reporting features will connect to this card in upcoming steps.
            </p>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setSelectedPandalModal(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Emergency Service Detail Modal */}
      {activeServiceModal && (
        <ModalShell
          isOpen={Boolean(activeServiceModal)}
          onClose={() => setActiveServiceModal(null)}
          title={
            activeServiceModal === "police"
              ? "Police Assistance & Control Room"
              : activeServiceModal === "hospital"
              ? "Medical Aid & Hospitals"
              : activeServiceModal === "toilets"
              ? "Public Restrooms"
              : "Drinking Water Facilities"
          }
          description="Verified 24x7 emergency contacts for Cooch Behar Puja"
        >
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {activeServiceModal === "police" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Kotwali Police Station (Cooch Behar Sadar):
                </p>
                <p className="font-mono text-base text-[#881337] dark:text-[#F59E0B]">
                  03582-222303 / 112
                </p>
                <p className="text-xs text-slate-500">
                  Police booths stationed across Madan Mohan Bari, Subhash Pally, and Central Bus Terminus.
                </p>
              </div>
            )}

            {activeServiceModal === "hospital" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  MJN Medical College & Hospital (Emergency):
                </p>
                <p className="font-mono text-base text-[#881337] dark:text-[#F59E0B]">
                  03582-222238 / 102
                </p>
                <p className="text-xs text-slate-500">
                  Ambulance and first-aid response team on 24x7 standby.
                </p>
              </div>
            )}

            {activeServiceModal === "toilets" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Public Restroom Locations:
                </p>
                <ul className="text-xs list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Central Bus Terminus Sanitized Restroom Block</li>
                  <li>Madan Mohan Bari Visitor Complex</li>
                  <li>Sagar Dighi North Bank Public Facility</li>
                </ul>
              </div>
            )}

            {activeServiceModal === "water" && (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Free Drinking Water Kiosks:
                </p>
                <ul className="text-xs list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Madan Mohan Bari Debibari Kiosk</li>
                  <li>Cooch Behar Municipality Sagar Dighi Point</li>
                  <li>Station Road Outpost</li>
                </ul>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setActiveServiceModal(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
