import type { HTMLAttributes, ReactNode } from "react";

function merge(className: string | undefined, base: string) {
  return className ? `${base} ${className}` : base;
}

/** Full-bleed dark hero title — `home`: centered forest hero; `about`: AboutPremiumHero */
export function AppHeadingDisplay({
  id,
  children,
  className,
  variant,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & {
  id?: string;
  children: ReactNode;
  variant: "home" | "about";
}) {
  const base =
    variant === "home" ? "app-heading-display-home" : "app-heading-display-about";
  return (
    <h1 id={id} className={merge(className, base)} {...rest}>
      {children}
    </h1>
  );
}

/** Lead paragraph on dark hero backgrounds */
export function AppLeadOnDark({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={merge(className, "app-lead-on-dark")} {...rest}>
      {children}
    </p>
  );
}

/** Gray band promo / final CTA headline (home) */
export function AppHeadingPromo({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={merge(className, "app-heading-promo")} {...rest}>
      {children}
    </h2>
  );
}

/** Card or panel title (earth) — semantic h3 */
export function AppHeadingCard({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className={merge(className, "app-heading-block")} {...rest}>
      {children}
    </h3>
  );
}

/** Page hero title (gray scale) — e.g. register, donations, sign-in heroes */
export function AppHeadingHero({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h1 id={id} className={merge(className, "app-heading-hero")} {...rest}>
      {children}
    </h1>
  );
}

/** In-page section headline (gray) — EditorialSplitBlock, gray marketing sections */
export function AppHeadingSection({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={merge(className, "app-heading-section")} {...rest}>
      {children}
    </h2>
  );
}

/** Primary document title (earth tones) — Beliefs, ministry-structure, long-form */
export function AppHeadingPage({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h1 id={id} className={merge(className, "app-heading-page")} {...rest}>
      {children}
    </h1>
  );
}

/** In-page earth headline (h2) — same scale as `app-heading-page`, e.g. About leadership section */
export function AppHeadingEarthSection({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={merge(className, "app-heading-page")} {...rest}>
      {children}
    </h2>
  );
}

/** Smaller earth subheading (h3) — e.g. “How can we help?” on Contact */
export function AppHeadingSub({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className={merge(className, "app-heading-sub")} {...rest}>
      {children}
    </h3>
  );
}

/** H2 inside earth-toned articles */
export function AppHeadingBlock({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className={merge(className, "app-heading-block")} {...rest}>
      {children}
    </h2>
  );
}

export function AppEyebrow({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={merge(className, "app-eyebrow")} {...rest}>
      {children}
    </p>
  );
}

/** Hero / section intro under the title */
export function AppLead({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={merge(className, "app-lead")} {...rest}>
      {children}
    </p>
  );
}

/** Default long-form body (muted foreground) */
export function AppBody({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={merge(className, "app-body")} {...rest}>
      {children}
    </p>
  );
}

/** Body on gray sections (Editorial companion) */
export function AppBodyMuted({
  id,
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={merge(className, "app-body-muted")} {...rest}>
      {children}
    </p>
  );
}
