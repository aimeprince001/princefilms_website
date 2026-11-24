import { Check, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import {
  CATEGORIES,
  INTERPRETERS,
  TITLES,
  categoryCount,
  interpreterCounts,
} from "@/data/catalog";
import {
  AVAILABLE_YEARS,
  DURATION_OPTIONS,
  RATING_OPTIONS,
  activeFilterCount,
  type Filters,
} from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/LanguageContext";

type FilterProps = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  showDuration?: boolean;
};

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
        {legend}
      </legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function CheckRow({
  checked,
  label,
  count,
  onChange,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 py-[7px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-[5px] border transition-colors",
          checked
            ? "border-brand-400 bg-brand-500"
            : "border-white/20 bg-white/[0.03] group-hover:border-white/40",
        )}
      >
        {checked && <Check size={11} strokeWidth={3} className="text-white" />}
      </span>
      <span
        className={cn(
          "flex-1 text-[13px] transition-colors",
          checked ? "text-text" : "text-white/60 group-hover:text-white/90",
        )}
      >
        {label}
      </span>
      {count !== undefined && <span className="num text-[11px] text-white/25">{count}</span>}
    </label>
  );
}

function RadioRow({
  name,
  checked,
  label,
  onChange,
}: {
  name: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 py-[7px]">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "grid size-4 shrink-0 place-items-center rounded-full border transition-colors",
          checked ? "border-brand-400" : "border-white/20 group-hover:border-white/40",
        )}
      >
        {checked && <span className="size-2 rounded-full bg-brand-400" />}
      </span>
      <span
        className={cn(
          "text-[13px] transition-colors",
          checked ? "text-text" : "text-white/60 group-hover:text-white/90",
        )}
      >
        {label}
      </span>
    </label>
  );
}

export function FilterFields({ filters, onChange, showDuration = true }: FilterProps) {
  const { t } = useLanguage();
  const toggle = (key: "interpreters" | "categories" | "years", value: string) => {
    const current = filters[key];
    onChange({
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    });
  };

  return (
    <div className="space-y-7">
      <Group legend={t("category")}>
        {CATEGORIES.map((category) => (
          <CheckRow
            key={category.id}
            label={category.name}
            count={categoryCount(category.id)}
            checked={filters.categories.includes(category.id)}
            onChange={() => toggle("categories", category.id)}
          />
        ))}
      </Group>

      <Group legend={t("interpreterLabel")}>
        {INTERPRETERS.map((interpreter) => (
          <CheckRow
            key={interpreter.id}
            label={interpreter.name}
            count={interpreterCounts(interpreter.id).total}
            checked={filters.interpreters.includes(interpreter.id)}
            onChange={() => toggle("interpreters", interpreter.id)}
          />
        ))}
      </Group>

      <Group legend={t("releaseYear")}>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {AVAILABLE_YEARS.map((year) => {
            const active = filters.years.includes(String(year));
            return (
              <button
                key={year}
                type="button"
                aria-pressed={active}
                onClick={() => toggle("years", String(year))}
                className={cn(
                  "num rounded-md border px-2 py-1 text-[12px] transition-colors",
                  active
                    ? "border-brand-400/60 bg-brand-500/20 text-brand-100"
                    : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
                )}
              >
                {year}
              </button>
            );
          })}
        </div>
      </Group>

      <Group legend={t("rating")}>
        {RATING_OPTIONS.map((option) => (
          <RadioRow
            key={option.value}
            name="rating"
            label={option.label}
            checked={filters.rating === option.value}
            onChange={() => onChange({ rating: option.value })}
          />
        ))}
      </Group>

      {showDuration && (
        <Group legend={t("filmLength")}>
          {DURATION_OPTIONS.map((option) => (
            <RadioRow
              key={option.value}
              name="duration"
              label={option.label}
              checked={filters.duration === option.value}
              onChange={() => onChange({ duration: option.value })}
            />
          ))}
        </Group>
      )}

      <p className="border-t border-white/[0.07] pt-4 text-[11.5px] text-white/30">
        {TITLES.length} {t("titlesInCatalogue")}
      </p>
    </div>
  );
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  showDuration,
  count,
}: FilterProps & { onClear: () => void; count?: number }) {
  const { t } = useLanguage();
  const activeCount = count ?? activeFilterCount(filters);

  return (
    <div className="sticky top-24">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-[15px] text-text">{t("filters")}</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="inline-flex items-center gap-1.5 text-[12px] text-white/45 transition hover:text-white disabled:opacity-35"
        >
          <RotateCcw size={12} aria-hidden="true" />
          {t("clear")}
          {activeCount > 0 && <span className="num text-white/30">({activeCount})</span>}
        </button>
      </div>
      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-1 [scrollbar-width:thin]">
        <FilterFields filters={filters} onChange={onChange} showDuration={showDuration} />
      </div>
    </div>
  );
}
