"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from "lucide-react";

import { Button } from "../ui/Button";

export function Navbar() {
  const [intro, setIntro] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ============================================================
          STICKY FULL-WIDTH GLASS HEADER
      ============================================================ */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 w-full selection:bg-indigo-500 selection:text-white"
      >
        {/* ==========================================================
            CONTAINER SHELL WITH GLOW & GLASSMORPHISM
        ========================================================== */}
        <motion.div
          initial={{ height: 92 }}
          animate={{ height: 72 }}
          transition={{
            delay: 0.35,
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0D14]/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        >
          {/* Top subtle neon highlight edge */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          {/* Background Ambient Violet & Cyan Glows */}
          <div className="pointer-events-none absolute -left-20 -top-28 h-64 w-64 rounded-full bg-indigo-600/15 blur-[80px]" />
          <div className="pointer-events-none absolute right-[12%] -top-24 h-56 w-56 rounded-full bg-cyan-500/10 blur-[80px]" />

          {/* ========================================================
              NAVBAR CORE INNER BAR
          ======================================================== */}
          <div className="relative flex h-full w-full items-center px-5 sm:px-8 lg:px-12 xl:px-16">
            {/* BRAND LOGO */}
            <Link
              href="/"
              className="group relative flex shrink-0 items-center gap-3"
            >
              {/* Logo Emblem */}
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

              {/* Brand Typography */}
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
                    Revio
                    <span className="text-cyan-400">.</span>
                  </motion.span>
                ) : (
                  <motion.div
                    key="brand"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    transition={{ duration: 0.45 }}
                    className="overflow-hidden"
                  >
                    <span className="text-[20px] font-black tracking-tight text-white">
                      Revio
                      <span className="text-cyan-400">.</span>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* DESKTOP MENU LINKS */}
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="#templates">
                <span className="flex items-center gap-1.5">
                  Templates
                  <ChevronDown className="h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </span>
              </NavLink>
              <NavLink href="#how-it-works">How it works</NavLink>
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-white sm:block"
              >
                Log in
              </Link>

              <Button className="group relative h-10 overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 px-5 text-sm font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]">
                {/* Shimmer sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>

              {/* MOBILE HAMBURGER BUTTON */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
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

        {/* ============================================================
            MOBILE EXPANDABLE MENU
        ============================================================ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-3 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:hidden"
            >
              <MobileLink href="/features" onClick={() => setMobileOpen(false)}>
                Features
              </MobileLink>

              <MobileLink href="/pricing" onClick={() => setMobileOpen(false)}>
                Pricing
              </MobileLink>

              <MobileLink
                href="#templates"
                onClick={() => setMobileOpen(false)}
              >
                Templates
              </MobileLink>

              <MobileLink
                href="#how-it-works"
                onClick={() => setMobileOpen(false)}
              >
                How it works
              </MobileLink>

              <div className="my-2 h-px bg-white/[0.08]" />

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 items-center justify-between rounded-xl px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <span>Log in</span>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent body content from clipping underneath */}
      <div className="h-[74px]" />
    </>
  );
}

/* ====================================================================
   DESKTOP NAV LINK
==================================================================== */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl px-4 py-2 text-[13px] font-semibold text-slate-400 transition-all duration-200 hover:text-white"
    >
      {children}
      {/* Active hover neon underline indicator */}
      <span className="pointer-events-none absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
    </Link>
  );
}

/* ====================================================================
   MOBILE EXPANDED LINK
==================================================================== */

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex h-12 items-center justify-between rounded-xl px-4 text-sm font-medium text-slate-300 transition-all hover:bg-indigo-500/10 hover:text-cyan-300"
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-cyan-400" />
    </Link>
  );
}
