"use client";

import {
  ArrowUpRight,
  Check,
  FileText,
  ScanSearch,
  Sparkles,
  Target,
  WandSparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    number: "01",
    label: "AI STAR REWRITER",
    title: "Turn raw experience into executive achievements.",
    description:
      "Transform passive task lists into quantified STAR bullet points (Situation, Task, Action, Result) with recruiter-tested action verbs.",
    icon: Sparkles,
    type: "writing",
  },
  {
    number: "02",
    label: "ATS DIAGNOSTICS",
    title: "Emulate Workday, Lever & Greenhouse parsers.",
    description:
      "Audit syntax trees, section hierarchy, table parsing safety, and semantic keyword weights before an algorithmic filter rejects you.",
    icon: ScanSearch,
    type: "ats",
  },
  {
    number: "03",
    label: "ROLE MATCH MATRIX",
    title: "Tailor directly to your target job description.",
    description:
      "Paste any target job posting to reveal missing technical proficiencies, soft skills, and keyword density gaps with exact match metrics.",
    icon: Target,
    type: "matching",
  },
  {
    number: "04",
    label: "EXECUTIVE TEMPLATES",
    title: "Engineered typography that passes every scanner.",
    description:
      "Clean, modern layouts formatted strictly for ATS compliance, perfect typographic hierarchy, and one-click PDF/LaTeX export.",
    icon: FileText,
    type: "templates",
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-[#0A0D14] px-5 py-24 text-slate-100 sm:px-8 lg:px-12 lg:py-36 selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left electric indigo glow */}
        <div className="absolute -left-[280px] -top-[250px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Top-right cyan glow */}
        <div className="absolute -right-[260px] top-[15%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Center ambient glow */}
        <div className="absolute left-1/2 top-[45%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-950/30 blur-[170px]" />

        {/* Precise radial matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ambient neon particles */}
        <div className="absolute left-[12%] top-[28%] h-2 w-2 rounded-full bg-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
        <div className="absolute right-[18%] top-[18%] h-1.5 w-1.5 rounded-full bg-indigo-400/80 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
        <div className="absolute right-[28%] top-[70%] h-2 w-2 rounded-full bg-cyan-400/60 blur-[1px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="mx-auto max-w-4xl text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Full-Stack Resume Engine
          </div>

          {/* Heading */}
          <h2 className="mt-7 text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[76px]">
            One platform.{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              Zero algorithmic guesswork.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Revio unifies semantic rewriting, ATS structural simulation,
            job-description gap mapping, and ATS-safe typography into a single
            high-conversion pipeline.
          </p>
        </div>

        {/* ============================================================
            FEATURE CARDS GRID
        ============================================================ */}

        <div className="relative mt-16 lg:mt-24">
          <div className="relative grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <FeatureCard
                  key={feature.number}
                  feature={feature}
                  Icon={Icon}
                  index={index}
                />
              );
            })}
          </div>
        </div>

        {/* ============================================================
            INTELLIGENCE STRIP
        ============================================================ */}

        <div className="relative mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          {/* Top border highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          {/* Ambient inner glow */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-48 w-80 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-[90px]" />

          <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="flex items-center gap-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-tr from-indigo-600/30 to-cyan-500/20 text-cyan-300 shadow-md">
                <WandSparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-white tracking-tight">
                  Unified Career Intelligence Loop
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Ingest → Quantify Metrics → ATS Audit → Role Match → One-Click
                  Export.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusPill text="STAR AI Rewriter" active />
              <StatusPill text="ATS Emulation" />
              <StatusPill text="JD Keyword Gap" />
              <StatusPill text="LaTeX / Clean PDF" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FEATURE CARD COMPONENT
================================================================ */

