"use client";

import type { ReactNode } from "react";

import { ScriptureEnhance } from "@/components/scripture/ScriptureEnhance";

export function ScriptureEnhancedArticleBody({ children }: { children: ReactNode }) {
  return <ScriptureEnhance>{children}</ScriptureEnhance>;
}

