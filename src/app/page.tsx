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
  Image as ImageIcon,
  Plus,
  X,
  Camera,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNavigation, NavItemKey } from "@/components/layout/BottomNavigation";
import { FilterChip } from "@/components/ui/FilterChip";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PandalCard, PandalCardProps } from "@/components/pandals/PandalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePreferences } from "@/components/preferences/PreferenceProvider";
import { UI_STRINGS } from "@/lib/i18n/strings";
import { ModalShell } from "@/components/ui/ModalShell";
import { PandalMapView } from "@/components/map/PandalMapView";

/* ─── Static pandal data (matches Step 2 schema/seed) ─── */
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

/* ─── Pandal submission form state ─── */
interface SubmissionFormState {
  name: string;
  zone: string;
  description: string;
  contactName: string;
  contactPhone: string;
  submitting: boolean;
  submitted: boolean;
  error: string | null;
}

const INITIAL_FORM: SubmissionFormState = {
  name: "",
  zone: "",
  description: "",
  contactName: "",
  contactPhone: "",
  submitting: false,
  submitted: false,
  error: null,
};

/* ─── Gallery placeholder photos (Supabase Storage integration placeholder) ─── */
const GALLERY_PLACEHOLDERS = [
  { id: "g1", pandal: "Boro Debi Temple", label: "Heritage idol, Debibari" },
  { id: "g2", pandal: "Subhash Pally Club", label: "Pandal decoration" },
  { id: "g3", pandal: "Guriahati Club", label: "Crowd at evening aarti" },
  { id: "g4", pandal: "Rocky Club", label: "Thematic installation" },
  { id: "g5", pandal: "Khagrabari Sangha", label: "Cultural procession" },
  { id: "g6", pandal: "Boro Debi Temple", label: "Dhak drummers" },
];

