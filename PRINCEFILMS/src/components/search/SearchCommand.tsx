import { ArrowRight, Clock, Film, Search, Tv, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSeries, searchCatalog, TRENDING_SEARCHES, type Title } from "@/data/catalog";
import { useLibrary } from "@/context/LibraryContext";
import { useSearchOverlay } from "@/context/SearchContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { formatRuntime, formatViews } from "@/lib/format";
import { cn } from "@/lib/cn";

type ResultRow =
  | { kind: "interpreter"; item: import("@/data/catalog").Interpreter; href: string }
  | { kind: "title"; item: Title; href: string };

export function SearchCommand() {
  const { isOpen, openSearch, closeSearch } = useSearchOverlay();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useLibrary();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const results = useMemo(() => searchCatalog(query), [query]);

  const rows = useMemo<ResultRow[]>(() => {
    const interpreterRows: ResultRow[] = results.interpreters.map((interpreter) => ({
      kind: "interpreter",
      item: interpreter,
      href: `/interpreters/${interpreter.slug}`,
    }));
    const titleRows: ResultRow[] = results.titles.slice(0, 8).map((title) => ({
      kind: "title",
      item: title,
      href: `/${title.kind}/${title.id}`,
    }));
    return [...interpreterRows, ...titleRows];
  }, [results]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!isOpen) return null;

  const submitQuery = () => {
    const term = query.trim();
    if (!term) return;
    addRecentSearch(term);
    closeSearch();
    navigate(`/search?query=${encodeURIComponent(term)}`);
  };

  const go = (row: ResultRow) => {
    addRecentSearch(query || (row.kind === "interpreter" ? row.item.name : row.item.title));
    closeSearch();
    navigate(row.href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(rows.length - 1, index + 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(0, index - 1));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const row = rows[activeIndex];
      if (row) go(row);
      else navigateToSearch(query);
    }
    if (event.key === "Escape") closeSearch();
  };

  const navigateToSearch = (term: string) => {
    addRecentSearch(term);
    closeSearch();
    navigate(`/search?query=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-3 pt-[8vh] sm:pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={closeSearch}
        className="absolute inset-0 cursor-default bg-[#040308]/80 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search PRINCEFILMS"
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/12 bg-ink-900 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
          <Search size={17} className="shrink-0 text-brand-300" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search titles, interpreters, genres"
            aria-label="Search titles and interpreters"
            className="h-14 w-full bg-transparent text-[15px] text-text placeholder:text-white/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={closeSearch}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[min(60vh,540px)] overflow-y-auto">
          {!query && (
            <div className="p-3">
              {recentSearches.length > 0 && (
                <div className="mb-2">
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">
                      Recent
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[11px] text-white/35 hover:text-white/70"
                    >
                      Clear
                    </button>
                  </div>
                  <ul>
                    {recentSearches.map((term) => (
                      <li key={term}>
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[13.5px] text-white/70 hover:bg-white/5 hover:text-white"
                        >
                          <Clock size={14} className="text-white/30" aria-hidden="true" />
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="px-2 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Trending searches
              </div>
              <div className="flex flex-wrap gap-2 p-2 pt-1.5">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/65 transition hover:border-brand-400/50 hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && rows.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p className="text-[14px] text-text">No matches for “{query}”</p>
              <p className="mt-1 text-[12.5px] text-muted">Try an interpreter, a genre or a shorter term.</p>
            </div>
          )}

          {query && rows.length > 0 && (
            <ul role="listbox" aria-label="Search results" className="p-2">
              {rows.map((row, index) => (
                <li key={`${row.kind}-${row.item.id}`} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(row)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors",
                      index === activeIndex ? "bg-white/[0.07]" : "hover:bg-white/[0.04]",
                    )}
                  >
                    <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-ink-800">
                      {row.kind === "title" ? (
                        <img
                          src={row.item.image}
                          alt=""
                          width={88}
                          height={60}
                          className="size-full object-cover opacity-80"
                          loading="lazy"
                        />
                      ) : (
                        <span className="font-display text-sm font-bold text-brand-200">
                          {row.item.name.charAt(0)}
                        </span>
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        {row.kind === "interpreter" ? (
                          <Users size={12} className="text-brand-300" aria-hidden="true" />
                        ) : isSeries(row.item) ? (
                          <Tv size={12} className="text-brand-300" aria-hidden="true" />
                        ) : (
                          <Film size={12} className="text-brand-300" aria-hidden="true" />
                        )}
                        <span className="truncate text-[13.5px] font-medium text-text">
                          {row.kind === "interpreter" ? row.item.name : row.item.title}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-white/40">
                        {row.kind === "interpreter"
                          ? row.item.role
                          : `${row.item.year} · ${isSeries(row.item) ? `${row.item.seasons.length} seasons` : formatRuntime(row.item.runtime)} · ${formatViews(row.item.views)} views`}
                      </span>
                    </span>

                    <ArrowRight size={14} className="shrink-0 text-white/25" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-2.5 text-[11px] text-white/35">
          <span className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-white/10 px-1 py-0.5">↑</kbd>
              <kbd className="ml-1 rounded border border-white/10 px-1 py-0.5">↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded border border-white/10 px-1 py-0.5">↵</kbd> open
            </span>
          </span>
          <button type="button" onClick={submitQuery} className="hover:text-white/70">
            See all results
          </button>
        </div>
      </div>
    </div>
  );
}