function FeatureCard({
  feature,
  Icon,
  index,
}: {
  feature: (typeof features)[number];
  Icon: React.ElementType;
  index: number;
}) {
  return (
    <div className="group relative">
      {/* Soft Hover Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-[36px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            index % 2 === 0
              ? "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)"
              : "radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%)",
        }}
      />

      {/* Main Glass Shell */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-indigo-500/40 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        {/* Top glowing sweep on hover */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="p-7 sm:p-9">
          {/* Top Header Row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-slate-950/80 text-indigo-400 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:bg-indigo-600/20 group-hover:text-cyan-300">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  {feature.label}
                </p>
                <p className="mt-0.5 text-[9px] font-mono text-slate-500">
                  REVIO.MODULE.0{index + 1}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-slate-600">
              {feature.number}
            </span>
          </div>

          {/* Interactive Feature Visual Mock */}
          <div className="mt-7">
            {feature.type === "writing" && <WritingVisual />}
            {feature.type === "ats" && <ATSVisual />}
            {feature.type === "matching" && <MatchingVisual />}
            {feature.type === "templates" && <TemplateVisual />}
          </div>

          {/* Title & Description */}
          <div className="mt-7">
            <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {feature.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {feature.description}
            </p>

            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 cursor-pointer transition-colors group-hover:text-white">
              <span>Explore module capability</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   VISUAL 1: AI STAR WRITING
================================================================ */

function WritingVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/80 p-4 shadow-inner">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-12 bg-gradient-to-b from-indigo-600/10 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="h-2 w-28 rounded-full bg-slate-300" />
            <div className="mt-1.5 h-1.5 w-16 rounded-full bg-slate-700" />
          </div>
        </div>

        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300">
          STAR TRANSFORM
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-1.5 w-full rounded-full bg-slate-800" />
        <div className="h-1.5 w-[92%] rounded-full bg-slate-800" />
        <div className="h-1.5 w-[75%] rounded-full bg-indigo-400/40" />
      </div>

      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/5">
        <Check className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-[10px] font-medium text-emerald-400">
          Replaced &quot;Responsible for APIs&quot; with &quot;Architected
          GraphQL pipeline reducing latency by 42%&quot;
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   VISUAL 2: ATS AUDIT
================================================================ */

function ATSVisual() {
  return (
    <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/80 p-4 shadow-inner">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-slate-800 bg-slate-900">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-cyan-400 stroke-[3.5]"
            strokeDasharray="98, 100"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="absolute text-sm font-black text-white font-mono">
          98%
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ATS Pass Engine
          </p>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
            PASS
          </span>
        </div>

        <p className="mt-1 text-xs font-bold text-white">
          Greenhouse & Lever Ready
        </p>

        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>0 Parse errors in table hierarchy</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Zap className="h-3 w-3 text-cyan-400" />
            <span>Standardized date/heading taxonomy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   VISUAL 3: JOB DESCRIPTION MATCH
================================================================ */

function MatchingVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/80 p-4 shadow-inner">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Role Alignment
          </p>
          <p className="mt-0.5 text-xs font-bold text-white">
            Staff Frontend Engineer
          </p>
        </div>

        <span className="text-base font-black text-cyan-300 font-mono">
          94% Match
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-medium text-cyan-300">
          React 19 ✓
        </span>
        <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-medium text-indigo-300">
          TypeScript ✓
        </span>
        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300">
          Distributed Systems ✓
        </span>
        <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-medium text-amber-300">
          +2 Missing Skills
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   VISUAL 4: TEMPLATES DESIGN
================================================================ */

function TemplateVisual() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/80 p-4 shadow-inner">
      <div className="flex items-end gap-3.5">
        {/* Template Left */}
        <div className="h-20 w-16 rounded-lg border border-white/10 bg-slate-900/80 p-1.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="h-1.5 w-6 rounded-full bg-slate-700" />
          <div className="mt-2 space-y-1">
            <div className="h-0.5 w-full rounded-full bg-slate-800" />
            <div className="h-0.5 w-4/5 rounded-full bg-slate-800" />
            <div className="h-0.5 w-3/5 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Template Center Active */}
        <div className="relative h-24 w-20 rounded-lg border border-indigo-500/40 bg-slate-900 p-2 shadow-[0_0_20px_rgba(79,70,229,0.25)] transition-transform duration-300 group-hover:-translate-y-1.5">
          <div className="h-2 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
          <div className="mt-2.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-slate-700" />
            <div className="h-1 w-5/6 rounded-full bg-slate-800" />
            <div className="h-1 w-4/6 rounded-full bg-slate-800" />
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-slate-800" />
            <div className="h-1 w-3/4 rounded-full bg-slate-800" />
          </div>
          <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-md">
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          </div>
        </div>

        {/* Template Right */}
        <div className="h-20 w-16 rounded-lg border border-white/10 bg-slate-900/80 p-1.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="h-1.5 w-7 rounded-full bg-slate-700" />
          <div className="mt-2 space-y-1">
            <div className="h-0.5 w-full rounded-full bg-slate-800" />
            <div className="h-0.5 w-5/6 rounded-full bg-slate-800" />
            <div className="h-0.5 w-2/3 rounded-full bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   STATUS PILL COMPONENT
================================================================ */

function StatusPill({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
        active
          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
          : "border-white/10 bg-slate-950/60 text-slate-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            : "bg-slate-600"
        }`}
      />
      {text}
    </div>
  );
}
