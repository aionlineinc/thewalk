import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Copied primitives from theWalk (local to ILM; safe to diverge later)
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "#f5f5f5",
        "muted-foreground": "#737373",
        earth: {
          50: "#faf8f5",
          100: "#f4f1ed",
          200: "#e0d9d0",
          500: "#8c7b6d",
          800: "#4a433c",
          900: "#3e362f",
        },
        "red-500": "#AA0303",
        "red-soft": "#AA0303",
        "red-soft-hover": "#8A0202",
        calm: {
          300: "#b8cfe8",
          400: "#8eb4dc",
          500: "#4a6fa5",
          600: "#3d5d8a",
          700: "#324d73",
          800: "#2a4260",
        },
      },
      maxWidth: {
        /**
         * Match theWalk’s reading-width container.
         * (theWalk: max-w-content = 850px)
         */
        content: "850px",
        /** Match main site wide sections (e.g. journey stories carousel). */
        "content-wide": "1049px",
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
