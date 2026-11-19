import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Rating({
  value,
  votes,
  size = "sm",
  className,
}: {
  value: number;
  votes?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 whitespace-nowrap",
        className,
      )}
      title={`Rated ${value.toFixed(1)} out of 5${votes ? ` from ${votes} ratings` : ""}`}
    >
      <Star
        size={size === "md" ? 14 : 12}
        className="translate-y-[1px] fill-gold-400 text-gold-400"
        aria-hidden="true"
      />
      <span
        className={cn(
          "num font-semibold text-gold-300",
          size === "md" ? "text-sm" : "text-[12.5px]",
        )}
      >
        {value.toFixed(1)}
      </span>
      {votes !== undefined && (
        <span className="num text-[11.5px] text-white/40">
          {votes.toLocaleString()}
        </span>
      )}
      <span className="sr-only">out of 5</span>
    </span>
  );
}
