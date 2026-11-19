import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";
type Shape = "rounded" | "pill";

type StyleOptions = {
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  className?: string;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600 shadow-[0_18px_40px_-24px_rgba(123,44,191,0.9)]",
  secondary: "bg-white/[0.07] text-text hover:bg-white/[0.12] border border-white/10",
  ghost: "text-muted hover:text-text hover:bg-white/[0.06]",
  outline: "border border-white/15 text-text hover:border-brand-400/70 hover:bg-brand-500/10",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-[15px] gap-2.5",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  shape = "rounded",
  className,
}: StyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
    "disabled:cursor-not-allowed disabled:opacity-50",
    shape === "pill" ? "rounded-full" : "rounded-xl",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions & { children: ReactNode };

export function Button({
  variant,
  size,
  shape,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass({ variant, size, shape, className })} {...rest}>
      {children}
    </button>
  );
}
