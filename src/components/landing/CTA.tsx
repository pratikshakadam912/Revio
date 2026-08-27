import Link from "next/link";
import { ArrowRight, Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#0A0D14] px-5 py-24 text-slate-100 sm:px-8 sm:py-28 lg:px-12 lg:py-36 selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Electric Indigo Glow */}
        <div className="absolute -left-[240px] -top-[240px] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Cyan Ambient Glow */}
        <div className="absolute -right-[240px] -top-[100px] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-950/30 blur-[160px]" />

        {/* Bottom Ambient Glow */}
        <div className="absolute -bottom-[380px] left-1/2 h-[650px] w-[950px] -translate-x-1/2 rounded-full bg-gradient-to-t from-cyan-500/15 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Fine Radial Matrix Grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Micro Neon Particles */}
        <div className="absolute left-[12%] top-[25%] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
        <div className="absolute left-[22%] bottom-[25%] h-1 w-1 rounded-full bg-indigo-400" />
        <div className="absolute right-[14%] top-[32%] h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        <div className="absolute right-[25%] bottom-[22%] h-1 w-1 rounded-full bg-cyan-400" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* ============================================================
            MAIN CTA CARD
        ============================================================ */}

        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/60 p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-4">
          {/* Inner Glass Shell */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-slate-950/80 px-6 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            {/* Top Border Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {/* Inner Atmospheric Glows */}
            <div className="pointer-events-none absolute -left-28 -top-28 h-[380px] w-[380px] rounded-full bg-indigo-600/15 blur-[100px]" />
            <div className="pointer-events-none absolute -right-28 bottom-[-80px] h-[380px] w-[380px] rounded-full bg-cyan-500/15 blur-[100px]" />

            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -left-8 top-8 hidden h-28 w-28 rounded-full border border-indigo-500/20 sm:block" />
            <div className="pointer-events-none absolute -right-8 bottom-8 hidden h-36 w-36 rounded-full border border-cyan-500/20 sm:block" />

            <div className="relative mx-auto max-w-4xl">
              {/* Emblem */}
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              {/* Eyebrow Badge */}
              <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                Immediate Application Advantage
              </div>

              {/* Headline */}
              <h2 className="mx-auto mt-7 max-w-3xl text-balance text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Stop tweaking blindly.
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  Start landing interviews.
                </span>
              </h2>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Convert raw experience into metric-backed achievements, bypass
                ATS filtering, and give hiring teams an undeniable reason to
                schedule the first call.
              </p>

              {/* CTA Action Buttons */}
              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link href="/register">
                  <Button className="group relative h-12 overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-7 text-sm font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(6,182,212,0.45)]">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2">
                      Build my resume
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>

                <Link
                  href="/features"
                  className="flex h-12 items-center rounded-xl border border-white/10 bg-slate-900/70 px-7 text-sm font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-800/80 hover:text-white"
                >
                  Explore Features
                </Link>
              </div>

              {/* Trust Micro Indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Free trial included
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  Instant ATS parse test
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            BOTTOM SIGNAL STRIP
        ============================================================ */}

        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 px-6 py-5 backdrop-blur-xl sm:flex-row sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/50 text-cyan-300">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-200">
                Career intelligence built for executive impact.
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Create smarter. Optimize faster. Apply with complete certainty.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              AI Assisted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              ATS Verified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Recruiter Proven
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
