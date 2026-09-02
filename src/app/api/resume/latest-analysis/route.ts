import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Authenticate
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
    //completed analysis

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

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          error: "No completed analysis found.",
        },
        { status: 404 },
      );
    }
    //Raw AI Result

    const rawResult =
      analysis.rawResult &&
      typeof analysis.rawResult === "object" &&
      !Array.isArray(analysis.rawResult)
        ? analysis.rawResult
        : {};
    // Return clean response

    return NextResponse.json({
      success: true,

      analysis: {
        id: analysis.id,
        status: analysis.status,

        overallScore: analysis.overallScore,
        atsScore: analysis.atsScore,
        contentScore: analysis.contentScore,
        skillsScore: analysis.skillsScore,
        experienceScore: analysis.experienceScore,

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
    console.error("Latest analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch latest resume analysis.",
      },
      { status: 500 },
    );
  }
}
