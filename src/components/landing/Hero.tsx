"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Check,
  FileText,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  Zap,
} from "lucide-react";

const experienceItems = [
  {
    role: "Senior Product Designer",
    company: "Nova Technologies",
    date: "2023 — Present",
  },
  {
    role: "Product Designer",
    company: "Creative Labs",
    date: "2021 — 2023",
  },
];

const skills = ["Product Design", "Figma", "UX Research", "Strategy"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F7F9FC] text-[#172033]">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 h-[600px] w-[600px] rounded-full bg-[#EAF2FF] blur-3xl" />

        <div className="absolute right-[-180px] top-[280px] h-[550px] w-[550px] rounded-full bg-[#EEF5FF] blur-3xl" />

        <div className="absolute left-1/2 top-[500px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#E5EFFC]/50 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.32]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,125,243,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,125,243,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 35%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* =====================================================
            HERO INTRO
        ====================================================== */}
        <div className="pt-28 sm:pt-32 lg:pt-36">
          {/* Announcement */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/15 bg-white px-4 py-2 text-xs font-semibold text-[#4F7DF3] shadow-[0_6px_24px_rgba(79,125,243,0.06)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF1FF]">
                <Sparkles className="h-3 w-3 text-[#4F7DF3]" />
              </span>
              AI-powered resume builder
              <span className="hidden h-1 w-1 rounded-full bg-[#C6D5F5] sm:block" />
              <span className="hidden font-medium text-[#7C8799] sm:block">
                Built for ambitious careers
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="mx-auto mt-10 max-w-5xl text-center sm:mt-12">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-[#EAF1FF] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4F7DF3] sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DF3]" />
              Smarter resumes. Better opportunities.
            </div>

            <h1 className="text-balance text-[3.4rem] font-semibold leading-[0.95] tracking-[-0.065em] text-[#172033] sm:text-6xl lg:text-[82px]">
              Build a resume
              <br />
              <span className="relative inline-block text-[#4F7DF3]">
                that gets noticed.
                <span className="absolute -bottom-2 left-0 h-2.5 w-full rounded-full bg-[#DCE8FF] blur-[4px]" />
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              Create a polished, ATS-friendly resume with AI that understands
              your experience, strengthens your story, and helps you stand out
              to the right employers.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-[#4F7DF3] px-7 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(79,125,243,0.24)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F6FE8] hover:shadow-[0_20px_45px_rgba(79,125,243,0.30)]"
              >
                Create my resume
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#templates"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-full border border-[#DCE2EA] bg-white px-7 text-sm font-semibold text-[#394457] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9D5E8] hover:shadow-md"
              >
                Explore templates
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Trust */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#7B8495]">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                Free to start
              </span>

              <span className="h-1 w-1 rounded-full bg-[#D2D9E3]" />

              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                ATS optimized
              </span>

              <span className="h-1 w-1 rounded-full bg-[#D2D9E3]" />

              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                AI assisted
              </span>

              <span className="h-1 w-1 rounded-full bg-[#D2D9E3]" />

              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                No credit card
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRODUCT PREVIEW
        ====================================================== */}
        <div className="relative mx-auto mt-20 max-w-6xl pb-20 sm:mt-24 lg:mt-28">
          {/* Product glow */}
          <div className="absolute left-1/2 top-12 h-[80%] w-[75%] -translate-x-1/2 rounded-[5rem] bg-[#DCE9FF] opacity-70 blur-[80px]" />

          {/* =================================================
              LEFT FLOATING CARD
          ================================================== */}
          <div className="absolute -left-10 top-28 z-20 hidden w-52 rounded-2xl border border-[#DCE3ED] bg-white p-4 shadow-[0_25px_70px_rgba(40,60,90,0.10)] lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1FF]">
                <BrainCircuit className="h-4 w-4 text-[#4F7DF3]" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#263246]">
                  AI Analysis
                </p>

                <p className="mt-0.5 text-[10px] text-[#8A93A3]">
                  Resume intelligence
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-[#F5F8FD] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#7B8495]">
                  Resume strength
                </span>

                <span className="text-xs font-bold text-[#4F7DF3]">94%</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DDE6F5]">
                <div className="h-full w-[94%] rounded-full bg-[#4F7DF3]" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[9px] text-[#7B8495]">
              <Check className="h-3 w-3 text-[#4F7DF3]" />
              Strong profile
            </div>
          </div>

          {/* =================================================
              RIGHT FLOATING CARD
          ================================================== */}
          <div className="absolute -right-10 top-40 z-20 hidden w-56 rounded-2xl border border-[#DCE3ED] bg-white p-4 shadow-[0_25px_70px_rgba(40,60,90,0.10)] lg:block">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF]">
                <WandSparkles className="h-4 w-4 text-[#4F7DF3]" />
              </div>

              <div>
                <p className="text-xs font-semibold text-[#263246]">
                  AI suggestion
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#7B8495]">
                  Add measurable impact to make this achievement stronger.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-lg bg-[#F1F6FF] px-3 py-2 text-[10px] font-semibold text-[#4F7DF3]">
              Improve with AI
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* =================================================
              MAIN APPLICATION
          ================================================== */}
          <div className="relative rounded-[2rem] border border-[#DCE2EA] bg-white/80 p-2 shadow-[0_40px_120px_rgba(40,60,90,0.12)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
            {/* Browser bar */}
            <div className="flex h-11 items-center justify-between rounded-[1.25rem] border border-[#E5E9EF] bg-[#F9FAFC] px-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D6DCE5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#D6DCE5]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#D6DCE5]" />
              </div>

              <div className="hidden rounded-full border border-[#E5E9EF] bg-white px-5 py-1.5 text-[9px] text-[#8B94A3] sm:block">
                app.revio.ai/builder
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden h-6 w-6 rounded-full bg-[#EAF1FF] sm:block" />

                <div className="h-6 w-16 rounded-full bg-[#4F7DF3]" />
              </div>
            </div>

            {/* Application */}
            <div className="mt-2 grid min-h-[560px] overflow-hidden rounded-[1.5rem] border border-[#E2E7EE] bg-white lg:grid-cols-[185px_1fr_245px]">
              {/* =============================================
                  SIDEBAR
              ============================================== */}
              <aside className="hidden border-r border-[#E6EAF0] bg-[#FBFCFE] p-5 lg:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F7DF3] text-white shadow-[0_6px_16px_rgba(79,125,243,0.20)]">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <span className="font-semibold tracking-tight text-[#263246]">
                    Revio
                  </span>
                </div>

                <div className="mt-9">
                  <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A3ACBA]">
                    Resume
                  </p>

                  <div className="space-y-1.5">
                    {[
                      "Personal",
                      "Experience",
                      "Education",
                      "Skills",
                      "Projects",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-xl px-3 py-2.5 text-[11px] transition ${
                          index === 1
                            ? "bg-[#EAF1FF] font-semibold text-[#4F7DF3]"
                            : "text-[#7B8495]"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-9 rounded-2xl border border-[#DDE7F5] bg-[#F3F7FD] p-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                      <WandSparkles className="h-3.5 w-3.5 text-[#4F7DF3]" />
                    </div>

                    <span className="text-[10px] font-semibold text-[#344054]">
                      AI Assistant
                    </span>
                  </div>

                  <p className="mt-2 text-[9px] leading-4 text-[#7B8495]">
                    Get intelligent suggestions while you build your resume.
                  </p>

                  <button className="mt-3 w-full rounded-lg bg-[#4F7DF3] py-2 text-[9px] font-semibold text-white transition hover:bg-[#3F6FE8]">
                    Improve resume
                  </button>
                </div>
              </aside>

              {/* =============================================
                  RESUME
              ============================================== */}
              <div className="bg-[#F1F4F8] p-4 sm:p-7">
                <div className="mx-auto max-w-[560px] bg-white p-6 shadow-[0_20px_50px_rgba(40,55,80,0.08)] sm:p-9">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-[#E6E9EE] pb-5">
                    <div>
                      <h3 className="text-xl font-bold tracking-[-0.03em] text-[#252D3A] sm:text-2xl">
                        Alex Morgan
                      </h3>

                      <p className="mt-1 text-[9px] text-[#858E9C] sm:text-[10px]">
                        Product Designer · Bangalore, India
                      </p>
                    </div>

                    <div className="hidden text-right text-[8px] leading-4 text-[#858E9C] sm:block">
                      alex@email.com
                      <br />
                      linkedin.com/in/alex
                    </div>
                  </div>

                  {/* Profile */}
                  <div className="mt-6">
                    <h4 className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#4F7DF3]">
                      Profile
                    </h4>

                    <p className="mt-2 text-[9px] leading-4 text-[#747D8B] sm:text-[10px] sm:leading-5">
                      Product designer focused on creating intuitive digital
                      experiences and scalable design systems that turn complex
                      problems into simple products.
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mt-7">
                    <h4 className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#4F7DF3]">
                      Experience
                    </h4>

                    <div className="mt-4 space-y-5">
                      {experienceItems.map((experience) => (
                        <div key={experience.role}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-semibold text-[#303845]">
                                {experience.role}
                              </p>

                              <p className="mt-0.5 text-[8px] text-[#858E9C]">
                                {experience.company}
                              </p>
                            </div>

                            <span className="text-[7px] text-[#858E9C]">
                              {experience.date}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="flex gap-2">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#4F7DF3]" />
                              <div className="h-1.5 w-full rounded-full bg-[#E3E7EC]" />
                            </div>

                            <div className="flex gap-2">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#4F7DF3]" />
                              <div className="h-1.5 w-[88%] rounded-full bg-[#E3E7EC]" />
                            </div>

                            <div className="flex gap-2">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#4F7DF3]" />
                              <div className="h-1.5 w-[94%] rounded-full bg-[#E3E7EC]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-7 grid grid-cols-2 gap-8 border-t border-[#E6E9EE] pt-6">
                    <div>
                      <h4 className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#4F7DF3]">
                        Education
                      </h4>

                      <p className="mt-3 text-[9px] font-semibold text-[#303845]">
                        Master of Design
                      </p>

                      <p className="mt-1 text-[8px] text-[#858E9C]">
                        Design Institute
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#4F7DF3]">
                        Skills
                      </h4>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#EAF1FF] px-2 py-1 text-[7px] font-medium text-[#4F7DF3]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =============================================
                  AI PANEL
              ============================================== */}
              <aside className="hidden border-l border-[#E6EAF0] bg-[#FBFCFE] p-5 xl:block">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#263246]">
                      Resume Intelligence
                    </p>

                    <p className="mt-1 text-[10px] text-[#8A93A3]">
                      AI-powered analysis
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF1FF]">
                    <BrainCircuit className="h-4 w-4 text-[#4F7DF3]" />
                  </div>
                </div>

                {/* Score */}
                <div className="mt-8 flex justify-center">
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-[#E3ECFB]">
                    <div className="absolute inset-[-10px] rounded-full border-[10px] border-[#4F7DF3] border-b-transparent border-r-transparent rotate-[25deg]" />

                    <div className="text-center">
                      <div className="text-3xl font-bold tracking-tight text-[#303845]">
                        94
                      </div>

                      <div className="text-[9px] text-[#8B94A3]">
                        out of 100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="mt-8 space-y-3">
                  <div className="rounded-2xl border border-[#E1E6ED] bg-white p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF1FF]">
                        <Check className="h-3 w-3 text-[#4F7DF3]" />
                      </div>

                      <span className="text-[10px] font-semibold">
                        Strong profile
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] leading-4 text-[#858E9C]">
                      Your summary clearly communicates your expertise.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E1E6ED] bg-white p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF2ED]">
                        <Zap className="h-3 w-3 text-[#D97858]" />
                      </div>

                      <span className="text-[10px] font-semibold">
                        Improve impact
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] leading-4 text-[#858E9C]">
                      Add measurable results to your experience bullets.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E1E6ED] bg-white p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDF7F3]">
                        <ShieldCheck className="h-3 w-3 text-[#4E9A7A]" />
                      </div>

                      <span className="text-[10px] font-semibold">
                        ATS ready
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] leading-4 text-[#858E9C]">
                      Your resume structure is easy for ATS systems to read.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* =================================================
              BOTTOM FLOATING CARD
          ================================================== */}
          <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-3 rounded-2xl border border-[#DCE3ED] bg-white px-5 py-3 shadow-[0_20px_60px_rgba(40,60,90,0.12)] sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF1FF]">
              <FileText className="h-4 w-4 text-[#4F7DF3]" />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-[#303845]">
                Professional templates
              </p>

              <p className="text-[9px] text-[#8B94A3]">
                Designed for modern careers
              </p>
            </div>

            <div className="ml-3 flex -space-x-2">
              <div className="h-7 w-7 rounded-full border-2 border-white bg-[#DCE8FF]" />
              <div className="h-7 w-7 rounded-full border-2 border-white bg-[#F3D8D0]" />
              <div className="h-7 w-7 rounded-full border-2 border-white bg-[#DDEFE8]" />
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM VALUE STRIP
        ====================================================== */}
        <div className="grid border-t border-[#E1E6ED] py-10 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-3 border-b border-[#E1E6ED] py-5 sm:border-b-0 sm:border-r sm:py-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1FF]">
              <BrainCircuit className="h-4 w-4 text-[#4F7DF3]" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#303845]">
                AI-powered writing
              </p>

              <p className="mt-0.5 text-[10px] text-[#8B94A3]">
                Turn ideas into impact
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-b border-[#E1E6ED] py-5 sm:border-b-0 sm:border-r sm:py-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1FF]">
              <ScanSearch className="h-4 w-4 text-[#4F7DF3]" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#303845]">
                Instant optimization
              </p>

              <p className="mt-0.5 text-[10px] text-[#8B94A3]">
                Improve your resume faster
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-5 sm:py-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1FF]">
              <ShieldCheck className="h-4 w-4 text-[#4F7DF3]" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#303845]">
                ATS-friendly
              </p>

              <p className="mt-0.5 text-[10px] text-[#8B94A3]">
                Built to pass screening
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
