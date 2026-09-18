"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Download,
  FileText,
  GraduationCap,
  History,
  Loader2,
  Plus,
  Redo2,
  Save,
  Sparkles,
  Target,
  Trash2,
  Undo2,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Candidate = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  headline: string;
};

type Experience = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
};

type Education = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Project = {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
};

type Certification = {
  name: string;
  issuer: string;
  date: string;
  url: string;
};

type Language = {
  name: string;
  proficiency: string;
};

type ResumeData = {
  candidate: Candidate;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  achievements: string[];
};

type AnalysisResponse = {
  success: boolean;
  analysis?: {
    id?: string;
    overallScore?: number;
    rawResult?: unknown;
  };
  resume?: {
    id?: string;
    fileName?: string;
    extractedText?: string;
  };
  error?: string;
};

type DraftResponse = {
  success: boolean;
  draft?: {
    id: string;
    name: string;
    data: ResumeData;
    updatedAt: string;
  } | null;
  error?: string;
};

type HistoryItem = {
  id: string;
  data: ResumeData;
};

const EMPTY_RESUME: ResumeData = {
  candidate: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    headline: "",
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
};

export default function AIPage() {
  const [resumeId, setResumeId] = useState("");
  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME);
  const [resumeName, setResumeName] = useState("My Resume");

  const [targetRole, setTargetRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const [exportOpen, setExportOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateResume = useCallback(
    (updater: (current: ResumeData) => ResumeData) => {
      setResume((current) => {
        const next = updater(current);

        setHistory((items) => {
          const nextItems = items.slice(0, historyIndex + 1);

          nextItems.push({
            id: `${Date.now()}`,
            data: cloneResume(next),
          });

          return nextItems.slice(-30);
        });

        setHistoryIndex((index) => Math.min(index + 1, 29));

        return next;
      });
    },
    [historyIndex],
  );

  const updateCandidate = (field: keyof Candidate, value: string) => {
    updateResume((current) => ({
      ...current,
      candidate: {
        ...current.candidate,
        [field]: value,
      },
    }));
  };

  const saveDraft = useCallback(
    async (silent = false) => {
      if (!resumeId) return;

      if (!silent) {
        setSaving(true);
      }

      try {
        const response = await fetch("/api/resume/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId,
            name: resumeName || "My Resume",
            data: resume,
          }),
        });

        const data: DraftResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to save your resume.");
        }

        setSavedAt(new Date());
      } catch (err) {
        console.error("Draft save error:", err);

        if (!silent) {
          setError(
            err instanceof Error ? err.message : "Failed to save your resume.",
          );
        }
      } finally {
        if (!silent) {
          setSaving(false);
        }
      }
    },
    [resume, resumeId, resumeName],
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/resume/latest-analysis", {
          cache: "no-store",
        });

        const data: AnalysisResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "No analyzed resume was found.");
        }

        const id = data.resume?.id;

        if (!id) {
          throw new Error("The analyzed resume has no ID.");
        }

        setResumeId(id);

        const structured = normalizeResume(
          data.analysis?.rawResult,
          data.resume?.extractedText ?? "",
        );

        const draftResponse = await fetch(
          `/api/resume/draft?resumeId=${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          },
        );

        const draftData: DraftResponse = await draftResponse.json();

        if (draftResponse.ok && draftData.success && draftData.draft?.data) {
          setResume(normalizeResumeData(draftData.draft.data));

          setResumeName(draftData.draft.name || "My Resume");
        } else {
          setResume(structured);

          setResumeName(cleanResumeName(data.resume?.fileName));
        }

        const firstRole = getRecommendedRole(data.analysis?.rawResult);

        if (firstRole) {
          setTargetRole(firstRole);
        }

        const initial = draftData.draft?.data
          ? normalizeResumeData(draftData.draft.data)
          : structured;

        setHistory([
          {
            id: "initial",
            data: cloneResume(initial),
          },
        ]);

        setHistoryIndex(0);
      } catch (err) {
        console.error("Resume studio load error:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load your resume.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!resumeId || loading) return;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(() => {
      saveDraft(true);
    }, 900);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [resume, resumeName, resumeId, loading, saveDraft]);

  const undo = () => {
    if (historyIndex <= 0) return;

    const previousIndex = historyIndex - 1;
    const previous = history[previousIndex];

    if (!previous) return;

    setHistoryIndex(previousIndex);
    setResume(cloneResume(previous.data));
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;
    const next = history[nextIndex];

    if (!next) return;

    setHistoryIndex(nextIndex);
    setResume(cloneResume(next.data));
  };

  const improveResume = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "full",
          targetRole,
          resume,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to improve your resume.");
      }

      if (!data.result) {
        throw new Error("No improved resume was returned.");
      }

      updateResume(() => normalizeResumeData(data.result));

      setMobileView("preview");

      await new Promise((resolve) => setTimeout(resolve, 100));

      await saveDraft(false);
    } catch (err) {
      console.error("Resume improvement error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while improving the resume.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const printResume = () => {
    setExportOpen(false);

    setTimeout(() => {
      window.print();
    }, 50);
  };

  const addExperience = () => {
    updateResume((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
          achievements: [""],
          technologies: [],
        },
      ],
    }));
  };

  const addEducation = () => {
    updateResume((current) => ({
      ...current,
      education: [
        ...current.education,
        {
          degree: "",
          field: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const addProject = () => {
    updateResume((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          name: "",
          description: "",
          technologies: [],
          url: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const addSkill = () => {
    updateResume((current) => ({
      ...current,
      skills: [...current.skills, ""],
    }));
  };

  const removeExperience = (index: number) => {
    updateResume((current) => ({
      ...current,
      experience: current.experience.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const removeEducation = (index: number) => {
    updateResume((current) => ({
      ...current,
      education: current.education.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  const removeProject = (index: number) => {
    updateResume((current) => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const score = useMemo(() => {
    let completed = 0;
    let total = 0;

    const check = (value: string) => {
      total += 1;

      if (value.trim()) {
        completed += 1;
      }
    };

    check(resume.candidate.name);
    check(resume.candidate.email);
    check(resume.candidate.headline);
    check(resume.summary);

    resume.experience.forEach((item) => {
      check(item.company);
      check(item.role);
      check(item.achievements.join(" "));
    });

    resume.education.forEach((item) => {
      check(item.institution);
      check(item.degree);
    });

    resume.skills.forEach(check);

    return total ? Math.round((completed / total) * 100) : 0;
  }, [resume]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#070A10] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[650px] w-[650px] rounded-full bg-indigo-600/15 blur-[150px]" />
        <div className="absolute -right-48 top-[15%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[245px] shrink-0 border-r border-white/[0.08] bg-slate-950/70 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col print:hidden">
          <Link href="/dashboard" className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              <Sparkles className="h-4 w-4 text-white" />
            </span>

            <span className="text-lg font-black tracking-tight">
              Revio<span className="text-cyan-400">.</span>
            </span>
          </Link>

          <div className="mt-10">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Workspace
            </p>

            <nav className="mt-3 space-y-1">
              <SidebarItem href="/dashboard" label="Dashboard" />

              <SidebarItem href="/resume" label="My Resumes" />

              <SidebarItem href="/templates" label="Templates" />

              <SidebarItem href="/analyzer" label="Resume Analyzer" />
            </nav>
          </div>

          <div className="mt-8">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Resume Intelligence
            </p>

            <nav className="mt-3 space-y-1">
              <SidebarItem href="/ai" label="Rewrite Resume" active />

              <SidebarItem href="/settings" label="Settings" />
            </nav>
          </div>

          <div className="mt-auto rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
              <WandSparkles className="h-4 w-4 text-cyan-300" />
            </div>

            <p className="mt-3 text-xs font-bold text-white">Resume Studio</p>

            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
              Edit your resume while watching the final document update in real
              time.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#080B12]/90 backdrop-blur-2xl print:hidden">
            <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  href="/analyzer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <input
                      value={resumeName}
                      onChange={(event) => setResumeName(event.target.value)}
                      className="max-w-[180px] truncate bg-transparent text-sm font-black text-white outline-none sm:max-w-[300px]"
                    />

                    {saving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                  </div>

                  <p className="mt-0.5 text-[9px] uppercase tracking-widest text-slate-600">
                    {saving
                      ? "Saving changes"
                      : savedAt
                        ? `Saved ${formatTime(savedAt)}`
                        : "Resume Studio"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 transition hover:text-white disabled:opacity-30 sm:flex"
                  title="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </button>

                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 transition hover:text-white disabled:opacity-30 sm:flex"
                  title="Redo"
                >
                  <Redo2 className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setExportOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition hover:scale-[1.02]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Export</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {exportOpen && (
                    <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-2xl">
                      <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                        Export resume
                      </p>

                      <button
                        onClick={printResume}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/[0.05]"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-cyan-300">
                          <FileText className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-white">PDF</p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            Print or save as PDF
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 opacity-45">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                          <FileText className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-white">DOCX</p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            Word export coming next
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 opacity-45">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                          <Download className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-white">PNG</p>

                          <p className="mt-0.5 text-[10px] text-slate-600">
                            Image export coming next
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {error && (
            <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 sm:mx-6 xl:mx-8 print:hidden">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <div className="flex-1">
                <p className="text-xs font-bold text-red-300">
                  Something needs attention
                </p>

                <p className="mt-1 text-[11px] leading-5 text-red-200/60">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
                className="text-red-300/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 xl:px-8">
            <div className="mb-5 flex items-center justify-between gap-4 print:hidden">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Resume Rewrite Studio
                </p>

                <h1 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                  Edit your resume. See the result instantly.
                </h1>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Your existing analyzed resume is loaded here. Change anything
                  on the left and Revio updates the resume preview
                  automatically.
                </p>
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 md:flex">
                <Target className="h-3.5 w-3.5 text-cyan-400" />

                <span className="text-[10px] text-slate-500">Completion</span>

                <span className="font-mono text-xs font-bold text-white">
                  {score}%
                </span>
              </div>
            </div>

            <div className="mb-4 flex rounded-xl border border-white/10 bg-slate-900/60 p-1 lg:hidden print:hidden">
              <button
                onClick={() => setMobileView("edit")}
                className={`flex-1 rounded-lg py-2 text-[10px] font-bold ${
                  mobileView === "edit"
                    ? "bg-white text-slate-950"
                    : "text-slate-500"
                }`}
              >
                Edit Resume
              </button>

              <button
                onClick={() => setMobileView("preview")}
                className={`flex-1 rounded-lg py-2 text-[10px] font-bold ${
                  mobileView === "preview"
                    ? "bg-white text-slate-950"
                    : "text-slate-500"
                }`}
              >
                Preview
              </button>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(500px,1.1fr)]">
              <div
                className={`space-y-4 ${
                  mobileView === "preview" ? "hidden lg:block" : "block"
                } print:hidden`}
              >
                <EditorSection
                  icon={<UserRound className="h-4 w-4" />}
                  title="Personal Information"
                  description="The information employers see first."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <EditorInput
                      label="Full name"
                      value={resume.candidate.name}
                      onChange={(value) => updateCandidate("name", value)}
                    />

                    <EditorInput
                      label="Headline"
                      value={resume.candidate.headline}
                      onChange={(value) => updateCandidate("headline", value)}
                    />

                    <EditorInput
                      label="Email"
                      value={resume.candidate.email}
                      onChange={(value) => updateCandidate("email", value)}
                    />

                    <EditorInput
                      label="Phone"
                      value={resume.candidate.phone}
                      onChange={(value) => updateCandidate("phone", value)}
                    />

                    <EditorInput
                      label="Location"
                      value={resume.candidate.location}
                      onChange={(value) => updateCandidate("location", value)}
                    />

                    <EditorInput
                      label="LinkedIn"
                      value={resume.candidate.linkedin}
                      onChange={(value) => updateCandidate("linkedin", value)}
                    />

                    <EditorInput
                      label="GitHub"
                      value={resume.candidate.github}
                      onChange={(value) => updateCandidate("github", value)}
                    />

                    <EditorInput
                      label="Portfolio"
                      value={resume.candidate.portfolio}
                      onChange={(value) => updateCandidate("portfolio", value)}
                    />
                  </div>
                </EditorSection>

                <EditorSection
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Professional Summary"
                  description="A concise introduction tailored to your target role."
                  action={
                    <button
                      onClick={() =>
                        improveSingleSection(
                          "summary",
                          resume,
                          targetRole,
                          setIsGenerating,
                          setError,
                          (value) =>
                            updateResume((current) => ({
                              ...current,
                              summary: value,
                            })),
                        )
                      }
                      disabled={isGenerating}
                      className="flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1.5 text-[9px] font-bold text-cyan-300 hover:bg-cyan-500/15 disabled:opacity-40"
                    >
                      <WandSparkles className="h-3 w-3" />
                      Improve
                    </button>
                  }
                >
                  <EditorTextarea
                    label="Summary"
                    value={resume.summary}
                    onChange={(value) =>
                      updateResume((current) => ({
                        ...current,
                        summary: value,
                      }))
                    }
                    rows={6}
                    placeholder="Write a concise professional summary..."
                  />
                </EditorSection>

                <EditorSection
                  icon={<Target className="h-4 w-4" />}
                  title="Target Role"
                  description="Used to guide Revio's rewriting suggestions."
                >
                  <EditorInput
                    label="Target role"
                    value={targetRole}
                    onChange={setTargetRole}
                    placeholder="e.g. Full Stack Developer"
                  />
                </EditorSection>

                <EditorSection
                  icon={<FileText className="h-4 w-4" />}
                  title="Experience"
                  description="Your professional history and achievements."
                  action={
                    <AddButton label="Add experience" onClick={addExperience} />
                  }
                >
                  <div className="space-y-4">
                    {resume.experience.map((item, index) => (
                      <ExperienceEditor
                        key={index}
                        item={item}
                        index={index}
                        onChange={(next) =>
                          updateResume((current) => ({
                            ...current,
                            experience: current.experience.map(
                              (experience, itemIndex) =>
                                itemIndex === index ? next : experience,
                            ),
                          }))
                        }
                        onRemove={() => removeExperience(index)}
                      />
                    ))}

                    {!resume.experience.length && (
                      <EmptyEditorMessage text="No experience entries yet." />
                    )}
                  </div>
                </EditorSection>

                <EditorSection
                  icon={<GraduationCap className="h-4 w-4" />}
                  title="Education"
                  description="Degrees and academic background."
                  action={
                    <AddButton label="Add education" onClick={addEducation} />
                  }
                >
                  <div className="space-y-4">
                    {resume.education.map((item, index) => (
                      <EducationEditor
                        key={index}
                        item={item}
                        index={index}
                        onChange={(next) =>
                          updateResume((current) => ({
                            ...current,
                            education: current.education.map(
                              (education, itemIndex) =>
                                itemIndex === index ? next : education,
                            ),
                          }))
                        }
                        onRemove={() => removeEducation(index)}
                      />
                    ))}

                    {!resume.education.length && (
                      <EmptyEditorMessage text="No education entries yet." />
                    )}
                  </div>
                </EditorSection>

                <EditorSection
                  icon={<Target className="h-4 w-4" />}
                  title="Skills"
                  description="Keep your strongest relevant skills visible."
                  action={<AddButton label="Add skill" onClick={addSkill} />}
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    {resume.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          value={skill}
                          onChange={(event) =>
                            updateResume((current) => ({
                              ...current,
                              skills: current.skills.map((item, itemIndex) =>
                                itemIndex === index ? event.target.value : item,
                              ),
                            }))
                          }
                          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                          placeholder="e.g. React"
                        />

                        <button
                          onClick={() =>
                            updateResume((current) => ({
                              ...current,
                              skills: current.skills.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            }))
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-600 hover:border-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </EditorSection>

                <EditorSection
                  icon={<FileText className="h-4 w-4" />}
                  title="Projects"
                  description="Show what you built and the technologies behind it."
                  action={
                    <AddButton label="Add project" onClick={addProject} />
                  }
                >
                  <div className="space-y-4">
                    {resume.projects.map((item, index) => (
                      <ProjectEditor
                        key={index}
                        item={item}
                        index={index}
                        onChange={(next) =>
                          updateResume((current) => ({
                            ...current,
                            projects: current.projects.map(
                              (project, itemIndex) =>
                                itemIndex === index ? next : project,
                            ),
                          }))
                        }
                        onRemove={() => removeProject(index)}
                      />
                    ))}

                    {!resume.projects.length && (
                      <EmptyEditorMessage text="No projects found in the analyzed resume." />
                    )}
                  </div>
                </EditorSection>

                <button
                  onClick={improveResume}
                  disabled={isGenerating}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 py-4 text-xs font-black text-white shadow-[0_0_35px_rgba(79,70,229,0.22)] transition hover:scale-[1.005] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Revio is improving your resume...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="h-4 w-4" />
                      Improve Entire Resume
                    </>
                  )}
                </button>
              </div>

              <div
                className={`lg:sticky lg:top-[92px] ${
                  mobileView === "edit" ? "hidden lg:block" : "block"
                }`}
              >
                <div className="mb-3 flex items-center justify-between print:hidden">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                      Live document
                    </p>

                    <p className="mt-1 text-sm font-black text-white">
                      Resume Preview
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[9px] font-bold text-emerald-300">
                      Live
                    </span>
                  </div>
                </div>

                <div
                  id="resume-print-area"
                  className="mx-auto w-full max-w-[850px] overflow-hidden rounded-xl bg-white shadow-[0_30px_100px_rgba(0,0,0,0.45)] print:max-w-none print:rounded-none print:shadow-none"
                >
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          #resume-print-area {
            width: 100% !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </main>
  );
}

/* ============================================================
   EDITOR COMPONENTS
============================================================ */

function EditorSection({
  icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-white/[0.08] bg-slate-900/65 p-5 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
            {icon}
          </div>

          <div>
            <h2 className="text-sm font-black text-white">{title}</h2>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function EditorInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
      />
    </label>
  );
}

function EditorTextarea({
  label,
  value,
  onChange,
  rows = 5,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-3 text-xs leading-6 text-slate-300 outline-none placeholder:text-slate-700 focus:border-indigo-500/50"
      />
    </label>
  );
}

function ExperienceEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: Experience;
  index: number;
  onChange: (value: Experience) => void;
  onRemove: () => void;
}) {
  const update = <K extends keyof Experience>(
    field: K,
    value: Experience[K],
  ) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  const updateAchievement = (achievementIndex: number, value: string) => {
    onChange({
      ...item,
      achievements: item.achievements.map((achievement, itemIndex) =>
        itemIndex === achievementIndex ? value : achievement,
      ),
    });
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          Experience {index + 1}
        </p>

        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <EditorInput
          label="Company"
          value={item.company}
          onChange={(value) => update("company", value)}
        />

        <EditorInput
          label="Role"
          value={item.role}
          onChange={(value) => update("role", value)}
        />

        <EditorInput
          label="Location"
          value={item.location}
          onChange={(value) => update("location", value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <EditorInput
            label="Start"
            value={item.startDate}
            onChange={(value) => update("startDate", value)}
          />

          <EditorInput
            label="End"
            value={item.endDate}
            onChange={(value) => update("endDate", value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <EditorTextarea
          label="Description"
          value={item.description}
          onChange={(value) => update("description", value)}
          rows={3}
        />
      </div>

      <div className="mt-4">
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          Achievements
        </span>

        <div className="mt-2 space-y-2">
          {item.achievements.map((achievement, achievementIndex) => (
            <div key={achievementIndex} className="flex gap-2">
              <textarea
                value={achievement}
                onChange={(event) =>
                  updateAchievement(achievementIndex, event.target.value)
                }
                rows={2}
                className="min-w-0 flex-1 resize-y rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5 text-xs leading-5 text-slate-300 outline-none focus:border-indigo-500/50"
                placeholder="Describe an achievement..."
              />

              <button
                onClick={() =>
                  onChange({
                    ...item,
                    achievements: item.achievements.filter(
                      (_, itemIndex) => itemIndex !== achievementIndex,
                    ),
                  })
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:text-red-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <button
            onClick={() =>
              onChange({
                ...item,
                achievements: [...item.achievements, ""],
              })
            }
            className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400"
          >
            <Plus className="h-3 w-3" />
            Add achievement
          </button>
        </div>
      </div>

      {item.technologies.length > 0 && (
        <div className="mt-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
            Technologies
          </span>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.technologies.map((technology, technologyIndex) => (
              <span
                key={technologyIndex}
                className="rounded-lg border border-indigo-500/15 bg-indigo-500/[0.07] px-2 py-1 text-[9px] text-indigo-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EducationEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: Education;
  index: number;
  onChange: (value: Education) => void;
  onRemove: () => void;
}) {
  const update = <K extends keyof Education>(field: K, value: Education[K]) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          Education {index + 1}
        </p>

        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <EditorInput
          label="Institution"
          value={item.institution}
          onChange={(value) => update("institution", value)}
        />

        <EditorInput
          label="Degree"
          value={item.degree}
          onChange={(value) => update("degree", value)}
        />

        <EditorInput
          label="Field"
          value={item.field}
          onChange={(value) => update("field", value)}
        />

        <EditorInput
          label="Location"
          value={item.location}
          onChange={(value) => update("location", value)}
        />

        <EditorInput
          label="Start"
          value={item.startDate}
          onChange={(value) => update("startDate", value)}
        />

        <EditorInput
          label="End"
          value={item.endDate}
          onChange={(value) => update("endDate", value)}
        />
      </div>

      <div className="mt-4">
        <EditorTextarea
          label="Description"
          value={item.description}
          onChange={(value) => update("description", value)}
          rows={3}
        />
      </div>
    </div>
  );
}

function ProjectEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: Project;
  index: number;
  onChange: (value: Project) => void;
  onRemove: () => void;
}) {
  const update = <K extends keyof Project>(field: K, value: Project[K]) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
          Project {index + 1}
        </p>

        <button
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <EditorInput
          label="Project name"
          value={item.name}
          onChange={(value) => update("name", value)}
        />

        <EditorInput
          label="Project URL"
          value={item.url}
          onChange={(value) => update("url", value)}
        />

        <EditorInput
          label="Start"
          value={item.startDate}
          onChange={(value) => update("startDate", value)}
        />

        <EditorInput
          label="End"
          value={item.endDate}
          onChange={(value) => update("endDate", value)}
        />
      </div>

      <div className="mt-4">
        <EditorTextarea
          label="Description"
          value={item.description}
          onChange={(value) => update("description", value)}
          rows={4}
        />
      </div>

      <div className="mt-4">
        <EditorInput
          label="Technologies"
          value={item.technologies.join(", ")}
          onChange={(value) =>
            update(
              "technologies",
              value
                .split(",")
                .map((technology) => technology.trim())
                .filter(Boolean),
            )
          }
          placeholder="React, TypeScript, PostgreSQL"
        />
      </div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[9px] font-bold text-slate-400 transition hover:border-cyan-500/20 hover:text-cyan-300"
    >
      <Plus className="h-3 w-3" />
      {label}
    </button>
  );
}

function EmptyEditorMessage({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center">
      <p className="text-[10px] text-slate-600">{text}</p>
    </div>
  );
}

/* ============================================================
   RESUME PREVIEW
============================================================ */

function ResumePreview({ resume }: { resume: ResumeData }) {
  const candidate = resume.candidate;

  return (
    <article className="min-h-[1120px] bg-white px-[8%] py-[7%] font-sans text-[#172033]">
      <header className="border-b-[2px] border-[#172033] pb-5">
        <h1 className="text-[30px] font-black tracking-tight">
          {candidate.name || "Your Name"}
        </h1>

        {candidate.headline && (
          <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#46516a]">
            {candidate.headline}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] text-[#5d6677]">
          {candidate.email && <span>{candidate.email}</span>}

          {candidate.phone && <span>{candidate.phone}</span>}

          {candidate.location && <span>{candidate.location}</span>}

          {candidate.linkedin && <span>{candidate.linkedin}</span>}

          {candidate.github && <span>{candidate.github}</span>}

          {candidate.portfolio && <span>{candidate.portfolio}</span>}
        </div>
      </header>

      {resume.summary && (
        <PreviewSection title="Professional Summary">
          <p className="text-[10px] leading-[1.65] text-[#414b5e]">
            {resume.summary}
          </p>
        </PreviewSection>
      )}

      {resume.experience.length > 0 && (
        <PreviewSection title="Experience">
          <div className="space-y-4">
            {resume.experience.map((item, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[11px] font-black text-[#172033]">
                      {item.role || "Role"}
                    </h3>

                    <p className="mt-0.5 text-[10px] font-semibold text-[#46516a]">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>

                  <p className="shrink-0 text-[9px] text-[#697386]">
                    {formatDateRange(item.startDate, item.endDate)}
                  </p>
                </div>

                {item.description && (
                  <p className="mt-1.5 text-[9.5px] leading-[1.55] text-[#515b6c]">
                    {item.description}
                  </p>
                )}

                {item.achievements.filter(Boolean).length > 0 && (
                  <ul className="mt-1.5 space-y-1 pl-3.5">
                    {item.achievements
                      .filter(Boolean)
                      .map((achievement, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="list-disc text-[9.5px] leading-[1.5] text-[#414b5e]"
                        >
                          {achievement}
                        </li>
                      ))}
                  </ul>
                )}

                {item.technologies.length > 0 && (
                  <p className="mt-1.5 text-[8.5px] text-[#697386]">
                    <span className="font-bold">Technologies:</span>{" "}
                    {item.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.projects.length > 0 && (
        <PreviewSection title="Projects">
          <div className="space-y-3.5">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[10.5px] font-black">
                    {project.name || "Project"}
                  </h3>

                  {(project.startDate || project.endDate) && (
                    <span className="shrink-0 text-[8.5px] text-[#697386]">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="mt-1 text-[9.5px] leading-[1.55] text-[#515b6c]">
                    {project.description}
                  </p>
                )}

                {project.technologies.length > 0 && (
                  <p className="mt-1 text-[8.5px] text-[#697386]">
                    <span className="font-bold">Technologies:</span>{" "}
                    {project.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.education.length > 0 && (
        <PreviewSection title="Education">
          <div className="space-y-3">
            {resume.education.map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="text-[10.5px] font-black">
                    {item.degree}
                    {item.field ? ` in ${item.field}` : ""}
                  </h3>

                  <p className="mt-0.5 text-[9.5px] font-semibold text-[#46516a]">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>

                  {item.description && (
                    <p className="mt-1 text-[9px] leading-[1.5] text-[#596274]">
                      {item.description}
                    </p>
                  )}
                </div>

                <span className="shrink-0 text-[8.5px] text-[#697386]">
                  {formatDateRange(item.startDate, item.endDate)}
                </span>
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.skills.filter(Boolean).length > 0 && (
        <PreviewSection title="Skills">
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {resume.skills.filter(Boolean).map((skill, index) => (
              <span key={index} className="text-[9.5px] text-[#414b5e]">
                {skill}
                {index < resume.skills.filter(Boolean).length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.certifications.length > 0 && (
        <PreviewSection title="Certifications">
          <div className="space-y-2">
            {resume.certifications.map((item, index) => (
              <div key={index}>
                <p className="text-[10px] font-bold">{item.name}</p>

                <p className="text-[9px] text-[#596274]">
                  {item.issuer}
                  {item.date ? ` · ${item.date}` : ""}
                </p>
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.languages.length > 0 && (
        <PreviewSection title="Languages">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {resume.languages.map((language, index) => (
              <span key={index} className="text-[9px] text-[#414b5e]">
                <strong>{language.name}</strong>
                {language.proficiency ? ` — ${language.proficiency}` : ""}
              </span>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.achievements.filter(Boolean).length > 0 && (
        <PreviewSection title="Achievements">
          <ul className="space-y-1 pl-3.5">
            {resume.achievements.filter(Boolean).map((achievement, index) => (
              <li
                key={index}
                className="list-disc text-[9.5px] leading-[1.5] text-[#414b5e]"
              >
                {achievement}
              </li>
            ))}
          </ul>
        </PreviewSection>
      )}
    </article>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <h2 className="mb-2.5 border-b border-[#dce1e8] pb-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#172033]">
        {title}
      </h2>

      {children}
    </section>
  );
}

/* ============================================================
   SIDEBAR
============================================================ */

function SidebarItem({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
        active
          ? "border border-indigo-500/30 bg-indigo-500/10 text-white"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-cyan-400" : "bg-slate-700"
        }`}
      />

      {label}
    </Link>
  );
}

