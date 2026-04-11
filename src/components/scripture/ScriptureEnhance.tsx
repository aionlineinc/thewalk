"use client";

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { ScriptureRichText } from "./ScriptureRichText";

function mapParagraphChildren(ch: ReactNode): ReactNode {
  if (typeof ch === "string") {
    if (ch.trim() === "") return ch;
    return <ScriptureRichText>{ch}</ScriptureRichText>;
  }
  if (Array.isArray(ch)) {
    return ch.map((part, i) => (
      <Fragment key={i}>
        {typeof part === "string" && part.trim() !== "" ? (
          <ScriptureRichText>{part}</ScriptureRichText>
        ) : (
          part
        )}
      </Fragment>
    ));
  }
  return ch;
}

function walk(node: ReactNode): ReactNode {
  if (node == null || typeof node === "boolean") return node;

  if (Array.isArray(node)) {
    return node.map((n, i) => <Fragment key={i}>{walk(n)}</Fragment>);
  }

  if (!isValidElement(node)) return node;

  const el = node as ReactElement<{ children?: ReactNode }>;

  if (el.type === "p") {
    return cloneElement(el, { children: mapParagraphChildren(el.props.children) });
  }

  if (el.props?.children != null) {
    return cloneElement(el, { children: walk(el.props.children) });
  }

  return el;
}

/**
 * Walks descendants and wraps plain text in {@link ScriptureRichText} for every
 * native `<p>`. Must run in a **client** component tree: Server Component output
 * passed from the root layout cannot be traversed with `cloneElement`, so wrap
 * scripture-heavy pages (e.g. BeliefsArticle) instead of the app layout.
 */
export function ScriptureEnhance({ children }: { children: ReactNode }) {
  return <>{walk(Children.toArray(children))}</>;
}
