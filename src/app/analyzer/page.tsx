"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleAlert,
  FileText,
  GraduationCap,
  LayoutTemplate,
  Loader2,
  MapPin,
  Plus,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
  UserRound,
  WandSparkles,
  X,
  Zap,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type ProfileItemData = {
  label: string;
  value: string;
  detail?: string;
};

type RoleData = {
  rank?: string;
  role: string;
  match: number;
  description?: string;
  skills?: string[];
};

type JobData = {
  role: string;
  company: string;
  location: string;
  match: number;
};

type SkillGapData = {
  name: string;
  level: number;
  reason?: string;
};

type ProjectData = {
  name: string;
  description: string;
  contribution?: string;
  technologies?: string[];
  impact?: string;
};

type CandidateData = {
  name?: string;
  headline?: string;
  location?: string;
};

type AnalysisResult = {
  candidate?: CandidateData;

  overallScore: number;

  summary?: string;

  profile?: {
    education?: ProfileItemData;
    experience?: ProfileItemData;
    careerFocus?: ProfileItemData;
  };

  skills?: string[];

  projects?: ProjectData[];

  experienceDetails?: {
    company: string;
    role: string;
    duration: string;
    description: string;
    responsibilities?: string[];
    achievements?: string[];
  }[];

  atsAnalysis?: {
    keywordOptimization?: string;
    formatting?: string;
    sectionStructure?: string;
    readability?: string;
    issues?: string[];
  };

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

  jobs?: JobData[];

  skillGaps?: SkillGapData[];

  nextCareerMove?: {
    title?: string;
    description?: string;
  };

  aiCredits?: {
    used?: number;
    total?: number;
  };
};

/* ============================================================
   API HELPERS
============================================================ */

type ApiResponse<T = unknown> = {
  success?: boolean;
  error?: string;
  details?: string;
  message?: string;
  result?: T;
  resume?: {
    id?: string;
  };
};

