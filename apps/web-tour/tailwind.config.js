/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:          "#0C1310",
        pine:         "#173B2B",
        forest:       "#275B45",
        cloud:        "#F7F5EF",
        glacier:      "#DDEFF0",
        stone:        "#B7B1A3",
        "alpine-sun": "#D59A52",
      },
      fontFamily: {
        serif:  ["Instrument Serif", "Georgia", "serif"],
        sans:   ["Manrope", "system-ui", "sans-serif"],
        mono:   ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem,8vw,6rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem,5vw,4rem)",  { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem,3vw,2.5rem)",{ lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "lead":       ["clamp(1.125rem,1.5vw,1.375rem)", { lineHeight: "1.6" }],
        "eyebrow":    ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.12em" }],
      },
      spacing: {
        "section": "clamp(4rem,8vw,8rem)",
      },
      maxWidth: {
        "editorial": "72rem",
        "wide":      "90rem",
      },
      borderRadius: {
        "brand": "0.25rem",
      },
      transitionTimingFunction: {
        "brand": "cubic-bezier(0.16,1,0.3,1)",
      },
      animation: {
        "fade-up":  "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":  "fadeIn 0.4s ease both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};