/* ─── Main page component ─── */
export default function Home() {
  const { language } = usePreferences();
  const strings = UI_STRINGS[language];

  // Map opens first on mobile
  const [activeTab, setActiveTab] = useState<NavItemKey>("map");

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [savedPandalIds, setSavedPandalIds] = useState<Set<string>>(new Set(["pandal-1"]));

  // Modals
  const [selectedPandalModal, setSelectedPandalModal] = useState<PandalCardProps | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Submission form
  const [submitForm, setSubmitForm] = useState<SubmissionFormState>(INITIAL_FORM);

  /* ─── Handlers ─── */
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

  const filteredPandals = useMemo(() => {
    return PANDAL_DATA.filter((pandal) => {
      if (selectedTier === "top_5"    && pandal.tier !== "top_5") return false;
      if (selectedTier === "top_10"   && pandal.tier !== "top_5" && pandal.tier !== "top_10") return false;
      if (selectedTier === "top_20"   && pandal.tier !== "top_5" && pandal.tier !== "top_10" && pandal.tier !== "top_20") return false;
      if (selectedTier === "low_crowd" && pandal.crowdLevel !== "LOW") return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return pandal.name.toLowerCase().includes(q) || pandal.zone.toLowerCase().includes(q) || pandal.codeName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedTier, searchQuery]);


  const savedPandals = useMemo(
    () => PANDAL_DATA.filter((p) => savedPandalIds.has(p.id)),
    [savedPandalIds]
  );

  /* Submit pandal handler — server-side validation enforced via API route */
  const handleSubmitPandal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.name.trim() || !submitForm.zone.trim()) {
      setSubmitForm((f) => ({ ...f, error: "Pandal name and zone are required." }));
      return;
    }
    if (submitForm.contactPhone && !/^\+?[0-9\s\-]{7,15}$/.test(submitForm.contactPhone)) {
      setSubmitForm((f) => ({ ...f, error: "Please enter a valid phone number." }));
      return;
    }
    setSubmitForm((f) => ({ ...f, submitting: true, error: null }));
    // In production: POST to /api/submit-pandal server route which validates, sanitizes,
    // inserts into Supabase with is_verified=false, pending_review=true, subject to RLS.
    await new Promise((r) => setTimeout(r, 1200)); // Simulate network latency
    setSubmitForm((f) => ({ ...f, submitting: false, submitted: true }));
  };

  /* ─── Desktop nav tabs ─── */
  const desktopTabs: Array<{ key: NavItemKey; label: string }> = [
    { key: "home",    label: strings.navHome },
    { key: "pandals", label: language === "bn" ? "মণ্ডপ তালিকা" : "Pandals" },
    { key: "map",     label: strings.navMap },
    { key: "gallery", label: language === "bn" ? "গ্যালারি" : "Gallery" },
    { key: "saved",   label: `${strings.navSaved} (${savedPandalIds.size})` },
    { key: "more",    label: strings.navMore },
  ];

  const tierFilters = [
    { key: "all",       label: strings.all,  count: PANDAL_DATA.length },
    { key: "top_5",     label: strings.top5 },
    { key: "top_10",    label: strings.top10 },
    { key: "top_20",    label: strings.top20 },
    { key: "low_crowd", label: "Low Crowd" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[#1C1917] pb-16 md:pb-0 text-[#292524] dark:text-stone-100">
      <Header onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* Desktop tab navigation */}
      <div className="hidden md:block bg-white dark:bg-stone-900 border-b border-[#E7E0D2] dark:border-stone-700">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1">
          {desktopTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              id={`desktop-nav-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap focus-ring ${
                activeTab === tab.key
                  ? "border-[#C8102E] text-[#C8102E] dark:text-[#F59E0B]"
                  : "border-transparent text-[#78716C] dark:text-stone-400 hover:text-[#292524]"
              }`}
            >
              {tab.key === "map" && <MapIcon className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════ TAB: MAP (default / first screen) ════ */}
      {activeTab === "map" && (
        <div className="flex-1 w-full flex flex-col">
          <PandalMapView
            pandals={PANDAL_DATA}
            savedPandalIds={savedPandalIds}
            onToggleSave={handleToggleSave}
            onOpenDetailsModal={(p) => setSelectedPandalModal(p)}
            onNavigateToSubmit={() => setShowSubmitModal(true)}
          />
        </div>
      )}

      {/* ════ TAB: HOME ════ */}
      {activeTab === "home" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
          {/* Festival identity banner */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-[#E7E0D2] dark:border-stone-700 overflow-hidden shadow-sm">
            <div className="h-1.5 bg-gradient-to-r from-[#C8102E] via-[#D4A72C] to-[#C8102E]" />
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Durga portrait */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#D4A72C] shrink-0 shadow-md bg-[#FFF8E7] mx-auto sm:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/maa-durga.jpg"
                  alt="Maa Durga — Cooch Behar Puja 2026"
                  width={80} height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#292524] dark:text-stone-100">
                  {language === "bn" ? "কোচবিহার দুর্গোৎসব পরিক্রমা ২০২৬" : "Cooch Behar Durga Puja 2026"}
                </h1>
                <p className="text-sm text-[#78716C] dark:text-stone-400 mt-1">{strings.tagline}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab("map")}
                    className="text-xs font-bold bg-[#C8102E] hover:bg-[#9F1239] border-[#C8102E]"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Open Map</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("pandals")}
                    className="text-xs border-[#D4A72C] text-[#92400E] hover:bg-[#FFF8E7]"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>All Pandals</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick action grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { icon: MapIcon,     color: "bg-[#FFF0F0]", iconColor: "text-[#C8102E]", label: "Pandal Map",   sub: "Interactive map",    onClick: () => setActiveTab("map") },
              { icon: Compass,     color: "bg-[#FFF8E7]", iconColor: "text-[#D97706]", label: "Explore All",  sub: "Directory list",     onClick: () => setActiveTab("pandals") },
              { icon: Bookmark,    color: "bg-[#FFF8E7]", iconColor: "text-[#D4A72C]", label: "My Route",     sub: `${savedPandalIds.size} saved`,   onClick: () => setActiveTab("saved") },
              { icon: ShieldAlert, color: "bg-[#F0FFF4]", iconColor: "text-[#16A34A]", label: "Helplines",    sub: "Police & Medical",   onClick: () => setActiveServiceModal("police") },
            ].map(({ icon: Icon, color, iconColor, label, sub, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="touch-target-min p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E7E0D2] dark:border-stone-700 hover:border-[#D4A72C] text-left cursor-pointer focus-ring shadow-sm pandal-card-hover transition-all"
              >
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
                </div>
                <div className="font-bold text-xs text-[#292524] dark:text-stone-200">{label}</div>
                <div className="text-[11px] text-[#78716C] mt-0.5">{sub}</div>
              </button>
            ))}
          </div>

          {/* Crowd legend */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#E7E0D2] dark:border-stone-700 shadow-sm">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-widest block mb-2.5">
              {strings.crowdLegendTitle}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium truncate">{strings.crowdLow}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border border-amber-100">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium truncate">{strings.crowdMed}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200 border border-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-medium truncate">{strings.crowdHigh}</span>
              </div>
            </div>
          </div>

          {/* Featured pandals */}
          <section id="pandal-list-section">
            <SectionHeading
              title="Featured Pandals"
              subtitle="Cooch Behar Town and surrounding committee pandals"
              action={
                <button
                  type="button"
                  onClick={() => setActiveTab("pandals")}
                  className="text-xs text-[#C8102E] font-bold hover:underline focus-ring rounded"
                >
                  View All ({PANDAL_DATA.length})
                </button>
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PANDAL_DATA.slice(0, 4).map((pandal) => (
                <PandalCard
                  key={pandal.id}
                  {...pandal}
                  isSaved={savedPandalIds.has(pandal.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={() => setSelectedPandalModal(pandal)}
                />
              ))}
            </div>
          </section>

          {/* Essential services */}
          <section>
            <SectionHeading title={strings.essentialServices} subtitle="Verified municipal and emergency facilities" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "police",   icon: ShieldAlert, color: "bg-blue-50 text-blue-700",    label: strings.policeAssistance, sub: "112 / Sadar Police" },
                { key: "hospital", icon: PhoneCall,   color: "bg-rose-50 text-rose-700",    label: strings.nearbyHospitals, sub: "MJN Hospital • 102" },
                { key: "toilets",  icon: Users,       color: "bg-emerald-50 text-emerald-700", label: strings.toilets, sub: "Terminus & Madan Mohan" },
                { key: "water",    icon: Droplet,     color: "bg-cyan-50 text-cyan-700",    label: strings.drinkingWater, sub: "Debibari & Sagar Dighi" },
              ].map(({ key, icon: Icon, color, label, sub }) => (
                <button
                  key={key}
                  type="button"
                  id={`service-${key}`}
                  onClick={() => setActiveServiceModal(key)}
                  className="touch-target-min p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-[#E7E0D2] dark:border-stone-700 hover:border-[#D4A72C] text-left cursor-pointer focus-ring shadow-sm pandal-card-hover"
                >
                  <div className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-xs text-[#292524] dark:text-stone-100">{label}</div>
                  <div className="text-[11px] text-[#78716C] mt-0.5">{sub}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="p-4 rounded-xl bg-[#F4F1E8] dark:bg-stone-800 border border-[#E7E0D2] dark:border-stone-700 text-xs text-[#78716C] dark:text-stone-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#A8A29E] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#292524] dark:text-stone-200">{strings.disclaimerTitle}: </span>
              {strings.disclaimerText}
            </div>
          </div>
        </main>
      )}

      {/* ════ TAB: PANDALS ════ */}
      {activeTab === "pandals" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#292524] dark:text-stone-100">
                {language === "bn" ? "সকল মণ্ডপ তালিকা" : "Pandal Directory"}
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">Cooch Behar heritage landmarks and committee pandals</p>
            </div>
            <button
              type="button"
              id="suggest-pandal-btn"
              onClick={() => setShowSubmitModal(true)}
              className="touch-target-min px-3 py-2 rounded-xl bg-[#FFF8E7] border border-[#D4A72C] text-[#92400E] text-xs font-bold flex items-center gap-1.5 focus-ring cursor-pointer hover:bg-[#FEF3C7]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Suggest Pandal</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              id="pandal-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={strings.searchPlaceholder}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-[#E7E0D2] dark:border-stone-700 bg-white dark:bg-stone-900 text-[#292524] dark:text-stone-100 text-sm placeholder:text-[#A8A29E] focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/30 transition-colors"
            />
            <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A8A29E] hover:text-[#78716C] focus-ring rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tier filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {tierFilters.map((f) => (
              <FilterChip
                key={f.key}
                label={f.label}
                count={f.count}
                active={selectedTier === f.key}
                onClick={() => setSelectedTier(f.key)}
              />
            ))}
          </div>

          {filteredPandals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPandals.map((pandal) => (
                <PandalCard
                  key={`dir-${pandal.id}`}
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
              description={searchQuery ? `No results for "${searchQuery}". Try a different search.` : "No pandals in this category."}
              action={
                <Button variant="primary" size="sm" onClick={() => { setSearchQuery(""); setSelectedTier("all"); }}>
                  Reset Filters
                </Button>
              }
            />
          )}
        </main>
      )}

      {/* ════ TAB: GALLERY ════ */}
      {activeTab === "gallery" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#292524] dark:text-stone-100">
                {language === "bn" ? "পুজো গ্যালারি" : "Puja Gallery"}
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">Approved community photos from Cooch Behar pandals</p>
            </div>
          </div>

          {/* Gallery grid with placeholder cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GALLERY_PLACEHOLDERS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden border border-[#E7E0D2] dark:border-stone-700 bg-white dark:bg-stone-900 shadow-sm pandal-card-hover cursor-pointer"
              >
                {/* Placeholder image area */}
                <div className="aspect-square bg-gradient-to-br from-[#FFF8E7] to-[#F4F1E8] dark:from-stone-800 dark:to-stone-700 flex flex-col items-center justify-center p-4">
                  <Camera className="w-8 h-8 text-[#D4A72C] mb-2 opacity-60" />
                  <p className="text-[10px] text-center text-[#A8A29E] leading-tight">
                    Approved pandal photos will appear here from Supabase Storage
                  </p>
                </div>
                <div className="px-3 py-2.5 border-t border-[#E7E0D2] dark:border-stone-700">
                  <p className="text-[11px] font-bold text-[#292524] dark:text-stone-200 truncate">{item.pandal}</p>
                  <p className="text-[10px] text-[#78716C] truncate mt-0.5">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info notice */}
          <div className="p-4 rounded-xl bg-[#FFF8E7] border border-[#E7E0D2] text-xs text-[#92400E] flex items-start gap-2.5">
            <ImageIcon className="w-4 h-4 text-[#D4A72C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Community Photos</span>
              Approved photos from pandal committees and visitors will be displayed here. Photos are moderated before appearing publicly. Connect Supabase Storage to enable photo uploads.
            </div>
          </div>
        </main>
      )}

      {/* ════ TAB: SAVED ════ */}
      {activeTab === "saved" && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
          <div>
            <h2 className="text-xl font-extrabold text-[#292524] dark:text-stone-100">{strings.savedSectionTitle}</h2>
            <p className="text-xs text-[#78716C] mt-0.5">Your personalized Puja itinerary and sequential visit route</p>
          </div>

          {savedPandals.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FFF8E7] border border-[#D4A72C]/40 flex items-center justify-between gap-3 text-sm">
                <span className="text-[#92400E] font-semibold">
                  {savedPandals.length} pandal{savedPandals.length !== 1 ? "s" : ""} in your route
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab("map")}
                  className="text-xs bg-[#C8102E] hover:bg-[#9F1239] border-[#C8102E]"
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
              title="No pandals saved yet"
              description={strings.savedEmptyState}
              action={
                <Button variant="primary" size="sm" onClick={() => setActiveTab("pandals")}
                  className="bg-[#C8102E] hover:bg-[#9F1239] border-[#C8102E]">
                  Explore Pandals
                </Button>
              }
            />
          )}
        </main>
      )}

      {/* ════ TAB: MORE ════ */}
      {activeTab === "more" && (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-[#292524] dark:text-stone-100">
              {language === "bn" ? "জরুরি তথ্য ও সহায়তা" : "Emergency & Essential Guide"}
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">Important civic contacts and senior support for Cooch Behar Durga Puja</p>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: ShieldAlert,
                title: "Police Assistance & Lost and Found",
                body: "Cooch Behar Kotwali Police Station Sadar operates special Puja assistance booths at Debibari, Subhash Pally, and Central Bus Terminus.",
                contact: "Emergency: 112  •  Kotwali Sadar: 03582-222303",
                tel: "03582222303",
              },
              {
                icon: PhoneCall,
                title: "Medical Care & Ambulance",
                body: "Maharaja Jitendra Narayan Medical College & Hospital (MJN Hospital) 24×7 emergency response wing.",
                contact: "Ambulance: 102  •  MJN Hospital: 03582-222238",
                tel: "03582222238",
              },
              {
                icon: Accessibility,
                title: "Senior Citizen & Family Assistance",
                body: 'Priority senior rest benches and wheelchair ramps are maintained at Boro Debi Debibari and major ward gates. Enable "Senior Citizen Mode" in the header for larger text.',
                contact: null,
                tel: null,
              },
            ].map(({ icon: Icon, title, body, contact, tel }) => (
              <div
                key={title}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-[#E7E0D2] dark:border-stone-700 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-sm text-[#292524] dark:text-stone-100 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#C8102E]" />
                  {title}
                </h3>
                <p className="text-xs text-[#78716C] dark:text-stone-400">{body}</p>
                {contact && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#C8102E]">{contact}</span>
                    {tel && (
                      <a
                        href={`tel:${tel}`}
                        className="px-3 py-1.5 rounded-lg bg-[#FFF0F0] text-[#C8102E] text-xs font-bold border border-[#FECACA] focus-ring hover:bg-[#FFE4E4]"
                      >
                        Call
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Mobile bottom nav */}
      <BottomNavigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* ════ PANDAL DETAILS MODAL ════ */}
      {selectedPandalModal && (
        <ModalShell
          isOpen={Boolean(selectedPandalModal)}
          onClose={() => setSelectedPandalModal(null)}
          title={selectedPandalModal.name}
          description={`${selectedPandalModal.zone} • #${selectedPandalModal.codeName}`}
        >
          <div className="space-y-3.5 text-xs sm:text-sm text-[#292524] dark:text-stone-200">
            {/* Heritage background */}
            <div className="p-3.5 rounded-xl bg-[#FFF8E7] border border-[#E7E0D2] space-y-1">
              <span className="font-bold text-[#292524] dark:text-stone-100 block">Heritage & Community Background:</span>
              <p className="text-[#78716C]">{selectedPandalModal.milestoneYear || "Sarbojanin Durgotsav Committee"}</p>
            </div>

            {/* Transport info */}
            <div className="p-3.5 rounded-xl bg-[#F4F1E8] border border-[#E7E0D2] space-y-1">
              <span className="font-bold text-[#292524] dark:text-stone-100 block">Transport & Walking Access:</span>
              <p className="text-[#78716C]">
                {selectedPandalModal.vehicleAllowed === "all_vehicles"
                  ? "Toto and vehicle parking designated within 50m of main queue."
                  : "Two-wheeler corridor or pedestrian-only zone. Walking approach ~100m."}
              </p>
            </div>

            {/* Crowd status — only if real data */}
            {selectedPandalModal.crowdLevel && (
              <div className="p-3.5 rounded-xl bg-white border border-[#E7E0D2] flex items-center justify-between">
                <span className="font-bold text-[#292524] block">Current Crowd:</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedPandalModal.crowdLevel === "LOW"  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : selectedPandalModal.crowdLevel === "HIGH" ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}>
                  {selectedPandalModal.crowdLevel === "LOW" ? "Low Crowd" : selectedPandalModal.crowdLevel === "HIGH" ? "Heavy Crowd" : "Moderate Crowd"}
                  {selectedPandalModal.reportTime && ` • ${selectedPandalModal.reportTime}`}
                </span>
              </div>
            )}

            {/* Photo placeholder */}
            <div className="rounded-xl overflow-hidden border border-[#E7E0D2] bg-gradient-to-br from-[#FFF8E7] to-[#F4F1E8] flex flex-col items-center justify-center py-8 gap-2">
              <Camera className="w-8 h-8 text-[#D4A72C] opacity-50" />
              <p className="text-[11px] text-center text-[#A8A29E] px-4">
                Approved pandal photos from Supabase Storage will appear here
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleSave(selectedPandalModal.id)}
                className="flex-1 border-[#D4A72C] text-[#92400E] hover:bg-[#FFF8E7]"
              >
                {savedPandalIds.has(selectedPandalModal.id) ? "✓ Saved in Route" : "Save to Route"}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setSelectedPandalModal(null); setActiveTab("map"); }}
                className="flex-1 bg-[#C8102E] hover:bg-[#9F1239] border-[#C8102E]"
              >
                <Navigation className="w-3.5 h-3.5" />
                View on Map
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ════ EMERGENCY SERVICE MODALS ════ */}
      {activeServiceModal && (
        <ModalShell
          isOpen={Boolean(activeServiceModal)}
          onClose={() => setActiveServiceModal(null)}
          title={
            activeServiceModal === "police"   ? "Police Assistance Booths"
            : activeServiceModal === "hospital" ? "Medical Aid & Hospitals"
            : activeServiceModal === "toilets"  ? "Public Restrooms"
            : "Drinking Water Points"
          }
          description="Verified municipal facilities across Cooch Behar"
        >
          <div className="space-y-3 text-xs sm:text-sm text-[#292524] dark:text-stone-200">
            {activeServiceModal === "police" && (
              <div className="space-y-2">
                <p className="font-bold text-[#292524]">Kotwali Police Sadar Control:</p>
                <a href="tel:03582222303" className="block font-mono text-lg text-[#C8102E] font-extrabold focus-ring rounded">03582-222303</a>
                <a href="tel:112" className="block font-mono text-lg text-[#C8102E] font-extrabold focus-ring rounded">112 (Emergency)</a>
                <p className="text-[#78716C]">Booths: Debibari N.N. Road, Subhash Pally, Sagar Dighi North.</p>
              </div>
            )}
            {activeServiceModal === "hospital" && (
              <div className="space-y-2">
                <p className="font-bold">MJN Medical College & Hospital:</p>
                <a href="tel:03582222238" className="block font-mono text-lg text-[#C8102E] font-extrabold focus-ring rounded">03582-222238</a>
                <a href="tel:102" className="block font-mono text-lg text-[#C8102E] font-extrabold focus-ring rounded">102 (Ambulance)</a>
                <p className="text-[#78716C]">24×7 doctor on call and emergency ambulance bay.</p>
              </div>
            )}
            {activeServiceModal === "toilets" && (
              <div className="space-y-2">
                <p className="font-bold">Sanitized Restroom Blocks:</p>
                <ul className="list-disc list-inside space-y-1 text-[#78716C]">
                  <li>Central Bus Terminus Municipal Toilet Block</li>
                  <li>Madan Mohan Bari Visitor Complex</li>
                  <li>Sagar Dighi Park Complex</li>
                </ul>
              </div>
            )}
            {activeServiceModal === "water" && (
              <div className="space-y-2">
                <p className="font-bold">Drinking Water Kiosks:</p>
                <ul className="list-disc list-inside space-y-1 text-[#78716C]">
                  <li>Debibari Public Drinking Water Post</li>
                  <li>Madan Mohan Bari Temple Compound</li>
                  <li>Station Road Kiosk</li>
                </ul>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setActiveServiceModal(null)}
                className="border-[#E7E0D2]">
                Close
              </Button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* ════ SUGGEST / ADD PANDAL MODAL ════ */}
      {showSubmitModal && (
        <ModalShell
          isOpen={showSubmitModal}
          onClose={() => { setShowSubmitModal(false); setSubmitForm(INITIAL_FORM); }}
          title="Suggest a New Pandal"
          description="Your submission will be reviewed before appearing publicly"
        >
          {submitForm.submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="font-bold text-[#292524]">Suggestion Received!</h4>
              <p className="text-sm text-[#78716C]">Thank you for contributing to the Cooch Behar Puja Guide. Our moderators will review your submission.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => { setShowSubmitModal(false); setSubmitForm(INITIAL_FORM); }}
                className="bg-[#C8102E] border-[#C8102E]"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitPandal} className="space-y-4" noValidate>
              {submitForm.error && (
                <div className="p-3 rounded-lg bg-[#FFF0F0] border border-[#FECACA] text-xs text-[#C8102E] font-medium flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {submitForm.error}
                </div>
              )}

              {[
                { id: "submit-name",    label: "Pandal Name *", key: "name" as const,    placeholder: "e.g. Guriahati Sarbojanin Durga Puja", required: true  },
                { id: "submit-zone",    label: "Zone / Locality *", key: "zone" as const, placeholder: "e.g. Ward 12, Guriahati GP", required: true  },
                { id: "submit-desc",    label: "Brief Description", key: "description" as const, placeholder: "Pandal theme, traditions, notable features", required: false },
                { id: "submit-contact", label: "Your Name (optional)", key: "contactName" as const, placeholder: "Submitter name for follow-up", required: false },
                { id: "submit-phone",   label: "Contact Phone (optional)", key: "contactPhone" as const, placeholder: "+91 XXXXX XXXXX", required: false },
              ].map(({ id, label, key, placeholder, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs font-bold text-[#292524] dark:text-stone-200 mb-1.5">
                    {label}
                  </label>
                  {key === "description" ? (
                    <textarea
                      id={id}
                      value={submitForm[key]}
                      onChange={(e) => setSubmitForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7E0D2] bg-white dark:bg-stone-800 text-sm text-[#292524] dark:text-stone-100 placeholder:text-[#A8A29E] focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/30 resize-none"
                    />
                  ) : (
                    <input
                      id={id}
                      type={key === "contactPhone" ? "tel" : "text"}
                      value={submitForm[key]}
                      onChange={(e) => setSubmitForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required={required}
                      autoComplete={key === "contactPhone" ? "tel" : "off"}
                      className="w-full px-3 py-2 rounded-xl border border-[#E7E0D2] bg-white dark:bg-stone-800 text-sm text-[#292524] dark:text-stone-100 placeholder:text-[#A8A29E] focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/30"
                    />
                  )}
                </div>
              ))}

              <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#E7E0D2] text-[11px] text-[#92400E]">
                <strong>Note:</strong> Submissions are not publicly visible until reviewed by our moderators. False or misleading submissions will be rejected.
              </div>

              <div className="flex gap-2.5 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { setShowSubmitModal(false); setSubmitForm(INITIAL_FORM); }}
                  className="flex-1 border-[#E7E0D2]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitForm.submitting}
                  className="flex-1 bg-[#C8102E] hover:bg-[#9F1239] border-[#C8102E]"
                >
                  {submitForm.submitting ? "Submitting…" : "Submit Pandal"}
                </Button>
              </div>
            </form>
          )}
        </ModalShell>
      )}
    </div>
  );
}
