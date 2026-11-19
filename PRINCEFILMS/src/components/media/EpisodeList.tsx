import { Check, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allEpisodes, type Episode, type SeriesTitle } from "@/data/catalog";
import { formatTimecode, progressPercent } from "@/lib/format";
import type { WatchProgress } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { ProgressRail } from "@/components/ui/ProgressRail";

export function EpisodeList({
  series,
  progress,
}: {
  series: SeriesTitle;
  progress?: WatchProgress;
}) {
  const { play } = usePlayer();
  const episodes = useMemo(() => allEpisodes(series), [series]);

  const initialSeason = useMemo(() => {
    if (progress?.episodeId) {
      const current = episodes.find((episode) => episode.id === progress.episodeId);
      if (current) return current.season;
    }
    return series.seasons[0]?.number ?? 1;
  }, [episodes, progress?.episodeId, series.seasons]);

  const [season, setSeason] = useState(initialSeason);
  useEffect(() => setSeason(initialSeason), [initialSeason]);

  const seasonEpisodes = episodes.filter((episode) => episode.season === season);

  return (
    <section aria-labelledby="episodes-heading" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="episodes-heading" className="font-display text-xl text-text">
            Episodes
          </h2>
          <p className="mt-1 text-[12.5px] text-white/40">
            {episodes.length} episodes across {series.seasons.length} seasons
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Season"
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-ink-850 p-1"
        >
          {series.seasons.map((item) => (
            <button
              key={item.number}
              type="button"
              role="tab"
              aria-selected={season === item.number}
              onClick={() => setSeason(item.number)}
              className={
                season === item.number
                  ? "rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-ink-950"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-white/55 hover:bg-white/5 hover:text-white"
              }
            >
              Season {item.number}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 divide-y divide-white/5 border-y border-white/5">
        {seasonEpisodes.map((episode: Episode) => {
          const isCurrent = progress?.episodeId === episode.id;
          const percent = isCurrent && progress ? progressPercent(progress.position, progress.duration) : 0;
          const watched = isCurrent && percent >= 90;

          return (
            <li key={episode.id}>
              <button
                type="button"
                onClick={() => play(series.id, episode.id)}
                className="group flex w-full items-center gap-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="w-6 shrink-0 text-center font-display text-sm text-white/35 tabular-nums">
                  {String(episode.number).padStart(2, "0")}
                </span>
                <span className="relative flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink-800">
                  <img
                    src={series.image}
                    alt=""
                    width={128}
                    height={80}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover opacity-80 group-hover:opacity-100"
                  />
                  <span className="relative flex size-6 items-center justify-center rounded-full bg-white/95 text-ink-950 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play size={10} className="fill-current" aria-hidden="true" />
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-medium text-text">{episode.title}</span>
                    {watched && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-mint-400">
                        <Check size={11} aria-hidden="true" /> Watched
                      </span>
                    )}
                    {isCurrent && !watched && (
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-brand-200">
                        In progress
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[12px] text-white/40">
                    Season {episode.season} of {series.seasons.length}
                  </span>
                  {isCurrent && !watched && (
                    <ProgressRail value={percent} className="mt-2 h-[3px] max-w-xs" label={`Episode ${episode.number} progress`} />
                  )}
                </span>

                <span className="shrink-0 text-[12px] text-white/35 tabular-nums">
                  {formatTimecode(episode.duration * 60)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
