import type { HTMLAttributes, ReactNode } from "react";

function merge(className: string | undefined, base: string) {
  return className ? `${base} ${className}` : base;
}

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
  const base = variant === "home" ? "app-heading-display-home" : "app-heading-display-about";
  return (
    <h1 id={id} className={merge(className, base)} {...rest}>
      {children}
    </h1>
  );
}

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

