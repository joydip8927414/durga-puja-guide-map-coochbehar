import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search pandals...",
  className = "",
  containerClassName = "",
  id = "pandal-search-input",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="w-5 h-5" aria-hidden="true" />
      </div>
      <input
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`touch-target-min w-full pl-12 pr-12 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base focus-ring transition-all shadow-sm ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search input"
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus-ring rounded-r-2xl"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
