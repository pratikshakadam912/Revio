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

const resumes = [
  {
    name: "Software Developer Resume",
    role: "Full Stack Developer",
    updated: "Edited 2 hours ago",
    score: 94,
    status: "Optimal",
    tags: ["React", "TypeScript", "Node.js"],
  },
  {
    name: "AI / ML Resume",
    role: "AI & Machine Learning",
    updated: "Edited yesterday",
    score: 88,
    status: "Strong",
    tags: ["Python", "PyTorch", "LLMs"],
  },
];

const activity = [
  {
    title: "Resume analyzed",
    description: "Software Developer Resume scored 94%",
    time: "2 hours ago",
    icon: BarChart3,
    color: "cyan",
  },
  {
    title: "STAR bullet rewrites generated",
    description: "6 high-yield metrics applied",
    time: "Yesterday",
    icon: WandSparkles,
    color: "indigo",
  },
  {
    title: "Resume updated",
    description: "AI / ML Resume template synced",
    time: "2 days ago",
    icon: FileText,
    color: "emerald",
  },
];

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-left electric indigo glow */}
        <div className="absolute -left-[300px] -top-[280px] h-[750px] w-[750px] rounded-full bg-gradient-to-br from-indigo-600/25 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Top-right cyan glow */}
        <div className="absolute -right-[300px] top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Center ambient glow */}
        <div className="absolute left-1/2 top-[45%] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-950/30 blur-[170px]" />

        {/* Precise radial matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      {/* ============================================================
          APP SHELL
      ============================================================ */}

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        {/* ============================================================
            SIDEBAR
        ============================================================ */}

        <aside className="hidden w-[260px] shrink-0 border-r border-white/[0.08] bg-slate-950/60 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          {/* Logo */}
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

          {/* Workspace label */}
          <div className="mt-9 px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Workspace
            </p>
          </div>

          {/* Navigation */}
          <nav className="mt-3 space-y-1">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
            >
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              Dashboard
            </Link>

            <Link
              href="/resume"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <FileText className="h-4 w-4 text-slate-500 transition-colors group-hover:text-cyan-400" />
              My Resumes
            </Link>

            <Link
              href="/templates"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <LayoutTemplate className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
              Templates
            </Link>

            <Link
              href="/analyzer"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <Target className="h-4 w-4 text-slate-500 transition-colors group-hover:text-emerald-400" />
              Resume Analyzer
            </Link>
          </nav>

          {/* Tools */}
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
              <WandSparkles className="h-4 w-4 text-slate-500 transition-colors group-hover:text-cyan-400" />
              STAR Bullet Rewriter
            </Link>

            <Link
              href="/settings"
              className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.04] hover:text-white"
            >
              <Settings className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400" />
              Settings
            </Link>
          </nav>

          {/* Bottom workspace intelligence card */}
          <div className="mt-auto">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-inner">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-600/20 blur-[40px]" />

              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                </div>

                <p className="mt-3 text-xs font-bold text-white tracking-tight">
                  ATS Telemetry Active
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                  Audit bullets against recruiter benchmark matrices.
                </p>

                <Link
                  href="/analyzer"
                  className="mt-3.5 flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 transition-colors hover:text-white"
                >
                  <span>Run deep analysis</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Profile Bar */}
            <Link
              href="/settings"
              className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/60 px-3 py-2.5 transition hover:border-white/10 hover:bg-slate-900/60"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-950/60 text-cyan-300 font-bold text-xs">
                AR
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-200">
                  Alex Rivera
                </p>
                <p className="truncate text-[10px] text-slate-500 font-mono">
                  Pro Tier &bull; Active
                </p>
              </div>
            </Link>
          </div>
        </aside>

        {/* ============================================================
            MAIN CONTENT AREA
        ============================================================ */}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          {/* ============================================================
              TOP NAVIGATION / STATUS
          ============================================================ */}

          <header className="flex items-center justify-between">
            {/* Mobile Brand */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 text-lg font-black tracking-tight text-white lg:hidden"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </span>
              Revio<span className="text-cyan-400">.</span>
            </Link>

            {/* Desktop Page Path */}
            <div className="hidden lg:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Career Intelligence Platform
              </p>
              <p className="mt-0.5 text-sm font-bold text-white tracking-tight">
                Executive Dashboard
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Credits Pill */}
              <div className="hidden items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 backdrop-blur-md sm:flex">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-xs text-slate-400">AI Credits:</span>
                <span className="text-xs font-bold font-mono text-cyan-300">
                  18 / 25
                </span>
              </div>

              {/* Profile Avatar Trigger */}
              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition hover:border-indigo-500/40 hover:text-white">
                <UserRound className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* ============================================================
              HERO GREETING & PRIMARY ACTIONS
          ============================================================ */}

          {/* ============================================================
    PRIMARY RESUME ACTIONS
============================================================ */}

          <div className="mt-10 flex flex-wrap gap-3">
            {/* CREATE NEW RESUME */}
            <Link
              href="/resume/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 text-xs font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
            >
              <Plus className="h-4 w-4" />

              <span>Create new resume</span>

              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* ANALYZE EXISTING RESUME */}
            <Link
              href="/analyzer"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-slate-900/70 px-5 text-xs font-semibold text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
            >
              <Upload className="h-3.5 w-3.5 text-cyan-400 transition-transform duration-300 group-hover:-translate-y-0.5" />

              <span>Analyze existing resume</span>

              <ArrowRight className="h-3.5 w-3.5 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-400" />
            </Link>
          </div>
          {/* ============================================================
              KEY PERFORMANCE METRICS
          ============================================================ */}

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {/* Metric 1: Resume Score */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/15 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Highest ATS Score
                  </p>
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                    OPTIMAL
                  </span>
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    94
                  </span>
                  <span className="text-xs font-bold text-slate-500">/100</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                    style={{ width: "94%" }}
                  />
                </div>

                <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Outranks 95% of engineer
                  applicants
                </p>
              </div>
            </div>

            {/* Metric 2: AI Token Capacity */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-16 bottom-[-60px] h-48 w-48 rounded-full bg-cyan-500/15 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI STAR Tokens
                  </p>
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    18
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    /25 left
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                    style={{ width: "72%" }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Renews in 12 days &bull; Pro Plan active
                </p>
              </div>
            </div>

            {/* Metric 3: Application Telemetry */}
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-lg backdrop-blur-2xl">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Audit Actions
                  </p>
                  <Target className="h-4 w-4 text-indigo-400" />
                </div>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black font-mono tracking-tight text-white">
                    12
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    optimizations
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300">
                    +24% Impact
                  </span>
                  <span className="text-xs text-slate-400">this month</span>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  6 active tailored variations ready
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              RESUMES SECTION
          ============================================================ */}

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Managed Documents
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
                  Active Resumes
                </h2>
              </div>

              <Link
                href="/resume"
                className="group flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-cyan-300"
              >
                <span>View all variations</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {resumes.map((resume) => (
                <Link
                  href="/resume"
                  key={resume.name}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  {/* Visual Document Mockup */}
                  <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[20px] border border-white/[0.06] bg-slate-950/80">
                    {/* Document Surface */}
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

                    {/* Floating Score Badge */}
                    <div className="absolute right-3 top-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      {resume.score}% ATS
                    </div>
                  </div>

                  {/* Card Metadata */}
                  <div className="px-2 pb-2 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-tight">
                          {resume.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {resume.role}
                        </p>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 transition group-hover:border-indigo-500/30 group-hover:bg-indigo-600/20 group-hover:text-cyan-300">
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {resume.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-white/5 bg-slate-950/40 px-1.5 py-0.5 text-[9px] font-mono text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 text-[10px] font-mono text-slate-500">
                      {resume.updated}
                    </p>
                  </div>
                </Link>
              ))}

              {/* Create Resume Blank Card */}
              <Link
                href="/resume/new"
                className="group relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-white/15 bg-slate-900/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-indigo-950/20"
              >
                <div className="text-center p-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-cyan-300 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Plus className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-white tracking-tight">
                    Create new variation
                  </h3>

                  <p className="mx-auto mt-1 max-w-[190px] text-xs leading-relaxed text-slate-400">
                    Tailor specifically to a job description with AI
                    suggestions.
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <span>Start builder</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* ============================================================
              AI INSIGHT & ACTIVITY MATRIX
          ============================================================ */}

          <div className="mt-12 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            {/* AI Career Insight Banner */}
            <div className="relative overflow-hidden rounded-[28px] border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 via-slate-900/80 to-slate-950/90 p-7 sm:p-8 shadow-xl backdrop-blur-2xl">
              <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-indigo-600/20 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />

              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-600/20 text-cyan-300 shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">
                      Algorithmic Signal Insight
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">
                      Live Telemetry Recommendation
                    </p>
                  </div>
                </div>

                <h3 className="mt-6 max-w-2xl text-2xl font-black leading-tight tracking-tight text-white">
                  Strong technical foundation.{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                    Outcome metrics need quantification.
                  </span>
                </h3>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Your 2 most recent roles list solid responsibilities, but lack
                  numerical outcomes. Converting duties to STAR framework (e.g.,
                  latency reduction, revenue attribution) will boost your
                  screening match by an estimated 18%.
                </p>

                <Link
                  href="/analyzer"
                  className="group mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:text-white"
                >
                  <span>Apply AI STAR suggestions</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7 sm:p-8 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Audit Stream
                  </p>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Recent Activity
                  </h3>
                </div>

                <BarChart3 className="h-4 w-4 text-slate-500" />
              </div>

              <div className="mt-5 space-y-4">
                {activity.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex items-start gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-950/80 text-cyan-400">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400 truncate">
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
            </div>
          </div>

          {/* ============================================================
              BOTTOM SYSTEM STATUS STRIP
          ============================================================ */}

          <div className="mt-10 mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-slate-900/40 px-6 py-4 backdrop-blur-xl sm:flex-row sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/50 text-cyan-300">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-200">
                  Parser & Verification Engines Online
                </p>
                <p className="text-[10px] text-slate-500">
                  Continuous benchmark checks against Greenhouse, Lever, and
                  Workday algorithms.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                ATS Sync
              </span>
              <span>STAR AI Ready</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
