import { ArrowRight, Check } from "lucide-react";
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

export function Register() {
  useDocumentTitle("Create an account");
  const { register, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{ name?: string; identifier?: string }>({});
  const [success, setSuccess] = useState("");

  const still = getTitleById("the-sound-booth")?.image ?? "";
  const from = (location.state as { from?: string } | null)?.from;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const nextErrors: typeof fieldError = {};
    if (!name.trim()) nextErrors.name = "Enter the name to show on your account.";
    if (!identifier.trim()) {
      nextErrors.identifier = mode === "email" ? "Enter an email address." : "Enter a phone number.";
    }
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length || password.length < 6) return;

    try {
      await register({ name, identifier, password, provider: mode });
      setSuccess("Account created. Opening your list.");
      window.setTimeout(() => navigate(from ?? "/my-list", { replace: true }), 700);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the account.");
    }
  };

  return (
    <AuthLayout image={still} imageAlt="The Sound Booth — still, photo by Jacob Mejicanos on Unsplash">
      <Logo className="mb-8 lg:hidden" />
      <h1 className="font-display text-[32px] leading-none text-text">Create an account</h1>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
        Save titles, keep your place and continue on the same device.
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

        <p className="flex items-center gap-1.5 text-[11.5px] text-white/35">
          <Check size={12} className={password.length >= 6 ? "text-mint-400" : "text-white/20"} aria-hidden="true" />
          {password.length >= 6 ? "Password meets the length rule." : "At least 6 characters required."}
        </p>

        {error && <AuthNotice tone="error">{error}</AuthNotice>}
        {success && <AuthNotice tone="success">{success}</AuthNotice>}
        {isAuthenticating && <AuthNotice tone="success">Creating the account on this device…</AuthNotice>}

        <button
          type="submit"
          disabled={isAuthenticating || !passwordValid(password)}
          className={buttonClass({ size: "lg", className: "w-full" })}
        >
          Create account
          {!isAuthenticating && <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </form>

      <p className="mt-5 text-[12.5px] text-white/40">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-brand-200 hover:text-brand-100">
          Sign in
        </Link>
      </p>

      <p className="mt-8 border-t border-white/[0.07] pt-4 text-[11.5px] leading-relaxed text-white/30">
        Accounts and lists are stored in this browser only. Nothing is sent to a server.
      </p>
    </AuthLayout>
  );
}

function passwordValid(value: string): boolean {
  return value.length >= 6;
}
