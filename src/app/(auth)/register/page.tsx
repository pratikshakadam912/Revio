import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Revio
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-black/50 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-16">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
