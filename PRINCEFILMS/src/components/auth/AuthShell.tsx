import { useId, useState, type ReactNode } from "react";
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
