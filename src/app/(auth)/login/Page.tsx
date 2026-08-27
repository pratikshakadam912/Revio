import Link from "next/link";
import {
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* =========================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Electric indigo glow — top left */}
        <div className="absolute -left-[300px] -top-[280px] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Cyan glow — right side */}
        <div className="absolute -right-[300px] top-[10%] h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Ambient center field */}
        <div className="absolute left-1/2 top-1/2 h-[650px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/30 blur-[170px]" />

        {/* Bottom ambient glow */}
        <div className="absolute -bottom-[400px] left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/15 via-indigo-600/10 to-transparent blur-[160px]" />

        {/* Precise radial matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ambient neon particles */}
        <div className="absolute left-[12%] top-[20%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
        <div className="absolute left-[20%] bottom-[22%] h-1 w-1 rounded-full bg-indigo-400" />
        <div className="absolute right-[13%] top-[30%] h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        <div className="absolute right-[24%] bottom-[18%] h-1 w-1 rounded-full bg-cyan-400" />
      </div>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/60 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* =====================================================
              LEFT — BRAND / SHOWCASE
          ====================================================== */}
          <div className="relative hidden overflow-hidden border-r border-white/[0.08] bg-slate-950/70 p-10 lg:block xl:p-14">
            {/* Top border neon edge */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {/* Inner atmospheric glows */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 bottom-[-120px] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[120px]" />

            <div className="relative flex h-full flex-col">
              {/* Logo */}
              <Link
                href="/"
                className="group flex w-fit items-center gap-3 text-lg font-black tracking-tight text-white"
              >
                <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.45)]">
                  <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                  <Sparkles className="relative z-10 h-4 w-4" />
                </span>
                Revio
                <span className="text-cyan-400">.</span>
              </Link>

              {/* Main Copy */}
              <div className="mt-auto pt-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  </span>
                  AI-Powered Career Intelligence
                </div>

                {/* Heading */}
                <h2 className="mt-7 max-w-lg text-balance text-4xl font-black leading-[1.04] tracking-tight text-white xl:text-5xl">
                  Build a resume{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                    engineered to convert.
                  </span>
                </h2>

                {/* Description */}
                <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
                  Write faster with STAR executive frameworks, diagnose syntax
                  gaps, and bypass ATS screening with real recruiter telemetry.
                </p>

                {/* Benefits List */}
                <div className="mt-8 space-y-3">
                  {[
                    "Quantified STAR impact rewriter",
                    "Real-time ATS parsing audit engine",
                    "Role-matched keyword density matrix",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs font-medium text-slate-300"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <Check className="h-3 w-3" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Mini Live Preview Window */}
                <div className="relative mt-8 max-w-lg">
                  {/* Preview glow */}
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[60px]" />

                  {/* Preview shell */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-2 shadow-2xl backdrop-blur-xl">
                    {/* Browser bar */}
                    <div className="flex h-8 items-center justify-between rounded-xl border border-white/[0.06] bg-slate-950/80 px-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500/40" />
                        <span className="h-2 w-2 rounded-full bg-amber-500/40" />
                        <span className="h-2 w-2 rounded-full bg-emerald-500/40" />
                      </div>
                      <div className="h-3.5 w-24 rounded-full bg-white/[0.05]" />
                      <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300">
                        <Zap className="h-2.5 w-2.5" />
                        98% ATS
                      </div>
                    </div>

                    <div className="grid grid-cols-[95px_1fr] gap-2 p-2.5">
                      {/* Mini sidebar */}
                      <div className="rounded-xl border border-white/[0.06] bg-slate-950/60 p-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-4 w-4 items-center justify-center rounded bg-indigo-600 text-[8px] font-bold text-white">
                            R
                          </div>
                          <span className="text-[8px] font-bold text-white">
                            Editor
                          </span>
                        </div>
                        <div className="mt-3 space-y-1">
                          {["Summary", "Experience", "Skills"].map(
                            (item, index) => (
                              <div
                                key={item}
                                className={`rounded px-1.5 py-0.5 text-[7px] font-medium ${
                                  index === 1
                                    ? "border border-indigo-500/30 bg-indigo-500/15 text-cyan-300"
                                    : "text-slate-500"
                                }`}
                              >
                                {item}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Mini resume paper */}
                      <div className="rounded-xl border border-white/[0.06] bg-slate-950/90 p-3 shadow-sm">
                        <div className="border-b border-white/[0.08] pb-2">
                          <div className="h-2 w-20 rounded bg-slate-200" />
                          <div className="mt-1 h-1.5 w-28 rounded bg-slate-600" />
                        </div>
                        <div className="mt-2.5 space-y-1.5">
                          <div className="h-1.5 w-12 rounded bg-indigo-400" />
                          <div className="h-1 w-full rounded bg-slate-700" />
                          <div className="h-1 w-[88%] rounded bg-slate-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating AI badge */}
                  <div className="absolute -right-3 -top-3 rounded-xl border border-white/10 bg-slate-900/90 p-2.5 shadow-xl backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/15 text-cyan-300">
                        <WandSparkles className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-white">
                          STAR Engine
                        </p>
                        <p className="text-[7px] font-mono text-cyan-400">
                          +42% Impact Score
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT — AUTH LOGIN PANEL
          ====================================================== */}
          <div className="relative flex items-center justify-center bg-slate-950/80 px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
            {/* Corner ambient glow */}
            <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

            <div className="relative w-full max-w-md">
              {/* Mobile Brand Header */}
              <Link
                href="/"
                className="mb-10 flex w-fit items-center gap-2.5 text-lg font-black tracking-tight text-white lg:hidden"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                  <Sparkles className="h-4 w-4" />
                </span>
                Revio
                <span className="text-cyan-400">.</span>
              </Link>

              {/* Login Title & Icon */}
              <div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-950/50 text-cyan-300 shadow-[0_0_25px_rgba(99,102,241,0.25)]">
                  <FileText className="h-5 w-5" />
                </div>

                <h1 className="mt-6 text-balance text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Welcome back.
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                  Sign in to access your resumes, audits, and tailored
                  applications.
                </p>
              </div>

              {/* Login Form */}
              <div className="mt-8">
                <LoginForm />
              </div>

              {/* Register Callout */}
              <p className="mt-8 text-center text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
                >
                  Create an account
                </Link>
              </p>

              {/* Security Badge */}
              <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.08] pt-6 text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  256-bit encrypted authentication &bull; SOC2 compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
