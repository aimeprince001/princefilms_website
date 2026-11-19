import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="PRINCEFILMS home"
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 ring-1 ring-inset ring-white/15">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path d="M8.5 5.4v13.2L19 12z" fill="currentColor" className="text-white" />
        </svg>
        <span className="absolute inset-x-0 bottom-0 h-px bg-white/25" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[16.5px] font-bold tracking-[-0.035em] text-white">
          PRINCE<span className="text-brand-300">FILMS</span>
        </span>
        <span className="mt-[5px] text-[9px] font-semibold uppercase tracking-[0.3em] text-white/30">
          Kinyarwanda
        </span>
      </span>
    </Link>
  );
}
