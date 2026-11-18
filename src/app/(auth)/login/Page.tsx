import Link from "next/link";
import {
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5EF] text-[#263B33] selection:bg-[#315E50] selection:text-white">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[300px] -top-[280px] h-[700px] w-[700px] rounded-full bg-gradient-to-br from-[#719681]/20 via-[#D9C5A2]/15 to-transparent blur-[140px]" />

        <div className="absolute -right-[300px] top-[10%] h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-[#D9C5A2]/30 via-[#719681]/10 to-transparent blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[650px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#719681]/[0.07] blur-[170px]" />

        <div className="absolute -bottom-[400px] left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#B97862]/10 via-[#D9C5A2]/10 to-transparent blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute left-[12%] top-[20%] h-1.5 w-1.5 rounded-full bg-[#719681] shadow-[0_0_15px_rgba(113,150,129,0.5)]" />

        <div className="absolute bottom-[22%] left-[20%] h-1 w-1 rounded-full bg-[#D9C5A2]" />

        <div className="absolute right-[13%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#B97862] shadow-[0_0_15px_rgba(185,120,98,0.35)]" />

        <div className="absolute bottom-[18%] right-[24%] h-1 w-1 rounded-full bg-[#719681]" />
      </div>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/90 bg-white/45 shadow-[0_30px_100px_rgba(38,59,51,0.10)] backdrop-blur-2xl lg:grid-cols-[1.05fr_0.95fr]">
          {/* =====================================================
              LEFT — BRAND / SHOWCASE
          ====================================================== */}

          <div className="relative hidden overflow-hidden border-r border-[#E7E5DC] bg-white/40 p-10 lg:block xl:p-14">
            {/* Top accent */}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#719681]/50 to-transparent" />

            {/* Ambient glows */}

            <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#719681]/15 blur-[120px]" />

            <div className="pointer-events-none absolute -right-40 bottom-[-120px] h-[450px] w-[450px] rounded-full bg-[#D9C5A2]/30 blur-[120px]" />

            <div className="relative flex h-full flex-col">
              {/* Logo */}

              <Link
                href="/"
                className="group flex w-fit items-center gap-3 text-lg font-black tracking-tight text-[#263B33]"
              >
                <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#315E50] via-[#527D68] to-[#719681] text-white shadow-[0_5px_20px_rgba(49,94,80,0.22)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_25px_rgba(49,94,80,0.3)]">
                  <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                  <Sparkles className="relative z-10 h-4 w-4" />
                </span>
                Revio
                <span className="text-[#719681]">.</span>
              </Link>

              {/* Main Copy */}

              <div className="mt-auto pt-16">
                {/* Badge */}

                <div className="inline-flex items-center gap-2.5 rounded-full border border-[#DCE8DE] bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#527D68] shadow-[0_4px_15px_rgba(38,59,51,0.04)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#719681] opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-[#719681]" />
                  </span>
                  AI-Powered Career Intelligence
                </div>

                {/* Heading */}

                <h2 className="mt-7 max-w-lg text-balance text-4xl font-black leading-[1.04] tracking-tight text-[#263B33] xl:text-5xl">
                  Build a resume{" "}
                  <span className="bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
                    engineered to convert.
                  </span>
                </h2>

                {/* Description */}

                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#777D76]">
                  Write faster with STAR executive frameworks, diagnose syntax
                  gaps, and improve ATS compatibility with intelligent resume
                  insights.
                </p>

                {/* Benefits List */}

                <div className="mt-8 space-y-3">
                  {[
                    "Quantified STAR impact rewriter",
                    "Real-time ATS parsing audit engine",
                    "Role-matched keyword density matrix",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs font-medium text-[#52645A]"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#C9D9CC] bg-[#EAF1EB] text-[#315E50]">
                        <Check className="h-3 w-3" />
                      </div>

                      {item}
                    </div>
                  ))}
                </div>

                {/* Mini Live Preview Window */}

                <div className="relative mt-8 max-w-lg">
                  <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#719681]/15 blur-[60px]" />

                  {/* Preview shell */}

                  <div className="relative overflow-hidden rounded-2xl border border-white/90 bg-white/75 p-2 shadow-[0_18px_45px_rgba(38,59,51,0.10)] backdrop-blur-xl">
                    {/* Browser bar */}

                    <div className="flex h-8 items-center justify-between rounded-xl border border-[#E7E5DC] bg-[#F7F5EF] px-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#B97862]/50" />
                        <span className="h-2 w-2 rounded-full bg-[#D9C5A2]" />
                        <span className="h-2 w-2 rounded-full bg-[#719681]/60" />
                      </div>

                      <div className="h-3.5 w-24 rounded-full bg-[#E7E5DC]" />

                      <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#315E50]">
                        <Zap className="h-2.5 w-2.5" />
                        98% ATS
                      </div>
                    </div>

                    <div className="grid grid-cols-[95px_1fr] gap-2 p-2.5">
                      {/* Mini sidebar */}

                      <div className="rounded-xl border border-[#E7E5DC] bg-[#F7F5EF] p-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-4 w-4 items-center justify-center rounded bg-[#315E50] text-[8px] font-bold text-white">
                            R
                          </div>

                          <span className="text-[8px] font-bold text-[#263B33]">
                            Editor
                          </span>
                        </div>

                        <div className="mt-3 space-y-1">
                          {["Summary", "Experience", "Skills"].map(
                            (item, index) => (
                              <div
                                key={item}
                                className={`rounded px-1.5 py-0.5 text-[7px] font-medium ${
                                  index === 1
                                    ? "border border-[#C9D9CC] bg-[#EAF1EB] text-[#315E50]"
                                    : "text-[#929990]"
                                }`}
                              >
                                {item}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Mini resume paper */}

                      <div className="rounded-xl border border-[#E7E5DC] bg-white p-3 shadow-sm">
                        <div className="border-b border-[#E7E5DC] pb-2">
                          <div className="h-2 w-20 rounded bg-[#315E50]" />
                          <div className="mt-1 h-1.5 w-28 rounded bg-[#D9DAD2]" />
                        </div>

                        <div className="mt-2.5 space-y-1.5">
                          <div className="h-1.5 w-12 rounded bg-[#719681]" />
                          <div className="h-1 w-full rounded bg-[#E1E2DB]" />
                          <div className="h-1 w-[88%] rounded bg-[#E1E2DB]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating AI badge */}

                  <div className="absolute -right-3 -top-3 rounded-xl border border-white/90 bg-white/90 p-2.5 shadow-[0_10px_25px_rgba(38,59,51,0.12)] backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-[#DCE8DE] bg-[#EAF1EB] text-[#315E50]">
                        <WandSparkles className="h-3 w-3" />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold text-[#263B33]">
                          STAR Engine
                        </p>

                        <p className="font-mono text-[7px] text-[#719681]">
                          +42% Impact Score
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT — AUTH LOGIN PANEL
          ====================================================== */}

          <div className="relative flex items-center justify-center bg-white/55 px-6 py-12 backdrop-blur-2xl sm:px-10 lg:px-14 xl:px-20">
            {/* Corner ambient glow */}

            <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-[400px] w-[400px] rounded-full bg-[#719681]/10 blur-[120px]" />

            <div className="relative w-full max-w-md">
              {/* Mobile Brand Header */}

              <Link
                href="/"
                className="mb-10 flex w-fit items-center gap-2.5 text-lg font-black tracking-tight text-[#263B33] lg:hidden"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#315E50] to-[#719681] text-white shadow-md">
                  <Sparkles className="h-4 w-4" />
                </span>
                Revio
                <span className="text-[#719681]">.</span>
              </Link>

              {/* Login Title & Icon */}

              <div>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DCE8DE] bg-[#EAF1EB] text-[#315E50] shadow-[0_8px_20px_rgba(49,94,80,0.10)]">
                  <FileText className="h-5 w-5" />
                </div>

                <h1 className="mt-6 text-balance text-3xl font-black tracking-tight text-[#263B33] sm:text-4xl">
                  Welcome back.
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-[#858A83]">
                  Sign in to access your resumes, audits, and tailored
                  applications.
                </p>
              </div>

              {/* Login Form */}

              <div className="mt-8 rounded-[24px] border border-white/90 bg-white/55 p-5 shadow-[0_12px_35px_rgba(38,59,51,0.045)] backdrop-blur-xl sm:p-6">
                <LoginForm />
              </div>

              {/* Register Callout */}

              <p className="mt-8 text-center text-xs text-[#858A83]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#315E50] transition-colors hover:text-[#719681] hover:underline"
                >
                  Create an account
                </Link>
              </p>

              {/* Security Badge */}

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-[#E7E5DC] pt-6 text-[10px] text-[#929990]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#719681]" />

                <span>
                  Secure authentication &bull; Your account is protected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
