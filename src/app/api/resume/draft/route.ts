import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 },
      );
    }

    const resumeId = req.nextUrl.searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume ID is required.",
        },
        { status: 400 },
      );
    }

    const draft = await prisma.resumeDraft.findUnique({
      where: {
        userId_resumeId: {
          userId: session.user.id,
          resumeId,
        },
      },
    });

    if (!draft) {
      return NextResponse.json({
        success: true,
        draft: null,
      });
    }

    return NextResponse.json({
      success: true,
      draft: {
        id: draft.id,
        name: draft.name,
        data: draft.data,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (error) {
    console.error("RESUME DRAFT GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load resume draft.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const resumeId = String(body?.resumeId ?? "");
    const name = String(body?.name ?? "My Resume").trim();
    const data = body?.data;

    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume ID is required.",
        },
        { status: 400 },
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Resume data is required.",
        },
        { status: 400 },
      );
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
      select: {
        id: true,
        fileName: true,
      },
    });

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume not found.",
        },
        { status: 404 },
      );
    }

    const draft = await prisma.resumeDraft.upsert({
      where: {
        userId_resumeId: {
          userId: session.user.id,
          resumeId,
        },
      },
      create: {
        userId: session.user.id,
        resumeId,
        name: name || "My Resume",
        data,
      },
      update: {
        name: name || "My Resume",
        data,
      },
    });

    return NextResponse.json({
      success: true,
      draft: {
        id: draft.id,
        name: draft.name,
        data: draft.data,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (error) {
    console.error("RESUME DRAFT SAVE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save resume draft.",
      },
      { status: 500 },
    );
  }
}