/* ============================================================
   HELPERS
============================================================ */

function normalizeResume(
  rawResult: unknown,
  extractedText: string,
): ResumeData {
  if (rawResult && typeof rawResult === "object" && !Array.isArray(rawResult)) {
    const value = rawResult as Record<string, unknown>;

    if (value.resume && typeof value.resume === "object") {
      return normalizeResumeData(value.resume as Partial<ResumeData>);
    }

    return normalizeResumeData(value as Partial<ResumeData>);
  }

  return parseResumeText(extractedText);
}

function normalizeResumeData(value: Partial<ResumeData> | unknown): ResumeData {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const candidateSource =
    source.candidate && typeof source.candidate === "object"
      ? (source.candidate as Record<string, unknown>)
      : {};

  return {
    candidate: {
      name: stringValue(candidateSource.name),
      email: stringValue(candidateSource.email),
      phone: stringValue(candidateSource.phone),
      location: stringValue(candidateSource.location),
      linkedin: stringValue(candidateSource.linkedin),
      github: stringValue(candidateSource.github),
      portfolio: stringValue(candidateSource.portfolio),
      headline: stringValue(candidateSource.headline),
    },

    summary: stringValue(source.summary),

    experience: arrayValue(source.experience).map((item) => {
      const value =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};

      return {
        company: stringValue(value.company),
        role: stringValue(value.role),
        location: stringValue(value.location),
        startDate: stringValue(value.startDate),
        endDate: stringValue(value.endDate),
        description: stringValue(value.description),
        achievements: stringArray(value.achievements),
        technologies: stringArray(value.technologies),
      };
    }),

    education: arrayValue(source.education).map((item) => {
      const value =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};

      return {
        degree: stringValue(value.degree),
        field: stringValue(value.field),
        institution: stringValue(value.institution),
        location: stringValue(value.location),
        startDate: stringValue(value.startDate),
        endDate: stringValue(value.endDate),
        description: stringValue(value.description),
      };
    }),

    projects: arrayValue(source.projects).map((item) => {
      const value =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};

      return {
        name: stringValue(value.name),
        description: stringValue(value.description),
        technologies: stringArray(value.technologies),
        url: stringValue(value.url),
        startDate: stringValue(value.startDate),
        endDate: stringValue(value.endDate),
      };
    }),

    skills: stringArray(source.skills),

    certifications: arrayValue(source.certifications).map((item) => {
      const value =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};

      return {
        name: stringValue(value.name),
        issuer: stringValue(value.issuer),
        date: stringValue(value.date),
        url: stringValue(value.url),
      };
    }),

    languages: arrayValue(source.languages).map((item) => {
      const value =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};

      return {
        name: stringValue(value.name),
        proficiency: stringValue(value.proficiency),
      };
    }),

    achievements: stringArray(source.achievements),
  };
}

