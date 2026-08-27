"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PDF, DOC, or DOCX file.");
      return;
    }

    setFile(selectedFile);
    setIsAnalyzed(false);
  };

  const analyzeResume = () => {
    if (!file) return;

    setIsAnalyzing(true);

    // Temporary simulation.
    // Later this will call your backend AI analysis API.
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 1800);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0D14] text-slate-100">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

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

      {/* =========================================================
          APP SHELL
      ========================================================= */}

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        {/* =======================================================
            SIDEBAR
        ======================================================= */}

        <aside className="hidden w-[260px] shrink-0 border-r border-white/[0.08] bg-slate-950/60 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
          {/* Logo */}

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

          {/* Workspace */}

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

          {/* Intelligence */}

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

          {/* Bottom */}

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
                  Revio evaluates your skills, education and experience to
                  discover suitable career paths.
                </p>
              </div>
            </div>

            <Link
              href="/settings"
              className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/60 px-3 py-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/30 bg-indigo-950/60 text-xs font-bold text-cyan-300">
                AR
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-200">
                  Alex Rivera
                </p>

                <p className="truncate font-mono text-[10px] text-slate-500">
                  Pro Tier • Active
                </p>
              </div>
            </Link>
          </div>
        </aside>

        {/* =======================================================
            MAIN
        ======================================================= */}

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 xl:px-12">
          {/* =====================================================
              TOP BAR
          ===================================================== */}

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
              <div className="hidden items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 sm:flex">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />

                <span className="text-xs text-slate-400">AI Credits</span>

                <span className="font-mono text-xs font-bold text-cyan-300">
                  18 / 25
                </span>
              </div>

              <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300">
                <UserRound className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* =====================================================
              PAGE INTRO
          ===================================================== */}

          {!isAnalyzed && (
            <>
              <section className="mx-auto mt-14 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  AI Career Intelligence
                </div>

                <h1 className="mt-6 text-balance text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Don't just analyze your resume.
                  <span className="block bg-gradient-to-r from-indigo-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                    Understand your career.
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Revio reads your resume to understand your skills, education
                  and experience — then identifies the roles you're best suited
                  for and the opportunities you can target.
                </p>
              </section>

              {/* =================================================
                  UPLOAD AREA
              ================================================= */}

              <section className="mx-auto mt-12 max-w-3xl">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
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
                          Upload your existing resume
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-center text-xs leading-relaxed text-slate-400">
                          Upload your current resume and let Revio discover your
                          strongest career opportunities.
                        </p>

                        <label className="mx-auto mt-7 flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] transition hover:scale-[1.02]">
                          <Upload className="h-4 w-4" />
                          Choose Resume
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.doc,.docx"
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
                          <p className="text-sm font-bold text-white">
                            {file.name}
                          </p>

                          <p className="mt-1 font-mono text-[10px] text-slate-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Check className="h-4 w-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white">
                              Ready for analysis
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-500">
                              Revio will analyze the complete resume.
                            </p>
                          </div>

                          <button
                            onClick={() => setFile(null)}
                            className="text-slate-500 transition hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={analyzeResume}
                          disabled={isAnalyzing}
                          className="mx-auto mt-7 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-7 py-3 text-xs font-bold text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isAnalyzing ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Understanding your resume...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              Analyze my career
                              <ArrowRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* =================================================
                  WHAT REVIO ANALYZES
              ================================================= */}

              <section className="mx-auto mt-10 max-w-4xl">
                <div className="grid gap-3 sm:grid-cols-3">
                  <AnalysisFeature
                    icon={<Target className="h-4 w-4" />}
                    title="Skills"
                    description="Technical & professional skills"
                  />

                  <AnalysisFeature
                    icon={<GraduationCap className="h-4 w-4" />}
                    title="Education"
                    description="Degree & academic background"
                  />

                  <AnalysisFeature
                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                    title="Experience"
                    description="Roles, projects & seniority"
                  />
                </div>
              </section>

              {/* Security */}

              <div className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-center text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Your resume is securely processed and used only to generate your
                career analysis.
              </div>
            </>
          )}

          {/* =====================================================
              RESULTS
          ===================================================== */}

          {isAnalyzed && (
            <section className="mt-10">
              {/* Results Header */}

              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    <Check className="h-3 w-3" />
                    Analysis Complete
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Here's what Revio found.
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                    Your resume has been analyzed across skills, education,
                    experience and career potential.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setIsAnalyzed(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Analyze another resume
                </button>
              </div>

              {/* =================================================
                  TOP SCORE + PROFILE
              ================================================= */}

              <div className="mt-8 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
                {/* Score */}

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
                        87
                      </span>

                      <span className="mb-2 text-sm font-bold text-slate-500">
                        /100
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
                        style={{ width: "87%" }}
                      />
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-slate-400">
                      Strong foundation for entry-level software development
                      roles. A few improvements can increase your
                      competitiveness.
                    </p>
                  </div>
                </div>

                {/* Candidate Profile */}

                <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-7 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Candidate Profile
                      </p>

                      <h2 className="mt-1 text-base font-bold text-white">
                        What Revio understands about you
                      </h2>
                    </div>

                    <UserRound className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <ProfileItem
                      icon={<GraduationCap />}
                      label="Education"
                      value="MCA"
                      detail="Computer Applications"
                    />

                    <ProfileItem
                      icon={<BriefcaseBusiness />}
                      label="Experience"
                      value="Entry Level"
                      detail="Projects + internship"
                    />

                    <ProfileItem
                      icon={<Target />}
                      label="Career Focus"
                      value="Software"
                      detail="Full Stack Development"
                    />
                  </div>

                  <div className="mt-6">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Detected Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "JavaScript",
                        "TypeScript",
                        "Node.js",
                        "Express",
                        "PostgreSQL",
                        "MongoDB",
                        "Git",
                        "REST APIs",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 text-[10px] font-medium text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  SCORE BREAKDOWN
              ================================================= */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ScoreCard
                  title="ATS Compatibility"
                  score={91}
                  icon={<ShieldCheck />}
                />

                <ScoreCard title="Skills Strength" score={86} icon={<Zap />} />

                <ScoreCard
                  title="Experience"
                  score={74}
                  icon={<BriefcaseBusiness />}
                />

                <ScoreCard
                  title="Education Match"
                  score={95}
                  icon={<GraduationCap />}
                />
              </div>

              {/* =================================================
                  CAREER RECOMMENDATIONS
              ================================================= */}

              <section className="mt-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Career Intelligence
                  </p>

                  <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                    Roles you're best suited for
                  </h2>

                  <p className="mt-2 text-xs text-slate-400">
                    Based on the skills, education and experience detected in
                    your resume.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <RoleCard
                    rank="BEST MATCH"
                    role="Junior Full Stack Developer"
                    match="94%"
                    description="Your strongest combination of frontend, backend and database skills."
                    skills={["React", "Node.js", "REST APIs", "SQL"]}
                  />

                  <RoleCard
                    role="Frontend Developer"
                    match="91%"
                    description="Your React and JavaScript experience makes this a strong target."
                    skills={["React", "JavaScript", "TypeScript", "CSS"]}
                  />

                  <RoleCard
                    role="React Developer"
                    match="89%"
                    description="Your frontend projects and React experience align well with this role."
                    skills={["React", "TypeScript", "JavaScript"]}
                  />
                </div>
              </section>

              {/* =================================================
                  JOB OPPORTUNITIES
              ================================================= */}

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
                      Opportunities selected based on your current profile.
                    </p>
                  </div>

                  <button className="hidden items-center gap-1 text-xs font-semibold text-cyan-300 sm:flex">
                    View all jobs
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  <JobCard
                    role="Junior Full Stack Developer"
                    company="Technology Company"
                    location="Bangalore, India"
                    match="92%"
                  />

                  <JobCard
                    role="Frontend Developer — React"
                    company="Product Startup"
                    location="Remote · India"
                    match="89%"
                  />

                  <JobCard
                    role="Software Engineer Intern"
                    company="SaaS Company"
                    location="Bangalore, India"
                    match="86%"
                  />
                </div>
              </section>

              {/* =================================================
                  SKILL GAPS
              ================================================= */}

              <section className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
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
                        Skills that could unlock more opportunities
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 space-y-5">
                    <SkillGap name="Testing" level={62} />
                    <SkillGap name="Docker" level={48} />
                    <SkillGap name="AWS / Cloud" level={42} />
                    <SkillGap name="CI/CD" level={35} />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-950/90 p-7">
                  <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-[80px]" />

                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                      <WandSparkles className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-xl font-black text-white">
                      Your next career move
                    </h3>

                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      You're already positioned well for junior full-stack
                      roles. Strengthening testing, Docker and cloud deployment
                      would make your profile considerably stronger.
                    </p>

                    <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:scale-[1.02]">
                      Build my roadmap
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* =================================================
                  ACTIONS
              ================================================= */}

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
                      Use Revio's AI tools to turn these insights into changes.
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
          )}
        </section>
      </div>
    </main>
  );
}

