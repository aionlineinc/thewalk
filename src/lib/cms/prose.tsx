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

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

// A conservative token regex for inline formatting.
// Order matters: links first, then bold, then italic.
const INLINE_TOKEN_RE = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

function renderInline(text: string, key: string): ReactNode {
  const out: ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  INLINE_TOKEN_RE.lastIndex = 0;
  while ((match = INLINE_TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index));
    }

    const full = match[1] ?? "";
    const linkLabel = match[2];
    const linkHref = match[3];
    const boldText = match[4];
    const italicText = match[5];

    if (linkLabel != null && linkHref != null) {
      const isInternal = linkHref.startsWith("/");
      out.push(
        isInternal ? (
          <Link
            key={`${key}-l-${i}`}
            href={linkHref}
            className="underline hover:text-earth-900"
          >
            {linkLabel}
          </Link>
        ) : (
          <a
            key={`${key}-l-${i}`}
            href={linkHref}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-earth-900"
          >
            {linkLabel}
          </a>
        ),
      );
    } else if (boldText != null) {
      out.push(<strong key={`${key}-b-${i}`}>{boldText}</strong>);
    } else if (italicText != null) {
      out.push(<em key={`${key}-i-${i}`}>{italicText}</em>);
    } else {
      out.push(full);
    }

    lastIndex = match.index + full.length;
    i += 1;
  }

  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out.length === 1 ? out[0] : <>{out.map((n, idx) => <Fragment key={`${key}-f-${idx}`}>{n}</Fragment>)}</>;
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
