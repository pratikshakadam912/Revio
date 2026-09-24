import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  FileText,
  LayoutTemplate,
  Plus,
  Settings,
  Sparkles,
  Target,
  Upload,
  UserRound,
  WandSparkles,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ============================================================
   HELPERS
============================================================ */

function getResumeName(fileUrl: string | null | undefined): string {
  if (!fileUrl) {
    return "Untitled Resume";
  }

  try {
    const pathname = new URL(fileUrl).pathname;
    const filename = decodeURIComponent(
      pathname.split("/").filter(Boolean).pop() || "",
    );

    if (!filename) {
      return "Untitled Resume";
    }

    return (
      filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim() || "Untitled Resume"
    );
  } catch {
    return "Untitled Resume";
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "RV";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getScoreLabel(score: number | null | undefined) {
  if (score === null || score === undefined) {
    return {
      label: "Not analyzed",
      className: "border-white/10 bg-white/[0.04] text-slate-400",
    };
  }

  if (score >= 85) {
    return {
      label: "Strong",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      className: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    };
  }

  if (score >= 50) {
    return {
      label: "Needs work",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    };
  }

  return {
    label: "Needs improvement",
    className: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getRelativeTime(date: Date | null | undefined): string {
  if (!date) {
    return "Recently";
  }

  const now = Date.now();
  const timestamp = date.getTime();
  const diff = Math.max(0, now - timestamp);

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date);
}

/* ============================================================
   DASHBOARD
============================================================ */

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0D14] px-6 text-white">
        <div className="text-center">
          <h1 className="text-xl font-bold">Please sign in</h1>

          <p className="mt-2 text-sm text-slate-400">
            Your Revio workspace requires an active session.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     LOAD REAL USER DATA
  ============================================================ */

  const [user, resumes, analyses] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
        email: true,
      },
    }),

    prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.resumeAnalysis.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  /* ============================================================
     ANALYSIS LOOKUP
  ============================================================ */

  const latestAnalysisByResume = new Map<string, (typeof analyses)[number]>();

  for (const analysis of analyses) {
    if (!latestAnalysisByResume.has(analysis.resumeId)) {
      latestAnalysisByResume.set(analysis.resumeId, analysis);
    }
  }

  /* ============================================================
     RESUME DATA
  ============================================================ */

  const resumeCards = resumes.slice(0, 5).map((resume) => {
    const latestAnalysis = latestAnalysisByResume.get(resume.id);

    const score = latestAnalysis?.atsScore ?? resume.atsScore ?? null;

    return {
      id: resume.id,
      name: getResumeName(resume.fileUrl),
      score,
      status: getScoreLabel(score),
      updatedAt: resume.updatedAt,
      analysisStatus: latestAnalysis?.status ?? null,
    };
  });

  /* ============================================================
     METRICS
  ============================================================ */

  const analyzedResumeCount = resumes.filter((resume) => {
    const analysis = latestAnalysisByResume.get(resume.id);

    return analysis?.status === "COMPLETED" || resume.atsScore !== null;
  }).length;

  const completedAnalyses = analyses.filter(
    (analysis) => analysis.status === "COMPLETED",
  );

  const highestScore = resumes.reduce<number | null>((highest, resume) => {
    const analysis = latestAnalysisByResume.get(resume.id);

    const score = analysis?.atsScore ?? resume.atsScore ?? null;

    if (score === null || score === undefined) {
      return highest;
    }

    if (highest === null) {
      return score;
    }

    return Math.max(highest, score);
  }, null);

  /* ============================================================
     RECENT ACTIVITY
  ============================================================ */

  const recentAnalyses = analyses.slice(0, 4);

  const recentActivity = recentAnalyses.map((analysis) => {
    const resume = resumes.find((item) => item.id === analysis.resumeId);

    const resumeName = resume ? getResumeName(resume.fileUrl) : "Resume";

    if (analysis.status === "COMPLETED") {
      return {
        id: analysis.id,
        title: "Resume analyzed",
        description: `${resumeName} analysis completed`,
        time: getRelativeTime(analysis.createdAt),
        icon: BarChart3,
      };
    }

    if (analysis.status === "FAILED") {
      return {
        id: analysis.id,
        title: "Analysis failed",
        description: `${resumeName} could not be analyzed`,
        time: getRelativeTime(analysis.createdAt),
        icon: Target,
      };
    }

    return {
      id: analysis.id,
      title: "Analysis processing",
      description: `${resumeName} is being analyzed`,
      time: getRelativeTime(analysis.createdAt),
      icon: Sparkles,
    };
  });

  const displayName =
    user?.name ||
    session.user.name ||
    user?.email?.split("@")[0] ||
    session.user.email?.split("@")[0] ||
    "there";

  const initials = getInitials(displayName);

  /* ============================================================
     UI
  ============================================================ */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[300px] -top-[280px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        <div className="absolute -right-[300px] top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        <div className="absolute left-1/2 top-[45%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-950/30 blur-[170px]" />

        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* ========================================================
          APP SHELL
      ======================================================== */}

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        {/* ======================================================
            SIDEBAR
        ====================================================== */}

        <aside className="hidden w-[260px] shrink-0 border-r border-white/[0.08] bg-slate-950/60 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 px-2 text-lg font-black tracking-tight text-white"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.45)]">
              <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/30 blur-sm" />
              <Sparkles className="relative z-10 h-4 w-4" />
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
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm"
            >
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              Dashboard
            </Link>

            <Link
              href="/resume"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <FileText className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
              My Resumes
            </Link>

            <Link
              href="/templates"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <LayoutTemplate className="h-4 w-4 text-slate-500 group-hover:text-indigo-400" />
              Templates
            </Link>

            <Link
              href="/analyzer"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <Target className="h-4 w-4 text-slate-500 group-hover:text-emerald-400" />
              Resume Analyzer
            </Link>
          </nav>

          <div className="mt-8 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Intelligence Tools
            </p>
          </div>

          <nav className="mt-3 space-y-1">
            <Link
              href="/ai"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <WandSparkles className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
              AI Resume Tools
            </Link>

            <Link
              href="/settings"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <Settings className="h-4 w-4 text-slate-500 group-hover:text-indigo-400" />
              Settings
            </Link>
          </nav>

          {/* ====================================================
              WORKSPACE STATUS
          ==================================================== */}

          <div className="mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-inner">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-600/20 blur-[40px]" />

              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-bold text-white tracking-tight">
                  Resume Intelligence
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                  Analyze, edit, design and manage your resumes from one
                  workspace.
                </p>

                <Link
                  href="/analyzer"
                  className="mt-3.5 flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 transition-colors hover:text-white"
                >
                  <span>Analyze a resume</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Profile */}

            <Link
              href="/settings"
              className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/60 px-3 py-2.5 transition hover:border-white/10 hover:bg-slate-900/60"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-950/60 text-cyan-300 font-bold text-xs">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-200">
                  {displayName}
                </p>

                <p className="truncate text-[10px] text-slate-500 font-mono">
                  {user?.email || session.user.email || "Revio account"}
                </p>
              </div>
            </Link>
          </div>
        </aside>

        {/* ======================================================
            MAIN
        ====================================================== */}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          {/* HEADER */}

          <header className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white lg:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </span>
              Revio<span className="text-cyan-400">.</span>
            </Link>

            <div className="hidden lg:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Career Intelligence Platform
              </p>

              <p className="mt-0.5 text-sm font-bold text-white tracking-tight">
                Your Resume Workspace
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 backdrop-blur-md sm:flex">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />

                <span className="text-xs text-slate-400">
                  Resume Intelligence
                </span>

                <span className="text-xs font-bold font-mono text-cyan-300">
                  ACTIVE
                </span>
              </div>

              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition hover:border-indigo-500/40 hover:text-white"
              >
                <UserRound className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {/* ====================================================
              WELCOME
          ==================================================== */}

          <div className="mt-10">
            <p className="text-sm font-semibold text-cyan-400">
              Welcome back, {displayName.split(" ")[0]}.
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Build a resume that works harder.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Create a new resume, analyze an existing one, or continue working
              on your saved documents.
            </p>
          </div>

          {/* ====================================================
              PRIMARY ACTIONS
          ==================================================== */}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/resume/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 text-xs font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
            >
              <Plus className="h-4 w-4" />

              <span>Create new resume</span>

              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/analyzer"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-slate-900/70 px-5 text-xs font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
            >
              <Upload className="h-3.5 w-3.5 text-cyan-400" />

              <span>Analyze existing resume</span>

              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-400" />
            </Link>
          </div>

          {/* ====================================================
              REAL METRICS
          ==================================================== */}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {/* Highest ATS */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/15 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Highest ATS Score
                  </p>

                  {highestScore !== null && (
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-[10px] font-mono font-bold ${getScoreLabel(highestScore).className}`}
                    >
                      {getScoreLabel(highestScore).label.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    {highestScore ?? "—"}
                  </span>

                  <span className="text-xs font-bold text-slate-500">/100</span>
                </div>

                {highestScore !== null ? (
                  <>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
                        style={{
                          width: `${Math.min(Math.max(highestScore, 0), 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-cyan-400" />
                      Based on your latest completed resume analysis.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    Analyze a resume to see your ATS score here.
                  </p>
                )}
              </div>
            </div>

            {/* Resume count */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 bottom-[-60px] h-48 w-48 rounded-full bg-cyan-500/15 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    My Resumes
                  </p>

                  <FileText className="h-4 w-4 text-cyan-400" />
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    {resumes.length}
                  </span>

                  <span className="text-xs font-bold text-slate-500">
                    saved
                  </span>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {analyzedResumeCount}{" "}
                  {analyzedResumeCount === 1 ? "resume has" : "resumes have"}{" "}
                  been analyzed.
                </p>
              </div>
            </div>

            {/* Analysis count */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-2xl">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Resume Analyses
                  </p>

                  <Target className="h-4 w-4 text-indigo-400" />
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    {completedAnalyses.length}
                  </span>

                  <span className="text-xs font-bold text-slate-500">
                    completed
                  </span>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Analysis history from your Revio workspace.
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              RESUMES
          ==================================================== */}

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Managed Documents
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                  My Resumes
                </h2>
              </div>

              <Link
                href="/resume"
                className="group flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-cyan-300"
              >
                <span>View all resumes</span>

                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {resumeCards.length > 0 ? (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {resumeCards.map((resume) => (
                  <Link
                    href={`/resume/${resume.id}`}
                    key={resume.id}
                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  >
                    {/* Resume preview */}

                    <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] border border-white/[0.06] bg-slate-950/80">
                      <div className="h-[185px] w-[140px] rounded-lg border border-white/10 bg-slate-900 p-3 shadow-md transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="border-b border-white/10 pb-2">
                          <div className="h-2 w-16 rounded bg-slate-200" />

                          <div className="mt-1 h-1.5 w-24 rounded bg-slate-600" />
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="h-1.5 w-10 rounded bg-indigo-400" />

                          <div className="h-1 w-full rounded bg-slate-700" />

                          <div className="h-1 w-5/6 rounded bg-slate-700" />

                          <div className="h-1 w-4/6 rounded bg-slate-700" />
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="h-1.5 w-12 rounded bg-cyan-400" />

                          <div className="h-1 w-full rounded bg-slate-700" />

                          <div className="h-1 w-4/5 rounded bg-slate-700" />
                        </div>
                      </div>

                      {resume.score !== null ? (
                        <div className="absolute right-3 top-3 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                          {resume.score} ATS
                        </div>
                      ) : (
                        <div className="absolute right-3 top-3 rounded-md border border-white/10 bg-slate-900/90 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400">
                          NOT ANALYZED
                        </div>
                      )}
                    </div>

                    {/* Metadata */}

                    <div className="px-2 pb-2 pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-white tracking-tight">
                            {resume.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {resume.analysisStatus === "COMPLETED"
                              ? "Analysis available"
                              : resume.analysisStatus === "PROCESSING"
                                ? "Analysis processing"
                                : "Ready to analyze"}
                          </p>
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 transition group-hover:border-indigo-500/30 group-hover:bg-indigo-600/20 group-hover:text-cyan-300">
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span
                          className={`rounded border px-1.5 py-0.5 text-[9px] font-mono ${resume.status.className}`}
                        >
                          {resume.status.label}
                        </span>

                        <span className="rounded border border-white/5 bg-slate-950/40 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                          Resume
                        </span>
                      </div>

                      <p className="mt-3 text-[10px] font-mono text-slate-500">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* Create card */}

                <Link
                  href="/resume/new"
                  className="group relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-slate-900/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-indigo-950/20"
                >
                  <div className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                      <Plus className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-white tracking-tight">
                      Create new resume
                    </h3>

                    <p className="mx-auto mt-1 max-w-[210px] text-xs leading-relaxed text-slate-400">
                      Upload your CV, choose a template and build your next
                      resume.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                      <span>Start builder</span>

                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              /* Empty state */

              <div className="mt-6 rounded-[28px] border border-dashed border-white/10 bg-slate-900/40 p-10 text-center backdrop-blur-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
                  <FileText className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">
                  No resumes yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                  Create your first resume or upload an existing CV to start
                  analyzing and improving it.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/resume/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    Create resume
                  </Link>

                  <Link
                    href="/analyzer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-300 transition hover:border-cyan-500/30 hover:text-white"
                  >
                    <Upload className="h-4 w-4" />
                    Analyze CV
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* ====================================================
              ACTIVITY + NEXT ACTION
          ==================================================== */}

          <div className="mt-12 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            {/* Career workspace */}

            <div className="relative overflow-hidden rounded-[28px] border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-950/90 p-7 shadow-xl backdrop-blur-2xl sm:p-8">
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-indigo-600/20 blur-[80px]" />

              <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 text-cyan-300 shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">
                      Your Resume Workspace
                    </p>

                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">
                      Build • Analyze • Improve
                    </p>
                  </div>
                </div>

                <h3 className="mt-6 max-w-2xl text-2xl font-black leading-tight tracking-tight text-white">
                  {resumes.length === 0
                    ? "Start by creating or uploading your first resume."
                    : highestScore === null
                      ? "Your resumes are ready for their first analysis."
                      : `Your highest current ATS score is ${highestScore}/100.`}
                </h3>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  {resumes.length === 0
                    ? "Create a resume from scratch or upload an existing CV. You can then choose a template, edit it and analyze it."
                    : "Continue working on your saved resumes or run a fresh analysis on the resume you want to improve."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/resume/new"
                    className="group inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />

                    <span>Create resume</span>

                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/analyzer"
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white"
                  >
                    <Target className="h-3.5 w-3.5" />

                    <span>Analyze resume</span>

                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Activity */}

            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7 backdrop-blur-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Workspace
                  </p>

                  <h3 className="text-base font-bold text-white tracking-tight">
                    Recent Activity
                  </h3>
                </div>

                <BarChart3 className="h-4 w-4 text-slate-500" />
              </div>

              {recentActivity.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {recentActivity.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.id} className="flex items-start gap-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 text-cyan-400">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-white">
                            {item.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {item.description}
                          </p>

                          <p className="mt-1 text-[10px] font-mono text-slate-500">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-500">
                    <BarChart3 className="h-4 w-4" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-slate-300">
                    No activity yet
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Your resume analysis activity will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ====================================================
              SYSTEM STATUS
          ==================================================== */}

          <div className="mt-10 mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 px-6 py-4 backdrop-blur-xl sm:flex-row sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/50 text-cyan-300">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200">
                  Revio Workspace Online
                </p>

                <p className="text-[10px] text-slate-500">
                  Your resumes and analysis data are connected to your account.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Data Sync
              </span>

              <span>AI Ready</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
