import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center",
        className,
      )}
    >
      <Icon size={22} className="text-brand-300" aria-hidden="true" />
      <h3 className="mt-4 font-display text-lg text-text">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
