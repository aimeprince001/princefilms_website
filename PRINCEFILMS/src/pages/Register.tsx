import {
  ArrowRight,
  Check,
  Film,
  Gamepad,
  Heart,
  Music,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Zap,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getTitleById } from "@/data/catalog";
import { useAuth } from "@/context/AuthContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { buttonClass } from "@/components/ui/Button";
import {
  AuthField,
  AuthLayout,
  AuthModeToggle,
  AuthNotice,
  CaptchaVerification,
  PasswordField,
  PasswordStrengthMeter,
  SocialAuthButtons,
} from "@/components/auth/AuthShell";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/cn";

const GENRES = [
  { id: "drama", label: "Drama", icon: <Film size={16} /> },
  { id: "comedy", label: "Comedy", icon: <Gamepad size={16} /> },
  { id: "action", label: "Action", icon: <Sparkles size={16} /> },
  { id: "music", label: "Music", icon: <Music size={16} /> },
  { id: "romance", label: "Romance", icon: <Heart size={16} /> },
];

export function Register() {
  useDocumentTitle("Create an account");
  const { register, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<"account" | "interests" | "terms" | "done">("account");
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{
    name?: string;
    identifier?: string;
    password?: string;
  }>({});

  const still = getTitleById("the-sound-booth")?.image ?? "";
  const from = (location.state as { from?: string } | null)?.from;

  const toggleInterest = (id: string) => {
    const next = new Set(selectedInterests);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedInterests(next);
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const nextErrors: typeof fieldError = {};
    if (!name.trim()) nextErrors.name = "Enter the name to show on your account.";
    if (!identifier.trim()) {
      nextErrors.identifier =
        mode === "email" ? "Enter an email address." : "Enter a phone number.";
    }
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters.";
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStep("interests");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!termsAccepted) {
      setError("Please accept the terms of service.");
      return;
    }
    if (selectedInterests.size === 0) {
      setError("Select at least one interest to personalize your experience.");
      return;
    }

    try {
      await register({
        name,
        identifier,
        password,
        provider: mode,
      });
      setStep("done");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the account.");
    }
  };

  const progress = step === "account" ? 25 : step === "interests" ? 50 : step === "terms" ? 75 : 100;

  return (
    <AuthLayout image={still} imageAlt="The Sound Booth — still, photo by Jacob Mejicanos on Unsplash">
      <div className="flex items-start justify-between mb-6">
        <Logo className="lg:hidden" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
          Step {progress === 25 ? "1" : progress === 50 ? "2" : progress === 75 ? "3" : "4"} of 4
        </span>
      </div>
      <div className="w-full bg-ink-800 rounded-xl h-1.5 mb-8 overflow-hidden">
        <div
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {step === "account" && (
        <div className="space-y-5">
          <h1 className="font-display text-[32px] leading-none text-text">Create your account</h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
            Join PRINCEFILMS and keep your saved titles and playback position.
          </p>

          <form onSubmit={handleAccountSubmit} className="mt-6 space-y-5" noValidate>
            <AuthModeToggle
              mode={mode}
              onChange={(next) => {
                setMode(next);
                setFieldError({});
              }}
            />

            <AuthField
              label="Full name"
              autoComplete="name"
              placeholder="Uwase Aline"
              value={name}
              onChange={(event) => setName(event.target.value)}
              error={fieldError.name}
            />

            <AuthField
              label={mode === "email" ? "Email address" : "Phone number"}
              type={mode === "email" ? "email" : "tel"}
              inputMode={mode === "email" ? "email" : "tel"}
              autoComplete={mode === "email" ? "email" : "tel"}
              placeholder={mode === "email" ? "you@example.com" : "+250 7XX XXX XXX"}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              error={fieldError.identifier}
            />

            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              hint={
                password.length === 0
                  ? "At least 6 characters."
                  : password.length < 6
                    ? "Too short — add more characters."
                    : "Password length is fine."
              }
            />
            <PasswordStrengthMeter value={password} />

            {error && <AuthNotice tone="error">{error}</AuthNotice>}

            <button
              type="submit"
              disabled={isAuthenticating}
              className={buttonClass({ size: "lg", className: "w-full" })}
            >
              Continue <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <p className="mt-5 text-[12.5px] text-white/40">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-brand-200 hover:text-brand-100">
              Sign in
            </Link>
          </p>
        </div>
      )}

      {step === "interests" && (
        <div className="space-y-5">
          <h1 className="font-display text-[32px] leading-none text-text">Your interests</h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
            Pick what you love so we can recommend the right titles for you.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GENRES.map((genre) => {
              const active = selectedInterests.has(genre.id);
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => toggleInterest(genre.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-left transition-colors",
                    active
                      ? "border-brand-400 bg-brand-500/10 text-brand-200"
                      : "border-white/10 bg-ink-850 text-white/60 hover:border-white/20 hover:text-white",
                  )}
                >
                  <div className="grid size-10 place-items-center rounded-lg bg-white/5">
                    {genre.icon}
                  </div>
                  <span className="text-[13px] font-medium">{genre.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[12px] text-white/40">
            Select at least one interest. You can change these anytime.
          </p>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep("account")}
              className="text-[12.5px] font-medium text-brand-200 hover:text-brand-100"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep("terms")}
              disabled={selectedInterests.size === 0}
              className={buttonClass({ size: "lg", className: "w-auto" })}
            >
              Next <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {step === "terms" && (
        <div className="space-y-5">
          <h1 className="font-display text-[32px] leading-none text-text">Almost there</h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
            Review and agree to our terms to complete your account.
          </p>

          <div className="mt-6 rounded-xl border border-white/12 bg-ink-850 p-5">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded border-white/10 bg-ink-850 text-brand-500 focus:ring-brand-400"
              />
              <div>
                <p className="text-[13px] font-medium text-text">
                  I agree to the <span className="text-brand-200 hover:underline">Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-brand-200 hover:underline">Privacy Policy</span>.
                </p>
                <p className="mt-1 text-[11.5px] text-white/40">
                  Your account and viewing history stay on this device. Nothing is uploaded to a
                  server.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/12 bg-ink-850 p-5">
            <p className="text-[13px] text-white/70">
              <ShieldCheck size={14} className="mr-2 text-mint-400" aria-hidden="true" />
              Local-only storage — your data never leaves this browser
            </p>
            <p className="mt-2 text-[13px] text-white/70">
              <Zap size={14} className="mr-2 text-brand-400" aria-hidden="true" />
              Instant sign-in with email or phone number
            </p>
            <p className="mt-2 text-[13px] text-white/70">
              <UserPlus size={14} className="mr-2 text-white/40" aria-hidden="true" />
              Personalized recommendations based on your interests
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep("interests")}
              className="text-[12.5px] font-medium text-brand-200 hover:text-brand-100"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={
                isAuthenticating ||
                !termsAccepted ||
                selectedInterests.size === 0
              }
              className={buttonClass({ size: "lg", className: "w-auto" })}
            >
              Create account <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="mt-10 text-center py-12 rounded-[24px] border border-mint-400/25 bg-emerald-500/10">
          <UserPlus size={48} className="mx-auto mb-4 text-mint-400" aria-hidden="true" />
          <h1 className="font-display text-[32px] leading-none text-text">Welcome to PRINCEFILMS!</h1>
          <p className="mt-3 text-[14px] text-muted">
            Your account is ready. Start watching and saving your favorite titles.
          </p>
          <button
            type="button"
            onClick={() => navigate(from ?? "/profile", { replace: true })}
            className={buttonClass({ size: "lg", className: "mt-6 w-auto" })}
          >
            Go to My Profile <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
