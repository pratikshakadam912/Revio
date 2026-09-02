import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function clampScore(value: unknown): number {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function calculateOverallScore(scores: {
  atsCompatibility: number;
  skillsStrength: number;
  experience: number;
  educationMatch: number;
  contentQuality: number;
}): number {
  const overall =
    scores.atsCompatibility * 0.25 +
    scores.skillsStrength * 0.2 +
    scores.experience * 0.2 +
    scores.educationMatch * 0.1 +
    scores.contentQuality * 0.25;

  return Math.round(overall);
}

export async function POST(request: NextRequest) {
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

    let analysis = await prisma.resumeAnalysis.findFirst({
      where: {
        resumeId: resume.id,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!analysis) {
      analysis = await prisma.resumeAnalysis.create({
        data: {
          userId: session.user.id,
          resumeId: resume.id,
          status: "PENDING",
        },
      });
    }

    await prisma.resumeAnalysis.update({
      where: {
        id: analysis.id,
      },
      data: {
        status: "PROCESSING",
      },
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
    });

    const prompt = `
You are Revio, an expert AI resume analyzer and career intelligence system.

Analyze the resume below carefully.

Your analysis must be based ONLY on information explicitly present in the resume.

Never invent:
- experience
- companies
- projects
- technologies
- achievements
- education
- certifications
- job titles
- responsibilities
- metrics

If information is missing, say that it is missing.

IMPORTANT:
Projects are a major part of this analysis.

For EVERY project mentioned in the resume:
1. Identify the project name.
2. Explain what the candidate actually built or worked on.
3. Explain the purpose or problem the project solves, if stated or reasonably clear from the resume.
4. Extract the technologies/tools explicitly mentioned.
5. Describe the candidate's contribution.
6. Extract measurable results only when they are actually present.
7. Do NOT turn a project into a generic one-line skill.

Return ONLY valid JSON.

Use EXACTLY this structure:

{
  "candidate": {
    "name": "",
    "headline": "",
    "location": ""
  },

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

  "projects": [
    {
      "name": "",
      "description": "",
      "contribution": "",
      "technologies": [],
      "impact": ""
    }
  ],

  "experienceDetails": [
    {
      "company": "",
      "role": "",
      "duration": "",
      "description": "",
      "responsibilities": [],
      "achievements": []
    }
  ],

  "scores": {
    "atsCompatibility": 0,
    "skillsStrength": 0,
    "experience": 0,
    "educationMatch": 0,
    "contentQuality": 0
  },

  "atsAnalysis": {
    "keywordOptimization": "",
    "formatting": "",
    "sectionStructure": "",
    "readability": "",
    "issues": []
  },

  "strengths": [],

  "weaknesses": [],

  "suggestions": [],

  "recommendedRoles": [
    {
      "rank": "1",
      "role": "",
      "match": 0,
      "description": "",
      "skills": []
    },
    {
      "rank": "2",
      "role": "",
      "match": 0,
      "description": "",
      "skills": []
    },
    {
      "rank": "3",
      "role": "",
      "match": 0,
      "description": "",
      "skills": []
    }
  ],

  "skillGaps": [
    {
      "name": "",
      "level": 0,
      "reason": ""
    }
  ],

  "nextCareerMove": {
    "title": "",
    "description": ""
  }
}

SCORING SYSTEM:

All scores must be integers between 0 and 100.

ATS COMPATIBILITY:

Evaluate ONLY ATS-readiness.

Consider:

- standard resume sections
- readable structure
- keyword usage
- relevant technical keywords
- job-title clarity
- consistent formatting
- chronological clarity
- section headings
- unnecessary symbols
- excessive tables or unusual layouts
- contact information visibility
- readability
- whether important information can easily be parsed

Do NOT give a high ATS score merely because the resume looks good.

ATS score guidelines:

90-100 = excellent ATS readiness
80-89 = strong
70-79 = good but has some issues
60-69 = moderate issues
40-59 = significant issues
0-39 = poor ATS readiness

SKILLS STRENGTH:

Evaluate:

- relevance
- technical depth
- breadth
- evidence of skill usage
- alignment between skills and experience/projects

EXPERIENCE:

Evaluate:

- relevance
- quality of responsibilities
- progression
- evidence of real work
- measurable achievements
- clarity of contributions

EDUCATION MATCH:

Evaluate how relevant the education is to the candidate's apparent career direction.

CONTENT QUALITY:

Evaluate:

- clarity
- specificity
- achievement-oriented writing
- project descriptions
- experience descriptions
- useful evidence
- absence of vague statements

OVERALL SCORE:

Do NOT choose overallScore randomly.

The backend will calculate the final overall score from:

- ATS Compatibility: 25%
- Skills Strength: 20%
- Experience: 20%
- Education Match: 10%
- Content Quality: 25%

Therefore return accurate individual scores.

PROJECT ANALYSIS:

Do not omit projects.

If the resume contains projects, return ALL meaningful projects.

A project description should explain what the candidate actually worked on.

For example, avoid:

"Built a web application using React."

Prefer:

"Built a web application that allows users to manage tasks and track progress. Implemented the frontend using React and connected the application to a backend API."

Only include details actually supported by the resume.

If no projects exist, return:

"projects": []

EXPERIENCE ANALYSIS:

Extract each meaningful work experience separately.

Responsibilities should contain actual responsibilities from the resume.

Achievements should contain measurable or concrete achievements when present.

Do not invent metrics.

CANDIDATE NAME:

Extract the candidate's actual name from the resume.

For example, if the resume says:

"Kadam Pratiksha"

return:

"candidate": {
  "name": "Kadam Pratiksha"
}

Do not return generic values such as "Candidate".

SKILL GAPS:

Return 3-5 useful skills or areas that would improve the candidate's career prospects.

These should be based on the candidate's current profile and target roles.

Do not claim the candidate lacks something unless the resume provides enough evidence to support that conclusion.

RECOMMENDED ROLES:

Return exactly 3 realistic roles.

Match percentages must reflect the actual resume.

Do not recommend senior positions unless the resume demonstrates appropriate experience.

STRENGTHS:

Return 3-5 specific strengths supported by the resume.

WEAKNESSES:

Return 3-5 specific weaknesses or areas for improvement supported by the resume.

SUGGESTIONS:

Return 3-5 actionable improvements.

Keep all descriptions concise but meaningful.

Return ONLY JSON.
Do not use markdown.
Do not wrap the JSON in code fences.

RESUME:

${resume.extractedText}
`;

    const result = await model.generateContent(prompt);

    const response = result.response;

    let text = response.text().trim();

    if (text.startsWith("```")) {
      text = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    let aiResult: any;

    try {
      aiResult = JSON.parse(text);
    } catch {
      console.error("Gemini returned invalid JSON:", text);
      throw new Error("Gemini returned an invalid analysis.");
    }

    const scores = {
      atsCompatibility: clampScore(aiResult.scores?.atsCompatibility),

      skillsStrength: clampScore(aiResult.scores?.skillsStrength),

      experience: clampScore(aiResult.scores?.experience),

      educationMatch: clampScore(aiResult.scores?.educationMatch),

      contentQuality: clampScore(aiResult.scores?.contentQuality),
    };

    const overallScore = calculateOverallScore(scores);

    aiResult.scores = scores;
    aiResult.overallScore = overallScore;

    aiResult.candidate = {
      name:
        typeof aiResult.candidate?.name === "string"
          ? aiResult.candidate.name
          : "",

      headline:
        typeof aiResult.candidate?.headline === "string"
          ? aiResult.candidate.headline
          : "",

      location:
        typeof aiResult.candidate?.location === "string"
          ? aiResult.candidate.location
          : "",
    };

    aiResult.projects = Array.isArray(aiResult.projects)
      ? aiResult.projects
      : [];

    aiResult.experienceDetails = Array.isArray(aiResult.experienceDetails)
      ? aiResult.experienceDetails
      : [];

    aiResult.skills = Array.isArray(aiResult.skills) ? aiResult.skills : [];

    aiResult.strengths = Array.isArray(aiResult.strengths)
      ? aiResult.strengths
      : [];

    aiResult.weaknesses = Array.isArray(aiResult.weaknesses)
      ? aiResult.weaknesses
      : [];

    aiResult.suggestions = Array.isArray(aiResult.suggestions)
      ? aiResult.suggestions
      : [];

    aiResult.recommendedRoles = Array.isArray(aiResult.recommendedRoles)
      ? aiResult.recommendedRoles
      : [];

    aiResult.skillGaps = Array.isArray(aiResult.skillGaps)
      ? aiResult.skillGaps
      : [];

    const updatedAnalysis = await prisma.resumeAnalysis.update({
      where: {
        id: analysis.id,
      },

      data: {
        status: "COMPLETED",

        overallScore,

        atsScore: scores.atsCompatibility,

        contentScore: scores.contentQuality,

        skillsScore: scores.skillsStrength,

        experienceScore: scores.experience,

        strengths: aiResult.strengths,

        weaknesses: aiResult.weaknesses,

        suggestions: aiResult.suggestions,

        skills: aiResult.skills,

        rawResult: aiResult,
      },
    });

    await prisma.resume.update({
      where: {
        id: resume.id,
      },

      data: {
        atsScore: scores.atsCompatibility,
      },
    });

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
      {
        status: 500,
      },
    );
  }
}
