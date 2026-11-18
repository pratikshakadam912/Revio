import Link from "next/link";
import { ArrowRight, Check, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#F7F5EF] px-5 py-24 text-[#263B32] selection:bg-[#315E50] selection:text-white sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      {/* BACKGROUND ATMOSPHERE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[240px] -top-[240px] h-[650px] w-[650px] rounded-full bg-gradient-to-br from-[#719681]/25 via-[#D9C5A2]/20 to-transparent blur-[140px]" />

        <div className="absolute -right-[240px] -top-[100px] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-[#D9C5A2]/35 via-[#719681]/15 to-transparent blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[550px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DDE7DE]/50 blur-[160px]" />

        <div className="absolute -bottom-[380px] left-1/2 h-[650px] w-[950px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#D9C5A2]/30 via-[#719681]/10 to-transparent blur-[140px]" />

        {/* Fine Radial Grid */}
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Decorative Particles */}
        <div className="absolute left-[12%] top-[25%] h-1.5 w-1.5 rounded-full bg-[#719681] shadow-[0_0_15px_rgba(113,150,129,0.5)]" />
        <div className="absolute left-[22%] bottom-[25%] h-1 w-1 rounded-full bg-[#B97862]" />
        <div className="absolute right-[14%] top-[32%] h-1.5 w-1.5 rounded-full bg-[#B97862] shadow-[0_0_15px_rgba(185,120,98,0.4)]" />
        <div className="absolute right-[25%] bottom-[22%] h-1 w-1 rounded-full bg-[#719681]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* MAIN CTA CARD */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/90 bg-white/55 p-2.5 shadow-[0_30px_100px_rgba(49,65,52,0.12)] backdrop-blur-2xl sm:p-4">
          {/* Inner Glass Shell */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#E9E7DF] bg-[#FCFBF8]/95 px-6 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            {/* Top Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#719681]/50 to-transparent" />

            {/* Inner Glows */}
            <div className="pointer-events-none absolute -left-28 -top-28 h-[380px] w-[380px] rounded-full bg-[#719681]/10 blur-[100px]" />
            <div className="pointer-events-none absolute -right-28 bottom-[-80px] h-[380px] w-[380px] rounded-full bg-[#D9C5A2]/25 blur-[100px]" />

            {/* Decorative Rings */}
            <div className="pointer-events-none absolute -left-8 top-8 hidden h-28 w-28 rounded-full border border-[#719681]/20 sm:block" />
            <div className="pointer-events-none absolute -right-8 bottom-8 hidden h-36 w-36 rounded-full border border-[#D9C5A2]/50 sm:block" />

            <div className="relative mx-auto max-w-4xl">
              {/* Emblem */}
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-[#719681]/20 blur-xl" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#719681]/30 bg-gradient-to-tr from-[#315E50] to-[#719681] text-white shadow-[0_0_30px_rgba(49,94,80,0.2)]">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>

              {/* Eyebrow Badge */}
              <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#719681]/30 bg-[#E7EFE8]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#315E50] shadow-[0_4px_20px_rgba(49,94,80,0.06)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#719681] opacity-50" />
                  <span className="relative h-2 w-2 rounded-full bg-[#719681]" />
                </span>
                Immediate Application Advantage
              </div>

              {/* Headline */}
              <h2 className="mx-auto mt-7 max-w-3xl text-balance text-4xl font-black leading-[1.04] tracking-tight text-[#263B32] sm:text-5xl lg:text-6xl">
                Stop tweaking blindly.
                <br />
                <span className="bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
                  Start landing interviews.
                </span>
              </h2>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#727A72] sm:text-lg">
                Convert raw experience into metric-backed achievements, bypass
                ATS filtering, and give hiring teams an undeniable reason to
                schedule the first call.
              </p>

              {/* CTA Buttons */}
              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link href="/register">
                  <Button className="group relative h-12 overflow-hidden rounded-xl border border-[#315E50]/20 bg-gradient-to-r from-[#315E50] via-[#426F5D] to-[#719681] px-7 text-sm font-bold text-white shadow-[0_8px_25px_rgba(49,94,80,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(49,94,80,0.28)]">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2">
                      Build my resume
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </Link>

                <Link
                  href="/features"
                  className="flex h-12 items-center rounded-xl border border-[#E5E3D9] bg-white/75 px-7 text-sm font-semibold text-[#40574A] shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#719681]/40 hover:bg-[#F0F2EB] hover:text-[#315E50]"
                >
                  Explore Features
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-[#899087]">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#719681]" />
                  Free trial included
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-[#D9D8CF] sm:block" />

                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#B97862]" />
                  Instant ATS parse test
                </span>

                <span className="hidden h-1 w-1 rounded-full bg-[#D9D8CF] sm:block" />

                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#719681]" />
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SIGNAL STRIP */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/90 bg-white/65 px-6 py-5 shadow-[0_10px_35px_rgba(49,65,52,0.06)] backdrop-blur-xl sm:flex-row sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#719681]/25 bg-[#E7EFE8] text-[#315E50]">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#40574A]">
                Career intelligence built for executive impact.
              </p>
              <p className="mt-0.5 text-xs text-[#899087]">
                Create smarter. Optimize faster. Apply with complete certainty.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-[11px] font-bold uppercase tracking-widest text-[#899087]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#719681]" />
              AI Assisted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B97862]" />
              ATS Verified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A3B49F]" />
              Recruiter Proven
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
