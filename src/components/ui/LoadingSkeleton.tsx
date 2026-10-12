import React from "react";

export interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "h-4 w-full" }: LoadingSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function PandalCardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading pandal card"
      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
    >
      <div className="flex justify-between items-start gap-4">
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-8 w-8 rounded-full" />
      </div>
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="pt-2 flex gap-2">
        <LoadingSkeleton className="h-6 w-20 rounded-md" />
        <LoadingSkeleton className="h-6 w-24 rounded-md" />
      </div>
    </div>
  );
}
