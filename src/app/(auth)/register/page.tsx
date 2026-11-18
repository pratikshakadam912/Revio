import Link from "next/link";
import { ArrowLeft, Check, Sparkles, ShieldCheck, Zap } from "lucide-react";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5EF] text-[#263B33] selection:bg-[#315E50] selection:text-white">
      {/* ============================================================
          WARM BACKGROUND ATMOSPHERE
      ============================================================ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Sage glow — top left */}
        <div className="absolute -left-[280px] -top-[260px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-[#719681]/25 via-[#D9C5A2]/20 to-transparent blur-[140px]" />

        {/* Champagne glow — top right */}
        <div className="absolute -right-[280px] top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-[#D9C5A2]/35 via-[#719681]/10 to-transparent blur-[140px]" />

        {/* Ambient center field */}
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#719681]/10 blur-[170px]" />

        {/* Bottom ambient glow */}
        <div className="absolute -bottom-[400px] left-1/2 h-[750px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#D9C5A2]/30 via-[#719681]/10 to-transparent blur-[160px]" />

        {/* Subtle radial grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Ambient decorative particles */}
        <div className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-[#719681] shadow-[0_0_15px_rgba(113,150,129,0.6)]" />
        <div className="absolute left-[28%] bottom-[18%] h-1 w-1 rounded-full bg-[#D9C5A2]" />
        <div className="absolute right-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#B97862] shadow-[0_0_15px_rgba(185,120,98,0.4)]" />
        <div className="absolute right-[30%] bottom-[20%] h-1 w-1 rounded-full bg-[#719681]" />
      </div>

      {/* ============================================================
          MAIN CONTAINER
      ============================================================ */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_520px] lg:gap-16">
          {/* ========================================================
              LEFT — BRAND / VALUE PROPOSITION
          ======================================================== */}
          <div className="hidden lg:block">
            {/* Logo */}
            <Link
              href="/"
              className="group inline-flex items-center gap-3 text-xl font-black tracking-tight text-[#263B33]"
            >
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#315E50] via-[#477965] to-[#719681] text-white shadow-[0_8px_22px_rgba(49,94,80,0.22)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_28px_rgba(49,94,80,0.3)]">
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                <Sparkles className="relative z-10 h-4 w-4" />
              </span>
              Revio
              <span className="text-[#719681]">.</span>
            </Link>

            <div className="mt-16 max-w-xl">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#719681]/25 bg-white/65 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#315E50] shadow-[0_4px_16px_rgba(49,94,80,0.06)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#719681] opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-[#719681]" />
                </span>
                Start Free with AI Credits
              </div>

              {/* Heading */}
              <h1 className="mt-7 text-balance text-5xl font-black leading-[1.02] tracking-tight text-[#263B33] xl:text-[64px]">
                Your next role{" "}
                <span className="bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
                  starts here.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#777D76]">
                Join over 50,000+ candidates engineering high-converting resumes
                with quantified STAR bullet points and instant ATS verification.
              </p>

              {/* Value Checklist */}
              <div className="mt-8 space-y-3.5">
                {[
                  "AI STAR achievement rewriter",
                  "ATS structural audit (Greenhouse, Lever, Workday)",
                  "Job description keyword alignment matrix",
                  "LaTeX and single-column PDF export engines",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-[#46594F]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#719681]/30 bg-[#719681]/10 text-[#315E50]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Bottom Trust Indicators */}
              <div className="mt-12 flex items-center gap-4 border-t border-[#315E50]/10 pt-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#777D76]">
                  <ShieldCheck className="h-4 w-4 text-[#315E50]" />
                  <span>SOC2 Type II Certified</span>
                </div>

                <span className="h-1 w-1 rounded-full bg-[#D9C5A2]" />

                <div className="flex items-center gap-2 text-xs font-semibold text-[#777D76]">
                  <Zap className="h-4 w-4 text-[#B97862]" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT — REGISTER GLASS CARD
          ======================================================== */}
          <div className="w-full">
            {/* Mobile Brand Logo */}
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-xl font-black tracking-tight text-[#263B33]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#315E50] to-[#719681] text-white shadow-md">
                  <Sparkles className="h-4 w-4" />
                </span>
                Revio
                <span className="text-[#719681]">.</span>
              </Link>
            </div>

            {/* Outer Glass Shell */}
            <div className="relative rounded-[36px] border border-white/90 bg-white/55 p-2.5 shadow-[0_30px_100px_rgba(49,59,48,0.10)] backdrop-blur-2xl sm:p-3.5">
              {/* Inner Shell */}
              <div className="relative overflow-hidden rounded-[28px] border border-[#E7E5DC] bg-white/75 px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] sm:px-9 sm:py-10">
                {/* Top Accent Line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#719681]/60 to-transparent" />

                {/* Inner Ambient Glows */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#719681]/10 blur-[100px]" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-[350px] w-[350px] rounded-full bg-[#D9C5A2]/20 blur-[100px]" />

                <div className="relative">
                  {/* Back Link */}
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#858A83] transition-colors hover:text-[#315E50]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Back to Revio
                  </Link>

                  {/* Header */}
                  <div className="mt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#719681]/25 bg-[#719681]/10 text-[#315E50] shadow-[0_6px_20px_rgba(49,94,80,0.08)]">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <h2 className="mt-5 text-balance text-3xl font-black tracking-tight text-[#263B33] sm:text-4xl">
                      Create your account.
                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-[#777D76]">
                      Start building a resume engineered to convert recruiter
                      attention into interviews.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="my-7 h-px bg-[#E7E5DC]" />

                  {/* Register Form */}
                  <RegisterForm />

                  {/* Login Callout */}
                  <p className="mt-7 text-center text-xs text-[#858A83]">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-[#315E50] transition-colors hover:text-[#719681] hover:underline"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Compliance Micro-copy */}
            <p className="mt-5 text-center text-[11px] text-[#858A83]">
              By creating an account, you agree to Revio&apos;s{" "}
              <Link
                href="/terms"
                className="underline decoration-[#719681]/40 underline-offset-2 transition-colors hover:text-[#315E50]"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline decoration-[#719681]/40 underline-offset-2 transition-colors hover:text-[#315E50]"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
