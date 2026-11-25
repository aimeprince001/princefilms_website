import { ArrowLeft, Download, Film, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getTitleById, isSeries } from "@/data/catalog";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const title = getTitleById(id);
  useDocumentTitle(title ? `Watch ${title.title} · PRINCEFILMS` : "Watch · PRINCEFILMS");
  if (!title) return <div className="page-shell py-16"><h1 className="text-2xl">Film not found</h1><Link className="mt-4 inline-flex text-cyan-200" to="/movies">Browse films</Link></div>;
  const trailerSearch = encodeURIComponent(`${title.title} official trailer`);
  const video = isSeries(title) ? title.seasons[0]?.episodes[0]?.videoUrl || title.videoUrl : title.videoUrl;
  return <div className="page-shell py-7 pb-16">
    <Link to={`/${title.kind}/${title.id}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-100"><ArrowLeft size={15}/> Back to title</Link>
    <header className="mb-6"><p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-200">PRINCEFILMS · CINEMA</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title.title}</h1><p className="mt-2 text-sm text-slate-400">{title.year} · {title.quality} · {title.genre}</p></header>
    <section className="pf-cinema-panel overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 p-4 sm:p-5"><h2 className="flex items-center gap-2 text-lg font-semibold"><Film size={18} className="text-cyan-200"/> 1. Official trailer</h2><p className="mt-1 text-sm text-slate-400">Watch the trailer first, then start the full film below.</p></div>
      <div className="aspect-video bg-black"><iframe title={`${title.title} trailer search`} src={`https://www.youtube.com/embed?listType=search&list=${trailerSearch}`} className="size-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>
    </section>
    <section className="pf-cinema-panel mt-6 overflow-hidden rounded-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:p-5"><div><h2 className="flex items-center gap-2 text-lg font-semibold"><Play size={18} className="fill-current text-cyan-200"/> 2. Play full {isSeries(title)?"episode":"film"}</h2><p className="mt-1 text-sm text-slate-400">{title.title} · {title.quality}</p></div><Link to={`/download/${title.id}`} className="pf-cinema-action inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-cyan-100"><Download size={15}/> Download</Link></div>
      <div className="aspect-video bg-black"><video className="size-full" controls playsInline preload="metadata" poster={title.image}><source src={video} type="video/mp4"/>Your browser does not support HTML video. <a href={video}>Open video file</a>.</video></div>
    </section>
    <p className="mt-4 text-xs text-slate-500">Playback uses the media source configured for this title. Availability and downloadable access depend on the source provider.</p>
  </div>;
}