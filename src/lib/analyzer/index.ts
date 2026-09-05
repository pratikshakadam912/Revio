import { parseResume } from "./parser";
import { analyzeATS, calculateATSScore } from "./ats";
import { calculateScores } from "./scoring";
import {
  recommendRoles,
  calculateSkillGaps,
  calculateNextCareerMove,
  type RecommendedRole,
  type SkillGap as RoleSkillGap,
} from "./roles";

import type {
  CareerMove,
  ResumeAnalysisResult,
  ResumeData,
  RoleMatch,
  SkillGap,
} from "./types";

export { parseResume } from "./parser";
export { analyzeATS, calculateATSScore } from "./ats";
export { extractSkills } from "./skills";

export async function analyzeResume(
  pdfBuffer: Buffer,
): Promise<ResumeAnalysisResult> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("Resume PDF buffer is empty.");
  }

  const resume = await parseResume(pdfBuffer);

  const ats = analyzeATS(resume);

  const atsScore = calculateATSScore(resume);

  const scores = calculateScores(resume, ats);

  const recommendedRoles = recommendRoles(
    resume.skills,
    resume.summary,
    resume.projects,
  );

  const rawSkillGaps = calculateSkillGaps(resume.skills, recommendedRoles);

  const careerMove = calculateNextCareerMove(
    resume.skills,
    resume.experience,
    recommendedRoles,
  );

  const roles = mapRoleMatches(resume, recommendedRoles);

  const skillGaps = mapSkillGaps(rawSkillGaps, recommendedRoles);

  const mappedCareerMove = mapCareerMove(careerMove, resume, recommendedRoles);

  const strengths = buildStrengths(resume, ats, scores);

  const weaknesses = buildWeaknesses(resume, ats, scores);

  const suggestions = buildSuggestions(
    resume,
    ats,
    skillGaps,
    mappedCareerMove,
  );

  return {
    resume,
    ats: {
      ...ats,
      score: atsScore,
    },
    scores,
    roles,
    skillGaps,
    careerMove: mappedCareerMove,
    strengths,
    weaknesses,
    suggestions,
  };
}

function mapRoleMatches(
  resume: ResumeData,
  roles: RecommendedRole[],
): RoleMatch[] {
  return roles.map((role) => {
    const matchedSkills = role.skills.filter((skill) =>
      hasSkill(resume.skills, skill),
    );

    const missingSkills = role.skills.filter(
      (skill) => !hasSkill(resume.skills, skill),
    );

    return {
      role: role.role,
      matchScore: role.match,
      matchedSkills,
      missingSkills,
      reasoning: role.description,
    };
  });
}

function mapSkillGaps(
  gaps: RoleSkillGap[],
  roles: RecommendedRole[],
): SkillGap[] {
  return gaps.map((gap) => {
    const relatedRoles = roles
      .filter((role) =>
        role.skills.some((skill) => normalize(skill) === normalize(gap.name)),
      )
      .map((role) => role.role);

    const importance: SkillGap["importance"] =
      gap.level >= 60 ? "high" : gap.level >= 30 ? "medium" : "low";

    return {
      skill: gap.name,
      importance,
      reason:
        gap.reason ||
        "This skill appears frequently in your recommended career paths.",
      relatedRoles,
    };
  });
}

function mapCareerMove(
  move: {
    title: string;
    description: string;
  },
  resume: ResumeData,
  roles: RecommendedRole[],
): CareerMove {
  const topRole = roles[0];

  const nextSkills = topRole
    ? topRole.skills
        .filter((skill) => !hasSkill(resume.skills, skill))
        .slice(0, 5)
    : [];

  const readinessScore = topRole?.match ?? 0;

  const currentLevel =
    resume.experience.length === 0
      ? "Entry-level"
      : resume.experience.length < 2
        ? "Early-career"
        : "Experienced";

  const nextSteps = buildCareerSteps(resume, topRole, nextSkills);

  return {
    currentLevel,
    recommendedRole: topRole?.role ?? "Target role",
    readinessScore,
    reason: move.description,
    nextSkills,
    nextSteps,
  };
}

function buildCareerSteps(
  resume: ResumeData,
  topRole: RecommendedRole | undefined,
  missingSkills: string[],
): string[] {
  const steps: string[] = [];

  if (missingSkills.length > 0) {
    steps.push(`Strengthen ${missingSkills.slice(0, 3).join(", ")}.`);
  }

  if (resume.projects.length < 2) {
    steps.push(
      "Build or document strong projects that demonstrate practical skills.",
    );
  }

  if (resume.experience.length > 0) {
    steps.push(
      "Add measurable outcomes and achievements to your experience entries.",
    );
  } else {
    steps.push(
      "Gain practical experience through internships, freelance work, or relevant projects.",
    );
  }

  if (topRole) {
    steps.push(`Tailor your resume toward ${topRole.role} opportunities.`);
  }

  return steps.slice(0, 4);
}

