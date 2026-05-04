import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        earth: {
          50: "#faf8f5",
          100: "#f4f1ed",
          200: "#e0d9d0",
          500: "#8c7b6d",
          800: "#4a433c",
          900: "#3e362f",
        },
        calm: {
          500: "#4a6fa5",
          600: "#3d5d8a",
        },
      },
      maxWidth: { content: "42rem" },
    },
  },
  plugins: [],
};

export default config;
