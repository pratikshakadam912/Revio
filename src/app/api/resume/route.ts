import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TEMPLATES = [
  "minimal",
  "modern",
  "professional",
  "executive",
  "creative",
] as const;

const emptyResumeData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to create a resume.",
        },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid resume details.",
        },
        { status: 400 },
      );
    }

    const input = body as {
      title?: unknown;
      template?: unknown;
      data?: unknown;
    };

    const title =
      typeof input.title === "string" && input.title.trim()
        ? input.title.trim().slice(0, 120)
        : "Untitled Resume";

    const requestedTemplate =
      typeof input.template === "string"
        ? input.template.toLowerCase()
        : "minimal";

    if (
      !ALLOWED_TEMPLATES.includes(
        requestedTemplate as (typeof ALLOWED_TEMPLATES)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid resume template.",
        },
        { status: 400 },
      );
    }

    const data =
      input.data && typeof input.data === "object" && !Array.isArray(input.data)
        ? input.data
        : emptyResumeData;

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title,
        template: requestedTemplate,
        status: "DRAFT",
        data,
      },
      select: {
        id: true,
        title: true,
        template: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: resume.id,
        resume,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Revio] Resume creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create your resume. Please try again.",
      },
      { status: 500 },
    );
  }
}
