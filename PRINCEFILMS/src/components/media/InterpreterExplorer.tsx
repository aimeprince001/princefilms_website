import { ArrowUpRight, Play } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  INTERPRETERS,
  isSeries,
  titlesByInterpreter,
  totalEpisodes,
} from "@/data/catalog";
import { formatRuntime, formatViews, progressPercent } from "@/lib/format";
import { usePlayer } from "@/context/PlayerContext";
import { useLibrary } from "@/context/LibraryContext";
import { cn } from "@/lib/cn";
import { Rating } from "@/components/ui/Rating";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Interpreter-led discovery. The roster is the primary control and the
 * selected voice's catalogue fills the stage beside it.
 */
export function InterpreterExplorer() {
  const { t } = useLanguage();
  const first = INTERPRETERS[0];
  const [activeId, setActiveId] = useState(INTERPRETERS[0]?.id ?? "");
  const { play } = usePlayer();
  const { progressFor } = useLibrary();

  const interpreter = INTERPRETERS.find((item) => item.id === activeId) ?? first;
  const titles = useMemo(() => titlesByInterpreter(interpreter?.id ?? ""), [interpreter?.id]);
  const featured = titles.find((title) => title.featured) ?? titles[0];
  const rest = titles.filter((title) => title.id !== featured?.id);
  const filmCount = titles.filter((title) => title.kind === "movie").length;

  if (!interpreter || !featured) return null;

  const entry = progressFor(featured.id);
  const percent = entry ? progressPercent(entry.position, entry.duration) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-10">
      <div className="min-w-0">
        <ul className="border-y border-white/[0.07]">
          {INTERPRETERS.map((item) => {
            const count = titlesByInterpreter(item.id).length;
            const selected = item.id === interpreter.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-3 border-l-2 py-2.5 pl-3 pr-2 text-left transition-colors",
                    selected
                      ? "border-brand-400 bg-white/[0.055]"
                      : "border-transparent hover:bg-white/[0.03]",
                  )}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="size-7 shrink-0 rounded-full object-cover ring-1 ring-inset ring-white/10"
                  />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[13.5px]",
                      selected ? "font-semibold text-white" : "text-white/65",
                    )}
                  >
                    {item.name}
                  </span>
                  <span className="num shrink-0 text-[11.5px] text-white/30">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <Link
          to="/interpreters"
          className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
        >
          {t("allInterpreters")}
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-[26px] leading-none text-text sm:text-[30px]">
              {interpreter.name}
            </h3>
            <p className="num mt-2 text-[12.5px] text-white/40">
              {filmCount} {filmCount === 1 ? "film" : "films"}
              <span aria-hidden="true"> · </span>
              {titles.length - filmCount} {titles.length - filmCount === 1 ? "series" : "series"}
              <span aria-hidden="true"> · </span>
              {interpreter.role}
            </p>
          </div>
          <Link
            to={`/interpreters/${interpreter.slug}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/12 px-3 text-[12.5px] font-medium text-white/70 transition hover:border-brand-400/60 hover:text-white"
          >
            {t("interpreterProfile")}
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        </div>

        <article className="group relative mt-4 overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="relative aspect-16/9">
            <img
              src={featured.image}
              alt={`${featured.title} — still, photo by ${featured.imageCredit}`}
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
              className="size-full object-cover still-tone transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10" aria-hidden="true" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-white/50">
              <span className="rounded bg-ink-950/60 px-1.5 py-0.5 font-semibold uppercase tracking-[0.12em] text-white/75">
                {isSeries(featured) ? "Series" : "Film"}
              </span>
              <span className="num">{featured.year}</span>
              <span className="num">
                {isSeries(featured) ? `${totalEpisodes(featured)} episodes` : formatRuntime(featured.runtime)}
              </span>
              <Rating value={featured.rating} />
              <span className="num">{formatViews(featured.views)} views</span>
            </div>

            <h4 className="mt-2 font-display text-[22px] leading-tight text-white sm:text-[26px]">
              <Link to={`/${featured.kind}/${featured.id}`} className="hover:text-brand-100">
                {featured.title}
              </Link>
            </h4>

            {entry && (
              <div className="mt-2.5 max-w-xs">
                <ProgressRail value={percent} />
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => play(featured.id, entry?.episodeId)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-[13px] font-semibold text-ink-950 transition hover:bg-brand-100"
              >
                <Play size={13} className="fill-current" aria-hidden="true" />
                {t(entry && percent < 92 ? "resume" : "play")}
              </button>
              <Link
                to={`/${featured.kind}/${featured.id}`}
                className="inline-flex h-10 items-center rounded-lg border border-white/20 px-4 text-[13px] font-medium text-white/85 backdrop-blur transition hover:border-white/40 hover:bg-white/10"
              >
                {t("details")}
              </Link>
            </div>
          </div>
        </article>

        {rest.length > 0 && (
          <ul className="mt-2 grid gap-x-6 sm:grid-cols-2">
            {rest.map((title) => (
              <li key={title.id}>
                <Link
                  to={`/${title.kind}/${title.id}`}
                  className="flex items-center gap-3 border-b border-white/[0.06] py-2.5 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="relative h-9 w-16 shrink-0 overflow-hidden rounded">
                    <img
                      src={title.image}
                      alt=""
                      width={128}
                      height={72}
                      loading="lazy"
                      className="size-full object-cover opacity-75"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-white/85">{title.title}</span>
                    <span className="num block text-[11px] text-white/35">
                      {isSeries(title)
                        ? `${title.seasons.length} seasons`
                        : formatRuntime(title.runtime)}{" "}
                      · {title.year}
                    </span>
                  </span>
                  <Play size={12} className="shrink-0 text-white/30" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
