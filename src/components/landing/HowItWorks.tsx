const steps = [
  {
    number: "01",
    title: "Tell us about yourself",
    description:
      "Add your experience,education, skills, projects, or upload an existing resume.",
  },
  {
    number: "02",
    title: "Let AI build your resume",
    description:
      "Revio transform your information into polished, professional resume content.",
  },
  {
    number: "03",
    title: "Improve and optimize",
    description:
      "Get AI suggestions, ATS insights, and recommendations to make your resume stronger",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-black/45">How Revio Works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            From experience
            <br />
            to opportunity.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-black/50">
            Revio takes the difficult parts of resume building and turns them
            into a simple AI-powered workflow.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-3xl border border-black/10 bg-white p-7"
            >
              <span className="text-sm font-medium text-black/35">
                {step.number}
              </span>

              <h3 className="mt-12 text-xl font-semibold tracking-tight">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/50">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
