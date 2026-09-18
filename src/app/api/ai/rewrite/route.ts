import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResumeExperience = {
  company?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
};

type ResumeProject = {
  name?: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
};

type ResumeDraft = {
  summary?: string;
  experience?: ResumeExperience[];
  projects?: ResumeProject[];
  skills?: string[];
};

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

    const type = String(body?.type ?? "full");
    const text = String(body?.text ?? "");
    const targetRole = String(body?.targetRole ?? "").trim();
    const resume = (body?.resume ?? {}) as ResumeDraft;

    if (!text.trim() && type !== "full") {
      return NextResponse.json(
        {
          success: false,
          error: "Resume content is required.",
        },
        { status: 400 },
      );
    }

    if (type === "full") {
      const improved = improveResume(resume, targetRole);

      return NextResponse.json({
        success: true,
        result: improved,
      });
    }

    const improved = improveText(text, type, targetRole);

    return NextResponse.json({
      success: true,
      result: {
        improved,
        original: text,
        explanation: buildExplanation(type),
        keywords: extractKeywords(`${text} ${targetRole}`, resume.skills ?? []),
      },
    });
  } catch (error) {
    console.error("AI REWRITE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to improve resume content.",
      },
      { status: 500 },
    );
  }
}

function improveResume(resume: ResumeDraft, targetRole: string) {
  return {
    ...resume,

    summary: improveSummary(
      resume.summary ?? "",
      targetRole,
      resume.skills ?? [],
    ),

    experience: (resume.experience ?? []).map((item) => ({
      ...item,
      achievements: (item.achievements ?? []).map((bullet) =>
        improveBullet(bullet, targetRole),
      ),
      description: item.description
        ? improveText(item.description, "rewrite", targetRole)
        : item.description,
    })),

    projects: (resume.projects ?? []).map((project) => ({
      ...project,
      description: project.description
        ? improveProject(project.description, project.technologies ?? [])
        : project.description,
    })),

    skills: [...new Set((resume.skills ?? []).map((skill) => skill.trim()))],
  };
}

function improveSummary(text: string, targetRole: string, skills: string[]) {
  if (!text.trim()) {
    if (targetRole && skills.length) {
      return `${targetRole} professional with experience across ${skills
        .slice(0, 5)
        .join(
          ", ",
        )}. Focused on building practical solutions, delivering reliable results, and applying technical skills to real-world problems.`;
    }

    return "";
  }

  const cleaned = cleanSentence(text);

  if (!targetRole) {
    return cleaned;
  }

  if (cleaned.toLowerCase().includes(targetRole.toLowerCase())) {
    return cleaned;
  }

  return `${targetRole} professional ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(
    1,
  )}`;
}

function improveBullet(text: string, targetRole: string) {
  const cleaned = cleanSentence(text);

  if (!cleaned) return text;

  const lower = cleaned.toLowerCase();

  const weakOpeners = [
    "worked on",
    "helped with",
    "responsible for",
    "did",
    "made",
    "used",
    "worked with",
    "involved in",
  ];

  for (const opener of weakOpeners) {
    if (lower.startsWith(`${opener} `)) {
      const remainder = cleaned.slice(opener.length).trim();

      if (remainder) {
        return `Contributed to ${remainder.charAt(0).toLowerCase()}${remainder.slice(
          1,
        )}${targetRole ? ` with a focus aligned to ${targetRole} responsibilities` : ""}.`;
      }
    }
  }

  return cleaned;
}

function improveProject(text: string, technologies: string[]) {
  const cleaned = cleanSentence(text);

  if (!cleaned) return text;

  if (!technologies.length) {
    return cleaned;
  }

  const techText = technologies.slice(0, 5).join(", ");

  if (cleaned.toLowerCase().includes(techText.toLowerCase())) {
    return cleaned;
  }

  return `${cleaned} Built using ${techText}.`;
}

function improveText(text: string, type: string, targetRole: string) {
  const cleaned = cleanSentence(text);

  if (!cleaned) return text;

  if (type === "summary") {
    return improveSummary(cleaned, targetRole, []);
  }

  if (type === "skills") {
    return cleaned
      .split(/[,•|\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  }

  if (type === "project") {
    return improveProject(cleaned, []);
  }

  return improveBullet(cleaned, targetRole);
}

function cleanSentence(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/^[-•*]\s*/, "")
    .trim();
}

function buildExplanation(type: string) {
  switch (type) {
    case "summary":
      return "The summary was cleaned and positioned around the information already present in your resume.";

    case "skills":
      return "The skills were normalized and presented in a cleaner ATS-friendly format.";

    case "project":
      return "The project description was cleaned to make the contribution easier to scan.";

    default:
      return "The wording was strengthened while keeping the original resume information intact.";
  }
}

function extractKeywords(text: string, existingSkills: string[]) {
  const normalized = text.toLowerCase();

  return existingSkills
    .filter((skill) => normalized.includes(skill.toLowerCase()))
    .slice(0, 12);
}
