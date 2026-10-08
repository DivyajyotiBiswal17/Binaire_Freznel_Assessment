import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "./AuthForm";

export default function AuthPage({ mode }: { mode: "signin" | "signup" }) {
  const { user, ready } = useAuth();
  if (ready && user) return <Navigate to="/" replace />;

  const isSignUp = mode === "signup";
  return (
    <div className="mx-auto max-w-md py-6">
      <section aria-labelledby="auth-h" className="bg-black/30 p-6 shadow-xl">
        <h1 id="auth-h" className="mb-1 text-2xl font-light text-white">
          {isSignUp ? "Create your account" : "Sign in"}
        </h1>
        <p className="mb-5 text-sm text-steam-muted">
          {isSignUp ? "Join to save your place in the store." : "Welcome back."}
        </p>
        <AuthForm mode={mode} />
      </section>
    </div>
  );
}