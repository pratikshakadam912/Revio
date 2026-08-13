import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Revio
          </Link>

          <h1 className="mt-10 text-4xl font-semibold tracking-[-0.03em]">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-black/50">
            Start building better resumes with AI. You can explore Revio for
            free before upgrading.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-8 text-center text-sm text-black/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black transition hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
