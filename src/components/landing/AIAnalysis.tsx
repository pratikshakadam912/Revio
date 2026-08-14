"use client";

import {
  ArrowUpRight,
  Check,
  ScanSearch,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const analysisItems = [
  {
    label: "ATS compatibility",
    value: "Excellent",
    score: "98%",
    icon: ScanSearch,
  },
  {
    label: "Content quality",
    value: "Strong",
    score: "94%",
    icon: Sparkles,
  },
  {
    label: "Keyword coverage",
    value: "Good",
    score: "86%",
    icon: Target,
  },
  {
    label: "Impact",
    value: "Improve",
    score: "72%",
    icon: Zap,
  },
];

export function AIAnalysis() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-20 h-[500px] w-[500px] rounded-full bg-[#EAF1FF] blur-3xl" />

        <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[#F0F5FF] blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5EEFF]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[34px] border border-[#DDE5F0] bg-[#F7F9FC] shadow-[0_20px_70px_rgba(30,55,100,0.06)]">
          <div className="grid items-center gap-12 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-16">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/15 bg-white px-4 py-2 text-xs font-semibold text-[#4F7DF3] shadow-[0_4px_18px_rgba(79,125,243,0.05)]">
                <Sparkles className="h-3.5 w-3.5" />
                AI resume intelligence
              </div>

              <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#172033] sm:text-5xl lg:text-6xl">
                Know exactly
                <br />
                <span className="text-[#4F7DF3]">what to improve.</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
                Revio analyzes your resume across ATS compatibility, content
                quality, keyword coverage, and impact — then shows you where
                your resume can become stronger.
              </p>

              {/* Mini benefits */}
              <div className="mt-8 space-y-3">
                {[
                  "Instant resume scoring",
                  "Actionable AI recommendations",
                  "Job-specific keyword analysis",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-[#344054]"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF1FF]">
                      <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                    </div>

                    {item}
                  </div>
                ))}
              </div>

              <button className="group mt-9 flex items-center gap-2 text-sm font-semibold text-[#4F7DF3] transition-colors hover:text-[#416FE8]">
                See how AI analysis works
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Analysis dashboard */}
            <div className="relative">
              {/* Glow behind dashboard */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCE8FF] opacity-70 blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-[#DCE3ED] bg-white shadow-[0_25px_70px_rgba(30,55,100,0.10)]">
                {/* Dashboard header */}
                <div className="flex items-center justify-between border-b border-[#E8EDF3] px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-sm font-semibold text-[#172033]">
                      Resume analysis
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#8A93A3]">
                      Updated just now
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1FF]">
                    <Sparkles className="h-4 w-4 text-[#4F7DF3]" />
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  {/* Score */}
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-xs font-medium text-[#8A93A3]">
                        Overall resume score
                      </p>

                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-5xl font-semibold tracking-[-0.05em] text-[#172033]">
                          92
                        </span>

                        <span className="mb-1.5 text-xs font-medium text-[#8A93A3]">
                          / 100
                        </span>
                      </div>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#EAF1FF]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F7DF3] text-xs font-bold text-white shadow-[0_6px_18px_rgba(79,125,243,0.25)]">
                        A
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium text-[#8A93A3]">
                        Resume strength
                      </span>

                      <span className="font-semibold text-[#4F7DF3]">
                        Excellent
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E9EEF5]">
                      <div className="h-full w-[92%] rounded-full bg-[#4F7DF3]" />
                    </div>
                  </div>

                  {/* Analysis items */}
                  <div className="mt-7 overflow-hidden rounded-2xl border border-[#E5EAF1]">
                    {analysisItems.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.label}
                          className={`flex items-center justify-between gap-4 bg-white px-4 py-4 transition-colors hover:bg-[#F9FBFE] ${
                            index !== analysisItems.length - 1
                              ? "border-b border-[#E9EDF2]"
                              : ""
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F5FF]">
                              <Icon className="h-4 w-4 text-[#4F7DF3]" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-[#344054]">
                                {item.label}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#98A1B2]">
                                AI evaluation
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden text-[10px] font-medium text-[#98A1B2] sm:block">
                              {item.score}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                                item.value === "Improve"
                                  ? "bg-[#FFF4EF] text-[#C96F4F]"
                                  : "bg-[#EEF7F2] text-[#4A8A69]"
                              }`}
                            >
                              {item.value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI recommendation */}
                  <div className="mt-5 rounded-2xl border border-[#DCE7FA] bg-[#F5F8FF] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-[#4F7DF3]" />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-[#344054]">
                          AI recommendation
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#667085]">
                          Add measurable outcomes to your experience bullets to
                          make your achievements more impactful.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[24px] border border-[#E1E7F0] bg-white px-6 py-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)] sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF]">
              <ScanSearch className="h-4 w-4 text-[#4F7DF3]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#172033]">
                More than a score.
              </p>

              <p className="mt-0.5 text-xs text-[#8A93A3]">
                Get clear recommendations you can actually act on.
              </p>
            </div>
          </div>

          <span className="text-xs font-medium text-[#7B8495]">
            AI-powered career intelligence
          </span>
        </div>
      </div>
    </section>
  );
}
