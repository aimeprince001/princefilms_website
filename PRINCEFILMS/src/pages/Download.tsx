import { ArrowLeft, Download, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getTitleById, isSeries } from "@/data/catalog";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const title = getTitleById(id);
  useDocumentTitle(title ? `Download ${title.title} · PRINCEFILMS` : "Download · PRINCEFILMS");
  if (!title) return <div className="page-shell py-16"><h1 className="text-2xl">Film not found</h1><Link className="mt-4 inline-flex text-cyan-200" to="/movies">Browse films</Link></div>;
  const video = isSeries(title) ? title.seasons[0]?.episodes[0]?.videoUrl || title.downloadUrl : title.downloadUrl;
  return <div className="page-shell py-10 pb-16">
    <Link to={`/${title.kind}/${title.id}`} className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-100"><ArrowLeft size={15}/> Back to title</Link>
    <section className="pf-cinema-panel mx-auto max-w-3xl overflow-hidden rounded-2xl">
      <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:p-7"><img src={title.image} alt={title.title} className="aspect-[2/3] w-full rounded-xl object-cover sm:max-w-[150px]"/><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-200">PRINCEFILMS · DOWNLOAD</p><h1 className="mt-2 text-3xl font-semibold">Download {title.title}</h1><p className="mt-2 text-sm text-slate-400">{title.year} · {title.quality} · {title.genre}</p><p className="mt-4 text-sm leading-6 text-slate-300">Use the link below to open the configured video source. Some streaming hosts play the file in a new tab instead of saving automatically; use the browser download control if available.</p>
      <a href={video} target="_blank" rel="noreferrer" className="pf-cinema-action mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-cyan-100"><Download size={16}/> Open / download video</a>
      <Link to={`/watch/${title.id}`} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:border-cyan-200/30"><Play size={15}/> Watch online</Link>
      </div></div><div className="border-t border-white/10 bg-black/20 p-4 text-xs text-slate-500">Please respect the film’s distribution rights and the hosting provider’s download rules.</div>
    </section>
  </div>;
}