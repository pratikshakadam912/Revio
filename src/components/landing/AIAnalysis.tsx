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
    <section className="relative overflow-hidden bg-[#F7F5EF] px-5 py-24 text-[#263B32] selection:bg-[#315E50] selection:text-white sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[280px] -top-[260px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-[#719681]/25 via-[#D9C5A2]/20 to-transparent blur-[140px]" />

        <div className="absolute -right-[260px] top-[15%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-[#D9C5A2]/35 via-[#719681]/15 to-transparent blur-[140px]" />

        <div className="absolute left-[35%] top-[35%] h-[600px] w-[750px] rounded-full bg-[#DDE7DE]/50 blur-[160px]" />

        <div className="absolute -bottom-[400px] left-1/2 h-[750px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#D9C5A2]/30 via-[#719681]/10 to-transparent blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute left-0 right-0 top-[48%] h-px bg-gradient-to-r from-transparent via-[#719681]/25 to-transparent" />

        <div className="absolute left-[10%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#719681] shadow-[0_0_15px_rgba(113,150,129,0.5)]" />
        <div className="absolute right-[13%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#B97862] shadow-[0_0_15px_rgba(185,120,98,0.4)]" />
        <div className="absolute left-[24%] top-[67%] h-1 w-1 rounded-full bg-[#719681]" />
        <div className="absolute right-[26%] top-[65%] h-1 w-1 rounded-full bg-[#B97862]" />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        {/* HEADER */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#719681]/30 bg-white/65 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#315E50] shadow-[0_4px_20px_rgba(49,94,80,0.06)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#719681] opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-[#719681]" />
            </span>
            AI Diagnostic Intelligence
          </div>

          <h2 className="mt-8 text-balance text-4xl font-black leading-[1.02] tracking-tight text-[#263B32] sm:text-6xl lg:text-[76px]">
            See exactly what is{" "}
            <span className="bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
              powering your resume.
            </span>
          </h2>

          <div className="mt-8 flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-xl text-base leading-relaxed text-[#727A72] sm:text-lg">
              Revio doesn&apos;t just spit out a generic score. It parses every
              line against real recruiter rubrics, pinpoints weak verbiage, and
              maps high-yield fixes in real time.
            </p>

            <div className="hidden shrink-0 items-center gap-2 rounded-lg border border-[#719681]/25 bg-[#E7EFE8] px-3 py-1 text-xs font-bold text-[#315E50] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#719681]" />
              24 Signals Analyzed
            </div>
          </div>
        </div>

        {/* MAIN SHOWCASE */}
        <div className="relative mt-16 lg:mt-24">
          {/* FLOATING LEFT CARD */}
          <div className="absolute -left-4 top-14 z-30 hidden xl:block">
            <div className="analysis-float-left rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_20px_50px_rgba(49,65,52,0.12)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#719681]/25 bg-[#E7EFE8] text-[#315E50]">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#899087]">
                    Profile Strength
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[#263B32]">
                    Top 5% Candidate
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING RIGHT CARD */}
          <div className="absolute -right-4 top-28 z-30 hidden xl:block">
            <div className="analysis-float-right rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_20px_50px_rgba(49,65,52,0.12)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D9C5A2]/50 bg-[#F4EDE1] text-[#A47B48]">
                  <WandSparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#899087]">
                    STAR Framework
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-[#263B32]">
                    4 High-Yield Edits
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN PRODUCT SHELL */}
          <div className="mx-auto max-w-6xl">
            <div className="relative rounded-[36px] border border-white/90 bg-white/55 p-2.5 shadow-[0_30px_100px_rgba(49,65,52,0.12)] backdrop-blur-2xl sm:p-4">
              <div className="relative overflow-hidden rounded-[28px] border border-[#E9E7DF] bg-[#FCFBF8]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#719681]/50 to-transparent" />

                {/* INNER AMBIENT GLOWS */}
                <div className="pointer-events-none absolute -left-36 -top-36 h-[480px] w-[480px] rounded-full bg-[#719681]/10 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-36 -right-36 h-[480px] w-[480px] rounded-full bg-[#D9C5A2]/20 blur-[100px]" />

                {/* PRODUCT HEADER BAR */}
                <div className="relative flex items-center justify-between border-b border-[#EAE8E0] px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#315E50] to-[#719681] text-white shadow-lg shadow-[#315E50]/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight text-[#263B32]">
                        Deep Resume Diagnostics
                      </p>
                      <p className="font-mono text-xs text-[#969B91]">
                        revio.telemetry.engine
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#719681]/25 bg-[#E7EFE8] px-3.5 py-1.5 text-xs font-semibold text-[#315E50]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Audit Complete
                  </div>
                </div>

                {/* PRODUCT CONTENT */}
                <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
                  {/* SCORE SIDE */}
                  <div className="flex flex-col justify-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#719681]">
                      Overall Benchmark Index
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-7xl font-black tracking-tight text-[#263B32] sm:text-8xl">
                        92
                      </span>
                      <span className="text-lg font-bold text-[#A5A69D]">
                        / 100
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#719681]/30 bg-[#E7EFE8] text-[#315E50]">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-bold text-[#315E50]">
                        Tier-1 Ready (Outranks 94% of Applicants)
                      </span>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-8 max-w-sm">
                      <div className="flex justify-between text-xs font-semibold text-[#899087]">
                        <span>Algorithmic Confidence</span>
                        <span className="font-mono text-[#719681]">92%</span>
                      </div>
                      <div className="mt-2.5 h-2 overflow-hidden rounded-full border border-[#E8E6DE] bg-[#EFEEE8]">
                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#315E50] via-[#719681] to-[#A9BDA8] shadow-[0_0_12px_rgba(113,150,129,0.3)]" />
                      </div>
                    </div>

                    {/* MINI METRICS */}
                    <div className="mt-8 grid max-w-sm grid-cols-2 gap-3">
                      <MetricCard label="ATS Readability" value="98%" />
                      <MetricCard label="Keyword Weight" value="86%" />
                    </div>
                  </div>

                  {/* FLIP CARDS */}
                  <div>
                    <div className="mb-5 flex items-end justify-between">
                      <div>
                        <p className="text-sm font-bold tracking-tight text-[#263B32]">
                          Signal Breakdown
                        </p>
                        <p className="mt-1 text-xs text-[#969B91]">
                          Hover a metric card to reveal algorithmic findings.
                        </p>
                      </div>

                      <div className="hidden items-center gap-2 font-mono text-xs font-bold text-[#A5A69D] sm:flex">
                        <span>[01</span>
                        <span className="h-px w-6 bg-[#D9D8CF]" />
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

                {/* BOTTOM BAR */}
                <div className="relative flex flex-col gap-4 border-t border-[#EAE8E0] bg-[#F8F7F2]/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#719681]/25 bg-[#E7EFE8] text-[#315E50]">
                      <ScanSearch className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-[#899087]">
                      Cross-referenced against{" "}
                      <span className="font-bold text-[#40574A]">
                        50,000+ hired engineer resumes
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-[#969B91]">
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
              <div className="analysis-recommend rounded-2xl border border-white/90 bg-white/95 p-5 shadow-[0_20px_50px_rgba(49,65,52,0.16)] backdrop-blur-2xl">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D9C5A2]/50 bg-[#F4EDE1] text-[#A47B48]">
                    <WandSparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#719681]">
                      Top Recommendation
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-[#263B32]">
                      Quantify Outcome Density
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#858B82]">
                  Add concrete numbers or percentages to your 2 most recent
                  roles to boost recruiter conversion.
                </p>

                <div className="mt-4 flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#315E50] transition-colors hover:text-[#B97862]">
                  <span>Apply AI STAR Suggestion</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE ROW */}
        <div className="mt-20 grid overflow-hidden rounded-2xl border border-[#E8E5DC] bg-white/60 shadow-[0_12px_40px_rgba(49,65,52,0.05)] divide-y divide-[#EAE8E0] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
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

        {/* CTA BAR */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-[#E6E3DA] pt-6 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-[#40574A]">
              Your resume is your primary career leverage.
            </p>
            <p className="mt-0.5 text-xs text-[#899087]">
              Stop guessing what recruiters want. Let data guide your
              application.
            </p>
          </div>

          <button className="group inline-flex items-center gap-2 rounded-xl border border-[#315E50]/20 bg-gradient-to-r from-[#315E50] via-[#426F5D] to-[#719681] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_rgba(49,94,80,0.18)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(49,94,80,0.25)]">
            <span>Audit Full Resume</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* FLOATING ANIMATIONS */}
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

/* FLIP CARD */

function AnalysisFlipCard({ card }: { card: (typeof analysisCards)[number] }) {
  const Icon = card.icon;

  return (
    <div className="group h-[118px] [perspective:1200px]">
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
        {/* FRONT */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="flex h-full items-center justify-between rounded-2xl border border-[#E9E7DF] bg-white/80 px-5 shadow-[0_5px_20px_rgba(49,65,52,0.05)] backdrop-blur-xl transition-all duration-300 group-hover:border-[#719681]/50 group-hover:shadow-[0_8px_25px_rgba(49,94,80,0.09)]">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#719681]/25 bg-[#E7EFE8] text-[#315E50]">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#969B91]">
                  {card.label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#40574A]">
                  {card.status}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-3xl font-black text-[#263B32]">
                {card.score}
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#A5A69D] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#719681]" />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
          <div className="flex h-full items-center justify-between rounded-2xl border border-[#719681]/40 bg-gradient-to-br from-[#E7EFE8] to-[#F5F3EB] px-5 text-[#263B32] shadow-[0_8px_30px_rgba(49,94,80,0.10)]">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#719681]/30 bg-white/70 text-[#315E50]">
                <Check className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#719681]">
                  {card.label}
                </p>
                <p className="mt-0.5 max-w-[340px] text-xs leading-relaxed text-[#68766B]">
                  {card.description}
                </p>
              </div>
            </div>

            <span className="hidden font-mono text-2xl font-black text-[#315E50] sm:block">
              {card.score}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* METRIC CARD */

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E9E7DF] bg-white/75 p-3.5 backdrop-blur-md transition-all duration-300 hover:border-[#719681]/40 hover:shadow-[0_5px_20px_rgba(49,65,52,0.06)]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#969B91]">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="font-mono text-lg font-black text-[#315E50]">
          {value}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#719681]" />
      </div>
    </div>
  );
}

/* INSIGHT ITEM */

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
    <div className="group p-6 transition-all duration-300 hover:bg-[#F0F2EB]/80">
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs font-bold text-[#719681]">
          {number}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-[#B5B6AC] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#315E50]" />
      </div>

      <p className="mt-6 text-sm font-bold text-[#40574A]">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-[#899087]">
        {description}
      </p>
    </div>
  );
}
