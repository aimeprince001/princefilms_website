import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  INTERPRETERS,
  getInterpreterBySlug,
  interpreterCounts,
  isSeries,
  titlesByInterpreter,
  totalEpisodes,
} from "@/data/catalog";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { usePlayer } from "@/context/PlayerContext";
import { formatRuntime, formatViews } from "@/lib/format";
import { Rating } from "@/components/ui/Rating";
import { TitleRow } from "@/components/media/TitleRow";\nimport { useLanguage } from "@/context/LanguageContext";

export function InterpreterDetail() {\n  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const interpreter = slug ? getInterpreterBySlug(slug) : undefined;
  const { play } = usePlayer();

  useDocumentTitle(interpreter ? interpreter.name : t("interpreterLabel"));

  if (!interpreter) {
    return (
      <div className="page-shell py-16">
        <h1 className="font-display text-2xl text-text">{t("interpreterNotFound")}</h1>
        <Link to="/interpreters" className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-brand-200">
          <ArrowUpRight size={14} /> {t("allInterpreters")}
        </Link>
      </div>
    );
  }

  const titles = titlesByInterpreter(interpreter.id);
  const counts = interpreterCounts(interpreter.id);
  const films = titles.filter((title) => !isSeries(title));
  const seriesList = titles.filter(isSeries);
  const featured = titles.find((title) => title.featured) ?? titles[0];
  const others = INTERPRETERS.filter((person) => person.id !== interpreter.id).slice(0, 5);

  return (
    <div className="pb-16">
      <div className="page-shell pt-6">
        <Link
          to="/interpreters"
          className="inline-flex items-center gap-2 text-[12.5px] text-white/45 transition hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {t("allInterpreters")}
        </Link>

        <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <img
              src={interpreter.avatar}
              alt={interpreter.name}
              className="size-16 shrink-0 rounded-2xl object-cover ring-1 ring-inset ring-white/15 sm:size-20"
            />
            <div>
              <h1 className="font-display text-[32px] leading-[1.02] tracking-[-0.03em] text-text sm:text-[44px]">
                {interpreter.name}
              </h1>
              <p className="num mt-2 text-[12.5px] text-white/45">
                {counts.movies} films / {counts.series} series / {counts.total} titles / voicing
                since {interpreter.since}
              </p>
              <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-muted">{interpreter.bio}</p>
            </div>
          </div>
        </header>

        {featured && (
          <section aria-label={`Featured title voiced by ${interpreter.name}`} className="mt-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
              <img
                src={featured.image}
                alt={`${featured.title} — still, photo by ${featured.imageCredit}`}
                width={1600}
                height={800}
                className="h-[260px] w-full object-cover still-tone sm:h-[320px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-white/55">
                  <span className="rounded bg-ink-950/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                    {isSeries(featured) ? t("seriesLabel") : t("filmLabel")}
                  </span>
                  <span className="num">{featured.year}</span>
                  <span className="num">
                    {isSeries(featured) ? `${totalEpisodes(featured)} ${t("episodesCount")}` : formatRuntime(featured.runtime)}
                  </span>
                  <Rating value={featured.rating} />
                  <span className="num">{formatViews(featured.views)} views</span>
                </div>
                <h2 className="mt-2 font-display text-[24px] leading-tight text-white sm:text-[30px]">
                  <Link to={`/${featured.kind}/${featured.id}`} className="hover:text-brand-100">
                    {featured.title}
                  </Link>
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => play(featured.id)}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-[13px] font-semibold text-ink-950 transition hover:bg-brand-100"
                  >
                    <Play size={13} className="fill-current" aria-hidden="true" />
                    Play
                  </button>
                  <Link
                    to={`/${featured.kind}/${featured.id}`}
                    className="inline-flex h-10 items-center rounded-lg border border-white/20 px-4 text-[13px] font-medium text-white/85 transition hover:border-white/40 hover:bg-white/10"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0 space-y-10">
            {films.length > 0 && (
              <section aria-labelledby="films-heading">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="films-heading" className="font-display text-xl text-text">
                    Films
                  </h2>
                  <span className="num text-[12px] text-white/30">{films.length}</span>
                </div>
                <div className="mt-2">
                  {films.map((title) => (
                    <TitleRow key={title.id} title={title} />
                  ))}
                </div>
              </section>
            )}

            {seriesList.length > 0 && (
              <section aria-labelledby="series-heading">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="series-heading" className="font-display text-xl text-text">
                    Series
                  </h2>
                  <span className="num text-[12px] text-white/30">{seriesList.length}</span>
                </div>
                <div className="mt-2">
                  {seriesList.map((title) => (
                    <TitleRow key={title.id} title={title} />
                  ))}
                </div>
              </section>
            )}

            {titles.length === 0 && (
              <p className="text-[13.5px] text-muted">{t("noInterpreterTitles")}</p>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-white/[0.07] bg-ink-850 p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Other interpreters
              </p>
              <ul className="mt-3 space-y-1">
                {others.map((person) => (
                  <li key={person.id}>
                    <Link
                      to={`/interpreters/${person.slug}`}
                      className="flex items-center justify-between gap-2 rounded-md px-1 py-1.5 text-[12.5px] text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                      <span className="truncate">{person.name}</span>
                      <span className="num text-[11px] text-white/25">
                        {interpreterCounts(person.id).total}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[11.5px] leading-relaxed text-white/30">
              Credits count films and series in this catalogue. Release years refer to the
              Kinyarwanda version.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
