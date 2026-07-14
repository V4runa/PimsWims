import type { Config } from "tailwindcss";

// Colors are backed by CSS variables (space-separated RGB channels) so the
// style switcher can swap entire palettes and toggle light/dark at runtime.
// See globals.css for the variable definitions and theme overrides.
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mode-aware neutrals (shift between light & dark themes)
        canvas: v("--c-canvas"),
        paper: v("--c-paper"),
        cream: v("--c-cream"),
        linen: v("--c-linen"),
        oat: v("--c-oat"),
        sand: v("--c-sand"),
        ink: v("--c-ink"),
        moss: v("--c-moss"),
        heading: v("--c-heading"),
        // Brand greens
        sage: v("--c-sage"),
        fern: v("--c-fern"),
        forest: v("--c-forest"),
        evergreen: v("--c-evergreen"),
        pine: v("--c-pine"),
        // Warm accents
        oatgold: v("--c-oatgold"),
        rustwood: v("--c-rustwood"),
        cedar: v("--c-cedar"),
        wine: v("--c-wine"),
        midnight: v("--c-midnight"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "var(--radius-md)",
        xl3: "var(--radius-lg)",
      },
      boxShadow: {
        soft: "0 2px 20px -8px rgba(0, 0, 0, 0.18)",
        lift: "0 18px 48px -20px rgba(0, 0, 0, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.9s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
