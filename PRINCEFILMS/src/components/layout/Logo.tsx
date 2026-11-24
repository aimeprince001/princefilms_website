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
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#102a56] via-[#071426] to-black ring-1 ring-inset ring-[#22d3ee]/55 shadow-[0_5px_18px_rgba(0,0,0,.35)]">
        <svg viewBox="0 0 40 40" width="31" height="31" aria-hidden="true">
          <defs>
            <linearGradient id="princefilms-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cffafe" />
              <stop offset="48%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M11 13 15 17 20 10 25 17 29 13 27 23H13Z" fill="url(#princefilms-metal)" stroke="#cffafe" strokeWidth=".7" />
          <circle cx="11" cy="12" r="1.7" fill="#cffafe" />
          <circle cx="20" cy="9" r="1.7" fill="#cffafe" />
          <circle cx="29" cy="12" r="1.7" fill="#cffafe" />
          <path d="M12 25H28V29H12Z" fill="url(#princefilms-metal)" />
          <path d="M12 25V33H16V29H22C27 29 29 26 29 22C29 18 26 16 22 16H12V25ZM16 20H21.5C23.5 20 24.5 21 24.5 22.5S23.5 25 21.5 25H16Z" fill="url(#princefilms-metal)" fillRule="evenodd" />
          <g fill="#151821">
            <rect x="7" y="15" width="2" height="3" rx=".4" />
            <rect x="7" y="21" width="2" height="3" rx=".4" />
            <rect x="7" y="27" width="2" height="3" rx=".4" />
            <rect x="31" y="15" width="2" height="3" rx=".4" />
            <rect x="31" y="21" width="2" height="3" rx=".4" />
            <rect x="31" y="27" width="2" height="3" rx=".4" />
          </g>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[16.5px] font-extrabold tracking-[-0.035em] text-transparent bg-clip-text bg-gradient-to-r from-[#cffafe] via-[#22d3ee] to-[#67e8f9]">
          PRINCEFILMS
        </span>
        <span className="mt-[5px] text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
          Kinyarwanda Streaming
        </span>
      </span>
    </Link>
  );
}
