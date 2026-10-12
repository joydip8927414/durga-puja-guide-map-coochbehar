import React from "react";

export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label: string;
  count?: number;
}

export function FilterChip({
  active = false,
  label,
  count,
  className = "",
  type = "button",
  ...props
}: FilterChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={`touch-target-min px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors select-none cursor-pointer focus-ring whitespace-nowrap border ${
        active
          ? "bg-[#9F1239] border-[#9F1239] text-white shadow-2xs"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
      } ${className}`}
      {...props}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`ml-1.5 px-1.5 py-0.2 rounded text-[11px] font-semibold ${
            active
              ? "bg-[#881337] text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
