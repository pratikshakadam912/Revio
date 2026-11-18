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
    <li className="flex items-start gap-3 text-sm leading-6 text-[#777D76]">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#719681]/15 text-[#315E50]">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span>{children}</span>
    </li>
  );
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === false) {
    return <span className="text-[#C9CBC3]">—</span>;
  }

  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#719681]/15 text-[#315E50]">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  return <span className="text-sm text-[#777D76]">{value}</span>;
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
    <main className="relative min-h-screen overflow-hidden bg-[#F7F5EF] text-[#263B33]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#719681]/10 blur-[120px]" />
        <div className="absolute -right-40 top-[500px] h-[450px] w-[450px] rounded-full bg-[#D9C5A2]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[#B97862]/[0.07] blur-[120px]" />
      </div>

      <section className="relative px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#315E50]/15 bg-white/65 px-4 py-2 text-xs font-semibold text-[#315E50] shadow-sm backdrop-blur-xl">
              <Sparkles className="h-4 w-4" />
              Simple, transparent pricing
            </div>

            <h1 className="mt-7 text-4xl font-semibold tracking-[-0.045em] text-[#263B33] sm:text-6xl sm:leading-[1.08]">
              Start free.
              <span className="block bg-gradient-to-r from-[#315E50] via-[#719681] to-[#B97862] bg-clip-text pb-2 text-transparent">
                Grow your career.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#777D76] sm:text-lg sm:leading-8">
              Build stronger resumes, understand your ATS compatibility, and
              prepare for your next opportunity with Revio. Start with the
              essentials and choose a plan that fits your job search.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#777D76]">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#315E50]" />
                Start without a paid subscription
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[#315E50]" />
                Choose your plan when ready
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#plans"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#315E50] to-[#719681] px-6 text-sm font-semibold text-white shadow-lg shadow-[#315E50]/15 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Explore plans
                <ArrowDown className="h-4 w-4" />
              </a>

              <Link
                href="/resume/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E7E5DC] bg-white/70 px-6 text-sm font-semibold text-[#315E50] shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#315E50]/25 hover:bg-white"
              >
                Try Revio free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="relative scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div>
              <p className="text-sm font-semibold text-[#719681]">
                Find your plan
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#263B33] sm:text-3xl">
                The right tools for your next move
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#777D76]">
                Compare the options and choose what suits your goals.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl border border-[#E7E5DC] bg-white/60 p-1 shadow-sm backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  billing === "monthly"
                    ? "bg-[#315E50] text-white shadow-sm"
                    : "text-[#777D76] hover:text-[#263B33]"
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
                    ? "bg-[#315E50] text-white shadow-sm"
                    : "text-[#777D76] hover:text-[#263B33]"
                }`}
              >
                Yearly
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    billing === "yearly"
                      ? "bg-white/20 text-white"
                      : "bg-[#719681]/15 text-[#315E50]"
                  }`}
                >
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
                  className={`relative flex flex-col rounded-3xl border p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:p-8 ${
                    plan.highlighted
                      ? "border-[#315E50]/35 bg-white/85 shadow-[0_20px_70px_rgba(49,94,80,0.13)]"
                      : "border-white/90 bg-white/60 shadow-[0_12px_35px_rgba(38,59,51,0.06)] hover:border-[#315E50]/20 hover:shadow-[0_18px_45px_rgba(38,59,51,0.09)]"
                  } ${isSelected ? "ring-2 ring-[#D9C5A2]" : ""}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#315E50] to-[#719681] px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#315E50]/20">
                      {plan.badge}
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute right-5 top-5 rounded-full bg-[#D9C5A2]/25 px-2.5 py-1 text-[10px] font-bold text-[#315E50]">
                      Selected
                    </div>
                  )}

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      plan.id === "career"
                        ? "border-[#D9C5A2]/40 bg-[#D9C5A2]/20 text-[#9A7442]"
                        : "border-[#315E50]/10 bg-[#315E50]/[0.07] text-[#315E50]"
                    }`}
                  >
                    {plan.id === "free" ? (
                      <FileText className="h-5 w-5" />
                    ) : plan.id === "pro" ? (
                      <Zap className="h-5 w-5" />
                    ) : (
                      <Crown className="h-5 w-5" />
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-[#263B33]">
                    {plan.name}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#777D76]">
                    {plan.description}
                  </p>

                  <div className="mt-6 min-h-[90px]">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="text-4xl font-semibold tracking-tight text-[#263B33]">
                        {price === 0 ? "Free" : `₹${formatPrice(price)}`}
                      </span>
                      {price > 0 && (
                        <span className="text-sm text-[#858A83]">
                          /{billing === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>

                    {billing === "yearly" && yearlySavings > 0 && (
                      <p className="mt-2 text-xs font-medium text-[#315E50]">
                        Save ₹{formatPrice(yearlySavings)} per year
                      </p>
                    )}

                    {billing === "monthly" && price > 0 && (
                      <p className="mt-2 text-xs text-[#858A83]">
                        Billed monthly
                      </p>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#E7E5DC] bg-[#F7F5EF]/80 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#263B33]">
                      <Gauge className="h-4 w-4 text-[#315E50]" />
                      {plan.credits}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#858A83]">
                      Usage limits and available actions depend on the features
                      enabled for your account.
                    </p>
                  </div>

                  <Link
                    href={getPlanHref(plan.id)}
                    className={`mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition hover:-translate-y-0.5 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-[#315E50] to-[#719681] text-white shadow-lg shadow-[#315E50]/20 hover:shadow-xl"
                        : "border border-[#315E50]/20 bg-white/80 text-[#315E50] hover:border-[#315E50]/40 hover:bg-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="my-6 h-px bg-[#E7E5DC]" />

                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#858A83]">
                    What&apos;s included
                  </p>

                  <ul className="mt-5 space-y-3.5">
                    {plan.features.map((feature) => (
                      <CheckItem key={feature}>{feature}</CheckItem>
                    ))}
                  </ul>

                  <p className="mt-auto pt-6 text-xs leading-5 text-[#858A83]">
                    {plan.id === "free"
                      ? "No paid subscription is needed to get started."
                      : "Paid features require an active subscription and must be enabled for your account."}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-[#858A83]">
            Displayed subscription prices are proposed starting prices and must
            be confirmed before launch. Taxes, billing, renewals, cancellation,
            refunds, and AI usage limits are subject to the final checkout
            terms.
          </p>
        </div>
      </section>

      <section className="relative border-y border-[#E7E5DC] bg-white/35 px-5 py-20 backdrop-blur-sm sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-[#719681]">
              Compare the details
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#263B33]">
              Know what you&apos;re getting
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#777D76]">
              Review the differences between plans before choosing yours.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-white/90 bg-white/70 shadow-[0_12px_35px_rgba(38,59,51,0.06)] backdrop-blur-xl">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E7E5DC] bg-[#F7F5EF]/80">
                  <th className="px-5 py-4 text-sm font-semibold text-[#263B33] sm:px-6">
                    Feature
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[#263B33]">
                    Free
                  </th>
                  <th className="bg-[#315E50]/[0.07] px-5 py-4 text-sm font-semibold text-[#315E50]">
                    Pro
                  </th>
                  <th className="px-5 py-4 text-sm font-semibold text-[#263B33]">
                    Career Plus
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item) => (
                  <tr
                    key={item.feature}
                    className="border-b border-[#E7E5DC]/70 last:border-0"
                  >
                    <td className="px-5 py-4 text-sm text-[#52645B] sm:px-6">
                      {item.feature}
                    </td>
                    <td className="px-5 py-4">
                      <FeatureValue value={item.free} />
                    </td>
                    <td className="bg-[#315E50]/[0.035] px-5 py-4">
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

          <p className="mt-4 text-center text-xs leading-5 text-[#858A83]">
            Feature availability shown here is a proposed product structure.
            Confirm that each feature and limit is implemented before enabling
            paid subscriptions.
          </p>
        </div>
      </section>

      <section className="relative px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#315E50]/10 bg-[#315E50]/[0.07] text-[#315E50]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#263B33]">
                Your career deserves clarity.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[#777D76]">
                Revio brings resume building, ATS feedback, and career
                preparation into one workflow. Choose the tools you need and
                focus on making your next application stronger.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-[#315E50]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#263B33]">
                      Built around your goals
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#777D76]">
                      Prepare resumes around the roles you want to pursue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#315E50]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#263B33]">
                      Account-based access
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#777D76]">
                      Your resume workspace is tied to your account. Review the
                      privacy policy to understand how information is processed
                      and retained.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#315E50]" />
                  <div>
                    <h3 className="text-sm font-semibold text-[#263B33]">
                      Clear usage expectations
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#777D76]">
                      AI credit costs, subscription terms, and feature
                      restrictions should be disclosed before purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[#263B33]">
                Frequently asked questions
              </h2>

              <div className="mt-6 divide-y divide-[#E7E5DC] border-y border-[#E7E5DC]">
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
                        <span className="text-sm font-semibold text-[#263B33] transition-colors hover:text-[#315E50]">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#858A83] transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <p className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#777D76]">
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

      <section className="relative px-5 pb-20 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/90 bg-gradient-to-br from-[#315E50] via-[#3F705F] to-[#719681] px-6 py-14 text-center text-white shadow-[0_24px_70px_rgba(49,94,80,0.20)] sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-[#D9C5A2]/25 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-36 right-0 h-72 w-72 rounded-full bg-white/15 blur-[100px]" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <Sparkles className="h-6 w-6 text-[#F1DFC0]" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next opportunity starts here.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
              Start building a better resume today. Explore Revio before
              deciding whether you need a paid plan.
            </p>

            <Link
              href="/resume/new"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F7F5EF] px-6 text-sm font-semibold text-[#315E50] shadow-lg transition hover:-translate-y-0.5 hover:bg-white"
            >
              Build my resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-[#E7E5DC] bg-white/35 px-5 py-8 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-[#777D76] sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-bold tracking-tight text-[#263B33]">
            Revio<span className="text-[#719681]">.</span>
          </Link>

          <div className="flex flex-wrap gap-x-5 gap-y-3">
            <Link href="/features" className="transition hover:text-[#315E50]">
              Features
            </Link>
            <Link href="/templates" className="transition hover:text-[#315E50]">
              Templates
            </Link>
            <Link href="/login" className="transition hover:text-[#315E50]">
              Log in
            </Link>
            <Link href="/privacy" className="transition hover:text-[#315E50]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#315E50]">
              Terms
            </Link>
          </div>

          <p>© {new Date().getFullYear()} Revio</p>
        </div>
      </footer>
    </main>
  );
}
