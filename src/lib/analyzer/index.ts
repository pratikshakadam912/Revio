import { parseResume } from "./parser";
import { analyzeATS, calculateATSScore } from "./ats";
import { calculateScores } from "./scoring";
import {
  recommendRoles,
  calculateSkillGaps,
  calculateNextCareerMove,
} from "./roles";
import { uniqueStrings } from "./normalize";

// Main resume analysis pipeline.
export async function analyzeResume(resumeText: string) {
  const parsed = parseResume(resumeText);

  const atsSections: Record<string, string[]> = {};

  for (const section of parsed.sections || []) {
    if (section.name && section.name !== "unknown") {
      atsSections[section.name] = section.lines || [];
    }
  }

  const atsInput = {
    text: parsed.cleanText || "",
    skills: parsed.skills || [],
    sections: atsSections,
    experienceCount: parsed.experienceDetails?.length || 0,
    projectCount: parsed.projects?.length || 0,
  };

  const atsAnalysis = analyzeATS(atsInput);
  const atsScore = safeScore(calculateATSScore(atsInput));

  const scores = calculateScores({
    resume: parsed,
    atsScore,
  });

  const roles = recommendRoles(
    parsed.skills || [],
    parsed.summary || "",
    parsed.projects || [],
  );

  const skillGaps = calculateSkillGaps(parsed.skills || [], roles);

  const nextCareerMove = calculateNextCareerMove(
    parsed.skills || [],
    parsed.experienceDetails || [],
    roles,
  );

  const overallScore = safeScore(scores.overallScore);

  const strengths = buildStrengths(parsed, scores, atsScore);

  const weaknesses = buildWeaknesses(parsed, scores);

  const suggestions = buildSuggestions(parsed, scores);

  return {
    candidate: {
      name: parsed.candidate?.name || "",
      headline: parsed.candidate?.headline || "",
      location: parsed.candidate?.location || "",
    },

    overallScore,

    summary: parsed.summary || "",

    profile: {
      education: buildEducationProfile(parsed.education),

      experience: buildExperienceProfile(parsed.experienceDetails),

      careerFocus: {
        label: "Career Focus",
        value:
          roles.length > 0
            ? roles[0]?.role || "Not detected"
            : parsed.candidate?.headline || "Not detected",
      },
    },

    skills: uniqueStrings(parsed.skills || []),

    projects: parsed.projects || [],

    experienceDetails: parsed.experienceDetails || [],

    atsAnalysis,

    strengths,

    weaknesses,

    suggestions,

    scores: {
      atsCompatibility: safeScore(scores.atsCompatibility),

      skillsStrength: safeScore(scores.skillsStrength),

      experience: safeScore(scores.experience),

      educationMatch: safeScore(scores.educationMatch),

      contentQuality: safeScore(scores.contentQuality),
    },

    recommendedRoles: Array.isArray(roles)
      ? roles.map((role: any, index: number) => ({
          rank: String(index + 1),
          role: role?.role || "Recommended Role",
          match: safeScore(role?.match),
          description: role?.description || "",
          skills: Array.isArray(role?.skills) ? role.skills : [],
        }))
      : [],

    skillGaps: Array.isArray(skillGaps) ? skillGaps : [],

    nextCareerMove: nextCareerMove || null,

    rawResult: {
      parsed,
      atsAnalysis,
      scores,
    },
  };
}

function buildEducationProfile(
  education: ReturnType<typeof parseResume>["education"],
) {
  if (!Array.isArray(education) || education.length === 0) {
    return {
      label: "Education",
      value: "Not detected",
      detail: "",
    };
  }

  const first = education[0];

  const degree = [first.degree, first.field].filter(Boolean).join(" in ");

  return {
    label: "Education",
    value: degree || first.institution || "Education detected",
    detail: first.institution || "",
  };
}

function buildExperienceProfile(
  experience: ReturnType<typeof parseResume>["experienceDetails"],
) {
  if (!Array.isArray(experience) || experience.length === 0) {
    return {
      label: "Experience",
      value: "No professional experience detected",
      detail: "",
    };
  }

  const count = experience.length;

  return {
    label: "Experience",
    value: `${count} professional position${count === 1 ? "" : "s"}`,
    detail:
      experience[0]?.role && experience[0]?.company
        ? `${experience[0].role} at ${experience[0].company}`
        : "",
  };
}

function safeScore(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildStrengths(
  parsed: ReturnType<typeof parseResume>,
  scores: ReturnType<typeof calculateScores>,
  atsScore: number,
): string[] {
  const result: string[] = [];

  const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];

  const education = Array.isArray(parsed.education) ? parsed.education : [];

  if (skills.length >= 8) {
    result.push("Strong technical skill coverage");
  }

  if (projects.length >= 2) {
    result.push("Multiple projects demonstrate practical experience");
  }

  if (parsed.summary && parsed.summary.trim().length > 30) {
    result.push("Professional summary is present");
  }

  if (education.length > 0) {
    result.push("Education information was successfully identified");
  }

  if (atsScore >= 75) {
    result.push("Good ATS compatibility");
  }

  if (safeScore(scores.contentQuality) >= 75) {
    result.push("Resume contains strong relevant content");
  }

  return uniqueStrings(result).slice(0, 5);
}

function buildWeaknesses(
  parsed: ReturnType<typeof parseResume>,
  scores: ReturnType<typeof calculateScores>,
): string[] {
  const result: string[] = [];

  const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];

  const education = Array.isArray(parsed.education) ? parsed.education : [];

  const experience = Array.isArray(parsed.experienceDetails)
    ? parsed.experienceDetails
    : [];

  if (!parsed.summary || parsed.summary.trim().length < 30) {
    result.push("Professional summary is missing or too brief");
  }

  if (experience.length === 0 && projects.length === 0) {
    result.push(
      "No professional experience or substantial projects were detected",
    );
  }

  if (projects.length === 0) {
    result.push("Projects were not detected");
  }

  if (skills.length < 5) {
    result.push("Limited technical skill coverage");
  }

  if (safeScore(scores.contentQuality) < 60) {
    result.push(
      "Resume content could be more specific and achievement-focused",
    );
  }

  if (education.length === 0) {
    result.push("Education information could not be confidently identified");
  }

  return uniqueStrings(result).slice(0, 5);
}

function buildSuggestions(
  parsed: ReturnType<typeof parseResume>,
  scores: ReturnType<typeof calculateScores>,
): string[] {
  const result: string[] = [];

  const projects = Array.isArray(parsed.projects) ? parsed.projects : [];

  const skills = Array.isArray(parsed.skills) ? parsed.skills : [];

  if (projects.length > 0) {
    const hasImpact = projects.some((project: any) => Boolean(project?.impact));

    if (!hasImpact) {
      result.push("Add measurable outcomes and impact to project descriptions");
    }
  }

  if (!parsed.summary || parsed.summary.trim().length < 30) {
    result.push(
      "Add a concise professional summary tailored to your target role",
    );
  }

  if (skills.length < 8) {
    result.push(
      "Add relevant technical skills that are supported by your resume content",
    );
  }

  if (safeScore(scores.contentQuality) < 70) {
    result.push(
      "Use concise bullet points focused on actions, technologies, and measurable results",
    );
  }

  result.push(
    "Keep section headings, dates, and formatting consistent throughout the resume",
  );

  return uniqueStrings(result).slice(0, 5);
}
