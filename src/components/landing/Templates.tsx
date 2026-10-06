"use client";

import { ArrowUpRight, Check, Sparkles, WandSparkles } from "lucide-react";

import ResumeRenderer from "@/components/resume/ResumeRenderer";
import type {
  ResumeBuilderData,
  ResumeTemplate,
} from "@/components/resume/types";

type TemplateItem = {
  name: string;
  description: string;
  tag: string;
  slug: ResumeTemplate;
};

const templates: TemplateItem[] = [
  {
    name: "Minimal",
    description:
      "Clean, focused, and designed to keep your experience and achievements easy to scan.",
    tag: "MINIMAL",
    slug: "minimal",
  },
  {
    name: "Modern",
    description:
      "Contemporary layout with strong visual hierarchy and a polished presentation.",
    tag: "MODERN",
    slug: "modern",
  },
  {
    name: "Executive",
    description:
      "A high-signal layout designed for senior engineers, technology leaders, and directors.",
    tag: "EXECUTIVE",
    slug: "executive",
  },
  {
    name: "Professional",
    description:
      "Structured and polished for engineering, product, and enterprise technology roles.",
    tag: "PROFESSIONAL",
    slug: "professional",
  },
  {
    name: "Creative",
    description:
      "A distinctive layout for creative careers and candidates who want more personality.",
    tag: "CREATIVE",
    slug: "creative",
  },
];

/*
 * Preview data used only for the public template showcase.
 *
 * The actual user's resume data will be passed to the same
 * ResumeRenderer inside the authenticated resume builder.
 */
const previewResume: ResumeBuilderData = {
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

export function Templates() {
  const handleUseTemplate = (template: TemplateItem) => {
    /*
     * Template selection will be connected to the authenticated
     * resume creation flow next.
     */
    window.location.href = `/resume/new?template=${template.slug}`;
  };

  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#0A0D14] px-5 py-24 text-slate-100 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]" />

        <div className="absolute left-[-180px] top-1/2 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Resume Templates
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Build a resume that
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              looks as good as your story.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Choose a visual foundation for your resume and customize it with
            your experience, skills, projects, and achievements.
          </p>
        </div>

        {/* EXPLORE */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              document.getElementById("template-grid")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-indigo-400/30 hover:bg-white/[0.08]"
          >
            Explore all templates
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* FEATURED TEMPLATE */}
        <div className="mt-20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
                Featured
              </p>

              <h3 className="mt-2 text-xl font-semibold text-white">Minimal</h3>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <WandSparkles className="h-4 w-4" />
              Live preview
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#11151f] p-3 shadow-2xl sm:p-5">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div
                className="origin-top-left"
                style={{
                  width: "121.95%",
                  transform: "scale(0.82)",
                }}
              >
                <ResumeRenderer resume={previewResume} template="minimal" />
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div id="template-grid" className="mt-24 scroll-mt-20">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
              Choose your layout
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Templates for every career stage
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              return (
                <div
                  key={template.slug}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                >
                  {/* PREVIEW */}
                  <div className="relative h-[430px] overflow-hidden bg-[#11151f] p-4">
                    <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-slate-300">
                      {template.tag}
                    </div>

                    <div className="absolute inset-4 overflow-hidden rounded-xl bg-white shadow-xl">
                      <div
                        className="origin-top-left"
                        style={{
                          width: "217.39%",
                          transform: "scale(0.46)",
                        }}
                      >
                        <ResumeRenderer
                          resume={previewResume}
                          template={template.slug}
                        />
                      </div>
                    </div>

                    {/* HOVER BUTTON */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0A0D14]/90 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#0A0D14] transition hover:bg-slate-100"
                      >
                        <Check className="h-4 w-4" />
                        Use this template
                      </button>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-white">
                          {template.name}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {template.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        aria-label={`Use ${template.name} template`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                        Clean Hierarchy
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                        Modern Layout
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                        Editable
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-24 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-indigo-400">
                Ready to build?
              </p>

              <h3 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Build your resume around the content that matters.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Choose a layout, add your experience, and customize your resume
                with Revio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                document.getElementById("template-grid")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0A0D14] transition hover:bg-slate-100"
            >
              Choose a template
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
