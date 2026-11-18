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
  /*
   * Redirect visitors to login before allowing access
   * to the authenticated resume builder.
   *
   * The selected template is preserved in the redirect URL.
   */
  const handleUseTemplate = (template: TemplateItem) => {
    const destination = `/resume/new?template=${encodeURIComponent(
      template.slug,
    )}`;

    window.location.href = `/login?redirect=${encodeURIComponent(destination)}`;
  };

  const scrollToTemplates = () => {
    document.getElementById("template-grid")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#F7F5EF] px-5 py-24 text-[#263B33] sm:px-8 sm:py-28 lg:px-12 lg:py-36"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#719681]/15 blur-[130px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-[#D9C5A2]/25 blur-[120px]" />

        <div className="absolute left-[-180px] top-1/2 h-[350px] w-[350px] rounded-full bg-[#B97862]/10 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(49,94,80,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(49,94,80,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/65 px-4 py-2 text-xs font-medium text-[#315E50] shadow-sm shadow-[#315E50]/5 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#B97862]" />
            Resume Templates
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#263B33] sm:text-5xl lg:text-6xl">
            Build a resume that
            <span className="block bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
              looks as good as your story.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#777D76] sm:text-base">
            Choose a visual foundation for your resume and customize it with
            your experience, skills, projects, and achievements.
          </p>
        </div>

        {/* EXPLORE */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={scrollToTemplates}
            className="group inline-flex items-center gap-2 rounded-full border border-[#E7E5DC] bg-white/65 px-5 py-2.5 text-sm font-medium text-[#315E50] shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#719681]/50 hover:bg-white hover:shadow-md"
          >
            Explore all templates
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* FEATURED TEMPLATE */}
        <div className="mt-20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#719681]">
                Featured
              </p>

              <h3 className="mt-2 text-xl font-semibold text-[#263B33]">
                Minimal
              </h3>
            </div>

            <div className="hidden items-center gap-2 text-xs text-[#858A83] sm:flex">
              <WandSparkles className="h-4 w-4 text-[#B97862]" />
              Live preview
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/55 p-3 shadow-[0_24px_80px_rgba(49,94,80,0.10)] backdrop-blur-2xl sm:p-5">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(38,59,51,0.12)]">
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
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#719681]">
              Choose your layout
            </p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#263B33] sm:text-3xl">
              Templates for every career stage
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              return (
                <div
                  key={template.slug}
                  className="group overflow-hidden rounded-2xl border border-white/90 bg-white/60 shadow-[0_8px_30px_rgba(49,94,80,0.05)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#719681]/40 hover:bg-white/80 hover:shadow-[0_18px_45px_rgba(49,94,80,0.11)]"
                >
                  {/* PREVIEW */}
                  <div className="relative h-[430px] overflow-hidden bg-[#EFEEE7] p-4">
                    <div className="absolute left-4 top-4 z-20 rounded-full border border-white/80 bg-[#F7F5EF]/90 px-3 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#315E50] shadow-sm backdrop-blur-xl">
                      {template.tag}
                    </div>

                    <div className="absolute inset-4 overflow-hidden rounded-xl bg-white shadow-[0_12px_35px_rgba(38,59,51,0.13)]">
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
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#263B33]/85 via-[#263B33]/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F7F5EF] px-4 py-3 text-sm font-semibold text-[#315E50] shadow-lg transition-all hover:bg-white"
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
                        <h4 className="text-base font-semibold text-[#263B33]">
                          {template.name}
                        </h4>

                        <p className="mt-2 text-sm leading-6 text-[#777D76]">
                          {template.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUseTemplate(template)}
                        aria-label={`Use ${template.name} template`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7E5DC] bg-white/70 text-[#315E50] transition-all duration-300 hover:border-[#719681]/50 hover:bg-[#315E50] hover:text-white"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#E7E5DC] bg-[#F7F5EF]/80 px-2.5 py-1 text-[10px] text-[#777D76]">
                        Clean Hierarchy
                      </span>

                      <span className="rounded-full border border-[#E7E5DC] bg-[#F7F5EF]/80 px-2.5 py-1 text-[10px] text-[#777D76]">
                        Modern Layout
                      </span>

                      <span className="rounded-full border border-[#E7E5DC] bg-[#F7F5EF]/80 px-2.5 py-1 text-[10px] text-[#777D76]">
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
        <div className="mt-24 overflow-hidden rounded-3xl border border-white/90 bg-white/60 p-8 shadow-[0_16px_55px_rgba(49,94,80,0.08)] backdrop-blur-2xl sm:p-12">
          <div className="pointer-events-none absolute" />

          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#719681]">
                Ready to build?
              </p>

              <h3 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-[#263B33] sm:text-3xl">
                Build your resume around the content that matters.
              </h3>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#777D76]">
                Choose a layout, add your experience, and customize your resume
                with Revio.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToTemplates}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#315E50] to-[#477865] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(49,94,80,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(49,94,80,0.28)]"
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
