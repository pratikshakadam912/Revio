"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  Crown,
  FileText,
  Gauge,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

type BillingPeriod = "monthly" | "yearly";

type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  credits: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  unavailable?: string[];
  cta: string;
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Explore Revio and build your first resume.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: "Starter AI access",
    features: [
      "Create and edit resumes",
      "Access to resume templates",
      "Resume preview and formatting",
      "Resume download when supported",
      "Basic ATS analysis when available",
    ],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For active job seekers who want an edge.",
    monthlyPrice: 299,
    yearlyPrice: 2990,
    credits: "Expanded AI access",
    badge: "Most popular",
    highlighted: true,
    features: [
      "Everything in Free",
      "More AI-assisted resume improvements",
      "Detailed ATS and keyword insights",
      "Resume tailoring for target roles",
      "Skills gap and career recommendations",
      "Priority access to new features",
    ],
    cta: "Choose Pro",
  },
  {
    id: "career",
    name: "Career Plus",
    description: "For ambitious professionals managing multiple applications.",
    monthlyPrice: 599,
    yearlyPrice: 5990,
    credits: "Higher AI usage allowance",
    features: [
      "Everything in Pro",
      "Higher AI usage allowance",
      "Multiple targeted resume versions",
      "Advanced career insights",
      "More room for job-specific tailoring",
      "Enhanced application preparation",
    ],
    cta: "Choose Career Plus",
  },
];

const comparisons = [
  { feature: "Create and edit resumes", free: true, pro: true, career: true },
  {
    feature: "Resume templates",
    free: "Available",
    pro: "All available",
    career: "All available",
  },
  { feature: "Resume preview", free: true, pro: true, career: true },
  {
    feature: "AI-assisted improvements",
    free: "Starter access",
    pro: "Expanded",
    career: "Higher allowance",
  },
  {
    feature: "ATS analysis",
    free: "Basic access",
    pro: "Detailed",
    career: "Detailed",
  },
  { feature: "Keyword optimization", free: false, pro: true, career: true },
  { feature: "Role-specific tailoring", free: false, pro: true, career: true },
  {
    feature: "Skills gap insights",
    free: "Basic access",
    pro: true,
    career: true,
  },
  {
    feature: "Multiple targeted versions",
    free: false,
    pro: "Available",
    career: "Expanded use",
  },
  { feature: "Career recommendations", free: false, pro: true, career: true },
];

const faqs = [
  {
    question: "Can I use Revio for free?",
    answer:
      "Yes. Start with the free experience to explore resume creation, templates, and the features available on your account. Any AI usage limits and download restrictions should be shown clearly before you use a limited feature.",
  },
  {
    question: "What are AI credits?",
    answer:
      "AI credits measure usage of supported AI-powered actions. Different actions may consume different amounts. Your account should show your available balance and the cost of an action before you confirm it.",
  },
  {
    question: "Can I change my resume template later?",
    answer:
      "Yes. Revio is designed to let you change a resume's template without having to rewrite its content. Review your resume after switching templates to make sure its layout still looks right.",
  },
  {
    question: "Does an ATS score guarantee an interview?",
    answer:
      "No. An ATS score is an indicator of how well your resume matches selected checks and job requirements. Hiring decisions also depend on your experience, qualifications, the role, and the employer.",
  },
  {
    question: "Can I cancel a paid subscription?",
    answer:
      "Cancellation, renewal, and refund terms depend on the billing system configured for your account. Review the terms displayed during checkout before subscribing.",
  },
  {
    question: "Will my resume and personal information stay private?",
    answer:
      "Your resume can contain sensitive personal information. Use account security features, review Revio's privacy policy, and only upload information you are comfortable processing through the service.",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(price);
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span>{children}</span>
    </li>
  );
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === false) {
    return <span className="text-zinc-300">—</span>;
  }

  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  return <span className="text-sm text-zinc-600">{value}</span>;
}

