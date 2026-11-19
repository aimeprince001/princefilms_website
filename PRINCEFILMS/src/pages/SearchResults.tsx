import { ArrowUpRight, Search, SearchX, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  TRENDING_SEARCHES,
  interpreterCounts,
  isSeries,
  searchCatalog,
} from "@/data/catalog";
import { useLibrary } from "@/context/LibraryContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/cn";
import { TitleRow } from "@/components/media/TitleRow";
import { EmptyState } from "@/components/ui/EmptyState";

type TypeFilter = "all" | "movie" | "series" | "interpreter";

export function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addRecentSearch } = useLibrary();

  const query = params.get("query") ?? "";
  const [term, setTerm] = useState(query);
  const [type, setType] = useState<TypeFilter>("all");

  useDocumentTitle(query ? `Search: ${query}` : "Search");

  useEffect(() => {
    setTerm(query);
    setType("all");
  }, [query]);

  const { titles, interpreters } = useMemo(() => searchCatalog(query), [query]);

  const filteredTitles = useMemo(() => {
    if (type === "movie") return titles.filter((title) => !isSeries(title));
    if (type === "series") return titles.filter((title) => isSeries(title));
    return titles;
  }, [titles, type]);

  const showInterpreters = type === "all" || type === "interpreter";
  const showTitles = type !== "interpreter";
  const totalCount =
    (type === "interpreter" ? interpreters.length : filteredTitles.length + (showInterpreters ? interpreters.length : 0));

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const tabs: { value: TypeFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: titles.length + interpreters.length },
    { value: "movie", label: "Movies", count: titles.filter((title) => !isSeries(title)).length },
    { value: "series", label: "Series", count: titles.filter(isSeries).length },
    { value: "interpreter", label: "Interpreters", count: interpreters.length },
  ];

  return (
    <div className="page-shell pb-16 pt-8">
      <h1 className="font-display text-[30px] leading-[1.05] text-text sm:text-[36px]">
        {query ? (
          <>
            Results for <span className="text-brand-200">“{query}”</span>
          </>
        ) : (
          "Search the catalogue"
        )}
      </h1>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(term);
        }}
        className="mt-5 flex max-w-xl items-center gap-2"
        role="search"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" aria-hidden="true" />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Title, interpreter or genre"
            aria-label="Search title, interpreter or genre"
            className="h-11 w-full rounded-xl border border-white/12 bg-ink-850 pl-9 pr-3 text-[14px] text-text placeholder:text-white/30 focus:border-brand-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="h-11 rounded-xl bg-brand-500 px-4 text-[13px] font-semibold text-white transition hover:bg-brand-400"
        >
          Search
        </button>
      </form>

      {query && (
        <>
          <div className="mt-7 flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                aria-pressed={type === tab.value}
                onClick={() => setType(tab.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  type === tab.value
                    ? "bg-white text-ink-950"
                    : "text-white/55 hover:bg-white/5 hover:text-white",
                )}
              >
                {tab.label}
                <span className="num text-[11px] opacity-60">{tab.count}</span>
              </button>
            ))}
            <span className="num ml-2 text-[12px] text-white/30">
              {totalCount} {totalCount === 1 ? "match" : "matches"}
            </span>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_236px]">
            <div className="min-w-0 space-y-9">
              {showInterpreters && interpreters.length > 0 && (
                <section aria-labelledby="search-interpreters">
                  <h2 id="search-interpreters" className="font-display text-lg text-text">
                    Interpreters
                  </h2>
                  <ul className="mt-3 border-y border-white/[0.07]">
                    {interpreters.map((interpreter) => {
                      const counts = interpreterCounts(interpreter.id);
                      return (
                        <li key={interpreter.id}>
                          <Link
                            to={`/interpreters/${interpreter.slug}`}
                            className="group flex items-center gap-3.5 border-b border-white/[0.05] py-3 last:border-0 hover:bg-white/[0.03]"
                          >
                            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-500/20 font-display text-sm font-bold text-brand-200 ring-1 ring-inset ring-white/10">
                              {interpreter.name.charAt(0)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14px] font-medium text-text">
                                {interpreter.name}
                              </span>
                              <span className="num mt-0.5 block text-[11.5px] text-white/40">
                                {counts.movies} films · {counts.series} series · {interpreter.role}
                              </span>
                            </span>
                            <ArrowUpRight size={15} className="shrink-0 text-white/25 group-hover:text-brand-200" aria-hidden="true" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {showTitles && filteredTitles.length > 0 && (
                <section aria-labelledby="search-titles">
                  <h2 id="search-titles" className="font-display text-lg text-text">
                    Titles
                  </h2>
                  <div className="mt-2">
                    {filteredTitles.map((title) => (
                      <TitleRow key={title.id} title={title} />
                    ))}
                  </div>
                </section>
              )}

              {totalCount === 0 && (
                <EmptyState
                  icon={SearchX}
                  title={`No matches for “${query}”`}
                  description="Check the spelling, or search for an interpreter such as Rocky Kimomo, a genre such as crime, or a shorter word."
                  action={
                    <button
                      type="button"
                      onClick={() => setTerm("")}
                      className="inline-flex h-10 items-center rounded-lg border border-white/15 px-4 text-[13px] font-medium text-white/75 hover:bg-white/5"
                    >
                      Clear search
                    </button>
                  }
                />
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-white/[0.07] bg-ink-850 p-4">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                  <Users size={13} aria-hidden="true" /> Suggested searches
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submit(suggestion)}
                      className="rounded-md border border-white/10 px-2.5 py-1.5 text-[12px] text-white/60 transition hover:border-brand-400/50 hover:text-white"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11.5px] leading-relaxed text-white/30">
                Search matches title, genre, tag and interpreter name. Results are grouped by record type.
              </p>
            </aside>
          </div>
        </>
      )}

      {!query && (
        <div className="mt-8 max-w-3xl">
          <EmptyState
            icon={Search}
            title="Search titles, people or genres"
            description="Start with an interpreter you know, a category such as Crime, or a word from a title."
            action={
              <div className="flex flex-wrap justify-center gap-1.5">
                {TRENDING_SEARCHES.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submit(suggestion)}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-[12px] text-white/60 transition hover:border-brand-400/50 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
