import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
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
  // Enforces 48px min height (touch-target-min) on interactive buttons with clean, restrained geometry
  const baseStyles =
    "touch-target-min rounded-lg font-medium transition-colors focus-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none inline-flex items-center justify-center gap-2";

  const sizeStyles = {
    sm: "px-3 py-2 text-xs sm:text-sm",
    md: "px-4 py-2.5 text-sm sm:text-base",
    lg: "px-5 py-3 text-base font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-[#9F1239] hover:bg-[#881337] active:bg-[#70102e] text-white shadow-xs border border-[#9F1239]",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs",
    gold:
      "bg-[#D97706] hover:bg-[#B45309] active:bg-[#92400E] text-white font-medium shadow-xs border border-[#D97706]",
    outline:
      "bg-transparent hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700",
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
