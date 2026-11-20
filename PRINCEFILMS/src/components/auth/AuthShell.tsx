import { useEffect, useId, useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { INTERPRETERS, TITLES } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";

export function AuthLayout({
  image,
  imageAlt,
  children,
}: {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell grid gap-10 py-8 lg:grid-cols-[1.05fr_minmax(0,430px)] lg:items-center lg:gap-16 lg:py-14">
      <section
        aria-label="About PRINCEFILMS"
        className="relative hidden min-h-[520px] overflow-hidden rounded-[24px] border border-white/[0.08] lg:block lg:max-h-[640px]"
      >
        <img
          src={image}
          alt={imageAlt}
          width={1200}
          height={900}
          className="absolute inset-0 size-full object-cover still-tone"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/20" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-7">
          <Logo />
          <div>
            <h2 className="max-w-xs font-display text-[30px] leading-[1.05] text-white">
              Watch in Kinyarwanda, in your own time.
            </h2>
            <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-4">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.14em] text-white/40">Titles</dt>
                <dd className="num mt-1 font-display text-lg text-white">{TITLES.length}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.14em] text-white/40">Interpreters</dt>
                <dd className="num mt-1 font-display text-lg text-white">{INTERPRETERS.length}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.14em] text-white/40">Quality</dt>
                <dd className="mt-1 font-display text-lg text-white">4K</dd>
              </div>
            </dl>
            <p className="mt-4 text-[11.5px] leading-relaxed text-white/40">
              Films and series are dubbed by independent interpreters in Kigali. Subtitles
              for every title.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[440px]">{children}</div>
    </div>
  );
}

export function AuthField({
  label,
  hint,
  error,
  id,
  ...inputProps
}: {
  label: string;
  hint?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-[12.5px] font-medium text-white/70">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "mt-1.5 h-11 w-full rounded-xl border bg-ink-850 px-3.5 text-[14px] text-text placeholder:text-white/25",
          "focus:outline-none focus:ring-1",
          error
            ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/40"
            : "border-white/12 focus:border-brand-400 focus:ring-brand-400/40",
        )}
        {...inputProps}
      />
      {error ? (
        <p id={`${fieldId}-error`} className="mt-1.5 text-[11.5px] text-rose-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-[11.5px] text-white/30">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-[12.5px] font-medium text-white/70">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="current-password"
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-11 w-full rounded-xl border border-white/12 bg-ink-850 pl-3.5 pr-11 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1 top-1 grid size-9 place-items-center rounded-lg text-white/40 transition hover:bg-white/5 hover:text-white"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[11.5px] text-white/30">
          {hint}
        </p>
      )}
    </div>
  );
}

