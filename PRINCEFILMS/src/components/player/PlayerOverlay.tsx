import { ArrowLeft, Check, ListVideo, Play, X, Download, Youtube, Mic, Languages } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getEpisode,
  INTERPRETERS,
  getInterpreterById,
  getTitleById,
  isSeries,
  nextEpisode,
  relatedTitles,
} from "@/data/catalog";
import { useLibrary } from "@/context/LibraryContext";
import { usePlayer } from "@/context/PlayerContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { formatTimecode, progressPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { MediaRail } from "@/components/media/MediaRail";
import { TitleCard } from "@/components/media/TitleCard";

/**
 * Player chrome around the native video element: native controls keep
 * scrubbing, captions and fullscreen reliable, while the overlay owns resume
 * position, keyboard shortcuts, progress persistence and the episode queue.
 */
export function PlayerOverlay() {
  const { session, close, play } = usePlayer();
  const { progressFor, saveProgress } = useLibrary();

  const title = session ? getTitleById(session.titleId) : undefined;
  const series = title && isSeries(title) ? title : undefined;
  const episode = series ? getEpisode(series, session?.episodeId) : undefined;
  const interpreter = title ? getInterpreterById(title.interpreterId) : undefined;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [ended, setFailedEnded] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [season, setSeason] = useState(1);
  const [trailerInterpreterId, setTrailerInterpreterId] = useState("");
  const [trailerLanguage, setTrailerLanguage] = useState("Kinyarwanda");

  const source = episode?.videoUrl ?? title?.videoUrl ?? "";
  const sessionKey = `${session?.titleId ?? "none"}-${episode?.id ?? "film"}`;
  const upNext = series && episode ? nextEpisode(series, episode.id) : undefined;
  const stored = title ? progressFor(title.id) : undefined;
  const related = useMemo(() => (title ? relatedTitles(title, 8) : []), [title]);
  const trailerQuery = title ? encodeURIComponent(`${title.title} official trailer`) : "";
  const selectedTrailerInterpreter = getInterpreterById(trailerInterpreterId || title?.interpreterId || "");

  useLockBodyScroll(Boolean(title));

  useEffect(() => {
    if (!series) return;
    setSeason(episode?.season ?? 1);
  }, [series, episode?.season]);

  const persist = useCallback(() => {
    const video = document.querySelector<HTMLVideoElement>("[data-player-video]");
    if (!title || !video || !video.duration || Number.isNaN(video.duration)) return;
    if (video.currentTime < 1) return;
    saveProgress({
      titleId: title.id,
      episodeId: episode?.id,
      position: video.currentTime,
      duration: video.duration,
    });
  }, [title, episode?.id, saveProgress]);

  useEffect(() => {
    if (!title) return;
    const timer = window.setInterval(persist, 5000);
    return () => {
      window.clearInterval(timer);
      persist();
    };
  }, [title, persist]);

  useEffect(() => {
    if (!title) return;
    setFailed(false);
    setFailedEnded(false);

    const video = videoRef.current;
    if (!video) return;

    const resumeAt =
      stored && stored.episodeId === episode?.id && stored.position < stored.duration * 0.92
        ? stored.position
        : 0;

    const applyResume = () => {
      if (resumeAt > 2 && resumeAt < video.duration - 5) video.currentTime = resumeAt;
      void video.play().catch(() => {
        // Autoplay can be blocked; the native controls remain usable.
      });
    };

    if (video.readyState >= 1) applyResume();
    else video.addEventListener("loadedmetadata", applyResume, { once: true });

    return () => video.removeEventListener("loadedmetadata", applyResume);
    // The resume position is captured per playback session, not per progress tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  useEffect(() => {
    if (!title) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const video = videoRef.current;
      if (!video) return;
      const videoFocused = document.activeElement === video;

      switch (event.key) {
        case "Escape":
          close();
          break;
        case " ":
        case "k":
          if (videoFocused) return;
          event.preventDefault();
          if (video.paused) void video.play().catch(() => setFailed(true));
          else video.pause();
          break;
        case "ArrowRight":
          video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
          break;
        case "ArrowLeft":
          event.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          break;
        case "m":
          video.muted = !video.muted;
          break;
        case "f":
          if (document.fullscreenElement) void document.exitFullscreen();
          else void video.requestFullscreen?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [title, close]);

  const queue = useMemo(() => {
    if (!series) return [];
    return series.seasons.find((item) => item.number === season)?.episodes ?? [];
  }, [series, season]);

  if (!title) return null;

  const watchedPercent =
    stored && stored.episodeId === episode?.id ? progressPercent(stored.position, stored.duration) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Player: ${title.title}${episode ? `, season ${episode.season} episode ${episode.number}` : ""}`}
      className="fixed inset-0 z-[100] flex flex-col bg-[#050409] overflow-y-auto"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={close}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close player"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] text-white">
              {title.title}
              {episode && (
                <span className="ml-2 font-sans text-[12px] font-normal text-white/45">
                  S{episode.season} E{episode.number} · {episode.title}
                </span>
              )}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-[11.5px] text-white/40">
              <Link
                to={`/interpreters/${interpreter?.slug ?? ""}`}
                className="transition-colors hover:text-brand-200"
              >
                {interpreter?.name}
              </Link>
              <span aria-hidden="true">/</span>
              <span>Kinyarwanda audio</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {series && (
            <button
              type="button"
              onClick={() => setQueueOpen((open) => !open)}
              aria-expanded={queueOpen}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[12.5px] font-medium text-white/70 transition hover:border-white/25 hover:text-white"
            >
              <ListVideo size={15} aria-hidden="true" />
              Episodes
            </button>
          )}
        </div>
      </header>

      <div className="relative min-h-0 flex-1 flex-col bg-black overflow-y-auto">
        <img
          src={title.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-110 object-cover opacity-20 blur-2xl"
        />
        <div className="flex items-center justify-center min-h-[36vh] flex-0 pt-4">
          <video
            key={sessionKey}
            ref={videoRef}
            data-player-video
            src={source}
            controls
            playsInline
            preload="metadata"
            className="relative max-h-[52vh] w-full object-contain"
            onTimeUpdate={() => {
              const video = videoRef.current;
              if (video && video.currentTime - (video.dataset.lastReport ? Number(video.dataset.lastReport) : 0) > 15) {
                video.dataset.lastReport = String(video.currentTime);
                persist();
              }
            }}
            onEnded={() => {
              setFailedEnded(true);
              persist();
            }}
            onError={() => setFailed(true)}
          >
            Your browser cannot play this stream.
          </video>
        </div>

        {failed && (
          <div className="absolute inset-0 grid place-items-center bg-ink-950/95 p-6 text-center">
            <div className="max-w-sm">
              <h2 className="font-display text-lg text-text">This stream did not load</h2>
              <p className="mt-2 text-[13px] text-muted">
                The source may be unavailable on this connection. Check your network and try again.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFailed(false);
                  videoRef.current?.load();
                }}
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-400"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {ended && !failed && (
          <div className="absolute inset-0 grid place-items-center bg-ink-950/85 p-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 text-center">
              <Check size={20} className="mx-auto text-mint-400" aria-hidden="true" />
              <h2 className="mt-3 font-display text-lg text-text">
                {episode ? "Episode finished" : "Film finished"}
              </h2>
              <p className="mt-1.5 text-[13px] text-muted">
                {upNext
                  ? `Next: Season ${upNext.season}, episode ${upNext.number} — ${upNext.title}`
                  : "The next title is not available yet."}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                {upNext ? (
                  <button
                    type="button"
                    onClick={() => play(title.id, upNext.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-400"
                  >
                    <Play size={15} className="fill-current" aria-hidden="true" />
                    Play next episode
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={close}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-500 px-5 text-sm font-semibold text-white hover:bg-brand-400"
                  >
                    Back to catalogue
                  </button>
                )}
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {queueOpen && series && (
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-white/10 bg-ink-900/97 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="font-display text-sm text-text">Episode queue</p>
              <button
                type="button"
                onClick={() => setQueueOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close episode queue"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {series.seasons.map((item) => (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => setSeason(item.number)}
                  className={cn(
                    "shrink-0 rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold",
                    season === item.number ? "bg-white text-ink-950" : "text-white/55 hover:bg-white/5",
                  )}
                >
                  S{item.number}
                </button>
              ))}
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {queue.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => play(title.id, item.id)}
                    aria-current={item.id === episode?.id}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors",
                      item.id === episode?.id ? "bg-brand-500/15" : "hover:bg-white/5",
                    )}
                  >
                    <span className="num mt-0.5 w-5 text-center text-[12px] text-white/35">
                      {String(item.number).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-text">{item.title}</span>
                      <span className="num mt-0.5 block text-[11px] text-white/35">
                        {formatTimecode(item.duration * 60)}
                        {item.id === episode?.id && watchedPercent > 0 ? ` · ${Math.round(watchedPercent)}%` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {title && (
          <section aria-labelledby="player-trailer-heading" className="mx-auto mt-8 w-full max-w-5xl px-4 pb-8 sm:px-6">
            <div className="overflow-hidden rounded-2xl border border-brand-400/20 bg-gradient-to-br from-ink-850 via-ink-850 to-brand-900/20">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] p-4 sm:p-5">
                <div>
                  <h2 id="player-trailer-heading" className="flex items-center gap-2 font-display text-lg text-text">
                    <Youtube size={18} className="text-brand-200" aria-hidden="true" /> Trailer on YouTube
                  </h2>
                  <p className="mt-1 text-[12px] text-white/40">Find the trailer for {title.title}; confirm the official upload.</p>
                </div>
                <a href={`https://www.youtube.com/results?search_query=${trailerQuery}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-lg border border-brand-300/25 px-3 text-[12px] text-brand-100 hover:bg-brand-500/10">
                  <Youtube size={14} aria-hidden="true" /> Open YouTube
                </a>
              </div>
              <div className="aspect-video bg-black">
                <iframe title={`YouTube trailer search for ${title.title}`} src={`https://www.youtube.com/embed?listType=search&list=${trailerQuery}`} className="size-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
              </div>
              <div className="grid gap-3 border-t border-white/[0.07] p-4 sm:grid-cols-2 sm:p-5">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-[11.5px] font-semibold text-white/65"><Mic size={13} className="text-brand-200" aria-hidden="true" /> Preferred interpreter</span>
                  <select value={trailerInterpreterId || title.interpreterId} onChange={(event) => setTrailerInterpreterId(event.target.value)} className="h-10 w-full rounded-lg border border-white/10 bg-ink-900 px-3 text-[12.5px] text-text">
                    {INTERPRETERS.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-2 text-[11.5px] font-semibold text-white/65"><Languages size={13} className="text-brand-200" aria-hidden="true" /> Trailer language</span>
                  <select value={trailerLanguage} onChange={(event) => setTrailerLanguage(event.target.value)} className="h-10 w-full rounded-lg border border-white/10 bg-ink-900 px-3 text-[12.5px] text-text">
                    <option>Kinyarwanda</option><option>English</option><option>French</option><option>Swahili</option>
                  </select>
                </label>
                <p className="text-[11px] leading-relaxed text-white/35 sm:col-span-2">
                  Preference: {selectedTrailerInterpreter?.name} · {trailerLanguage}. This does not change the YouTube audio track; an actual dubbed trailer file is required for interpreter audio.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] p-4 sm:p-5">
                <button type="button" onClick={() => { const video = videoRef.current; if (video) { video.currentTime = 0; void video.play().catch(() => setFailed(true)); } }} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-[12.5px] font-semibold text-white hover:bg-brand-400">
                  <Play size={14} className="fill-current" aria-hidden="true" /> Restart full film
                </button>
                <a href={title.downloadUrl} download target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-4 text-[12.5px] font-medium text-white/75 hover:border-brand-300/35 hover:text-brand-100">
                  <Download size={14} aria-hidden="true" /> Download film
                </a>
              </div>
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="w-full flex-none border-t border-white/[0.04]">
            <h2 className="px-4 mb-3 mt-6 text-[12.5px] font-semibold uppercase tracking-wider text-white/40">
              Related films
            </h2>
            <MediaRail label="Related titles">
              {related.map((item) => (
                <div key={item.id} className="w-[252px] shrink-0 snap-start">
                  <TitleCard title={item} />
                </div>
              ))}
            </MediaRail>
          </section>
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/40">
          <span className="text-white/60">{title.title}</span>
          <span className="num">{title.year}</span>
          <span>{title.genre}</span>
          <span>{title.quality}</span>
          <span className="hidden sm:inline">Space play · ←/→ 10s · M mute · F fullscreen</span>
        </div>
        {upNext ? (
          <button
            type="button"
            onClick={() => play(title.id, upNext.id)}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[12.5px] text-white/75 hover:border-white/25 hover:text-white"
          >
            Up next: S{upNext.season} E{upNext.number}
          </button>
        ) : (
          <Link
            to={`/${title.kind}/${title.id}`}
            onClick={close}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-[12.5px] text-white/75 hover:border-white/25 hover:text-white"
          >
            Title details
          </Link>
        )}
      </footer>
    </div>
  );
}
