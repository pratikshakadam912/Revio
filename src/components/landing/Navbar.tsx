import Link from "next/link";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-5 py-3 shadow-sm backdrop-blur-xl">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Revio
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/features"
            className="text-sm text-black/60 transition hover:text-black"
          >
            Features
          </Link>

          <Link
            href="/pricing"
            className="text-sm text-black/60 transition hover:text-black"
          >
            Pricing
          </Link>

          <Link
            href="#templates"
            className="text-sm text-black/60 transition hover:text-black"
          >
            Templates
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-black/70 transition hover:text-black sm:block"
          >
            Log in
          </Link>

          <Button className="rounded-xl px-4 py-2">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
