import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Revio
          </Link>

          <p className="mt-1 text-sm text-black/40">AI-powered career tools.</p>
        </div>

        <div className="flex gap-6 text-sm text-black/50">
          <Link href="/features" className="hover:text-black">
            Features
          </Link>

          <Link href="/pricing" className="hover:text-black">
            Pricing
          </Link>

          <Link href="/login" className="hover:text-black">
            Log in
          </Link>
        </div>
      </div>
    </footer>
  );
}
