import Link from "next/link";
import { ArrowLeft, Check, Sparkles, ShieldCheck, Zap } from "lucide-react";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Electric indigo glow — top left */}
        <div className="absolute -left-[280px] -top-[260px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Cyan ambient glow — top right */}
        <div className="absolute -right-[280px] top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Ambient center field */}
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/30 blur-[170px]" />

        {/* Bottom ambient glow */}
        <div className="absolute -bottom-[400px] left-1/2 h-[750px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/15 via-indigo-600/10 to-transparent blur-[160px]" />

        {/* Precise radial matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ambient neon particles */}
        <div className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
        <div className="absolute left-[28%] bottom-[18%] h-1 w-1 rounded-full bg-indigo-400" />
        <div className="absolute right-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        <div className="absolute right-[30%] bottom-[20%] h-1 w-1 rounded-full bg-cyan-400" />
      </div>

      {/* ============================================================
          MAIN CONTAINER
      ============================================================ */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_520px] lg:gap-16">
          {/* ========================================================
              LEFT — BRAND / VALUE PROPOSITION
          ======================================================== */}
          <div className="hidden lg:block">
            {/* Logo */}
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-xl font-black tracking-tight text-white"
            >
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.45)]">
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                <Sparkles className="relative z-10 h-4 w-4" />
              </span>
              Revio
              <span className="text-cyan-400">.</span>
            </Link>

            <div className="mt-16 max-w-xl">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                </span>
                Start Free with AI Credits
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-balance text-5xl font-black leading-[1.02] tracking-tight text-white xl:text-[64px]">
                Your next role{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  starts here.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-400">
                Join over 50,000+ candidates engineering high-converting resumes
                with quantified STAR bullet points and instant ATS verification.
              </p>

              {/* Value Checklist */}
              <div className="mt-8 space-y-3.5">
                {[
                  "AI STAR achievement rewriter",
                  "ATS structural audit (Greenhouse, Lever, Workday)",
                  "Job description keyword alignment matrix",
                  "LaTeX and single-column PDF export engines",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-slate-300"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Bottom Telemetry Signal */}
              <div className="mt-12 flex items-center gap-4 pt-6 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>SOC2 Type II Certified</span>
                </div>
                <span className="h-1 w-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT — REGISTER GLASS CARD
          ======================================================== */}
          <div className="w-full">
            {/* Mobile Brand Logo */}
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-xl font-black tracking-tight text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                  <Sparkles className="h-4 w-4" />
                </span>
                Revio
                <span className="text-cyan-400">.</span>
              </Link>
            </div>

            {/* Outer Glass Shell */}
            <div className="relative rounded-[36px] border border-white/10 bg-slate-900/60 p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-3.5">
              {/* Inner Shell */}
              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-slate-950/85 px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-9 sm:py-10">
                {/* Top Border Glow Line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

                {/* Inner Glows */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-[380px] w-[380px] rounded-full bg-indigo-600/15 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[100px]" />

                <div className="relative">
                  {/* Back Link */}
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-cyan-300"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Revio
                  </Link>

                  {/* Header */}
                  <div className="mt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-950/50 text-cyan-300 shadow-[0_0_25px_rgba(99,102,241,0.25)]">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <h2 className="mt-5 text-balance text-3xl font-black tracking-tight text-white sm:text-4xl">
                      Create your account.
                    </h2>

                    <p className="mt-2 text-sm text-slate-400">
                      Start building a resume engineered to convert recruiter
                      attention into interviews.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-7 h-px bg-white/[0.08]" />

                  {/* Register Form */}
                  <RegisterForm />

                  {/* Login Callout */}
                  <p className="mt-7 text-center text-xs text-slate-400">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Compliance Micro-copy */}
            <p className="mt-5 text-center text-[11px] text-slate-500">
              By creating an account, you agree to Revio&apos;s{" "}
              <Link href="/terms" className="underline hover:text-slate-300">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-slate-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
