import { ArrowLeft, Download, Film, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getEpisode, getTitleById, getInterpreterById, isSeries } from "@/data/catalog";
import { useLibrary } from "@/context/LibraryContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const title = getTitleById(id);
  const interpreter = title ? getInterpreterById(title.interpreterId) : undefined;
  const episode = title && isSeries(title) ? title.seasons[0]?.episodes[0] : undefined;
  const source = episode?.videoUrl ?? title?.videoUrl ?? "";
  const { progressFor, saveProgress } = useLibrary();
  useDocumentTitle(title ? `Watch ${title.title}` : "Film not found");

  if (!title) return <section className="page-shell py-16"><h1 className="font-display text-2xl">Film not found</h1><Link to="/movies" className="mt-4 inline-flex text-cyan-200">Browse films</Link></section>;

  return <section className="page-shell py-8">
    <Link to={`/${title.kind}/${title.id}`} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-cyan-100"><ArrowLeft size={15}/> Back to film details</Link>
    <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-200">PRINCEFILMS · NOW PLAYING</p><h1 className="mt-2 font-display text-3xl sm:text-4xl">{title.title}</h1><p className="mt-2 text-sm text-white/45">{title.year} · {title.quality} · {interpreter?.name ?? "Kinyarwanda audio"}{episode ? ` · S${episode.season} E${episode.number}` : ""}</p></div>
      <Link to={`/download/${title.id}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-200/20 bg-cyan-400/5 px-4 text-sm text-cyan-100 hover:bg-cyan-400/10"><Download size={15}/> Download options</Link>
    </header>
    <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-200/15 bg-black shadow-[0_25px_90px_-45px_rgba(34,211,238,.45)]">
      <div className="aspect-video bg-black">
        <video key={source} src={source} poster={title.image} controls autoPlay playsInline preload="metadata" className="size-full object-contain" onEnded={e=>{const v=e.currentTarget;if(v.duration>0)saveProgress({titleId:title.id,episodeId:episode?.id,position:v.currentTime,duration:v.duration});}} onTimeUpdate={e=>{const v=e.currentTarget;if(v.duration>0&&Math.floor(v.currentTime)%20===0)saveProgress({titleId:title.id,episodeId:episode?.id,position:v.currentTime,duration:v.duration});}}>
          Your browser does not support HTML5 video.
        </video>
      </div>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
      <div className="panel p-4"><p className="text-xs font-semibold uppercase tracking-wider text-cyan-100">Film information</p><p className="mt-2 text-sm leading-relaxed text-white/60">{title.synopsis}</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <Link to={`/${title.kind}/${title.id}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-white/75 hover:border-cyan-200/30"><Film size={14}/> Details</Link>
        <Link to="/movies" className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-sm font-semibold text-white"><Play size={14}/> More films</Link>
      </div>
    </div>
  </section>;
}
