import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

type FooterProps = {
  compact?: boolean;
};

export function Footer({ compact = false }: FooterProps) {
  return (
    <footer
      className={`relative overflow-hidden border-t border-[#E7E5DC] bg-[#F7F5EF] px-5 text-[#263B33] selection:bg-[#315E50] selection:text-white sm:px-8 lg:px-12 ${
        compact ? "py-8" : "py-14 lg:py-16"
      }`}
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-[240px] -left-[180px] h-[420px] w-[420px] rounded-full bg-[#719681]/10 blur-[120px]" />

        <div className="absolute -bottom-[220px] -right-[180px] h-[400px] w-[400px] rounded-full bg-[#D9C5A2]/20 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #315E50 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* TOP FOOTER */}
        {!compact && (
          <>
            <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              {/* BRAND */}
              <div>
                <Link href="/" className="group inline-flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-[#315E50] via-[#477865] to-[#719681] text-white shadow-[0_5px_18px_rgba(49,94,80,0.2)] transition-all duration-300 group-hover:-translate-y-0.5">
                    <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                    <Sparkles className="relative z-10 h-4 w-4" />
                  </div>

                  <span className="text-xl font-black tracking-tight text-[#263B33]">
                    Revio<span className="text-[#B97862]">.</span>
                  </span>
                </Link>

                <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#777D76]">
                  AI-powered resume intelligence platform engineered to help you
                  improve ATS compatibility and create stronger,
                  achievement-focused resumes.
                </p>

                <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#719681]/25 bg-white/65 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-[#719681] opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-[#477865]" />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#477865]">
                    AI Resume Intelligence
                  </span>
                </div>
              </div>

              {/* NAVIGATION */}
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#858A83]">
                    Product
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    <FooterLink href="/features">Features</FooterLink>
                    <FooterLink href="/pricing">Pricing</FooterLink>
                    <FooterLink href="/templates">Templates</FooterLink>
                    <FooterLink href="/register">Get started</FooterLink>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#858A83]">
                    Account
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    <FooterLink href="/login">Log in</FooterLink>
                    <FooterLink href="/register">Create account</FooterLink>
                    <FooterLink href="/dashboard/resume">Dashboard</FooterLink>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#858A83]">
                    Platform
                  </p>

                  <div className="mt-4 flex flex-col gap-3">
                    <FooterLink href="/features">
                      <span>Diagnostics</span>
                      <ArrowUpRight className="h-3 w-3 text-[#B97862]" />
                    </FooterLink>
                    <FooterLink href="/#how-it-works">ATS Engine</FooterLink>
                    <span className="font-mono text-xs text-[#858A83]">
                      STAR Matrix
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#D9D8CE] to-transparent" />
          </>
        )}

        {/* BOTTOM ROW */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-[#858A83]">
            <ShieldCheck className="h-4 w-4 text-[#719681]" />
            <span>
              &copy; {new Date().getFullYear()} Revio AI. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#858A83] sm:gap-6">
            <Link
              href="/privacy"
              className="transition-colors duration-200 hover:text-[#315E50]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors duration-200 hover:text-[#315E50]"
            >
              Terms of Service
            </Link>

            <Link
              href="/security"
              className="transition-colors duration-200 hover:text-[#315E50]"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
      className="group flex w-fit items-center gap-1.5 text-xs font-medium text-[#777D76] transition-all duration-200 hover:text-[#315E50]"
    >
      <span>{children}</span>
      <span className="h-px w-0 bg-gradient-to-r from-[#315E50] to-[#B97862] transition-all duration-300 group-hover:w-3" />
    </Link>
  );
}
