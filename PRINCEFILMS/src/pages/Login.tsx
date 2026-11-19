import { ArrowRight } from "lucide-react";
import { useState } from "react";
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
  PasswordField,
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
  const [fieldError, setFieldError] = useState<{ identifier?: string; password?: string }>({});

  const still = getTitleById("city-of-shadows")?.image ?? "";
  const from = (location.state as { from?: string } | null)?.from;

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
      navigate(from ?? "/my-list", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed. Try again.");
    }
  };

  return (
    <AuthLayout image={still} imageAlt="City of Shadows — still, photo by Valentin Lacoste on Unsplash">
      <Logo className="mb-8 lg:hidden" />
      <h1 className="font-display text-[32px] leading-none text-text">Sign in</h1>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
        Pick up the title you were watching and keep your saved list.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        <AuthModeToggle
          mode={mode}
          onChange={(next) => {
            setMode(next);
            setFieldError({});
          }}
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
          hint={fieldError.password}
        />

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

      <p className="mt-5 text-[12.5px] text-white/40">
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
