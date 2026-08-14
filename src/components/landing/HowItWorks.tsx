const steps = [
  {
    number: "01",
    label: "START",
    title: "Tell us about yourself",
    description:
      "Add your experience, education, skills, projects, or upload an existing resume. Revio brings everything into one place.",
  },
  {
    number: "02",
    label: "CREATE",
    title: "Let AI build your resume",
    description:
      "Revio transforms your information into polished, professional resume content while keeping your experience authentic.",
  },
  {
    number: "03",
    label: "OPTIMIZE",
    title: "Improve and optimize",
    description:
      "Get intelligent suggestions, ATS insights, and actionable recommendations to make your resume stronger.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#F7F9FC] px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-20 h-[480px] w-[480px] rounded-full bg-[#EAF1FF] blur-3xl" />
        <div className="absolute -right-48 bottom-0 h-[480px] w-[480px] rounded-full bg-[#F2F5FF] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,125,243,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(79,125,243,0.07) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4F7DF3]/15 bg-white px-4 py-2 text-xs font-semibold text-[#4F7DF3] shadow-[0_4px_18px_rgba(79,125,243,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DF3]" />
            How Revio works
          </div>

          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#172033] sm:text-5xl lg:text-6xl">
            From experience
            <br />
            <span className="text-[#4F7DF3]">to opportunity.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
            Building a great resume shouldn't feel complicated. Revio turns your
            experience into a simple, intelligent workflow that helps you
            create, improve, and apply with confidence.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-[52px] hidden h-px bg-[#DCE4F2] md:block" />

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-[28px] border border-[#E1E7F0] bg-white p-7 shadow-[0_8px_30px_rgba(30,55,100,0.04)] transition-all duration-500 hover:-translate-y-1 hover:border-[#4F7DF3]/20 hover:shadow-[0_20px_50px_rgba(30,55,100,0.08)] sm:p-8"
              >
                {/* Card glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#EAF1FF] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  {/* Number */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FF] text-lg font-semibold text-[#4F7DF3] transition-all duration-300 group-hover:bg-[#4F7DF3] group-hover:text-white group-hover:shadow-[0_10px_25px_rgba(79,125,243,0.20)]">
                      {step.number}
                    </div>

                    <span className="text-[10px] font-semibold tracking-[0.16em] text-[#A7B0C0]">
                      {step.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-10">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[#172033]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#667085]">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="mt-8 flex items-center gap-2 border-t border-[#E8EDF4] pt-5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DF3]" />

                    <span className="text-xs font-medium text-[#7B8495]">
                      Step {index + 1} of 3
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-8 rounded-[24px] border border-[#E1E7F0] bg-white px-6 py-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)] sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#172033]">
                Less time formatting. More time moving forward.
              </p>

              <p className="mt-1 text-xs text-[#8A93A3]">
                Revio handles the heavy lifting so you can focus on your next
                opportunity.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#4F7DF3]">
              <span className="h-2 w-2 rounded-full bg-[#4F7DF3]" />
              Simple. Intelligent. Career-focused.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
