import React, { forwardRef } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      label,
      error,
      helperText,
      id,
      required,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium uppercase tracking-wider text-charcoal/80 mb-1.5"
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={`w-full bg-white text-charcoal text-sm border rounded-sm transition-colors duration-200 placeholder:text-muted-stone/60 focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:cursor-not-allowed p-3 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-black/15 hover:border-black/30 focus:border-deep-forest focus:ring-deep-forest/20"
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-xs text-red-600 font-normal">
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

Textarea.displayName = "Textarea";
