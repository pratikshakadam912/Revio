import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-3.6-flash";

type GeminiAnalysisResult = {
  overallScore: number;

  scores: {
    atsCompatibility: number;
    contentQuality: number;
    skillsStrength: number;
    experience: number;
    educationMatch: number;
  };

  candidate: {
    name: string;
    headline: string;
    location: string;
    summary: string;
  };

  education: Array<{
    degree: string;
    institution: string;
    date: string;
  }>;

  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;

  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;

  skills: string[];

  strengths: string[];

  weaknesses: string[];

  suggestions: string[];

  recommendedRoles: Array<{
    role: string;
    match: number;
    reason: string;
  }>;

  skillGaps: Array<{
    skill: string;
    currentLevel: number;
    importance: string;
    recommendation: string;
  }>;

  nextCareerMove: string;

  careerFocus: string;
};

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add GEMINI_API_KEY to .env.local and restart the development server.",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });
}

function isRetryableError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  return (
    message.includes("429") ||
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("overloaded") ||
    message.includes("temporarily unavailable") ||
    message.includes("deadline exceeded") ||
    message.includes("timeout")
  );
}

function isModelError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  return (
    message.includes("404") ||
    message.includes("not found") ||
    message.includes("not available") ||
    (message.includes("model") && message.includes("unavailable"))
  );
}

function isAuthError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  return (
    message.includes("401") ||
    message.includes("403") ||
    message.includes("api key") ||
    message.includes("permission denied") ||
    message.includes("unauthorized") ||
    message.includes("authentication")
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Gemini error";
  }
}

async function generateWithRetry(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string,
  maxRetries = 3,
) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;

      console.error(
        `[Revio] Gemini attempt ${attempt + 1}/${maxRetries + 1} failed`,
      );
      console.error(error);

      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError ?? new Error("Gemini request failed.");
}

function cleanJsonResponse(text: string) {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}

function clampScore(value: unknown, fallback = 0) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item ?? "").trim()).filter(Boolean);
}

function normalizeResult(input: any): GeminiAnalysisResult {
  const result = input ?? {};

  const scores = result.scores ?? {};

  const normalized: GeminiAnalysisResult = {
    overallScore: clampScore(result.overallScore),

    scores: {
      atsCompatibility: clampScore(scores.atsCompatibility),
      contentQuality: clampScore(scores.contentQuality),
      skillsStrength: clampScore(scores.skillsStrength),
      experience: clampScore(scores.experience),
      educationMatch: clampScore(scores.educationMatch),
    },

    candidate: {
      name: String(result.candidate?.name ?? "Unknown Candidate"),
      headline: String(result.candidate?.headline ?? ""),
      location: String(result.candidate?.location ?? ""),
      summary: String(result.candidate?.summary ?? ""),
    },

    education: Array.isArray(result.education)
      ? result.education.map((item: any) => ({
          degree: String(item?.degree ?? ""),
          institution: String(item?.institution ?? ""),
          date: String(item?.date ?? ""),
        }))
      : [],

    experience: Array.isArray(result.experience)
      ? result.experience.map((item: any) => ({
          company: String(item?.company ?? ""),
          role: String(item?.role ?? ""),
          duration: String(item?.duration ?? ""),
          description: String(item?.description ?? ""),
        }))
      : [],

    projects: Array.isArray(result.projects)
      ? result.projects.map((item: any) => ({
          name: String(item?.name ?? ""),
          description: String(item?.description ?? ""),
          technologies: stringArray(item?.technologies),
        }))
      : [],

    skills: stringArray(result.skills),

    strengths: stringArray(result.strengths),

    weaknesses: stringArray(result.weaknesses),

    suggestions: stringArray(result.suggestions),

    recommendedRoles: Array.isArray(result.recommendedRoles)
      ? result.recommendedRoles.map((item: any) => ({
          role: String(item?.role ?? ""),
          match: clampScore(item?.match),
          reason: String(item?.reason ?? ""),
        }))
      : [],

    skillGaps: Array.isArray(result.skillGaps)
      ? result.skillGaps.map((item: any) => ({
          skill: String(item?.skill ?? ""),
          currentLevel: clampScore(item?.currentLevel),
          importance: String(item?.importance ?? ""),
          recommendation: String(item?.recommendation ?? ""),
        }))
      : [],

    nextCareerMove: String(result.nextCareerMove ?? ""),

    careerFocus: String(result.careerFocus ?? ""),
  };

  return normalized;
}

