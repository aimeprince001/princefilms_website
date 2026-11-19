import { cn } from "@/lib/cn";

export function ProgressRail({
  value,
  complete = false,
  className,
  label = "Playback progress",
}: {
  value: number;
  complete?: boolean;
  className?: string;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-white/15", className)}
    >
      <span
        className={cn(
          "block h-full rounded-full",
          complete ? "bg-mint-400" : "bg-brand-400",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
