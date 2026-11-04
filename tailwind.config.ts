import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // High-end Dark Neutral Color Palette (OXARYN / Linear / Raycast inspired)
        bg: {
          main: "#0B111E",
          secondary: "#0F172A",
          surface: "#162036",
          elevated: "#1E2B48",
        },
        border: {
          DEFAULT: "#263554",
          subtle: "#1A253D",
          strong: "#34466D",
          focus: "#38BDF8",
        },
        text: {
          primary: "#F1F3F6",
          secondary: "#929BAA",
          muted: "#626D7D",
        },
        accent: {
          DEFAULT: "#38BDF8",
          hover: "#0EA5E9",
          active: "#0284C7",
          muted: "rgba(139, 158, 255, 0.12)",
        },
        // Legacy dark mappings aligned to exact palette
        dark: {
          bg: "#0B111E",
          secondary: "#0F172A",
          card: "#162036",
          cardHover: "#1E2B48",
          border: "#263554",
          text: "#F1F3F6",
          muted: "#929BAA",
        },
        brand: {
          primary: "#38BDF8",
          hover: "#0EA5E9",
          light: "#A4B3FF",
          accent: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.4)",
        card: "0 4px 16px -2px rgba(0, 0, 0, 0.4)",
        dropdown: "0 10px 30px -5px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;
