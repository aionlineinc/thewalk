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

function mapInlineScriptureChildren(ch: ReactNode): ReactNode {
  if (typeof ch === "string") {
    if (ch.trim() === "") return ch;
    return <ScriptureRichText>{ch}</ScriptureRichText>;
  }
  if (Array.isArray(ch)) {
    return ch.map((part, i) => (
      <Fragment key={i}>
        {typeof part === "string" && part.trim() !== "" ? (
          <ScriptureRichText>{part}</ScriptureRichText>
        ) : isValidElement(part) ? (
          walk(part)
        ) : (
          part
        )}
      </Fragment>
    ));
  }
  if (isValidElement(ch)) {
    return walk(ch);
  }
  return ch;
}

function isLooseMarkdownListItem(children: ReactNode): boolean {
  const parts = Children.toArray(children).filter((n) => !(typeof n === "string" && n.trim() === ""));
  if (parts.length === 0) return false;
  return parts.every((n) => isValidElement(n) && n.type === "p");
}

function walk(node: ReactNode): ReactNode {
  if (node == null || typeof node === "boolean") return node;

  if (Array.isArray(node)) {
    return node.map((n, i) => <Fragment key={i}>{walk(n)}</Fragment>);
  }

  if (!isValidElement(node)) return node;

  const el = node as ReactElement<{ children?: ReactNode }>;

  if (el.type === "p") {
    return cloneElement(el, { children: mapInlineScriptureChildren(el.props.children) });
  }

  if (el.type === "li") {
    // `react-markdown` often renders list items as `<li><p>…</p></li>` (loose lists / multi-paragraph items).
    // In that case, enhancing at the `<li>` level skips nested `<p>` text — so we recurse instead.
    if (isLooseMarkdownListItem(el.props.children)) {
      return cloneElement(el, { children: walk(el.props.children) });
    }

    return cloneElement(el, { children: mapInlineScriptureChildren(el.props.children) });
  }

  if (el.props?.children != null) {
    return cloneElement(el, { children: walk(el.props.children) });
  }

  return el;
}

/**
 * Walks descendants and wraps plain text in {@link ScriptureRichText} for every
 * native `<p>`, and for `<li>` when markdown renders inline text directly inside
 * the list item (tight lists). For loose list items that render nested `<p>`
 * blocks, we recurse into those paragraphs instead. Must run in a **client**
 * component tree: Server Component output passed from the root layout cannot be
 * traversed with `cloneElement`, so wrap scripture-heavy pages (e.g.
 * BeliefsArticle) instead of the app layout.
 */
export function ScriptureEnhance({ children }: { children: ReactNode }) {
  return <>{walk(Children.toArray(children))}</>;
}
