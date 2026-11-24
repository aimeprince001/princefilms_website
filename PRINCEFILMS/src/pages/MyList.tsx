import { Bookmark, CheckCircle2, Clock, PlayCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { TitleCard } from "@/components/media/TitleCard";
import { ResumeCard } from "@/components/media/ResumeCard";

type TabKey = "continue" | "saved" | "finished";

export function MyListPage() {
  const { t } = useLanguage();
  useDocumentTitle(t("myList"));
  const { user } = useAuth();
  const { continueWatching, savedTitles, finished, clearProgress } = useLibrary();

  const [tab, setTab] = useState<TabKey>("continue");

  const tabs: { key: TabKey; label: string; icon: typeof Clock; count: number }[] = [
    { key: "continue", label: t("continueWatching"), icon: Clock, count: continueWatching.length },
    { key: "saved", label: t("savedTitles"), icon: Bookmark, count: savedTitles.length },
    { key: "finished", label: t("finished"), icon: CheckCircle2, count: finished.length },
  ];

  return (
    <div className="page-shell pb-16 pt-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-[30px] leading-[1.05] text-text sm:text-[38px]">{t("myList")}</h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
          {t("progressDevice")}
          {user ? ` and belong to ${user.name}` : ""}.
        </p>
        {!user && (
          <p className="mt-3 text-[12.5px] text-white/40">
            <Link to="/login" className="font-medium text-brand-200 hover:text-brand-100">
              {t("signIn")}
            </Link>{" "}
            {t("continueAcrossSessions")}
          </p>
        )}
      </header>

      <div role="tablist" aria-label={t("myList")} className="mt-6 flex flex-wrap items-center gap-1.5 border-b border-white/[0.07] pb-2">
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
        <section aria-label={t("continueWatching")} className="mt-7">
          {continueWatching.length === 0 ? (
            <EmptyState
              icon={PlayCircle}
              title={t("nothingInProgress")}
              description={t("startPlaybackMessage")}
              action={
                <Link to="/movies" className={buttonClass({ size: "md" })}>
                  {t("browseMovies")}
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
                    {t("removeContinue")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "saved" && (
        <section aria-label={t("savedTitles")} className="mt-7">
          {savedTitles.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title={t("myListEmpty")}
              description={t("saveTitleMessage")}
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
        <section aria-label={t("finished")} className="mt-7">
          {finished.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title={t("noFinishedTitles")}
              description={t("finishedMessage")}
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
                    {t("clearHistory")}
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
