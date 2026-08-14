import { ArrowUpRight, Check, Sparkles } from "lucide-react";

import { MinimalTemplate } from "@/components/resume/templates";
import { demoResume } from "@/data/demoResume";

const templates = [
  {
    name: "Minimal",
    description: "Clean, focused, and perfect for modern applications.",
    component: MinimalTemplate,
    tag: "MOST POPULAR",
  },
  {
    name: "Professional",
    description: "Structured and polished for corporate and technical roles.",
    component: MinimalTemplate,
    tag: "ATS FRIENDLY",
  },
  {
    name: "Executive",
    description: "A refined layout built for experienced professionals.",
    component: MinimalTemplate,
    tag: "PREMIUM",
  },
];

export function Templates() {
  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#F7F9FC] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-20 h-[500px] w-[500px] rounded-full bg-[#EAF1FF] blur-3xl" />

        <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[#EEF4FF] blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#DCE8FF]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/15 bg-white px-4 py-2 text-xs font-semibold text-[#4F7DF3] shadow-[0_4px_18px_rgba(79,125,243,0.06)]">
              <Sparkles className="h-3.5 w-3.5" />
              Resume templates
            </div>

            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#172033] sm:text-5xl lg:text-6xl">
              Designed to make
              <br />
              <span className="text-[#4F7DF3]">your experience stand out.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              Start with a professionally designed foundation and let Revio help
              you turn your experience into a resume that looks as strong as
              your skills.
            </p>
          </div>

          <button className="group flex w-fit items-center gap-2 rounded-full border border-[#E1E7F0] bg-white px-5 py-3 text-sm font-semibold text-[#344054] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4F7DF3]/20 hover:text-[#4F7DF3] hover:shadow-md">
            Explore all templates
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Template grid */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {templates.map((template, index) => {
            const Template = template.component;

            return (
              <div key={template.name} className="group">
                {/* Preview */}
                <div className="relative overflow-hidden rounded-[30px] border border-[#E1E7F0] bg-white p-3 shadow-[0_10px_40px_rgba(30,55,100,0.05)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-[#4F7DF3]/20 group-hover:shadow-[0_25px_65px_rgba(30,55,100,0.10)]">
                  {/* Template badge */}
                  <div className="absolute left-6 top-6 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[9px] font-bold tracking-[0.12em] text-[#667085] shadow-sm backdrop-blur">
                      {index === 0 && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DF3]" />
                      )}
                      {template.tag}
                    </span>
                  </div>

                  {/* Preview container */}
                  <div className="aspect-[3/4] overflow-hidden rounded-[22px] border border-[#E6EAF0] bg-[#F3F5F8]">
                    <div className="origin-top-left w-[210%] scale-[0.46] transition-transform duration-500 group-hover:scale-[0.475]">
                      <Template resume={demoResume} />
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="pointer-events-none absolute inset-3 rounded-[22px] bg-[#4F7DF3]/0 transition-all duration-500 group-hover:bg-[#4F7DF3]/[0.025]" />
                </div>

                {/* Details */}
                <div className="mt-5 flex items-start justify-between gap-4 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#172033]">
                        {template.name}
                      </h3>

                      <span className="hidden rounded-full bg-[#EAF1FF] px-2 py-1 text-[8px] font-bold tracking-[0.08em] text-[#4F7DF3] sm:inline-flex">
                        ATS READY
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-xs text-sm leading-6 text-[#667085]">
                      {template.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E1E7F0] bg-white text-[#7B8495] transition-all duration-300 group-hover:border-[#4F7DF3]/20 group-hover:bg-[#EAF1FF] group-hover:text-[#4F7DF3]">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-10 rounded-[24px] border border-[#E1E7F0] bg-white px-6 py-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)] sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#172033]">
                Every template is built for real applications.
              </p>

              <p className="mt-1 text-xs text-[#8A93A3]">
                Clean layouts, readable structure, and ATS-friendly formatting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#7B8495]">
              <span>ATS friendly</span>
              <span>Modern layouts</span>
              <span>Easy to customize</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
