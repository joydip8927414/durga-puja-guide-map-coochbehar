import React from "react";

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 ${className}`}>
      <div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-[#881337] dark:bg-[#F59E0B]" aria-hidden="true" />
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="self-start sm:self-auto">{action}</div>}
    </div>
  );
}
