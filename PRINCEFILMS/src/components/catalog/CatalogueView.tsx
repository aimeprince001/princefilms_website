import { LayoutGrid, List, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CATEGORIES,
  getCategory,
  getInterpreterById,
  type Title,
} from "@/data/catalog";
import {
  DEFAULT_FILTERS,
  DURATION_OPTIONS,
  RATING_OPTIONS,
  SORT_OPTIONS,
  activeFilterCount,
  filterTitles,
  parseFilters,
  toSearchParams,
  type Filters,
} from "@/lib/catalogue";
import { cn } from "@/lib/cn";
import { TitleRow } from "@/components/media/TitleRow";
import { TitleCard } from "@/components/media/TitleCard";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { FilterSheet } from "@/components/catalog/FilterSheet";

type Props = {
  heading: string;
  description?: string;
  baseTitles: Title[];
  lockedKind?: "movie" | "series";
  showKindSwitch?: boolean;
};

export function CatalogueView({ heading, description, baseTitles, lockedKind, showKindSwitch }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const filters = useMemo<Filters>(() => {
    const parsed = parseFilters(searchParams);
    return lockedKind ? { ...parsed, kind: lockedKind } : parsed;
  }, [searchParams, lockedKind]);

  const results = useMemo(() => filterTitles(baseTitles, filters), [baseTitles, filters]);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setSearchParams(toSearchParams(lockedKind ? { ...next, kind: "all" } : next), {
      replace: true,
    });
  };

  const clearAll = () => {
    setSearchParams(
      toSearchParams({ ...DEFAULT_FILTERS, sort: filters.sort, view: filters.view }),
      { replace: true },
    );
  };

  const filterCount = Math.max(0, activeFilterCount(filters) - (lockedKind ? 1 : 0));
  const showDuration = lockedKind !== "series";

  const chips = useMemo(() => {
    const items: { key: string; label: string; remove: () => void }[] = [];
    filters.interpreters.forEach((id) =>
      items.push({
        key: `interpreter-${id}`,
        label: getInterpreterById(id)?.name ?? id,
        remove: () =>
          update({ interpreters: filters.interpreters.filter((item) => item !== id) }),
      }),
    );
    filters.categories.forEach((id) =>
      items.push({
        key: `category-${id}`,
        label: getCategory(id)?.name ?? id,
        remove: () => update({ categories: filters.categories.filter((item) => item !== id) }),
      }),
    );
    filters.years.forEach((year) =>
      items.push({
        key: `year-${year}`,
        label: year,
        remove: () => update({ years: filters.years.filter((item) => item !== year) }),
      }),
    );
    if (filters.rating !== "all") {
      items.push({
        key: "rating",
        label: RATING_OPTIONS.find((option) => option.value === filters.rating)?.label ?? filters.rating,
        remove: () => update({ rating: "all" }),
      });
    }
    if (filters.duration !== "all") {
      items.push({
        key: "duration",
        label:
          DURATION_OPTIONS.find((option) => option.value === filters.duration)?.label ??
          filters.duration,
        remove: () => update({ duration: "all" }),
      });
    }
    if (filters.kind !== "all" && !lockedKind) {
      items.push({
        key: "kind",
        label: filters.kind === "movie" ? "Films only" : "Series only",
        remove: () => update({ kind: "all" }),
      });
    }
    if (filters.q.trim()) {
      items.push({
        key: "q",
        label: `“${filters.q.trim()}”`,
        remove: () => update({ q: "" }),
      });
    }
    return items;
  }, [filters, lockedKind]);

  return (
    <div className="page-shell pb-16 pt-8">
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-[30px] leading-[1.05] text-text sm:text-[38px]">{heading}</h1>
          <span className="num text-[13px] text-white/35">
            {results.length} {results.length === 1 ? "title" : "titles"}
          </span>
        </div>
        {description && <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-muted">{description}</p>}
      </header>

      <div className="mt-6 max-w-xl">
        <label htmlFor="catalog-search" className="sr-only">Search movies and series</label>
        <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-ink-850/80 px-4 transition focus-within:border-brand-400/60 focus-within:ring-2 focus-within:ring-brand-500/15">
          <Search size={17} className="shrink-0 text-white/35" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={filters.q}
            onChange={(event) => update({ q: event.target.value })}
            placeholder={lockedKind === "movie" ? "Search movies, genres, interpreters…" : lockedKind === "series" ? "Search series, genres, interpreters…" : "Search movies, series, genres…"}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-white/35 outline-none"
          />
          {filters.q && (
            <button type="button" onClick={() => update({ q: "" })} aria-label="Clear search" className="grid size-7 place-items-center rounded-md text-white/45 hover:bg-white/10 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick category filters">
        {CATEGORIES.slice(0, 7).map((category) => {
          const active = filters.categories.includes(category.id);
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => update({ categories: active ? filters.categories.filter((id) => id !== category.id) : [...filters.categories, category.id] })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                active
                  ? "border-brand-400/60 bg-brand-500/20 text-brand-100"
                  : "border-white/10 bg-white/[0.025] text-white/55 hover:border-white/25 hover:text-white",
              )}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {showKindSwitch && (
        <div
          role="tablist"
          aria-label="Content type"
          className="mt-6 flex w-fit items-center gap-1 rounded-xl border border-white/10 bg-ink-850 p-1"
        >
          {[
            { value: "all", label: "All" },
            { value: "movie", label: "Films" },
            { value: "series", label: "Series" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={filters.kind === option.value}
              onClick={() => update({ kind: option.value as Filters["kind"] })}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                filters.kind === option.value
                  ? "bg-white text-ink-950"
                  : "text-white/55 hover:bg-white/5 hover:text-white",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-7 grid gap-8 lg:grid-cols-[236px_minmax(0,1fr)] xl:gap-12">
        <aside className="hidden lg:block" aria-label="Catalogue filters">
          <FilterPanel
            filters={filters}
            onChange={update}
            onClear={clearAll}
            showDuration={showDuration}
            count={filterCount}
          />
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/12 px-3 text-[13px] font-medium text-white/75 transition hover:border-white/25 hover:text-white lg:hidden"
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                Filters
                {filterCount > 0 && (
                  <span className="num rounded bg-brand-500/25 px-1.5 text-[11px] text-brand-200">
                    {filterCount}
                  </span>
                )}
              </button>
              <span className="num hidden text-[12.5px] text-white/35 lg:inline">
                {results.length} results
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select
                label="Sort"
                hideLabel
                value={filters.sort}
                options={SORT_OPTIONS}
                onChange={(value) => update({ sort: value as Filters["sort"] })}
              />

              <div className="flex items-center rounded-lg border border-white/10 bg-ink-850 p-0.5">
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={filters.view === "list"}
                  onClick={() => update({ view: "list" })}
                  className={cn(
                    "grid size-8 place-items-center rounded-md transition-colors",
                    filters.view === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white",
                  )}
                >
                  <List size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={filters.view === "grid"}
                  onClick={() => update({ view: "grid" })}
                  className={cn(
                    "grid size-8 place-items-center rounded-md transition-colors",
                    filters.view === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white",
                  )}
                >
                  <LayoutGrid size={14} />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.remove}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/12 bg-white/[0.04] py-1 pl-2.5 pr-2 text-[12px] text-white/70 transition hover:border-white/25 hover:text-white"
                >
                  {chip.label}
                  <X size={11} aria-hidden="true" className="text-white/40" />
                  <span className="sr-only">Remove filter</span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="px-1 text-[12px] font-medium text-brand-200 transition hover:text-brand-100"
              >
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No titles match these filters"
              description="Widen the rating or length filter, or clear the interpreter selection to see the full catalogue."
              className="mt-6"
              action={
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-[13px] font-semibold text-white hover:bg-brand-400"
                >
                  Clear filters
                </button>
              }
            />
          ) : filters.view === "grid" ? (
            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((title) => (
                <TitleCard key={title.id} title={title} />
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-0.5">
              {results.map((title) => (
                <TitleRow key={title.id} title={title} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={update}
        onClear={clearAll}
        resultCount={results.length}
        showDuration={showDuration}
      />
    </div>
  );
}
