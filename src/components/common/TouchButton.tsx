import React from "react";

export interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold";
}

/**
 * Foundational Touch Button enforcing minimum 48px interactive target
 * and high-contrast visible focus indicators for mobile accessibility.
 */
export function TouchButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: TouchButtonProps) {
  const variantStyles = {
    primary: "bg-[#881337] hover:bg-[#9F1239] text-white",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100",
    gold: "bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-semibold",
  };

  return (
    <button
      className={`touch-target-min px-4 py-2 rounded-lg font-medium text-sm transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
