import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-black/40">Welcome back</p>

            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">
              {session.user.name || "there"}.
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Your career workspace is ready.
            </p>
          </div>

          <div className="rounded-xl border border-black/10 px-4 py-2 text-sm">
            {session.user.email}
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-sm text-black/45">Resume credits</p>
            <p className="mt-3 text-3xl font-semibold">5</p>
            <p className="mt-2 text-xs text-black/40">
              Free AI credits available
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-sm text-black/45">Resumes</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
            <p className="mt-2 text-xs text-black/40">
              Start building your first resume
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="text-sm text-black/45">AI tools</p>
            <p className="mt-3 text-3xl font-semibold">Available</p>
            <p className="mt-2 text-xs text-black/40">
              Explore your career toolkit
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
