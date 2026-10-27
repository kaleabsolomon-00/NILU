import Link from "next/link";
import type { ComponentProps } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "light"
  | "outlineLight";
type Size = "sm" | "md" | "lg" | "xl";
type Own = { variant?: Variant; size?: Size; full?: boolean };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:transform-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-background shadow-md shadow-brand/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30 active:translate-y-0 active:shadow-sm",
  secondary:
    "border-2 border-brand text-brand hover:-translate-y-0.5 hover:bg-brand hover:text-background active:translate-y-0",
  ghost: "text-brand hover:bg-soft/50",
  danger:
    "border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-background",
  // For dark backgrounds such as photos
  light:
    "bg-background text-brand shadow-xl shadow-black/25 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 focus-visible:ring-4 focus-visible:ring-background/50",
  outlineLight:
    "border-2 border-background text-background hover:-translate-y-0.5 hover:bg-background hover:text-brand active:translate-y-0 focus-visible:ring-4 focus-visible:ring-background/50",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-8 py-3.5 text-lg",
  xl: "px-9 py-4 text-xl sm:px-12 sm:py-5 sm:text-2xl",
};

// Use this directly for things that must stay a plain <a>, like file downloads
export function buttonClasses({
  variant = "primary",
  size = "md",
  full = false,
  className = "",
}: Own & { className?: string } = {}) {
  return [base, variants[variant], sizes[size], full ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant,
  size,
  full,
  className,
  children,
  ...props
}: Own & ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={buttonClasses({ variant, size, full, className })}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  children,
  ...props
}: Own & ComponentProps<typeof Link>) {
  return (
    <Link
      className={buttonClasses({ variant, size, full, className })}
      {...props}
    >
      {children}
    </Link>
  );
}
