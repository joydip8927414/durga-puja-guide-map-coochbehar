import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  // Enforcing 48px min height (touch-target-min) on interactive buttons
  const baseStyles =
    "touch-target-min rounded-xl font-medium transition-colors focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    md: "px-5 py-3 text-sm sm:text-base",
    lg: "px-6 py-3.5 text-base sm:text-lg font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[#881337] hover:bg-[#9F1239] active:bg-[#70102e] text-white shadow-sm border border-transparent",
    secondary:
      "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700",
    gold:
      "bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] text-slate-950 font-semibold shadow-sm border border-transparent",
    outline:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-transparent",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
