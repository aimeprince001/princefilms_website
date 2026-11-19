import { ChevronDown } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

export type SelectOption = { value: string; label: string };

export function Select({
  label,
  value,
  options,
  onChange,
  className,
  hideLabel = false,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  hideLabel?: boolean;
}) {
  const id = `select-${useId()}`;

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-[12px] font-medium text-white/45",
          hideLabel ? "sr-only" : "mr-2.5",
        )}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 appearance-none rounded-lg border border-white/10 bg-ink-850 pl-3 pr-9 text-[13px] font-medium text-text transition-colors hover:border-white/20 focus:border-brand-400 focus:outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-ink-850 text-text">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/45"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
