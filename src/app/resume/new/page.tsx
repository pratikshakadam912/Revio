"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  Sparkles,
  Upload,
  Wand2,
  Zap,
} from "lucide-react";

type Template = {
  id: string;
  name: string;
  description: string;
  accent: string;
  style: "minimal" | "modern" | "executive" | "professional" | "creative";
};

const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, elegant and distraction-free.",
    accent: "bg-zinc-900",
    style: "minimal",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary layout with strong visual hierarchy.",
    accent: "bg-indigo-600",
    style: "modern",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional design for experienced candidates.",
    accent: "bg-slate-700",
    style: "executive",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Balanced structure for almost any career.",
    accent: "bg-blue-600",
    style: "professional",
  },
  {
    id: "creative",
    name: "Creative",
    description: "A distinctive layout for creative careers.",
    accent: "bg-violet-600",
    style: "creative",
  },
];

function MiniResume({
  template,
  selected,
}: {
  template: Template;
  selected: boolean;
}) {
  return (
    <div
      className={`relative aspect-[0.72] w-full overflow-hidden rounded-lg border bg-white transition-all duration-300 ${
        selected
          ? "border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
          : "border-zinc-200 group-hover:border-zinc-300"
      }`}
    >
      {template.style === "minimal" && (
        <div className="h-full p-[8%] text-zinc-900">
          <div className="border-b border-zinc-200 pb-3">
            <div className="h-3 w-24 rounded bg-zinc-900" />
            <div className="mt-2 h-1.5 w-20 rounded bg-zinc-300" />
            <div className="mt-3 flex gap-2">
              <div className="h-1 w-14 rounded bg-zinc-200" />
              <div className="h-1 w-16 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5">
            <div className="h-1.5 w-16 rounded bg-zinc-800" />
            <div className="mt-3 space-y-1.5">
              <div className="h-1 w-full rounded bg-zinc-200" />
              <div className="h-1 w-[90%] rounded bg-zinc-200" />
              <div className="h-1 w-[75%] rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-5">
            <div className="h-1.5 w-20 rounded bg-zinc-800" />
            <div className="mt-3 space-y-3">
              <div>
                <div className="h-1 w-[45%] rounded bg-zinc-300" />
                <div className="mt-1.5 h-1 w-[90%] rounded bg-zinc-200" />
                <div className="mt-1 h-1 w-[80%] rounded bg-zinc-200" />
              </div>
              <div>
                <div className="h-1 w-[40%] rounded bg-zinc-300" />
                <div className="mt-1.5 h-1 w-[90%] rounded bg-zinc-200" />
              </div>
            </div>
          </div>
        </div>
      )}

      {template.style === "modern" && (
        <div className="flex h-full text-zinc-900">
          <div className="w-[30%] bg-indigo-600 p-[7%]">
            <div className="mx-auto h-10 w-10 rounded-full bg-white/90" />
            <div className="mt-5 h-1.5 w-full rounded bg-white/80" />
            <div className="mt-2 h-1 w-[80%] rounded bg-white/50" />

            <div className="mt-8 space-y-2">
              <div className="h-1 w-full rounded bg-white/50" />
              <div className="h-1 w-[80%] rounded bg-white/40" />
              <div className="h-1 w-[90%] rounded bg-white/40" />
            </div>
          </div>

          <div className="flex-1 p-[7%]">
            <div className="h-3 w-[75%] rounded bg-zinc-800" />
            <div className="mt-2 h-1.5 w-[55%] rounded bg-indigo-400" />

            <div className="mt-8">
              <div className="h-1.5 w-20 rounded bg-zinc-700" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1 w-full rounded bg-zinc-200" />
                <div className="h-1 w-[85%] rounded bg-zinc-200" />
                <div className="h-1 w-[70%] rounded bg-zinc-200" />
              </div>
            </div>

            <div className="mt-7">
              <div className="h-1.5 w-24 rounded bg-zinc-700" />
              <div className="mt-3 space-y-3">
                <div>
                  <div className="h-1 w-[50%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-[90%] rounded bg-zinc-200" />
                </div>
                <div>
                  <div className="h-1 w-[45%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-[85%] rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {template.style === "executive" && (
        <div className="h-full p-[8%] text-zinc-900">
          <div className="text-center">
            <div className="mx-auto h-3 w-28 rounded bg-slate-800" />
            <div className="mx-auto mt-2 h-1 w-20 rounded bg-zinc-400" />
          </div>

          <div className="mt-5 border-y border-zinc-300 py-3">
            <div className="flex justify-center gap-2">
              <div className="h-1 w-12 rounded bg-zinc-200" />
              <div className="h-1 w-16 rounded bg-zinc-200" />
              <div className="h-1 w-12 rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-1.5 w-20 rounded bg-slate-800" />
            <div className="mt-3 space-y-1.5">
              <div className="h-1 w-full rounded bg-zinc-200" />
              <div className="h-1 w-[95%] rounded bg-zinc-200" />
              <div className="h-1 w-[82%] rounded bg-zinc-200" />
            </div>
          </div>

          <div className="mt-6">
            <div className="h-1.5 w-24 rounded bg-slate-800" />
            <div className="mt-3 space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="h-1 w-[45%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-[92%] rounded bg-zinc-200" />
                  <div className="mt-1 h-1 w-[78%] rounded bg-zinc-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {template.style === "professional" && (
        <div className="h-full p-[8%] text-zinc-900">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-3 w-24 rounded bg-blue-600" />
              <div className="mt-2 h-1.5 w-16 rounded bg-zinc-400" />
            </div>
            <div className="h-8 w-8 rounded bg-blue-50" />
          </div>

          <div className="mt-5 h-px bg-zinc-200" />

          <div className="mt-5 grid grid-cols-[30%_1fr] gap-4">
            <div>
              <div className="h-1.5 w-12 rounded bg-zinc-700" />
              <div className="mt-3 space-y-2">
                <div className="h-1 w-full rounded bg-zinc-200" />
                <div className="h-1 w-[80%] rounded bg-zinc-200" />
                <div className="h-1 w-[90%] rounded bg-zinc-200" />
              </div>

              <div className="mt-6 h-1.5 w-14 rounded bg-zinc-700" />
              <div className="mt-3 space-y-2">
                <div className="h-1 w-full rounded bg-zinc-200" />
                <div className="h-1 w-[85%] rounded bg-zinc-200" />
              </div>
            </div>

            <div>
              <div className="h-1.5 w-20 rounded bg-zinc-700" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1 w-full rounded bg-zinc-200" />
                <div className="h-1 w-[90%] rounded bg-zinc-200" />
                <div className="h-1 w-[75%] rounded bg-zinc-200" />
              </div>

              <div className="mt-6 h-1.5 w-24 rounded bg-zinc-700" />
              <div className="mt-3 space-y-3">
                <div>
                  <div className="h-1 w-[45%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-full rounded bg-zinc-200" />
                </div>
                <div>
                  <div className="h-1 w-[50%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-[85%] rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {template.style === "creative" && (
        <div className="h-full p-[7%] text-zinc-900">
          <div className="flex gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-violet-600" />
            <div className="flex-1 pt-1">
              <div className="h-3 w-28 rounded bg-zinc-900" />
              <div className="mt-2 h-1.5 w-20 rounded bg-violet-400" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-[35%_1fr] gap-4">
            <div>
              <div className="rounded-lg bg-violet-50 p-3">
                <div className="h-1.5 w-12 rounded bg-violet-600" />
                <div className="mt-3 space-y-2">
                  <div className="h-1 w-full rounded bg-violet-200" />
                  <div className="h-1 w-[80%] rounded bg-violet-200" />
                  <div className="h-1 w-[90%] rounded bg-violet-200" />
                </div>
              </div>

              <div className="mt-4 h-1.5 w-14 rounded bg-zinc-700" />
              <div className="mt-3 space-y-2">
                <div className="h-1 w-full rounded bg-zinc-200" />
                <div className="h-1 w-[80%] rounded bg-zinc-200" />
              </div>
            </div>

            <div>
              <div className="h-1.5 w-20 rounded bg-zinc-700" />
              <div className="mt-3 space-y-1.5">
                <div className="h-1 w-full rounded bg-zinc-200" />
                <div className="h-1 w-[90%] rounded bg-zinc-200" />
                <div className="h-1 w-[70%] rounded bg-zinc-200" />
              </div>

              <div className="mt-6 h-1.5 w-24 rounded bg-zinc-700" />
              <div className="mt-3 space-y-3">
                <div>
                  <div className="h-1 w-[45%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-full rounded bg-zinc-200" />
                </div>
                <div>
                  <div className="h-1 w-[50%] rounded bg-zinc-300" />
                  <div className="mt-1.5 h-1 w-[85%] rounded bg-zinc-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default function NewResumePage() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [creationMode, setCreationMode] = useState<"ai" | "import">("ai");

  const selected = templates.find(
    (template) => template.id === selectedTemplate,
  );

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-[-300px] right-[-150px] h-[500px] w-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#08090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back to dashboard
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-black">
              R
            </div>
            <span className="font-semibold tracking-tight">Revio</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-zinc-300">
              10 free AI credits
            </span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 border-b border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-white">Template</span>
          </div>

          <div className="h-px w-8 bg-white/10 sm:w-16" />

          <div className="flex items-center gap-2 text-zinc-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs">
              2
            </div>
            <span className="hidden text-sm sm:block">Your information</span>
          </div>

          <div className="h-px w-8 bg-white/10 sm:w-16" />

          <div className="flex items-center gap-2 text-zinc-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs">
              3
            </div>
            <span className="hidden text-sm sm:block">Edit & preview</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-3 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered resume builder
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Let's build a resume
            <span className="block bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
              you're proud of.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Pick a design you love. Then tell Revio about yourself in your own
            words — our AI will turn it into a polished, professional resume.
          </p>
        </div>

        {/* Creation mode */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          <button
            onClick={() => setCreationMode("ai")}
            className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${
              creationMode === "ai"
                ? "border-indigo-500/50 bg-indigo-500/[0.08] shadow-[0_0_40px_rgba(99,102,241,0.08)]"
                : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                <Wand2 className="h-5 w-5" />
              </div>

              {creationMode === "ai" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <h2 className="mt-4 font-semibold">Build with AI</h2>

            <p className="mt-1.5 text-sm leading-5 text-zinc-400">
              Tell Revio about yourself naturally and let AI create your resume.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-300">
              Recommended
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>

          <button
            onClick={() => setCreationMode("import")}
            className={`group rounded-2xl border p-5 text-left transition-all duration-300 ${
              creationMode === "import"
                ? "border-indigo-500/50 bg-indigo-500/[0.08]"
                : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300">
                <Upload className="h-5 w-5" />
              </div>

              {creationMode === "import" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <h2 className="mt-4 font-semibold">Import an existing resume</h2>

            <p className="mt-1.5 text-sm leading-5 text-zinc-400">
              Upload your existing CV and turn it into an editable Revio resume.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
              PDF supported
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>

        {/* Templates */}
        <div className="mt-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Choose your design
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                You can change your template later without losing your content.
              </p>
            </div>

            <span className="hidden text-xs text-zinc-600 sm:block">
              {templates.length} templates
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className="group text-left"
                >
                  <MiniResume template={template} selected={isSelected} />

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className={`text-sm font-medium transition ${
                          isSelected ? "text-white" : "text-zinc-300"
                        }`}
                      >
                        {template.name}
                      </h3>
                      <p className="mt-1 text-xs leading-4 text-zinc-600">
                        {template.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold text-indigo-300">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected template + CTA */}
        <div className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected?.accent ?? "bg-indigo-600"
                }`}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs text-zinc-500">Selected template</p>
                <p className="mt-0.5 font-medium text-white">
                  {selected?.name}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                // Next phase:
                // save selectedTemplate + creationMode
                // and navigate to /resume/new/information
                console.log("Selected template:", selectedTemplate);
                console.log("Creation mode:", creationMode);
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Continue with {selected?.name}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Trust / reassurance */}
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            Autosaved while you work
          </span>

          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            Change templates anytime
          </span>

          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            Your information stays yours
          </span>
        </div>
      </section>
    </main>
  );
}
