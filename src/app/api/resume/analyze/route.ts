import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // AUTHENTICATION

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

    // GET RESUME ID

    const body = await request.json();

    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          error: "resumeId is required.",
        },
        { status: 400 },
      );
    }

    //  FIND RESUME

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

    if (!resume.extractedText?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "No extracted resume text found.",
        },
        { status: 400 },
      );
    }

    //  FIND ANALYSIS

    let analysis = await prisma.resumeAnalysis.findFirst({
      where: {
        resumeId: resume.id,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create analysis if one doesn't exist
    if (!analysis) {
      analysis = await prisma.resumeAnalysis.create({
        data: {
          userId: session.user.id,
          resumeId: resume.id,
          status: "PENDING",
        },
      });
    }

    //  MARK AS PROCESSING

    await prisma.resumeAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "PROCESSING",
      },
    });

    //  GEMINI MODEL

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    //  AI PROMPT

    const prompt = `
You are Revio, an AI-powered resume analyzer.

Analyze the following resume carefully.

Your job is to evaluate the candidate based ONLY on information present in the resume.

Do not invent experience, skills, education, companies, projects, or achievements.

Return ONLY valid JSON.

The JSON must follow this exact structure:

{
  "overallScore": 0,
  "summary": "",
  "profile": {
    "education": {
      "label": "Education",
      "value": "",
      "detail": ""
    },
    "experience": {
      "label": "Experience",
      "value": "",
      "detail": ""
    },
    "careerFocus": {
      "label": "Career Focus",
      "value": "",
      "detail": ""
    }
  },
  "skills": [],
  "scores": {
    "atsCompatibility": 0,
    "skillsStrength": 0,
    "experience": 0,
    "educationMatch": 0
  },
  "recommendedRoles": [
    {
      "rank": "",
      "role": "",
      "match": 0,
      "description": "",
      "skills": []
    }
  ],
  "skillGaps": [
    {
      "name": "",
      "level": 0
    }
  ],
  "nextCareerMove": {
    "title": "",
    "description": ""
  }
}

SCORING RULES:

overallScore:
Give an overall resume quality score from 0-100.

atsCompatibility:
Evaluate formatting, keywords, sections, readability and ATS compatibility.

skillsStrength:
Evaluate how strong and relevant the listed skills are.

experience:
Evaluate the quality and relevance of the candidate's experience.

educationMatch:
Evaluate how relevant the education is to the candidate's apparent career direction.

IMPORTANT:

- Every score must be between 0 and 100.
- recommendedRoles should contain 3 realistic roles.
- skillGaps should contain 3-5 useful skills the candidate could improve.
- Do not invent information.
- If something is missing, clearly indicate that it is missing.
- Keep descriptions concise.
- Return ONLY JSON.
- Do not use markdown.
- Do not wrap the JSON in \`\`\`.

RESUME:

${resume.extractedText}
`;

    //  CALL GEMINI

    const result = await model.generateContent(prompt);

    const response = result.response;

    let text = response.text().trim();

    //  CLEAN GEMINI RESPONSE

    if (text.startsWith("```")) {
      text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    //  PARSE JSON

    let aiResult;

    try {
      aiResult = JSON.parse(text);
    } catch (parseError) {
      console.error("Gemini returned invalid JSON:", text);

      throw new Error("Gemini returned an invalid analysis.");
    }

    //  UPDATE DATABASE

    const updatedAnalysis = await prisma.resumeAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "COMPLETED",

        overallScore: aiResult.overallScore ?? null,
        atsScore: aiResult.scores?.atsCompatibility ?? null,
        contentScore: aiResult.overallScore ?? null,
        skillsScore: aiResult.scores?.skillsStrength ?? null,
        experienceScore: aiResult.scores?.experience ?? null,

        strengths: aiResult.strengths ?? [],
        weaknesses: aiResult.weaknesses ?? [],
        suggestions: aiResult.suggestions ?? [],
        skills: aiResult.skills ?? [],
        rawResult: aiResult,
      },
    });

    //  UPDATE RESUME SCORE

    await prisma.resume.update({
      where: {
        id: resume.id,
      },
      data: {
        atsScore: aiResult.scores?.atsCompatibility ?? null,
      },
    });

    //  RETURN RESULT

    return NextResponse.json({
      success: true,

      analysis: {
        id: updatedAnalysis.id,
        status: updatedAnalysis.status,
      },

      result: aiResult,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to analyze resume.",
      },
      { status: 500 },
    );
  }
}
