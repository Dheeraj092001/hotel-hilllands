import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium uppercase tracking-wider text-charcoal/80 mb-1.5"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={`w-full bg-white text-charcoal text-sm border rounded-sm appearance-none transition-colors duration-200 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:cursor-not-allowed pl-3.5 pr-10 py-2.5 ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-black/15 hover:border-black/30 focus:border-deep-forest focus:ring-deep-forest/20"
            } ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-muted-stone flex items-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-xs text-red-600 font-normal">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-xs text-muted-stone">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
