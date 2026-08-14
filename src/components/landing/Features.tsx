import {
  ArrowUpRight,
  FileText,
  ScanSearch,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    number: "01",
    title: "Write with AI",
    description:
      "Turn your experience into confident, achievement-focused resume content that sounds like you — not a template.",
    featured: true,
  },
  {
    icon: ScanSearch,
    number: "02",
    title: "Beat the ATS",
    description:
      "Scan your resume for missing keywords, formatting issues, and opportunities to improve your ATS score.",
    featured: false,
  },
  {
    icon: Target,
    number: "03",
    title: "Match the right jobs",
    description:
      "Compare your resume against real job descriptions and discover the skills recruiters are looking for.",
    featured: false,
  },
  {
    icon: FileText,
    number: "04",
    title: "Choose your style",
    description:
      "Start with polished templates designed for modern careers while keeping your resume ATS-friendly.",
    featured: false,
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-[#F7F9FC] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-10 h-[500px] w-[500px] rounded-full bg-[#EAF1FF] blur-3xl" />

        <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-[#EEF3FF] blur-3xl" />

        <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-[#DCE8FF]/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/15 bg-white px-4 py-2 text-xs font-semibold text-[#4F7DF3] shadow-[0_4px_18px_rgba(79,125,243,0.06)]">
            <Sparkles className="h-3.5 w-3.5" />
            Everything in one place
          </div>

          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#172033] sm:text-5xl lg:text-6xl">
            Build a resume that
            <br />
            <span className="text-[#4F7DF3]">gets noticed.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
            From your first draft to the final application, Revio gives you the
            tools to create a stronger resume and a smarter job search.
          </p>
        </div>

        {/* Main feature layout */}
        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {/* Featured card */}
          <div className="group relative min-h-[430px] overflow-hidden rounded-[30px] border border-[#4F7DF3]/10 bg-white p-8 shadow-[0_12px_45px_rgba(30,55,100,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(30,55,100,0.10)] sm:p-10">
            {/* Decorative blue gradient */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-[#EAF1FF] blur-3xl" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F7DF3] to-[#7FA7FF] text-white shadow-[0_10px_25px_rgba(79,125,243,0.22)]">
                  <Sparkles className="h-6 w-6" />
                </div>

                <span className="text-xs font-semibold tracking-[0.14em] text-[#A7B0C0]">
                  01
                </span>
              </div>

              <div className="mt-auto pt-20">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4F7DF3]">
                  AI Writing
                </p>

                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#172033] sm:text-4xl">
                  Your experience,
                  <br />
                  written better.
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-[#667085] sm:text-[15px]">
                  Turn rough notes and real experience into clear,
                  achievement-focused content with AI that understands the
                  context behind your career.
                </p>

                <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#4F7DF3]">
                  Explore AI writing
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Right feature cards */}
          <div className="grid gap-5">
            {features.slice(1).map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[26px] border border-[#E1E7F0] bg-white p-7 shadow-[0_8px_30px_rgba(30,55,100,0.04)] transition-all duration-400 hover:-translate-y-1 hover:border-[#4F7DF3]/20 hover:shadow-[0_18px_45px_rgba(30,55,100,0.08)] sm:p-8"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#4F7DF3] transition-all duration-300 group-hover:bg-[#4F7DF3] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#172033]">
                          {feature.title}
                        </h3>

                        <span className="text-[11px] font-semibold tracking-[0.12em] text-[#A7B0C0]">
                          {feature.number}
                        </span>
                      </div>

                      <p className="mt-2.5 text-sm leading-6 text-[#667085]">
                        {feature.description}
                      </p>

                      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#4F7DF3]">
                        Learn more
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-8 rounded-[24px] border border-[#E1E7F0] bg-white px-6 py-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)] sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF]">
                <Sparkles className="h-4 w-4 text-[#4F7DF3]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#172033]">
                  One intelligent career workspace
                </p>

                <p className="mt-0.5 text-xs text-[#8A93A3]">
                  Built to take you from blank page to application-ready.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-xs font-medium text-[#7B8495]">
              <span>AI assisted</span>
              <span>ATS friendly</span>
              <span>Modern templates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
