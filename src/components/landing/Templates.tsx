import {
  ArrowUpRight,
  Check,
  Sparkles,
  WandSparkles,
  ShieldCheck,
} from "lucide-react";

import { MinimalTemplate } from "@/components/resume/templates";
import { demoResume } from "@/data/demoResume";

const templates = [
  {
    name: "Minimal",
    description:
      "Clean, focused, and built to let your quantifiable metrics speak for themselves.",
    component: MinimalTemplate,
    tag: "MOST POPULAR",
  },
  {
    name: "Professional",
    description:
      "Structured and polished for engineering, product, and enterprise tech roles.",
    component: MinimalTemplate,
    tag: "ATS OPTIMIZED",
  },
  {
    name: "Executive",
    description:
      "A high-signal layout designed for tech leads, staff engineers, and directors.",
    component: MinimalTemplate,
    tag: "HIGH IMPACT",
  },
];

export function Templates() {
  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#0A0D14] px-5 py-24 text-slate-100 sm:px-8 sm:py-28 lg:px-12 lg:py-36 selection:bg-indigo-500 selection:text-white"
    >
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Electric Indigo Glow — Left */}
        <div className="absolute -left-[260px] top-[80px] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Cyan Glow — Right */}
        <div className="absolute -right-[280px] bottom-[100px] h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Center Ambient Glow */}
        <div className="absolute left-1/2 top-[42%] h-[500px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/30 blur-[160px]" />

        {/* Precise Radial Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Micro Neon Particles */}
        <div className="absolute left-[9%] top-[22%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
        <div className="absolute left-[18%] bottom-[18%] h-1 w-1 rounded-full bg-indigo-400" />
        <div className="absolute right-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        <div className="absolute right-[23%] bottom-[24%] h-1 w-1 rounded-full bg-cyan-400" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Resume Templates</span>
              <span className="h-1 w-1 rounded-full bg-indigo-400" />
              <span className="text-slate-400 font-normal">
                ATS-Audited Layouts
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-7 text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Start with a resume
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                engineered to pass screens.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Choose an algorithmic-safe typographic foundation, load your
              structured experience nodes, and export clean, recruiter-approved
              documents instantly.
            </p>
          </div>

          {/* Explore Button */}
          <button className="group flex w-fit shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-6 py-3.5 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-800/80 hover:text-white">
            <span>Explore all templates</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
          </button>
        </div>

        {/* ============================================================
            TEMPLATE GRID
        ============================================================ */}

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {templates.map((template, index) => {
            const Template = template.component;

            return (
              <div key={template.name} className="group">
                {/* ====================================================
                    TEMPLATE CARD
                ==================================================== */}

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:border-indigo-500/40 group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                  {/* Card Glow */}
                  <div
                    className={`pointer-events-none absolute -top-32 h-[300px] w-[300px] rounded-full blur-[90px] transition-opacity duration-500 ${
                      index === 2
                        ? "-right-20 bg-indigo-600/15"
                        : "-left-20 bg-cyan-500/15"
                    }`}
                  />

                  {/* Badge */}
                  <div className="absolute left-6 top-6 z-20">
                    <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/90 px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider text-slate-200 shadow-xl backdrop-blur-xl">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          index === 2
                            ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                            : "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        }`}
                      />
                      {template.tag}
                    </span>
                  </div>

                  {/* Preview Container */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] border border-white/[0.08] bg-slate-950/80">
                    {/* Preview Ambient Glow */}
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[80px]"
                      style={{
                        background:
                          index === 2
                            ? "rgba(99, 102, 241, 0.25)"
                            : "rgba(6, 182, 212, 0.25)",
                      }}
                    />

                    {/* Scaled Preview Component */}
                    <div className="origin-top-left w-[210%] scale-[0.46] transition-transform duration-700 group-hover:scale-[0.475]">
                      <Template resume={demoResume} />
                    </div>

                    {/* Preview Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Hover Border Glow */}
                  <div className="pointer-events-none absolute inset-2 rounded-[24px] border border-transparent transition-all duration-500 group-hover:border-indigo-500/20" />
                </div>

                {/* ====================================================
                    TEMPLATE DETAILS
                ==================================================== */}

                <div className="mt-5 flex items-start justify-between gap-5 px-1">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {template.name}
                      </h3>

                      <span className="inline-flex rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
                        ATS 99% PASS
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-400">
                      {template.description}
                    </p>
                  </div>

                  {/* Select Check Indicator */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 text-slate-500 transition-all duration-300 group-hover:border-indigo-500/40 group-hover:bg-indigo-600/20 group-hover:text-cyan-300">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================
            BOTTOM SIGNAL STRIP
        ============================================================ */}

        <div className="mt-12 rounded-2xl border border-white/[0.08] bg-slate-900/40 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Info */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/50 text-cyan-300">
                <WandSparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-200">
                  Every template passes standard scanner parsing tests.
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Clean hierarchy, single-column fallback safety, and zero
                  unreadable vector elements.
                </p>
              </div>
            </div>

            {/* Right Meta Badges */}
            <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                ATS Verified
              </span>
              <span>Modern Layouts</span>
              <span>1-Click LaTeX / PDF</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            SMALL CTA SIGNAL
        ============================================================ */}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          Choose a layout. Sync your experiences. Let Revio engineer the impact.
        </div>
      </div>
    </section>
  );
}
