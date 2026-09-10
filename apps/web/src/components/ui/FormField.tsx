import React from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  htmlFor,
  className = "",
  children,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-medium uppercase tracking-wider text-charcoal/80 mb-1.5"
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600 font-normal">{error}</p>
      )}
      {!error && helperText && (
        <p className="mt-1 text-xs text-muted-stone">{helperText}</p>
      )}
    </div>
  );
};