async function readApiResponse<T = unknown>(
  response: Response,
): Promise<ApiResponse<T>> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as ApiResponse<T>;
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`,
    );
  }
}

function getApiError(data: ApiResponse, fallback: string): string {
  const error =
    typeof data.error === "string" && data.error.trim()
      ? data.error.trim()
      : typeof data.message === "string" && data.message.trim()
        ? data.message.trim()
        : "";

  const details =
    typeof data.details === "string" && data.details.trim()
      ? data.details.trim()
      : "";

  /*
   * During development the analyze API returns `details`
   * so we can see the actual Gemini error instead of getting
   * a generic "temporarily unavailable" message.
   */
  if (process.env.NODE_ENV !== "production" && details) {
    return `${error || fallback} ${details}`;
  }

  return error || fallback;
}

/* ============================================================
   PAGE
============================================================ */

export default function AnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  /* ==========================================================
     FILE HANDLING
  ========================================================== */

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setError("");

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const fileName = selectedFile.name.toLowerCase();

    const hasValidType = allowedTypes.includes(selectedFile.type);

    const hasValidExtension = allowedExtensions.some((extension) =>
      fileName.endsWith(extension),
    );

    const maxSize = 10 * 1024 * 1024;

    if (!hasValidType && !hasValidExtension) {
      setError("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    if (selectedFile.size === 0) {
      setError("The selected file is empty. Please choose another resume.");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("Resume must be smaller than 10MB.");
      return;
    }

    setFile(selectedFile);
    setResult(null);
  };

  /* ==========================================================
     ANALYZE
  ========================================================== */

  const analyzeResume = async () => {
    if (!file || isAnalyzing) return;

    setIsAnalyzing(true);
    setError("");
    setResult(null);

    try {
      /* ------------------------------------------------------
         STEP 1 — UPLOAD
      ------------------------------------------------------ */

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await readApiResponse<unknown>(uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error(getApiError(uploadData, "Failed to upload resume."));
      }

      const resumeId = uploadData.resume?.id;

      if (!resumeId) {
        throw new Error(
          "Resume was uploaded, but the server did not return a resume ID.",
        );
      }

      /* ------------------------------------------------------
         STEP 2 — ANALYZE
      ------------------------------------------------------ */

      const analyzeResponse = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
        }),
      });

      const analyzeData =
        await readApiResponse<AnalysisResult>(analyzeResponse);

      if (!analyzeResponse.ok) {
        throw new Error(
          getApiError(analyzeData, "Unable to analyze the resume."),
        );
      }

      /* ------------------------------------------------------
         STEP 3 — VALIDATE RESULT
      ------------------------------------------------------ */

      if (!analyzeData.result) {
        throw new Error(
          "The analysis completed, but no analysis result was returned.",
        );
      }

      const analysisResult = analyzeData.result;

      /*
       * Basic validation so a malformed Gemini response does
       * not crash the results UI.
       */
      if (typeof analysisResult !== "object" || analysisResult === null) {
        throw new Error("The analyzer returned an invalid analysis result.");
      }

      setResult(analysisResult);
    } catch (err) {
      console.error("Resume analysis error:", err);

      let message = "Something went wrong while analyzing your resume.";

      if (err instanceof Error && err.message.trim()) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ==========================================================
     RESET
  ========================================================== */

  const resetAnalyzer = () => {
    setFile(null);
    setResult(null);
    setError("");
    setIsAnalyzing(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] text-slate-100">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[260px] -top-[280px] h-[700px] w-[700px] rounded-full bg-indigo-600/20 blur-[150px]" />

        <div className="absolute -right-[260px] top-[5%] h-[650px] w-[650px] rounded-full bg-cyan-500/15 blur-[150px]" />

        <div className="absolute left-1/2 top-[45%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-950/30 blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* ======================================================
          APP SHELL
      ====================================================== */}

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside className="hidden w-[260px] shrink-0 border-r border-white/[0.08] bg-slate-950/60 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 px-2 text-lg font-black tracking-tight"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 shadow-[0_0_22px_rgba(99,102,241,0.35)]">
              <Sparkles className="relative z-10 h-4 w-4 text-white" />

              <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/30 blur-sm" />
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
            <NavItem
              href="/dashboard"
              icon={<BarChart3 className="h-4 w-4" />}
              label="Dashboard"
            />

            <NavItem
              href="/resume"
              icon={<FileText className="h-4 w-4" />}
              label="My Resumes"
            />

            <NavItem
              href="/templates"
              icon={<LayoutTemplate className="h-4 w-4" />}
              label="Templates"
            />

            <NavItem
              href="/analyzer"
              active
              icon={<Target className="h-4 w-4" />}
              label="Resume Analyzer"
            />
          </nav>

          <div className="mt-8 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Intelligence Tools
            </p>
          </div>

          <nav className="mt-3 space-y-1">
            <NavItem
              href="/ai"
              icon={<WandSparkles className="h-4 w-4" />}
              label="STAR Bullet Rewriter"
            />

            <NavItem
              href="/settings"
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
            />
          </nav>

          <div className="mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-600/20 blur-[40px]" />

              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-bold text-white">
                  Career Intelligence
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                  Analyze your resume and discover career opportunities based on
                  your actual profile.
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/60 px-3 py-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-950/60 text-xs font-bold text-cyan-300">
                <UserRound className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-200">
                  Account
                </p>

                <p className="truncate font-mono text-[10px] text-slate-500">
                  Manage profile
                </p>
              </div>
            </Link>
          </div>
        </aside>

        {/* ====================================================
            MAIN
        ==================================================== */}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          {/* ==================================================
              TOP BAR
          ================================================== */}

          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-400 transition hover:border-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Career Intelligence
                </p>

                <p className="mt-0.5 text-sm font-bold tracking-tight text-white">
                  Resume Analyzer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {result?.aiCredits && (
                <div className="hidden items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 sm:flex">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />

                  <span className="text-xs text-slate-400">AI Credits</span>

                  <span className="font-mono text-xs font-bold text-cyan-300">
                    {result.aiCredits.used ?? 0} / {result.aiCredits.total ?? 0}
                  </span>
                </div>
              )}

              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition hover:border-white/20 hover:text-white"
              >
                <UserRound className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-red-300">
                  Analysis failed
                </p>

                <p className="mt-1 break-words text-xs leading-relaxed text-red-200/70">
                  {error}
                </p>
              </div>

              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError("")}
                className="shrink-0 text-red-300/60 transition hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ==================================================
              UPLOAD VIEW
          ================================================== */}

          {!result && (
            <>
              <section className="mx-auto mt-14 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  AI Career Intelligence
                </div>

                <h1 className="mt-6 text-balance text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Understand what your resume
                  <span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                    says about your career.
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Upload your resume and let Revio analyze your actual skills,
                  education, experience, projects and career potential.
                </p>
              </section>

              {/* =================================================
                  UPLOAD
              ================================================= */}

              <section className="mx-auto mt-12 max-w-3xl">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();

                    if (isAnalyzing) return;

                    handleFile(e.dataTransfer.files?.[0] ?? null);
                  }}
                  className={`relative overflow-hidden rounded-[32px] border ${
                    file
                      ? "border-cyan-400/30 bg-cyan-500/[0.04]"
                      : "border-white/10 bg-slate-900/60"
                  } p-8 shadow-2xl backdrop-blur-2xl transition-all sm:p-12`}
                >
                  <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-indigo-600/15 blur-[80px]" />

                  <div className="pointer-events-none absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-[80px]" />

                  <div className="relative">
                    {!file ? (
                      <>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                          <Upload className="h-7 w-7" />
                        </div>

                        <h2 className="mt-6 text-center text-xl font-bold text-white">
                          Upload your resume
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-center text-xs leading-relaxed text-slate-400">
                          Revio will extract your resume content and analyze
                          your skills, experience, projects and career fit.
                        </p>

                        <label className="mx-auto mt-7 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] transition hover:scale-[1.02]">
                          <Upload className="h-4 w-4" />
                          Choose Resume
                          <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) =>
                              handleFile(e.target.files?.[0] ?? null)
                            }
                          />
                        </label>

                        <p className="mt-4 text-center font-mono text-[10px] text-slate-500">
                          PDF, DOC or DOCX • Maximum 10MB
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                          <FileText className="h-6 w-6" />
                        </div>

                        <div className="mt-5 text-center">
                          <p className="break-all text-sm font-bold text-white">
                            {file.name}
                          </p>

                          <p className="mt-1 font-mono text-[10px] text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Check className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white">
                              Resume ready
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-500">
                              Ready to be analyzed by Revio.
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isAnalyzing}
                            aria-label="Remove selected resume"
                            onClick={resetAnalyzer}
                            className="text-slate-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={analyzeResume}
                          disabled={isAnalyzing}
                          className="mx-auto mt-7 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-7 py-3 text-xs font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analyzing resume...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Analyze my career
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>

                        {isAnalyzing && (
                          <p className="mx-auto mt-4 max-w-md text-center text-[10px] leading-relaxed text-slate-500">
                            Revio is extracting your resume and generating your
                            career intelligence report. This can take a little
                            while.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* =================================================
                  ANALYSIS AREAS
              ================================================= */}

              <section className="mx-auto mt-10 max-w-4xl">
                <div className="grid gap-3 sm:grid-cols-3">
                  <AnalysisFeature
                    icon={<Target className="h-4 w-4" />}
                    title="Skills"
                    description="Technical and professional capabilities"
                  />

                  <AnalysisFeature
                    icon={<GraduationCap className="h-4 w-4" />}
                    title="Education"
                    description="Academic background and qualifications"
                  />

                  <AnalysisFeature
                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                    title="Projects"
                    description="Work, contribution and technologies"
                  />
                </div>
              </section>

              <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-center text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Your resume is processed securely for your analysis.
              </div>
            </>
          )}

          {/* ==================================================
              RESULTS
          ================================================== */}

          {result && (
            <AnalysisResults result={result} onAnalyzeAnother={resetAnalyzer} />
          )}
        </section>
      </div>
    </main>
  );
}

/* =============================================================
   RESULTS
============================================================= */

function AnalysisResults({
  result,
  onAnalyzeAnother,
}: {
  result: AnalysisResult;
  onAnalyzeAnother: () => void;
}) {
  return (
    <section className="mt-10">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            <Check className="h-3 w-3" />
            Analysis Complete
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Your resume intelligence report.
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            Revio analyzed the information extracted from your resume.
          </p>
        </div>

        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          <Upload className="h-3.5 w-3.5" />
          Analyze another resume
        </button>
      </div>

      {/* ======================================================
          CANDIDATE
      ====================================================== */}

      {result.candidate && (
        <section className="mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
              <UserRound className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Candidate
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                {result.candidate.name || "Candidate name not identified"}
              </h2>

              {result.candidate.headline && (
                <p className="mt-1 text-sm text-slate-400">
                  {result.candidate.headline}
                </p>
              )}

              {result.candidate.location && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {result.candidate.location}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          SCORE + PROFILE
      ====================================================== */}

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <OverallScore score={result.overallScore} />

        <CandidateProfile result={result} />
      </div>

      {/* ======================================================
          SCORE BREAKDOWN
      ====================================================== */}

      {result.scores && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {result.scores.atsCompatibility !== undefined && (
            <ScoreCard
              title="ATS Compatibility"
              score={result.scores.atsCompatibility}
              icon={<ShieldCheck className="h-4 w-4" />}
            />
          )}

          {result.scores.contentQuality !== undefined && (
            <ScoreCard
              title="Content Quality"
              score={result.scores.contentQuality}
              icon={<FileText className="h-4 w-4" />}
            />
          )}

          {result.scores.skillsStrength !== undefined && (
            <ScoreCard
              title="Skills Strength"
              score={result.scores.skillsStrength}
              icon={<Zap className="h-4 w-4" />}
            />
          )}

          {result.scores.experience !== undefined && (
            <ScoreCard
              title="Experience"
              score={result.scores.experience}
              icon={<BriefcaseBusiness className="h-4 w-4" />}
            />
          )}

          {result.scores.educationMatch !== undefined && (
            <ScoreCard
              title="Education Match"
              score={result.scores.educationMatch}
              icon={<GraduationCap className="h-4 w-4" />}
            />
          )}
        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      {result.summary && (
        <section className="mt-10 rounded-[28px] border border-white/10 bg-slate-900/60 p-7">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Resume Intelligence
          </p>

          <h2 className="mt-1 text-xl font-black text-white">
            What Revio understands
          </h2>

          <p className="mt-4 max-w-5xl text-sm leading-7 text-slate-400">
            {result.summary}
          </p>
        </section>
      )}

      {/* ======================================================
          PROJECTS
      ====================================================== */}

      {result.projects && result.projects.length > 0 && (
        <section className="mt-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Project Intelligence
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
              Projects you have worked on
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
              Revio identified the projects in your resume and analyzed what
              they do, your contribution, technologies and measurable impact.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {result.projects.map((project, index) => (
              <ProjectCard
                key={`${project.name}-${index}`}
                project={project}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          EXPERIENCE DETAILS
      ====================================================== */}

      {result.experienceDetails && result.experienceDetails.length > 0 && (
        <section className="mt-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Experience Intelligence
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
              Your professional experience
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {result.experienceDetails.map((experience, index) => (
              <article
                key={`${experience.company}-${experience.role}-${index}`}
                className="rounded-[26px] border border-white/10 bg-slate-900/60 p-6"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                      {experience.company}
                    </p>

                    <h3 className="mt-1 text-lg font-black text-white">
                      {experience.role}
                    </h3>
                  </div>

                  {experience.duration && (
                    <span className="h-fit rounded-lg border border-white/10 bg-slate-950/50 px-3 py-1.5 text-[10px] font-medium text-slate-400">
                      {experience.duration}
                    </span>
                  )}
                </div>

                {experience.description && (
                  <p className="mt-5 text-sm leading-7 text-slate-400">
                    {experience.description}
                  </p>
                )}

                {experience.responsibilities &&
                  experience.responsibilities.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        Responsibilities
                      </p>

                      <div className="mt-3 space-y-2">
                        {experience.responsibilities.map((item, itemIndex) => (
                          <div
                            key={`${item}-${itemIndex}`}
                            className="flex gap-3 rounded-xl border border-white/[0.06] bg-slate-950/40 p-3"
                          >
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />

                            <p className="text-xs leading-6 text-slate-400">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {experience.achievements &&
                  experience.achievements.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                        Achievements
                      </p>

                      <div className="mt-3 space-y-2">
                        {experience.achievements.map((item, itemIndex) => (
                          <div
                            key={`${item}-${itemIndex}`}
                            className="flex gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-3"
                          >
                            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />

                            <p className="text-xs leading-6 text-slate-400">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          ATS ANALYSIS
      ====================================================== */}

      {result.atsAnalysis && (
        <section className="mt-12">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  ATS Intelligence
                </p>

                <h2 className="mt-1 text-lg font-black text-white">
                  How your resume performs with ATS systems
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {result.atsAnalysis.keywordOptimization && (
                <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Keyword Optimization
                  </p>

                  <p className="mt-3 text-xs leading-6 text-slate-400">
                    {result.atsAnalysis.keywordOptimization}
                  </p>
                </div>
              )}

              {result.atsAnalysis.formatting && (
                <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Formatting
                  </p>

                  <p className="mt-3 text-xs leading-6 text-slate-400">
                    {result.atsAnalysis.formatting}
                  </p>
                </div>
              )}

              {result.atsAnalysis.sectionStructure && (
                <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Section Structure
                  </p>

                  <p className="mt-3 text-xs leading-6 text-slate-400">
                    {result.atsAnalysis.sectionStructure}
                  </p>
                </div>
              )}

              {result.atsAnalysis.readability && (
                <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    Readability
                  </p>

                  <p className="mt-3 text-xs leading-6 text-slate-400">
                    {result.atsAnalysis.readability}
                  </p>
                </div>
              )}
            </div>

            {result.atsAnalysis.issues &&
              result.atsAnalysis.issues.length > 0 && (
                <div className="mt-6">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    ATS Issues
                  </p>

                  <div className="mt-3 space-y-2">
                    {result.atsAnalysis.issues.map((issue, index) => (
                      <div
                        key={`${issue}-${index}`}
                        className="flex gap-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-3"
                      >
                        <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />

                        <p className="text-xs leading-6 text-slate-400">
                          {issue}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </section>
      )}

      {/* ======================================================
          STRENGTHS + WEAKNESSES
      ====================================================== */}

      {result.strengths?.length || result.weaknesses?.length ? (
        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          {result.strengths && result.strengths.length > 0 && (
            <InsightCard
              title="Resume strengths"
              subtitle="What is working well in your resume"
              icon={<TrendingUp className="h-5 w-5" />}
              items={result.strengths}
              type="positive"
            />
          )}

          {result.weaknesses && result.weaknesses.length > 0 && (
            <InsightCard
              title="Areas to improve"
              subtitle="What may be limiting your resume"
              icon={<CircleAlert className="h-5 w-5" />}
              items={result.weaknesses}
              type="warning"
            />
          )}
        </section>
      ) : null}

      {/* ======================================================
          SUGGESTIONS
      ====================================================== */}

      {result.suggestions && result.suggestions.length > 0 && (
        <section className="mt-12">
          <div className="rounded-[28px] border border-amber-500/15 bg-slate-900/60 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
                <Lightbulb className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Improvement Plan
                </p>

                <h2 className="mt-1 text-lg font-black text-white">
                  Recommended improvements
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={`${suggestion}-${index}`}
                  className="flex gap-3 rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-[10px] font-black text-amber-300">
                    {index + 1}
                  </span>

                  <p className="text-xs leading-6 text-slate-400">
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          RECOMMENDED ROLES
      ====================================================== */}

      {result.recommendedRoles && result.recommendedRoles.length > 0 && (
        <section className="mt-12">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Career Intelligence
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
            Roles you're best suited for
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Career recommendations generated from your actual resume.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {result.recommendedRoles.map((role, index) => (
              <RoleCard
                key={`${role.role}-${index}`}
                {...role}
                match={role.match}
              />
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          JOBS
      ====================================================== */}

      {result.jobs && result.jobs.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Opportunity Finder
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                Jobs you can target
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                Opportunities matched against your analyzed profile.
              </p>
            </div>

            <button
              type="button"
              className="hidden items-center gap-1 text-xs font-semibold text-cyan-300 sm:flex"
            >
              View all jobs
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {result.jobs.map((job, index) => (
              <JobCard key={`${job.role}-${index}`} {...job} />
            ))}
          </div>
        </section>
      )}

      {/* ======================================================
          SKILL GAPS
      ====================================================== */}

      {result.skillGaps && result.skillGaps.length > 0 && (
        <section className="mt-12">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <CircleAlert className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Skills to strengthen
                </p>

                <p className="text-[10px] text-slate-500">
                  Areas that could improve your career opportunities
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {result.skillGaps.map((skill, index) => (
                <div key={`${skill.name}-${index}`}>
                  <SkillGap name={skill.name} level={skill.level} />

                  {skill.reason && (
                    <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
                      {skill.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          NEXT CAREER MOVE
      ====================================================== */}

      {result.nextCareerMove && (
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-[28px] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-950/90 p-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-[80px]" />

            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                <WandSparkles className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-xl font-black text-white">
                {result.nextCareerMove.title || "Your next career move"}
              </h3>

              {result.nextCareerMove.description && (
                <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-400">
                  {result.nextCareerMove.description}
                </p>
              )}

              <Link
                href="/ai"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:scale-[1.02]"
              >
                Build my roadmap
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <section className="mt-10 mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 px-6 py-5 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </div>

          <div>
            <p className="text-xs font-bold text-white">
              Ready to improve your resume?
            </p>

            <p className="text-[10px] text-slate-500">
              Turn your analysis into actionable resume improvements.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href="/ai"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300"
          >
            <WandSparkles className="h-3.5 w-3.5 text-cyan-400" />
            Improve Resume
          </Link>

          <Link
            href="/resume/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Create New Resume
          </Link>
        </div>
      </section>
    </section>
  );
}

/* =============================================================
   OVERALL SCORE
============================================================= */

function OverallScore({ score }: { score: number }) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);

  const scoreLabel =
    safeScore >= 85
      ? "Excellent"
      : safeScore >= 75
        ? "Strong"
        : safeScore >= 60
          ? "Good"
          : safeScore >= 45
            ? "Needs improvement"
            : "Needs significant improvement";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950/90 p-7">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/20 blur-[70px]" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Resume Health
            </p>

            <h2 className="mt-1 text-base font-bold text-white">
              Overall Score
            </h2>
          </div>

          <Sparkles className="h-5 w-5 text-cyan-400" />
        </div>

        <div className="mt-8 flex items-end gap-2">
          <span className="text-6xl font-black tracking-tight text-white">
            {safeScore}
          </span>

          <span className="mb-2 text-sm font-bold text-slate-500">/100</span>
        </div>

        <div className="mt-2">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
            {scoreLabel}
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-700"
            style={{
              width: `${safeScore}%`,
            }}
          />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Overall score calculated from ATS compatibility, content quality,
          skills, experience and education.
        </p>
      </div>
    </div>
  );
}

/* =============================================================
   CANDIDATE PROFILE
============================================================= */

function CandidateProfile({ result }: { result: AnalysisResult }) {
  const profileItems = [
    result.profile?.education,
    result.profile?.experience,
    result.profile?.careerFocus,
  ].filter(Boolean) as ProfileItemData[];

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Candidate Profile
          </p>

          <h2 className="mt-1 text-base font-bold text-white">
            What Revio found in your resume
          </h2>
        </div>

        <UserRound className="h-5 w-5 text-slate-500" />
      </div>

      {profileItems.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {profileItems.map((item, index) => (
            <ProfileItem
              key={`${item.label}-${index}`}
              label={item.label}
              value={item.value}
              detail={item.detail || ""}
              icon={
                item.label.toLowerCase().includes("education") ? (
                  <GraduationCap />
                ) : item.label.toLowerCase().includes("experience") ? (
                  <BriefcaseBusiness />
                ) : (
                  <Target />
                )
              }
            />
          ))}
        </div>
      )}

      {result.skills && result.skills.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Detected Skills
          </p>

          <div className="flex flex-wrap gap-2">
            {result.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 text-[10px] font-medium text-slate-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {!profileItems.length &&
        (!result.skills || result.skills.length === 0) && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/30 p-6 text-center">
            <p className="text-xs text-slate-500">
              No profile information was returned by the analyzer.
            </p>
          </div>
        )}
    </div>
  );
}

/* =============================================================
   PROJECT CARD
============================================================= */

function ProjectCard({
  project,
  index,
}: {
  project: ProjectData;
  index: number;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-slate-900/80">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-600/10 blur-[70px]" />

      <div className="relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
              <span className="text-sm font-black">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Project
              </p>

              <h3 className="mt-1 text-lg font-black text-white">
                {project.name}
              </h3>
            </div>
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:max-w-sm sm:justify-end">
              {project.technologies.map((technology, techIndex) => (
                <span
                  key={`${technology}-${techIndex}`}
                  className="rounded-md border border-cyan-400/10 bg-cyan-400/[0.05] px-2 py-1 text-[9px] font-medium text-cyan-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}
        </div>

        {project.description && (
          <div className="mt-6">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
              What the project does
            </p>

            <p className="mt-2 max-w-5xl text-sm leading-7 text-slate-300">
              {project.description}
            </p>
          </div>
        )}

        {project.contribution && (
          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                <WandSparkles className="h-3.5 w-3.5" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Candidate contribution
              </p>
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              {project.contribution}
            </p>
          </div>
        )}

        {project.impact && (
          <div className="mt-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Target className="h-3.5 w-3.5" />
              </div>

              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Impact / Result
              </p>
            </div>

            <p className="mt-3 text-xs leading-6 text-slate-400">
              {project.impact}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* =============================================================
   INSIGHT CARD
============================================================= */

function InsightCard({
  title,
  subtitle,
  icon,
  items,
  type,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: string[];
  type: "positive" | "warning";
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            type === "positive"
              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border border-amber-500/20 bg-amber-500/10 text-amber-400"
          }`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-base font-black text-white">{title}</h2>

          <p className="mt-0.5 text-[10px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex gap-3 rounded-xl border border-white/[0.06] bg-slate-950/40 p-3"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-black ${
                type === "positive"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {index + 1}
            </span>

            <p className="text-xs leading-6 text-slate-400">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =============================================================
   NAV ITEM
============================================================= */

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
        active
          ? "border border-indigo-500/30 bg-indigo-500/10 text-white"
          : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <span
        className={
          active
            ? "text-cyan-400"
            : "text-slate-500 transition group-hover:text-cyan-400"
        }
      >
        {icon}
      </span>

      {label}
    </Link>
  );
}

