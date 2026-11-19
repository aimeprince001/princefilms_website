import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  title,
  count,
  description,
  action,
  className,
  id,
}: {
  title: string;
  count?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <h2 id={id} className="font-display text-[22px] leading-tight text-text sm:text-2xl">
            {title}
          </h2>
          {count && <span className="num text-[13px] text-white/35">{count}</span>}
        </div>
        {description && <p className="mt-1.5 max-w-xl text-[13.5px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
