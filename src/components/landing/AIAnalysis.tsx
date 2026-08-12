export function AIAnalysis() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#fafafa]">
          <div className="grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="text-sm font-medium text-black/45">
                AI resume intelligence
              </p>

              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Know exactly
                <br />
                what to improve.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-black/50">
                Revio analyzes your resume for ATS compatibility, content
                quality, missing skills, and opportunities to make your
                experience stronger.
              </p>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resume score</span>

                <span className="text-2xl font-semibold">92</span>
              </div>

              <div className="mt-6 h-2 rounded-full bg-black/[0.06]">
                <div className="h-2 w-[92%] rounded-full bg-black" />
              </div>

              <div className="mt-8 space-y-4">
                {[
                  ["ATS compatibility", "Excellent"],
                  ["Content quality", "Strong"],
                  ["Keyword coverage", "Good"],
                  ["Impact", "Improve"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between border-b border-black/5 pb-4 last:border-0"
                  >
                    <span className="text-sm text-black/55">{label}</span>

                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
