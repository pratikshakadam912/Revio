"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  GraduationCap,
  BriefcaseBusiness,
  FolderKanban,
  Lightbulb,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";

type Mode = "write" | "guided";

type Step = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  placeholder: string;
};

const steps: Step[] = [
  {
    id: "personal",
    title: "About you",
    description: "Your name, contact details and professional identity.",
    icon: UserRound,
    placeholder: "I'm Pratiksha, a frontend developer based in Bengaluru...",
  },
  {
    id: "experience",
    title: "Experience",
    description: "Tell us where you've worked and what you've done.",
    icon: BriefcaseBusiness,
    placeholder:
      "I worked at ABC Technologies for 2 years as a frontend developer...",
  },
  {
    id: "education",
    title: "Education",
    description: "Your degrees, institutions and relevant education.",
    icon: GraduationCap,
    placeholder:
      "I completed my B.Tech in Computer Science from XYZ University...",
  },
  {
    id: "projects",
    title: "Projects",
    description: "Personal, academic or professional projects.",
    icon: FolderKanban,
    placeholder:
      "I built Revio, an AI-powered resume platform using Next.js...",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Technical and professional skills you actually have.",
    icon: Lightbulb,
    placeholder:
      "I'm comfortable with React, Next.js, TypeScript, Tailwind CSS...",
  },
];

const sampleTemplate = {
  name: "Modern",
  initials: "P",
};

