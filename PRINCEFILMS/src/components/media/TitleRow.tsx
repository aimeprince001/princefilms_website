import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import {
  getInterpreterById,
  isSeries,
  totalEpisodes,
  type Title,
} from "@/data/catalog";
import { formatRuntime, formatViews, progressPercent } from "@/lib/format";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { cn } from "@/lib/cn";
import { Rating } from "@/components/ui/Rating";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { SaveButton } from "@/components/ui/SaveButton";
import { useLanguage } from "@/context/LanguageContext";

/**
 * The catalogue's primary record: a horizontal media row rather than a card
 * grid, so interpreter, format, runtime and views stay in readable columns.
 */
export function TitleRow({ title, className }: { title: Title; className?: string }) {
  const { t } = useLanguage();
  const interpreter = getInterpreterById(title.interpreterId);
  const { progressFor } = useLibrary();
  const { play } = usePlayer();

  const entry = progressFor(title.id);
  const percent = entry ? progressPercent(entry.position, entry.duration) : 0;
  const href = `/${title.kind}/${title.id}`;
  const series = isSeries(title) ? title : null;

  return (
    <article
      className={cn(
        "group relative grid grid-cols-[88px_1fr_auto] items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.035] sm:grid-cols-[132px_1fr_auto] sm:gap-5 sm:px-3",
        className,
      )}
    >
      <div className="relative aspect-16/10 overflow-hidden rounded-lg bg-ink-800">
        <img
          src={title.image}
          alt={`${title.title} — still, photo by ${title.imageCredit}`}
          width={320}
          height={200}
          loading="lazy"
          decoding="async"
          className="size-full object-cover still-tone transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" aria-hidden="true" />
        <button
          type="button"
          onClick={() => play(title.id)}
          aria-label={`Play ${title.title}`}
          className="absolute inset-0 z-10 grid place-items-center bg-ink-950/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-ink-950">
            <Play size={12} className="translate-x-[1px] fill-current" aria-hidden="true" />
          </span>
        </button>
        {entry && (
          <ProgressRail
            value={percent}
            className="absolute inset-x-0 bottom-0 h-[3px] rounded-none bg-white/25"
            label={`${title.title} progress`}
          />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h3 className="font-display text-[15px] leading-tight text-text">
            <Link to={href} className="after:absolute after:inset-0 after:content-[''] hover:text-brand-200">
              {title.title}
            </Link>
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/35">
            {series ? t("seriesLabel") : t("filmLabel")}
          </span>
        </div>

        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] text-white/45">
          <Link
            to={`/interpreters/${interpreter?.slug ?? ""}`}
            className="relative z-10 text-muted transition-colors hover:text-brand-200"
          >
            {interpreter?.name ?? t("interpreterLabel")}
          </Link>
          <span aria-hidden="true" className="text-white/20">
            /
          </span>
          <span>{title.genre}</span>
          <span aria-hidden="true" className="text-white/20">
            /
          </span>
          <span className="num">{title.year}</span>
          <span aria-hidden="true" className="text-white/20">
            /
          </span>
          <span className="num">
            {isSeries(title)
              ? `${title.seasons.length} ${t("seasons")} · ${totalEpisodes(title)} ${t("eps")}`
              : formatRuntime(title.runtime)}
          </span>
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <Rating value={title.rating} votes={title.votes} />
          <span className="num text-[11.5px] text-white/35">{formatViews(title.views)} views</span>
          {entry && (
            <span className="text-[11.5px] text-brand-200">
              {percent >= 92 ? t("finished") : `${Math.round(percent)}${t("watchedPercent")}`}
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-1.5">
        <SaveButton titleId={title.id} title={title.title} className="hidden sm:inline-flex" />
        <Link
          to={href}
          className="hidden h-9 items-center rounded-lg border border-white/10 px-3 text-[12.5px] font-medium text-white/70 transition-colors hover:border-brand-400/60 hover:text-white md:inline-flex"
        >
          {t("details")}
        </Link>
      </div>
    </article>
  );
}
