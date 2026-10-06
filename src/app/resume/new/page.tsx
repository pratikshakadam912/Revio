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

import ResumeRenderer from "@/components/resume/ResumeRenderer";
import type {
  ResumeBuilderData,
  ResumeTemplate,
} from "@/components/resume/types";

type Template = {
  id: ResumeTemplate;
  name: string;
  description: string;
  accent: string;
};

const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, elegant and distraction-free.",
    accent: "bg-zinc-900",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary layout with strong visual hierarchy.",
    accent: "bg-indigo-600",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional design for experienced candidates.",
    accent: "bg-slate-700",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Balanced structure for almost any career.",
    accent: "bg-blue-600",
  },
  {
    id: "creative",
    name: "Creative",
    description: "A distinctive layout for creative careers.",
    accent: "bg-violet-600",
  },
];

/*
 * Temporary preview data.
 *
 * This is ONLY used to render the actual templates on this selection page.
 * Once the user enters their information, the same ResumeRenderer will
 * receive their real ResumeBuilderData.
 */
const templatePreviewResume: ResumeBuilderData = {
  name: "Alex Morgan",
  title: "Product Designer",
  email: "alex@example.com",
  phone: "+1 555 123 4567",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexmorgan",
  github: "github.com/alexmorgan",
  website: "alexmorgan.com",

  summary:
    "Product designer with experience creating thoughtful digital products, improving user experiences, and working closely with cross-functional teams.",

  experience: [
    {
      id: "preview-experience-1",
      company: "Northstar Labs",
      position: "Senior Product Designer",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "",
      current: true,
      description: [
        "Led product design across web and mobile experiences.",
        "Improved user engagement through research-driven design decisions.",
      ],
    },
    {
      id: "preview-experience-2",
      company: "Orbit Studio",
      position: "Product Designer",
      location: "Remote",
      startDate: "2019",
      endDate: "2022",
      current: false,
      description: [
        "Designed scalable interfaces and reusable design systems.",
        "Partnered with engineers and product managers to ship new features.",
      ],
    },
  ],

  education: [
    {
      id: "preview-education-1",
      institution: "California Institute of Design",
      degree: "B.A.",
      field: "Design",
      location: "California",
      startDate: "2015",
      endDate: "2019",
      description: "",
    },
  ],

  skills: [
    "Product Design",
    "UX Research",
    "Figma",
    "Design Systems",
    "Prototyping",
    "User Testing",
  ],

  projects: [
    {
      id: "preview-project-1",
      name: "Mobile Banking Experience",
      description:
        "Redesigned a mobile banking experience focused on clarity, accessibility, and user confidence.",
      technologies: ["Figma", "Research", "Prototyping"],
      url: "",
      github: "",
    },
  ],

  certifications: [
    {
      id: "preview-certification-1",
      name: "Google UX Design",
      issuer: "Google",
      date: "2021",
    },
  ],

  achievements: [
    "Reduced onboarding friction by 32% through iterative product improvements.",
    "Established a reusable design system adopted across multiple product teams.",
  ],
};

function TemplatePreview({
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
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          width: "138.9%",
          transform: "scale(0.72)",
        }}
      >
        <ResumeRenderer resume={templatePreviewResume} template={template.id} />
      </div>

      {selected && (
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default function NewResumePage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate>("modern");

  const [creationMode, setCreationMode] = useState<"ai" | "import">("ai");

  const selected = templates.find(
    (template) => template.id === selectedTemplate,
  );

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-[-300px] right-[-150px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/5 blur-[120px]" />
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
                  <TemplatePreview template={template} selected={isSelected} />

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
