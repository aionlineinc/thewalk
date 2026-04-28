import type { ReactNode } from "react";
import sanitizeHtml from "sanitize-html";

import { cmsBaseUrl } from "@/lib/cms/assets";
import { renderArticleBody } from "./prose";

/**
 * WYSIWYG / rich HTML from Directus (paragraphs, inline images, lists).
 * If the body does not look like HTML, we keep the markdown-lite path.
 */
const LIKELY_HTML =
  /<\s*(?:p|div|img|figure|span|h[1-6]|ul|ol|li|br|table|tbody|tr|td|th|strong|b|em|i|a|blockquote|pre|code)\b/i;

/**
 * Directus often stores asset paths as site-relative (`/assets/<uuid>…`).
 * Browsers on the public site would request the wrong host unless we make them
 * absolute to the CMS origin.
 */
function absolutizeRelativeCmsMedia(html: string): string {
  const base = cmsBaseUrl();
  return html.replace(
    /(\s(?:src|href))=(['"])\/assets\/([^'"]*)\2/gi,
    (_, attr: string, q: string, rest: string) =>
      `${attr}=${q}${base}/assets/${rest}${q}`,
  );
}

function isTrustedAbsoluteUrl(url: string): boolean {
  const t = url.trim();
  const base = cmsBaseUrl();
  try {
    const u = new URL(t, "https://placeholder.local");
    if (u.protocol !== "https:" && u.protocol !== "http:") return false;
    if (t.startsWith(base)) return true;
    const host = u.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (host === "thewalk.org" || host === "cms.thewalk.org" || host.endsWith(".thewalk.org")) {
      return true;
    }
    if (t.startsWith("https://images.unsplash.com/")) return true;
    return false;
  } catch {
    return false;
  }
}

/** Inline images: only CMS assets or explicit https to our stack (not arbitrary web). */
function isAllowedImgSrc(url: string): boolean {
  const t = url.trim();
  if (!t || t.toLowerCase().startsWith("javascript:") || t.toLowerCase().startsWith("data:")) {
    return false;
  }
  if (t.startsWith("/")) return t.startsWith("/assets/");
  return isTrustedAbsoluteUrl(t);
}

/** Links: internal paths, mailto/tel, or https to trusted domains. */
function isAllowedLinkHref(url: string): boolean {
  const t = url.trim();
  if (!t || t.toLowerCase().startsWith("javascript:") || t.toLowerCase().startsWith("data:")) {
    return false;
  }
  if (t.startsWith("/")) return true;
  if (/^mailto:/i.test(t) || /^tel:/i.test(t)) return true;
  return isTrustedAbsoluteUrl(t);
}

function sanitizeArticleBodyHtml(dirty: string): string {
  const withAbsoluteAssets = absolutizeRelativeCmsMedia(dirty);
  const base = cmsBaseUrl();

  return sanitizeHtml(withAbsoluteAssets, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "strike",
      "a",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "img",
      "figure",
      "figcaption",
      "div",
      "span",
      "sub",
      "sup",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "class", "id"],
      img: ["src", "alt", "title", "width", "height", "loading", "class", "srcset", "sizes"],
      p: ["class", "id"],
      div: ["class", "id"],
      span: ["class", "id"],
      h2: ["class", "id"],
      h3: ["class", "id"],
      h4: ["class", "id"],
      li: ["class", "id"],
      ul: ["class", "id"],
      ol: ["class", "id"],
      figure: ["class", "id"],
      table: ["class", "id"],
      thead: ["class", "id"],
      tbody: ["class", "id"],
      tr: ["class", "id"],
      th: ["class", "id", "colspan", "rowspan"],
      td: ["class", "id", "colspan", "rowspan"],
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href;
        if (!href) return { tagName, attribs };
        if (!isAllowedLinkHref(href)) {
          const { href: _drop, ...rest } = attribs;
          return { tagName, attribs: rest };
        }
        if (/^https?:\/\//i.test(href) && !href.startsWith(base)) {
          return {
            tagName,
            attribs: {
              ...attribs,
              target: attribs.target || "_blank",
              rel: "noopener noreferrer",
            },
          };
        }
        return { tagName, attribs };
      },
    },
    exclusiveFilter(frame) {
      if (frame.tag === "img") {
        const src = frame.attribs?.src;
        return !src || !isAllowedImgSrc(src);
      }
      return false;
    },
  });
}

/**
 * Renders an article `body` from Directus: markdown-lite, or sanitized HTML
 * when the editor used WYSIWYG (in particular `<img>` embeds).
 */
export function renderArticleContent(
  body: string | null | undefined,
  articleBodyOptions: Parameters<typeof renderArticleBody>[1] = {},
): ReactNode {
  if (!body) return null;

  if (LIKELY_HTML.test(body)) {
    const html = sanitizeArticleBodyHtml(body);
    if (!html.trim()) return null;
    return (
      <div
        className="article-body-cms text-[15px] leading-relaxed text-gray-600 md:text-lg [&_a]:text-red-900 [&_a]:underline [&_a:hover]:text-red-800 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_h2+&_h3]:mt-0 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-gray-900 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 md:[&_h2]:text-3xl md:[&_h3]:text-2xl [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:font-light [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:font-light [&_p+&_p]:mt-3 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-100 [&_pre]:p-4 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6"
        // eslint-disable-next-line react/no-danger -- sanitized (sanitize-html allowlist)
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return renderArticleBody(body, articleBodyOptions);
}
