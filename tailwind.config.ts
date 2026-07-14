import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutrals — paper, cream, oat, sand
        paper: "#FAF7F0",
        cream: "#F4EFE4",
        linen: "#EDE6D6",
        oat: "#CBBF9A",
        sand: "#B8A981",
        // Greens — sage through deep evergreen
        sage: "#97A97C",
        moss: "#6D6A55",
        fern: "#515932",
        forest: "#33513D",
        evergreen: "#1F3B2C",
        pine: "#14251C",
        // Warm earthy accents
        oatgold: "#F2C48D",
        rustwood: "#803A18",
        cedar: "#593825",
        wine: "#6E3B3E",
        // Ink
        ink: "#2A2D2A",
        midnight: "#0D0D0D",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 20px -8px rgba(31, 59, 44, 0.18)",
        lift: "0 18px 48px -20px rgba(31, 59, 44, 0.35)",
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
