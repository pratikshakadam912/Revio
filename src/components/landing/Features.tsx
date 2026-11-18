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
    <section className="relative isolate overflow-hidden bg-[#F7F5EF] px-5 py-24 text-[#263B33] selection:bg-[#315E50] selection:text-white sm:px-8 lg:px-12 lg:py-36">
      {/* BACKGROUND ATMOSPHERE */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[280px] -top-[250px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-[#719681]/20 via-[#D9C5A2]/15 to-transparent blur-[140px]" />

        <div className="absolute -right-[260px] top-[15%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-[#D9C5A2]/30 via-[#B97862]/10 to-transparent blur-[140px]" />

        <div className="absolute left-1/2 top-[45%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-[#719681]/10 blur-[170px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute left-[12%] top-[28%] h-2 w-2 rounded-full bg-[#719681]/60 shadow-[0_0_12px_rgba(113,150,129,0.4)]" />
        <div className="absolute right-[18%] top-[18%] h-1.5 w-1.5 rounded-full bg-[#B97862]/70 shadow-[0_0_12px_rgba(185,120,98,0.3)]" />
        <div className="absolute right-[28%] top-[70%] h-2 w-2 rounded-full bg-[#D9C5A2] blur-[1px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#719681]/25 bg-white/65 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#315E50] shadow-[0_4px_18px_rgba(49,94,80,0.07)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#719681] opacity-50" />
              <span className="relative h-2 w-2 rounded-full bg-[#719681]" />
            </span>
            Full-Stack Resume Engine
          </div>

          <h2 className="mt-7 text-balance text-4xl font-black leading-[1.02] tracking-tight text-[#263B33] sm:text-6xl lg:text-[76px]">
            One platform.{" "}
            <span className="bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
              Zero algorithmic guesswork.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#777D76] sm:text-lg">
            Revio unifies semantic rewriting, ATS structural simulation,
            job-description gap mapping, and ATS-safe typography into a single
            high-conversion pipeline.
          </p>
        </div>

        {/* FEATURE CARDS */}

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

        {/* INTELLIGENCE STRIP */}

        <div className="relative mt-6 overflow-hidden rounded-[28px] border border-white/80 bg-white/60 shadow-[0_20px_55px_rgba(49,65,54,0.09)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#719681]/50 to-transparent" />

          <div className="pointer-events-none absolute -left-20 top-1/2 h-48 w-80 -translate-y-1/2 rounded-full bg-[#719681]/15 blur-[90px]" />

          <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="flex items-center gap-4">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#719681]/25 bg-gradient-to-tr from-[#315E50]/10 to-[#D9C5A2]/30 text-[#315E50] shadow-sm">
                <WandSparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold tracking-tight text-[#263B33]">
                  Unified Career Intelligence Loop
                </p>
                <p className="mt-0.5 text-xs text-[#858A83]">
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

/* FEATURE CARD COMPONENT */

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
      <div
        className="pointer-events-none absolute -inset-2 rounded-[36px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            index % 2 === 0
              ? "radial-gradient(circle, rgba(113,150,129,0.18), transparent 70%)"
              : "radial-gradient(circle, rgba(217,197,162,0.3), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/65 shadow-[0_16px_45px_rgba(49,65,54,0.08)] backdrop-blur-2xl transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#719681]/40 group-hover:shadow-[0_24px_55px_rgba(49,65,54,0.13)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#719681]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="p-7 sm:p-9">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#719681]/25 bg-[#719681]/10 text-[#315E50] shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:bg-[#315E50] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#315E50]">
                  {feature.label}
                </p>
                <p className="mt-0.5 font-mono text-[9px] text-[#A0A39C]">
                  REVIO.MODULE.0{index + 1}
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-[#B4B4AA]">
              {feature.number}
            </span>
          </div>

          <div className="mt-7">
            {feature.type === "writing" && <WritingVisual />}
            {feature.type === "ats" && <ATSVisual />}
            {feature.type === "matching" && <MatchingVisual />}
            {feature.type === "templates" && <TemplateVisual />}
          </div>

          <div className="mt-7">
            <h3 className="text-xl font-bold tracking-tight text-[#263B33] sm:text-2xl">
              {feature.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#777D76]">
              {feature.description}
            </p>

            <div className="mt-5 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#315E50] transition-colors group-hover:text-[#B97862]">
              <span>Explore module capability</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* VISUAL 1: AI STAR WRITING */

function WritingVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E7E5DC] bg-[#F8F7F2] p-4 shadow-inner">
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-12 bg-gradient-to-b from-[#719681]/10 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#719681]/25 bg-[#719681]/10 text-[#315E50]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="h-2 w-28 rounded-full bg-[#8B948B]" />
            <div className="mt-1.5 h-1.5 w-16 rounded-full bg-[#D8D8CE]" />
          </div>
        </div>

        <span className="rounded-md border border-[#719681]/30 bg-[#719681]/10 px-2 py-0.5 font-mono text-[9px] font-bold text-[#315E50]">
          STAR TRANSFORM
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-1.5 w-full rounded-full bg-[#E4E3DB]" />
        <div className="h-1.5 w-[92%] rounded-full bg-[#E4E3DB]" />
        <div className="h-1.5 w-[75%] rounded-full bg-[#719681]/40" />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-[#E7E5DC] pt-3">
        <Check className="h-3.5 w-3.5 shrink-0 text-[#568267]" />
        <span className="text-[10px] font-medium text-[#568267]">
          Replaced &quot;Responsible for APIs&quot; with &quot;Architected
          GraphQL pipeline reducing latency by 42%&quot;
        </span>
      </div>
    </div>
  );
}

/* VISUAL 2: ATS AUDIT */

function ATSVisual() {
  return (
    <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[#E7E5DC] bg-[#F8F7F2] p-4 shadow-inner">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#E5E4DB] bg-white">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-[#E5E4DB]"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-[#719681] stroke-[3.5]"
            strokeDasharray="98, 100"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="absolute font-mono text-sm font-black text-[#315E50]">
          98%
        </span>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#858A83]">
            ATS Pass Engine
          </p>
          <span className="rounded border border-[#719681]/25 bg-[#719681]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#568267]">
            PASS
          </span>
        </div>

        <p className="mt-1 text-xs font-bold text-[#263B33]">
          Greenhouse & Lever Ready
        </p>

        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] text-[#858A83]">
            <ShieldCheck className="h-3 w-3 text-[#568267]" />
            <span>0 Parse errors in table hierarchy</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#858A83]">
            <Zap className="h-3 w-3 text-[#B97862]" />
            <span>Standardized date/heading taxonomy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* VISUAL 3: JOB DESCRIPTION MATCH */

function MatchingVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E7E5DC] bg-[#F8F7F2] p-4 shadow-inner">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#858A83]">
            Role Alignment
          </p>
          <p className="mt-0.5 text-xs font-bold text-[#263B33]">
            Staff Frontend Engineer
          </p>
        </div>

        <span className="font-mono text-base font-black text-[#315E50]">
          94% Match
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E5E4DB]">
        <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] shadow-[0_0_8px_rgba(113,150,129,0.25)]" />
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="rounded-md border border-[#719681]/30 bg-[#719681]/10 px-2 py-0.5 text-[9px] font-medium text-[#315E50]">
          React 19 ✓
        </span>
        <span className="rounded-md border border-[#D9C5A2]/60 bg-[#D9C5A2]/20 px-2 py-0.5 text-[9px] font-medium text-[#806B49]">
          TypeScript ✓
        </span>
        <span className="rounded-md border border-[#719681]/30 bg-[#719681]/10 px-2 py-0.5 text-[9px] font-medium text-[#568267]">
          Distributed Systems ✓
        </span>
        <span className="rounded-md border border-[#B97862]/25 bg-[#B97862]/10 px-2 py-0.5 text-[9px] font-medium text-[#A36551]">
          +2 Missing Skills
        </span>
      </div>
    </div>
  );
}

/* VISUAL 4: TEMPLATES DESIGN */

function TemplateVisual() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#E7E5DC] bg-[#F8F7F2] p-4 shadow-inner">
      <div className="flex items-end gap-3.5">
        <div className="h-20 w-16 rounded-lg border border-[#E5E4DB] bg-white p-1.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="h-1.5 w-6 rounded-full bg-[#A8B2A8]" />
          <div className="mt-2 space-y-1">
            <div className="h-0.5 w-full rounded-full bg-[#E5E4DB]" />
            <div className="h-0.5 w-4/5 rounded-full bg-[#E5E4DB]" />
            <div className="h-0.5 w-3/5 rounded-full bg-[#E5E4DB]" />
          </div>
        </div>

        <div className="relative h-24 w-20 rounded-lg border border-[#719681]/50 bg-white p-2 shadow-[0_0_20px_rgba(113,150,129,0.16)] transition-transform duration-300 group-hover:-translate-y-1.5">
          <div className="h-2 w-8 rounded-full bg-gradient-to-r from-[#315E50] to-[#719681]" />
          <div className="mt-2.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-[#D8DCD5]" />
            <div className="h-1 w-5/6 rounded-full bg-[#E5E4DB]" />
            <div className="h-1 w-4/6 rounded-full bg-[#E5E4DB]" />
          </div>
          <div className="mt-2.5 space-y-1">
            <div className="h-1 w-full rounded-full bg-[#E5E4DB]" />
            <div className="h-1 w-3/4 rounded-full bg-[#E5E4DB]" />
          </div>
          <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#719681] text-white shadow-md">
            <Check className="h-2.5 w-2.5 stroke-[3]" />
          </div>
        </div>

        <div className="h-20 w-16 rounded-lg border border-[#E5E4DB] bg-white p-1.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
          <div className="h-1.5 w-7 rounded-full bg-[#A8B2A8]" />
          <div className="mt-2 space-y-1">
            <div className="h-0.5 w-full rounded-full bg-[#E5E4DB]" />
            <div className="h-0.5 w-5/6 rounded-full bg-[#E5E4DB]" />
            <div className="h-0.5 w-2/3 rounded-full bg-[#E5E4DB]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* STATUS PILL COMPONENT */

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
          ? "border-[#719681]/35 bg-[#719681]/10 text-[#315E50]"
          : "border-[#E5E2D8] bg-white/60 text-[#858A83]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? "bg-[#719681] shadow-[0_0_8px_rgba(113,150,129,0.4)]"
            : "bg-[#C7C7BC]"
        }`}
      />
      {text}
    </div>
  );
}
