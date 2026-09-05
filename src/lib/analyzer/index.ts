import { parseResume } from "./parser";

import { analyzeATS, calculateATSScore } from "./ats";

import { calculateScores } from "./scoring";

import {
  recommendRoles,
  calculateSkillGaps,
  calculateNextCareerMove,
} from "./roles";

import { uniqueStrings } from "./normalize";

export async function analyzeResume(resumeText: string) {
  const parsed = parseResume(resumeText);

  const atsAnalysis = analyzeATS(parsed.cleanText);

  const atsScore = calculateATSScore(atsAnalysis);

  const scores = calculateScores({
    resume: parsed,
    atsScore,
  });

  const roles = recommendRoles(parsed.skills, parsed.summary, parsed.projects);

  const skillGaps = calculateSkillGaps(parsed.skills, roles);

  const nextCareerMove = calculateNextCareerMove(
    parsed.skills,
    parsed.experienceDetails,
    roles,
  );

  const strengths = buildStrengths(parsed, scores);

  const weaknesses = buildWeaknesses(parsed, scores);

  const suggestions = buildSuggestions(parsed, scores);

  return {
    candidate: parsed.candidate,

    overallScore: scores.overall,

    summary: parsed.summary,

    profile: {
      education: {
        label: "Education",
        value: parsed.education[0]?.degree ?? "Not detected",
        detail: parsed.education[0]?.institution,
      },

      experience: {
        label: "Experience",
        value: parsed.experienceDetails.length
          ? `${parsed.experienceDetails.length} position${parsed.experienceDetails.length === 1 ? "" : "s"}`
          : "No professional experience detected",
      },

      careerFocus: {
        label: "Career Focus",
        value: roles[0]?.role ?? parsed.candidate.headline ?? "Not detected",
      },
    },

    skills: uniqueStrings(parsed.skills),

    projects: parsed.projects,

    experienceDetails: parsed.experienceDetails,

    atsAnalysis: {
      ...atsAnalysis,
    },

    strengths,

    weaknesses,

    suggestions,

    scores: {
      atsCompatibility: atsScore,
      skillsStrength: scores.skillsStrength,
      experience: scores.experience,
      educationMatch: scores.educationMatch,
      contentQuality: scores.contentQuality,
    },

    recommendedRoles: roles.map((role, index) => ({
      rank: `${index + 1}`,
      role: role.role,
      match: role.match,
      description: role.description,
      skills: role.skills,
    })),

    skillGaps,

    nextCareerMove,

    rawResult: {
      parsed,
      atsAnalysis,
      scores,
    },
  };
}

function buildStrengths(
  parsed: ReturnType<typeof parseResume>,
  scores: any,
): string[] {
  const result: string[] = [];

  if (parsed.skills.length >= 8) {
    result.push("Strong technical skill coverage");
  }

  if (parsed.projects.length >= 2) {
    result.push("Multiple projects demonstrate practical experience");
  }

  if (parsed.summary) {
    result.push("Professional summary is present");
  }

  if (parsed.education.length) {
    result.push("Education information is clearly identified");
  }

  if (scores.atsCompatibility >= 75) {
    result.push("Good ATS compatibility");
  }

  return result.slice(0, 5);
}

function buildWeaknesses(
  parsed: ReturnType<typeof parseResume>,
  scores: any,
): string[] {
  const result: string[] = [];

  if (!parsed.summary) {
    result.push("Professional summary is missing");
  }

  if (!parsed.experienceDetails.length) {
    result.push("Professional work experience was not detected");
  }

  if (!parsed.projects.length) {
    result.push("Projects were not detected");
  }

  if (parsed.skills.length < 5) {
    result.push("Limited technical skill coverage");
  }

  if (scores.contentQuality < 60) {
    result.push(
      "Resume content could be more specific and achievement-focused",
    );
  }

  return result.slice(0, 5);
}

function buildSuggestions(
  parsed: ReturnType<typeof parseResume>,
  scores: any,
): string[] {
  const result: string[] = [];

  if (
    parsed.projects.length &&
    parsed.projects.every((project) => !project.impact)
  ) {
    result.push("Add measurable outcomes and impact to project descriptions");
  }

  if (!parsed.summary) {
    result.push(
      "Add a concise professional summary tailored to your target role",
    );
  }

  if (!parsed.experienceDetails.length) {
    result.push(
      "If applicable, add internships, freelance work, or professional experience",
    );
  }

  if (parsed.skills.length < 8) {
    result.push(
      "Add relevant technical skills that are supported by your resume content",
    );
  }

  result.push(
    "Keep section headings, dates, and formatting consistent throughout the resume",
  );

  return result.slice(0, 5);
}
