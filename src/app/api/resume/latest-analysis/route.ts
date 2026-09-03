import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // ========================================================
    // 1. AUTHENTICATION
    // ========================================================

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        {
          status: 401,
        },
      );
    }

    // ========================================================
    // 2. FIND LATEST COMPLETED ANALYSIS
    // ========================================================

    const analysis = await prisma.resumeAnalysis.findFirst({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        resume: true,
      },
    });

    // ========================================================
    // 3. NO ANALYSIS
    // ========================================================

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "No completed analysis found.",
        },
        {
          status: 404,
        },
      );
    }

    // ========================================================
    // 4. RAW AI RESULT
    // ========================================================

    const rawResult =
      analysis.rawResult &&
      typeof analysis.rawResult === "object" &&
      !Array.isArray(analysis.rawResult)
        ? analysis.rawResult
        : {};

    // ========================================================
    // 5. RETURN CLEAN RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,

      analysis: {
        id: analysis.id,

        status: analysis.status,

        overallScore: analysis.overallScore ?? 0,

        atsScore: analysis.atsScore ?? 0,

        contentScore: analysis.contentScore ?? 0,

        skillsScore: analysis.skillsScore ?? 0,

        experienceScore: analysis.experienceScore ?? 0,

        strengths: analysis.strengths ?? [],

        weaknesses: analysis.weaknesses ?? [],

        suggestions: analysis.suggestions ?? [],

        skills: analysis.skills ?? [],

        rawResult,
      },

      resume: {
        id: analysis.resume.id,

        fileName: analysis.resume.fileName,

        extractedText: analysis.resume.extractedText ?? "",
      },
    });
  } catch (error) {
    console.error("=================================");

    console.error("REVIO LATEST ANALYSIS ERROR");

    console.error("=================================");

    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch latest resume analysis.",
      },
      {
        status: 500,
      },
    );
  }
}
