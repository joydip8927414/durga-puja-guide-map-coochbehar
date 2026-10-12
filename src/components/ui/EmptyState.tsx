import React from "react";
import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 sm:p-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center ${className}`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#881337]/10 dark:bg-[#9F1239]/20 text-[#881337] dark:text-[#F59E0B] flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}
      </h3>
      <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
