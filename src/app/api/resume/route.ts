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

type AllowedTemplate = (typeof ALLOWED_TEMPLATES)[number];

type ResumeRequestBody = {
  resumeId?: unknown;
  title?: unknown;
  template?: unknown;
  data?: unknown;
};

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

function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function normalizeTemplate(value: unknown): AllowedTemplate | null {
  if (typeof value !== "string") return null;

  const normalized = value.toLowerCase();

  return ALLOWED_TEMPLATES.includes(normalized as AllowedTemplate)
    ? (normalized as AllowedTemplate)
    : null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function readBody(
  request: NextRequest,
): Promise<ResumeRequestBody | null> {
  try {
    const body: unknown = await request.json();
    return isPlainObject(body) ? body : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return jsonError("Please log in to continue.", 401);
    }

    const resumeId = request.nextUrl.searchParams.get("resumeId");

    if (!resumeId?.trim()) {
      return jsonError("Resume ID is required.", 400);
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
      select: {
        id: true,
        title: true,
        template: true,
        status: true,
        data: true,
        updatedAt: true,
      },
    });

    if (!resume) {
      return jsonError("Resume not found.", 404);
    }

    return NextResponse.json({
      success: true,
      resume: {
        ...resume,
        data: resume.data ?? emptyResumeData,
      },
    });
  } catch (error) {
    console.error("[Revio] Resume load failed:", error);
    return jsonError("Failed to load the resume.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return jsonError("You must be logged in to create a resume.", 401);
    }

    const body = await readBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim().slice(0, 120)
        : "Untitled Resume";

    const template =
      body.template === undefined
        ? "minimal"
        : normalizeTemplate(body.template);

    if (!template) {
      return jsonError("Invalid resume template.", 400);
    }

    const data =
      body.data === undefined || body.data === null
        ? emptyResumeData
        : isPlainObject(body.data)
          ? body.data
          : null;

    if (!data) {
      return jsonError("Resume data must be a valid object.", 400);
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        template,
        status: "DRAFT",
        data: data as any,
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

    return jsonError("Failed to create your resume. Please try again.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return jsonError("Please log in to save your resume.", 401);
    }

    const body = await readBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    const resumeId =
      typeof body.resumeId === "string" ? body.resumeId.trim() : "";

    if (!resumeId) {
      return jsonError("Resume ID is required.", 400);
    }

    const updateData: {
      title?: string;
      template?: AllowedTemplate;
      data?: Record<string, unknown>;
    } = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();

      if (!title) {
        return jsonError("Resume title cannot be empty.", 400);
      }

      updateData.title = title.slice(0, 120);
    }

    if (body.template !== undefined) {
      const template = normalizeTemplate(body.template);

      if (!template) {
        return jsonError("Invalid resume template.", 400);
      }

      updateData.template = template;
    }

    if (body.data !== undefined) {
      if (!isPlainObject(body.data)) {
        return jsonError("Resume data must be a valid object.", 400);
      }

      updateData.data = body.data;
    }

    if (Object.keys(updateData).length === 0) {
      return jsonError("No valid resume changes were provided.", 400);
    }

    const result = await prisma.resume.updateMany({
      where: {
        id: resumeId,
        userId,
      },
      data: updateData as any,
    });

    if (result.count === 0) {
      return jsonError("Resume not found.", 404);
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId,
      },
      select: {
        id: true,
        title: true,
        template: true,
        status: true,
        data: true,
        updatedAt: true,
      },
    });

    if (!resume) {
      return jsonError("Resume not found.", 404);
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("[Revio] Resume save failed:", error);

    return jsonError("Failed to save your resume. Please try again.", 500);
  }
}
