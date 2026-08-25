"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    label: "INPUT",
    title: "Drop your story in.",
    description:
      "Your experience, education, projects, skills, or existing resume. Revio turns scattered career information into structured intelligence.",
  },
  {
    number: "02",
    label: "GENERATE",
    title: "Watch it become a resume.",
    description:
      "Revio transforms your raw experience into sharp, recruiter-ready content while keeping your voice and achievements authentic.",
  },
  {
    number: "03",
    label: "OPTIMIZE",
    title: "Make recruiters stop scrolling.",
    description:
      "Analyze ATS compatibility, strengthen keywords, identify weak sections, and continuously improve your resume.",
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [paused]);

  const next = () => {
    setActiveStep((current) => (current + 1) % steps.length);
  };

  const previous = () => {
    setActiveStep((current) => (current - 1 + steps.length) % steps.length);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#0A0B09] px-5 py-28 text-white sm:px-8 lg:px-10 lg:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ============================================================
          BACKGROUND
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main lime atmosphere */}

        <div
          className="absolute -left-[260px] -top-[300px] h-[850px] w-[850px] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(194,255,47,0.20) 0%, rgba(133,180,20,0.08) 38%, transparent 72%)",
          }}
        />

        {/* Orange atmosphere */}

        <div
          className="absolute -right-[300px] -top-[150px] h-[750px] w-[750px] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,139,46,0.17) 0%, rgba(255,98,20,0.06) 40%, transparent 72%)",
          }}
        />

        {/* Center neon */}

        <div
          className="absolute left-[32%] top-[20%] h-[600px] w-[700px] rounded-full blur-[180px]"
          style={{
            background:
              "radial-gradient(circle, rgba(194,255,47,0.08) 0%, rgba(255,139,46,0.05) 45%, transparent 72%)",
          }}
        />

        {/* Bottom atmosphere */}

        <div
          className="absolute -bottom-[450px] left-1/2 h-[800px] w-[1100px] -translate-x-1/2 rounded-full blur-[160px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(194,255,47,0.10) 0%, rgba(255,139,46,0.05) 45%, transparent 75%)",
          }}
        />

        {/* Fine grid */}

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 45%, transparent 90%)",
          }}
        />

        {/* Scan lines */}

        <div className="absolute left-0 right-0 top-[31%] h-px bg-gradient-to-r from-transparent via-[#C2FF2F]/20 to-transparent" />

        <div className="absolute left-0 right-0 top-[67%] h-px bg-gradient-to-r from-transparent via-[#FF8B2E]/10 to-transparent" />

        {/* Tiny particles */}

        <div className="absolute left-[8%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#C2FF2F] shadow-[0_0_20px_#C2FF2F]" />

        <div className="absolute left-[18%] top-[42%] h-1 w-1 rounded-full bg-[#FF8B2E]" />

        <div className="absolute right-[12%] top-[24%] h-1.5 w-1.5 rounded-full bg-[#FF8B2E] shadow-[0_0_20px_#FF8B2E]" />

        <div className="absolute right-[20%] top-[52%] h-1 w-1 rounded-full bg-[#C2FF2F]" />

        <div className="absolute left-[44%] top-[10%] h-1 w-1 rounded-full bg-white/40" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}

          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60 shadow-[0_15px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#C2FF2F] opacity-60" />

              <span className="relative h-2 w-2 rounded-full bg-[#C2FF2F] shadow-[0_0_12px_#C2FF2F]" />
            </span>
            The Revio intelligence system
          </div>

          {/* Heading */}

          <h2 className="mt-8 text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.07em] text-white sm:text-6xl lg:text-[88px]">
            Your career is data.
            <br />
            <span className="bg-gradient-to-r from-[#C2FF2F] via-[#E9FF9A] to-[#FF9B3D] bg-clip-text text-transparent">
              Revio makes it powerful.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
            From raw experience to a high-impact resume. Revio analyzes,
            creates, and optimizes every important detail.
          </p>
        </div>

        {/* ============================================================
            MAIN EXPERIENCE
        ============================================================ */}

        <div className="relative mt-24">
          {/* ==========================================================
              FLOATING ATS
          ========================================================== */}

          <div className="absolute -left-8 top-16 z-30 hidden lg:block xl:left-[-35px]">
            <div className="animate-[float_5s_ease-in-out_infinite]">
              <div className="relative rounded-[24px] border border-white/10 bg-[#11130F]/90 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#C2FF2F]/5 to-transparent" />

                <div className="relative flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-white/10">
                    <div className="absolute inset-[-4px] rounded-full border-[4px] border-transparent border-t-[#C2FF2F] border-r-[#FF8B2E]" />

                    <span className="text-xs font-bold text-[#C2FF2F]">98</span>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                      ATS SCORE
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white/85">
                      Excellent match
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              FLOATING AI
          ========================================================== */}

          <div className="absolute -right-8 top-20 z-30 hidden lg:block xl:right-[-35px]">
            <div className="animate-[floatReverse_6s_ease-in-out_infinite]">
              <div className="relative rounded-[22px] border border-white/10 bg-[#11130F]/90 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C2FF2F] to-[#7FAF14] text-lg text-black shadow-[0_0_25px_rgba(194,255,47,0.18)]">
                    ✦
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                      REVIO AI
                    </p>

                    <p className="mt-1 text-xs font-semibold text-white/85">
                      Optimizing experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==========================================================
              SHOWCASE
          ========================================================== */}

          <div className="relative mx-auto max-w-6xl">
            {/* Neon glow */}

            <div
              className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(194,255,47,0.12) 0%, rgba(255,139,46,0.08) 42%, transparent 75%)",
              }}
            />

            {/* Main shell */}

            <div className="relative rounded-[42px] border border-white/[0.10] bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-white/[0.015] p-2 shadow-[0_50px_150px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-4 lg:p-5">
              <div className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#10120F] px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                {/* Internal atmosphere */}

                <div
                  className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full blur-[110px]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(194,255,47,0.08) 0%, transparent 70%)",
                  }}
                />

                <div
                  className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full blur-[110px]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,139,46,0.07) 0%, transparent 70%)",
                  }}
                />

                {/* ======================================================
                    PRODUCT BAR
                ====================================================== */}

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#C2FF2F] to-[#8EBB1B] text-sm font-black text-black shadow-[0_0_30px_rgba(194,255,47,0.15)]">
                      R
                      <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#FF8B2E] blur-md" />
                    </div>

                    <div>
                      <p className="text-sm font-bold tracking-[-0.03em] text-white">
                        Revio
                      </p>

                      <p className="text-[9px] text-white/30">
                        Career intelligence
                      </p>
                    </div>
                  </div>

                  <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C2FF2F] shadow-[0_0_10px_#C2FF2F]" />

                    <span className="text-[9px] font-semibold tracking-[0.16em] text-white/40">
                      AI ENGINE ONLINE
                    </span>
                  </div>
                </div>

                {/* ======================================================
                    WORKFLOW
                ====================================================== */}

                <div className="relative mt-10">
                  {/* Connector */}

                  <div className="absolute left-[10%] right-[10%] top-[42px] hidden h-px bg-gradient-to-r from-[#C2FF2F]/40 via-white/10 to-[#FF8B2E]/40 md:block" />

                  <div className="relative grid gap-5 md:grid-cols-3">
                    {steps.map((step, index) => {
                      const active = activeStep === index;

                      return (
                        <button
                          key={step.number}
                          type="button"
                          onClick={() => setActiveStep(index)}
                          className={`group relative text-left transition-all duration-700 ${
                            active
                              ? "z-20 md:-translate-y-5"
                              : "z-10 md:translate-y-1"
                          }`}
                        >
                          {/* Depth */}

                          <div
                            className={`absolute inset-x-3 bottom-[-10px] top-3 rounded-[28px] border border-white/[0.05] bg-white/[0.025] transition-all duration-700 ${
                              active ? "opacity-100" : "opacity-40"
                            }`}
                          />

                          {/* Card */}

                          <div
                            className={`relative min-h-[410px] overflow-hidden rounded-[28px] border p-6 transition-all duration-700 sm:p-7 ${
                              active
                                ? "border-[#C2FF2F]/25 bg-gradient-to-br from-[#171A13] via-[#11140F] to-[#15120D] shadow-[0_40px_100px_rgba(0,0,0,0.55),0_0_60px_rgba(194,255,47,0.06)]"
                                : "border-white/[0.07] bg-white/[0.025] shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
                            }`}
                            style={{
                              transform: active
                                ? "perspective(1400px) rotateX(0deg) translateZ(28px)"
                                : index < activeStep
                                  ? "perspective(1400px) rotateY(-3deg) translateZ(-15px)"
                                  : "perspective(1400px) rotateY(3deg) translateZ(-15px)",
                            }}
                          >
                            {/* Active glow */}

                            <div
                              className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[90px] transition-all duration-1000 ${
                                active ? "opacity-100" : "opacity-20"
                              }`}
                              style={{
                                background:
                                  index === 0
                                    ? "radial-gradient(circle, rgba(194,255,47,0.16), transparent 70%)"
                                    : index === 1
                                      ? "radial-gradient(circle, rgba(255,139,46,0.15), transparent 70%)"
                                      : "radial-gradient(circle, rgba(194,255,47,0.12), transparent 70%)",
                              }}
                            />

                            <div className="relative">
                              {/* Top */}

                              <div className="flex items-center justify-between">
                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold transition-all duration-500 ${
                                    active
                                      ? "border-[#C2FF2F]/20 bg-[#C2FF2F]/10 text-[#C2FF2F] shadow-[0_0_30px_rgba(194,255,47,0.08)]"
                                      : "border-white/[0.08] bg-white/[0.035] text-white/35"
                                  }`}
                                >
                                  {step.number}
                                </div>

                                <span
                                  className={`text-[10px] font-bold tracking-[0.2em] ${
                                    active ? "text-[#C2FF2F]" : "text-white/25"
                                  }`}
                                >
                                  {step.label}
                                </span>
                              </div>

                              {/* Visual */}

                              <div className="mt-7 h-[110px]">
                                {index === 0 && <StartVisual active={active} />}

                                {index === 1 && (
                                  <CreateVisual active={active} />
                                )}

                                {index === 2 && (
                                  <OptimizeVisual active={active} />
                                )}
                              </div>

                              {/* Text */}

                              <div className="mt-6">
                                <h3 className="text-[24px] font-semibold leading-tight tracking-[-0.05em] text-white">
                                  {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-white/40">
                                  {step.description}
                                </p>
                              </div>

                              {/* Progress */}

                              <div className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-full">
                                <div
                                  className={`h-[3px] origin-left bg-gradient-to-r from-[#C2FF2F] via-[#DFFF70] to-[#FF8B2E] transition-transform duration-700 ${
                                    active ? "scale-x-100" : "scale-x-0"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ======================================================
                    CONTROLS
                ====================================================== */}

                <div className="relative mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={previous}
                    aria-label="Previous"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/50 transition-all hover:-translate-x-1 hover:border-[#C2FF2F]/30 hover:text-[#C2FF2F]"
                  >
                    ←
                  </button>

                  <div className="flex items-center gap-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.number}
                        type="button"
                        onClick={() => setActiveStep(index)}
                        aria-label={`Step ${index + 1}`}
                        className={`transition-all duration-500 ${
                          activeStep === index
                            ? "h-1.5 w-9 rounded-full bg-gradient-to-r from-[#C2FF2F] to-[#FF8B2E] shadow-[0_0_15px_rgba(194,255,47,0.25)]"
                            : "h-1.5 w-1.5 rounded-full bg-white/20"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/50 transition-all hover:translate-x-1 hover:border-[#FF8B2E]/30 hover:text-[#FF8B2E]"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* ==========================================================
                FLOATING RESUME
            ========================================================== */}

            <div className="pointer-events-none absolute -bottom-24 -right-8 z-30 hidden w-[250px] xl:block">
              <div className="animate-[resumeFloat_6s_ease-in-out_infinite]">
                <div
                  className="relative rounded-[18px] border border-white/10 bg-gradient-to-br from-[#1C1F19] via-[#13150F] to-[#0D0E0B] p-5 shadow-[0_50px_120px_rgba(0,0,0,0.65)]"
                  style={{
                    transform:
                      "perspective(1100px) rotateY(-14deg) rotateX(5deg) rotateZ(2deg)",
                  }}
                >
                  {/* Resume glow */}

                  <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-[#C2FF2F]/10 blur-3xl" />

                  {/* Header */}

                  <div className="relative flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#C2FF2F] to-[#FF8B2E] text-xs font-black text-black">
                      PK
                    </div>

                    <div>
                      <div className="h-2 w-24 rounded-full bg-white/60" />

                      <div className="mt-2 h-1.5 w-16 rounded-full bg-white/10" />
                    </div>
                  </div>

                  {/* Content */}

                  <div className="relative mt-5 space-y-5">
                    <ResumeSection />
                    <ResumeSection />
                    <ResumeSection />
                  </div>

                  {/* ATS */}

                  <div className="absolute -right-4 top-16 rounded-xl border border-[#C2FF2F]/20 bg-[#C2FF2F] px-3 py-2 shadow-[0_0_35px_rgba(194,255,47,0.18)]">
                    <span className="text-[9px] font-black tracking-wide text-black">
                      ATS 98
                    </span>
                  </div>

                  {/* Orange detail */}

                  <div className="absolute -bottom-2 -left-2 h-8 w-8 rounded-lg bg-[#FF8B2E] shadow-[0_0_30px_rgba(255,139,46,0.25)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            FEATURE STRIP
        ============================================================ */}

        <div className="relative mt-24 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-col divide-y divide-white/[0.07] sm:flex-row sm:divide-x sm:divide-y-0">
            <Feature
              icon="✦"
              title="AI Content"
              description="Sharp writing without losing your voice"
            />

            <Feature
              icon="◎"
              title="ATS Intelligence"
              description="Understand what recruiters actually see"
            />

            <Feature
              icon="◈"
              title="Premium Templates"
              description="Designed to look different from the crowd"
            />

            <Feature
              icon="↗"
              title="Ready to Apply"
              description="Export your strongest version instantly"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          ANIMATIONS
      ============================================================ */}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(-1deg);
          }

          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translateY(-3px) rotate(1deg);
          }

          50% {
            transform: translateY(10px) rotate(-1deg);
          }
        }

        @keyframes resumeFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-14px);
          }
        }
      `}</style>
    </section>
  );
}

/* ================================================================
   START VISUAL
================================================================ */

function StartVisual({ active }: { active: boolean }) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171A13] p-4 ${
        active ? "shadow-[0_0_40px_rgba(194,255,47,0.06)]" : ""
      }`}
    >
      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#C2FF2F]/10 blur-2xl" />

      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C2FF2F] to-[#91BD1B]">
          <div className="h-4 w-4 rounded-full bg-black" />
        </div>

        <div className="flex-1">
          <div className="h-2 w-24 rounded-full bg-white/60" />

          <div className="mt-2 h-1.5 w-16 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="relative mt-4 flex gap-2">
        <div className="h-7 flex-1 rounded-lg bg-white/[0.07]" />

        <div className="h-7 w-10 rounded-lg bg-[#FF8B2E]/20" />
      </div>

      <div
        className={`absolute -right-2 -top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#C2FF2F] text-sm font-bold text-black shadow-[0_0_25px_rgba(194,255,47,0.25)] ${
          active ? "rotate-6 scale-110" : ""
        }`}
      >
        +
      </div>
    </div>
  );
}

