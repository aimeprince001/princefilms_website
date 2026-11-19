import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import {
  getInterpreterById,
  isSeries,
  totalEpisodes,
  type Title,
} from "@/data/catalog";
import { formatRuntime, progressPercent } from "@/lib/format";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { TONE_STYLES } from "@/lib/tones";
import { cn } from "@/lib/cn";
import { SaveButton } from "@/components/ui/SaveButton";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { Rating } from "@/components/ui/Rating";

export function TitleCard({ title, className }: { title: Title; className?: string }) {
  const interpreter = getInterpreterById(title.interpreterId);
  const { progressFor } = useLibrary();
  const { play } = usePlayer();

  const entry = progressFor(title.id);
  const percent = entry ? progressPercent(entry.position, entry.duration) : 0;
  const href = `/${title.kind}/${title.id}`;
  const series = isSeries(title) ? title : null;
  const tone = TONE_STYLES[title.tone];

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/[0.07] bg-ink-800 transition-colors duration-300",
          "group-hover:border-white/15",
        )}
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <img
            src={title.image}
            alt={`${title.title} — still, photo by ${title.imageCredit}`}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="size-full object-cover still-tone transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-t", tone.wash)} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" aria-hidden="true" />
        </div>

        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
          <span className="rounded-md bg-ink-950/70 px-1.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-sm">
            {series ? "Series" : title.quality}
          </span>
          {series && (
            <span className="rounded-md bg-ink-950/70 px-1.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70 backdrop-blur-sm">
              {totalEpisodes(series)} ep
            </span>
          )}
        </div>

        <Link
          to={href}
          className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-brand-400"
          aria-label={`${title.title}, ${series ? "series" : "film"} from ${title.year}`}
        />

        <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex items-end justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => play(title.id)}
              className="flex size-9 items-center justify-center rounded-full bg-white/95 text-ink-950 shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand-400"
              aria-label={`Play ${title.title}`}
            >
              <Play size={14} className="translate-x-[1px] fill-current" aria-hidden="true" />
            </button>
            <Rating value={title.rating} className="rounded-md bg-ink-950/70 px-1.5 py-1 backdrop-blur-sm" />
          </div>
          <SaveButton titleId={title.id} title={title.title} />
        </div>

        {entry && (
          <div className="absolute inset-x-0 bottom-0 z-10">
            <ProgressRail value={percent} className="h-[3px] rounded-none bg-white/20" label={`${title.title} progress`} />
          </div>
        )}
      </div>

      <div className="pt-3">
        <h3 className="font-display text-[15px] leading-snug text-text">
          <Link to={href} className="transition-colors hover:text-brand-200">
            {title.title}
          </Link>
        </h3>
        <p className="mt-1 text-[12.5px] text-white/45">
          {title.year}
          <span aria-hidden="true"> · </span>
          {isSeries(title) ? `${title.seasons.length} seasons` : formatRuntime(title.runtime)}
        </p>
        <Link
          to={`/interpreters/${interpreter?.slug ?? ""}`}
          className="mt-0.5 inline-block text-[12.5px] text-muted transition-colors hover:text-brand-200"
        >
          {interpreter?.name ?? "Interpreter"}
        </Link>
      </div>
    </article>
  );
}
