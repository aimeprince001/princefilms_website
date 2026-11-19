import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PlayerOverlay } from "@/components/player/PlayerOverlay";

type PlayerSession = { titleId: string; episodeId?: string; startedAt: number };

type PlayerContextValue = {
  session: PlayerSession | null;
  play: (titleId: string, episodeId?: string) => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PlayerSession | null>(null);

  const play = useCallback((titleId: string, episodeId?: string) => {
    setSession({ titleId, episodeId, startedAt: Date.now() });
  }, []);

  const close = useCallback(() => setSession(null), []);

  const value = useMemo(() => ({ session, play, close }), [session, play, close]);

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <PlayerOverlay />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside a PlayerProvider");
  return context;
}
