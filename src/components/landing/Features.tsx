import { FileText, ScanSearch, Sparkles, Target } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-powered writing",
    description:
      "Turn your experience into clear, compelling resume content with intelligent suggestions.",
  },
  {
    icon: ScanSearch,
    title: "ATS optimization",
    description:
      "Analyze your resume against applicant tracking systems and discover what needs improvement.",
  },
  {
    icon: Target,
    title: "Job matching",
    description:
      "Compare your resume with job descriptions and identify the skills and keywords that matter.",
  },
  {
    icon: FileText,
    title: "Professional templates",
    description:
      "Choose from clean, modern resume layouts designed to look great while staying ATS-friendly.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-black/45">
            Everything you need
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Your career toolkit,
            <br />
            powered by AI.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-black/50">
            Revio combines resume building, AI feedback, ATS analysis, and job
            matching into one simple career workspace.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-black/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {feature.title}
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-black/50">
                  {feature.description}
                </p>

                <div className="mt-8 h-px w-full bg-black/5 transition-all duration-300 group-hover:bg-black/10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