function buildPrompt(resumeText: string) {
  return `
You are Revio, an advanced AI resume analyzer.

Analyze the following resume carefully.

Your task is to produce a structured JSON career intelligence report.

IMPORTANT:
- Do not invent experience, education, companies, dates, technologies, or achievements.
- Only use information actually present in the resume.
- If something is missing, return an empty string or empty array.
- Be realistic and conservative with scores.
- Scores must be integers from 0 to 100.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not wrap the JSON in code fences.

Required JSON structure:

{
  "overallScore": 0,

  "scores": {
    "atsCompatibility": 0,
    "contentQuality": 0,
    "skillsStrength": 0,
    "experience": 0,
    "educationMatch": 0
  },

  "candidate": {
    "name": "",
    "headline": "",
    "location": "",
    "summary": ""
  },

  "education": [
    {
      "degree": "",
      "institution": "",
      "date": ""
    }
  ],

  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": ""
    }
  ],

  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ],

  "skills": [],

  "strengths": [],

  "weaknesses": [],

  "suggestions": [],

  "recommendedRoles": [
    {
      "role": "",
      "match": 0,
      "reason": ""
    }
  ],

  "skillGaps": [
    {
      "skill": "",
      "currentLevel": 0,
      "importance": "",
      "recommendation": ""
    }
  ],

  "nextCareerMove": "",

  "careerFocus": ""
}

Scoring guidelines:

ATS Compatibility:
Evaluate formatting, keywords, structure, readability, standard headings, and ATS friendliness.

Content Quality:
Evaluate clarity, specificity, measurable impact, writing quality, and completeness.

Skills Strength:
Evaluate relevance, breadth, technical depth, and evidence of skill usage.

Experience:
Evaluate professional experience, project experience, responsibilities, achievements, and career progression.
Academic/project experience can count when formal employment is limited.

Education Match:
Evaluate how well the education aligns with the candidate's apparent career direction.

Overall Score:
Use your judgment across all dimensions.

Recommended Roles:
Recommend realistic roles based on the actual resume.
Provide between 3 and 5 roles.

Skill Gaps:
Identify practical skills that would materially improve employability.
Provide between 3 and 6 skill gaps.

Resume:

${resumeText}
`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized. Please sign in again.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const resumeId = body?.resumeId;

    if (!resumeId || typeof resumeId !== "string") {
      return NextResponse.json(
        {
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
          error: "Resume not found.",
        },
        { status: 404 },
      );
    }

    if (!resume.extractedText?.trim()) {
      return NextResponse.json(
        {
          error:
            "No resume text was extracted. Please upload the resume again.",
        },
        { status: 400 },
      );
    }

    console.log("==========================================");
    console.log("REVIO RESUME ANALYSIS");
    console.log("==========================================");
    console.log("Resume:", resume.fileName);
    console.log("Resume ID:", resume.id);
    console.log("Model:", GEMINI_MODEL);
    console.log("Extracted text length:", resume.extractedText.length);
    console.log("==========================================");

    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        status: "PROCESSING",
      },
    });

    try {
      const model = getGeminiModel();

      const prompt = buildPrompt(resume.extractedText);

      console.log("[Revio] Sending resume to Gemini...");
      console.log("[Revio] Model:", GEMINI_MODEL);

      const response = await generateWithRetry(model, prompt);

      const rawText = response.response.text();

      if (!rawText?.trim()) {
        throw new Error("Gemini returned an empty response.");
      }

      console.log("[Revio] Gemini response received.");

      let parsed: any;

      try {
        parsed = JSON.parse(cleanJsonResponse(rawText));
      } catch (jsonError) {
        console.error("[Revio] Failed to parse Gemini JSON.");
        console.error("[Revio] Raw response:", rawText);

        throw new Error(
          `Gemini returned invalid JSON: ${
            jsonError instanceof Error
              ? jsonError.message
              : "Unknown JSON parsing error"
          }`,
        );
      }

      const result = normalizeResult(parsed);

      await prisma.resumeAnalysis.update({
        where: {
          id: analysis.id,
        },

        data: {
          status: "COMPLETED",

          overallScore: result.overallScore,

          atsScore: result.scores.atsCompatibility,

          contentScore: result.scores.contentQuality,

          skillsScore: result.scores.skillsStrength,

          experienceScore: result.scores.experience,

          strengths: result.strengths,

          weaknesses: result.weaknesses,

          suggestions: result.suggestions,

          skills: result.skills,

          rawResult: result as any,
        },
      });

      await prisma.resume.update({
        where: {
          id: resume.id,
        },

        data: {
          atsScore: result.scores.atsCompatibility,
        },
      });

      console.log("==========================================");
      console.log("[Revio] ANALYSIS COMPLETED");
      console.log("[Revio] Overall:", result.overallScore);
      console.log("[Revio] ATS:", result.scores.atsCompatibility);
      console.log("[Revio] Skills:", result.scores.skillsStrength);
      console.log("[Revio] Experience:", result.scores.experience);
      console.log("==========================================");

      return NextResponse.json({
        success: true,

        analysis: {
          id: analysis.id,

          ...result,

          educationScore: result.scores.educationMatch,

          atsScore: result.scores.atsCompatibility,

          contentScore: result.scores.contentQuality,

          skillsScore: result.scores.skillsStrength,

          experienceScore: result.scores.experience,
        },
      });
    } catch (error) {
      console.error("==========================================");
      console.error("REVIO GEMINI ERROR");
      console.error("==========================================");
      console.error("Model:", GEMINI_MODEL);
      console.error("Error:", error);

      if (error instanceof Error) {
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
      }

      console.error("==========================================");

      await prisma.resumeAnalysis.update({
        where: {
          id: analysis.id,
        },

        data: {
          status: "FAILED",
          rawResult: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
      });

      const message = getErrorMessage(error);

      if (isAuthError(error)) {
        return NextResponse.json(
          {
            error:
              "Gemini authentication failed. Check that GEMINI_API_KEY is valid and belongs to a project with Gemini API access.",
            details: message,
          },
          { status: 500 },
        );
      }

      if (isModelError(error)) {
        return NextResponse.json(
          {
            error: `Gemini model "${GEMINI_MODEL}" is not available to this API key.`,
            details: message,
            model: GEMINI_MODEL,
            hint: "The model is currently listed by Google as a stable Gemini API model. This usually indicates an API-key/project access issue rather than a frontend issue.",
          },
          { status: 500 },
        );
      }

      if (message.includes("429")) {
        return NextResponse.json(
          {
            error:
              "Gemini free-tier rate limit reached. Please wait a moment and try again.",
            details: message,
          },
          { status: 429 },
        );
      }

      if (message.includes("503") || message.includes("overloaded")) {
        return NextResponse.json(
          {
            error:
              "Gemini is temporarily overloaded. Please try again in a few seconds.",
            details: message,
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          error: "Gemini analysis failed.",
          details: message,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("==========================================");
    console.error("REVIO ANALYZE ROUTE ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to analyze resume.",
      },
      { status: 500 },
    );
  }
}