export default function ResumeInformationPage() {
  const [mode, setMode] = useState<Mode>("write");
  const [prompt, setPrompt] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExamples, setShowExamples] = useState(false);

  const currentStep = steps[activeStep];

  const updateAnswer = (value: string) => {
    setAnswers((previous) => ({
      ...previous,
      [currentStep.id]: value,
    }));
  };

  const currentValue = answers[currentStep.id] ?? "";

  const completedSteps = steps.filter(
    (step) => (answers[step.id] ?? "").trim().length > 0,
  ).length;

  const canGenerate =
    mode === "write" ? prompt.trim().length >= 20 : completedSteps >= 1;

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/[0.09] blur-[140px]" />
        <div className="absolute bottom-[-300px] left-[-150px] h-[500px] w-[500px] rounded-full bg-violet-600/[0.05] blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#08090d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/resume/new"
            className="group flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Templates
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-black">
              R
            </div>
            <span className="font-semibold tracking-tight">Revio</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span className="text-xs font-medium text-zinc-300">
              10 free AI credits
            </span>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 border-b border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 text-zinc-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Check className="h-3.5 w-3.5" />
            </div>
            <span className="hidden text-sm sm:block">Template</span>
          </div>

          <div className="h-px w-8 bg-indigo-500/30 sm:w-16" />

          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-white">
              Your information
            </span>
          </div>

          <div className="h-px w-8 bg-white/10 sm:w-16" />

          <div className="flex items-center gap-2 text-zinc-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-xs">
              3
            </div>
            <span className="hidden text-sm sm:block">Edit & preview</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
            <Wand2 className="h-5 w-5 text-indigo-300" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tell Revio about yourself.
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Don't worry about perfect wording. Give us the information you have,
            and we'll turn it into a polished resume.
          </p>
        </div>

        {/* Main workspace */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left */}
          <div>
            {/* Mode switcher */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("write")}
                  className={`rounded-xl px-4 py-3 text-left transition ${
                    mode === "write"
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">Tell Revio</span>
                  </div>

                  <p
                    className={`mt-1 text-xs ${
                      mode === "write" ? "text-zinc-600" : "text-zinc-600"
                    }`}
                  >
                    Write naturally
                  </p>
                </button>

                <button
                  onClick={() => setMode("guided")}
                  className={`rounded-xl px-4 py-3 text-left transition ${
                    mode === "guided"
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-semibold">Guide me</span>
                  </div>

                  <p
                    className={`mt-1 text-xs ${
                      mode === "guided" ? "text-zinc-600" : "text-zinc-600"
                    }`}
                  >
                    One step at a time
                  </p>
                </button>
              </div>
            </div>

            {/* Natural input */}
            {mode === "write" && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d12] shadow-2xl shadow-black/20">
                <div className="border-b border-white/[0.06] px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        Tell us about yourself
                      </h2>
                      <p className="mt-1 text-xs text-zinc-500">
                        Write as much or as little as you know.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowExamples((value) => !value)}
                      className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200"
                    >
                      Need inspiration?
                    </button>
                  </div>
                </div>

                {showExamples && (
                  <div className="border-b border-white/[0.06] bg-indigo-500/[0.035] px-5 py-4">
                    <p className="text-xs font-medium text-indigo-200">
                      You could mention:
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[
                        "Your current role and experience",
                        "Education and certifications",
                        "Projects you've built",
                        "Skills and technologies",
                        "Achievements you're proud of",
                        "The kind of role you want",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-xs text-zinc-400"
                        >
                          <Check className="h-3.5 w-3.5 text-indigo-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={`Example:\n\nHi, I'm Pratiksha. I'm a frontend developer with 2 years of experience. I studied Computer Science at XYZ University. I worked at ABC Technologies where I built React applications and worked with the backend team.\n\nI've also built Revio, an AI resume platform using Next.js and TypeScript. I'm comfortable with React, Next.js, TypeScript, Tailwind CSS and Git.\n\nI'm looking for frontend developer roles.`}
                    className="min-h-[320px] w-full resize-none bg-transparent text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-700"
                  />

                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <Sparkles className="h-3.5 w-3.5" />
                      Revio will improve wording without inventing facts.
                    </div>

                    <span className="text-xs text-zinc-700">
                      {prompt.length} characters
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Guided mode */}
            {mode === "guided" && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0d12]">
                {/* Step navigation */}
                <div className="overflow-x-auto border-b border-white/[0.06]">
                  <div className="flex min-w-max p-2">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const complete =
                        (answers[step.id] ?? "").trim().length > 0;

                      return (
                        <button
                          key={step.id}
                          onClick={() => setActiveStep(index)}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition ${
                            activeStep === index
                              ? "bg-white/[0.07] text-white"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                              complete
                                ? "bg-emerald-500/10 text-emerald-400"
                                : activeStep === index
                                  ? "bg-indigo-500/10 text-indigo-300"
                                  : "bg-white/[0.04]"
                            }`}
                          >
                            {complete ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Icon className="h-3.5 w-3.5" />
                            )}
                          </div>

                          <span className="text-xs font-medium">
                            {step.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                      <currentStep.icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-indigo-300">
                        Step {activeStep + 1} of {steps.length}
                      </p>

                      <h2 className="mt-1 text-lg font-semibold">
                        {currentStep.title}
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        {currentStep.description}
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={currentValue}
                    onChange={(event) => updateAnswer(event.target.value)}
                    placeholder={currentStep.placeholder}
                    className="mt-7 min-h-[250px] w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm leading-7 text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-indigo-500/40 focus:bg-white/[0.03]"
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-600">
                      Don't worry about grammar. Just tell us what you know.
                    </span>

                    <span className="text-xs text-zinc-700">
                      {currentValue.length} characters
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
                    <button
                      onClick={() =>
                        setActiveStep((value) => Math.max(0, value - 1))
                      }
                      disabled={activeStep === 0}
                      className="rounded-xl px-4 py-2.5 text-sm text-zinc-500 transition hover:text-white disabled:pointer-events-none disabled:opacity-30"
                    >
                      Back
                    </button>

                    {activeStep < steps.length - 1 ? (
                      <button
                        onClick={() =>
                          setActiveStep((value) =>
                            Math.min(steps.length - 1, value + 1),
                          )
                        }
                        className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </button>
                    ) : (
                      <button
                        disabled={!canGenerate}
                        className="group flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Sparkles className="h-4 w-4" />
                        Generate my resume
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Natural mode CTA */}
            {mode === "write" && (
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    Ready when you are.
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Revio will organize your information into the selected
                    template.
                  </p>
                </div>

                <button
                  disabled={!canGenerate}
                  className="group flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate my resume
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4">
            {/* Template card */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-500">
                  Your template
                </p>

                <Link
                  href="/resume/new"
                  className="text-xs font-medium text-indigo-300 hover:text-indigo-200"
                >
                  Change
                </Link>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-white">
                <div className="aspect-[0.72] p-5 text-zinc-900">
                  <div className="flex gap-3 border-b border-zinc-200 pb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                      {sampleTemplate.initials}
                    </div>

                    <div>
                      <div className="h-2.5 w-24 rounded bg-zinc-800" />
                      <div className="mt-2 h-1.5 w-16 rounded bg-indigo-400" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="h-1.5 w-16 rounded bg-zinc-700" />
                    <div className="mt-3 space-y-1.5">
                      <div className="h-1 w-full rounded bg-zinc-200" />
                      <div className="h-1 w-[90%] rounded bg-zinc-200" />
                      <div className="h-1 w-[75%] rounded bg-zinc-200" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-1.5 w-20 rounded bg-zinc-700" />
                    <div className="mt-3 space-y-2">
                      <div className="h-1 w-[90%] rounded bg-zinc-200" />
                      <div className="h-1 w-[82%] rounded bg-zinc-200" />
                      <div className="h-1 w-[70%] rounded bg-zinc-200" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="h-1.5 w-16 rounded bg-zinc-700" />
                    <div className="mt-3 flex gap-2">
                      <div className="h-3 w-10 rounded-full bg-indigo-50" />
                      <div className="h-3 w-12 rounded-full bg-indigo-50" />
                      <div className="h-3 w-9 rounded-full bg-indigo-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {sampleTemplate.name}
                </span>

                <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-medium text-indigo-300">
                  Selected
                </span>
              </div>
            </div>

            {/* Progress card */}
            {mode === "guided" && (
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-zinc-500">
                    Your progress
                  </p>

                  <span className="text-xs font-medium text-zinc-400">
                    {completedSteps}/{steps.length}
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{
                      width: `${(completedSteps / steps.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="mt-4 space-y-2">
                  {steps.map((step) => {
                    const complete = (answers[step.id] ?? "").trim().length > 0;

                    return (
                      <div
                        key={step.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${
                            complete
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/[0.04] text-zinc-600"
                          }`}
                        >
                          {complete ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                        </div>

                        <span
                          className={
                            complete ? "text-zinc-300" : "text-zinc-600"
                          }
                        >
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI reassurance */}
            <div className="rounded-2xl border border-indigo-500/10 bg-indigo-500/[0.035] p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10">
                <Sparkles className="h-4 w-4 text-indigo-300" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                You don't need perfect words.
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Tell Revio what you actually did. We'll help with structure,
                clarity and professional wording without making up experience.
              </p>
            </div>
          </aside>
        </div>

        {/* Bottom reassurance */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            Your draft is saved automatically
          </span>

          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            AI won't invent your experience
          </span>

          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-500/70" />
            You can edit everything later
          </span>
        </div>
      </section>
    </main>
  );
}
