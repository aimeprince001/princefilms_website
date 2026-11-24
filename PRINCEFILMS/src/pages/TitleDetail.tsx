import { ArrowLeft, Download, Play, Share2 } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getCategory,
  getEpisode,
  getInterpreterById,
  getTitleById,
  isSeries,
  relatedTitles,
  totalEpisodes,
} from "@/data/catalog";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatDate, formatRuntime, formatTimecode, formatViews, progressPercent } from "@/lib/format";
import { buttonClass } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SaveButton } from "@/components/ui/SaveButton";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { EpisodeList } from "@/components/media/EpisodeList";
import { MediaRail } from "@/components/media/MediaRail";
import { TitleCard } from "@/components/media/TitleCard";
import { useLanguage } from "@/context/LanguageContext";

export function TitleDetail() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const title = getTitleById(id);
  const { play } = usePlayer();
  const { progressFor } = useLibrary();
  const [shareLabel, setShareLabel] = useState("Share");

  useDocumentTitle(title?.title);

  if (!title) {
    return (
      <div className="page-shell py-16">
        <h1 className="font-display text-2xl text-text">{t("titleNotFound")}</h1>
        <p className="mt-2 text-[13.5px] text-muted">{t("titleNotFoundDesc")}</p>
        <Link to="/movies" className={buttonClass({ size: "md", className: "mt-5" })}>
          {t("browseMovies")}
        </Link>
      </div>
    );
  }

  const series = isSeries(title) ? title : null;
  const interpreter = getInterpreterById(title.interpreterId);
  const entry = progressFor(title.id);
  const percent = entry ? progressPercent(entry.position, entry.duration) : 0;
  const resumable = Boolean(entry) && percent < 92;
  const entryEpisode =
    isSeries(title) && progressFor(title.id)?.episodeId
      ? getEpisode(title, progressFor(title.id)?.episodeId)
      : undefined;
  const categories = title.categoryIds
    .map((categoryId) => getCategory(categoryId))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));
  const related = relatedTitles(title, 6);
  const stored = progressFor(title.id);
  const startEpisode = isSeries(title) ? getEpisode(title, progressFor(title.id)?.episodeId) : undefined;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: title.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      setShareLabel("Copy failed");
      window.setTimeout(() => setShareLabel("Share"), 2000);
    }
  };

  return (
    <div className="pb-16">
      <div className="page-shell relative pt-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(80%_100%_at_18%_0%,rgba(123,44,191,0.16),transparent)]"
        />
        <Link
          to={isSeries(title) ? "/series" : "/movies"}
          className="inline-flex items-center gap-2 text-[12.5px] text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to {isSeries(title) ? "series" : "movies"}
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-white/55">
          <span className="rounded bg-brand-500/20 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-100 ring-1 ring-inset ring-brand-400/25">
            {isSeries(title) ? "Series" : "Film"}
          </span>
          <span className="num">{title.year}</span>
          <span aria-hidden="true" className="text-white/25">
            /
          </span>
          <span>
            {isSeries(title)
              ? `${title.seasons.length} seasons · ${totalEpisodes(title)} episodes`
              : formatRuntime(title.runtime)}
          </span>
          <span aria-hidden="true" className="text-white/25">
            /
          </span>
          <span>{title.genre}</span>
          <Rating value={title.rating} votes={title.votes} size="md" />
          <span className="num text-white/35">{formatViews(title.views)} views</span>
        </div>

        <h1 className="mt-3 font-display text-[36px] leading-[0.96] tracking-[-0.03em] text-text sm:text-[52px]">
          {title.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => play(title.id, startEpisode?.id ?? entry?.episodeId)}
            className={buttonClass({ size: "lg", shape: "pill" })}
          >
            <Play size={15} className="fill-current" aria-hidden="true" />
            {resumable ? "Resume" : isSeries(title) ? "Play episode 1" : "Play film"}
          </button>
          <SaveButton titleId={title.id} title={title.title} variant="full" />
          <button
            type="button"
            onClick={share}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[13px] font-medium text-white/75 transition hover:border-white/30 hover:text-white"
          >
            <Share2 size={15} aria-hidden="true" />
            {shareLabel}
          </button>
          <a
            href={title.downloadUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/12 px-4 text-[13px] font-medium text-white/75 transition hover:border-white/30 hover:text-white"
          >
            <Download size={15} aria-hidden="true" />
            Download
          </a>
        </div>

        <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_300px] xl:gap-12">
          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-800">
              <div className="relative aspect-16/9">
                <img
                  src={title.image}
                  alt={`${title.title} — still, photo by ${title.imageCredit}`}
                  width={1280}
                  height={720}
                  className="size-full object-cover still-tone"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => play(title.id, entry?.episodeId)}
                  aria-label={`Play ${title.title}`}
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-ink-950 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.9)] transition-transform hover:scale-105">
                    <Play size={22} className="translate-x-[2px] fill-current" aria-hidden="true" />
                  </span>
                </button>
                {entry && (
                  <div className="absolute inset-x-4 bottom-4">
                    <ProgressRail value={percent} complete={percent >= 92} />
                    <div className="mt-2 flex items-center justify-between text-[11.5px] text-white/60">
                      <span className="num">
                        {entryEpisode ? `S${entryEpisode.season} E${entryEpisode.number} · ` : ""}
                        {formatTimecode(entry.position)} / {formatTimecode(entry.duration)}
                      </span>
                      <span className="num">{Math.round(percent)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <section aria-labelledby="about-heading" className="mt-8">
              <h2 id="about-heading" className="font-display text-xl text-text">
                {t("synopsis")}
              </h2>
              <p className="mt-2.5 max-w-2xl text-pretty text-[14px] leading-relaxed text-muted">
                {title.synopsis}
              </p>
              {interpreter && (
                <p className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] text-white/40">
                  {t("voicedBy")}
                  <Link
                    to={`/interpreters/${interpreter.slug}`}
                    className="inline-flex items-center gap-2 font-medium text-brand-200 transition hover:text-brand-100"
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-brand-500/20 text-[10px] font-bold text-brand-100">
                      {interpreter.name.charAt(0)}
                    </span>
                    {interpreter.name}
                  </Link>
                </p>
              )}
            </section>

            {series && <EpisodeList series={series} progress={stored} />}

            <section aria-labelledby="related-heading" className="mt-12">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="related-heading" className="font-display text-xl text-text">
                  {t("moreInCategory")}
                </h2>
                <Link
                  to={`/category/${categories[0]?.slug ?? "action"}`}
                  className="text-[12.5px] font-medium text-brand-200 hover:text-brand-100"
                >
                  {categories[0]?.name ?? "Browse"}
                </Link>
              </div>
              <MediaRail label={t("relatedTitles")} className="mt-4">
                {related.map((item) => (
                  <div key={item.id} className="w-[240px] shrink-0 snap-start">
                    <TitleCard title={item} />
                  </div>
                ))}
              </MediaRail>
            </section>
          </div>

          <aside className="space-y-5">
            {interpreter && (
              <Link
                to={`/interpreters/${interpreter.slug}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-ink-850 p-4 transition hover:border-brand-400/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-500/20 font-display text-[15px] font-bold text-brand-100 ring-1 ring-inset ring-white/10">
                  {interpreter.name.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-semibold uppercase tracking-[0.13em] text-white/35">
                    {t("interpreterLabel")}
                  </span>
                  <span className="block truncate text-[14px] font-medium text-text">{interpreter.name}</span>
                  <span className="block text-[11.5px] text-white/40">{interpreter.role}</span>
                </span>
              </Link>
            )}

            <div className="rounded-xl border border-white/[0.07] bg-ink-850 p-4">
              <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">
                {t("titleDetails")}
              </h2>
              <dl className="mt-3 space-y-2.5 text-[12.5px]">
                <Fact label={t("released")} value={formatDate(title.releasedAt)} />
                <Fact
                  label={isSeries(title) ? t("seasons") : t("runtime")}
                  value={
                    isSeries(title)
                      ? `${title.seasons.length} · ${totalEpisodes(title)} episodes`
                      : formatRuntime(title.runtime)
                  }
                />
                <Fact label={t("genre")} value={title.genre} />
                <Fact label={t("audio")} value="Kinyarwanda" />
                <Fact label={t("subtitlesLabel")} value={title.subtitles.join(", ")} />
                <Fact label={t("quality")} value={title.quality} />
                <Fact label={t("views")} value={`${formatViews(title.views)}`} />
              </dl>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-ink-850 p-4">
              <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Categories
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="rounded-md border border-white/10 px-2.5 py-1.5 text-[12px] text-white/65 transition hover:border-brand-400/50 hover:text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {title.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-white/35">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-white/35">{label}</dt>
      <dd className="num text-right text-white/75">{value}</dd>
    </div>
  );
}
