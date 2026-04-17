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
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "#f5f5f5",
        "muted-foreground": "#737373",
        "earth-100": "#F4F1ED",
        "earth-200": "#E0D9D0",
        "earth-500": "#8C7B6D",
        "earth-900": "#3E362F",
        "red-100": "#FCE8E8",
        "red-500": "#AA0303",
        "red-soft": "#AA0303",
        "red-soft-hover": "#8A0202",
        "red-900": "#3A0202",
        /** Admin / “Superpower-style” dashboard — warm canvas + orange accent */
        "admin-canvas": "#F9F7F2",
        "admin-surface": "#FFFFFF",
        "admin-ink": "#0f0f10",
        "admin-accent": "#FF5C00",
        "admin-accent-hover": "#E65500",
        "admin-muted": "#6b6b6b",
        "admin-bar-green": "#4ADE80",
        "admin-bar-amber": "#FB923C",
        "admin-bar-violet": "#a78bfa",
      },
      boxShadow: {
        "admin-card": "0 2px 40px -12px rgba(15, 15, 16, 0.1)",
        "admin-sidebar": "0 8px 40px -16px rgba(15, 15, 16, 0.12)",
      },
      maxWidth: {
        /** Primary reading column (hero, editorial, journey index) */
        content: "850px",
        /** Wider diagrams / about leadership */
        "content-wide": "1049px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        section: "8rem",
        "section-large": "12rem",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        floatDriftA: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "33%": { transform: "translate3d(4px, -5px, 0)" },
          "66%": { transform: "translate3d(-3px, 3px, 0)" },
        },
        floatDriftB: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(-5px, -6px, 0)" },
        },
        floatDriftC: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "40%": { transform: "translate3d(5px, 4px, 0)" },
          "80%": { transform: "translate3d(-2px, -5px, 0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-a": "floatDriftA 22s ease-in-out infinite",
        "float-b": "floatDriftB 28s ease-in-out infinite",
        "float-c": "floatDriftC 19s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.85s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
