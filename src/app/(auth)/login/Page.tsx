import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Sparkles,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F9FC] text-[#172033]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-40 h-[600px] w-[600px] rounded-full bg-[#EAF1FF] blur-[110px]" />

        <div className="absolute -right-48 bottom-[-180px] h-[600px] w-[600px] rounded-full bg-[#F2F5FF] blur-[110px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5EEFF]/30 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-8 sm:px-8 lg:px-10">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-[#DDE5F0] bg-white shadow-[0_30px_100px_rgba(30,55,100,0.09)] lg:grid-cols-[1fr_0.85fr]">
          {/* -------------------------------------------------
              LEFT — BRAND / PRODUCT
          -------------------------------------------------- */}
          <div className="relative hidden overflow-hidden bg-[#F7F9FC] p-10 lg:block xl:p-14">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -left-24 top-[-100px] h-[420px] w-[420px] rounded-full bg-[#EAF1FF] blur-3xl" />

            <div className="relative flex h-full flex-col">
              {/* Logo */}
              <Link
                href="/"
                className="flex w-fit items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-[#172033]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F7DF3] text-white shadow-[0_8px_20px_rgba(79,125,243,0.20)]">
                  <Sparkles className="h-4 w-4" />
                </span>
                Revio
              </Link>

              {/* Main copy */}
              <div className="mt-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/10 bg-white px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4F7DF3]">
                  <Sparkles className="h-3 w-3" />
                  AI-powered career workspace
                </div>

                <h2 className="mt-6 max-w-lg text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#172033] xl:text-5xl">
                  Build a resume
                  <br />
                  <span className="text-[#4F7DF3]">you're proud to send.</span>
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-[#667085]">
                  Write better, optimize for ATS, and turn your experience into
                  a resume that gets noticed.
                </p>

                {/* Benefits */}
                <div className="mt-8 space-y-3">
                  {[
                    "AI-assisted resume writing",
                    "ATS optimization and insights",
                    "Professional modern templates",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-xs font-medium text-[#475467]"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF1FF]">
                        <Check className="h-3 w-3 text-[#4F7DF3]" />
                      </div>

                      {item}
                    </div>
                  ))}
                </div>

                {/* Mini product preview */}
                <div className="relative mt-10 max-w-xl">
                  <div className="absolute left-1/2 top-1/2 h-40 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCE8FF] blur-3xl" />

                  <div className="relative overflow-hidden rounded-[22px] border border-[#DDE5F0] bg-white p-2 shadow-[0_20px_60px_rgba(30,55,100,0.10)]">
                    {/* Browser bar */}
                    <div className="flex h-8 items-center justify-between rounded-xl bg-[#F7F9FC] px-3">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D3DAE5]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D3DAE5]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#D3DAE5]" />
                      </div>

                      <div className="h-4 w-28 rounded-full bg-white" />

                      <div className="h-4 w-10 rounded-full bg-[#EAF1FF]" />
                    </div>

                    <div className="grid grid-cols-[100px_1fr] gap-2 p-3">
                      {/* Sidebar */}
                      <div className="rounded-xl bg-[#F8FAFD] p-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#4F7DF3] text-white">
                            <Sparkles className="h-2.5 w-2.5" />
                          </div>

                          <span className="text-[7px] font-bold text-[#344054]">
                            Revio
                          </span>
                        </div>

                        <div className="mt-5 space-y-1">
                          {[
                            "Personal",
                            "Experience",
                            "Education",
                            "Skills",
                          ].map((item, index) => (
                            <div
                              key={item}
                              className={`rounded-md px-2 py-1.5 text-[6px] ${
                                index === 1
                                  ? "bg-[#EAF1FF] font-semibold text-[#4F7DF3]"
                                  : "text-[#98A1B2]"
                              }`}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resume */}
                      <div className="rounded-xl bg-[#F4F6F9] p-3">
                        <div className="mx-auto min-h-[170px] max-w-[250px] bg-white p-4 shadow-sm">
                          <div className="border-b border-[#E5EAF0] pb-3">
                            <div className="h-2.5 w-20 rounded bg-[#344054]" />
                            <div className="mt-2 h-1.5 w-28 rounded bg-[#D8DEE8]" />
                          </div>

                          <div className="mt-4">
                            <div className="h-1.5 w-12 rounded bg-[#4F7DF3]" />

                            <div className="mt-2 space-y-1.5">
                              <div className="h-1 w-full rounded bg-[#E5EAF0]" />
                              <div className="h-1 w-[92%] rounded bg-[#E5EAF0]" />
                              <div className="h-1 w-[84%] rounded bg-[#E5EAF0]" />
                            </div>
                          </div>

                          <div className="mt-5">
                            <div className="h-1.5 w-16 rounded bg-[#4F7DF3]" />

                            <div className="mt-2 space-y-2">
                              <div className="h-1 w-full rounded bg-[#E5EAF0]" />
                              <div className="h-1 w-[88%] rounded bg-[#E5EAF0]" />
                              <div className="h-1 w-[94%] rounded bg-[#E5EAF0]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating AI card */}
                  <div className="absolute -right-5 -top-5 rounded-2xl border border-[#DCE5F1] bg-white p-3 shadow-[0_15px_40px_rgba(30,55,100,0.12)]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF1FF]">
                        <WandSparkles className="h-3.5 w-3.5 text-[#4F7DF3]" />
                      </div>

                      <div>
                        <p className="text-[8px] font-semibold text-[#344054]">
                          AI suggestion
                        </p>

                        <p className="mt-0.5 text-[7px] text-[#98A1B2]">
                          Resume improved
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------
              RIGHT — LOGIN
          -------------------------------------------------- */}
          <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
            <div className="w-full max-w-md">
              {/* Mobile logo */}
              <Link
                href="/"
                className="mb-12 flex w-fit items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-[#172033] lg:hidden"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F7DF3] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                Revio
              </Link>

              {/* Header */}
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#4F7DF3]">
                  <FileText className="h-5 w-5" />
                </div>

                <h1 className="mt-7 text-4xl font-semibold tracking-[-0.045em] text-[#172033] sm:text-5xl">
                  Welcome back.
                </h1>

                <p className="mt-3 text-sm leading-6 text-[#667085]">
                  Sign in to continue building your resume with Revio.
                </p>
              </div>

              {/* Form */}
              <div className="mt-9">
                <LoginForm />
              </div>

              {/* Signup */}
              <p className="mt-8 text-center text-sm text-[#8A93A3]">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#4F7DF3] transition-colors hover:text-[#416FE8]"
                >
                  Create one
                </Link>
              </p>

              {/* Security */}
              <div className="mt-10 flex items-center justify-center gap-2 border-t border-[#E9EDF2] pt-6 text-[10px] text-[#98A1B2]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#4F7DF3]" />
                Secure authentication · Your data stays private
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
