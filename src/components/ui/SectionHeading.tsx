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
    <div className={`flex flex-row items-baseline justify-between gap-2 mb-3 ${className}`}>
      <div>
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
