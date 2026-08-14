import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Revio
          </Link>

          <h1 className="mt-10 text-4xl font-semibold tracking-[-0.03em]">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Sign in to continue building your resume with Revio.
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-black/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black transition hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
