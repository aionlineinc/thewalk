"use client";

import { Fragment, useMemo } from "react";
import { tokenizeScriptureText } from "@/lib/scripture-references";
import { ScriptureReferenceMark } from "./ScriptureReferenceMark";

export function ScriptureRichText({ children }: { children: string }) {
  const nodes = useMemo(() => tokenizeScriptureText(children), [children]);

  return (
    <>
      {nodes.map((t, i) =>
        t.kind === "text" ? (
          <Fragment key={i}>{t.value}</Fragment>
        ) : (
          <ScriptureReferenceMark key={i} reference={t.value} display={t.display} />
        ),
      )}
    </>
  );
}