/* =============================================================
   COMPONENTS
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

      <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
    </div>
  );
}

function ScoreCard({
  title,
  score,
  icon,
}: {
  title: string;
  score: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <span className="text-cyan-400">{icon}</span>
      </div>

      <div className="mt-4 flex items-end gap-1">
        <span className="text-2xl font-black text-white">{score}</span>

        <span className="mb-0.5 text-[10px] text-slate-600">/100</span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function RoleCard({
  rank,
  role,
  match,
  description,
  skills,
}: {
  rank?: string;
  role: string;
  match: string;
  description: string;
  skills: string[];
}) {
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
          <p className="text-xl font-black text-cyan-300">{match}</p>

          <p className="text-[9px] uppercase tracking-wider text-slate-500">
            match
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-white/[0.07] bg-slate-950/60 px-2 py-1 text-[9px] text-slate-400"
          >
            ✓ {skill}
          </span>
        ))}
      </div>

      <button className="mt-6 flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 transition group-hover:text-white">
        View role analysis
        <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function JobCard({
  role,
  company,
  location,
  match,
}: {
  role: string;
  company: string;
  location: string;
  match: string;
}) {
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
          <p className="text-lg font-black text-emerald-400">{match}</p>

          <p className="text-[9px] uppercase tracking-wider text-slate-500">
            profile match
          </p>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 transition group-hover:border-cyan-400/30 group-hover:text-cyan-300">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SkillGap({ name, level }: { name: string; level: number }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">{name}</span>

        <span className="font-mono text-[10px] text-slate-500">{level}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}
