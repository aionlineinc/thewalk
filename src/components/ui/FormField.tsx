import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";

function merge(className: string | undefined, base: string) {
  return className ? `${base} ${className}` : base;
}

export function AppLabel({
  children,
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className={merge(className, "app-label")} {...rest}>
      {children}
    </label>
  );
}

export function AppInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={merge(className, "app-input")} {...rest} />;
}

export function AppCheckbox({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className={merge(className, "app-check")} {...rest} />;
}

export function AppSubmitButton({
  children,
  className,
  type = "submit",
  variant = "earth",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** `brand`: red pill — contact / marketing forms; `earth`: default sign-in */
  variant?: "earth" | "brand";
}) {
  const base = variant === "brand" ? "app-btn-submit-brand" : "app-btn-submit";
  return (
    <button type={type} className={merge(className, base)} {...rest}>
      {children}
    </button>
  );
}
