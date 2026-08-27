"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Sparkles,
  Target,
  WandSparkles,
  BarChart3,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0A0D14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* =========================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ========================================================== */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top-left electric indigo glow */}
        <div className="absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/15 to-transparent blur-[140px]" />

        {/* Top-right cyan glow */}
        <div className="absolute -right-40 top-12 h-[550px] w-[550px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-500/10 to-transparent blur-[150px]" />

        {/* Center ambient field */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/30 blur-[160px]" />

        {/* Precise dotted grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Subtle scanline fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0D14] to-transparent" />
      </div>

      {/* =========================================================
          HERO CONTENT
      ========================================================== */}
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-12 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* =====================================================
              LEFT COLUMN
          ====================================================== */}
          <div className="relative z-10">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              AI-Powered Career Intelligence
            </div>

            {/* Main Headline */}
            <h1 className="mt-7 text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[68px] xl:text-[76px]">
              Turn your resume into{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                unfair leverage.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Engineered for modern hiring algorithms. Revio audits your bullet
              points against real recruiter telemetry, surfaces quantified
              impact, and locks in a 95%+ ATS pass rate.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                href="/dashboard/resume"
                className="group inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-7 text-sm font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)]"
              >
                Analyze my resume
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/templates"
                className="group inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 px-6 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-800/80 hover:text-white"
              >
                Explore templates
                <Sparkles className="ml-2 h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:rotate-12" />
              </Link>
            </div>

            {/* Micro Trust Proofs */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/[0.07]">
              {[
                "Greenhouse & Lever Ready",
                "STAR Impact Framework",
                "Instant Real-Time Audit",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
              RIGHT COLUMN: INTERACTIVE GLASS CONSOLE
          ====================================================== */}
          <div className="relative mx-auto w-full max-w-[640px]">
            {/* Ambient Background Backlight */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

            {/* Floating Top Indicator */}
            <div className="absolute -right-3 -top-6 z-30 hidden animate-[heroFloat_6s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    ATS Match Index
                  </p>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    Top 2% Percentile
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </p>
                </div>
              </div>
            </div>

            {/* Main Application Window Shell */}
            <div className="relative rounded-[28px] border border-white/10 bg-slate-900/75 p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-700 hover:border-indigo-500/30">
              {/* Window Title Bar */}
              <div className="flex h-11 items-center justify-between rounded-[20px] border border-white/[0.06] bg-slate-950/70 px-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/40 border border-rose-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/40 border border-amber-500/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-slate-900 px-4 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400">
                    revio.engine.v2.ai
                  </span>
                </div>

                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Console Body */}
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-[145px_1fr]">
                {/* Sidebar Navigation Mock */}
                <div className="hidden rounded-2xl border border-white/[0.06] bg-slate-950/50 p-3 sm:flex sm:flex-col sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 px-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                        R
                      </div>
                      <span className="text-xs font-bold text-white tracking-tight">
                        Diagnostics
                      </span>
                    </div>

                    <div className="mt-6 space-y-1">
                      {[
                        { name: "Overview", active: true },
                        { name: "Parser Graph", active: false },
                        { name: "Keyword Gaps", active: false },
                        { name: "Format Test", active: false },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                            item.active
                              ? "bg-indigo-500/15 text-cyan-300 border border-indigo-500/30"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Tokens Counter */}
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-2.5">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <div>
                        <p className="text-[9px] font-bold text-slate-300">
                          AI Engine
                        </p>
                        <p className="text-[8px] text-cyan-400 font-mono">
                          Ready & Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Diagnostic Panel */}
                <div className="rounded-2xl border border-white/[0.06] bg-slate-950/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                        Live Scorecard
                      </p>
                      <h3 className="mt-1 text-sm font-bold text-white tracking-tight">
                        Executive Impact Analysis
                      </h3>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300">
                      <Target className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Score Meter Card */}
                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-slate-900/90 p-3.5 shadow-inner">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Algorithm Compatibility
                        </span>
                        <div className="mt-0.5 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">
                            94
                          </span>
                          <span className="text-xs text-slate-500 font-bold">
                            /100
                          </span>
                        </div>
                      </div>
                      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        OPTIMAL
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                    </div>
                  </div>

                  {/* Mini Diagnostic Cards */}
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {/* Resume State */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/60 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                          <FileText className="h-3 w-3" />
                        </div>
                        <span className="text-[9px] text-emerald-400 font-mono">
                          98% Parsed
                        </span>
                      </div>
                      <p className="mt-3 text-[11px] font-bold text-white truncate">
                        Senior_Tech_Lead.pdf
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="h-1 w-full rounded-full bg-slate-700" />
                        <div className="h-1 w-4/5 rounded-full bg-slate-700" />
                      </div>
                    </div>

                    {/* AI Rewrite Notice */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/60 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                          <WandSparkles className="h-3 w-3" />
                        </div>
                        <span className="text-[9px] text-cyan-400 font-mono">
                          6 Suggestions
                        </span>
                      </div>
                      <p className="mt-3 text-[11px] font-bold text-white truncate">
                        STAR Bullet Polish
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="h-1 w-full rounded-full bg-indigo-400/40" />
                        <div className="h-1 w-3/5 rounded-full bg-indigo-400/40" />
                      </div>
                    </div>
                  </div>

                  {/* Highlight Recommendation */}
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/50 to-slate-900/50 p-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-indigo-200 truncate">
                        Metric Density Boost
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        Swapped 3 passive duties for quantifiable revenue
                        impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Bottom Left Chip */}
            <div className="absolute -bottom-6 -left-4 z-30 hidden animate-[heroFloat_7s_ease-in-out_infinite] rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white">
                    99.4% Keyword Match
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Tailored for Tier-1 Tech
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            FOOTER CAPABILITY BAR
        ========================================================== */}
        <div className="mt-16 border-t border-white/[0.08] pt-8 sm:mt-24">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              End-to-End Resume Intelligence Engine
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                "Instant ATS Parse Test",
                "STAR Impact Transformer",
                "Role-Specific Keyword Injection",
                "LaTeX & Clean PDF Export",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Keyframe */}
      <style jsx>{`
        @keyframes heroFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
}
