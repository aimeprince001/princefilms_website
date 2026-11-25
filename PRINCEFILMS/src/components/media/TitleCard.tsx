import { Link } from "react-router-dom";
import {
  Play,
  Clock,
  Film,
  Tv,
  Star,
  Eye,
  Download,
} from "lucide-react";
import {
  getInterpreterById,
  isSeries,
  totalEpisodes,
  type Title,
} from "@/data/catalog";
import { formatRuntime, formatViews, progressPercent } from "@/lib/format";
import { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { TONE_STYLES } from "@/lib/tones";
import { cn } from "@/lib/cn";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { useLanguage } from "@/context/LanguageContext";

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * The catalogue's poster card. Used in grids, rails and the player's related
 * shelf, so it sizes from its container and never assumes a fixed width.
 */
export function TitleCard({ title, className }: { title: Title; className?: string }) {
  const { t } = useLanguage();
  const interpreter = getInterpreterById(title.interpreterId);
  const { progressFor } = useLibrary();
  const [imageLoaded, setImageLoaded] = useState(false);

  const entry = progressFor(title.id);
  const percent = entry ? progressPercent(entry.position, entry.duration) : 0;
  const href = `/${title.kind}/${title.id}`;
  const series = isSeries(title) ? title : null;
  const tone = TONE_STYLES[title.tone];
  const releaseTime = new Date(title.releasedAt).getTime();
  const age = Date.now() - releaseTime;
  const isNew = Number.isFinite(releaseTime) && age >= 0 && age < NEW_WINDOW_MS;
  const started = Boolean(entry) && percent > 0;

  return (
    <article
      className={cn("group relative flex h-full flex-col", className)}
      aria-label={`${title.title}, ${series ? t("seriesLabel") : t("filmLabel")} from ${title.year}`}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/[0.06] bg-ink-800/60 backdrop-blur-sm transition-all duration-500",
          "group-hover:border-white/15 group-hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)]",
        )}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <div
            className={cn("absolute inset-0 opacity-60 blur-2xl", tone.glow)}
            aria-hidden="true"
          />
          {!imageLoaded && <div className="pf-skeleton absolute inset-0 z-[1]" aria-hidden="true" />}
          <img
            src={title.image}
            alt={`${title.title} — still, photo by ${title.imageCredit}`}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={cn("relative size-full object-cover still-tone transition-[opacity,transform] duration-1000 ease-out group-hover:scale-[1.05]", imageLoaded ? "opacity-100" : "opacity-0")}
          />
          <div
            className={cn("absolute inset-0 bg-gradient-to-t", tone.wash)}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent"
            aria-hidden="true"
          />

          {/* Top badges */}
          <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              {isNew && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-300/35 bg-gradient-to-r from-cyan-400/95 to-brand-500 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_0_16px_rgba(34,211,238,0.35)]">
                  {t("new")}
                </span>
              )}
            </div>
            {series && (
              <span className="w-fit rounded-md border border-white/10 bg-ink-950/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80 backdrop-blur-md">
                {series.seasons.length} {series.seasons.length === 1 ? t("season") : t("seasons")} ·{" "}
                {totalEpisodes(series)} {t("eps")}
              </span>
            )}
          </div>

          {/* Whole-card link target */}
          <Link
            to={href}
            className="absolute inset-0 z-30 rounded-[20px] focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none"
            aria-label={`${t("details")}: ${title.title}`}
          />

          {/* Play */}
          <Link
            to={`/watch/${title.id}`}
            className="absolute bottom-3 right-3 z-40 flex size-11 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white focus-visible:ring-2 focus-visible:ring-cyan-200"
            aria-label={`Play ${title.title}`}
          >
            <Play size={17} className="translate-x-[1px] fill-current" aria-hidden="true" />
          </Link>

          {started && (
            <ProgressRail
              value={percent}
              complete={percent >= 92}
              className="absolute inset-x-0 bottom-0 z-40 h-[3px] rounded-none bg-white/20"
              label={`${title.title} progress`}
            />
          )}
        </div>

        {/* Info panel */}
        <div className="flex flex-1 flex-col gap-2.5 bg-gradient-to-b from-slate-950/30 to-slate-950 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 font-display text-[14.5px] leading-snug text-text">
              <Link to={href} className="transition-colors hover:text-brand-200">
                <span className="line-clamp-2">{title.title}</span>
              </Link>
            </h3>
            <span
              className={cn(
                "mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em]",
                tone.line,
                tone.text,
              )}
            >
              {series ? t("seriesLabel") : t("filmLabel")}
            </span>
          </div>

          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-white/45">
            <span className="num">{title.year}</span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              {isSeries(title) ? (
                <Tv size={10} aria-hidden="true" />
              ) : (
                <Film size={10} aria-hidden="true" />
              )}
              <span className="num">
                {isSeries(title)
                  ? `${totalEpisodes(title)} ${t("eps")}`
                  : formatRuntime(title.runtime)}
              </span>
            </span>
            <span aria-hidden="true" className="text-white/20">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <Star
                size={10}
                className="fill-gold-400 text-gold-400"
                aria-hidden="true"
              />
              <span className="num font-semibold text-gold-300">
                {title.rating.toFixed(1)}
              </span>
            </span>
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 pt-0.5">
            <Link
              to={`/interpreters/${interpreter?.slug ?? ""}`}
              className="relative z-40 min-w-0 truncate text-[11.5px] text-muted transition-colors hover:text-brand-200"
            >
              {interpreter?.name ?? t("interpreterLabel")}
            </Link>
            <span className="num inline-flex shrink-0 items-center gap-1 text-[11px] text-white/30">
              <Eye size={10} aria-hidden="true" />
              {formatViews(title.views)}
            </span>
          </div>

          <div className="mt-1 grid grid-cols-2 gap-2">
            <Link to={`/watch/${title.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-300 px-2 py-2 text-[11px] font-bold text-slate-950 transition hover:bg-white"><Play size={12} className="fill-current"/> Play</Link>
            <Link to={`/download/${title.id}`} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-200/20 bg-white/[0.04] px-2 py-2 text-[11px] font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/10"><Download size={12}/> Download</Link>
          </div>
          {started && (
            <p className="flex items-center gap-1.5 text-[11px] text-brand-200">
              <Clock size={10} aria-hidden="true" />
              {percent >= 92 ? t("finished") : `${Math.round(percent)}${t("watchedPercent")}`}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
