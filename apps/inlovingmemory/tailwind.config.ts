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
          300: "#ecc99e",
          400: "#d89a5c",
          500: "#b8642a",
          600: "#9e5523",
          700: "#85461c",
          800: "#6c3815",
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
        script: ["var(--font-dancing-script)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
