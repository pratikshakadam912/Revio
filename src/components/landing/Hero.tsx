"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Terminal,
  RotateCcw,
} from "lucide-react";

// --------------------------------------------------
// SAMPLE DATA
// --------------------------------------------------

const DEFAULT_TEXT =
  "Responsible for managing backend APIs and helping the team deploy updates faster.";

const STRONG_SAMPLE =
  "Architected distributed Node.js and Redis caching pipelines, reducing p99 API latency by 42% across 1.8M daily requests.";

const PASSIVE_PHRASES = [
  "responsible for",
  "helped",
  "helping",
  "worked on",
  "involved in",
  "assisted with",
  "tasked with",
  "participated in",
  "duties included",
];

const ease = [0.22, 1, 0.36, 1] as const;

// --------------------------------------------------
// ANIMATION VARIANTS
// --------------------------------------------------

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

const slideRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease },
  },
};

const floatBadge: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.65, duration: 0.6, ease },
  },
};

// --------------------------------------------------
// BULLET ANALYSIS
// --------------------------------------------------

function analyzeBullet(text: string) {
  const normalized = text.trim().toLowerCase();

  if (!normalized) {
    return {
      score: 0,
      issues: ["Enter a resume bullet point to begin."],
      isValid: false,
    };
  }

  const issues: string[] = [];

  const passive = PASSIVE_PHRASES.filter((phrase) =>
    normalized.includes(phrase),
  );

  const hasMetric =
    /\d+(\.\d+)?\s*(%|percent|x|k|m|million|billion|users|clients|projects|hours|days|weeks|months|ms)?\b/i.test(
      text,
    );

  const hasActionVerb =
    /\b(built|developed|created|designed|implemented|led|managed|optimized|automated|increased|reduced|improved|delivered|launched|architected|engineered|deployed|generated|streamlined|analyzed|maintained)\b/i.test(
      text,
    );

  const hasContext = text.trim().split(/\s+/).length >= 8;

  if (passive.length > 0) {
    issues.push(
      `Passive phrasing detected: "${passive.join(", ")}". Lead with a direct ownership verb.`,
    );
  }

  if (!hasMetric) {
    issues.push(
      "No measurable results detected. Add accurate percentages, numbers, or scale metrics.",
    );
  }

  if (!hasActionVerb) {
    issues.push(
      "No strong action verb detected. Start with a specific action you performed.",
    );
  }

  if (!hasContext) {
    issues.push(
      "Limited context. Explain what you built, how you built it, and the business outcome.",
    );
  }

  const score = Math.max(
    0,
    100 -
      (passive.length > 0 ? 25 : 0) -
      (!hasMetric ? 25 : 0) -
      (!hasActionVerb ? 25 : 0) -
      (!hasContext ? 15 : 0),
  );

  return {
    score,
    issues,
    isValid: true,
  };
}

// --------------------------------------------------
// SCORE STYLING
// --------------------------------------------------

function getScoreMeta(score: number) {
  if (score >= 80) {
    return {
      label: "Strong Impact",
      badgeClass: "border-[#719681]/30 bg-[#719681]/10 text-[#315E50]",
      barClass: "bg-[#56836A]",
    };
  }

  if (score >= 60) {
    return {
      label: "Good Foundation",
      badgeClass: "border-[#8FAE9A]/40 bg-[#DCE7DF]/60 text-[#426B56]",
      barClass: "bg-[#8FAE9A]",
    };
  }

  if (score >= 40) {
    return {
      label: "Needs Refinement",
      badgeClass: "border-[#D9C5A2]/60 bg-[#F4EADB] text-[#967344]",
      barClass: "bg-[#C5A36E]",
    };
  }

  return {
    label: "Weak / Passive",
    badgeClass: "border-[#B97862]/30 bg-[#B97862]/10 text-[#A15E4B]",
    barClass: "bg-[#B97862]",
  };
}

// --------------------------------------------------
// HERO
// --------------------------------------------------

