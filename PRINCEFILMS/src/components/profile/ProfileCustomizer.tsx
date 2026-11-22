import { useEffect, useState } from "react";
import { Check, ImagePlus, Palette, Save, ShieldCheck, UserRound, X } from "lucide-react";

type ProfilePreferences = {
  avatar: string;
  cover: string;
  bio: string;
  accent: string;
  favoriteGenres: string[];
  isPublic: boolean;
  showStats: boolean;
};

const DEFAULTS: ProfilePreferences = {
  avatar: "",
  cover: "",
  bio: "",
  accent: "#e11d48",
  favoriteGenres: [],
  isPublic: true,
  showStats: true,
};

const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];

const ACCENTS = [
  { label: "Cinematic red", value: "#e11d48" },
  { label: "Electric violet", value: "#8b5cf6" },
  { label: "Ocean blue", value: "#0ea5e9" },
  { label: "Neon green", value: "#10b981" },
  { label: "Gold", value: "#f59e0b" },
];

function readPreferences(key: string): ProfilePreferences {
  try {
    const stored = localStorage.getItem(key);
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function ProfileCustomizer({ userId, displayName }: { userId: string; displayName: string }) {
  const storageKey = `princefilms.profile.preferences.v1.${userId}`;
  const [preferences, setPreferences] = useState<ProfilePreferences>(() => readPreferences(storageKey));
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreferences(readPreferences(storageKey));
    setSaved(true);
    setDirty(false);
  }, [storageKey]);

  useEffect(() => {
    if (!dirty) return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty]);

  const update = <K extends keyof ProfilePreferences,>(key: K, value: ProfilePreferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setDirty(true);
  };

  const uploadImage = (field: "avatar" | "cover", file?: File) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Choose an image smaller than 1.5 MB to keep your profile storage reliable.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") update(field, reader.result);
    };
    reader.onerror = () => setError("Could not read this image. Please try another file.");
    reader.readAsDataURL(file);
  };

  const save = () => {
    setError("");
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      window.dispatchEvent(new Event("princefilms-profile-updated"));
      setSaved(true);
      setDirty(false);
    } catch {
      setError("Your browser storage is full. Try using smaller profile images.");
    }
  };

  const resetCustomization = () => {
    setPreferences(DEFAULTS);
    try {
      localStorage.removeItem(storageKey);
      window.dispatchEvent(new Event("princefilms-profile-updated"));
      setSaved(true);
      setDirty(false);
      setError("");
    } catch {
      setError("Could not reset customization. Please try again.");
    }
  };

  return (
    <section className="mb-12 max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-ink-850">
      <div className="relative h-32 sm:h-40" style={{ background: preferences.cover ? `center/cover no-repeat url("${preferences.cover}")` : `linear-gradient(120deg, ${preferences.accent}55, #111827 65%, #05070d)` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-850/80 to-transparent" />
        <div className="absolute bottom-4 left-6 flex items-center gap-3">
          <div className="grid size-16 place-items-center overflow-hidden rounded-full border-2 border-white/30 bg-ink-900 text-2xl font-bold text-white shadow-xl" style={{ outline: `3px solid ${preferences.accent}55` }}>
            {preferences.avatar ? <img src={preferences.avatar} alt="Your profile avatar" className="h-full w-full object-cover" /> : displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Your profile preview</p>
            <h2 className="mt-1 font-display text-xl text-white">{displayName}</h2>
          </div>
        </div>
        <span className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur">Personalize</span>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <Palette size={17} style={{ color: preferences.accent }} />
          <h3 className="font-display text-lg text-text">Profile studio</h3>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-white/35">Saved per account</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20">
            <div className="grid size-10 place-items-center overflow-hidden rounded-lg bg-white/5 text-white/60">
              {preferences.avatar ? <img src={preferences.avatar} alt="" className="h-full w-full object-cover" /> : <UserRound size={18} />}
            </div>
            <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium text-text">Profile picture</span><span className="block text-[11px] text-white/40">Upload an avatar</span></span>
            <ImagePlus size={16} className="text-white/40" />
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadImage("avatar", event.target.files?.[0])} />
          </label>
          <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-white/20">
            <div className="grid size-10 place-items-center overflow-hidden rounded-lg bg-white/5 text-white/60">
              {preferences.cover ? <img src={preferences.cover} alt="" className="h-full w-full object-cover" /> : <ImagePlus size={18} />}
            </div>
            <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium text-text">Cover artwork</span><span className="block text-[11px] text-white/40">Upload a banner</span></span>
            <ImagePlus size={16} className="text-white/40" />
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadImage("cover", event.target.files?.[0])} />
          </label>
        </div>

        {(preferences.avatar || preferences.cover) && (
          <div className="flex flex-wrap gap-2">
            {preferences.avatar && <button type="button" onClick={() => update("avatar", "")} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-white/55 hover:text-white"><X size={12} /> Remove avatar</button>}
            {preferences.cover && <button type="button" onClick={() => update("cover", "")} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-white/55 hover:text-white"><X size={12} /> Remove cover</button>}
          </div>
        )}

        <label className="block space-y-2">
          <span className="text-[12px] font-medium text-white/70">Bio <span className="text-white/35">(160 characters)</span></span>
          <textarea value={preferences.bio} maxLength={160} onChange={(event) => update("bio", event.target.value)} placeholder="Tell the community what kind of movies you love…" rows={3} className="w-full resize-y rounded-xl border border-white/10 bg-ink-900 px-3.5 py-3 text-[13px] text-text outline-none transition focus:border-white/25" />
          <span className="block text-right text-[10px] text-white/35">{preferences.bio.length}/160</span>
        </label>

        <div className="space-y-3">
          <p className="text-[12px] font-medium text-white/70">Profile accent</p>
          <div className="flex flex-wrap gap-3">
            {ACCENTS.map((accent) => (
              <button key={accent.value} type="button" title={accent.label} aria-label={accent.label} onClick={() => update("accent", accent.value)} className="grid size-9 place-items-center rounded-full border-2 transition" style={{ background: accent.value, borderColor: preferences.accent === accent.value ? "white" : "transparent", boxShadow: preferences.accent === accent.value ? `0 0 0 3px ${accent.value}44` : "none" }}>
                {preferences.accent === accent.value && <Check size={15} className="text-white" />}
              </button>
            ))}
          </div>
          <p className="text-[10.5px] text-white/35">Selected: {ACCENTS.find((item) => item.value === preferences.accent)?.label ?? "Custom accent"}</p>
        </div>

        <div className="space-y-3">
          <p className="text-[12px] font-medium text-white/70">Favorite genres</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => {
              const active = preferences.favoriteGenres.includes(genre);
              return <button key={genre} type="button" onClick={() => update("favoriteGenres", active ? preferences.favoriteGenres.filter((item) => item !== genre) : [...preferences.favoriteGenres, genre])} className="rounded-full border px-3 py-1.5 text-[11px] transition" style={{ borderColor: active ? preferences.accent : "rgba(255,255,255,.12)", background: active ? `${preferences.accent}22` : "transparent", color: active ? "white" : "rgba(255,255,255,.55)" }}>{genre}</button>;
            })}
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-white/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-[12.5px] font-medium text-text">Public profile</p><p className="mt-1 text-[11px] text-white/40">Allow other visitors to view your profile details.</p></div>
            <button type="button" role="switch" aria-checked={preferences.isPublic} onClick={() => update("isPublic", !preferences.isPublic)} className="relative h-6 w-11 shrink-0 rounded-full transition" style={{ background: preferences.isPublic ? preferences.accent : "#374151" }}><span className="absolute top-0.5 size-5 rounded-full bg-white shadow transition" style={{ left: preferences.isPublic ? "22px" : "2px" }} /></button>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-3">
            <div><p className="text-[12.5px] font-medium text-text">Show viewing stats</p><p className="mt-1 text-[11px] text-white/40">Display your watch statistics on your profile.</p></div>
            <button type="button" role="switch" aria-checked={preferences.showStats} onClick={() => update("showStats", !preferences.showStats)} className="relative h-6 w-11 shrink-0 rounded-full transition" style={{ background: preferences.showStats ? preferences.accent : "#374151" }}><span className="absolute top-0.5 size-5 rounded-full bg-white shadow transition" style={{ left: preferences.showStats ? "22px" : "2px" }} /></button>
          </div>
          <p className="flex items-start gap-2 text-[10.5px] leading-relaxed text-white/35"><ShieldCheck size={13} className="mt-0.5 shrink-0" />Privacy settings are saved locally in this browser. A public profile page and server-side privacy enforcement require a backend.</p>
        </div>

        {error && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-[11.5px] text-rose-300">{error}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={resetCustomization} className="rounded-xl border border-white/10 px-3 py-2.5 text-[11.5px] text-white/50 transition hover:border-white/20 hover:text-white">Reset customization</button>
            <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white transition hover:brightness-110" style={{ background: preferences.accent }}><Save size={14} /> Save customization</button>
          </div>
          <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white transition hover:brightness-110" style={{ background: preferences.accent }}><Save size={14} /> Save customization</button>
        </div>
        {saved && <p role="status" className="flex items-center gap-2 text-[11.5px] text-emerald-300"><Check size={14} /> Profile customization saved on this device.</p>}
      </div>
    </section>
  );
}
