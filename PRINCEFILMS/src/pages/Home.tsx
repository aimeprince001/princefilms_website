import { ArrowRight, Bookmark, Play, TrendingUp } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CATEGORIES,
  SERIES,
  TITLES,
  categoryCount,
  getTitleById,
  isMovie,
  latestTitles,
  totalEpisodes,
  trendingTitles,
} from "@/data/catalog";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatViews } from "@/lib/format";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { buttonClass } from "@/components/ui/Button";
import { MediaRail } from "@/components/media/MediaRail";
import { TitleCard } from "@/components/media/TitleCard";
import { ResumeCard } from "@/components/media/ResumeCard";
import { HeroRail } from "@/components/media/HeroRail";
import { InterpreterExplorer } from "@/components/media/InterpreterExplorer";

export function Home() {
  useDocumentTitle();
  const { continueWatching } = useLibrary();
  const { play } = usePlayer();
  const [searchParams, setSearchParams] = useSearchParams();

  // Deep link into the player: /?play=<title-id> opens playback immediately.
  const requestedPlayId = searchParams.get("play");
  useEffect(() => {
    if (!requestedPlayId) return;
    const target = getTitleById(requestedPlayId);
    if (target) play(target.id);
    const next = new URLSearchParams(searchParams);
    next.delete("play");
    setSearchParams(next, { replace: true });
    // Runs once for the incoming deep link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const railItems = continueWatching;

  const spotlight = SERIES.find((series) => series.id === "master-p-kingdom") ?? SERIES[0];

  // Featured / recently added titles that drive the sliding hero.
  const featured = useMemo(
    () =>
      [...TITLES]
        .filter((title) => title.featured)
        .sort((a, b) => b.releasedAt.localeCompare(a.releasedAt)),
    [],
  );

  return (
    <div className="pb-16 pt-6">
      <div className="page-shell">
        <HeroRail titles={featured} />
      </div>

      <section aria-labelledby="recent-heading" className="page-shell mt-16 lg:mt-24">
        <SectionHeading
          id="recent-heading"
          title="Recently added"
          description="Fresh titles landing on PRINCEFILMS this week."
          action={
            <Link
              to="/movies"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
            >
              All new releases <ArrowRight size={13} aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-5 flex flex-col lg:flex-row items-start justify-between gap-6">
          <MediaRail label="Recently added movies" className="flex-1 mt-0">
            {latestTitles(20)
              .filter(isMovie)
              .slice(0, 10)
              .map((title) => (
              <div key={title.id} className="w-[250px] shrink-0 snap-start">
                <TitleCard title={title} />
              </div>
            ))}
          </MediaRail>
        </div>
      </section>

      {railItems.length > 0 && (
        <section aria-labelledby="continue-heading" className="page-shell mt-12 lg:mt-16">
          <SectionHeading
            id="continue-heading"
            title="Continue watching"
            count={`${railItems.length}`}
            action={
              <Link
                to="/my-list"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
              >
                View My List <ArrowRight size={13} aria-hidden="true" />
              </Link>
            }
          />
          {railItems.length <= 2 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {railItems.map((item) => (
                <ResumeCard key={item.title.id} title={item.title} progress={item.progress} variant="tile" />
              ))}
            </div>
          ) : (
            <MediaRail label="Continue watching" className="mt-5">
              {railItems.map((item) => (
                <ResumeCard key={item.title.id} title={item.title} progress={item.progress} />
              ))}
            </MediaRail>
          )}
        </section>
      )}

      <section aria-labelledby="trending-heading" className="page-shell mt-14 lg:mt-20">
        <SectionHeading
          id="trending-heading"
          title="Most watched"
          description="Ranked by views across Kigali and upcountry."
          action={
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/35">
              <TrendingUp size={14} aria-hidden="true" /> Updated weekly
            </span>
          }
        />
        <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
          {trendingTitles(6).map((title, index) => {
            const voice = getInterpreterById(title.interpreterId);
            return (
              <li key={title.id}>
                <Link
                  to={`/${title.kind}/${title.id}`}
                  className="group flex items-center gap-4 border-b border-white/[0.06] py-3 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="num w-7 shrink-0 font-display text-[22px] leading-none text-white/15 transition-colors group-hover:text-brand-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative h-12 w-[86px] shrink-0 overflow-hidden rounded-md bg-ink-800">
                    <img
                      src={title.image}
                      alt=""
                      width={172}
                      height={96}
                      loading="lazy"
                      className="size-full object-cover still-tone"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-white/90 group-hover:text-white">
                      {title.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[11.5px] text-white/40">
                      {voice?.name} · {title.year}
                    </span>
                  </span>
                  <span className="hidden shrink-0 text-right sm:block">
                    <Rating value={title.rating} />
                    <span className="num mt-0.5 block text-[11px] text-white/30">
                      {formatViews(title.views)} views
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="spotlight-heading" className="page-shell mt-14 lg:mt-20">
        <div className="grid overflow-hidden rounded-[22px] border border-white/[0.08] bg-ink-850 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[240px] lg:min-h-[320px]">
            <img
              src={spotlight.image}
              alt={`${spotlight.title} — still, photo by ${spotlight.imageCredit}`}
              width={1200}
              height={800}
              loading="lazy"
              className="absolute inset-0 size-full object-cover still-tone"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/20 to-ink-850 lg:to-ink-850" aria-hidden="true" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <h2 id="spotlight-heading" className="font-display text-[26px] leading-tight text-text sm:text-[32px]">
              {spotlight.title}
            </h2>
            <p className="num mt-2 text-[12px] text-white/40">
              {spotlight.seasons.length} seasons / {totalEpisodes(spotlight)} episodes / {spotlight.year}
            </p>
            <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">{spotlight.synopsis}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => play(spotlight.id)}
                className={buttonClass({ size: "md" })}
              >
                <Play size={14} className="fill-current" aria-hidden="true" />
                Play episode 1
              </button>
              <Link
                to={`/series/${spotlight.id}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-[13px] font-medium text-white/80 transition hover:border-white/30 hover:text-white"
              >
                Episodes
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
              <SaveButton titleId={spotlight.id} title={spotlight.title} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="latest-heading" className="page-shell mt-14 lg:mt-20">
        <SectionHeading
          id="latest-heading"
          title="New films"
          description="The most recent film releases in the catalogue."
          action={
            <Link
              to="/movies"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
            >
              All films <ArrowRight size={13} aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestTitles(16)
            .filter(isMovie)
            .slice(0, 8)
            .map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </div>
      </section>

      <section aria-labelledby="series-heading" className="page-shell mt-14 lg:mt-20">
        <SectionHeading
          id="series-heading"
          title="Series"
          action={
            <Link
              to="/series"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
            >
              All series <ArrowRight size={13} aria-hidden="true" />
            </Link>
          }
        />
        <MediaRail label="Series" className="mt-5">
          {SERIES.map((series) => (
            <div key={series.id} className="w-[268px] shrink-0 snap-start">
              <TitleCard title={series} />
            </div>
          ))}
        </MediaRail>
      </section>

      <section aria-labelledby="categories-heading" className="page-shell mt-14 lg:mt-20">
        <SectionHeading id="categories-heading" title="Browse by category" />
        <ul className="mt-5 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                to={`/category/${category.slug}`}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[13px] text-white/70 transition hover:border-brand-400/50 hover:bg-brand-500/10 hover:text-white"
              >
                {category.name}
                <span className="num text-[11px] text-white/30 group-hover:text-brand-200">
                  {categoryCount(category.id)}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/my-list"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium text-brand-200 transition hover:text-brand-100"
            >
              <Bookmark size={14} aria-hidden="true" /> Saved titles
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="interpreters-heading" className="page-shell mt-14 lg:mt-20">
        <SectionHeading
          id="interpreters-heading"
          title="Find a title by its voice"
          description="Every film and series here is dubbed in Kinyarwanda. Pick an interpreter to see their catalogue."
        />
        <div className="mt-6">
          <InterpreterExplorer />
        </div>
      </section>
    </div>
  );
}
