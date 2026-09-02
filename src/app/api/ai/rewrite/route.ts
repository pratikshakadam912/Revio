import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// ============================================================
// GEMINI CONFIGURATION
// ============================================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const GEMINI_MODEL = "gemini-3.6-flash";

// ============================================================
// TYPES
// ============================================================

type RewriteRequest = {
  text?: string;

  type?: "experience" | "project" | "summary" | "achievement" | "general";

  targetRole?: string;

  tone?: "professional" | "technical" | "leadership" | "concise";

  generateAlternatives?: boolean;
};

type RewriteResult = {
  original: string;
  rewritten: string;
  alternatives: string[];
  actionVerb: string;
  skills: string[];
  improvements: string[];
  atsKeywords: string[];
};

// ============================================================
// HELPERS
// ============================================================

/**
 * Removes markdown code fences from Gemini JSON responses.
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  return cleaned;
}

/**
 * Retry Gemini requests when the API temporarily returns
 * 429 / 5xx / high-demand errors.
 */
async function generateWithRetry(
  model: ReturnType<typeof genAI.getGenerativeModel>,
  prompt: string,
  maxRetries = 3,
) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;

      const message = error instanceof Error ? error.message : String(error);

      const lowerMessage = message.toLowerCase();

      const isTemporaryError =
        message.includes("429") ||
        message.includes("500") ||
        message.includes("502") ||
        message.includes("503") ||
        message.includes("504") ||
        lowerMessage.includes("high demand") ||
        lowerMessage.includes("service unavailable") ||
        lowerMessage.includes("temporarily unavailable") ||
        lowerMessage.includes("overloaded");

      // Don't retry permanent errors such as authentication,
      // invalid API key, malformed request, etc.
      if (!isTemporaryError || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff:
      //
      // attempt 0 -> 1.5 sec
      // attempt 1 -> 3 sec
      // attempt 2 -> 6 sec
      //
      const delay = 1500 * Math.pow(2, attempt);

      console.log(
        `Gemini temporarily unavailable. ` +
          `Retry ${attempt + 1}/${maxRetries} ` +
          `in ${delay}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini request failed.");
}

/**
 * Makes sure the AI response matches the expected structure.
 */
function normalizeRewriteResult(
  aiResult: Partial<RewriteResult>,
  originalText: string,
  generateAlternatives: boolean,
): RewriteResult {
  const alternatives = Array.isArray(aiResult.alternatives)
    ? aiResult.alternatives
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const skills = Array.isArray(aiResult.skills)
    ? aiResult.skills
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 15)
    : [];

  const improvements = Array.isArray(aiResult.improvements)
    ? aiResult.improvements
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  const atsKeywords = Array.isArray(aiResult.atsKeywords)
    ? aiResult.atsKeywords
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 15)
    : [];

  return {
    original:
      typeof aiResult.original === "string" && aiResult.original.trim()
        ? aiResult.original.trim()
        : originalText,

    rewritten:
      typeof aiResult.rewritten === "string" && aiResult.rewritten.trim()
        ? aiResult.rewritten.trim()
        : originalText,

    alternatives: generateAlternatives ? alternatives : [],

    actionVerb:
      typeof aiResult.actionVerb === "string" ? aiResult.actionVerb.trim() : "",

    skills,

    improvements,

    atsKeywords,
  };
}

// ============================================================
// POST
// ============================================================

export async function POST(request: NextRequest) {
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
        { status: 401 },
      );
    }

    // ========================================================
    // 2. READ REQUEST BODY
    // ========================================================

    let body: RewriteRequest;

    try {
      body = (await request.json()) as RewriteRequest;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "Text to rewrite is required.",
        },
        { status: 400 },
      );
    }

    // Prevent unnecessarily large Gemini prompts.
    if (text.length > 3000) {
      return NextResponse.json(
        {
          success: false,
          error: "Text is too long. Please provide a shorter resume section.",
        },
        { status: 400 },
      );
    }

    const type = body.type || "general";

    const targetRole = body.targetRole?.trim() || "";

    const tone = body.tone || "professional";

    const generateAlternatives = body.generateAlternatives !== false;

    // ========================================================
    // 3. FIND USER'S LATEST COMPLETED ANALYSIS
    // ========================================================

    const latestAnalysis = await prisma.resumeAnalysis.findFirst({
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

    if (!latestAnalysis) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No completed resume analysis found. Please analyze your resume first.",
        },
        { status: 404 },
      );
    }

    // ========================================================
    // 4. GET AI ANALYSIS CONTEXT
    // ========================================================

    const rawResult =
      latestAnalysis.rawResult &&
      typeof latestAnalysis.rawResult === "object" &&
      !Array.isArray(latestAnalysis.rawResult)
        ? latestAnalysis.rawResult
        : {};

    const detectedSkills = Array.isArray(latestAnalysis.skills)
      ? latestAnalysis.skills
      : [];

    const strengths = Array.isArray(latestAnalysis.strengths)
      ? latestAnalysis.strengths
      : [];

    const weaknesses = Array.isArray(latestAnalysis.weaknesses)
      ? latestAnalysis.weaknesses
      : [];

    const suggestions = Array.isArray(latestAnalysis.suggestions)
      ? latestAnalysis.suggestions
      : [];

    const extractedResume = latestAnalysis.resume.extractedText?.trim() || "";

    // Keep the context large enough to understand the resume,
    // while avoiding unnecessarily huge prompts.
    const resumeContext = extractedResume.slice(0, 15000);

    // ========================================================
    // 5. CREATE GEMINI MODEL
    // ========================================================

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    // ========================================================
    // 6. BUILD PROMPT
    // ========================================================

    const prompt = `
You are Revio, an expert resume writer, recruiter and ATS optimization assistant.

Your task is to rewrite a piece of resume content.

The rewritten version must be:

- professional
- concise
- ATS-friendly
- recruiter-friendly
- impact-oriented
- specific
- easy to understand
- grammatically correct
- appropriate for the target role
- based ONLY on facts contained in the provided resume/context

============================================================
CRITICAL ANTI-FABRICATION RULE
============================================================

NEVER invent information.

Do NOT create or assume:

- percentages
- metrics
- numbers
- users
- revenue
- cost savings
- performance improvements
- company names
- technologies
- programming languages
- frameworks
- tools
- responsibilities
- awards
- achievements
- leadership responsibilities
- project outcomes
- dates
- job titles
- certifications
- qualifications

If a measurable result is NOT present in the original content or resume,
DO NOT create one.

If the original content says:

"Optimized API performance."

You may rewrite it as:

"Optimized API performance by identifying and resolving backend bottlenecks."

But you MUST NOT write:

"Improved API performance by 40%."

because the 40% was not provided.

============================================================
CONTENT TYPE
============================================================

${type}

============================================================
TARGET ROLE
============================================================

${targetRole || "Not specified"}

If a target role is provided:

- prioritize relevant terminology
- improve keyword alignment
- emphasize relevant existing skills

BUT:

Never add a skill, technology, responsibility or experience
that the candidate does not actually have.

============================================================
TONE
============================================================

${tone}

============================================================
STAR FRAMEWORK
============================================================

Use the STAR framework when naturally possible.

Situation:
What was being worked on?

Task:
What responsibility or objective did the candidate have?

Action:
What did the candidate actually do?

Result:
What measurable or observable outcome happened?

IMPORTANT:

Do NOT invent the Result.

If the resume does not provide a measurable result,
focus on the Action + Task + Context.

============================================================
PROJECT WRITING
============================================================

If the content is a PROJECT:

Make the rewritten version clearly explain:

1. What the project was.
2. What problem or purpose it addressed.
3. What the candidate personally built or contributed.
4. Technologies actually used.
5. Any real outcome or impact mentioned in the resume.

Do NOT merely list technologies.

Bad:

"Built a web application using React and Node.js."

Better:

"Developed a web application using React and Node.js, implementing the core application functionality and backend integration."

Only include the additional details if they are supported by the resume.

============================================================
EXPERIENCE WRITING
============================================================

If the content is EXPERIENCE:

Make the rewritten version communicate:

- responsibility
- action
- technical contribution
- business contribution when explicitly provided
- outcome when explicitly provided

Avoid vague phrases such as:

"Worked on..."
"Responsible for..."
"Helped with..."

Replace them with stronger action verbs when the facts support it.

============================================================
SUMMARY WRITING
============================================================

If the content is a SUMMARY:

Create a concise professional summary that reflects:

- actual experience
- actual skills
- actual career direction
- actual education when relevant

Do not create seniority that is not supported.

============================================================
ACHIEVEMENT WRITING
============================================================

If the content is an ACHIEVEMENT:

Make the achievement clear and impactful.

Preserve all original numbers and metrics.

Never invent new metrics.

============================================================
ORIGINAL CONTENT
============================================================

${text}

============================================================
RESUME CONTEXT
============================================================

Detected skills:

${JSON.stringify(detectedSkills)}

Strengths:

${JSON.stringify(strengths)}

Weaknesses:

${JSON.stringify(weaknesses)}

Suggestions:

${JSON.stringify(suggestions)}

AI analysis:

${JSON.stringify(rawResult)}

Full extracted resume context:

${resumeContext || "No extracted resume text available."}

============================================================
OUTPUT REQUIREMENTS
============================================================

Return ONLY valid JSON.

Do not use markdown.

Do not use code fences.

Use EXACTLY this structure:

{
  "original": "",
  "rewritten": "",
  "alternatives": [],
  "actionVerb": "",
  "skills": [],
  "improvements": [],
  "atsKeywords": []
}

============================================================
FIELD RULES
============================================================

original:

Return the original text exactly or as closely as possible.

rewritten:

Return the strongest rewritten version.

For experience/project/achievement content,
prefer one strong resume bullet unless the original content
is clearly a paragraph.

alternatives:

${
  generateAlternatives
    ? "Return exactly 2 alternative rewrites."
    : "Return an empty array."
}

actionVerb:

Return the strongest primary action verb used in the rewritten content.

skills:

Return ONLY skills explicitly supported by the candidate's resume
and relevant to the rewritten content.

improvements:

List concise improvements made to the original.

Examples:

[
  "Replaced weak phrasing with stronger action verbs.",
  "Improved ATS keyword alignment.",
  "Clarified the candidate's technical contribution."
]

atsKeywords:

Return useful ATS keywords that are already supported by
the candidate's resume.

Do NOT invent keywords.

============================================================
FINAL SAFETY CHECK
============================================================

Before returning JSON, verify:

1. No invented metrics.
2. No invented technologies.
3. No invented responsibilities.
4. No invented achievements.
5. No invented companies.
6. No invented job titles.
7. No unsupported skills.
8. Original meaning is preserved.
9. Rewritten text is stronger than the original.
10. Output is valid JSON only.
`;

    // ========================================================
    // 7. CALL GEMINI WITH RETRIES
    // ========================================================

    const result = await generateWithRetry(model, prompt);

    const response = result.response;

    let responseText = response.text().trim();

    // ========================================================
    // 8. CLEAN GEMINI RESPONSE
    // ========================================================

    responseText = cleanJsonResponse(responseText);

    // ========================================================
    // 9. PARSE JSON
    // ========================================================

    let aiResult: Partial<RewriteResult>;

    try {
      aiResult = JSON.parse(responseText) as Partial<RewriteResult>;
    } catch {
      console.error("Gemini returned invalid JSON:", responseText);

      throw new Error(
        "Gemini returned an invalid rewrite response. Please try again.",
      );
    }

    // ========================================================
    // 10. NORMALIZE RESPONSE
    // ========================================================

    const normalizedResult = normalizeRewriteResult(
      aiResult,
      text,
      generateAlternatives,
    );

    // ========================================================
    // 11. FINAL VALIDATION
    // ========================================================

    if (!normalizedResult.rewritten.trim()) {
      throw new Error("AI did not return a rewritten resume section.");
    }

    // ========================================================
    // 12. RETURN SUCCESS
    // ========================================================

    return NextResponse.json({
      success: true,

      result: normalizedResult,

      metadata: {
        resumeId: latestAnalysis.resumeId,

        analysisId: latestAnalysis.id,

        contentType: type,

        targetRole: targetRole || null,

        tone,

        model: GEMINI_MODEL,
      },
    });
  } catch (error) {
    // ========================================================
    // ERROR HANDLING
    // ========================================================

    console.error("AI rewrite error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to rewrite resume content.";

    // Gemini temporary availability errors
    const isTemporaryGeminiError =
      errorMessage.includes("503") ||
      errorMessage.includes("429") ||
      errorMessage.includes("500") ||
      errorMessage.includes("502") ||
      errorMessage.includes("504") ||
      errorMessage.toLowerCase().includes("high demand") ||
      errorMessage.toLowerCase().includes("service unavailable") ||
      errorMessage.toLowerCase().includes("temporarily unavailable");

    if (isTemporaryGeminiError) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Revio AI is temporarily busy. Please try again in a few seconds.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
