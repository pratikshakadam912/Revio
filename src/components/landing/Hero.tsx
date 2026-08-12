import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-40">
      <div className="mx-auto max-w-6xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-black/60">
          <Sparkles className="h-4 w-4" />
          AI-powered career tools
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-black sm:text-6xl lg:text-7xl">
          Build a resume that gets you{" "}
          <span className="text-black/40">noticed.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-black/55 sm:text-lg">
          Create a polished, ATS-friendly resume with AI. Improve your content,
          match your resume to jobs, and build your career with confidence.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register">
            <Button className="h-12 rounded-xl px-6">
              Create my resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="#templates">
            <Button variant="secondary" className="h-12 rounded-xl px-6">
              Explore templates
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-xs text-black/40">
          Free to get started · No credit card required
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-5xl">
        <div className="relative rounded-3xl border border-black/10 bg-white p-3 shadow-2xl shadow-black/5">
          <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-6 sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_280px]">
              <div>
                <div className="h-7 w-48 rounded bg-black/10" />
                <div className="mt-3 h-4 w-64 rounded bg-black/[0.06]" />

                <div className="mt-10 space-y-3">
                  <div className="h-3 w-full rounded bg-black/[0.06]" />
                  <div className="h-3 w-11/12 rounded bg-black/[0.06]" />
                  <div className="h-3 w-10/12 rounded bg-black/[0.06]" />
                </div>

                <div className="mt-10 h-4 w-32 rounded bg-black/10" />

                <div className="mt-4 space-y-3">
                  <div className="h-3 w-full rounded bg-black/[0.06]" />
                  <div className="h-3 w-9/12 rounded bg-black/[0.06]" />
                  <div className="h-3 w-10/12 rounded bg-black/[0.06]" />
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm font-medium">AI Resume Score</p>

                <div className="mt-6 flex h-32 items-center justify-center rounded-full border-8 border-black/10">
                  <span className="text-3xl font-semibold">92</span>
                </div>

                <p className="mt-5 text-center text-xs text-black/45">
                  Your resume is highly optimized for ATS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
