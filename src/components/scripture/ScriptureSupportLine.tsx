"use client";

import type { ReactNode } from "react";
import { ScriptureRichText } from "./ScriptureRichText";

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  return "";
}

/** “Supporting Scriptures:” + comma-separated references (hover for WEB text). */
export function SupportingScripturesLine({ references }: { references: string }) {
  const t = references.replace(/\s+/g, " ").trim();
  return (
    <p className="mt-6 text-sm font-medium tracking-wide text-earth-500">
      <span className="text-earth-900">Supporting Scriptures:</span>{" "}
      <ScriptureRichText>{t}</ScriptureRichText>
    </p>
  );
}

/** A paragraph that is only scripture references (e.g. ministry-structure blocks). */
export function InlineScriptureRefs({ className, children }: { className?: string; children: ReactNode }) {
  const t = flattenText(children).replace(/\s+/g, " ").trim();
  return (
    <p className={className}>
      <ScriptureRichText>{t}</ScriptureRichText>
    </p>
  );
}
