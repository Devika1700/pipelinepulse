import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { getErrorMessage } from "../lib/errors";
const INPUT =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-smfocus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";
export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { status, login, register } = useAuth();
  const location = useLocation();
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";
  if (status === "loading") return null;
  if (status === "authenticated") return <Navigate to={from} replace />;
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bgwhite p-6 shadow-sm">
        <h1 className="text-lg font-semibold">
          {isRegister ? "Create your account" : "Sign in to PipelinePulse"}
        </h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {isRegister && (
            <label className="block text-sm font-medium">
              Name
              <input
                className={INPUT}
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}
          <label className="block text-sm font-medium">
            Email
            <input
              className={INPUT}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              className={INPUT}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 8 : undefined}
              required
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm fontmedium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting
              ? "Please wait…"
              : isRegister
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          {isRegister ? "Already have an account? " : "New here? "}
          <Link
            className="font-medium text-blue-600 hover:underline"
            to={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
        {!isRegister && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Demo account: demo@pipelinepulse.dev / Demo12345!
          </p>
        )}
      </div>
    </main>
  );
}
