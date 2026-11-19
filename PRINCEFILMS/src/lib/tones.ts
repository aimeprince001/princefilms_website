import type { Tone } from "@/data/catalog";

export type ToneTokens = {
  /** Colour wash laid over a still. Kept low so photography stays legible. */
  wash: string;
  /** Badge / chip border. */
  line: string;
  /** Accent text colour. */
  text: string;
  /** Ambient glow behind an elevated card. */
  glow: string;
};

export const TONE_STYLES: Record<Tone, ToneTokens> = {
  violet: {
    wash: "from-brand-900/55 via-ink-950/10 to-transparent",
    line: "border-brand-400/30",
    text: "text-brand-200",
    glow: "bg-brand-600/30",
  },
  gold: {
    wash: "from-[#4a3408]/55 via-ink-950/10 to-transparent",
    line: "border-gold-400/30",
    text: "text-gold-300",
    glow: "bg-gold-500/20",
  },
  mint: {
    wash: "from-[#0c3b2c]/55 via-ink-950/10 to-transparent",
    line: "border-mint-400/25",
    text: "text-mint-400",
    glow: "bg-emerald-500/20",
  },
  rose: {
    wash: "from-[#4b1220]/55 via-ink-950/10 to-transparent",
    line: "border-rose-400/25",
    text: "text-rose-400",
    glow: "bg-rose-500/20",
  },
  sky: {
    wash: "from-[#0d2a45]/55 via-ink-950/10 to-transparent",
    line: "border-sky-400/25",
    text: "text-sky-300",
    glow: "bg-sky-500/20",
  },
};
