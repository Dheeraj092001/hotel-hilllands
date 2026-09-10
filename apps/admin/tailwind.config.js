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
        "admin-bg": "#0F1419",
        "admin-surface": "#1A2332",
        "admin-border": "#2D3748",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
