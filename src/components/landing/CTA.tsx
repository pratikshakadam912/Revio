import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-4xl text text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
          <Sparkles className="h-5 w-5" />
        </div>

        <h2 className="mt-7 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Your next opportunity
          <br />
          starts with your resume.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black/50">
          Build your resume with AI, analyze your strengths, and create
          something you're confident sending to employers.
        </p>

        <div className="mt-8">
          <Link href="/register">
            <Button className="h-12 rounded-xl px-6">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-xs text-black/40">
          Free AI credits included · No credit card required
        </p>
      </div>
    </section>
  );
}
