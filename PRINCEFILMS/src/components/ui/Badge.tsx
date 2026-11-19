import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "quiet" | "brand" | "gold" | "outline" | "live";

const VARIANTS: Record<BadgeVariant, string> = {
  quiet: "bg-white/[0.06] text-white/70 border-white/10",
  brand: "bg-brand-500/15 text-brand-200 border-brand-400/25",
  gold: "bg-gold-500/12 text-gold-300 border-gold-400/25",
  outline: "border-white/15 text-white/75",
  live: "bg-brand-600 text-white border-brand-400/40",
};

export function Badge({
  children,
  variant = "quiet",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-[3px]",
        "text-[10.5px] font-semibold uppercase leading-none tracking-[0.13em]",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
