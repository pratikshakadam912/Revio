import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#0A0D14] px-5 py-14 text-slate-100 sm:px-8 lg:px-12 lg:py-16 selection:bg-indigo-500 selection:text-white">
      {/* ============================================================
          DYNAMIC BACKGROUND ATMOSPHERE
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep electric indigo glow */}
        <div className="absolute -bottom-[280px] -left-[240px] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-sky-500/10 to-transparent blur-[140px]" />

        {/* Cyan ambient glow */}
        <div className="absolute -bottom-[240px] -right-[240px] h-[550px] w-[550px] rounded-full bg-gradient-to-tl from-cyan-500/20 via-indigo-600/10 to-transparent blur-[140px]" />

        {/* Precise radial matrix grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* Floating micro particles */}
        <div className="absolute bottom-[35%] left-[12%] h-1 w-1 rounded-full bg-cyan-400" />
        <div className="absolute bottom-[28%] right-[18%] h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* ============================================================
            TOP FOOTER
        ============================================================ */}

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          {/* Brand & Mission */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]">
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                <Sparkles className="relative z-10 h-4 w-4" />
              </div>

              <span className="text-xl font-black tracking-tight text-white">
                Revio
                <span className="text-cyan-400">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              AI-powered resume intelligence platform engineered to pass modern
              ATS filters and generate executive-tier STAR bullet points.
            </p>

            {/* Status Indicator Badge */}
            <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                AI Engine Online &bull; v2.6
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3">
            {/* Product Column */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Product
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="#templates">Templates</FooterLink>
                <FooterLink href="/register">Get started</FooterLink>
              </div>
            </div>

            {/* Account Column */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Account
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <FooterLink href="/login">Log in</FooterLink>
                <FooterLink href="/register">Create account</FooterLink>
                <FooterLink href="/dashboard/resume">Dashboard</FooterLink>
              </div>
            </div>

            {/* Platform Column */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Platform
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <FooterLink href="/features">
                  <span>Diagnostics</span>
                  <ArrowUpRight className="h-3 w-3 text-cyan-400" />
                </FooterLink>
                <FooterLink href="#how-it-works">ATS Engine</FooterLink>
                <span className="text-xs text-slate-500 font-mono">
                  STAR Matrix
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            DIVIDER
        ============================================================ */}

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        {/* ============================================================
            BOTTOM ROW
        ============================================================ */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              &copy; {new Date().getFullYear()} Revio AI. All rights reserved.
            </span>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-slate-300"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-slate-300"
            >
              Terms of Service
            </Link>

            <Link
              href="/security"
              className="transition-colors duration-200 hover:text-slate-300"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   FOOTER LINK COMPONENT
================================================================ */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center gap-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:text-white"
    >
      <span>{children}</span>
      <span className="h-px w-0 bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 group-hover:w-3" />
    </Link>
  );
}
