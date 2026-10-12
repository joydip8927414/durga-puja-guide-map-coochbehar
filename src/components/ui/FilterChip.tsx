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
      className={`touch-target-min px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors select-none cursor-pointer focus-ring whitespace-nowrap border ${
        active
          ? "bg-[#C8102E] border-[#C8102E] text-white shadow-sm"
          : "bg-white dark:bg-stone-900 border-[#E7E0D2] dark:border-stone-700 text-[#292524] dark:text-stone-200 hover:bg-[#FFF8E7] dark:hover:bg-stone-800"
      } ${className}`}
      {...props}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
            active
              ? "bg-[#9F1239] text-white"
              : "bg-[#F4F1E8] dark:bg-stone-800 text-[#78716C] dark:text-stone-400"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
