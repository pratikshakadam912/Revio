"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  FileText,
  Lightbulb,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type ProjectData = {
  name: string;
  description: string;
  contribution?: string;
  technologies?: string[];
  impact?: string;
};

type RoleData = {
  rank?: string;
  role: string;
  match: number;
  description?: string;
  skills?: string[];
};

type AnalysisResult = {
  candidate?: {
    name?: string;
    headline?: string;
    location?: string;
  };

  overallScore?: number;

  summary?: string;

  skills?: string[];

  projects?: ProjectData[];

  strengths?: string[];

  weaknesses?: string[];

  suggestions?: string[];

  scores?: {
    atsCompatibility?: number;
    skillsStrength?: number;
    experience?: number;
    educationMatch?: number;
    contentQuality?: number;
  };

  recommendedRoles?: RoleData[];

  skillGaps?: {
    name: string;
    level: number;
  }[];

  nextCareerMove?: {
    title?: string;
    description?: string;
  };
};

type RewriteResponse = {
  success: boolean;
  result?: {
    improved?: string;
    explanation?: string;
    keywords?: string[];
    atsScore?: number;
    original?: string;
  };
  error?: string;
};

export default function AIPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const [activeTool, setActiveTool] = useState<
    "rewrite" | "summary" | "skills" | "project"
  >("rewrite");

  const [inputText, setInputText] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<RewriteResponse["result"] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const response = await fetch("/api/resume/latest-analysis");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data?.result) {
          setAnalysis(data.result);

          if (data.result.recommendedRoles?.[0]?.role) {
            setTargetRole(data.result.recommendedRoles[0].role);
          }
        }
      } catch (error) {
        console.error("Failed to load latest analysis:", error);
      }
    };

    loadAnalysis();
  }, []);

  useEffect(() => {
    if (!analysis?.projects?.length) return;

    const project = analysis.projects[0];

    if (!selectedProject) {
      setSelectedProject(project.name);

      setInputText(buildProjectText(project));
    }
  }, [analysis, selectedProject]);

  const handleProjectChange = (name: string) => {
    setSelectedProject(name);

    const project = analysis?.projects?.find((item) => item.name === name);

    if (project) {
      setInputText(buildProjectText(project));
    }
  };

  const generate = async () => {
    if (!inputText.trim()) {
      setError("Add some resume content before generating.");
      return;
    }

    setError("");
    setResult(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: activeTool,
          text: inputText,
          targetRole,
          candidateName: analysis?.candidate?.name,
          skills: analysis?.skills ?? [],
          projects: analysis?.projects ?? [],
          analysis,
        }),
      });

      const data: RewriteResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to generate AI suggestions.");
      }

      if (!data.result) {
        throw new Error("No AI result was returned.");
      }

      setResult(data.result);
    } catch (err) {
      console.error("AI generation error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");

    if (activeTool === "project" && analysis?.projects?.length) {
      const project = analysis.projects.find(
        (item) => item.name === selectedProject,
      );

      if (project) {
        setInputText(buildProjectText(project));
      }

      return;
    }

    setInputText("");
  };

  const changeTool = (tool: "rewrite" | "summary" | "skills" | "project") => {
    setActiveTool(tool);
    setResult(null);
    setError("");

    if (tool === "project" && analysis?.projects?.length) {
      const project = analysis.projects[0];

      setSelectedProject(project.name);
      setInputText(buildProjectText(project));
      return;
    }

    setInputText("");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080B12] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[220px] -top-[250px] h-[650px] w-[650px] rounded-full bg-indigo-600/20 blur-[150px]" />

        <div className="absolute -right-[220px] top-[10%] h-[650px] w-[650px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="absolute left-1/2 top-[55%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-950/30 blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <aside className="hidden w-[260px] shrink-0 border-r border-white/[0.08] bg-slate-950/60 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-2 text-lg font-black tracking-tight"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 shadow-[0_0_22px_rgba(99,102,241,0.35)]">
              <Sparkles className="relative z-10 h-4 w-4 text-white" />
            </span>

            <span>
              Revio<span className="text-cyan-400">.</span>
            </span>
          </Link>

          <div className="mt-9 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Workspace
            </p>
          </div>

          <nav className="mt-3 space-y-1">
            <SidebarItem href="/dashboard" label="Dashboard" />

            <SidebarItem href="/resume" label="My Resumes" />

            <SidebarItem href="/templates" label="Templates" />

            <SidebarItem href="/analyzer" label="Resume Analyzer" />
          </nav>

          <div className="mt-8 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Intelligence Tools
            </p>
          </div>

          <nav className="mt-3 space-y-1">
            <SidebarItem href="/ai" label="STAR Bullet Rewriter" active />

            <SidebarItem href="/settings" label="Settings" />
          </nav>

          <div className="mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-600/20 blur-[40px]" />

              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
                  <WandSparkles className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-bold text-white">
                  AI Resume Intelligence
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                  Turn your existing experience into stronger, ATS-friendly
                  resume content.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================================
            MAIN
        ====================================================== */}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          {/* ====================================================
              TOP BAR
          ==================================================== */}

          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/analyzer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Intelligence Tools
                </p>

                <p className="mt-0.5 text-sm font-bold text-white">
                  AI Resume Studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {analysis?.overallScore !== undefined && (
                <div className="hidden items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-950/40 px-3 py-1.5 sm:flex">
                  <Target className="h-3.5 w-3.5 text-cyan-400" />

                  <span className="text-[10px] text-slate-500">
                    Resume Score
                  </span>

                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {analysis.overallScore}/100
                  </span>
                </div>
              )}

              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 transition hover:text-white"
              >
                <Zap className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {/* ====================================================
              INTRO
          ==================================================== */}

          <section className="mx-auto mt-12 max-w-5xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  Revio Intelligence
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Make your experience
                  <span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                    sound as strong as it really is.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Revio uses the information already found in your resume to
                  rewrite weak content, strengthen project descriptions, improve
                  ATS keywords and make your achievements clearer.
                </p>
              </div>

              {analysis?.candidate?.name && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Candidate
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    {analysis.candidate.name}
                  </p>

                  {analysis.candidate.headline && (
                    <p className="mt-1 max-w-[240px] text-[10px] text-slate-500">
                      {analysis.candidate.headline}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ====================================================
              TOOL NAVIGATION
          ==================================================== */}

          <section className="mx-auto mt-10 max-w-5xl">
            <div className="grid gap-2 sm:grid-cols-4">
              <ToolTab
                active={activeTool === "rewrite"}
                icon={<WandSparkles />}
                title="STAR Rewrite"
                description="Strengthen bullet points"
                onClick={() => changeTool("rewrite")}
              />

              <ToolTab
                active={activeTool === "project"}
                icon={<FileText />}
                title="Project Builder"
                description="Describe projects better"
                onClick={() => changeTool("project")}
              />

              <ToolTab
                active={activeTool === "summary"}
                icon={<Sparkles />}
                title="Professional Summary"
                description="Create a stronger profile"
                onClick={() => changeTool("summary")}
              />

              <ToolTab
                active={activeTool === "skills"}
                icon={<Target />}
                title="Skills Optimizer"
                description="Improve ATS keywords"
                onClick={() => changeTool("skills")}
              />
            </div>
          </section>

          {/* ====================================================
              ERROR
          ==================================================== */}

          {error && (
            <div className="mx-auto mt-5 flex max-w-5xl items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />

              <div className="flex-1">
                <p className="text-xs font-bold text-red-300">
                  Generation failed
                </p>

                <p className="mt-1 text-[11px] text-red-200/60">{error}</p>
              </div>

              <button onClick={() => setError("")}>
                <X className="h-4 w-4 text-red-300/60" />
              </button>
            </div>
          )}

          {/* ====================================================
              WORKSPACE
          ==================================================== */}

          <section className="mx-auto mt-6 max-w-5xl">
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              {/* =================================================
                  INPUT
              ================================================= */}

              <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {getToolLabel(activeTool)}
                    </p>

                    <h2 className="mt-1 text-lg font-black text-white">
                      {getToolTitle(activeTool)}
                    </h2>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
                    <WandSparkles className="h-4 w-4" />
                  </div>
                </div>

                {/* PROJECT SELECTOR */}

                {activeTool === "project" &&
                  analysis?.projects &&
                  analysis.projects.length > 0 && (
                    <div className="mt-6">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Select project
                      </label>

                      <div className="relative mt-2">
                        <select
                          value={selectedProject}
                          onChange={(e) => handleProjectChange(e.target.value)}
                          className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-10 text-xs font-semibold text-slate-200 outline-none transition focus:border-indigo-500/50"
                        >
                          {analysis.projects.map((project) => (
                            <option
                              key={project.name}
                              value={project.name}
                              className="bg-slate-950"
                            >
                              {project.name}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>
                  )}

                {/* TARGET ROLE */}

                <div className="mt-6">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Target role
                  </label>

                  <input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                  />
                </div>

                {/* INPUT TEXT */}

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Resume content
                    </label>

                    <span className="font-mono text-[9px] text-slate-600">
                      {inputText.length} characters
                    </span>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={getPlaceholder(activeTool)}
                    className="mt-2 min-h-[250px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-6 text-slate-300 outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                  />
                </div>

                {/* GENERATE */}

                <button
                  onClick={generate}
                  disabled={isGenerating || !inputText.trim()}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 py-3.5 text-xs font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Revio is improving it...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Improve with Revio
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

                {inputText && (
                  <button
                    onClick={reset}
                    className="mx-auto mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 transition hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* =================================================
                  RESULT
              ================================================= */}

              <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      AI Output
                    </p>

                    <h2 className="mt-1 text-lg font-black text-white">
                      {result ? "Improved version" : "Your improved content"}
                    </h2>
                  </div>

                  {result?.atsScore !== undefined && (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-right">
                      <p className="text-[9px] uppercase tracking-wider text-slate-500">
                        ATS quality
                      </p>

                      <p className="text-lg font-black text-emerald-400">
                        {result.atsScore}
                      </p>
                    </div>
                  )}
                </div>

                {!result && !isGenerating && (
                  <EmptyResult activeTool={activeTool} />
                )}

                {isGenerating && (
                  <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                    </div>

                    <p className="mt-5 text-sm font-bold text-white">
                      Revio is analyzing your wording
                    </p>

                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                      Checking clarity, impact, keywords and relevance to your
                      target role.
                    </p>
                  </div>
                )}

                {result && !isGenerating && <GeneratedResult result={result} />}
              </div>
            </div>
          </section>

          {/* ====================================================
              INSIGHTS
          ==================================================== */}

          {analysis && (
            <section className="mx-auto mt-8 max-w-5xl">
              <div className="grid gap-4 md:grid-cols-3">
                <InsightCard
                  icon={<Check />}
                  title="Resume strength"
                  value={`${analysis.overallScore ?? 0}/100`}
                  description="Based on your overall resume analysis."
                />

                <InsightCard
                  icon={<Target />}
                  title="Detected skills"
                  value={`${analysis.skills?.length ?? 0}`}
                  description="Skills Revio identified from your resume."
                />

                <InsightCard
                  icon={<FileText />}
                  title="Projects analyzed"
                  value={`${analysis.projects?.length ?? 0}`}
                  description="Projects available for deeper rewriting."
                />
              </div>
            </section>
          )}

          {/* ====================================================
              FOOTER CTA
          ==================================================== */}

          <section className="mx-auto mt-10 mb-10 max-w-5xl">
            <div className="relative overflow-hidden rounded-[28px] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-slate-950/80 to-slate-950 p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-[80px]" />

              <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-cyan-400" />

                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Next step
                    </p>
                  </div>

                  <h3 className="mt-2 text-lg font-black text-white">
                    Turn these improvements into a complete resume.
                  </h3>

                  <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500">
                    Use your improved content inside Revio's resume builder and
                    optimize the complete document before applying.
                  </p>
                </div>

                <Link
                  href="/resume/new"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 transition hover:scale-[1.02]"
                >
                  Open Resume Builder
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

/* =============================================================
   SIDEBAR ITEM
============================================================= */

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

/* =============================================================
   TOOL TAB
============================================================= */

function ToolTab({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-indigo-500/40 bg-indigo-500/[0.10] shadow-[0_0_25px_rgba(79,70,229,0.08)]"
          : "border-white/[0.07] bg-slate-900/40 hover:border-white/15 hover:bg-slate-900/70"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          active
            ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
            : "border border-white/10 bg-slate-950/60 text-slate-500"
        }`}
      >
        <span className="h-4 w-4">{icon}</span>
      </div>

      <p className="mt-3 text-xs font-bold text-white">{title}</p>

      <p className="mt-1 text-[10px] text-slate-500">{description}</p>
    </button>
  );
}

/* =============================================================
   EMPTY RESULT
============================================================= */

function EmptyResult({ activeTool }: { activeTool: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
        <WandSparkles className="h-7 w-7" />
      </div>

      <h3 className="mt-6 text-base font-bold text-white">
        Your improved version will appear here
      </h3>

      <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
        {activeTool === "project"
          ? "Revio will turn your project into a clear, impact-focused resume description."
          : activeTool === "summary"
            ? "Revio will create a professional summary based only on your actual experience."
            : activeTool === "skills"
              ? "Revio will identify stronger ATS-friendly ways to present your existing skills."
              : "Paste a resume bullet or experience description and Revio will rewrite it using stronger impact-oriented language."}
      </p>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-600">
        <ShieldIcon />
        Based on your actual resume
      </div>
    </div>
  );
}

/* =============================================================
   GENERATED RESULT
============================================================= */

function GeneratedResult({
  result,
}: {
  result: NonNullable<RewriteResponse["result"]>;
}) {
  return (
    <div className="mt-6">
      {result.improved && (
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-400">
              Recommended version
            </p>

            <Check className="h-4 w-4 text-emerald-400" />
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
            {result.improved}
          </p>
        </div>
      )}

      {result.explanation && (
        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 p-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />

            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Why this is stronger
            </p>
          </div>

          <p className="mt-3 text-xs leading-6 text-slate-400">
            {result.explanation}
          </p>
        </div>
      )}

      {result.keywords && result.keywords.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-slate-950/50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Relevant keywords
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {result.keywords.map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1.5 text-[10px] font-medium text-indigo-300"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.original && (
        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-slate-950/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Original
          </p>

          <p className="mt-3 text-xs leading-6 text-slate-600">
            {result.original}
          </p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   INSIGHT CARD
============================================================= */

function InsightCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
          {icon}
        </div>

        <Plus className="h-3.5 w-3.5 text-slate-700" />
      </div>

      <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-black text-white">{value}</p>

      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =============================================================
   HELPERS
============================================================= */

function buildProjectText(project: ProjectData) {
  const parts = [
    `Project: ${project.name}`,
    project.description ? `Description: ${project.description}` : "",
    project.contribution ? `Contribution: ${project.contribution}` : "",
    project.technologies?.length
      ? `Technologies: ${project.technologies.join(", ")}`
      : "",
    project.impact ? `Impact: ${project.impact}` : "",
  ];

  return parts.filter(Boolean).join("\n");
}

function getToolLabel(tool: "rewrite" | "summary" | "skills" | "project") {
  switch (tool) {
    case "project":
      return "Project Intelligence";

    case "summary":
      return "Profile Intelligence";

    case "skills":
      return "ATS Intelligence";

    default:
      return "Experience Intelligence";
  }
}

function getToolTitle(tool: "rewrite" | "summary" | "skills" | "project") {
  switch (tool) {
    case "project":
      return "Build a stronger project";

    case "summary":
      return "Strengthen your professional summary";

    case "skills":
      return "Optimize your skills";

    default:
      return "Rewrite a resume bullet";
  }
}

function getPlaceholder(tool: "rewrite" | "summary" | "skills" | "project") {
  switch (tool) {
    case "project":
      return "Describe what you built, what you worked on, the technologies you used and what the project achieved...";

    case "summary":
      return "Paste your current professional summary or describe your experience...";

    case "skills":
      return "Enter your current skills, tools, technologies or skills section...";

    default:
      return "Example: Developed a website for the company and worked on frontend features...";
  }
}

function ShieldIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
      <Check className="h-2.5 w-2.5" />
    </span>
  );
}
