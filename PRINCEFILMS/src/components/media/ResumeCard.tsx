import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { isSeries, totalEpisodes, type Title } from "@/data/catalog";
import type { WatchProgress } from "@/context/LibraryContext";
import { formatTimecode, progressPercent } from "@/lib/format";
import { usePlayer } from "@/context/PlayerContext";
import { ProgressRail } from "@/components/ui/ProgressRail";

/** Continue-watching entry: the position rail is real data, not decoration. */
export function ResumeCard({
  title,
  progress,
  variant = "wide",
}: {
  title: Title;
  progress: WatchProgress;
  variant?: "wide" | "tile";
}) {
  const { play } = usePlayer();
  const series = isSeries(title) ? title : null;
  const episode = series?.seasons
    .flatMap((season) => season.episodes)
    .find((candidate) => candidate.id === progress.episodeId);
  const percent = progressPercent(progress.position, progress.duration);
  const finished = percent >= 92;
  const href = `/${title.kind}/${title.id}`;
  const remaining = Math.max(0, progress.duration - progress.position);

  return (
    <article
      className={
        variant === "wide"
          ? "group relative w-[300px] shrink-0 snap-start sm:w-[340px]"
          : "group relative w-full"
      }
    >
      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-ink-800">
        <div className="relative aspect-16/9 overflow-hidden">
          <img
            src={title.image}
            alt={`${title.title} — still, photo by ${title.imageCredit}`}
            width={680}
            height={383}
            loading="lazy"
            decoding="async"
            className="size-full object-cover still-tone transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" aria-hidden="true" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-200">
            {episode ? `S${episode.season} E${episode.number}` : "Film"}
          </p>
          <h3 className="mt-0.5 font-display text-[15px] leading-snug text-white">
            <Link to={href} className="hover:text-brand-200">
              {title.title}
            </Link>
          </h3>
          <div className="mt-2.5">
            <ProgressRail value={percent} complete={finished} />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <span className="num text-[11px] text-white/50">
                {finished ? "Finished" : `${formatTimecode(progress.position)} / ${formatTimecode(progress.duration)}`}
              </span>
              <span className="num text-[11px] text-white/35">
                {finished ? "Completed" : `${formatTimecode(remaining)} left`}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => play(title.id, progress.episodeId)}
            className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[12.5px] font-semibold text-ink-950 transition hover:bg-brand-100"
          >
            <Play size={12} className="fill-current" aria-hidden="true" />
            {finished ? "Play again" : "Resume"}
          </button>
        </div>
      </div>
      <p className="mt-2 text-[12px] text-white/40">
        {series ? `Series · ${totalEpisodes(series)} episodes` : `Film · ${title.genre}`}
      </p>
    </article>
  );
}
