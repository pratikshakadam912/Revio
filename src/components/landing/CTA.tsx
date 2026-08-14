import Link from "next/link";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#F7F9FC] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EAF1FF] blur-[100px]" />

        <div className="absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-[#EEF4FF] blur-3xl" />

        <div className="absolute -right-40 top-0 h-[350px] w-[350px] rounded-full bg-[#F2F5FF] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-[36px] border border-[#DDE5F0] bg-white px-6 py-16 text-center shadow-[0_20px_70px_rgba(30,55,100,0.07)] sm:px-10 sm:py-20 lg:px-16">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#EAF1FF] blur-3xl" />

          {/* Decorative lines */}
          <div className="pointer-events-none absolute left-8 top-8 hidden h-20 w-20 rounded-full border border-[#4F7DF3]/10 sm:block" />
          <div className="pointer-events-none absolute bottom-8 right-8 hidden h-28 w-28 rounded-full border border-[#4F7DF3]/10 sm:block" />

          <div className="relative">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#4F7DF3] shadow-[0_10px_25px_rgba(79,125,243,0.10)]">
              <Sparkles className="h-6 w-6" />
            </div>

            {/* Label */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/10 bg-[#F7F9FC] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#4F7DF3]">
              Your next step
            </div>

            {/* Heading */}
            <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#172033] sm:text-5xl lg:text-6xl">
              Your next opportunity
              <br />
              <span className="text-[#4F7DF3]">starts with your resume.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              Build your resume with AI, understand your strengths, and create
              something you can confidently send to employers.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register">
                <Button className="group h-13 rounded-full bg-[#4F7DF3] px-7 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(79,125,243,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#416FE8] hover:shadow-[0_18px_40px_rgba(79,125,243,0.28)]">
                  Start building for free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Trust points */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#8A93A3]">
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                Free to start
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-[#D4DCE8] sm:block" />

              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                AI credits included
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-[#D4DCE8] sm:block" />

              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#4F7DF3]" />
                No credit card
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