export function AuthModeToggle({
  mode,
  onChange,
}: {
  mode: "email" | "phone";
  onChange: (mode: "email" | "phone") => void;
}) {
  return (
    <div role="tablist" aria-label="Sign-in method" className="flex items-center gap-1 rounded-xl border border-white/10 bg-ink-850 p-1">
      {(["email", "phone"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={mode === option}
          onClick={() => onChange(option)}
          className={cn(
            "flex-1 rounded-lg py-2 text-[12.5px] font-semibold capitalize transition-colors",
            mode === option ? "bg-white text-ink-950" : "text-white/50 hover:bg-white/5 hover:text-white",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function AuthNotice({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-3.5 py-2.5 text-[12.5px]",
        tone === "error"
          ? "border-rose-400/25 bg-rose-500/10 text-rose-300"
          : "border-mint-400/25 bg-emerald-500/10 text-mint-400",
      )}
    >
      {children}
    </p>
  );
}

/* ── Social Auth Buttons ───────────────────────────────────────────── */

export function SocialAuthButtons({
  onSocialLogin,
}: {
  onSocialLogin: (provider: "google" | "apple") => void;
}) {
  return (
    <div className="mt-8 space-y-3">
      <p className="relative text-[11px] uppercase tracking-widest text-white/30">
        <span className="relative z-10 bg-ink-850 px-2">Or continue with</span>
        <span className="absolute inset-0 flex items-center" aria-hidden="true">
          <span className="w-full border-t border-white/8" />
        </span>
      </p>
      <div className="grid gap-2">
        <button
          type="button"
          onClick={() => onSocialLogin("google")}
          className="flex w-full items-center gap-3 rounded-xl border border-white/12 bg-ink-850 px-3.5 py-3 text-left text-[13px] text-white transition hover:bg-white/5 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-brand-400/60"
        >
          <span className="grid size-6 place-items-center rounded-lg bg-white/10">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-5.02 3.28-8.09" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.27-1.93-5.94-4.65H3.57v2.39h2.26c-.26 1.38.47 2.62 1.64 3.41 1.16.78 2.56 1.19 4.08 1.19 4.27 0 7.77-3.42 7.77-7.64 0-1.13-.1-2.24-.28-3.31H12v-3.14h-2.85c.3-.92.7-1.79 1.23-2.56l1.91-2.79c-1.12-.35-2.44-.56-3.86-.56-4.14 0-7.6 3.25-7.6 7.39 0 4.11 3.28 7.39 7.48 7.39 2.65 0 4.85-1.43 5.9-3.65l2.42 2.55c-1.45 1.48-3.58 2.4-5.98 2.4" />
            </svg>
          </span>
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => onSocialLogin("apple")}
          className="flex w-full items-center gap-3 rounded-xl border border-white/12 bg-ink-850 px-3.5 py-3 text-left text-[13px] text-white transition hover:bg-white/5 hover:border-white/20 focus-visible:ring-2 focus-visible:ring-brand-400/60"
        >
          <span className="grid size-6 place-items-center rounded-lg bg-white/10">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <path d="M12 2.04C6.5 2.04 2 6.55 2 12c0 1.27.25 2.48.7 3.58l-.87 1.28c-1.3-1.18-2.1-2.9-2.1-4.86 0-4.39 3.56-7.96 7.96-7.96s7.96 3.57 7.96 7.96c0 1.96-.8 3.68-2.1 4.86l-.87-1.28c.45-1.1.7-2.31.7-3.58 0-5.45-4.5-9.96-9.96-9.96" />
            </svg>
          </span>
          Continue with Apple
        </button>
      </div>
    </div>
  );
}

/* ── Password Strength Meter ───────────────────────────────────────── */

export function PasswordStrengthMeter({ value }: { value: string }) {
  const length = value.length >= 8;
  const uppercase = /[A-Z]/.test(value);
  const lowercase = /[a-z]/.test(value);
  const digit = /\d/.test(value);
  const special = /[^A-Za-z0-9]/.test(value);
  const score = [length, uppercase, lowercase, digit, special].filter(Boolean).length;

  const colorClass =
    score <= 2
      ? "text-rose-400 border-rose-400/40 bg-rose-500/10"
      : score <= 4
        ? "text-gold-400 border-gold-400/40 bg-gold-500/10"
        : "text-mint-400 border-mint-400/40 bg-emerald-500/10";

  const label = score <= 2 ? "Weak" : score <= 4 ? "Fair" : "Strong";

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between text-[10px] text-white/30">
        <span>Length (8+)</span>
        <span className={length ? "text-mint-400" : ""}>✓</span>
      </div>
      <div className="flex justify-between text-[10px] text-white/30">
        <span>Uppercase</span>
        <span className={uppercase ? "text-mint-400" : ""}>✓</span>
      </div>
      <div className="flex justify-between text-[10px] text-white/30">
        <span>Lowercase</span>
        <span className={lowercase ? "text-mint-400" : ""}>✓</span>
      </div>
      <div className="flex justify-between text-[10px] text-white/30">
        <span>Number</span>
        <span className={digit ? "text-mint-400" : ""}>✓</span>
      </div>
      <div className="flex justify-between text-[10px] text-white/30">
        <span>Special char</span>
        <span className={special ? "text-mint-400" : ""}>✓</span>
      </div>
      <div className="h-1.5 w-full rounded-full border border-white/8 bg-ink-750 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${colorClass}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className={`text-[11px] font-medium ${colorClass}`}>{label} password</p>
    </div>
  );
}

/* ── Captcha Verification (Slider Puzzle) ──────────────────────────── */

export function CaptchaVerification({
  onVerified,
}: {
  onVerified: (value: boolean) => void;
}) {
  const [verified, setVerified] = useState(false);
  const [sliderPos, setSliderPos] = useState(0);
  const [targetPos, setTargetPos] = useState(0);

  useEffect(() => {
    setTargetPos(Math.floor(Math.random() * 60) + 20);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      setSliderPos(Math.max(0, Math.min(100, dx)));
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (Math.abs(sliderPos - targetPos) < 12) {
        setVerified(true);
        onVerified(true);
      } else {
        setSliderPos(0);
        setTargetPos(Math.floor(Math.random() * 60) + 20);
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (verified) return null;

  return (
    <div
      className="mt-6 rounded-xl border border-white/12 bg-ink-850 p-4"
      role="alert"
      aria-label="Security verification"
    >
      <p className="mb-3 text-[11.5px] font-medium text-white/70">
        Verify you&apos;re human
      </p>
      <div
        className="relative h-8 w-full rounded-lg border border-white/10 bg-ink-900 overflow-hidden"
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute size-8 rounded-lg border border-brand-400/60 bg-brand-500/20 shadow-[0_0_12px_rgba(149,82,227,0.4)]"
          style={{ left: `${targetPos}%` }}
          aria-hidden="true"
        />
        <div
          className={`absolute top-0 size-8 rounded-lg border border-white/20 bg-white/5 transition-left duration-75 cursor-grab active:cursor-grabbing ${sliderPos > 0 ? "border-brand-400 bg-brand-500/10" : ""}`}
          style={{
            left: `${Math.max(0, Math.min(92, sliderPos))}%`,
            transform: `translateX(-${Math.max(0, Math.min(92, sliderPos))}%)`,
          }}
          aria-label="Drag the slider to the target"
        />
      </div>
      {!verified && (
        <p className="mt-2 text-[11px] text-white/40">
          Drag the slider to complete the puzzle.
        </p>
      )}
    </div>
  );
}
