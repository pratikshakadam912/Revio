import { ArrowUpRight, Check } from "lucide-react";

const templates = [
  {
    name: "Minimal",
    description: "Clean and simple for modern applications.",
  },
  {
    name: "Professional",
    description: "Structured for corporate and technical roles.",
  },
  {
    name: "Executive",
    description: "A polished layout for experienced professionals.",
  },
];

export function Templates() {
  return (
    <section id="templates" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-black/45">
              Resume templates
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Designed to make
              <br />
              your experience stand out.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-black/50">
              Start with a professionally designed template and let Revio help
              you turn your experience into a compelling resume.
            </p>
          </div>

          <button className="group flex w-fit items-center gap-2 text-sm font-medium text-black/60 transition hover:text-black">
            Explore all templates
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {templates.map((template) => (
            <div key={template.name} className="group">
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f7] p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/5">
                <div className="aspect-[3/4] rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-4 w-28 rounded bg-black/15" />
                      <div className="mt-2 h-2.5 w-20 rounded bg-black/5" />
                    </div>

                    <div className="h-8 w-8 rounded-full bg-black/[0.06]" />
                  </div>

                  <div className="mt-8 space-y-2">
                    <div className="h-2 w-full rounded bg-black/[0.07]" />
                    <div className="h-2 w-11/12 rounded bg-black/[0.05]" />
                    <div className="h-2 w-10/12 rounded bg-black/[0.05]" />
                  </div>

                  <div className="mt-8">
                    <div className="h-2.5 w-24 rounded bg-black/10" />

                    <div className="mt-4 space-y-2">
                      <div className="h-2 w-full rounded bg-black/[0.06]" />
                      <div className="h-2 w-9/12 rounded bg-black/[0.05]" />
                      <div className="h-2 w-11/12 rounded bg-black/[0.05]" />
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="h-2.5 w-20 rounded bg-black/10" />

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="h-2 rounded bg-black/[0.05]" />
                      <div className="h-2 rounded bg-black/[0.05]" />
                      <div className="h-2 rounded bg-black/[0.05]" />
                      <div className="h-2 rounded bg-black/[0.05]" />
                    </div>
                  </div>

                  <div className="mt-10 space-y-2">
                    <div className="h-2 w-full rounded bg-black/[0.05]" />
                    <div className="h-2 w-10/12 rounded bg-black/[0.05]" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between px-1">
                <div>
                  <h3 className="font-semibold tracking-tight">
                    {template.name}
                  </h3>

                  <p className="mt-1 text-sm text-black/45">
                    {template.description}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10">
                  <Check className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
