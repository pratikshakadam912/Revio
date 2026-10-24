"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Plus,
  Save,
  Trash2,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  FolderKanban,
  Award,
  Sparkles,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import ResumeRenderer from "@/components/resume/ResumeRenderer";
import {
  emptyResumeBuilderData,
  type ResumeBuilderData,
  type ResumeTemplate,
} from "@/components/resume/types";

const templates: { id: ResumeTemplate; name: string }[] = [
  { id: "minimal", name: "Minimal" },
  { id: "modern", name: "Modern" },
  { id: "professional", name: "Professional" },
  { id: "executive", name: "Executive" },
  { id: "creative", name: "Creative" },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1020] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-400";

type Experience = ResumeBuilderData["experience"][number];
type Education = ResumeBuilderData["education"][number];
type Project = ResumeBuilderData["projects"][number];
type Certification = ResumeBuilderData["certifications"][number];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createExperience(): Experience {
  return {
    id: newId(),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: [],
  };
}

function createEducation(): Education {
  return {
    id: newId(),
    institution: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function createProject(): Project {
  return {
    id: newId(),
    name: "",
    description: "",
    technologies: [],
    url: "",
    github: "",
  };
}

function createCertification(): Certification {
  return { id: newId(), name: "", issuer: "", date: "" };
}

function normalizeResumeData(value: unknown): ResumeBuilderData {
  const source =
    value && typeof value === "object"
      ? (value as Partial<ResumeBuilderData>)
      : {};

  return {
    ...emptyResumeBuilderData,
    ...source,
    experience: Array.isArray(source.experience) ? source.experience : [],
    education: Array.isArray(source.education) ? source.education : [],
    skills: Array.isArray(source.skills) ? source.skills : [],
    projects: Array.isArray(source.projects) ? source.projects : [],
    certifications: Array.isArray(source.certifications)
      ? source.certifications
      : [],
    achievements: Array.isArray(source.achievements) ? source.achievements : [],
  };
}

export default function ResumeEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const resumeId = params.id;

  const [data, setData] = useState<ResumeBuilderData>(emptyResumeBuilderData);
  const [template, setTemplate] = useState<ResumeTemplate>("minimal");
  const [title, setTitle] = useState("Untitled Resume");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (!resumeId) return;

    let cancelled = false;

    async function loadResume() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/resume?resumeId=${encodeURIComponent(resumeId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();

        if (!response.ok || !result.success || !result.resume) {
          throw new Error(result.error || "Unable to load this resume.");
        }

        if (cancelled) return;

        setTitle(result.resume.title || "Untitled Resume");
        setTemplate(
          templates.some((item) => item.id === result.resume.template)
            ? result.resume.template
            : "minimal",
        );
        setData(normalizeResumeData(result.resume.data));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load this resume.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadResume();

    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  const updateField = useCallback(
    <K extends keyof ResumeBuilderData>(
      key: K,
      value: ResumeBuilderData[K],
    ) => {
      setData((current) => ({ ...current, [key]: value }));
      setNotice("");
    },
    [],
  );

  const saveResume = useCallback(async () => {
    if (!resumeId || saving) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId,
          title,
          template,
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save resume.");
      }

      setNotice("All changes saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save resume.");
    } finally {
      setSaving(false);
    }
  }, [resumeId, saving, title, template, data]);

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean | string[],
  ) => {
    const next = [...data.experience];
    next[index] = { ...next[index], [field]: value } as Experience;
    updateField("experience", next);
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string,
  ) => {
    const next = [...data.education];
    next[index] = { ...next[index], [field]: value };
    updateField("education", next);
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string | string[],
  ) => {
    const next = [...data.projects];
    next[index] = { ...next[index], [field]: value };
    updateField("projects", next);
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string,
  ) => {
    const next = [...data.certifications];
    next[index] = { ...next[index], [field]: value };
    updateField("certifications", next);
  };

  const section = (
    titleText: string,
    description: string,
    icon: React.ReactNode,
    children: React.ReactNode,
  ) => (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0e1425] p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.08] text-cyan-300">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-white">{titleText}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );

  const field = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    placeholder = "",
    multiline = false,
  ) => (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {multiline ? (
        <textarea
          className={`${inputClass} min-h-28 resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );

  const addButton = (label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] px-3.5 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-400/[0.13]"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080c18] text-slate-300">
        <LoaderCircle className="mr-3 h-5 w-5 animate-spin text-cyan-300" />
        Loading your resume...
      </main>
    );
  }

  if (error && !data.name && !data.email && !data.summary) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#080c18] px-5 text-center">
        <p className="text-lg font-bold text-white">Unable to open resume</p>
        <p className="mt-2 max-w-md text-sm text-rose-300">{error}</p>
        <button
          onClick={() => router.push("/resume/new")}
          className="mt-6 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950"
        >
          Choose a template
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080c18] text-slate-200">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080c18]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard"
              aria-label="Back to dashboard"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <input
                aria-label="Resume title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setNotice("");
                }}
                className="w-full max-w-[260px] truncate bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-b focus:border-cyan-400"
                placeholder="Untitled Resume"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Revio Resume Builder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notice && (
              <span className="hidden items-center gap-1.5 text-xs text-emerald-300 sm:flex">
                <CheckCircle2 className="h-4 w-4" />
                {notice}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowPreview((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 lg:hidden"
            >
              <Eye className="h-4 w-4" />
              {showPreview ? "Hide preview" : "Preview"}
            </button>
            <button
              type="button"
              onClick={() => void saveResume()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(440px,1.05fr)] lg:gap-8">
        <div className="min-w-0 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Resume workspace
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Build your resume
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Add your details and see your selected template update as you
              edit.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3 text-sm text-rose-300"
            >
              {error}
            </div>
          )}

          <section className="rounded-2xl border border-white/[0.08] bg-[#0e1425] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-white">Choose your design</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Switch templates without losing your content.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {templates.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setTemplate(item.id);
                    setNotice("");
                  }}
                  className={`rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${
                    template === item.id
                      ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-200"
                      : "border-white/10 bg-[#0b1020] text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="mb-2 block h-1 rounded-full bg-gradient-to-r from-cyan-300 to-indigo-400" />
                  {item.name}
                  {template === item.id && (
                    <span className="mt-1 block text-[10px] font-medium text-cyan-300">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {section(
            "Personal information",
            "The contact details people will use to reach you.",
            <UserRound className="h-5 w-5" />,
            <div className="grid gap-4 sm:grid-cols-2">
              {field(
                "Full name",
                data.name,
                (v) => updateField("name", v),
                "Your name",
              )}
              {field(
                "Professional title",
                data.title,
                (v) => updateField("title", v),
                "e.g. Software Engineer",
              )}
              {field(
                "Email",
                data.email,
                (v) => updateField("email", v),
                "you@example.com",
              )}
              {field(
                "Phone",
                data.phone,
                (v) => updateField("phone", v),
                "+1 555 000 0000",
              )}
              {field(
                "Location",
                data.location,
                (v) => updateField("location", v),
                "City, Country",
              )}
              {field(
                "LinkedIn URL",
                data.linkedin,
                (v) => updateField("linkedin", v),
                "linkedin.com/in/you",
              )}
              {field(
                "GitHub URL",
                data.github,
                (v) => updateField("github", v),
                "github.com/you",
              )}
              {field(
                "Portfolio / website",
                data.website,
                (v) => updateField("website", v),
                "yourwebsite.com",
              )}
              <div className="sm:col-span-2">
                {field(
                  "Professional summary",
                  data.summary,
                  (v) => updateField("summary", v),
                  "Summarize your experience, strengths, and career goals...",
                  true,
                )}
              </div>
            </div>,
          )}

          {section(
            "Work experience",
            "Add your roles, achievements, and responsibilities.",
            <BriefcaseBusiness className="h-5 w-5" />,
            <div className="space-y-4">
              {data.experience.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1020] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-white">
                      Experience {index + 1}
                    </p>
                    <button
                      type="button"
                      aria-label="Remove experience"
                      onClick={() =>
                        updateField(
                          "experience",
                          data.experience.filter((_, i) => i !== index),
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field(
                      "Job title",
                      item.position,
                      (v) => updateExperience(index, "position", v),
                      "Job title",
                    )}
                    {field(
                      "Company",
                      item.company,
                      (v) => updateExperience(index, "company", v),
                      "Company name",
                    )}
                    {field(
                      "Location",
                      item.location,
                      (v) => updateExperience(index, "location", v),
                      "City or remote",
                    )}
                    {field(
                      "Start date",
                      item.startDate,
                      (v) => updateExperience(index, "startDate", v),
                      "Jan 2023",
                    )}
                    {field(
                      "End date",
                      item.current ? "Present" : item.endDate,
                      (v) => updateExperience(index, "endDate", v),
                      "Present or date",
                    )}
                    <label className="flex items-center gap-2 self-end pb-3 text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={item.current}
                        onChange={(e) => {
                          updateExperience(index, "current", e.target.checked);
                          if (e.target.checked)
                            updateExperience(index, "endDate", "");
                        }}
                        className="accent-cyan-300"
                      />
                      I currently work here
                    </label>
                    <div className="sm:col-span-2">
                      {field(
                        "Achievements / responsibilities (one per line)",
                        item.description.join("\n"),
                        (v) =>
                          updateExperience(
                            index,
                            "description",
                            v.split("\n").filter((line) => line.trim()),
                          ),
                        "Describe your impact and results...",
                        true,
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {addButton("Add experience", () =>
                updateField("experience", [
                  ...data.experience,
                  createExperience(),
                ]),
              )}
            </div>,
          )}

          {section(
            "Education",
            "Add degrees, schools, and relevant academic details.",
            <GraduationCap className="h-5 w-5" />,
            <div className="space-y-4">
              {data.education.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1020] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-white">
                      Education {index + 1}
                    </p>
                    <button
                      type="button"
                      aria-label="Remove education"
                      onClick={() =>
                        updateField(
                          "education",
                          data.education.filter((_, i) => i !== index),
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field(
                      "Institution",
                      item.institution,
                      (v) => updateEducation(index, "institution", v),
                      "University or school",
                    )}
                    {field(
                      "Degree",
                      item.degree,
                      (v) => updateEducation(index, "degree", v),
                      "Bachelor's, Master's...",
                    )}
                    {field(
                      "Field of study",
                      item.field,
                      (v) => updateEducation(index, "field", v),
                      "Computer Science",
                    )}
                    {field(
                      "Location",
                      item.location,
                      (v) => updateEducation(index, "location", v),
                      "City",
                    )}
                    {field(
                      "Start date",
                      item.startDate,
                      (v) => updateEducation(index, "startDate", v),
                      "2020",
                    )}
                    {field(
                      "End date",
                      item.endDate,
                      (v) => updateEducation(index, "endDate", v),
                      "2024",
                    )}
                    <div className="sm:col-span-2">
                      {field(
                        "Additional details",
                        item.description,
                        (v) => updateEducation(index, "description", v),
                        "Honors, coursework, achievements...",
                        true,
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {addButton("Add education", () =>
                updateField("education", [
                  ...data.education,
                  createEducation(),
                ]),
              )}
            </div>,
          )}

          {section(
            "Skills",
            "Separate skills with commas.",
            <Code2 className="h-5 w-5" />,
            field(
              "Skills",
              data.skills.join(", "),
              (v) =>
                updateField(
                  "skills",
                  v
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                ),
              "TypeScript, React, SQL, Communication",
              true,
            ),
          )}

          {section(
            "Projects",
            "Highlight relevant work and personal projects.",
            <FolderKanban className="h-5 w-5" />,
            <div className="space-y-4">
              {data.projects.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1020] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-white">
                      Project {index + 1}
                    </p>
                    <button
                      type="button"
                      aria-label="Remove project"
                      onClick={() =>
                        updateField(
                          "projects",
                          data.projects.filter((_, i) => i !== index),
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field(
                      "Project name",
                      item.name,
                      (v) => updateProject(index, "name", v),
                      "Project name",
                    )}
                    {field(
                      "Live URL",
                      item.url,
                      (v) => updateProject(index, "url", v),
                      "https://...",
                    )}
                    {field(
                      "GitHub URL",
                      item.github,
                      (v) => updateProject(index, "github", v),
                      "https://github.com/...",
                    )}
                    {field(
                      "Technologies (comma-separated)",
                      item.technologies.join(", "),
                      (v) =>
                        updateProject(
                          index,
                          "technologies",
                          v
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        ),
                      "Next.js, Prisma",
                    )}
                    <div className="sm:col-span-2">
                      {field(
                        "Description",
                        item.description,
                        (v) => updateProject(index, "description", v),
                        "What did you build and what was the impact?",
                        true,
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {addButton("Add project", () =>
                updateField("projects", [...data.projects, createProject()]),
              )}
            </div>,
          )}

          {section(
            "Certifications",
            "Add professional certifications and credentials.",
            <Award className="h-5 w-5" />,
            <div className="space-y-4">
              {data.certifications.map((item, index) => (
                <div
                  key={item.id || index}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1020] p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-white">
                      Certification {index + 1}
                    </p>
                    <button
                      type="button"
                      aria-label="Remove certification"
                      onClick={() =>
                        updateField(
                          "certifications",
                          data.certifications.filter((_, i) => i !== index),
                        )
                      }
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-400/10 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field(
                      "Certification name",
                      item.name,
                      (v) => updateCertification(index, "name", v),
                      "Certification",
                    )}
                    {field(
                      "Issuing organization",
                      item.issuer,
                      (v) => updateCertification(index, "issuer", v),
                      "Organization",
                    )}
                    {field(
                      "Date",
                      item.date,
                      (v) => updateCertification(index, "date", v),
                      "2025",
                    )}
                  </div>
                </div>
              ))}
              {addButton("Add certification", () =>
                updateField("certifications", [
                  ...data.certifications,
                  createCertification(),
                ]),
              )}
            </div>,
          )}

          {section(
            "Achievements",
            "Add awards, milestones, or other notable accomplishments.",
            <Sparkles className="h-5 w-5" />,
            field(
              "Achievements (one per line)",
              data.achievements.join("\n"),
              (v) =>
                updateField(
                  "achievements",
                  v.split("\n").filter((line) => line.trim()),
                ),
              "Awarded employee of the month...",
              true,
            ),
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0e1425] p-4">
            <p className="text-xs text-slate-400">
              Remember to save your latest changes.
            </p>
            <button
              type="button"
              onClick={() => void saveResume()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-extrabold text-slate-950 hover:bg-cyan-200 disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save resume"}
            </button>
          </div>
        </div>

        <aside
          className={`${showPreview ? "block" : "hidden"} min-w-0 lg:block`}
        >
          <div className="lg:sticky lg:top-[88px]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-white">Live preview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {templates.find((item) => item.id === template)?.name}{" "}
                  template
                </p>
              </div>
              <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300">
                Live
              </span>
            </div>
            <div className="max-h-[calc(100vh-145px)] overflow-auto rounded-xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/20 sm:p-4">
              <div className="origin-top scale-[0.98]">
                <ResumeRenderer
                  resume={data}
                  template={template}
                  className="mx-auto w-full"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-600">
              Preview updates as you edit. Save to store changes.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
