import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { getTitleById, type Title } from "@/data/catalog";
import { progressPercent } from "@/lib/format";

export type WatchProgress = {
  titleId: string;
  episodeId?: string;
  position: number;
  duration: number;
  updatedAt: number;
};

export type ResumeItem = { title: Title; progress: WatchProgress };

type LibraryContextValue = {
  saved: string[];
  likes: string[];
  progress: Record<string, WatchProgress>;
  recentSearches: string[];
  savedTitles: Title[];
  continueWatching: ResumeItem[];
  finished: ResumeItem[];
  isSaved: (titleId: string) => boolean;
  toggleSaved: (titleId: string) => void;
  isLiked: (titleId: string) => boolean;
  toggleLike: (titleId: string) => void;
  progressFor: (titleId: string) => WatchProgress | undefined;
  saveProgress: (update: Omit<WatchProgress, "updatedAt">) => void;
  clearProgress: (titleId: string) => void;
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

const COMPLETE_THRESHOLD = 92;

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = usePersistentState<string[]>("princefilms.saved.v1", []);
  const [likes, setLikes] = usePersistentState<string[]>("princefilms.likes.v1", []);
  const [progress, setProgress] = usePersistentState<Record<string, WatchProgress>>(
    "princefilms.progress.v1",
    {},
  );
  const [recentSearches, setRecentSearches] = usePersistentState<string[]>(
    "princefilms.searches.v1",
    [],
  );

  const isSaved = useCallback((titleId: string) => saved.includes(titleId), [saved]);

  const toggleSaved = useCallback(
    (titleId: string) => {
      setSaved((current) =>
        current.includes(titleId)
          ? current.filter((id) => id !== titleId)
          : [titleId, ...current],
      );
    },
    [setSaved],
  );

  const isLiked = useCallback((titleId: string) => likes.includes(titleId), [likes]);

  const toggleLike = useCallback(
    (titleId: string) => {
      setLikes((current) =>
        current.includes(titleId)
          ? current.filter((id) => id !== titleId)
          : [titleId, ...current],
      );
    },
    [setLikes],
  );

  const progressFor = useCallback((titleId: string) => progress[titleId], [progress]);

  const saveProgress = useCallback(
    (update: Omit<WatchProgress, "updatedAt">) => {
      setProgress((current) => ({
        ...current,
        [update.titleId]: { ...update, updatedAt: Date.now() },
      }));
    },
    [setProgress],
  );

  const clearProgress = useCallback(
    (titleId: string) => {
      setProgress((current) => {
        const next = { ...current };
        delete next[titleId];
        return next;
      });
    },
    [setProgress],
  );

  const addRecentSearch = useCallback(
    (term: string) => {
      const value = term.trim();
      if (value.length < 2) return;
      setRecentSearches((current) =>
        [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 6),
      );
    },
    [setRecentSearches],
  );

  const clearRecentSearches = useCallback(() => setRecentSearches([]), [setRecentSearches]);

  const savedTitles = useMemo(
    () => saved.map((id) => getTitleById(id)).filter((title): title is Title => Boolean(title)),
    [saved],
  );

  const { continueWatching, finished } = useMemo(() => {
    const entries = Object.values(progress)
      .filter((entry) => entry.duration > 0 && entry.position > 5)
      .sort((a, b) => b.updatedAt - a.updatedAt);

    const resumable: ResumeItem[] = [];
    const completed: ResumeItem[] = [];

    entries.forEach((entry) => {
      const title = getTitleById(entry.titleId);
      if (!title) return;
      const percent = progressPercent(entry.position, entry.duration);
      if (percent >= COMPLETE_THRESHOLD) completed.push({ title, progress: entry });
      else resumable.push({ title, progress: entry });
    });

    return { continueWatching: resumable, finished: completed };
  }, [progress]);

  const value = useMemo<LibraryContextValue>(
    () => ({
      saved,
      likes,
      progress,
      recentSearches,
      savedTitles,
      continueWatching,
      finished,
      isSaved,
      toggleSaved,
      isLiked,
      toggleLike,
      progressFor,
      saveProgress,
      clearProgress,
      addRecentSearch,
      clearRecentSearches,
    }),
    [
      saved,
      likes,
      progress,
      recentSearches,
      savedTitles,
      continueWatching,
      finished,
      isSaved,
      toggleSaved,
      isLiked,
      toggleLike,
      progressFor,
      saveProgress,
      clearProgress,
      addRecentSearch,
      clearRecentSearches,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryContextValue {
  const context = useContext(LibraryContext);
  if (!context) throw new Error("useLibrary must be used inside a LibraryProvider");
  return context;
}
