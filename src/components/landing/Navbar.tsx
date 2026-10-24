"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from "lucide-react";

import { Button } from "../ui/Button";

const navigationLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "/templates" },
  { label: "How it works", href: "/#how-it-works" },
];

export function Navbar() {
  const pathname = usePathname();
  const [intro, setIntro] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIntro(false);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 w-full selection:bg-indigo-500 selection:text-white"
      >
        <motion.div
          initial={{ height: 92 }}
          animate={{ height: 72 }}
          transition={{
            delay: 0.35,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full overflow-visible border-b border-white/[0.08] bg-[#0A0D14]/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-indigo-600/15 blur-[80px]" />

          <div className="pointer-events-none absolute right-[12%] -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-[80px]" />

          <div className="relative flex h-[72px] w-full items-center px-5 sm:px-8 lg:px-12 xl:px-16">
            <Link
              href="/"
              aria-label="Revio home"
              className="group relative flex shrink-0 items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.25,
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.45)]"
              >
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/30 blur-sm" />
                <Sparkles className="relative z-10 h-4 w-4" />
              </motion.div>

              <AnimatePresence mode="wait">
                {intro ? (
                  <motion.span
                    key="intro"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-[22px] font-black tracking-tight text-white"
                  >
                    Revio<span className="text-cyan-400">.</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="brand"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ duration: 0.45 }}
                    className="overflow-hidden whitespace-nowrap text-[20px] font-black tracking-tight text-white"
                  >
                    Revio<span className="text-cyan-400">.</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <nav
              aria-label="Main navigation"
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
            >
              {navigationLinks.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.href}
                  active={
                    item.href !== "/#how-it-works" &&
                    (pathname === item.href ||
                      (item.href === "/templates" &&
                        pathname.startsWith("/templates")))
                  }
                >
                  {item.label}
                  {item.label === "Templates" && (
                    <ChevronDown className="h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-white sm:block"
              >
                Log in
              </Link>

              <Link href="/resume/new" className="hidden sm:block">
                <Button className="group relative h-10 overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 text-sm font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]">
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-slate-800 hover:text-white md:hidden"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5 text-cyan-400" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mx-3 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:hidden"
            >
              <nav aria-label="Mobile navigation">
                {navigationLinks.map((item) => (
                  <MobileLink
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    active={
                      item.href !== "/#how-it-works" && pathname === item.href
                    }
                  >
                    {item.label}
                  </MobileLink>
                ))}
              </nav>

              <div className="my-2 h-px bg-white/[0.08]" />

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center justify-between rounded-xl px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <span>Log in</span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>

              <Link
                href="/resume/new"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 text-sm font-bold text-white transition hover:opacity-90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <div className="h-[74px]" />
    </>
  );
}

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
        active ? "text-white" : "text-slate-400 hover:text-white"
      }`}
    >
      {children}
      <span
        className={`pointer-events-none absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all duration-300 ${
          active
            ? "w-5 opacity-100"
            : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
        }`}
      />
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group flex h-12 items-center justify-between rounded-xl px-4 text-sm font-medium transition-all ${
        active
          ? "bg-indigo-500/10 text-cyan-300"
          : "text-slate-300 hover:bg-indigo-500/10 hover:text-cyan-300"
      }`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-400" />
    </Link>
  );
}
