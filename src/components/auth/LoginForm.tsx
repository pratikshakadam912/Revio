"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getSafeRedirectPath(): string {
    const destination =
      searchParams.get("redirect") || searchParams.get("callbackUrl");

    // Only allow local application paths.
    if (
      destination &&
      destination.startsWith("/") &&
      !destination.startsWith("//") &&
      !destination.includes("\\") &&
      !/[\r\n]/.test(destination)
    ) {
      return destination;
    }

    return "/dashboard";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.replace(getSafeRedirectPath());
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[#858A83]"
        >
          Email address
        </label>

        <div className="group relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858A83] transition-colors duration-200 group-focus-within:text-[#315E50]" />

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
            className="h-14 w-full rounded-2xl border border-[#E7E5DC] bg-white/65 pl-11 pr-4 text-sm text-[#263B33] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-[#A5A69F] hover:border-[#D9C5A2] focus:border-[#719681] focus:bg-white/90 focus:ring-4 focus:ring-[#719681]/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#858A83]"
          >
            Password
          </label>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="cursor-pointer text-[11px] font-semibold text-[#315E50] transition-colors duration-200 hover:text-[#719681]"
          >
            Forgot password?
          </button>
        </div>

        <div className="group relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858A83] transition-colors duration-200 group-focus-within:text-[#315E50]" />

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
            className="h-14 w-full rounded-2xl border border-[#E7E5DC] bg-white/65 pl-11 pr-4 text-sm text-[#263B33] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-[#A5A69F] hover:border-[#D9C5A2] focus:border-[#719681] focus:bg-white/90 focus:ring-4 focus:ring-[#719681]/10 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="relative overflow-hidden rounded-2xl border border-[#B97862]/25 bg-[#B97862]/[0.07] px-4 py-3.5"
        >
          <div className="pointer-events-none absolute -left-8 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-[#B97862]/10 blur-2xl" />

          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#B97862]/30 bg-[#B97862]/10 text-[#B97862]">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#9E5948]">
                Sign in unsuccessful
              </p>

              <p className="mt-0.5 text-[11px] leading-4 text-[#9E5948]/80">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="group relative flex h-14 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl border border-[#315E50] bg-gradient-to-r from-[#315E50] to-[#426F5D] text-sm font-bold text-white shadow-[0_8px_24px_rgba(49,94,80,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(49,94,80,0.25)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center gap-2">
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

      {/* Trust message */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#D9C5A2]/50 bg-[#D9C5A2]/15 text-[#315E50]">
          <Sparkles className="h-3 w-3" />
        </div>

        <span className="text-xs text-[#858A83]">
          Your career journey, thoughtfully managed.
        </span>
      </div>
    </form>
  );
}
