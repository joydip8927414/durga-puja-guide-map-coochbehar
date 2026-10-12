import { Shield, Sparkles, MapPin, Compass, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Header Banner */}
        <div className="bg-[#881337] px-6 py-8 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9F1239] text-[#F59E0B] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            Step 1: Secure Foundation Initialized
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cooch Behar Durga Puja Interactive Guide
          </h1>
          <p className="mt-2 text-rose-100 text-sm sm:text-base">
            Secure, mobile-first Progressive Web App (PWA) navigation and pandal discovery platform.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                <Shield className="w-5 h-5 text-[#881337]" />
                Security Architecture
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Strict CSP, secret isolation, sanitized input boundaries, and no privileged keys in client bundles.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                <MapPin className="w-5 h-5 text-[#D97706]" />
                Pandal & Map Ready
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Directory schema & React Leaflet tile boundaries established for future mapping layers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                <Compass className="w-5 h-5 text-[#881337]" />
                Accessible Navigation
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                48px+ touch targets, WCAG AA contrast, and screen-reader accessibility standards configured.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-semibold text-sm">
                <Users className="w-5 h-5 text-[#D97706]" />
                Bengali & English Multi-lingual
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Localization scaffolding ready for seamless bilingual cultural guidance and senior care.
              </p>
            </div>
          </div>

          {/* Design System Palette Swatches */}
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Configured Design System Tokens
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px] font-mono">
              <div className="p-2 rounded bg-[#881337] text-white">
                <span className="block font-semibold">Royal</span>#881337
              </div>
              <div className="p-2 rounded bg-[#9F1239] text-white">
                <span className="block font-semibold">Crimson</span>#9F1239
              </div>
              <div className="p-2 rounded bg-[#F59E0B] text-slate-900 font-medium">
                <span className="block font-semibold">Gold</span>#F59E0B
              </div>
              <div className="p-2 rounded bg-[#D97706] text-white">
                <span className="block font-semibold">Deep Gold</span>#D97706
              </div>
              <div className="p-2 rounded bg-[#0F172A] text-white">
                <span className="block font-semibold">Dark BG</span>#0F172A
              </div>
              <div className="p-2 rounded bg-[#FFFFFF] border border-slate-300 text-slate-900">
                <span className="block font-semibold">Light BG</span>#FFFFFF
              </div>
            </div>
          </div>

          {/* Interactive Touch Target Demo Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Status: Baseline verification complete. Ready for Step 2.
            </span>
            <button
              type="button"
              className="touch-target-min w-full sm:w-auto px-6 rounded-lg bg-[#881337] hover:bg-[#9F1239] active:bg-[#70102e] text-white font-medium text-sm transition-colors focus-ring cursor-pointer"
            >
              Touch Target (48px Min)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
