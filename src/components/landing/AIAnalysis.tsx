"use client";

import {
  ArrowUpRight,
  Check,
  ChevronRight,
  ScanSearch,
  Sparkles,
  Target,
  TrendingUp,
  WandSparkles,
  ShieldCheck,
  Layers,
} from "lucide-react";

const analysisCards = [
  {
    id: "01",
    label: "ATS COMPATIBILITY",
    score: "98",
    status: "Optimal",
    description:
      "Zero parsing errors found across major ATS engines (Workday, Greenhouse, Lever).",
    icon: ScanSearch,
  },
  {
    id: "02",
    label: "CONTENT QUALITY",
    score: "94",
    status: "Strong STAR",
    description:
      "85%+ of your bullets feature action verbs paired with quantifiable impact metrics.",
    icon: Sparkles,
  },
  {
    id: "03",
    label: "JOB ALIGNMENT",
    score: "91",
    status: "High Match",
    description:
      "Core skills and industry keyword density mirror Tier-1 engineering requirements.",
    icon: Target,
  },
];

export function AIAnalysis() {
  return (
    <section className="relative overflow-hidden bg-[#0A0D14] px-5 py-24 text-slate-100 sm:px-8 sm:py-28 lg:px-12 lg:py-36 selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left electric indigo glow */}
        <div className="absolute -left-[280px] -top-[260px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Top-right cyan glow */}
        <div className="absolute -right-[260px] top-[15%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Center atmospheric field */}
        <div className="absolute left-[35%] top-[35%] h-[600px] w-[750px] rounded-full bg-indigo-950/30 blur-[160px]" />

        {/* Bottom ambient glow */}
        <div className="absolute -bottom-[400px] left-1/2 h-[750px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/15 via-indigo-600/10 to-transparent blur-[150px]" />

        {/* Precise radial matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Editorial scanline divider */}
        <div className="absolute left-0 right-0 top-[48%] h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

        {/* Ambient neon particles */}
        <div className="absolute left-[10%] top-[24%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
        <div className="absolute right-[13%] top-[28%] h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        <div className="absolute left-[24%] top-[67%] h-1 w-1 rounded-full bg-cyan-400" />
        <div className="absolute right-[26%] top-[65%] h-1 w-1 rounded-full bg-indigo-400" />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="max-w-4xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            AI Diagnostic Telemetry
          </div>

          {/* Heading */}
          <h2 className="mt-8 text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[76px]">
            See exactly what is{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              powering your resume.
            </span>
          </h2>

          <div className="mt-8 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Revio doesn&apos;t just spit out a generic score. It parses every
              line against real recruiter rubrics, pinpoints weak verbiage, and
              maps high-yield fixes in real time.
            </p>

            <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              24 Signals Analyzed
            </div>
          </div>
        </div>

        {/* ============================================================
            MAIN SHOWCASE
        ============================================================ */}

        <div className="relative mt-16 lg:mt-24">
          {/* FLOATING LEFT CARD */}
          <div className="absolute -left-4 top-14 z-30 hidden xl:block">
            <div className="analysis-float-left rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Profile Strength
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-white">
                    Top 5% Candidate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING RIGHT CARD */}
          <div className="absolute -right-4 top-28 z-30 hidden xl:block">
            <div className="analysis-float-right rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  <WandSparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    STAR Framework
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-white">
                    4 High-Yield Edits
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PRODUCT SHELL */}
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-[36px] border border-white/10 bg-slate-900/60 p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-4">
              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-slate-950/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {/* Top Border Line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

                {/* Inner Glows */}
                <div className="pointer-events-none absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full bg-indigo-600/15 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-36 -right-36 h-[480px] w-[480px] rounded-full bg-cyan-500/15 blur-[100px]" />

                {/* ======================================================
                    PRODUCT HEADER BAR
                ====================================================== */}
                <div className="relative flex items-center justify-between border-b border-white/[0.08] px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/25">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white tracking-tight">
                        Deep Resume Diagnostics
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        revio.telemetry.engine
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Audit Complete
                  </div>
                </div>

                {/* ======================================================
                    PRODUCT CONTENT
                ====================================================== */}
                <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
                  {/* SCORE SIDE */}
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                      Overall Benchmark Index
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-7xl font-black tracking-tight text-white sm:text-8xl">
                        92
                      </span>
                      <span className="text-lg font-bold text-slate-500">
                        / 100
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-bold text-emerald-400">
                        Tier-1 Ready (Outranks 94% of Applicants)
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-8 max-w-sm">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <span>Algorithmic Confidence</span>
                        <span className="text-cyan-300 font-mono">92%</span>
                      </div>
                      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-900 border border-white/5">
                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                      </div>
                    </div>

                    {/* Mini metrics */}
                    <div className="mt-8 grid max-w-sm grid-cols-2 gap-3">
                      <MetricCard label="ATS Readability" value="98%" />
                      <MetricCard label="Keyword Weight" value="86%" />
                    </div>
                  </div>

                  {/* FLIP CARDS CONTAINER */}
                  <div>
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="text-sm font-bold text-white tracking-tight">
                          Signal Breakdown
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Hover a metric card to reveal algorithmic findings.
                        </p>
                      </div>

                      <div className="hidden items-center gap-2 text-xs font-mono font-bold text-slate-500 sm:flex">
                        <span>[01</span>
                        <span className="h-px w-6 bg-slate-700" />
                        <span>03]</span>
                      </div>
                    </div>

                    <div className="grid gap-3.5">
                      {analysisCards.map((card) => (
                        <AnalysisFlipCard key={card.id} card={card} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* ======================================================
                    BOTTOM BAR
                ====================================================== */}
                <div className="relative flex flex-col gap-4 border-t border-white/[0.08] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 bg-slate-950/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                      <ScanSearch className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-slate-400">
                      Cross-referenced against{" "}
                      <span className="font-bold text-slate-200">
                        50,000+ hired engineer resumes
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>ATS PARSE</span>
                    <span>STAR METRICS</span>
                    <span>KEYWORDS</span>
                    <span>TYPOGRAPHY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING BOTTOM RECOMMENDATION */}
            <div className="absolute -bottom-12 right-4 z-30 hidden w-[300px] lg:block">
              <div className="analysis-recommend rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                    <WandSparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Top Recommendation
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-white">
                      Quantify Outcome Density
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  Add concrete numbers or percentages to your 2 most recent
                  roles to boost recruiter conversion.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-300 cursor-pointer transition-colors hover:text-white">
                  <span>Apply AI STAR Suggestion</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            FEATURE ROW
        ============================================================ */}

        <div className="mt-20 grid overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-white/[0.08] sm:divide-y-0 sm:divide-x">
          <InsightItem
            number="01"
            title="Instant Scoring"
            description="Complete structural & semantic audit in sub-second time."
          />
          <InsightItem
            number="02"
            title="ATS Emulation"
            description="Emulates Greenhouse, Lever, and Workday parsing engines."
          />
          <InsightItem
            number="03"
            title="STAR Transformer"
            description="Converts generic job responsibilities into quantifiable wins."
          />
          <InsightItem
            number="04"
            title="Role Matching"
            description="Identifies missing keyword density relative to the target role."
          />
        </div>

        {/* ============================================================
            CTA BAR
        ============================================================ */}

        <div className="mt-12 flex flex-col items-center justify-between gap-5 sm:flex-row pt-6 border-t border-white/[0.08]">
          <div>
            <p className="text-sm font-bold text-slate-200">
              Your resume is your primary career leverage.
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Stop guessing what recruiters want. Let data guide your
              application.
            </p>
          </div>

          <button className="group inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <span>Audit Full Resume</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Floating Animations */}
      <style jsx>{`
        .analysis-float-left {
          animation: analysisLeft 6s ease-in-out infinite;
        }

        .analysis-float-right {
          animation: analysisRight 7s ease-in-out infinite;
        }

        .analysis-recommend {
          animation: recommendationFloat 6s ease-in-out infinite;
        }

        @keyframes analysisLeft {
          0%,
          100% {
            transform: translateY(0px) rotate(-1deg);
          }
          50% {
            transform: translateY(-10px) rotate(1deg);
          }
        }

        @keyframes analysisRight {
          0%,
          100% {
            transform: translateY(-2px) rotate(1deg);
          }
          50% {
            transform: translateY(10px) rotate(-1deg);
          }
        }

        @keyframes recommendationFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .analysis-float-left,
          .analysis-float-right,
          .analysis-recommend {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ================================================================
   FLIP CARD
================================================================ */

function AnalysisFlipCard({ card }: { card: (typeof analysisCards)[number] }) {
  const Icon = card.icon;

  return (
    <div className="group h-[118px] [perspective:1200px]">
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="flex h-full items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/70 px-5 shadow-lg backdrop-blur-xl transition-all duration-300 group-hover:border-indigo-500/40">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {card.label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-white">
                  {card.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-white font-mono">
                {card.score}
              </span>
              <ArrowUpRight className="h-4 w-4 text-slate-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
          <div className="flex h-full items-center justify-between rounded-2xl border border-indigo-500/40 bg-indigo-950/80 px-5 text-white shadow-[0_0_30px_rgba(79,70,229,0.2)]">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                <Check className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  {card.label}
                </p>
                <p className="mt-0.5 max-w-[340px] text-xs leading-relaxed text-slate-300">
                  {card.description}
                </p>
              </div>
            </div>

            <span className="hidden text-2xl font-black text-cyan-300 font-mono sm:block">
              {card.score}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   METRIC CARD
================================================================ */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-3.5 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/30">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-lg font-black text-white font-mono">{value}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      </div>
    </div>
  );
}

/* ================================================================
   INSIGHT ITEM
================================================================ */

function InsightItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 transition-all duration-300 hover:bg-white/[0.02]">
      <div className="flex items-start justify-between">
        <span className="text-xs font-mono font-bold text-indigo-400">
          {number}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-400" />
      </div>

      <p className="mt-6 text-sm font-bold text-white">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}
