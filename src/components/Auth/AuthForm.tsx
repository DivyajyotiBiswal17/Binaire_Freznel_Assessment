import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/auth/AuthService";
import { AuthErrors } from "@/auth/AuthErrors";
import { AuthValidator, type Credentials, type FieldErrors } from "@/auth/AuthValidator";
import { useConnectivity } from "@/hooks/useConnectivity";
import TextField from "./TextField";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignUp = mode === "signup";
  const navigate = useNavigate();
  const offline = useConnectivity() === "offline";

  const [values, setValues] = useState<Credentials>({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof Credentials) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || offline) return;

    const errs = isSignUp ? AuthValidator.signUp(values) : AuthValidator.signIn(values);
    setErrors(errs);
    setFormError("");
    const first = Object.keys(errs)[0];
    if (first) { document.getElementById(`field-${first}`)?.focus(); return; }

    setBusy(true);
    try {
      if (isSignUp) await authService.signUp(values.name.trim(), values.email.trim(), values.password);
      else await authService.signIn(values.email.trim(), values.password);
      navigate("/", { replace: true });
    } catch (err) {
      setFormError(AuthErrors.message(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {formError && (
        <p key={formError} role="alert" className="animate-[shake_.4s] rounded-sm bg-red-950/60 px-3 py-2 text-sm text-red-200">
          {formError}
        </p>
      )}
      {offline && (
        <p className="rounded-sm bg-black/30 px-3 py-2 text-sm text-steam-text">
          You're offline. {isSignUp ? "Creating an account" : "Signing in"} needs an internet connection.
        </p>
      )}

      {isSignUp && (
        <TextField name="name" label="Display name" autoComplete="name"
          value={values.name} onChange={set("name")} error={errors.name} />
      )}
      <TextField name="email" label="Email address" type="email" autoComplete="email"
        value={values.email} onChange={set("email")} error={errors.email} />
      <TextField name="password" label="Password" type="password"
        autoComplete={isSignUp ? "new-password" : "current-password"}
        value={values.password} onChange={set("password")} error={errors.password}
        hint={isSignUp ? "At least 6 characters." : undefined} />
      {isSignUp && (
        <TextField name="confirm" label="Confirm password" type="password" autoComplete="new-password"
          value={values.confirm} onChange={set("confirm")} error={errors.confirm} />
      )}

      <button type="submit" disabled={busy || offline} aria-busy={busy}
        className="w-full rounded-sm bg-gradient-to-r from-[#75b022] to-[#588a1b] px-4 py-2.5 font-medium text-white transition
          hover:brightness-110 active:scale-[0.98] active:brightness-95
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
          disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? (isSignUp ? "Creating account…" : "Signing in…") : isSignUp ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-steam-muted">
        {isSignUp ? "Already have an account? " : "New here? "}
        <Link to={isSignUp ? "/login" : "/signup"}
          className="text-steam-blue transition hover:text-white focus-visible:outline-2 focus-visible:outline-steam-blue">
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