/* =============================================================
   ANALYSIS FEATURE
============================================================= */

function AnalysisFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-slate-900/40 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-cyan-300">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-white">{title}</p>

        <p className="mt-0.5 text-[10px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

/* =============================================================
   PROFILE ITEM
============================================================= */

function ProfileItem({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <span className="h-4 w-4">{icon}</span>

        <span className="text-[9px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-black text-white">{value}</p>

      {detail && <p className="mt-1 text-[10px] text-slate-500">{detail}</p>}
    </div>
  );
}

/* =============================================================
   SCORE CARD
============================================================= */

function ScoreCard({
  title,
  score,
  icon,
}: {
  title: string;
  score: number;
  icon: React.ReactNode;
}) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <span className="text-cyan-400">{icon}</span>
      </div>

      <div className="mt-4 flex items-end gap-1">
        <span className="text-2xl font-black text-white">{safeScore}</span>

        <span className="mb-0.5 text-[10px] text-slate-600">/100</span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
          style={{
            width: `${safeScore}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =============================================================
   ROLE CARD
============================================================= */

function RoleCard({ rank, role, match, description, skills }: RoleData) {
  const safeMatch = Math.min(Math.max(Number(match) || 0, 0), 100);

  return (
    <div className="group rounded-[26px] border border-white/10 bg-slate-900/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          {rank && (
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold tracking-wider text-emerald-400">
              {rank}
            </span>
          )}

          <h3 className="mt-3 text-base font-bold text-white">{role}</h3>
        </div>

        <div className="text-right">
          <p className="text-xl font-black text-cyan-300">{safeMatch}%</p>

          <p className="text-[9px] uppercase tracking-wider text-slate-500">
            match
          </p>
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      )}

      {skills && skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-md border border-white/[0.07] bg-slate-950/60 px-2 py-1 text-[9px] text-slate-400"
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 transition group-hover:text-white"
      >
        View role analysis
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}

/* =============================================================
   JOB CARD
============================================================= */

function JobCard({ role, company, location, match }: JobData) {
  const safeMatch = Math.min(Math.max(Number(match) || 0, 0), 100);

  return (
    <div className="group flex flex-col gap-5 rounded-[22px] border border-white/10 bg-slate-900/60 p-5 transition hover:border-indigo-500/30 sm:flex-row sm:items-center">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-300">
        <BriefcaseBusiness className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-white">{role}</h3>

        <p className="mt-1 text-xs text-slate-400">{company}</p>

        <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
          <MapPin className="h-3 w-3" />
          {location}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-lg font-black text-emerald-400">{safeMatch}%</p>

          <p className="text-[9px] uppercase tracking-wider text-slate-500">
            profile match
          </p>
        </div>

        <button
          type="button"
          aria-label={`Open ${role}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 transition group-hover:border-cyan-400/30 group-hover:text-cyan-300"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* =============================================================
   SKILL GAP
============================================================= */

function SkillGap({ name, level }: SkillGapData) {
  const safeLevel = Math.min(Math.max(Number(level) || 0, 0), 100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">{name}</span>

        <span className="font-mono text-[10px] text-slate-500">
          {safeLevel}%
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
          style={{
            width: `${safeLevel}%`,
          }}
        />
      </div>
    </div>
  );
}
