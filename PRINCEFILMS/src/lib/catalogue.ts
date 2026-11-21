import { isSeries, TITLES, type Title } from "@/data/catalog";

export type SortKey = "views" | "rating" | "year" | "title";
export type ViewMode = "list" | "grid";
export type KindFilter = "all" | "movie" | "series";

export type Filters = {
  q: string;
  interpreters: string[];
  categories: string[];
  years: string[];
  rating: string;
  duration: string;
  kind: KindFilter;
  sort: SortKey;
  view: ViewMode;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  interpreters: [],
  categories: [],
  years: [],
  rating: "all",
  duration: "all",
  kind: "all",
  sort: "views",
  view: "grid",
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "views", label: "Most watched" },
  { value: "rating", label: "Highest rated" },
  { value: "year", label: "Newest release" },
  { value: "title", label: "Title A–Z" },
];

export const RATING_OPTIONS = [
  { value: "all", label: "Any rating" },
  { value: "4.5", label: "4.5 and above" },
  { value: "4.0", label: "4.0 and above" },
];

export const DURATION_OPTIONS = [
  { value: "all", label: "Any length" },
  { value: "short", label: "Under 100 min" },
  { value: "standard", label: "100 to 120 min" },
  { value: "long", label: "Over 120 min" },
];

const list = (value: string | null): string[] =>
  value ? value.split(",").map((item) => item.trim()).filter(Boolean) : [];

export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get("sort");
  const view = params.get("view");
  const kind = params.get("kind");
  return {
    q: params.get("q") ?? "",
    interpreters: list(params.get("interpreter")),
    categories: list(params.get("category")),
    years: list(params.get("year")),
    rating: params.get("rating") ?? "all",
    duration: params.get("duration") ?? "all",
    kind: kind === "movie" || kind === "series" ? kind : "all",
    sort:
      sort === "rating" || sort === "year" || sort === "title" || sort === "views"
        ? sort
        : DEFAULT_FILTERS.sort,
    view: view === "list" ? "list" : "grid",
  };
}

export function toSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.interpreters.length) params.set("interpreter", filters.interpreters.join(","));
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.years.length) params.set("year", filters.years.join(","));
  if (filters.rating !== "all") params.set("rating", filters.rating);
  if (filters.duration !== "all") params.set("duration", filters.duration);
  if (filters.kind !== "all") params.set("kind", filters.kind);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  if (filters.view !== DEFAULT_FILTERS.view) params.set("view", filters.view);
  return params;
}

export function filterTitles(titles: Title[], filters: Filters): Title[] {
  const query = filters.q.trim().toLowerCase();
  const minRating = filters.rating === "all" ? 0 : Number(filters.rating);

  const filtered = titles.filter((title) => {
    if (filters.kind !== "all" && title.kind !== filters.kind) return false;
    if (filters.interpreters.length && !filters.interpreters.includes(title.interpreterId)) return false;
    if (
      filters.categories.length &&
      !title.categoryIds.some((category) => filters.categories.includes(category))
    ) {
      return false;
    }
    if (filters.years.length && !filters.years.includes(String(title.year))) return false;
    if (title.rating < minRating) return false;

    if (filters.duration !== "all") {
      if (isSeries(title)) return false;
      if (filters.duration === "short" && title.runtime >= 100) return false;
      if (filters.duration === "standard" && (title.runtime < 100 || title.runtime > 120)) return false;
      if (filters.duration === "long" && title.runtime <= 120) return false;
    }

    if (query) {
      const haystack = [title.title, title.genre, title.tags.join(" ")].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "rating":
        return b.rating - a.rating;
      case "year":
        return b.releasedAt.localeCompare(a.releasedAt);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return b.views - a.views;
    }
  });
}

export function activeFilterCount(filters: Filters): number {
  return (
    filters.interpreters.length +
    filters.categories.length +
    filters.years.length +
    (filters.rating !== "all" ? 1 : 0) +
    (filters.duration !== "all" ? 1 : 0) +
    (filters.kind !== "all" ? 1 : 0)
  );
}

export const AVAILABLE_YEARS = Array.from(new Set(TITLES.map((title) => title.year))).sort(
  (a, b) => b - a,
);
