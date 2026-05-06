import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variantClass: Record<"primary" | "ghostOnDark", string> = {
  primary: "app-pill-primary",
  ghostOnDark: "app-pill-ghost-dark",
};

type AppPillLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
  variant: keyof typeof variantClass;
  className?: string;
  children: ReactNode;
};

export function AppPillLink({ variant, className, children, ...rest }: AppPillLinkProps) {
  const base = variantClass[variant];
  return (
    <Link data-button-link className={className ? `${base} ${className}` : base} {...rest}>
      {children}
    </Link>
  );
}

