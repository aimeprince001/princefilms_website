import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  LogOut,
  Mail,
  Phone,
  Play,
  ShieldCheck,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLibrary } from "@/context/LibraryContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/EmptyState";
import { TitleCard } from "@/components/media/TitleCard";
import { ResumeCard } from "@/components/media/ResumeCard";
import { ProfileCustomizer } from "@/components/profile/ProfileCustomizer";

export function Profile() {
  useDocumentTitle("My Profile");
  const { user, logout, isAuthenticating } = useAuth();
  const {
    savedTitles,
    continueWatching,
    finished,
    isSaved,
    toggleSaved,
    clearProgress,
  } = useLibrary();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editIdentifier, setEditIdentifier] = useState(user?.identifier ?? "");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilePreferences, setProfilePreferences] = useState<{ avatar: string; cover: string; bio: string; accent: string; favoriteGenres: string[]; isPublic: boolean; showStats: boolean }>({
    avatar: "", cover: "", bio: "", accent: "#e11d48", favoriteGenres: [], isPublic: true, showStats: true,
  });
  const profileStorageKey = user ? `princefilms.profile.preferences.v1.${user.id}` : "";
  useEffect(() => {
    const loadPreferences = () => {
      if (!profileStorageKey) return;
      try {
        const raw = localStorage.getItem(profileStorageKey);
        setProfilePreferences(raw ? { avatar: "", cover: "", bio: "", accent: "#e11d48", favoriteGenres: [], isPublic: true, showStats: true, ...JSON.parse(raw) } : { avatar: "", cover: "", bio: "", accent: "#e11d48", favoriteGenres: [], isPublic: true, showStats: true });
      } catch {}
    };
    loadPreferences();
    window.addEventListener("princefilms-profile-updated", loadPreferences);
    return () => window.removeEventListener("princefilms-profile-updated", loadPreferences);
  }, [profileStorageKey]);

  const memberSince = "November 2026";
  const totalSaved = savedTitles.length;
  const totalWatching = continueWatching.length;
  const totalFinished = finished.length;
  const watchTime = Math.round(
    continueWatching.reduce((sum, item) => sum + item.progress.position, 0) / 60,
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");
    if (!editName.trim()) {
      setSaveError("Name is required.");
      return;
    }
    try {
      const raw = localStorage.getItem("princefilms.accounts.v1");
      if (raw) {
        const accounts = JSON.parse(raw);
        const updated = accounts.map((acc: any) =>
          acc.id === user?.id ? { ...acc, name: editName.trim() } : acc,
        );
        localStorage.setItem("princefilms.accounts.v1", JSON.stringify(updated));
      }
      setSaveSuccess("Profile updated successfully.");
      setEditMode(false);
    } catch {
      setSaveError("Failed to save profile. Try again.");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess("Password changed successfully. You'll need to sign in again.");
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1200);
  };

  const handleDeleteAccount = async () => {
    try {
      localStorage.removeItem("princefilms.accounts.v1");
      localStorage.removeItem("princefilms.session.v1");
      localStorage.removeItem("princefilms.saved.v1");
      localStorage.removeItem("princefilms.progress.v1");
      logout();
      navigate("/login");
    } catch {
      setSaveError("Failed to delete account.");
    }
  };

  const avatarLetter = user?.name.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="page-shell pb-16 pt-8">
      {!user && (
        <div className="max-w-2xl mx-auto text-center py-20">
          <ShieldCheck size={48} className="mx-auto mb-6 text-rose-400" aria-hidden="true" />
          <h1 className="font-display text-[32px] leading-none text-text">Account required</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            You need to sign in to view your profile.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className={buttonClass({ size: "md" })}>
              Sign in
            </Link>
            <Link to="/register" className={buttonClass({ variant: "secondary", size: "md" })}>
              Create an account
            </Link>
          </div>
        </div>
      )}
      {user && (
        <>
          <header className="max-w-2xl mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="font-display text-[34px] leading-none text-text sm:text-[44px]">
                  {editMode ? "Edit profile" : "My profile"}
                </h1>
                <p className="text-[14px] leading-relaxed text-muted">
                  Your personal viewing hub. Manage your account, track progress, and see your stats.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {editMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(user.name);
                      setEditIdentifier(user.identifier);
                      setEditMode(false);
                      setSaveError("");
                      setSaveSuccess("");
                    }}
                    className="text-[12.5px] font-medium text-white/60 hover:text-white transition"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 rounded-xl border border-white/12 bg-ink-850 px-4 py-2.5 text-[13px] text-white transition hover:bg-white/5"
                  >
                    <User size={14} aria-hidden="true" /> Edit profile
                  </button>
                )}
                <button
                  type="button"
                  onClick={logout}
                  disabled={isAuthenticating}
                  className={buttonClass({ variant: "outline", size: "md" })}
                >
                  <LogOut size={16} aria-hidden="true" /> Sign out
                </button>
              </div>
            </div>
            {saveError && (
              <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-[12.5px] text-rose-300">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="mt-4 rounded-xl border border-mint-400/25 bg-emerald-500/10 px-4 py-3 text-[12.5px] text-mint-400">
                {saveSuccess}
              </div>
            )}
          </header>

          <ProfileCustomizer userId={String(user.id)} displayName={user.name} />

          {/* Profile card */}
          <section className="max-w-2xl mb-12">
            <div className="rounded-[24px] border border-white/10 bg-ink-850 p-8 lg:p-12" style={{ borderColor: `${profilePreferences.accent}40` }}>
              {!editMode && profilePreferences.cover && <div className="mb-6 h-28 overflow-hidden rounded-xl"><img src={profilePreferences.cover} alt="Profile cover" className="h-full w-full object-cover" /></div>
              {editMode ? (
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="space-y-3">
                    <label className="block text-[12.5px] font-medium text-white/70">
                      Display name
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full h-11 rounded-xl border border-white/12 bg-ink-850 px-3.5 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[12.5px] font-medium text-white/70">
                      Email / phone
                    </label>
                    <input
                      type="text"
                      autoComplete="username"
                      value={editIdentifier}
                      onChange={(e) => setEditIdentifier(e.target.value)}
                      className="w-full h-11 rounded-xl border border-white/12 bg-ink-850 px-3.5 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                      disabled
                    />
                    <p className="text-[11.5px] text-white/40">
                      Email and phone cannot be changed after account creation.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className={buttonClass({ size: "lg", className: "w-full" })}
                  >
                    {isAuthenticating ? "Saving…" : "Save changes"}
                    {!isAuthenticating && <ArrowRight size={16} aria-hidden="true" />}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  <div className="flex items-center gap-4">
                    <div className="grid size-20 place-items-center overflow-hidden rounded-full border bg-brand-500/10" style={{ borderColor: `${profilePreferences.accent}80` }}>
                      {profilePreferences.avatar ? <img src={profilePreferences.avatar} alt="Profile avatar" className="h-full w-full object-cover" /> : <span className="text-[32px] font-bold" style={{ color: profilePreferences.accent }}>{avatarLetter}</span>}
                    </div>
                    <div>
                      <h2 className="font-display text-[24px] leading-none text-text">
                        {user.name}
                      </h2>
                      <p className="mt-1 text-[13px] text-white/60">
                        {user.provider === "email" ? user.email : user.phone}
                      </p>
                      {profilePreferences.bio && <p className="mt-2 max-w-md text-[12px] leading-relaxed text-white/65">{profilePreferences.bio}</p>}
                      {profilePreferences.favoriteGenres.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{profilePreferences.favoriteGenres.map((genre) => <span key={genre} className="rounded-full border px-2 py-1 text-[10px]" style={{ borderColor: `${profilePreferences.accent}55`, color: profilePreferences.accent }}>{genre}</span>)}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[12px] font-medium",
                        "border-white/10 bg-white/5 text-white/70",
                      )}
                    >
                      <User size={14} className="text-white/50" aria-hidden="true" />
                      Member since {memberSince}
                    </div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[12px] font-medium",
                        "border-white/10 bg-white/5 text-white/70",
                      )}
                    >
                      <ShieldCheck size={14} className="text-mint-400" aria-hidden="true" />
                      Local-only storage
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Stats cards */}
          <section className="max-w-2xl mb-12">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Titles saved",
                  value: totalSaved,
                  icon: <Bookmark size={20} />,
                  color: "text-brand-300",
                  desc: "Films and series in your list",
                },
                {
                  label: "Continue watching",
                  value: totalWatching,
                  icon: <Clock size={20} />,
                  color: "text-gold-400",
                  desc: "Pick up where you left off",
                },
                {
                  label: "Finished",
                  value: totalFinished,
                  icon: <CheckCircle2 size={20} />,
                  color: "text-mint-400",
                  desc: "Titles watched to the end",
                },
                {
                  label: "Watch time",
                  value: `${watchTime} min`,
                  icon: <Play size={20} />,
                  color: "text-white",
                  desc: "Total minutes streamed",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-ink-850 p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-lg bg-white/5">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        {stat.label}
                      </p>
                      <p className="mt-0.5 font-display text-[22px] leading-none text-text">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11.5px] text-white/40">{stat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Continue watching */}
          {continueWatching.length > 0 && (
            <section aria-label="Continue watching" className="max-w-2xl mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-[20px] leading-none text-text">
                  Continue watching
                </h2>
                <Link
                  to="/my-list"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
                >
                  View all <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {continueWatching.map((item) => (
                  <div key={item.title.id}>
                    <ResumeCard title={item.title} progress={item.progress} variant="tile" />
                    <button
                      type="button"
                      onClick={() => clearProgress(item.title.id)}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-white/35 transition hover:text-rose-400"
                    >
                      <Trash2 size={12} aria-hidden="true" /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Saved titles */}
          {savedTitles.length > 0 && (
            <section aria-label="Saved titles" className="max-w-2xl mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-[20px] leading-none text-text">
                  My List
                </h2>
                <Link
                  to="/my-list"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
                >
                  View all <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {savedTitles.map((title) => (
                  <TitleCard key={title.id} title={title} />
                ))}
              </div>
            </section>
          )}

          {/* Finished titles */}
          {finished.length > 0 && (
            <section aria-label="Finished titles" className="max-w-2xl mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-[20px] leading-none text-text">
                  Finished titles
                </h2>
                <Link
                  to="/my-list"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 transition hover:text-brand-100"
                >
                  View all <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {finished.map((item) => (
                  <div key={item.title.id}>
                    <TitleCard title={item.title} />
                    <button
                      type="button"
                      onClick={() => clearProgress(item.title.id)}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-white/35 transition hover:text-rose-400"
                    >
                      <Trash2 size={12} aria-hidden="true" /> Clear from history
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Account settings */}
          <section className="max-w-2xl mb-12">
            <div className="rounded-[24px] border border-white/10 bg-ink-850 p-8 lg:p-10">
              <h2 className="font-display text-[20px] leading-none text-text mb-6">
                Account settings
              </h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-ink-850 px-4 py-4 text-left text-[14px] text-text transition hover:bg-white/5 hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <LockIcon size={18} className="text-white/40" aria-hidden="true" />
                    <span>Change password</span>
                  </div>
                  <ArrowRight size={16} className="text-white/30" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/12 bg-ink-850 px-4 py-4 text-left text-[14px] text-rose-400/70 transition hover:bg-rose-500/10 hover:border-rose-400/20"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 size={18} className="text-white/40" aria-hidden="true" />
                    <span>Delete account</span>
                  </div>
                  <ArrowRight size={16} className="text-white/30" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>

          {/* Delete confirmation dialog */}
          {showDeleteConfirm && (
            <dialog
              className="rounded-[24px] border border-white/10 bg-ink-850 p-8 backdrop:bg-ink-950/80 backdrop-blur-xl max-w-md mx-auto"
              open
            >
              <h2 className="font-display text-[24px] leading-none text-text mb-4">
                Delete account?
              </h2>
              <p className="mb-6 text-[13.5px] text-white/60 leading-relaxed">
                This will permanently remove your account, saved titles, and watch history from
                this device. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 rounded-xl border border-white/12 bg-ink-850 text-[13px] text-white/60 transition hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex-1 py-3 rounded-xl bg-rose-600/20 border border-rose-400/40 px-4 text-[13px] font-medium text-rose-400 hover:bg-rose-600/40 transition"
                >
                  Delete
                </button>
              </div>
            </dialog>
          )}
        </>
      )}
    </div>
  );
}

function LockIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}