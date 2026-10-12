import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#881337] dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm sm:text-base mb-1">{title}</h4>
          <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed mb-3">
            {message}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="md"
              onClick={onRetry}
              className="border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
