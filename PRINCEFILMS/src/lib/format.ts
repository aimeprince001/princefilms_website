/** Formatting helpers shared by the catalogue, player and detail pages. */

export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    const value = views / 1_000_000;
    return `${value >= 10 ? Math.round(value) : value.toFixed(1)}M`;
  }
  if (views >= 1_000) {
    const value = views / 1_000;
    return `${value >= 100 ? Math.round(value) : value.toFixed(value >= 10 ? 0 : 1)}K`;
  }
  return String(views);
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export function formatTimecode(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function progressPercent(position: number, duration: number): number {
  if (!duration) return 0;
  return Math.min(100, Math.max(0, (position / duration) * 100));
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}


