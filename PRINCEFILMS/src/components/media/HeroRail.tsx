import {
  ChevronLeft,
  ChevronRight,
  Play,
  ArrowRight,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getInterpreterById, isSeries, type Title } from "@/data/catalog";
import { usePlayer } from "@/context/PlayerContext";
import { formatRuntime } from "@/lib/format";

interface HeroRailProps {
  titles: Title[];
}

export function HeroRail({ titles }: HeroRailProps) {
  const navigate = useNavigate();
  const { play } = usePlayer();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  const slideCount = titles.length;

  const current = useMemo(() => titles[index % slideCount], [index, titles, slideCount]);
  const interpreter = getInterpreterById(current.interpreterId);

  useEffect(() => {
    if (slideCount <= 1) return;

    const tick = () => {
      if (paused) return;
      progressRef.current += 1 / 70;
      setProgress(Math.min(progressRef.current, 1));
      if (progressRef.current >= 1) {
        progressRef.current = 0;
        setProgress(0);
        setIndex((i) => i + 1);
      }
    };

    timerRef.current = window.setInterval(tick, 100);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slideCount, paused]);

  const goTo = (next: number) => {
    setIndex(((next % slideCount) + slideCount) % slideCount);
    progressRef.current = 0;
    setProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  };

  const handlePlay = () => {
    play(current.id);
    navigate(`/${current.kind}/${current.id}`);
  };

  const categoryLabel = current.categoryIds.join(" / ");
  const isNew = new Date(current.releasedAt) > Date.now() - 30 * 86400000;

  return (
    <section
      className="relative isolate overflow-hidden rounded-[30px] border border-white/[0.10] bg-ink-900 shadow-2xl shadow-black/40"
      aria-label="Featured titles carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Background still */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 -z-10"
      >
        <img
          src={current.image}
          alt=""
          width={1600}
          height={900}
          className="size-full object-cover still-tone"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/40 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 via-ink-900/30 to-transparent" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-500/10 blur-[140px] mix-blend-screen transition-colors duration-1000"
          aria-hidden="true"
        />
      </motion.div>

      {/* Auto-advance progress bar */}
      {slideCount > 1 && (
        <div
          className="absolute top-0 left-0 size-full h-[3px] z-40 bg-white/[0.08]"
          style={{ transformOrigin: "left center", transform: `scaleX(${progress})` }}
        >
          <div className="size-full bg-brand-500 shadow-[0_0_10px_rgba(123,44,191,0.6)]" />
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 min-h-[480px] lg:min-h-[620px] flex items-end px-6 pb-10 pt-20 sm:px-8 sm:pb-14 lg:px-12 lg:pt-28 lg:pb-18">
        <div className="max-w-3xl">
          {slideCount > 1 && (
            <div className="flex items-center gap-2 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-100">
                Now streaming
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white/60">
            {isNew && (
              <span className="rounded bg-brand-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_0_12px_rgba(123,44,191,0.8)]">
                New
              </span>
            )}
            <span className="rounded bg-brand-600/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-100 ring-1 ring-inset ring-brand-400/35">
              {isSeries(current) ? "Series" : "Film"}
            </span>
            <span className="num font-mono text-white">{current.year}</span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span className="num font-mono text-white">
              {isSeries(current) ? `${current.seasons.length} seasons` : formatRuntime(current.runtime)}
            </span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span className="text-white">{categoryLabel}</span>
            <div className="flex items-center gap-1 text-white">
              <Star size={12} className="text-yellow-400" />
              <span className="font-semibold">{current.rating}</span>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-5 font-display text-[40px] leading-[0.92] tracking-[-0.04em] text-white sm:text-[56px] lg:text-[72px] drop-shadow-[0_20px_40px_black]"
          >
            {current.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-6 max-w-[48ch] text-pretty text-[15px] leading-relaxed text-white/75 sm:text-[16px] drop-shadow-[0_10px_20px_black]"
          >
            {current.synopsis}
          </motion.p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePlay}
              className="relative inline-flex h-13 items-center justify-center gap-3 rounded-2xl bg-white px-6 text-ink-950 font-bold shadow-[0_0_0_0_rgba(255,255,255,0.4)] transition-all hover:bg-brand-50 hover:text-ink-950 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
            >
              <Play size={17} className="fill-current translate-x-[1px]" aria-hidden="true" />
              <span className="tracking-wider">
                {isSeries(current) ? "Play episode 1" : "Play film"}
              </span>
            </button>
            <Link
              to={`/${current.kind}/${current.id}`}
              className="relative inline-flex h-13 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-[13px] font-medium text-white/90 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white hover:scale-[1.02] active:scale-95 backdrop-blur-sm"
            >
              More info <ArrowRight size={15} className="text-white" aria-hidden="true" />
            </Link>
          </div>

          {interpreter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-10 inline-flex items-center gap-3"
            >
                <img
                  src={interpreter.avatar}
                  alt={interpreter.name}
                  className="size-10 rounded-full object-cover ring-1 ring-inset ring-white/20"
                />
              <div className="text-left">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  Voiced by
                </span>
                <Link
                  to={`/interpreters/${interpreter.slug}`}
                  className="block text-[14px] font-bold text-white transition hover:text-brand-300"
                >
                  {interpreter.name}
                </Link>
              </div>
              <ArrowRight size={13} className="text-white/40 shrink-0 transition hover:text-brand-300" aria-hidden="true" />
            </motion.div>
          )}
        </div>

        {/* Navigation arrows */}
        {slideCount > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label="Previous featured title"
              className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 backdrop-blur-md border border-white/5"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              aria-label="Next featured title"
              className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 backdrop-blur-md border border-white/5"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}

        {/* Dots */}
        {slideCount > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-3">
            {titles.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                aria-label={`Go to slide ${i + 1}`}
                aria-pressed={i === index}
                className={`relative w-2.5 h-2.5 rounded-full transition-all duration-500 ease-out ${
                  i === index
                    ? "bg-brand-500 w-8 shadow-[0_0_14px_rgba(123,44,191,0.7)]"
                    : "bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