function parseResumeText(text: string): ResumeData {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    ...EMPTY_RESUME,
    candidate: {
      ...EMPTY_RESUME.candidate,
      name: lines[0] ?? "",
      email: lines.find((line) => /\S+@\S+\.\S+/.test(line)) ?? "",
    },
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
    achievements: [],
  };
}

function stringValue(value: unknown) {
  if (typeof value === "string") return value;

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function cloneResume(value: ResumeData): ResumeData {
  return JSON.parse(JSON.stringify(value));
}

function cleanResumeName(fileName?: string) {
  if (!fileName) return "My Resume";

  return (
    fileName
      .replace(/\.pdf$/i, "")
      .replace(/[_-]+/g, " ")
      .trim() || "My Resume"
  );
}

function getRecommendedRole(rawResult: unknown) {
  if (!rawResult || typeof rawResult !== "object" || Array.isArray(rawResult)) {
    return "";
  }

  const value = rawResult as Record<string, unknown>;

  const roles = Array.isArray(value.roles)
    ? value.roles
    : Array.isArray(value.recommendedRoles)
      ? value.recommendedRoles
      : [];

  const first = roles[0];

  if (first && typeof first === "object" && !Array.isArray(first)) {
    const role = (first as Record<string, unknown>).role;

    return typeof role === "string" ? role : "";
  }

  return "";
}

function formatDateRange(start: string, end: string) {
  if (!start && !end) return "";

  if (start && end) {
    return `${start} — ${end}`;
  }

  return start || end;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function improveSingleSection(
  type: "summary",
  resume: ResumeData,
  targetRole: string,
  setGenerating: (value: boolean) => void,
  setError: (value: string) => void,
  apply: (value: string) => void,
) {
  setGenerating(true);
  setError("");

  try {
    const response = await fetch("/api/ai/rewrite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        text: resume.summary,
        targetRole,
        resume,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Unable to improve this section.");
    }

    if (data.result?.improved) {
      apply(data.result.improved);
    }
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to improve this section.",
    );
  } finally {
    setGenerating(false);
  }
}

function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070A10]">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10">
          <Sparkles className="h-6 w-6 animate-pulse text-cyan-300" />
        </div>

        <p className="mt-5 text-sm font-bold text-white">Loading your resume</p>

        <p className="mt-2 text-xs text-slate-600">
          Preparing your editable workspace...
        </p>
      </div>
    </main>
  );
}
