import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { ArticleBodyMarkdown, type ArticleBodyMarkdownOptions } from "./ArticleBodyMarkdown";

export type { ArticleBodyMarkdownOptions };

/**
 * `renderProseParagraphs` / `splitParagraphs` — lightweight: blank-line paragraphs,
 * inline links, **bold** / *italic* only (no GFM, no list blocks). Used by Beliefs- and
 * similar sections that should stay structurally simple.
 *
 * `renderArticleBody` — full article field: `react-markdown` + `remark-gfm` (headings, lists,
 * tables, code fences, task lists, images, etc.). Raw HTML in the string is not executed.
 */

/**
 * Inline markdown-lite renderer.
 *
 * Supported:
 * - links: `[label](url)` (internal links use next/link)
 * - emphasis: `*italic*`
 * - strong: `**bold**`
 * - strong+em: `***bold italic***`
 *
 * Notes:
 * - We do NOT attempt full markdown nesting rules; we just support the
 *   combinations editors most commonly write in Directus.
 * - This is deliberately HTML-safe (no raw HTML).
 */
function renderInline(text: string, key: string): ReactNode {
  type Mode = "normal" | "em" | "strong" | "strong_em";

  const nodes: ReactNode[] = [];
  let buf = "";
  let mode: Mode = "normal";
  let i = 0;
  let k = 0;

  const pushText = () => {
    if (!buf) return;
    const t = buf;
    buf = "";
    nodes.push(t);
  };

  const wrapAndPush = (content: string, wrap: Mode) => {
    const inner = renderInline(content, `${key}-in-${k++}`);
    if (wrap === "em") nodes.push(<em key={`${key}-em-${k++}`}>{inner}</em>);
    else if (wrap === "strong")
      nodes.push(<strong key={`${key}-st-${k++}`}>{inner}</strong>);
    else if (wrap === "strong_em")
      nodes.push(
        <strong key={`${key}-st-${k++}`}>
          <em>{inner}</em>
        </strong>,
      );
    else nodes.push(inner);
  };

  const tryParseLink = (): { label: string; href: string; consumed: number } | null => {
    if (text[i] !== "[") return null;
    const closeLabel = text.indexOf("]", i + 1);
    if (closeLabel < 0) return null;
    if (text[closeLabel + 1] !== "(") return null;
    const closeHref = text.indexOf(")", closeLabel + 2);
    if (closeHref < 0) return null;
    const label = text.slice(i + 1, closeLabel);
    const href = text.slice(closeLabel + 2, closeHref);
    if (!label || !href) return null;
    return { label, href, consumed: closeHref - i + 1 };
  };

  const flushLink = (label: string, href: string) => {
    const isInternal = href.startsWith("/");
    nodes.push(
      isInternal ? (
        <Link
          key={`${key}-l-${k++}`}
          href={href}
          className="underline hover:text-earth-900"
        >
          {label}
        </Link>
      ) : (
        <a
          key={`${key}-l-${k++}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-earth-900"
        >
          {label}
        </a>
      ),
    );
  };

  while (i < text.length) {
    const link = tryParseLink();
    if (link) {
      pushText();
      flushLink(link.label, link.href);
      i += link.consumed;
      continue;
    }

    // Toggle markers: prefer *** then ** then *
    const three = text.slice(i, i + 3);
    const two = text.slice(i, i + 2);
    const one = text[i];

    const toggle = (nextMode: Mode, closeMode: Mode, markerLen: number) => {
      if (mode === closeMode) {
        // close: wrap buf and append
        const content = buf;
        buf = "";
        wrapAndPush(content, closeMode);
        mode = "normal";
      } else if (mode === "normal") {
        pushText();
        mode = nextMode;
      } else {
        // inside another emphasis; treat marker literally to avoid weird nesting
        buf += text.slice(i, i + markerLen);
      }
      i += markerLen;
    };

    if (three === "***") {
      toggle("strong_em", "strong_em", 3);
      continue;
    }
    if (two === "**") {
      toggle("strong", "strong", 2);
      continue;
    }
    if (one === "*") {
      toggle("em", "em", 1);
      continue;
    }

    buf += one;
    i += 1;
  }

  // If unclosed, emit raw markers as literal text.
  if (mode !== "normal") {
    const prefix = mode === "strong_em" ? "***" : mode === "strong" ? "**" : "*";
    nodes.push(prefix + buf);
    buf = "";
    mode = "normal";
  } else {
    pushText();
  }

  return nodes.length === 1 ? nodes[0] : <>{nodes.map((n, idx) => <Fragment key={`${key}-f-${idx}`}>{n}</Fragment>)}</>;
}

/** Split a body string on blank lines into paragraphs. */
export function splitParagraphs(body: string | null | undefined): string[] {
  if (!body) return [];
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Render CMS body text as a list of <p> elements with inline link support.
 * `firstParagraphClassName` lets callers customise the first paragraph's
 * spacing (e.g. mt-6 to match the original Beliefs prose).
 */
export function renderProseParagraphs(
  body: string | null | undefined,
  options: { firstParagraphClassName?: string; paragraphClassName?: string } = {},
): ReactNode {
  const paragraphs = splitParagraphs(body);
  if (paragraphs.length === 0) return null;
  const { firstParagraphClassName, paragraphClassName } = options;
  return (
    <>
      {paragraphs.map((p, i) => (
        <p
          key={`p-${i}`}
          className={i === 0 ? firstParagraphClassName ?? paragraphClassName : paragraphClassName}
        >
          {renderInline(p, `p-${i}`)}
        </p>
      ))}
    </>
  );
}

/**
 * Full article body using CommonMark + GFM (react-markdown + remark-gfm):
 * headings, lists, blockquotes, code fences, tables, task lists, images, autolinks.
 * Raw HTML in the source is escaped for safety; use a HTML body field in CMS for WYSIWYG
 * and wire a sanitizer in app code if you need both.
 */
export function renderArticleBody(
  body: string | null | undefined,
  options: ArticleBodyMarkdownOptions = {},
): ReactNode {
  if (!body?.trim()) return null;
  return <ArticleBodyMarkdown body={body} {...options} />;
}
