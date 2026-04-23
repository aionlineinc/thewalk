import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export type ArticleBodyMarkdownOptions = {
  paragraphClassName?: string;
  heading2ClassName?: string;
  heading3ClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
  firstParagraphClassName?: string;
};

const defaultP = "text-[15px] leading-relaxed text-gray-600 md:text-lg";
const defaultH2 = "mt-10 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl";
const defaultH3 = "mt-8 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl";
const defaultUl =
  "mt-6 list-disc space-y-2 pl-6 text-[15px] font-light leading-relaxed text-gray-600 md:text-lg";
const defaultOl =
  "mt-6 list-decimal space-y-2 pl-6 text-[15px] font-light leading-relaxed text-gray-600 md:text-lg";

/**
 * Full CommonMark + GitHub Flavored Markdown (tables, strikethrough, task lists, autolinks).
 * Renders to React so internal links can use `next/link`.
 */
export function ArticleBodyMarkdown({
  body,
  paragraphClassName = defaultP,
  heading2ClassName = defaultH2,
  heading3ClassName = defaultH3,
  listClassName = defaultUl,
  listItemClassName,
  firstParagraphClassName,
}: ArticleBodyMarkdownOptions & { body: string }): ReactNode {
  const pClass = paragraphClassName;
  const firstPClass = firstParagraphClassName ?? paragraphClassName;
  const olListClass = listClassName.includes("list-disc")
    ? listClassName.replace("list-disc", "list-decimal")
    : defaultOl;

  let pIndex = 0;

  const components: Components = {
    h1: ({ children }) => (
      <h1 className="mt-10 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">{children}</h1>
    ),
    h2: ({ children }) => <h2 className={heading2ClassName}>{children}</h2>,
    h3: ({ children }) => <h3 className={heading3ClassName}>{children}</h3>,
    h4: ({ children }) => (
      <h4 className="mt-6 text-lg font-semibold text-gray-900">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-5 text-base font-semibold text-gray-900">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-4 text-sm font-semibold uppercase tracking-wide text-gray-800">{children}</h6>
    ),
    p: ({ children, ...props }) => {
      const i = pIndex++;
      const cls = i === 0 && firstParagraphClassName != null && firstPClass !== pClass ? firstPClass : pClass;
      return (
        <p className={cls} {...props}>
          {children}
        </p>
      );
    },
    a: ({ href, children }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} className="text-red-900 underline hover:text-red-800">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          className="text-red-900 underline hover:text-red-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    ul: ({ children, className, ...props }) => (
      <ul className={`${listClassName} ${className ?? ""}`.trim()} {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, className, ...props }) => (
      <ol className={`${olListClass} ${className ?? ""}`.trim()} {...props}>
        {children}
      </ol>
    ),
    li: ({ children, className, ...props }) => {
      const liCls = [listItemClassName, className].filter(Boolean).join(" ");
      return (
        <li className={liCls || undefined} {...props}>
          {children}
        </li>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-gray-200 pl-4 text-gray-600">{children}</blockquote>
    ),
    hr: () => <hr className="my-8 border-0 border-t border-gray-200" />,
    code: ({ className, children, ...props }) => {
      const isBlock = typeof className === "string" && className.includes("language-");
      if (isBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }
      return (
        <code
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-gray-800"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }) => (
      <pre className="my-4 max-w-full overflow-x-auto rounded-lg bg-gray-100 p-4 font-mono text-sm text-gray-800">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="my-4 max-w-full overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-left text-[15px] text-gray-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    th: ({ children }) => (
      <th className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">{children}</th>
    ),
    td: ({ children }) => <td className="border border-gray-200 px-3 py-2">{children}</td>,
    tr: ({ children }) => <tr>{children}</tr>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    img: ({ src, alt, ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element -- CMS / remote article images; domains in next.config
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        className="my-6 h-auto max-w-full rounded-lg"
        loading="lazy"
        decoding="async"
        {...props}
      />
    ),
    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    del: ({ children }) => <del className="text-gray-500 line-through">{children}</del>,
    input: ({ type, checked, ...props }) => {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            checked={checked}
            readOnly
            disabled
            className="mr-2 align-middle"
            {...props}
          />
        );
      }
      return <input type={type} {...props} />;
    },
  };

  return (
    <div className="article-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
