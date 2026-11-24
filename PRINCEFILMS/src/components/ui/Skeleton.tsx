import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={cn("pf-skeleton animate-pulse rounded-xl", className)} {...props} />;
}

export function PageSkeleton() {
  return (
    <div className="page-shell py-8" aria-label="Loading page" role="status">
      <Skeleton className="h-9 w-56 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full rounded-md" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-850 p-3">
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="mt-4 h-4 w-3/4 rounded-md" />
            <Skeleton className="mt-2 h-3 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading PRINCEFILMS content…</span>
    </div>
  );
}