function buildStrengths(
  resume: ResumeData,
  ats: ReturnType<typeof analyzeATS>,
  scores: ReturnType<typeof calculateScores>,
): string[] {
  const strengths: string[] = [];

  if (scores.ats >= 75) {
    strengths.push("Strong ATS compatibility.");
  }

  if (scores.skills >= 70) {
    strengths.push("Good breadth and structure of technical skills.");
  }

  if (scores.experience >= 70) {
    strengths.push(
      "Experience section provides solid evidence of professional work.",
    );
  }

  if (scores.projects >= 70) {
    strengths.push("Projects provide useful evidence of practical ability.");
  }

  if (scores.education >= 70) {
    strengths.push("Education information is clearly represented.");
  }

  if (scores.content >= 70) {
    strengths.push("Resume content demonstrates useful professional evidence.");
  }

  if (ats.keywordStrength.length > 0) {
    strengths.push(
      `Relevant skills are supported by contextual evidence: ${ats.keywordStrength
        .slice(0, 5)
        .join(", ")}.`,
    );
  }

  if (resume.achievements.length > 0) {
    strengths.push("The resume includes dedicated achievement evidence.");
  }

  if (resume.certifications.length > 0) {
    strengths.push("Relevant certifications are included.");
  }

  return uniqueStrings(strengths).slice(0, 6);
}

function buildWeaknesses(
  resume: ResumeData,
  ats: ReturnType<typeof analyzeATS>,
  scores: ReturnType<typeof calculateScores>,
): string[] {
  const weaknesses: string[] = [];

  if (scores.ats < 60) {
    weaknesses.push("ATS compatibility needs improvement.");
  }

  if (scores.skills < 60) {
    weaknesses.push(
      "Skills evidence is limited or insufficiently contextualized.",
    );
  }

  if (scores.experience < 60) {
    weaknesses.push(
      resume.experience.length === 0
        ? "Professional experience is not yet represented."
        : "Experience entries need stronger evidence of impact.",
    );
  }

  if (scores.projects < 60) {
    weaknesses.push("Project evidence could be strengthened.");
  }

  if (scores.education < 60) {
    weaknesses.push("Education information appears incomplete.");
  }

  if (scores.content < 60) {
    weaknesses.push(
      "Resume content needs stronger evidence of impact and outcomes.",
    );
  }

  for (const issue of ats.issues.slice(0, 4)) {
    weaknesses.push(issue.message);
  }

  return uniqueStrings(weaknesses).slice(0, 8);
}

function buildSuggestions(
  resume: ResumeData,
  ats: ReturnType<typeof analyzeATS>,
  skillGaps: SkillGap[],
  careerMove: CareerMove,
): string[] {
  const suggestions: string[] = [];

  for (const issue of ats.issues.slice(0, 3)) {
    suggestions.push(issue.recommendation);
  }

  for (const gap of skillGaps.slice(0, 3)) {
    suggestions.push(
      `Develop ${gap.skill} for stronger alignment with ${
        gap.relatedRoles.join(", ") || "your target roles"
      }.`,
    );
  }

  if (resume.experience.length > 0) {
    const hasAchievements = resume.experience.some(
      (item) => item.achievements.length > 0,
    );

    if (!hasAchievements) {
      suggestions.push(
        "Convert responsibilities into achievement-focused bullets where the evidence supports it.",
      );
    }
  }

  if (resume.projects.length > 0) {
    const projectsWithoutTech = resume.projects.filter(
      (project) => project.technologies.length === 0,
    );

    if (projectsWithoutTech.length > 0) {
      suggestions.push("Add the technologies actually used in your projects.");
    }
  }

  suggestions.push(...careerMove.nextSteps);

  return uniqueStrings(suggestions).slice(0, 10);
}

function hasSkill(candidateSkills: string[], targetSkill: string): boolean {
  const target = normalize(targetSkill);

  if (!target) {
    return false;
  }

  return candidateSkills.some((skill) => {
    const normalized = normalize(skill);

    return (
      normalized === target ||
      normalized.includes(target) ||
      target.includes(normalized)
    );
  });
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.#/+_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}
