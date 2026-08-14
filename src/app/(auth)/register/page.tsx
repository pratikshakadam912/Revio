import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F9FC] text-[#172033]">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-40 h-[520px] w-[520px] rounded-full bg-[#EAF1FF] blur-3xl" />

        <div className="absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full bg-[#F5EEE8] blur-3xl" />

        <div className="absolute bottom-[-220px] left-1/2 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-[#E9F0FF] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(83,111,173,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(83,111,173,0.055) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 45%, transparent 90%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_480px] lg:gap-20">
          {/* Left content */}
          <div className="hidden lg:block">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-semibold tracking-[-0.03em] text-[#172033]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#536FAD] text-white shadow-[0_8px_20px_rgba(83,111,173,0.20)]">
                <Sparkles className="h-4 w-4" />
              </span>
              Revio
            </Link>

            <div className="mt-20 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#536FAD]/10 bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#536FAD] shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Build something better
              </div>

              <h1 className="mt-7 text-6xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#172033]">
                Your next
                <br />
                opportunity
                <br />
                <span className="text-[#536FAD]">starts here.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-[#667085]">
                Create a polished, ATS-friendly resume with AI that helps you
                turn your experience into a story employers remember.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  "AI-assisted resume writing",
                  "ATS optimization and insights",
                  "Professional resume templates",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-medium text-[#4B5568]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF1FF]">
                      <Check className="h-3.5 w-3.5 text-[#536FAD]" />
                    </span>

                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Register card */}
          <div className="w-full">
            <div className="mb-6 lg:hidden">
              <Link
                href="/"
                className="text-xl font-semibold tracking-tight text-[#172033]"
              >
                Revio
              </Link>
            </div>

            <div className="rounded-[30px] border border-[#DFE5ED] bg-white/90 p-7 shadow-[0_30px_90px_rgba(30,55,100,0.10)] backdrop-blur-xl sm:p-9">
              <Link
                href="/"
                className="mb-8 inline-flex items-center gap-1.5 text-xs font-medium text-[#8A94A4] transition hover:text-[#536FAD]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Revio
              </Link>

              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF1FF]">
                  <Sparkles className="h-5 w-5 text-[#536FAD]" />
                </div>

                <h2 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#172033] sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#748094]">
                  Start building a resume that represents your experience and
                  gets you closer to your next opportunity.
                </p>
              </div>

              <div className="my-8 h-px bg-[#E9EDF2]" />

              <RegisterForm />

              <p className="mt-7 text-center text-sm text-[#7B8495]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#536FAD] transition hover:text-[#435E99]"
                >
                  Log in
                </Link>
              </p>
            </div>

            <p className="mt-5 text-center text-[11px] leading-5 text-[#98A1AF]">
              By creating an account, you can start using Revio's resume
              building and AI-powered career tools.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
