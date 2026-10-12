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
      className={`touch-target-min px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all select-none cursor-pointer focus-ring whitespace-nowrap border ${
        active
          ? "bg-[#881337] border-[#881337] text-white shadow-sm"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
      } ${className}`}
      {...props}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
            active
              ? "bg-[#9F1239] text-[#F59E0B]"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
