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
import { redirect } from "next/navigation";
import { getOrCreatePrismaUser } from "@/lib/auth/clerk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ============================================================
   HELPERS
============================================================ */

function getResumeName(fileUrl: string | null | undefined): string {
  if (!fileUrl) return "Untitled Resume";

  try {
    const pathname = new URL(fileUrl).pathname;
    const filename = decodeURIComponent(
      pathname.split("/").filter(Boolean).pop() || "",
    );

    if (!filename) return "Untitled Resume";

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

  if (!parts.length) return "RV";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getScoreLabel(score: number | null | undefined) {
  if (score === null || score === undefined) {
    return {
      label: "Not analyzed",
      className: "border-[#E7E5DC] bg-[#F1F0EA] text-[#858A83]",
    };
  }

  if (score >= 85) {
    return {
      label: "Strong",
      className: "border-[#BBD3C2] bg-[#EAF2EB] text-[#315E50]",
    };
  }

  if (score >= 70) {
    return {
      label: "Good",
      className: "border-[#C8DAD0] bg-[#EFF5F0] text-[#527A65]",
    };
  }

  if (score >= 50) {
    return {
      label: "Needs work",
      className: "border-[#E8D7B9] bg-[#F8F1E5] text-[#A47A42]",
    };
  }

  return {
    label: "Needs improvement",
    className: "border-[#E8C9BE] bg-[#F8ECE8] text-[#B97862]",
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getRelativeTime(date: Date | null | undefined): string {
  if (!date) return "Recently";

  const now = Date.now();
  const timestamp = date.getTime();
  const diff = Math.max(0, now - timestamp);

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(date);
}

/* ============================================================
   DASHBOARD
============================================================ */

export default async function DashboardPage() {
  const prismaUser = await getOrCreatePrismaUser();

  if (!prismaUser) {
    redirect("/sign-in");
  }

  /* ============================================================
     LOAD REAL USER DATA
  ============================================================ */

  const [user, resumes, analyses] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: prismaUser.id,
      },
      select: {
        name: true,
        email: true,
      },
    }),

    prisma.resume.findMany({
      where: {
        userId: prismaUser.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.resumeAnalysis.findMany({
      where: {
        userId: prismaUser.id,
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

    if (score === null || score === undefined) return highest;
    if (highest === null) return score;

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
    prismaUser.name ||
    user?.email?.split("@")[0] ||
    prismaUser.email.split("@")[0] ||
    "there";

  const profileEmail = user?.email || prismaUser.email;
  const initials = getInitials(displayName);

  /* ============================================================
     UI
  ============================================================ */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5EF] text-[#263B33] selection:bg-[#315E50] selection:text-white">
      {/* ========================================================
          BACKGROUND
      ======================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[280px] -top-[300px] h-[700px] w-[700px] rounded-full bg-[#719681]/15 blur-[140px]" />

        <div className="absolute -right-[260px] top-[8%] h-[650px] w-[650px] rounded-full bg-[#D9C5A2]/25 blur-[140px]" />

        <div className="absolute left-1/2 top-[48%] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-[#B97862]/[0.06] blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
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

        <aside className="hidden w-[260px] shrink-0 border-r border-[#E7E5DC] bg-white/55 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 px-2 text-lg font-black tracking-tight text-[#263B33]"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#315E50] to-[#719681] text-white shadow-[0_5px_15px_rgba(49,94,80,0.2)] transition-all duration-300 group-hover:-translate-y-0.5">
              <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/30 blur-sm" />
              <Sparkles className="relative z-10 h-4 w-4" />
            </span>

            <span>
              Revio<span className="text-[#719681]">.</span>
            </span>
          </Link>

          <div className="mt-9 px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A49C]">
              Workspace
            </p>
          </div>

          <nav className="mt-3 space-y-1">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 rounded-xl border border-[#DCE8DE] bg-[#EAF1EB] px-3.5 py-2.5 text-xs font-bold text-[#315E50] shadow-sm"
            >
              <BarChart3 className="h-4 w-4 text-[#315E50]" />
              Dashboard
            </Link>

            <Link
              href="/resume"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#777D76] transition-all hover:bg-white/80 hover:text-[#315E50]"
            >
              <FileText className="h-4 w-4 text-[#929990] group-hover:text-[#315E50]" />
              My Resumes
            </Link>

            <Link
              href="/templates"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#777D76] transition-all hover:bg-white/80 hover:text-[#315E50]"
            >
              <LayoutTemplate className="h-4 w-4 text-[#929990] group-hover:text-[#719681]" />
              Templates
            </Link>

            <Link
              href="/analyzer"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#777D76] transition-all hover:bg-white/80 hover:text-[#315E50]"
            >
              <Target className="h-4 w-4 text-[#929990] group-hover:text-[#719681]" />
              Resume Analyzer
            </Link>
          </nav>

          <div className="mt-8 px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#A0A49C]">
              Intelligence Tools
            </p>
          </div>

          <nav className="mt-3 space-y-1">
            <Link
              href="/ai"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#777D76] transition-all hover:bg-white/80 hover:text-[#315E50]"
            >
              <WandSparkles className="h-4 w-4 text-[#929990] group-hover:text-[#719681]" />
              AI Resume Tools
            </Link>

            <Link
              href="/settings"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#777D76] transition-all hover:bg-white/80 hover:text-[#315E50]"
            >
              <Settings className="h-4 w-4 text-[#929990] group-hover:text-[#315E50]" />
              Settings
            </Link>
          </nav>

          {/* WORKSPACE STATUS */}

          <div className="mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/90 bg-white/65 p-4 shadow-[0_10px_30px_rgba(38,59,51,0.05)] backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#719681]/15 blur-[40px]" />

              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#DCE8DE] bg-[#EAF1EB] text-[#315E50]">
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-bold tracking-tight text-[#263B33]">
                  Resume Intelligence
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-[#858A83]">
                  Analyze, edit, design and manage your resumes from one
                  workspace.
                </p>

                <Link
                  href="/analyzer"
                  className="mt-3.5 flex items-center gap-1.5 text-[10px] font-bold text-[#315E50] transition-colors hover:text-[#719681]"
                >
                  <span>Analyze a resume</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* PROFILE */}

            <Link
              href="/settings"
              className="mt-4 flex items-center gap-3 rounded-xl border border-[#E7E5DC] bg-white/55 px-3 py-2.5 transition hover:border-[#C9D9CC] hover:bg-white/85"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DCE8DE] bg-[#EAF1EB] text-xs font-bold text-[#315E50]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-[#263B33]">
                  {displayName}
                </p>

                <p className="truncate font-mono text-[10px] text-[#929990]">
                  {profileEmail}
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
              className="flex items-center gap-2.5 text-lg font-black tracking-tight text-[#263B33] lg:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#315E50] to-[#719681] text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </span>
              Revio<span className="text-[#719681]">.</span>
            </Link>

            <div className="hidden lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#929990]">
                Career Intelligence Platform
              </p>

              <p className="mt-0.5 text-sm font-bold tracking-tight text-[#263B33]">
                Your Resume Workspace
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-[#DCE8DE] bg-white/65 px-3.5 py-1.5 backdrop-blur-md sm:flex">
                <Zap className="h-3.5 w-3.5 text-[#719681]" />

                <span className="text-xs text-[#858A83]">
                  Resume Intelligence
                </span>

                <span className="font-mono text-xs font-bold text-[#315E50]">
                  ACTIVE
                </span>
              </div>

              <Link
                href="/settings"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E7E5DC] bg-white/65 text-[#777D76] transition hover:border-[#C9D9CC] hover:text-[#315E50]"
              >
                <UserRound className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {/* WELCOME */}

          <div className="mt-10">
            <p className="text-sm font-semibold text-[#719681]">
              Welcome back, {displayName.split(" ")[0]}.
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#263B33] sm:text-4xl">
              Build a resume that works harder.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#858A83]">
              Create a new resume, analyze an existing one, or continue working
              on your saved documents.
            </p>
          </div>

          {/* PRIMARY ACTIONS */}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/resume/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#315E50] to-[#527D68] px-5 text-xs font-bold text-white shadow-[0_8px_22px_rgba(49,94,80,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(49,94,80,0.28)]"
            >
              <Plus className="h-4 w-4" />
              <span>Create new resume</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/analyzer"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DCE8DE] bg-white/65 px-5 text-xs font-semibold text-[#52645A] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#BBD3C2] hover:bg-white/90 hover:text-[#315E50]"
            >
              <Upload className="h-3.5 w-3.5 text-[#719681]" />
              <span>Analyze existing resume</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#A0A49C] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#315E50]" />
            </Link>
          </div>

          {/* REAL METRICS */}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {/* HIGHEST ATS */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/65 p-6 shadow-[0_12px_35px_rgba(38,59,51,0.055)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(38,59,51,0.09)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#719681]/10 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#858A83]">
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
                  <span className="font-mono text-4xl font-black tracking-tight text-[#263B33]">
                    {highestScore ?? "—"}
                  </span>

                  <span className="text-xs font-bold text-[#A0A49C]">/100</span>
                </div>

                {highestScore !== null ? (
                  <>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EAEAE3]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#315E50] via-[#719681] to-[#D9C5A2]"
                        style={{
                          width: `${Math.min(Math.max(highestScore, 0), 100)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 flex items-center gap-1 text-xs text-[#858A83]">
                      <TrendingUp className="h-3 w-3 text-[#719681]" />
                      Based on your latest completed resume analysis.
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-xs leading-relaxed text-[#929990]">
                    Analyze a resume to see your ATS score here.
                  </p>
                )}
              </div>
            </div>

            {/* RESUME COUNT */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/65 p-6 shadow-[0_12px_35px_rgba(38,59,51,0.055)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(38,59,51,0.09)]">
              <div className="pointer-events-none absolute -right-16 bottom-[-60px] h-48 w-48 rounded-full bg-[#D9C5A2]/20 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#858A83]">
                    My Resumes
                  </p>

                  <FileText className="h-4 w-4 text-[#719681]" />
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-black tracking-tight text-[#263B33]">
                    {resumes.length}
                  </span>

                  <span className="text-xs font-bold text-[#A0A49C]">
                    saved
                  </span>
                </div>

                <p className="mt-4 text-xs text-[#858A83]">
                  {analyzedResumeCount}{" "}
                  {analyzedResumeCount === 1 ? "resume has" : "resumes have"}{" "}
                  been analyzed.
                </p>
              </div>
            </div>

            {/* ANALYSIS COUNT */}

            <div className="relative overflow-hidden rounded-[28px] border border-white/90 bg-white/65 p-6 shadow-[0_12px_35px_rgba(38,59,51,0.055)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(38,59,51,0.09)]">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#858A83]">
                    Resume Analyses
                  </p>

                  <Target className="h-4 w-4 text-[#B97862]" />
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-black tracking-tight text-[#263B33]">
                    {completedAnalyses.length}
                  </span>

                  <span className="text-xs font-bold text-[#A0A49C]">
                    completed
                  </span>
                </div>

                <p className="mt-4 text-xs text-[#858A83]">
                  Analysis history from your Revio workspace.
                </p>
              </div>
            </div>
          </div>

          {/* RESUMES */}

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#929990]">
                  Managed Documents
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#263B33]">
                  My Resumes
                </h2>
              </div>

              <Link
                href="/resume"
                className="group flex items-center gap-1.5 text-xs font-semibold text-[#858A83] transition hover:text-[#315E50]"
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
                    className="group relative overflow-hidden rounded-[28px] border border-white/90 bg-white/65 p-3.5 shadow-[0_10px_30px_rgba(38,59,51,0.045)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#C9D9CC] hover:shadow-[0_20px_45px_rgba(38,59,51,0.10)]"
                  >
                    {/* RESUME PREVIEW */}

                    <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] border border-[#E7E5DC] bg-[#F1F0EA]">
                      <div className="h-[185px] w-[140px] rounded-lg border border-[#E7E5DC] bg-white p-3 shadow-[0_8px_20px_rgba(38,59,51,0.10)] transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="border-b border-[#E7E5DC] pb-2">
                          <div className="h-2 w-16 rounded bg-[#315E50]" />
                          <div className="mt-1 h-1.5 w-24 rounded bg-[#D9DAD2]" />
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="h-1.5 w-10 rounded bg-[#719681]" />
                          <div className="h-1 w-full rounded bg-[#E1E2DB]" />
                          <div className="h-1 w-5/6 rounded bg-[#E1E2DB]" />
                          <div className="h-1 w-4/6 rounded bg-[#E1E2DB]" />
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <div className="h-1.5 w-12 rounded bg-[#B97862]" />
                          <div className="h-1 w-full rounded bg-[#E1E2DB]" />
                          <div className="h-1 w-4/5 rounded bg-[#E1E2DB]" />
                        </div>
                      </div>

                      {resume.score !== null ? (
                        <div className="absolute right-3 top-3 rounded-md border border-[#C8DAD0] bg-[#EAF2EB] px-2 py-0.5 font-mono text-[10px] font-bold text-[#315E50]">
                          {resume.score} ATS
                        </div>
                      ) : (
                        <div className="absolute right-3 top-3 rounded-md border border-[#E7E5DC] bg-white/90 px-2 py-0.5 font-mono text-[10px] font-bold text-[#929990]">
                          NOT ANALYZED
                        </div>
                      )}
                    </div>

                    {/* METADATA */}

                    <div className="px-2 pb-2 pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold tracking-tight text-[#263B33]">
                            {resume.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-[#858A83]">
                            {resume.analysisStatus === "COMPLETED"
                              ? "Analysis available"
                              : resume.analysisStatus === "PROCESSING"
                                ? "Analysis processing"
                                : "Ready to analyze"}
                          </p>
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#E7E5DC] bg-white/80 text-[#858A83] transition group-hover:border-[#C9D9CC] group-hover:bg-[#EAF1EB] group-hover:text-[#315E50]">
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span
                          className={`rounded border px-1.5 py-0.5 font-mono text-[9px] ${resume.status.className}`}
                        >
                          {resume.status.label}
                        </span>

                        <span className="rounded border border-[#E7E5DC] bg-[#F1F0EA] px-1.5 py-0.5 font-mono text-[9px] text-[#858A83]">
                          Resume
                        </span>
                      </div>

                      <p className="mt-3 font-mono text-[10px] text-[#A0A49C]">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* CREATE CARD */}

                <Link
                  href="/resume/new"
                  className="group relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-[#C9D9CC] bg-white/35 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#719681] hover:bg-white/65 hover:shadow-[0_15px_35px_rgba(38,59,51,0.07)]"
                >
                  <div className="p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DCE8DE] bg-[#EAF1EB] text-[#315E50] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(49,94,80,0.15)]">
                      <Plus className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-sm font-bold tracking-tight text-[#263B33]">
                      Create new resume
                    </h3>

                    <p className="mx-auto mt-1 max-w-[210px] text-xs leading-relaxed text-[#858A83]">
                      Upload your CV, choose a template and build your next
                      resume.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#315E50]">
                      <span>Start builder</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              /* EMPTY STATE */

              <div className="mt-6 rounded-[28px] border border-dashed border-[#D9DAD2] bg-white/45 p-10 text-center backdrop-blur-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#DCE8DE] bg-[#EAF1EB] text-[#315E50]">
                  <FileText className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#263B33]">
                  No resumes yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#858A83]">
                  Create your first resume or upload an existing CV to start
                  analyzing and improving it.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/resume/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#315E50] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#264C40]"
                  >
                    <Plus className="h-4 w-4" />
                    Create resume
                  </Link>

                  <Link
                    href="/analyzer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white/70 px-5 py-2.5 text-xs font-bold text-[#52645A] transition hover:border-[#BBD3C2] hover:text-[#315E50]"
                  >
                    <Upload className="h-4 w-4" />
                    Analyze CV
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* ACTIVITY + NEXT ACTION */}

          <div className="mt-12 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            {/* CAREER WORKSPACE */}

            <div className="relative overflow-hidden rounded-[28px] border border-[#DCE8DE] bg-gradient-to-br from-[#EAF1EB] via-white/80 to-[#F5EFE4] p-7 shadow-[0_12px_35px_rgba(38,59,51,0.06)] backdrop-blur-2xl sm:p-8">
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#719681]/15 blur-[80px]" />

              <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#D9C5A2]/25 blur-[80px]" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#C9D9CC] bg-white/75 text-[#315E50] shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold tracking-tight text-[#263B33]">
                      Your Resume Workspace
                    </p>

                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#719681]">
                      Build • Analyze • Improve
                    </p>
                  </div>
                </div>

                <h3 className="mt-6 max-w-2xl text-2xl font-black leading-tight tracking-tight text-[#263B33]">
                  {resumes.length === 0
                    ? "Start by creating or uploading your first resume."
                    : highestScore === null
                      ? "Your resumes are ready for their first analysis."
                      : `Your highest current ATS score is ${highestScore}/100.`}
                </h3>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[#777D76] sm:text-sm">
                  {resumes.length === 0
                    ? "Create a resume from scratch or upload an existing CV. You can then choose a template, edit it and analyze it."
                    : "Continue working on your saved resumes or run a fresh analysis on the resume you want to improve."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/resume/new"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#315E50] px-5 py-2.5 text-xs font-bold text-white shadow-[0_6px_16px_rgba(49,94,80,0.15)] transition-all hover:-translate-y-0.5 hover:bg-[#264C40]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create resume</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/analyzer"
                    className="group inline-flex items-center gap-2 rounded-xl border border-[#D9DAD2] bg-white/65 px-5 py-2.5 text-xs font-bold text-[#52645A] transition-all hover:border-[#C9D9CC] hover:bg-white"
                  >
                    <Target className="h-3.5 w-3.5 text-[#719681]" />
                    <span>Analyze resume</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ACTIVITY */}

            <div className="rounded-[28px] border border-white/90 bg-white/65 p-7 shadow-[0_12px_35px_rgba(38,59,51,0.055)] backdrop-blur-2xl sm:p-8">
              <div className="flex items-center justify-between border-b border-[#E7E5DC] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#929990]">
                    Workspace
                  </p>

                  <h3 className="text-base font-bold tracking-tight text-[#263B33]">
                    Recent Activity
                  </h3>
                </div>

                <BarChart3 className="h-4 w-4 text-[#929990]" />
              </div>

              {recentActivity.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {recentActivity.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.id} className="flex items-start gap-3.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#E7E5DC] bg-[#F1F0EA] text-[#719681]">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[#263B33]">
                            {item.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#858A83]">
                            {item.description}
                          </p>

                          <p className="mt-1 font-mono text-[10px] text-[#A0A49C]">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7E5DC] bg-[#F1F0EA] text-[#929990]">
                    <BarChart3 className="h-4 w-4" />
                  </div>

                  <p className="mt-3 text-xs font-semibold text-[#52645A]">
                    No activity yet
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-[#929990]">
                    Your resume analysis activity will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SYSTEM STATUS */}

          <div className="mb-8 mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/90 bg-white/55 px-6 py-4 shadow-[0_8px_25px_rgba(38,59,51,0.035)] backdrop-blur-xl sm:flex-row sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DCE8DE] bg-[#EAF1EB] text-[#315E50]">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-[#263B33]">
                  Revio Workspace Online
                </p>

                <p className="text-[10px] text-[#929990]">
                  Your resumes and analysis data are connected to your account.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#929990]">
              <span className="flex items-center gap-1.5 text-[#527D68]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#719681]" />
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
