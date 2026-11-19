import { Bookmark, CheckCircle2, Clock, PlayCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TitleCard } from "@/components/media/TitleCard";
import { ResumeCard } from "@/components/media/ResumeCard";

type TabKey = "continue" | "saved" | "finished";

export function MyListPage() {
  useDocumentTitle("My List");
  const { user } = useAuth();
  const { continueWatching, savedTitles, finished, clearProgress } = useLibrary();

  const [tab, setTab] = useState<TabKey>("continue");

  const tabs: { key: TabKey; label: string; icon: typeof Clock; count: number }[] = [
    { key: "continue", label: "Continue watching", icon: Clock, count: continueWatching.length },
    { key: "saved", label: "Saved", icon: Bookmark, count: savedTitles.length },
    { key: "finished", label: "Finished", icon: CheckCircle2, count: finished.length },
  ];

  return (
    <div className="page-shell pb-16 pt-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-[30px] leading-[1.05] text-text sm:text-[38px]">My List</h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
          Progress and saved titles are kept on this device
          {user ? ` and belong to ${user.name}` : ""}.
        </p>
        {!user && (
          <p className="mt-3 text-[12.5px] text-white/40">
            <Link to="/login" className="font-medium text-brand-200 hover:text-brand-100">
              Sign in
            </Link>{" "}
            to keep the same list across sessions.
          </p>
        )}
      </header>

      <div role="tablist" aria-label="My List sections" className="mt-6 flex flex-wrap items-center gap-1.5 border-b border-white/[0.07] pb-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={tab === item.key}
            onClick={() => setTab(item.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              tab === item.key
                ? "bg-white/[0.08] text-white"
                : "text-white/50 hover:bg-white/[0.04] hover:text-white",
            )}
          >
            <item.icon size={14} aria-hidden="true" />
            {item.label}
            <span className="num text-[11px] text-white/35">{item.count}</span>
          </button>
        ))}
      </div>

      {tab === "continue" && (
        <section aria-label="Continue watching" className="mt-7">
          {continueWatching.length === 0 ? (
            <EmptyState
              icon={PlayCircle}
              title="Nothing in progress"
              description="Start a film or an episode and it will appear here with the exact position you stopped at."
              action={
                <Link to="/movies" className={buttonClass({ size: "md" })}>
                  Browse movies
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {continueWatching.map((item) => (
                <div key={item.title.id}>
                  <ResumeCard title={item.title} progress={item.progress} variant="tile" />
                  <button
                    type="button"
                    onClick={() => clearProgress(item.title.id)}
                    className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-white/35 transition hover:text-rose-400"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                    Remove from Continue watching
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "saved" && (
        <section aria-label="Saved titles" className="mt-7">
          {savedTitles.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="My List is empty"
              description="Save a title from its card or detail page and it will be kept here."
              action={
                <Link to="/series" className={buttonClass({ size: "md" })}>
                  Browse series
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {savedTitles.map((title) => (
                <TitleCard key={title.id} title={title} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "finished" && (
        <section aria-label="Finished titles" className="mt-7">
          {finished.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No finished titles yet"
              description="Titles are marked finished when playback reaches the end."
              action={
                <Link to="/movies" className={buttonClass({ size: "md" })}>
                  Browse movies
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {finished.map((item) => (
                <div key={item.title.id}>
                  <TitleCard title={item.title} />
                  <button
                    type="button"
                    onClick={() => clearProgress(item.title.id)}
                    className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-white/35 transition hover:text-rose-400"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                    Clear from history
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
