import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { analyzeResume } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function isValidPdf(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) {
    return false;
  }

  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

export async function POST(request: NextRequest) {
  let analysisId: string | null = null;

  try {
    /* =====================================================
       AUTHENTICATION
    ===================================================== */

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

    /* =====================================================
       REQUEST BODY
    ===================================================== */

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

    if (typeof body !== "object" || body === null || !("resumeId" in body)) {
      return NextResponse.json(
        {
          success: false,
          error: "resumeId is required.",
        },
        { status: 400 },
      );
    }

    const resumeId =
      typeof (body as { resumeId?: unknown }).resumeId === "string"
        ? (body as { resumeId: string }).resumeId.trim()
        : "";

    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          error: "resumeId is required.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       FIND RESUME
       User can only analyze their own resume.
    ===================================================== */

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
          error:
            "The uploaded resume file could not be found. Please upload the resume again.",
        },
        { status: 400 },
      );
    }

    /* =====================================================
       CREATE PROCESSING RECORD
    ===================================================== */

    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        status: "PROCESSING",
      },
    });

    analysisId = analysis.id;

    /* =====================================================
       DOWNLOAD PDF
    ===================================================== */

    let pdfResponse: Response;

    try {
      pdfResponse = await fetch(resume.fileUrl, {
        method: "GET",
        cache: "no-store",
      });
    } catch (error) {
      throw new Error(
        `Unable to download the uploaded resume. ${
          error instanceof Error ? error.message : "Storage request failed."
        }`,
      );
    }

    if (!pdfResponse.ok) {
      throw new Error(
        `Unable to download the uploaded resume. Storage returned ${pdfResponse.status}.`,
      );
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();

    const pdfBuffer = Buffer.from(arrayBuffer);

    /* =====================================================
       VALIDATE PDF
    ===================================================== */

    if (!pdfBuffer.length) {
      throw new Error("The uploaded resume file is empty.");
    }

    if (!isValidPdf(pdfBuffer)) {
      throw new Error("The uploaded file is not a valid PDF.");
    }

    /* =====================================================
       ANALYZE RESUME
    ===================================================== */

    console.log(`[Revio] Starting resume analysis: ${resume.id}`);

    const result = await analyzeResume(pdfBuffer);

    /* =====================================================
       VALIDATE ANALYSIS RESULT
    ===================================================== */

    if (!result) {
      throw new Error("Resume analysis returned no result.");
    }

    if (!result.resume) {
      throw new Error("Resume analysis did not return resume data.");
    }

    if (!result.scores) {
      throw new Error("Resume analysis did not return scores.");
    }

    /* =====================================================
       SAVE COMPLETED ANALYSIS
    ===================================================== */

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

    /* =====================================================
       UPDATE RESUME ATS SCORE
    ===================================================== */

    await prisma.resume.update({
      where: {
        id: resume.id,
      },
      data: {
        atsScore: result.scores.ats,
      },
    });

    /* =====================================================
       FRONTEND RESPONSE
    ===================================================== */

    const responseResult = {
      id: updatedAnalysis.id,

      ...result,

      /*
       * Keep these top-level values because the analyzer
       * page can consume them directly.
       */
      overallScore: result.scores.overall,

      atsScore: result.scores.ats,

      contentScore: result.scores.content,

      skillsScore: result.scores.skills,

      experienceScore: result.scores.experience,

      educationScore: result.scores.education,

      /*
       * Explicit structured data for the frontend.
       */
      candidate: result.resume.candidate,

      education: result.resume.education,

      experience: result.resume.experience,

      projects: result.resume.projects,

      skills: result.resume.skills,

      skillCategories: result.resume.skillCategories,

      summary: result.resume.summary,

      recommendedRoles: result.roles,

      skillGaps: result.skillGaps,

      nextCareerMove: result.careerMove,
    };

    console.log(`[Revio] Resume analysis completed: ${resume.id}`);

    console.log(`[Revio] Sections: ${result.resume.sections.length}`);

    console.log(`[Revio] Education: ${result.resume.education.length}`);

    console.log(`[Revio] Experience: ${result.resume.experience.length}`);

    console.log(`[Revio] Projects: ${result.resume.projects.length}`);

    console.log(`[Revio] Recommended roles: ${result.roles.length}`);

    /* =====================================================
       RETURN
    ===================================================== */

    return NextResponse.json(
      {
        success: true,
        result: responseResult,
        analysis: responseResult,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("[Revio] Resume analysis failed:", error);

    /* =====================================================
       MARK ANALYSIS AS FAILED
    ===================================================== */

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
      {
        status: 500,
      },
    );
  }
}