export default function PricingPage() {
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selectedPlan = searchParams.get("plan");

  function getPlanHref(planId: string) {
    if (planId === "free") {
      return "/resume/new";
    }

    const callbackUrl = `/pricing?plan=${encodeURIComponent(planId)}`;

    return `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-zinc-950">
      <section className="relative px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[540px] bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.10),_transparent_65%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Simple, transparent pricing
            </div>

            <h1 className="mt-7 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl sm:leading-[1.08]">
              Start free.
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text pb-2 text-transparent">
                Grow your career.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg sm:leading-8">
              Build stronger resumes, understand your ATS compatibility, and
              prepare for your next opportunity with Revio. Start with the
              essentials and choose a plan that fits your job search.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-500">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                Start without a paid subscription
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                Choose your plan when ready
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#plans"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Explore plans
                <ArrowDown className="h-4 w-4" />
              </a>

              <Link
                href="/resume/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Try Revio free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Find your plan
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                The right tools for your next move
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Compare the options and choose what suits your goals.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  billing === "monthly"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-pressed={billing === "yearly"}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  billing === "yearly"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                Yearly
                <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  SAVE
                </span>
              </button>
            </div>
          </div>

          <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const price =
                billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

              const yearlySavings =
                plan.monthlyPrice > 0
                  ? plan.monthlyPrice * 12 - plan.yearlyPrice
                  : 0;

              const isSelected = selectedPlan === plan.id;

              return (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl border p-6 transition sm:p-8 ${
                    plan.highlighted
                      ? "border-indigo-600 bg-white shadow-[0_20px_70px_rgba(79,70,229,0.12)] ring-1 ring-indigo-600"
                      : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300"
                  } ${isSelected ? "ring-2 ring-cyan-500" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute right-5 top-5 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-700">
                      Selected
                    </div>
                  )}

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-800">
                    {plan.id === "free" ? (
                      <FileText className="h-5 w-5" />
                    ) : plan.id === "pro" ? (
                      <Zap className="h-5 w-5" />
                    ) : (
                      <Crown className="h-5 w-5" />
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">
                    {plan.description}
                  </p>

                  <div className="mt-6 min-h-[90px]">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="text-4xl font-semibold tracking-tight">
                        {price === 0 ? "Free" : `₹${formatPrice(price)}`}
                      </span>
                      {price > 0 && (
                        <span className="text-sm text-zinc-500">
                          /{billing === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>

                    {billing === "yearly" && yearlySavings > 0 && (
                      <p className="mt-2 text-xs font-medium text-emerald-700">
                        Save ₹{formatPrice(yearlySavings)} per year
                      </p>
                    )}

                    {billing === "monthly" && price > 0 && (
                      <p className="mt-2 text-xs text-zinc-500">
                        Billed monthly
                      </p>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-zinc-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                      <Gauge className="h-4 w-4 text-indigo-600" />
                      {plan.credits}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Usage limits and available actions depend on the features
                      enabled for your account.
                    </p>
                  </div>

                  <Link
                    href={getPlanHref(plan.id)}
                    className={`mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                        : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="my-6 h-px bg-zinc-100" />

                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    What&apos;s included
                  </p>

                  <ul className="mt-5 space-y-3.5">
                    {plan.features.map((feature) => (
                      <CheckItem key={feature}>{feature}</CheckItem>
                    ))}
                  </ul>

                  <p className="mt-auto pt-6 text-xs leading-5 text-zinc-400">
                    {plan.id === "free"
                      ? "No paid subscription is needed to get started."
                      : "Paid features require an active subscription and must be enabled for your account."}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-zinc-400">
            Displayed subscription prices are proposed starting prices and must
            be confirmed before launch. Taxes, billing, renewals, cancellation,
            refunds, and AI usage limits are subject to the final checkout
            terms.
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50/70 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-indigo-600">
              Compare the details
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Know what you&apos;re getting
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Review the differences between plans before choosing yours.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-5 py-4 text-sm font-semibold text-zinc-800 sm:px-6">
                    Feature
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-zinc-800">
                    Free
                  </th>
                  <th className="bg-indigo-50/60 px-5 py-4 text-sm font-semibold text-indigo-700">
                    Pro
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-zinc-800">
                    Career Plus
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item) => (
                  <tr
                    key={item.feature}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-5 py-4 text-sm text-zinc-700 sm:px-6">
                      {item.feature}
                    </td>
                    <td className="px-5 py-4">
                      <FeatureValue value={item.free} />
                    </td>
                    <td className="bg-indigo-50/30 px-5 py-4">
                      <FeatureValue value={item.pro} />
                    </td>
                    <td className="px-5 py-4">
                      <FeatureValue value={item.career} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs leading-5 text-zinc-400">
            Feature availability shown here is a proposed product structure.
            Confirm that each feature and limit is implemented before enabling
            paid subscriptions.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight">
                Your career deserves clarity.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-zinc-500">
                Revio brings resume building, ATS feedback, and career
                preparation into one workflow. Choose the tools you need and
                focus on making your next application stronger.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-semibold">
                      Built around your goals
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      Prepare resumes around the roles you want to pursue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-semibold">
                      Account-based access
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      Your resume workspace is tied to your account. Review the
                      privacy policy to understand how information is processed
                      and retained.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                  <div>
                    <h3 className="text-sm font-semibold">
                      Clear usage expectations
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">
                      AI credit costs, subscription terms, and feature
                      restrictions should be disclosed before purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Frequently asked questions
              </h2>

              <div className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div key={faq.question}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="text-sm font-semibold text-zinc-800">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-zinc-500">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#0B0D16] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-indigo-600/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-36 right-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
              <Sparkles className="h-6 w-6 text-cyan-300" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next opportunity starts here.
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
              Start building a better resume today. Explore Revio before
              deciding whether you need a paid plan.
            </p>

            <Link
              href="/resume/new"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
            >
              Build my resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-bold tracking-tight text-zinc-900">
            Revio<span className="text-indigo-600">.</span>
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/features" className="transition hover:text-zinc-900">
              Features
            </Link>
            <Link href="/templates" className="transition hover:text-zinc-900">
              Templates
            </Link>
            <Link href="/login" className="transition hover:text-zinc-900">
              Log in
            </Link>
            <Link href="/privacy" className="transition hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-zinc-900">
              Terms
            </Link>
          </div>

          <p>© {new Date().getFullYear()} Revio</p>
        </div>
      </footer>
    </main>
  );
}
