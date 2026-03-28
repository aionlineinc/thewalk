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
        "earth-500": "#8C7B6D",
        "earth-900": "#3E362F",
        "red-100": "#FCE8E8",
        "red-500": "#AA0303",
        "red-soft": "#AA0303",
        "red-soft-hover": "#8A0202",
        "red-900": "#3A0202",
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
    },
  },
  plugins: [],
};
export default config;