export default function Hero() {
  const [sampleText, setSampleText] = useState(DEFAULT_TEXT);
  const [analyzed, setAnalyzed] = useState(false);

  const reduceMotion = useReducedMotion() ?? false;

  const audit = useMemo(() => analyzeBullet(sampleText), [sampleText]);

  const scoreMeta = useMemo(() => getScoreMeta(audit.score), [audit.score]);

  const initial = reduceMotion ? false : "hidden";

  function handleAudit() {
    if (!sampleText.trim()) {
      setAnalyzed(false);
      return;
    }

    setAnalyzed(true);
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-[#E8E4DA] bg-[#F7F5EF] text-[#29342E] selection:bg-[#315E50] selection:text-white">
      {/* =====================================================
          PREMIUM AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Warm ivory studio background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#FFFFFF_0%,rgba(247,245,239,0.35)_68%)]" />

        {/* Subtle architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(170,166,151,0.17) 1px, transparent 1px), linear-gradient(to bottom, rgba(170,166,151,0.17) 1px, transparent 1px)",
            backgroundSize: "58px 58px",
          }}
        />

        {/* Sage ambient light */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.3, 0.55, 0.3],
                  scale: [1, 1.08, 1],
                  x: [0, -15, 0],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-24 top-10 h-[460px] w-[460px] rounded-full bg-[#B9D0BD]/50 blur-[120px]"
        />

        {/* Champagne ambient light */}
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [0.35, 0.6, 0.35],
                  scale: [1.05, 1, 1.05],
                  y: [0, 15, 0],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-36 left-[5%] h-[460px] w-[540px] rounded-full bg-[#E8D7B9]/60 blur-[130px]"
        />

        {/* Muted terracotta glow */}
        <div className="absolute right-[35%] top-[38%] h-[230px] w-[230px] rounded-full bg-[#E6C5B7]/20 blur-[100px]" />
      </div>

      {/* =====================================================
          MAIN HERO CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-36 lg:px-8 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <motion.div
            variants={stagger}
            initial={initial}
            animate="visible"
            className="relative z-10"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#DDE4DA] bg-white/75 px-4 py-2 shadow-[0_3px_14px_rgba(49,94,80,0.06),inset_0_1px_0_#FFFFFF] backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#719681] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#56836A]" />
                </span>

                <span className="font-mono text-[10px] font-semibold tracking-[0.15em] text-[#496354] sm:text-xs">
                  REVIO — ATS RESUME INTELLIGENCE
                </span>
              </div>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              variants={fadeUp}
              className="mt-8 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#29342E] sm:text-5xl lg:text-[66px]"
            >
              Fix your resume.
              <span className="mt-2 block bg-gradient-to-r from-[#56836A] via-[#719681] to-[#A68A62] bg-clip-text font-medium text-transparent">
                Build your next opportunity.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-xl text-base leading-relaxed text-[#69756D] sm:text-lg sm:leading-8"
            >
              Understand how hiring software parses your experience. Uncover
              weak phrasing, quantify your real impact, and craft an executive
              resume that stands out to recruiters.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/login"
                  className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#315E50] px-6 text-sm font-semibold text-white shadow-[0_10px_25px_-7px_rgba(49,94,80,0.42)] transition-all duration-300 hover:bg-[#264B3F] hover:shadow-[0_14px_30px_-8px_rgba(49,94,80,0.48)]"
                >
                  <span>Upload Resume</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/templates"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#DFE3D9] bg-white/75 px-6 text-sm font-semibold text-[#40564A] shadow-[0_4px_16px_rgba(49,94,80,0.04),inset_0_1px_0_#FFFFFF] backdrop-blur-xl transition-all duration-300 hover:border-[#AFC5B3] hover:bg-white hover:shadow-md"
                >
                  <span>Explore Templates</span>
                  <ArrowUpRight className="h-4 w-4 text-[#719681]" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature checklist */}
            <motion.div
              variants={fadeUp}
              className="mt-12 grid gap-4 border-t border-[#E3E0D6] pt-7 sm:grid-cols-2"
            >
              {[
                "ATS-friendly structural analysis",
                "Pinpoint passive descriptions",
                "Detect missing impact metrics",
                "Export clean, recruiter-ready PDFs",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm font-medium text-[#536259]"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#719681]/30 bg-[#DCE7DF]/70 text-[#426B56]">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* =================================================
              RIGHT COLUMN — RESUME AUDIT
          ================================================= */}

          <motion.div
            variants={slideRight}
            initial={initial}
            animate="visible"
            className="relative"
          >
            {/* Outer glass frame */}
            <div className="relative rounded-[30px] border border-white/90 bg-white/45 p-2 shadow-[0_28px_80px_-18px_rgba(47,69,55,0.15),0_0_1px_1px_rgba(49,94,80,0.07)] backdrop-blur-2xl sm:p-2.5">
              {/* Inner glass panel */}
              <div className="overflow-hidden rounded-[23px] border border-[#E7E7DC] bg-[#FFFEFB]/90 shadow-[inset_0_1px_0_#FFFFFF] backdrop-blur-xl">
                {/* Window header */}
                <div className="flex items-center justify-between border-b border-[#EAE8DF] bg-[#F5F5EF]/85 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE5DC] bg-gradient-to-br from-[#EDF4ED] to-[#DCE9DF] text-[#315E50] shadow-sm">
                      <Terminal className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#29342E]">
                        Quick Resume Audit
                      </p>

                      <p className="mt-0.5 font-mono text-[10px] tracking-wider text-[#89938A]">
                        REVIO / BULLET DIAGNOSTIC
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#DCE7DC] bg-white/90 px-3 py-1.5 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#719681]" />

                    <span className="font-mono text-[10px] font-semibold tracking-wide text-[#52735D]">
                      LIVE DEMO
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {/* Input heading */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="bullet-input"
                      className="text-xs font-semibold text-[#405047]"
                    >
                      Test a resume bullet point
                    </label>

                    {/* Sample selectors */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSampleText(DEFAULT_TEXT);
                          setAnalyzed(true);
                        }}
                        className="rounded-lg border border-[#E6E2D8] bg-[#F6F4EF] px-2.5 py-1.5 font-mono text-[10px] font-medium text-[#7B8179] transition-all hover:border-[#D9C5A2] hover:bg-[#F1EADB] hover:text-[#806A4C]"
                      >
                        Weak Example
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSampleText(STRONG_SAMPLE);
                          setAnalyzed(true);
                        }}
                        className="rounded-lg border border-[#D5E4D7] bg-[#EDF4ED] px-2.5 py-1.5 font-mono text-[10px] font-semibold text-[#426B56] transition-all hover:border-[#AFC5B3] hover:bg-[#E1EDE1]"
                      >
                        Strong Example
                      </button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    id="bullet-input"
                    rows={3}
                    maxLength={2000}
                    value={sampleText}
                    onChange={(e) => {
                      setSampleText(e.target.value);
                      setAnalyzed(false);
                    }}
                    placeholder="Example: Developed backend APIs that reduced response time by 35%..."
                    className="mt-3 w-full resize-y rounded-xl border border-[#E5E5DA] bg-[#F8F8F3]/90 p-4 font-mono text-xs leading-6 text-[#344139] shadow-inner outline-none transition-all duration-300 placeholder:text-[#A6ADA4] focus:border-[#8FAE9A] focus:bg-white focus:ring-4 focus:ring-[#719681]/10"
                  />

                  {/* Input actions */}
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-[#929A90]">
                        {sampleText.length}/2000 CHARS
                      </span>

                      {sampleText !== DEFAULT_TEXT && (
                        <button
                          type="button"
                          onClick={() => {
                            setSampleText(DEFAULT_TEXT);
                            setAnalyzed(false);
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-[#8B948A] transition-colors hover:text-[#315E50]"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Reset
                        </button>
                      )}
                    </div>

                    <motion.button
                      type="button"
                      whileHover={
                        reduceMotion ? undefined : { scale: 1.035, y: -1 }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      onClick={handleAudit}
                      disabled={!sampleText.trim()}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#315E50] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_5px_15px_rgba(49,94,80,0.18)] transition-all hover:bg-[#264B3F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Run Audit</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>

                  {/* =================================================
                      DIAGNOSTIC OUTPUT
                  ================================================= */}

                  <div className="mt-5 rounded-xl border border-[#E8E5DA] bg-[#F7F6F0]/90 p-4 sm:p-5">
                    {/* Output header */}
                    <div className="flex items-center justify-between gap-3 border-b border-[#E7E4D9] pb-3.5">
                      <div>
                        <p className="text-sm font-semibold text-[#344139]">
                          Diagnostic Output
                        </p>

                        <p className="mt-0.5 text-[11px] text-[#92998F]">
                          Lexical &amp; impact rubric evaluation
                        </p>
                      </div>

                      <AnimatePresence mode="wait">
                        {analyzed && audit.isValid ? (
                          <motion.div
                            key="score"
                            initial={
                              reduceMotion ? false : { opacity: 0, scale: 0.9 }
                            }
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2.5"
                          >
                            <span
                              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold ${scoreMeta.badgeClass}`}
                            >
                              {scoreMeta.label}
                            </span>

                            <div className="rounded-lg border border-[#E6E5DA] bg-white px-2.5 py-1 text-right shadow-sm">
                              <p className="font-mono text-base font-bold text-[#315E50]">
                                {audit.score}
                                <span className="text-xs font-normal text-[#A0A79F]">
                                  /100
                                </span>
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="waiting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="rounded-md border border-[#E4E3D9] bg-white px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-wide text-[#92998F]"
                          >
                            READY TO SCAN
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Animated score bar */}
                    <AnimatePresence>
                      {analyzed && audit.isValid && (
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3.5"
                        >
                          <div className="mb-1.5 flex justify-between font-mono text-[10px] text-[#89938A]">
                            <span>IMPACT STRENGTH</span>
                            <span>{audit.score}%</span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-[#E7E9DF]">
                            <motion.div
                              initial={reduceMotion ? false : { width: 0 }}
                              animate={{ width: `${audit.score}%` }}
                              transition={{ duration: 0.9, ease }}
                              className={`h-full rounded-full ${scoreMeta.barClass}`}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Results */}
                    <AnimatePresence mode="wait">
                      {!analyzed ? (
                        <motion.div
                          key="empty"
                          initial={reduceMotion ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-7 text-center"
                        >
                          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#E3E7DD] bg-white shadow-sm">
                            <FileText className="h-4 w-4 text-[#91A094]" />
                          </div>

                          <p className="mt-3 text-xs font-semibold text-[#59665C]">
                            Click &ldquo;Run Audit&rdquo; to evaluate your
                            bullet
                          </p>

                          <p className="mt-1 text-[11px] text-[#969E94]">
                            Checks for passive voice, action verbs, and
                            quantifiable metrics.
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="results"
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 space-y-2.5"
                        >
                          {audit.issues.length > 0 ? (
                            audit.issues.map((issue, index) => (
                              <motion.div
                                key={`${index}-${issue}`}
                                initial={
                                  reduceMotion ? false : { opacity: 0, x: -8 }
                                }
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.07 }}
                                className="flex items-start gap-2.5 rounded-lg border border-[#D9C5A2]/50 bg-[#F4EADB]/50 p-3 text-xs leading-relaxed text-[#665A47]"
                              >
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B28B54]" />
                                <p>{issue}</p>
                              </motion.div>
                            ))
                          ) : (
                            <div className="flex items-start gap-2.5 rounded-lg border border-[#B9D0BD]/70 bg-[#EAF2EA]/80 p-3 text-xs leading-relaxed text-[#426B56]">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#56836A]" />

                              <p>
                                Strong executive structure. This bullet leads
                                with ownership and backs claims with clear
                                measurable outcomes.
                              </p>
                            </div>
                          )}

                          {/* Formula */}
                          <div className="border-t border-[#E7E4D9] pt-3.5">
                            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#89938A]">
                              High-Converting Formula
                            </p>

                            <p className="mt-2 rounded-lg border border-[#E5E3D9] bg-white px-3 py-2.5 font-mono text-[11px] leading-5 text-[#536259]">
                              Action Verb + System/Scope + Method + Quantified
                              Result
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                FLOATING GLASS BADGE
            ================================================= */}

            <motion.div
              initial={initial}
              animate="visible"
              variants={floatBadge}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/85 px-4 py-3 shadow-[0_14px_35px_rgba(49,94,80,0.12),0_0_1px_1px_rgba(49,94,80,0.04)] backdrop-blur-2xl sm:absolute sm:-bottom-6 sm:-left-6 sm:mt-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D5E4D7] bg-gradient-to-br from-[#EDF4ED] to-[#DCE9DF] text-[#56836A]">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#344139]">
                  Recruiter-Calibrated Scoring
                </p>

                <p className="mt-0.5 text-[11px] text-[#929A90]">
                  Analyze &bull; Refine &bull; Export
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* =====================================================
            BOTTOM PROCESS STRIP
        ===================================================== */}

        <motion.div
          initial={initial}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              number: "01",
              title: "ANALYZE",
              description:
                "Parse layout structure and extract core experience signals.",
            },
            {
              number: "02",
              title: "ATS CHECK",
              description:
                "Surface formatting bottlenecks and missing role keywords.",
            },
            {
              number: "03",
              title: "IMPROVE",
              description:
                "Transform passive duties into quantified STAR achievements.",
            },
            {
              number: "04",
              title: "EXPORT",
              description:
                "Generate clean, parser-safe resumes tailored to each role.",
            },
          ].map((item) => (
            <motion.div
              key={item.number}
              variants={fadeUp}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              transition={{ duration: 0.25 }}
              className="group rounded-2xl border border-white/90 bg-white/65 p-5 shadow-[0_5px_22px_rgba(49,94,80,0.045),0_0_1px_1px_rgba(49,94,80,0.045)] backdrop-blur-xl transition-all duration-300 hover:border-[#D5E4D7] hover:bg-white/90 hover:shadow-[0_14px_35px_rgba(49,94,80,0.09)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-bold tracking-wider text-[#536259]">
                  <span className="text-[#56836A]">{item.number}</span>
                  {" / "}
                  {item.title}
                </p>

                <ArrowUpRight className="h-3.5 w-3.5 text-[#A0A99F] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#56836A]" />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#7A857B]">
                {item.description}
              </p>

              <div className="mt-4 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-[#719681] to-[#D9C5A2] transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
