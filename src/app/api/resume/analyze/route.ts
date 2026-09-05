import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { analyzeResume } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Safely gets an error message.
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

// Downloads the resume PDF.
async function downloadResume(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(
      `Unable to download resume file. Status: ${response.status}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  if (!arrayBuffer.byteLength) {
    throw new Error("The resume file is empty.");
  }

  return Buffer.from(arrayBuffer);
}

export async function POST(request: NextRequest) {
  let analysisId: string | null = null;

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Please sign in again.",
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

    const resumeId =
      typeof body === "object" &&
      body !== null &&
      "resumeId" in body &&
      typeof (body as { resumeId?: unknown }).resumeId === "string"
        ? (body as { resumeId: string }).resumeId
        : null;

    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          error: "resumeId is required.",
        },
        { status: 400 },
      );
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
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

    if (!resume.fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume file URL is missing.",
        },
        { status: 400 },
      );
    }

    if (resume.fileType && !resume.fileType.toLowerCase().includes("pdf")) {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF resumes are currently supported.",
        },
        { status: 400 },
      );
    }

    console.log("==========================================");
    console.log("REVIO RESUME ANALYSIS");
    console.log("==========================================");
    console.log("Resume:", resume.fileName);
    console.log("Resume ID:", resume.id);
    console.log("Engine: Revio TypeScript Analyzer");
    console.log("File type:", resume.fileType);
    console.log("==========================================");

    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        status: "PROCESSING",
      },
    });

    analysisId = analysis.id;

    console.log("[Revio] Downloading resume...");

    const pdfBuffer = await downloadResume(resume.fileUrl);

    console.log("[Revio] Resume downloaded:", pdfBuffer.length, "bytes");

    console.log("[Revio] Running local analysis engine...");

    const result = await analyzeResume(pdfBuffer);

    console.log("[Revio] Local analysis completed.");

    const updatedAnalysis = await prisma.resumeAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "COMPLETED",
        overallScore: result.scores.overall,
        atsScore: result.scores.ats,
        contentScore: result.scores.content,
        skillsScore: result.scores.skills,
        experienceScore: result.scores.experience,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
        skills: result.resume.skills,
        rawResult: result as any,
      },
    });

    await prisma.resume.update({
      where: {
        id: resume.id,
      },
      data: {
        atsScore: result.scores.ats,
        extractedText: result.resume.cleanText,
      },
    });

    const responseResult = {
      id: updatedAnalysis.id,
      ...result,

      overallScore: result.scores.overall,

      atsScore: result.scores.ats,
      contentScore: result.scores.content,
      skillsScore: result.scores.skills,
      experienceScore: result.scores.experience,
      educationScore: result.scores.education,
      projectsScore: result.scores.projects,

      skills: result.resume.skills,
      projects: result.resume.projects,
      education: result.resume.education,
      experience: result.resume.experience,
    };

    console.log("==========================================");
    console.log("[Revio] ANALYSIS COMPLETED");
    console.log("[Revio] Overall:", result.scores.overall);
    console.log("[Revio] ATS:", result.scores.ats);
    console.log("[Revio] Skills:", result.scores.skills);
    console.log("[Revio] Experience:", result.scores.experience);
    console.log("[Revio] Projects:", result.resume.projects.length);
    console.log("==========================================");

    return NextResponse.json({
      success: true,
      result: responseResult,
      analysis: responseResult,
    });
  } catch (error) {
    console.error("==========================================");
    console.error("REVIO ANALYSIS ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    if (analysisId) {
      try {
        await prisma.resumeAnalysis.update({
          where: {
            id: analysisId,
          },
          data: {
            status: "FAILED",
            rawResult: {
              error: getErrorMessage(error),
            },
          },
        });
      } catch (dbError) {
        console.error("[Revio] Failed to update analysis status:", dbError);
      }
    }

    const message = getErrorMessage(error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to analyze the resume.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
