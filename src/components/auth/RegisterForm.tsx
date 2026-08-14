"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2.5 block text-xs font-semibold tracking-wide text-[#344054]"
        >
          Full name
        </label>

        <div className="group relative">
          <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A1B2] transition-colors group-focus-within:text-[#4F7DF3]" />

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            required
            disabled={loading}
            autoComplete="name"
            className="h-13 w-full rounded-2xl border border-[#DDE3EC] bg-[#FBFCFE] pl-11 pr-4 text-sm text-[#172033] outline-none transition-all duration-200 placeholder:text-[#A5ADBA] hover:border-[#C9D2E0] focus:border-[#4F7DF3] focus:bg-white focus:ring-4 focus:ring-[#4F7DF3]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2.5 block text-xs font-semibold tracking-wide text-[#344054]"
        >
          Email address
        </label>

        <div className="group relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A1B2] transition-colors group-focus-within:text-[#4F7DF3]" />

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
            className="h-13 w-full rounded-2xl border border-[#DDE3EC] bg-[#FBFCFE] pl-11 pr-4 text-sm text-[#172033] outline-none transition-all duration-200 placeholder:text-[#A5ADBA] hover:border-[#C9D2E0] focus:border-[#4F7DF3] focus:bg-white focus:ring-4 focus:ring-[#4F7DF3]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2.5 block text-xs font-semibold tracking-wide text-[#344054]"
        >
          Password
        </label>

        <div className="group relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98A1B2] transition-colors group-focus-within:text-[#4F7DF3]" />

          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            disabled={loading}
            autoComplete="new-password"
            className="h-13 w-full rounded-2xl border border-[#DDE3EC] bg-[#FBFCFE] pl-11 pr-4 text-sm text-[#172033] outline-none transition-all duration-200 placeholder:text-[#A5ADBA] hover:border-[#C9D2E0] focus:border-[#4F7DF3] focus:bg-white focus:ring-4 focus:ring-[#4F7DF3]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8A93A3]">
          <Check className="h-3 w-3 text-[#4F7DF3]" />
          Use at least 8 characters
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#F1D8D2] bg-[#FFF7F5] px-4 py-3.5">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FBE5DF] text-[#C96F4F]">
            <span className="text-[10px] font-bold">!</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#9E5540]">
              Couldn't create your account
            </p>

            <p className="mt-0.5 text-[11px] leading-4 text-[#B16D5A]">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="group flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#4F7DF3] text-sm font-semibold text-white shadow-[0_10px_25px_rgba(79,125,243,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#416FE8] hover:shadow-[0_16px_35px_rgba(79,125,243,0.26)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating account...
          </>
        ) : (
          <>
            Create my account
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>

      {/* Bottom note */}
      <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-[#8A93A3]">
        <Sparkles className="h-3 w-3 text-[#4F7DF3]" />
        <span>Start building your career story with Revio.</span>
      </div>
    </form>
  );
}
