"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Target,
  FileText,
  Zap,
  WandSparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  BarChart3,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const steps = [
  {
    number: "01",
    badge: "SMART INGESTION",
    title: "Drop in your raw story.",
    description:
      "Paste bullet points, upload an old PDF, or sync LinkedIn. Our parser breaks your career into high-yield, structured skill nodes.",
    highlight: "Multi-format ingest",
  },
  {
    number: "02",
    badge: "AI SYNTHESIS",
    title: "Watch impact metrics emerge.",
    description:
      "Transform passive duties into quantified achievements using standard executive frameworks (Action + Context + Metric).",
    highlight: "Quantified impact",
  },
  {
    number: "03",
    badge: "ATS BENCHMARKING",
    title: "Outrank 95% of candidates.",
    description:
      "Real-time keyword heatmaps, formatting checks, and role-tailored ATS alignment to pass algorithmic screening instantly.",
    highlight: "Instant verification",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const next = () => setActiveStep((current) => (current + 1) % steps.length);
  const previous = () =>
    setActiveStep((current) => (current - 1 + steps.length) % steps.length);

  return (
    <section
      className="relative overflow-hidden bg-[#0A0D14] px-5 py-24 text-slate-100 sm:px-8 lg:px-12 lg:py-32 selection:bg-indigo-500 selection:text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Dynamic Background Atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-600/20 via-sky-500/10 to-transparent blur-[140px]" />
        <div className="absolute -right-48 top-1/3 h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-cyan-500/15 via-indigo-600/10 to-transparent blur-[150px]" />
        <div className="absolute -bottom-48 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-t from-violet-600/15 to-transparent blur-[130px]" />

        {/* Ambient Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.25)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Enhancv AI Diagnostic Suite
          </div>

          <h2 className="mt-7 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Turn invisible resumes into{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              interview magnets.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Diagnose structural gaps, boost semantic keyword weights, and craft
            recruiter-grade bullet points with surgical precision.
          </p>
        </div>

        {/* Interactive Showcase Shell */}
        <div className="relative mt-16 lg:mt-24">
          <div className="relative rounded-[32px] border border-white/10 bg-slate-900/60 p-3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-5 lg:p-7">
            {/* Top Diagnostic Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">
                    Live Career Intelligence
                  </h4>
                  <p className="text-xs text-slate-400">
                    Real-time ATS & executive impact scoring
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  ATS Match Engine Active
                </div>
              </div>
            </div>

            {/* Workflow Step Cards */}
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => {
                const active = activeStep === index;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStep(index)}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 text-left transition-all duration-500 ${
                      active
                        ? "border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900 shadow-[0_0_50px_rgba(79,70,229,0.18)]"
                        : "border-white/[0.06] bg-slate-950/40 hover:border-white/15 hover:bg-slate-900/40"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl border text-xs font-bold transition-colors ${
                            active
                              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                              : "border-white/10 bg-white/5 text-slate-400"
                          }`}
                        >
                          {step.number}
                        </span>
                        <span
                          className={`text-[11px] font-bold tracking-widest transition-colors ${
                            active ? "text-indigo-400" : "text-slate-500"
                          }`}
                        >
                          {step.badge}
                        </span>
                      </div>

                      <div className="mt-6 h-[130px]">
                        {index === 0 && <IngestVisual active={active} />}
                        {index === 1 && <MetricsVisual active={active} />}
                        {index === 2 && <BenchmarkVisual active={active} />}
                      </div>

                      <h3 className="mt-6 text-lg font-bold text-white tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 pt-4 border-t border-white/[0.06]">
                      <span className="text-xs font-medium text-slate-300">
                        {step.highlight}
                      </span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          active
                            ? "translate-x-1 text-cyan-400"
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-6">
              <div className="flex items-center gap-2">
                {steps.map((step, idx) => (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      activeStep === idx
                        ? "w-8 bg-gradient-to-r from-indigo-500 to-cyan-400"
                        : "w-2 bg-slate-700 hover:bg-slate-600"
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={previous}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-600/20 hover:text-white"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-slate-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-600/20 hover:text-white"
                  aria-label="Next step"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid Bar */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-white/[0.08] rounded-2xl border border-white/10 bg-slate-900/40 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <Feature
            icon={<Sparkles className="h-4 w-4 text-cyan-400" />}
            title="Semantic AI Rewriter"
            description="Re-engineers weak bullets into executive STAR format."
          />
          <Feature
            icon={<Target className="h-4 w-4 text-indigo-400" />}
            title="99% ATS Pass Rate"
            description="Verified against Greenhouse, Lever, and Workday."
          />
          <Feature
            icon={<BarChart3 className="h-4 w-4 text-emerald-400" />}
            title="Metric Density Score"
            description="Identifies missing quantifiable indicators automatically."
          />
          <Feature
            icon={<Zap className="h-4 w-4 text-amber-400" />}
            title="Role-Match Matrix"
            description="Maps exact keyword gaps against your target job post."
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   VISUAL CARD 1: INGESTION
================================================================ */

function IngestVisual({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-full flex-col justify-center rounded-xl border border-white/[0.08] bg-slate-950/60 p-3.5 overflow-hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <FileText className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-28 rounded-full bg-slate-400" />
          <div className="h-1.5 w-16 rounded-full bg-slate-700" />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <div className="h-6 flex-1 rounded-md bg-slate-800/80 border border-white/5 flex items-center px-2">
          <span className="text-[10px] text-slate-400 truncate">
            Senior_Frontend_2026.pdf
          </span>
        </div>
        <div
          className={`flex h-6 items-center rounded-md px-2 text-[10px] font-bold transition-all ${
            active
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          PARSED
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   VISUAL CARD 2: METRICS & REWRITING
================================================================ */

function MetricsVisual({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-full flex-col justify-center rounded-xl border border-white/[0.08] bg-slate-950/60 p-3.5">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-semibold">
          <WandSparkles className="h-3.5 w-3.5" />
          <span>Metric Optimizer</span>
        </div>
        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400">
          +38% IMPACT
        </span>
      </div>

      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <div className="h-1.5 w-full rounded-full bg-slate-600" />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <div className="h-1.5 w-4/5 rounded-full bg-indigo-400/40" />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   VISUAL CARD 3: BENCHMARK / ATS
================================================================ */

function BenchmarkVisual({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-full items-center justify-between rounded-xl border border-white/[0.08] bg-slate-950/60 p-3.5">
      <div className="flex items-center gap-3">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-800 bg-slate-900">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`transition-all duration-1000 ${
                active
                  ? "text-cyan-400 stroke-[3.5]"
                  : "text-slate-600 stroke-[3.5]"
              }`}
              strokeDasharray={active ? "96, 100" : "70, 100"}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="absolute text-xs font-black text-white">96%</span>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ATS Match Score
          </div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="h-3 w-3" /> Ready to Submit
          </div>
        </div>
      </div>

      <div className="hidden sm:flex flex-col gap-1">
        <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[9px] font-medium text-indigo-300">
          Next.js
        </span>
        <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 text-[9px] font-medium text-cyan-300">
          TypeScript
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   FEATURE ITEM
================================================================ */

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3.5 p-5 transition-colors hover:bg-white/[0.02]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80">
        {icon}
      </div>
      <div>
        <h5 className="text-sm font-bold text-slate-100">{title}</h5>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
