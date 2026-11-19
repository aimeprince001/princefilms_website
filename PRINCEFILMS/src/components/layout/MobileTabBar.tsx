import { Bookmark, Film, House, Tv, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLibrary } from "@/context/LibraryContext";
import { cn } from "@/lib/cn";

const ITEMS = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/movies", label: "Movies", icon: Film, end: false },
  { to: "/series", label: "Series", icon: Tv, end: false },
  { to: "/interpreters", label: "Voices", icon: Users, end: false },
  { to: "/my-list", label: "My List", icon: Bookmark, end: false },
];

/** Mobile navigation: five destinations, one tap away, no hidden menu. */
export function MobileTabBar() {
  const { saved } = useLibrary();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-2 bottom-2 z-40 rounded-2xl border border-white/10 bg-ink-850/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl md:hidden"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  isActive ? "text-white" : "text-white/45",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <item.icon
                      size={18}
                      className={isActive ? "text-brand-200" : ""}
                      aria-hidden="true"
                    />
                    {item.to === "/my-list" && saved.length > 0 && (
                      <span
                        className="absolute -right-2 -top-1 size-1.5 rounded-full bg-brand-400"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-brand-400"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