/* ================================================================
   CREATE VISUAL
================================================================ */

function CreateVisual({ active }: { active: boolean }) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#171510] p-4 ${
        active ? "shadow-[0_0_40px_rgba(255,139,46,0.07)]" : ""
      }`}
    >
      <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-[#FF8B2E]/10 blur-2xl" />

      <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#C2FF2F] to-[#FF8B2E]" />

          <div className="flex-1">
            <div className="h-2 w-20 rounded-full bg-white/60" />

            <div className="mt-2 h-1.5 w-28 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-white/10" />

          <div className="h-1.5 w-4/5 rounded-full bg-white/[0.06]" />
        </div>
      </div>

      <div
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF8B2E] text-black shadow-[0_0_25px_rgba(255,139,46,0.22)] ${
          active ? "rotate-12 scale-110" : ""
        }`}
      >
        ✦
      </div>

      <div className="absolute bottom-2 right-3 rounded-full border border-[#C2FF2F]/20 bg-[#C2FF2F]/10 px-2.5 py-1 text-[8px] font-bold text-[#C2FF2F]">
        AI GENERATED
      </div>
    </div>
  );
}

/* ================================================================
   OPTIMIZE VISUAL
================================================================ */

function OptimizeVisual({ active }: { active: boolean }) {
  return (
    <div
      className={`relative h-full rounded-2xl border border-white/[0.08] bg-[#141810] p-4 ${
        active ? "shadow-[0_0_40px_rgba(194,255,47,0.07)]" : ""
      }`}
    >
      <div className="absolute -left-5 -top-5 h-20 w-20 rounded-full bg-[#C2FF2F]/10 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[5px] border-white/[0.08]">
          <div
            className="absolute inset-[-5px] rounded-full border-[5px] border-transparent border-t-[#C2FF2F] border-r-[#FF8B2E]"
            style={{
              transform: active ? "rotate(130deg)" : "rotate(35deg)",
              transition: "transform 1s ease",
            }}
          />

          <span className="text-sm font-bold text-[#C2FF2F]">98</span>
        </div>

        <div className="flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/30">
            ATS SCORE
          </div>

          <div className="mt-1 text-sm font-bold text-white/80">Excellent</div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-[#C2FF2F] to-[#FF8B2E] transition-all duration-1000 ${
                active ? "w-[96%]" : "w-[70%]"
              }`}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-4 flex gap-1.5">
        <span className="rounded-full bg-[#C2FF2F]/10 px-2 py-1 text-[8px] font-medium text-[#C2FF2F]">
          React
        </span>

        <span className="rounded-full bg-[#FF8B2E]/10 px-2 py-1 text-[8px] font-medium text-[#FF9E55]">
          Node.js
        </span>

        <span className="rounded-full bg-[#C2FF2F]/10 px-2 py-1 text-[8px] font-medium text-[#C2FF2F]">
          SQL
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   RESUME SECTION
================================================================ */

function ResumeSection() {
  return (
    <div>
      <div className="h-1.5 w-16 rounded-full bg-[#C2FF2F]/60" />

      <div className="mt-2 space-y-1.5">
        <div className="h-1 w-full rounded-full bg-white/[0.10]" />

        <div className="h-1 w-[85%] rounded-full bg-white/[0.07]" />

        <div className="h-1 w-[65%] rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

/* ================================================================
   FEATURE
================================================================ */

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-1 items-center gap-4 px-6 py-6 transition-all duration-300 hover:bg-white/[0.025]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-sm text-[#C2FF2F] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C2FF2F]/20 group-hover:bg-[#C2FF2F]/10">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-white/80">{title}</p>

        <p className="mt-1 text-[10px] leading-4 text-white/30">
          {description}
        </p>
      </div>
    </div>
  );
}
