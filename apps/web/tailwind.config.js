/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-forest": "#183C32",
        "himalayan-green": "#315C4A",
        "warm-ivory": "#F7F3EA",
        sand: "#D9C7A3",
        charcoal: "#1C1C1A",
        "muted-stone": "#78756E",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        body: ["Inter", "Manrope", "system-ui", "sans-serif"],
        ui: ["Inter", "Manrope", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
