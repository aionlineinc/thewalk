export type ThemePreset = "amber" | "sage" | "slate" | "rose" | "sky" | "golden";

export interface ThemeColors {
  primary: string;
  accent: string;
  bg: string;
  text: string;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeColors> = {
  amber: {
    primary: "#b8642a",
    accent: "#d89a5c",
    bg: "#faf8f5",
    text: "#3e362f",
  },
  sage: {
    primary: "#5b7a5a",
    accent: "#8faf8e",
    bg: "#f8faf7",
    text: "#2d3a2c",
  },
  slate: {
    primary: "#546e7a",
    accent: "#819ca9",
    bg: "#f7f9fa",
    text: "#263238",
  },
  rose: {
    primary: "#8b4a5e",
    accent: "#b87a8c",
    bg: "#faf7f8",
    text: "#3a2a30",
  },
  sky: {
    primary: "#4a7a9b",
    accent: "#7aa8c4",
    bg: "#f7f9fb",
    text: "#283845",
  },
  golden: {
    primary: "#c0782a",
    accent: "#dba540",
    bg: "#faf8f3",
    text: "#3d3028",
  },
};

export const THEME_PRESET_LABELS: Record<ThemePreset, string> = {
  amber: "Warm Amber",
  sage: "Sage Green",
  slate: "Classic Slate",
  rose: "Rose Garden",
  sky: "Calm Sky",
  golden: "Golden Hour",
};

/** Resolve final theme colors: preset with optional custom overrides (Premium+). */
export function resolveTheme(
  preset: string | null,
  customPrimary: string | null,
  customAccent: string | null,
): ThemeColors {
  const base = THEME_PRESETS[preset as ThemePreset] ?? THEME_PRESETS.amber;
  return {
    primary: customPrimary || base.primary,
    accent: customAccent || base.accent,
    bg: base.bg,
    text: base.text,
  };
}
