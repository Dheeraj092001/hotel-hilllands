import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs tracking-wider uppercase px-4 py-2 gap-1.5",
      md: "text-sm tracking-wide px-6 py-2.5 gap-2",
      lg: "text-base tracking-wide px-8 py-3.5 gap-2.5",
    }[size];

    const variantStyles = {
      primary:
        "bg-deep-forest text-warm-ivory hover:bg-himalayan-green focus:ring-deep-forest shadow-sm hover:shadow-md",
      secondary:
        "bg-himalayan-green text-warm-ivory hover:bg-deep-forest focus:ring-himalayan-green shadow-sm",
      outline:
        "border border-deep-forest text-deep-forest hover:bg-deep-forest hover:text-warm-ivory focus:ring-deep-forest",
      ghost:
        "text-charcoal hover:bg-deep-forest/5 focus:ring-deep-forest",
      gold:
        "bg-sand text-deep-forest font-semibold hover:bg-[#c9b793] focus:ring-sand shadow-sm hover:shadow-md",
      destructive:
        "bg-red-700 text-white hover:bg-red-800 focus:ring-red-600 shadow-sm",
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
