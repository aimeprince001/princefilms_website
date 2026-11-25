import { Link } from "react-router-dom";
import { Play, Download, Clock, Film, Tv, Star, Eye } from "lucide-react";
import { getInterpreterById, isSeries, totalEpisodes, type Title } from "@/data/catalog";
import { formatRuntime, formatViews, progressPercent } from "@/lib/format";
import { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { TONE_STYLES } from "@/lib/tones";
import { cn } from "@/lib/cn";
import { ProgressRail } from "@/components/ui/ProgressRail";
import { useLanguage } from "@/context/LanguageContext";

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

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
    <article className={cn("group relative flex h-full flex-col", className)} aria-label={`${title.title}, ${series ? t("seriesLabel") : t("filmLabel")} from ${title.year}`}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-cyan-300/[0.10] bg-gradient-to-b from-[#10213b]/90 via-ink-800/90 to-[#050b18] shadow-[0_18px_50px_-35px_rgba(34,211,238,.5)] backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-200/30 group-hover:shadow-[0_24px_55px_-28px_rgba(37,99,235,.45)]">
        <div className="relative aspect-[2/3] overflow-hidden">
          <div className={cn("absolute inset-0 opacity-60 blur-2xl", tone.glow)} aria-hidden="true" />
          {!imageLoaded && <div className="pf-skeleton absolute inset-0 z-[1]" aria-hidden="true" />}
          <img src={title.image} alt={title.title} width={640} height={960} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} className={cn("relative size-full object-cover still-tone transition-[opacity,transform] duration-700 group-hover:scale-[1.06]", imageLoaded ? "opacity-100" : "opacity-0")} />
          <div className={cn("absolute inset-0 bg-gradient-to-t", tone.wash)} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/10 to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
            {isNew ? <span className="rounded-full border border-cyan-300/30 bg-cyan-400/15 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.15em] text-cyan-100 backdrop-blur-md">{t("new")}</span> : <span />}
            <span className="rounded-md border border-cyan-200/25 bg-slate-950/75 px-2 py-1 text-[10px] font-bold tracking-wider text-cyan-100">{title.quality}</span>
          </div>
          {series && <span className="absolute left-3 top-12 rounded-md border border-white/10 bg-slate-950/75 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md">{series.seasons.length} {t("season")} · {totalEpisodes(series)} {t("eps")}</span>}
          <div className="absolute inset-x-3 bottom-3 z-20 flex gap-2">
            <Link to={`/watch/${title.id}`} className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-2 text-[11px] font-bold text-white shadow-lg transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cyan-300" aria-label={`Play ${title.title}`}>
              <Play size={13} className="fill-current" /> Play
            </Link>
            <Link to={`/download/${title.id}`} className="inline-flex size-9 items-center justify-center rounded-lg border border-white/20 bg-slate-950/75 text-white/90 backdrop-blur-md transition hover:border-cyan-200/40 hover:text-cyan-100" aria-label={`Download ${title.title}`}>
              <Download size={14} />
            </Link>
          </div>
          {started && <ProgressRail value={percent} complete={percent >= 92} className="absolute inset-x-0 bottom-0 z-30 h-[3px] rounded-none bg-white/20" label={`${title.title} progress`} />}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 font-display text-[14px] leading-snug text-text"><Link to={href} className="transition-colors hover:text-cyan-100"><span className="line-clamp-2">{title.title}</span></Link></h3>
            <span className={cn("mt-0.5 shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider", tone.line, tone.text)}>{series ? t("seriesLabel") : t("filmLabel")}</span>
          </div>
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-white/45">
            <span className="num">{title.year}</span><span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">{series ? <Tv size={10}/> : <Film size={10}/>}<span className="num">{series ? `${totalEpisodes(series)} ${t("eps")}` : formatRuntime(title.runtime)}</span></span><span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1"><Star size={10} className="fill-amber-300 text-amber-300"/><span className="num font-semibold text-amber-200">{title.rating.toFixed(1)}</span></span>
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <Link to={`/interpreters/${interpreter?.slug ?? ""}`} className="min-w-0 truncate text-[11px] text-muted transition-colors hover:text-cyan-100">{interpreter?.name ?? t("interpreterLabel")}</Link>
            <span className="num inline-flex shrink-0 items-center gap-1 text-[10px] text-white/30"><Eye size={10}/>{formatViews(title.views)}</span>
          </div>
          {started && <p className="flex items-center gap-1.5 text-[10px] text-cyan-100"><Clock size={10}/>{percent >= 92 ? t("finished") : `${Math.round(percent)}${t("watchedPercent")}`}</p>}
        </div>
      </div>
    </article>
  );
}
