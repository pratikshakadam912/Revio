"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* =========================================================
          EMAIL INPUT
      ========================================================== */}
      <div>
        <label
          htmlFor="email"
          className="mb-2.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400"
        >
          Email address
        </label>

        <div className="group relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-cyan-400" />

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
            className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-600 hover:border-white/20 hover:bg-slate-900/60 focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* =========================================================
          PASSWORD INPUT
      ========================================================== */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-[11px] font-bold uppercase tracking-widest text-slate-400"
          >
            Password
          </label>

          <button
            type="button"
            className="text-[11px] font-semibold text-cyan-400/80 transition-colors duration-200 hover:text-cyan-300"
          >
            Forgot password?
          </button>
        </div>

        <div className="group relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors duration-200 group-focus-within:text-cyan-400" />

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            autoComplete="current-password"
            className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-600 hover:border-white/20 hover:bg-slate-900/60 focus:border-indigo-500/50 focus:bg-slate-900/80 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* =========================================================
          ERROR ALERT
      ========================================================== */}
      {error && (
        <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3.5 backdrop-blur-xl">
          <div className="pointer-events-none absolute -left-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-rose-500/20 blur-2xl" />

          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/20 text-rose-400">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-xs font-bold text-rose-300">
                Sign in unsuccessful
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-rose-200/60">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SUBMIT BUTTON
      ========================================================== */}
      <button
        type="submit"
        disabled={loading}
        className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 text-sm font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {/* Shimmer sweep */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center gap-2">
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Signing in...
            </>
          ) : (
            <>
              Sign in to Revio
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </span>
      </button>

      {/* =========================================================
          SECURITY / STATUS NOTE
      ========================================================== */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-950/50 text-cyan-400">
          <Sparkles className="h-3 w-3" />
        </div>

        <span className="text-xs text-slate-500">
          End-to-end encrypted career intelligence platform.
        </span>
      </div>
    </form>
  );
}
