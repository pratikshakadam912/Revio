import Link from "next/link";
import {
  ArrowRight,
  FileText,
  LayoutTemplate,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  WandSparkles,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const firstName = session.user.name?.split(" ")[0] || "there";

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F9FC] text-[#172033]">
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[500px] w-[500px] rounded-full bg-[#EAF1FF] blur-3xl" />
        <div className="absolute -right-48 top-[35%] h-[500px] w-[500px] rounded-full bg-[#FFF3EA] blur-3xl" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[250px] shrink-0 border-r border-[#E2E7EF] bg-white/85 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="px-7 py-7">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.03em]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F7DF3] text-white shadow-[0_8px_20px_rgba(79,125,243,0.20)]">
                <Sparkles className="h-4 w-4" />
              </span>
              Revio
            </Link>
          </div>

          <nav className="flex-1 px-4">
            <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A1A9B7]">
              Workspace
            </p>

            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-xl bg-[#EEF4FF] px-3.5 py-3 text-sm font-semibold text-[#3F6FE5]"
              >
                <TrendingUp className="h-4 w-4" />
                Overview
              </Link>

              <Link
                href="/dashboard/resumes"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#697386] transition hover:bg-[#F5F7FA] hover:text-[#172033]"
              >
                <FileText className="h-4 w-4" />
                My Resumes
              </Link>

              <Link
                href="/dashboard/templates"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#697386] transition hover:bg-[#F5F7FA] hover:text-[#172033]"
              >
                <LayoutTemplate className="h-4 w-4" />
                Templates
              </Link>

              <Link
                href="/dashboard/ai"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#697386] transition hover:bg-[#F5F7FA] hover:text-[#172033]"
              >
                <WandSparkles className="h-4 w-4" />
                AI Assistant
              </Link>
            </div>

            <p className="mt-9 px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A1A9B7]">
              Career
            </p>

            <div className="space-y-1">
              <Link
                href="/dashboard/job-matches"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#697386] transition hover:bg-[#F5F7FA] hover:text-[#172033]"
              >
                <Target className="h-4 w-4" />
                Job Matching
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-[#697386] transition hover:bg-[#F5F7FA] hover:text-[#172033]"
              >
                <UserRound className="h-4 w-4" />
                Profile
              </Link>
            </div>
          </nav>

          {/* Credits */}
          <div className="m-4 rounded-2xl border border-[#E2E9F5] bg-[#F7FAFF] p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#39465A]">
                AI credits
              </span>

              <Sparkles className="h-4 w-4 text-[#4F7DF3]" />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <span className="text-2xl font-semibold tracking-tight">5</span>

              <span className="text-[10px] text-[#8A93A3]">remaining</span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E3EAF5]">
              <div className="h-full w-[50%] rounded-full bg-[#6E98F8]" />
            </div>

            <button className="mt-4 text-xs font-semibold text-[#4F7DF3] transition hover:text-[#315FCB]">
              Upgrade plan →
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="border-b border-[#E2E7EF] bg-white/75 backdrop-blur-xl">
            <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-10">
              <div className="lg:hidden">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F7DF3] text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  Revio
                </Link>
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-medium text-[#7A8495]">
                  Career workspace
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="hidden text-sm text-[#6B7484] transition hover:text-[#172033] sm:block"
                >
                  {session.user.email}
                </Link>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF1FF] text-xs font-semibold text-[#4F7DF3]">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            {/* Welcome */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-[#8A93A3]">
                  Welcome back, {firstName}
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#172033] sm:text-4xl">
                  Let&apos;s build something
                  <br className="hidden sm:block" />
                  <span className="text-[#4F7DF3]"> great today.</span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#717B8C]">
                  Your career workspace is ready. Build your resume, improve
                  your profile, and get closer to your next opportunity.
                </p>
              </div>

              <Link
                href="/dashboard/resumes/new"
                className="group flex h-11 w-fit items-center gap-2 rounded-xl bg-[#4F7DF3] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(79,125,243,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F6FE5] hover:shadow-[0_15px_35px_rgba(79,125,243,0.25)]"
              >
                <Plus className="h-4 w-4" />
                Create resume
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#7C8696]">
                    Resume score
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF4FF]">
                    <TrendingUp className="h-4 w-4 text-[#4F7DF3]" />
                  </div>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    92
                  </span>

                  <span className="pb-1 text-xs font-medium text-[#6E98F8]">
                    / 100
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-[#8A93A3]">
                  Strong resume foundation
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#7C8696]">
                    Resumes
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF2EA]">
                    <FileText className="h-4 w-4 text-[#D98A5E]" />
                  </div>
                </div>

                <div className="mt-5 text-3xl font-semibold tracking-tight">
                  0
                </div>

                <p className="mt-2 text-[11px] text-[#8A93A3]">
                  Create your first resume
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#7C8696]">
                    AI credits
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7F3]">
                    <Sparkles className="h-4 w-4 text-[#5A9A7B]" />
                  </div>
                </div>

                <div className="mt-5 text-3xl font-semibold tracking-tight">
                  5
                </div>

                <p className="mt-2 text-[11px] text-[#8A93A3]">
                  Free credits available
                </p>
              </div>

              <div className="rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#7C8696]">
                    AI tools
                  </span>

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F4F8]">
                    <WandSparkles className="h-4 w-4 text-[#667085]" />
                  </div>
                </div>

                <div className="mt-5 text-xl font-semibold tracking-tight">
                  Ready
                </div>

                <p className="mt-2 text-[11px] text-[#8A93A3]">
                  Your career toolkit is available
                </p>
              </div>
            </div>

            {/* Main workspace */}
            <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
              {/* Getting started */}
              <div className="overflow-hidden rounded-[26px] border border-[#E2E7EF] bg-white shadow-[0_8px_30px_rgba(30,55,100,0.04)]">
                <div className="border-b border-[#E8ECF2] px-6 py-5 sm:px-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#172033]">
                        Get started
                      </p>

                      <p className="mt-1 text-xs text-[#8791A1]">
                        Complete these steps to build your strongest resume.
                      </p>
                    </div>

                    <span className="rounded-full bg-[#EEF4FF] px-3 py-1.5 text-[10px] font-semibold text-[#4F7DF3]">
                      0 / 3 complete
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-[#EEF1F5]">
                  <Link
                    href="/dashboard/resumes/new"
                    className="group flex items-center gap-4 px-6 py-5 transition hover:bg-[#FAFBFD] sm:px-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#4F7DF3]">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#273247]">
                        Create your first resume
                      </p>

                      <p className="mt-1 text-xs text-[#8791A1]">
                        Start from scratch or choose a professional template.
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#A4ACB9] transition-transform group-hover:translate-x-1 group-hover:text-[#4F7DF3]" />
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className="group flex items-center gap-4 px-6 py-5 transition hover:bg-[#FAFBFD] sm:px-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF2EA] text-[#D98A5E]">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#273247]">
                        Complete your profile
                      </p>

                      <p className="mt-1 text-xs text-[#8791A1]">
                        Add your experience, skills, education, and projects.
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#A4ACB9] transition-transform group-hover:translate-x-1 group-hover:text-[#4F7DF3]" />
                  </Link>

                  <Link
                    href="/dashboard/ai"
                    className="group flex items-center gap-4 px-6 py-5 transition hover:bg-[#FAFBFD] sm:px-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF7F3] text-[#5A9A7B]">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#273247]">
                        Improve with AI
                      </p>

                      <p className="mt-1 text-xs text-[#8791A1]">
                        Get intelligent suggestions to strengthen your resume.
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 text-[#A4ACB9] transition-transform group-hover:translate-x-1 group-hover:text-[#4F7DF3]" />
                  </Link>
                </div>
              </div>

              {/* AI insight */}
              <div className="relative overflow-hidden rounded-[26px] border border-[#DDE7F8] bg-[#F5F9FF] p-6 sm:p-7">
                <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#DCE9FF] blur-3xl" />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#4F7DF3]" />

                        <p className="text-sm font-semibold text-[#273247]">
                          AI career insight
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-[#7C8798]">
                        A little guidance to get started.
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <WandSparkles className="h-4 w-4 text-[#4F7DF3]" />
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-[#DDE6F4] bg-white/80 p-5">
                    <p className="text-sm font-semibold leading-6 text-[#293448]">
                      Your first resume is the biggest step.
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#7A8595]">
                      Once you add your experience, Revio can help turn it into
                      stronger, achievement-focused content and analyze it for
                      ATS compatibility.
                    </p>

                    <Link
                      href="/dashboard/resumes/new"
                      className="mt-5 flex w-fit items-center gap-2 text-xs font-semibold text-[#4F7DF3]"
                    >
                      Start building
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#DDE6F4] bg-white/70 p-3.5">
                      <p className="text-[10px] text-[#8A94A4]">ATS analysis</p>
                      <p className="mt-1 text-sm font-semibold text-[#344054]">
                        Included
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#DDE6F4] bg-white/70 p-3.5">
                      <p className="text-[10px] text-[#8A94A4]">AI writing</p>
                      <p className="mt-1 text-sm font-semibold text-[#344054]">
                        Included
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom quick actions */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                href="/dashboard/resumes/new"
                className="group flex items-center gap-4 rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(30,55,100,0.07)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#4F7DF3]">
                  <Plus className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">New resume</p>
                  <p className="mt-1 text-[11px] text-[#8A93A3]">
                    Start creating
                  </p>
                </div>

                <ArrowRight className="ml-auto h-4 w-4 text-[#A4ACB9] transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/templates"
                className="group flex items-center gap-4 rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(30,55,100,0.07)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF2EA] text-[#D98A5E]">
                  <LayoutTemplate className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">Browse templates</p>
                  <p className="mt-1 text-[11px] text-[#8A93A3]">
                    Find your style
                  </p>
                </div>

                <ArrowRight className="ml-auto h-4 w-4 text-[#A4ACB9] transition group-hover:translate-x-1" />
              </Link>

              <Link
                href="/dashboard/ai"
                className="group flex items-center gap-4 rounded-2xl border border-[#E2E7EF] bg-white p-5 shadow-[0_6px_25px_rgba(30,55,100,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(30,55,100,0.07)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF7F3] text-[#5A9A7B]">
                  <WandSparkles className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold">Use AI assistant</p>
                  <p className="mt-1 text-[11px] text-[#8A93A3]">
                    Improve your content
                  </p>
                </div>

                <ArrowRight className="ml-auto h-4 w-4 text-[#A4ACB9] transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
