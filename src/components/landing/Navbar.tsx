import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mt-4 flex h-[68px] w-full max-w-[1440px] items-center rounded-[18px] border border-[#756BFF]/10 bg-white/80 px-5 shadow-[0_10px_40px_rgba(76,70,150,0.08)] backdrop-blur-2xl sm:px-7 lg:px-9">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#756BFF] via-[#8175F5] to-[#9B8EF7] shadow-[0_6px_18px_rgba(117,107,255,0.22)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>

          <span className="text-xl font-semibold tracking-[-0.035em] text-[#171526]">
            Revio
          </span>
        </Link>

        {/* Center Navigation */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          <Link
            href="/features"
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#686477] transition-all duration-200 hover:bg-[#F4F2FF] hover:text-[#171526]"
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#686477] transition-all duration-200 hover:bg-[#F4F2FF] hover:text-[#171526]"
          >
            Pricing
          </Link>

          <Link
            href="#templates"
            className="rounded-lg px-5 py-2.5 text-sm font-medium text-[#686477] transition-all duration-200 hover:bg-[#F4F2FF] hover:text-[#171526]"
          >
            Templates
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/login"
            className="hidden px-2 py-2 text-sm font-medium text-[#686477] transition-colors duration-200 hover:text-[#171526] sm:block"
          >
            Log in
          </Link>

          <Button
            className="
              group
              h-11
              rounded-[12px]
              border-0
              bg-gradient-to-r
              from-[#756BFF]
              to-[#897DF5]
              px-6
              text-sm
              font-medium
              text-white
              shadow-[0_7px_20px_rgba(117,107,255,0.20)]
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:shadow-[0_10px_28px_rgba(117,107,255,0.28)]
            "
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
