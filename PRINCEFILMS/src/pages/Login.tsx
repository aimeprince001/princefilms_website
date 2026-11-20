import {
  ArrowRight,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

export function Login() {
  useDocumentTitle("Sign in");
  const { login, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{
    identifier?: string;
    password?: string;
  }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetStep, setResetStep] = useState<"request" | "code" | "reset" | "done">("request");
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [sessionWarned, setSessionWarned] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const still = getTitleById("city-of-shadows")?.image ?? "";
  const from = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSessionWarned(true);
      }, 30 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  const handleSocialLogin = useCallback(
    async (provider: "google" | "apple") => {
      setError("");
      await new Promise((r) => setTimeout(r, 1500));
      setError(
        `Connected via ${provider.charAt(0).toUpperCase() + provider.slice(1)}. Redirecting…`,
      );
      navigate(from ?? "/profile", { replace: true });
    },
    [from, navigate],
  );

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const nextErrors: typeof fieldError = {};
    if (!identifier.trim()) {
      nextErrors.identifier =
        mode === "email" ? "Enter your email address." : "Enter your phone number.";
    }
    if (!password) nextErrors.password = "Enter your password.";
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      await login({ identifier, password });
      if (rememberMe) {
        localStorage.setItem("pf.remember", identifier);
      }
      navigate(from ?? "/profile", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed. Try again.");
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!resetIdentifier.trim()) {
      setError("Enter your email or phone to recover your account.");
      return;
    }
    setResetStep("code");
  };

  const handleResetVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (resetCode.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setResetStep("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setResetStep("done");
  };

  const getFieldIcon = () => (mode === "email" ? <Mail size={16} /> : <Phone size={16} />);

  return (
    <AuthLayout image={still} imageAlt="City of Shadows — still, photo by Valentin Lacoste on Unsplash">
      <div className="flex items-start justify-between mb-8">
        <Logo className="lg:hidden" />
        {sessionWarned && (
          <AuthNotice tone="error">
            Your session has expired due to inactivity. Please sign in again.
          </AuthNotice>
        )}
      </div>
      <h1 className="font-display text-[36px] leading-none text-text">Welcome back</h1>
      <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
        Sign in to continue watching and keep your saved list across devices.
      </p>

      {showForgot ? (
        <div className="mt-7 space-y-4 animate-fade-in">
          <h2 className="font-display text-[24px] leading-none text-text">Forgot password?</h2>
          <p className="text-[13px] text-muted">
            No worries. We&apos;ll help you regain access to your account.
          </p>
          {resetStep === "request" && (
            <form onSubmit={handleResetRequest} className="mt-5 space-y-4" noValidate>
              <AuthField
                label="Email or phone"
                type={mode === "email" ? "email" : "tel"}
                inputMode={mode === "email" ? "email" : "tel"}
                placeholder={mode === "email" ? "you@example.com" : "+250 7XX XXX XXX"}
                value={resetIdentifier}
                onChange={(e) => setResetIdentifier(e.target.value)}
              />
              <button
                type="submit"
                disabled={isAuthenticating}
                className={buttonClass({ size: "lg", className: "w-full" })}
              >
                Send recovery code
              </button>
            </form>
          )}
          {resetStep === "code" && (
            <div className="mt-5 space-y-4">
              <p className="text-[13px] text-muted">
                A 6-digit code has been sent to{" "}
                <span className="text-brand-200 font-medium">{resetIdentifier}</span>.
              </p>
              <AuthField
                label="Verification code"
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetStep("request");
                    setResetIdentifier("");
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/12 bg-ink-850 text-[13px] text-white/60 transition hover:bg-white/5"
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={handleResetVerify}
                  disabled={isAuthenticating}
                  className={buttonClass({ size: "lg", className: "w-full" })}
                >
                  Verify
                </button>
              </div>
            </div>
          )}
          {resetStep === "reset" && (
            <div className="mt-5 space-y-4">
              <p className="text-[13px] text-muted">
                Code verified. Create a new password.
              </p>
              <PasswordField label="New password" value={newPassword} onChange={setNewPassword} />
              <PasswordStrengthMeter value={newPassword} />
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isAuthenticating || newPassword.length < 6}
                className={buttonClass({ size: "lg", className: "w-full" })}
              >
                Reset password
              </button>
            </div>
          )}
          {resetStep === "done" && (
            <div className="mt-5 text-center py-8 rounded-xl border border-mint-400/25 bg-emerald-500/10">
              <ShieldCheck size={32} className="mx-auto mb-3 text-mint-400" aria-hidden="true" />
              <h3 className="font-display text-[18px] text-text">Password reset!</h3>
              <p className="mt-1 text-[12.5px] text-muted">
                Your password has been updated. You can now sign in.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setResetStep("request");
                  setResetIdentifier("");
                  setResetCode("");
                  setNewPassword("");
                }}
                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand-200 hover:text-brand-100"
              >
                Sign in <ArrowRight size={13} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowForgot(false)}
            className="mt-6 text-[12px] font-medium text-brand-200 hover:text-brand-100"
          >
            ← Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-7 space-y-5" noValidate>
          <AuthModeToggle
            mode={mode}
            onChange={(next) => {
              setMode(next);
              setFieldError({});
            }}
          />

          <div className="relative">
            {getFieldIcon()}
            <AuthField
              label={mode === "email" ? "Email address" : "Phone number"}
              type={mode === "email" ? "email" : "tel"}
              inputMode={mode === "email" ? "email" : "tel"}
              autoComplete={mode === "email" ? "email" : "tel"}
              placeholder={mode === "email" ? "you@example.com" : "+250 7XX XXX XXX"}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              error={fieldError.identifier}
              id={`${mode}-identifier`}
            />
          </div>

          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            hint={fieldError.password}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-ink-850 text-brand-500 focus:ring-brand-400"
              />
              <span className="text-[12.5px] text-white/70">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-[12.5px] font-medium text-brand-200 hover:text-brand-100"
            >
              Forgot password?
            </button>
          </div>

          {error && <AuthNotice tone="error">{error}</AuthNotice>}

          <button
            type="submit"
            disabled={isAuthenticating}
            className={buttonClass({ size: "lg", className: "w-full" })}
          >
            {isAuthenticating ? "Signing in…" : "Sign in"}
            {!isAuthenticating && <ArrowRight size={16} aria-hidden="true" />}
          </button>
        </form>
      )}

      <SocialAuthButtons onSocialLogin={handleSocialLogin} />

      <p className="mt-6 text-[12.5px] text-white/40">
        No account?{" "}
        <Link to="/register" className="ml-1 font-medium text-brand-200 hover:text-brand-100">
          Create one
        </Link>
      </p>

      <p className="mt-8 border-t border-white/[0.07] pt-4 text-[11.5px] leading-relaxed text-white/30">
        Accounts in this catalogue are stored in this browser. Creating an account keeps
        your saved titles and playback position on this device.
      </p>
    </AuthLayout>
  );
}
