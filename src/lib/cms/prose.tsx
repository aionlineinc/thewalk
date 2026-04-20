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

function renderInline(text: string, key: string): ReactNode {
  const out: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index));
    }
    const [, label, href] = match;
    const isInternal = href.startsWith("/");
    out.push(
      isInternal ? (
        <Link key={`${key}-l-${i}`} href={href} className="underline hover:text-earth-900">
          {label}
        </Link>
      ) : (
        <a
          key={`${key}-l-${i}`}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-earth-900"
        >
          {label}
        </a>
      ),
    );
    lastIndex = match.index + match[0].length;
    i += 1;
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex));
  }
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
    firstParagraphClassName?: string;
  } = {},
): ReactNode {
  const blocks = splitParagraphs(body);
  if (blocks.length === 0) return null;
  const {
    paragraphClassName,
    heading2ClassName,
    firstParagraphClassName,
  } = options;
  return (
    <>
      {blocks.map((raw, i) => {
        // Editors often write markdown headings followed immediately by text:
        //   ## Heading
        //   Paragraph...
        // which arrives as one "block" (no blank line). Handle both cases.
        const rawLines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
        const first = rawLines[0] ?? "";
        const rest = rawLines.slice(1).join(" ").trim();
        const h2 = first.match(/^##\s+(.+)$/);
        if (h2) {
          return (
            <Fragment key={`h2b-${i}`}>
              <h2
                className={
                  heading2ClassName ??
                  "mt-10 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
                }
              >
                {renderInline(h2[1], `h2-${i}`)}
              </h2>
              {rest ? (
                <p className={paragraphClassName}>
                  {renderInline(rest, `h2-${i}-p`)}
                </p>
              ) : null}
            </Fragment>
          );
        }
        return (
          <p
            key={`p-${i}`}
            className={
              i === 0 ? firstParagraphClassName ?? paragraphClassName : paragraphClassName
            }
          >
            {renderInline(rawLines.join(" "), `p-${i}`)}
          </p>
        );
      })}
    </>
  );
}
