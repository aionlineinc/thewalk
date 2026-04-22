import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * Lightweight prose renderer for CMS body text.
 *
 * We don't want a full markdown dependency for what amounts to "paragraphs +
 * the occasional inline link", so this helper:
 *   • splits the input on blank lines into paragraphs
 *   • inside each paragraph, recognises `[text](url)` as an inline link
 *
 * Anything else (bold, italics, headings, lists) is intentionally NOT
 * supported — those should be modelled as their own section types so the
 * design stays consistent. Editors can always add explicit blocks instead
 * of inlining structure into a body field.
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
 * Markdown-lite renderer intended for article bodies.
 *
 * Supports:
 *  - `## Heading` blocks → <h2>
 *  - everything else → <p>
 *  - inline links `[text](url)` inside both headings and paragraphs
 *
 * Intentionally does NOT support arbitrary HTML or full markdown (lists,
 * blockquotes, etc.) to keep design stable and predictable.
 */
export function renderArticleBody(
  body: string | null | undefined,
  options: {
    paragraphClassName?: string;
    heading2ClassName?: string;
    heading3ClassName?: string;
    listClassName?: string;
    listItemClassName?: string;
    firstParagraphClassName?: string;
  } = {},
): ReactNode {
  const {
    paragraphClassName,
    heading2ClassName,
    heading3ClassName,
    listClassName,
    listItemClassName,
    firstParagraphClassName,
  } = options;

  if (!body) return null;
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let pIndex = 0;

  const takeWhile = (pred: (line: string) => boolean) => {
    const taken: string[] = [];
    while (i < lines.length && pred(lines[i] ?? "")) {
      taken.push((lines[i] ?? "").trimEnd());
      i += 1;
    }
    return taken;
  };

  const skipBlank = () => {
    while (i < lines.length && (lines[i] ?? "").trim() === "") i += 1;
  };

  const flushParagraph = (paraLines: string[]) => {
    const text = paraLines.map((l) => l.trim()).filter(Boolean).join(" ");
    if (!text) return;
    out.push(
      <p
        key={`p-${pIndex}`}
        className={
          pIndex === 0
            ? firstParagraphClassName ?? paragraphClassName
            : paragraphClassName
        }
      >
        {renderInline(text, `p-${pIndex}`)}
      </p>,
    );
    pIndex += 1;
  };

  skipBlank();
  while (i < lines.length) {
    const line = (lines[i] ?? "").trim();
    if (!line) {
      skipBlank();
      continue;
    }

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      out.push(
        <h2
          key={`h2-${i}`}
          className={
            heading2ClassName ??
            "mt-10 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
          }
        >
          {renderInline(h2[1], `h2-${i}`)}
        </h2>,
      );
      i += 1;
      skipBlank();
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      out.push(
        <h3
          key={`h3-${i}`}
          className={
            heading3ClassName ??
            "mt-8 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
          }
        >
          {renderInline(h3[1], `h3-${i}`)}
        </h3>,
      );
      i += 1;
      skipBlank();
      continue;
    }

    const ulMatch = line.match(/^(?:-|\*)\s+(.+)$/);
    if (ulMatch) {
      const items = takeWhile((l) => /^(?:-|\*)\s+/.test((l ?? "").trim()));
      const parsed = items
        .map((l) => (l ?? "").trim().replace(/^(?:-|\*)\s+/, "").trim())
        .filter(Boolean);
      out.push(
        <ul
          key={`ul-${i}`}
          className={
            listClassName ??
            "mt-6 list-disc space-y-2 pl-6 text-[15px] font-light leading-relaxed text-gray-600 md:text-lg"
          }
        >
          {parsed.map((t, idx) => (
            <li
              key={`ul-${i}-li-${idx}`}
              className={listItemClassName}
            >
              {renderInline(t, `ul-${i}-li-${idx}`)}
            </li>
          ))}
        </ul>,
      );
      skipBlank();
      continue;
    }

    // Paragraph: consume until blank line or a new block marker.
    const paraLines = takeWhile((l) => {
      const t = (l ?? "").trim();
      if (!t) return false;
      if (/^##\s+/.test(t) || /^###\s+/.test(t)) return false;
      if (/^(?:-|\*)\s+/.test(t)) return false;
      return true;
    });
    flushParagraph(paraLines);
    skipBlank();
  }

  return (
    <>
      {out.map((n, idx) => (
        <Fragment key={`b-${idx}`}>{n}</Fragment>
      ))}
    </>
  );
}
