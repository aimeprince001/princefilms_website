import { Bookmark, ChevronDown, LogOut, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { useSearchOverlay } from "@/context/SearchContext";
import { buttonClass } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/movies", label: "Movies" },
  { to: "/series", label: "Series" },
  { to: "/interpreters", label: "Interpreters" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const { user, logout } = useAuth();
  const { saved } = useLibrary();
  const { openSearch } = useSearchOverlay();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-ink-950/88 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/90 to-transparent",
      )}
    >
      <div className="page-shell flex h-16 items-center justify-between gap-4 lg:h-[68px]">
        <div className="flex items-center gap-8">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-5 md:flex lg:gap-7">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative py-2 text-[13.5px] font-medium transition-colors",
                    isActive ? "text-white" : "text-white/50 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-[3px] left-0 h-[2px] rounded-full bg-brand-400 transition-all",
                        isActive ? "w-full opacity-100" : "w-0 opacity-0",
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="group flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-white/50 transition hover:border-white/20 hover:text-white lg:w-[236px]"
            aria-label="Search titles and interpreters"
          >
            <Search size={15} className="shrink-0" />
            <span className="hidden flex-1 text-left text-[13px] lg:inline">Search</span>
            <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/35 lg:inline">
              ⌘K
            </kbd>
          </button>

          <Link
            to="/my-list"
            className="relative hidden h-9 items-center gap-2 rounded-lg px-2.5 text-[13px] font-medium text-white/60 transition hover:bg-white/5 hover:text-white lg:inline-flex"
          >
            <Bookmark size={15} aria-hidden="true" />
            <span className="hidden xl:inline">My List</span>
            {saved.length > 0 && (
              <span className="num rounded bg-brand-500/25 px-1.5 py-0.5 text-[10.5px] font-semibold text-brand-200">
                {saved.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex h-9 items-center gap-2 rounded-lg pl-1 pr-1.5 transition hover:bg-white/5"
              >
                <span className="grid size-7 place-items-center rounded-full bg-brand-600/40 text-[11.5px] font-bold text-brand-100 ring-1 ring-inset ring-white/15">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <ChevronDown size={13} className="text-white/40" aria-hidden="true" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
                    event.preventDefault();
                    const items = Array.from(
                      event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
                    );
                    if (!items.length) return;
                    const index = items.indexOf(document.activeElement as HTMLElement);
                    const next =
                      event.key === "ArrowDown"
                        ? (index + 1) % items.length
                        : (index - 1 + items.length) % items.length;
                    items[next]?.focus();
                  }}
                  className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-850 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
                >
                  <div className="border-b border-white/[0.07] px-3.5 py-3">
                    <p className="truncate text-[13px] font-medium text-text">{user.name}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-white/40">{user.identifier}</p>
                  </div>
                  <Link
                    to="/my-list"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    <Bookmark size={14} aria-hidden="true" /> My List
                    <span className="num ml-auto text-[11px] text-white/35">{saved.length}</span>
                  </Link>
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    <User size={14} aria-hidden="true" /> Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    <LogOut size={14} aria-hidden="true" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/login"
                className="inline-flex h-9 items-center px-2.5 text-[13px] font-medium text-white/60 transition hover:text-white"
              >
                Sign in
              </Link>
              <Link to="/register" className={buttonClass({ size: "sm" })}>
                Join free
              </Link>
            </div>
          )}

          <Link
            to={user ? "/my-list" : "/login"}
            aria-label={user ? "Open My List" : "Sign in"}
            className="grid size-9 place-items-center rounded-lg text-white/60 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <User size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
