import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}) => {
  const isDark = theme === "dark";

  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  return (
    <div className={`flex flex-col ${alignStyles} mb-12 lg:mb-16 ${className}`}>
      {eyebrow && (
        <span
          className={`text-xs font-semibold tracking-[0.25em] uppercase mb-3 ${
            isDark ? "text-sand" : "text-himalayan-green"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] tracking-tight max-w-3xl ${
          isDark ? "text-warm-ivory" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      <div
        className={`h-[1.5px] w-12 my-4 rounded-full ${
          isDark ? "bg-sand/60" : "bg-himalayan-green/40"
        }`}
      />
      {description && (
        <p
          className={`text-base sm:text-lg max-w-2xl font-light leading-relaxed ${
            isDark ? "text-warm-ivory/75" : "text-muted-stone"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
