"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

type CreationMode = "ai" | "import";

type CreateResumeResponse = {
  success?: boolean;
  id?: string;
  error?: string;
};

const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, elegant and distraction-free.",
    accent: "bg-[#315E50]",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary layout with strong visual hierarchy.",
    accent: "bg-[#719681]",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional design for experienced candidates.",
    accent: "bg-[#263B33]",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Balanced structure for almost any career.",
    accent: "bg-[#A58A61]",
  },
  {
    id: "creative",
    name: "Creative",
    description: "A distinctive layout for creative careers.",
    accent: "bg-[#B97862]",
  },
];

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

function isTemplate(value: string | null): value is ResumeTemplate {
  return templates.some((template) => template.id === value);
}

function isCreationMode(value: string | null): value is CreationMode {
  return value === "ai" || value === "import";
}

function TemplatePreview({
  template,
  selected,
}: {
  template: Template;
  selected: boolean;
}) {
  return (
    <div
      className={`relative aspect-[0.72] w-full overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
        selected
          ? "border-[#315E50] shadow-[0_0_0_3px_rgba(49,94,80,0.13)]"
          : "border-[#E7E5DC] group-hover:border-[#719681]/50"
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
        <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#315E50] text-white shadow-lg">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

export default function NewResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const templateFromUrl = searchParams.get("template");
  const modeFromUrl = searchParams.get("mode");

  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumeTemplate>("modern");
  const [creationMode, setCreationMode] = useState<CreationMode>("ai");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isTemplate(templateFromUrl)) {
      setSelectedTemplate(templateFromUrl);
    }

    if (isCreationMode(modeFromUrl)) {
      setCreationMode(modeFromUrl);
    }
  }, [templateFromUrl, modeFromUrl]);

  const selected = templates.find(
    (template) => template.id === selectedTemplate,
  );

  async function handleContinue() {
    if (isCreating) return;

    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Resume",
          template: selectedTemplate,
          data: null,
        }),
      });

      const result = (await response
        .json()
        .catch(() => null)) as CreateResumeResponse | null;

      if (response.status === 401 || response.status === 403) {
        const callbackUrl = `/resume/new?template=${encodeURIComponent(
          selectedTemplate,
        )}&mode=${encodeURIComponent(creationMode)}`;

        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.error || "Failed to create your resume. Please try again.",
        );
      }

      if (!result?.success || typeof result.id !== "string" || !result.id) {
        throw new Error(
          result?.error || "The server returned an invalid resume response.",
        );
      }

      router.push(
        `/resume/${encodeURIComponent(result.id)}?mode=${creationMode}`,
      );
    } catch (error) {
      console.error("Resume creation failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create your resume. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5EF] text-[#263B33]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#719681]/10 blur-[130px]" />
        <div className="absolute right-[-180px] top-[30%] h-[500px] w-[500px] rounded-full bg-[#D9C5A2]/20 blur-[130px]" />
        <div className="absolute bottom-[-250px] left-[20%] h-[500px] w-[500px] rounded-full bg-[#B97862]/[0.07] blur-[130px]" />
      </div>

      <header className="relative z-10 border-b border-[#E7E5DC] bg-[#F7F5EF]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-sm text-[#777D76] transition hover:text-[#315E50]"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back to dashboard
          </Link>

          <Link
            href="/"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 sm:flex"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#315E50] to-[#719681] text-xs font-black text-white shadow-sm">
              R
            </div>
            <span className="font-semibold tracking-tight text-[#263B33]">
              Revio
            </span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-[#315E50]/15 bg-white/65 px-3 py-1.5 shadow-sm backdrop-blur-xl">
            <Zap className="h-3.5 w-3.5 text-[#A58A61]" />
            <span className="text-xs font-medium text-[#52645B]">
              AI-powered builder
            </span>
          </div>
        </div>
      </header>

      <div className="relative z-10 border-b border-[#E7E5DC]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#315E50] text-xs font-semibold text-white">
              1
            </div>
            <span className="text-sm font-semibold text-[#315E50]">
              Template
            </span>
          </div>

          <div className="h-px w-8 bg-[#D9D8CE] sm:w-16" />

          <div className="flex items-center gap-2 text-[#A1A49B]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9D8CE] text-xs">
              2
            </div>
            <span className="hidden text-sm sm:block">Your information</span>
          </div>

          <div className="h-px w-8 bg-[#D9D8CE] sm:w-16" />

          <div className="flex items-center gap-2 text-[#A1A49B]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D9D8CE] text-xs">
              3
            </div>
            <span className="hidden text-sm sm:block">Edit &amp; preview</span>
          </div>
        </div>
      </div>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#315E50]/15 bg-white/65 px-3 py-1.5 text-xs font-semibold text-[#315E50] shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered resume builder
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#263B33] sm:text-5xl">
            Let&apos;s build a resume
            <span className="block bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text text-transparent">
              you&apos;re proud of.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-[#777D76] sm:text-base">
            Pick a design you love. Then tell Revio about yourself in your own
            words — our AI will help you build a polished, professional resume.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setCreationMode("ai")}
            aria-pressed={creationMode === "ai"}
            className={`group rounded-2xl border p-5 text-left shadow-[0_12px_35px_rgba(38,59,51,0.04)] backdrop-blur-xl transition-all duration-300 ${
              creationMode === "ai"
                ? "border-[#315E50]/35 bg-white/85 shadow-[0_12px_35px_rgba(49,94,80,0.09)]"
                : "border-white/90 bg-white/55 hover:-translate-y-0.5 hover:border-[#719681]/40 hover:bg-white/80"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#315E50]/10 bg-[#315E50]/[0.07] text-[#315E50]">
                <Wand2 className="h-5 w-5" />
              </div>

              {creationMode === "ai" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#315E50] text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <h2 className="mt-4 font-semibold text-[#263B33]">Build with AI</h2>
            <p className="mt-1.5 text-sm leading-5 text-[#777D76]">
              Tell Revio about yourself naturally and let AI help create your
              resume.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#315E50]">
              Recommended
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCreationMode("import")}
            aria-pressed={creationMode === "import"}
            className={`group rounded-2xl border p-5 text-left shadow-[0_12px_35px_rgba(38,59,51,0.04)] backdrop-blur-xl transition-all duration-300 ${
              creationMode === "import"
                ? "border-[#315E50]/35 bg-white/85 shadow-[0_12px_35px_rgba(49,94,80,0.09)]"
                : "border-white/90 bg-white/55 hover:-translate-y-0.5 hover:border-[#719681]/40 hover:bg-white/80"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D9C5A2]/35 bg-[#D9C5A2]/20 text-[#987746]">
                <Upload className="h-5 w-5" />
              </div>

              {creationMode === "import" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#315E50] text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <h2 className="mt-4 font-semibold text-[#263B33]">
              Import an existing resume
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-[#777D76]">
              Upload your existing CV and turn it into an editable Revio resume.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-[#858A83]">
              PDF supported
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#263B33]">
                Choose your design
              </h2>
              <p className="mt-1 text-sm text-[#777D76]">
                You can change your template later without losing your content.
              </p>
            </div>

            <span className="hidden text-xs text-[#858A83] sm:block">
              {templates.length} templates
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.id;

              return (
                <button
                  type="button"
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setError("");
                  }}
                  className="group text-left"
                  aria-pressed={isSelected}
                >
                  <TemplatePreview template={template} selected={isSelected} />

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className={`text-sm font-medium transition ${
                          isSelected ? "text-[#315E50]" : "text-[#52645B]"
                        }`}
                      >
                        {template.name}
                      </h3>
                      <p className="mt-1 text-xs leading-4 text-[#858A83]">
                        {template.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-[#315E50]/10 px-2 py-1 text-[10px] font-semibold text-[#315E50]">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/90 bg-white/65 p-4 shadow-[0_12px_35px_rgba(38,59,51,0.06)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected?.accent ?? "bg-[#719681]"
                }`}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>

              <div>
                <p className="text-xs text-[#858A83]">Selected template</p>
                <p className="mt-0.5 font-semibold text-[#263B33]">
                  {selected?.name}
                </p>
                <p className="mt-1 text-xs text-[#777D76]">
                  {creationMode === "ai"
                    ? "Create a new resume with AI assistance"
                    : "Continue to the editor to import your existing resume"}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isCreating}
              onClick={handleContinue}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#315E50] to-[#719681] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#315E50]/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating
                ? "Creating resume..."
                : `Continue with ${selected?.name}`}

              {!isCreating && (
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              )}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-[#B97862]/25 bg-[#B97862]/10 px-4 py-3 text-sm text-[#995B48]"
            >
              {error}
            </p>
          )}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[#858A83]">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-[#719681]" />
            Save your changes in the editor
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-[#719681]" />
            Change templates anytime
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-[#719681]" />
            Your information stays yours
          </span>
        </div>
      </section>
    </main>
  );
}
