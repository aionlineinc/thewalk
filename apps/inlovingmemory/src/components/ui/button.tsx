import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-calm-500/25";

const variants: Record<Variant, string> = {
  primary: "bg-earth-800 text-white hover:bg-earth-900",
  secondary: "bg-calm-600 text-white hover:bg-calm-500",
  outline: "border border-earth-300 bg-white text-earth-900 hover:border-earth-400 hover:bg-earth-50",
  ghost: "text-earth-800 hover:bg-earth-100/70",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cx(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  prefetch,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  prefetch?: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} prefetch={prefetch} className={cx(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

