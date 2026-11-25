import { ArrowLeft, Download, Film, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getTitleById, getInterpreterById } from "@/data/catalog";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function DownloadPage() {
  const { id } = useParams<{ id: string }>();
  const title = getTitleById(id);
  const interpreter = title ? getInterpreterById(title.interpreterId) : undefined;
  useDocumentTitle(title ? `Download ${title.title}` : "Download unavailable");
  if (!title) return <section className="page-shell py-16"><h1 className="font-display text-2xl">Film not found</h1><Link to="/movies" className="mt-4 inline-flex text-cyan-200">Browse films</Link></section>;

  return <section className="page-shell py-8 sm:py-12">
    <Link to={`/${title.kind}/${title.id}`} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-cyan-100"><ArrowLeft size={15}/> Back to film details</Link>
    <div className="panel mx-auto mt-6 grid max-w-4xl overflow-hidden md:grid-cols-[220px_1fr]">
      <div className="relative min-h-[260px]"><img src={title.image} alt={title.title} className="absolute inset-0 size-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent md:bg-gradient-to-r"/></div>
      <div className="flex flex-col justify-center p-6 sm:p-9">
        <p className="text-[10px] font-bold uppercase tracking-[.22em] text-cyan-200">PRINCEFILMS · DOWNLOAD CENTER</p>
        <h1 className="mt-2 font-display text-3xl">{title.title}</h1>
        <p className="mt-2 text-sm text-white/45">{title.year} · {title.quality} · {interpreter?.name ?? "Kinyarwanda"}</p>
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-cyan-200/10 bg-cyan-400/[.04] p-4"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-cyan-200"/><p className="text-xs leading-relaxed text-white/55">Download availability depends on the film's hosting provider and the rights granted by its owner. Use the download only when it is available and authorized.</p></div>
        {title.downloadUrl ? <a href={title.downloadUrl} download target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"><Download size={17}/> Download film file</a> : <p className="mt-6 rounded-xl border border-amber-300/15 bg-amber-300/5 p-4 text-sm text-amber-100/80">A downloadable file has not been provided for this title yet.</p>}
        <p className="mt-3 text-xs text-white/35">If the file opens in a new tab, use your browser's download control.</p>
        <Link to={`/watch/${title.id}`} className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-100 hover:text-white"><Film size={15}/> Watch this film instead</Link>
      </div>
    </div>
  </section>;
}
