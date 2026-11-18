"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Command, Menu, X } from "lucide-react";

const navigationLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "/templates" },
  { label: "How it works", href: "/#how-it-works" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <>
      {/* =====================================================
          DESKTOP + MOBILE NAVBAR
      ===================================================== */}

      <motion.header
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease,
        }}
        className="fixed inset-x-0 top-0 z-50 w-full selection:bg-[#315E50] selection:text-white"
      >
        {/* Premium glass header */}
        <div className="relative border-b border-[#E5E5D9]/80 bg-[#FAF9F5]/85 shadow-[0_4px_24px_rgba(49,94,80,0.035)] backdrop-blur-2xl">
          {/* Top specular highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Subtle bottom accent */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B9D0BD]/40 to-transparent" />

          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
            {/* =================================================
                BRAND LOGO
            ================================================= */}

            <Link
              href="/"
              aria-label="Revio home"
              className="group flex shrink-0 items-center gap-3"
            >
              <motion.div
                whileHover={
                  reduceMotion ? undefined : { scale: 1.06, rotate: -3 }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#527763]/20 bg-gradient-to-br from-[#527763] via-[#315E50] to-[#264B3F] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_5px_14px_rgba(49,94,80,0.20)]"
              >
                <Command className="h-[17px] w-[17px] text-[#F4F5EC]" />

                {/* Small ambient glow */}
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>

              <div className="flex flex-col">
                <span className="text-[20px] font-bold tracking-[-0.045em] text-[#29342E] transition-colors duration-300 group-hover:text-[#56836A]">
                  Revio
                </span>

                <span className="-mt-0.5 font-mono text-[8px] font-medium tracking-[0.22em] text-[#98A096]">
                  CAREER INTELLIGENCE
                </span>
              </div>
            </Link>

            {/* =================================================
                CENTER NAVIGATION
            ================================================= */}

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 rounded-full border border-[#E5E6DC]/90 bg-white/65 p-1 shadow-[inset_0_1px_2px_rgba(49,94,80,0.025),0_2px_8px_rgba(49,94,80,0.025)] backdrop-blur-xl md:flex"
            >
              {navigationLinks.map((item) => {
                const active =
                  item.href !== "/#how-it-works" &&
                  (pathname === item.href ||
                    (item.href === "/templates" &&
                      pathname.startsWith("/templates")));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
                      active
                        ? "bg-[#EAF1E9] text-[#315E50] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(49,94,80,0.05)]"
                        : "text-[#778178] hover:bg-[#F1F3EC] hover:text-[#315E50]"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        className="absolute inset-0 rounded-full bg-[#EAF1E9]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="relative z-10">{item.label}</span>

                    {item.label === "Templates" && (
                      <ChevronDown className="relative z-10 h-3 w-3 text-[#9AA59A] transition-transform duration-300 group-hover:rotate-180" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* =================================================
                RIGHT ACTIONS
            ================================================= */}

            <div className="flex items-center gap-3">
              {/* Login */}
              <Link
                href="/login"
                className="hidden rounded-lg px-3.5 py-2 text-[13px] font-semibold text-[#778178] transition-colors duration-300 hover:text-[#315E50] sm:block"
              >
                Log in
              </Link>

              {/* Primary CTA */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block"
              >
                <Link
                  href="/resume/new"
                  className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-[#315E50] px-4 text-[13px] font-semibold text-white shadow-[0_5px_16px_rgba(49,94,80,0.18)] transition-all duration-300 hover:bg-[#264B3F] hover:shadow-[0_8px_22px_rgba(49,94,80,0.25)]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">Get Started</span>

                  <ArrowRight className="relative ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Mobile menu button */}
              <motion.button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E5DA] bg-white/75 text-[#53675A] shadow-sm transition-all duration-300 hover:border-[#B9D0BD] hover:bg-[#EDF4ED] hover:text-[#315E50] md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={
                        reduceMotion ? false : { rotate: -90, opacity: 0 }
                      }
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-[18px] w-[18px]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={
                        reduceMotion ? false : { rotate: 90, opacity: 0 }
                      }
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-[18px] w-[18px]" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE DRAWER
        ===================================================== */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation"
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease }}
              className="mx-4 mt-2 overflow-hidden rounded-2xl border border-[#E4E6DC] bg-[#FFFEFB]/95 p-3 shadow-[0_18px_50px_rgba(49,94,80,0.13)] backdrop-blur-2xl md:hidden"
            >
              {/* Mobile brand header */}
              <div className="mb-2 flex items-center justify-between border-b border-[#ECEAE1] px-2 pb-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#315E50] text-white">
                    <Command className="h-3.5 w-3.5" />
                  </div>

                  <span className="text-sm font-bold tracking-tight text-[#344139]">
                    Revio
                  </span>
                </div>

                <span className="font-mono text-[9px] tracking-wider text-[#A0A99F]">
                  NAVIGATION
                </span>
              </div>

              {/* Mobile links */}
              <nav aria-label="Mobile navigation" className="space-y-1">
                {navigationLinks.map((item, index) => {
                  const active =
                    item.href !== "/#how-it-works" &&
                    (pathname === item.href ||
                      (item.href === "/templates" &&
                        pathname.startsWith("/templates")));

                  return (
                    <motion.div
                      key={item.label}
                      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : index * 0.045,
                        duration: 0.2,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`group flex h-12 items-center justify-between rounded-xl px-3.5 text-sm font-medium transition-all duration-200 ${
                          active
                            ? "bg-[#EAF1E9] text-[#315E50]"
                            : "text-[#657268] hover:bg-[#F2F4EE] hover:text-[#315E50]"
                        }`}
                      >
                        <span>{item.label}</span>

                        <ArrowRight
                          className={`h-4 w-4 transition-all duration-200 group-hover:translate-x-1 ${
                            active ? "text-[#56836A]" : "text-[#ADB5A9]"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#E4E5DA] to-transparent" />

              {/* Mobile CTA actions */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center rounded-xl border border-[#E1E4D9] bg-white text-sm font-semibold text-[#607066] transition-all duration-200 hover:border-[#B9D0BD] hover:bg-[#F4F6F0] hover:text-[#315E50]"
                >
                  Log in
                </Link>

                <Link
                  href="/resume/new"
                  onClick={() => setMobileOpen(false)}
                  className="group flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#315E50] text-sm font-semibold text-white shadow-[0_4px_12px_rgba(49,94,80,0.15)] transition-all duration-200 hover:bg-[#264B3F]"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Footer detail */}
              <p className="mt-3 text-center font-mono text-[9px] tracking-[0.14em] text-[#A2AA9F]">
                BUILD YOUR NEXT OPPORTUNITY
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Header spacing */}
      <div className="h-[72px]" />
    </>
  );
}
