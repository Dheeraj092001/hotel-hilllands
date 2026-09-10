import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "gold" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  dot = false,
  ...props
}) => {
  const sizeStyles = {
    sm: "text-[10px] tracking-wider uppercase px-2 py-0.5 font-semibold",
    md: "text-xs tracking-wide px-2.5 py-1 font-medium",
  }[size];

  const variantStyles = {
    default: "bg-deep-forest/10 text-deep-forest border border-deep-forest/20",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    danger: "bg-rose-50 text-rose-800 border border-rose-200",
    gold: "bg-sand/30 text-[#6B5A33] border border-sand",
    outline: "bg-transparent text-charcoal border border-black/20",
  }[variant];

  const dotColors = {
    default: "bg-deep-forest",
    success: "bg-emerald-600",
    warning: "bg-amber-600",
    danger: "bg-rose-600",
    gold: "bg-[#8C733E]",
    outline: "bg-charcoal",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {children}
    </span>
  );
};
