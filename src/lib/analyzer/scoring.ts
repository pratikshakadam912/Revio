// Evidence-based resume scoring aligned with the canonical Revio ResumeData model.

import { clamp, normalizeSkill } from "./normalize";
import type { ATSAnalysis, ResumeData, ResumeScores } from "./types";

const ACTION_VERBS = [
  "built",
  "developed",
  "created",
  "designed",
  "implemented",
  "engineered",
  "managed",
  "led",
  "optimized",
  "improved",
  "automated",
  "deployed",
  "launched",
  "analyzed",
  "delivered",
  "increased",
  "reduced",
  "generated",
  "architected",
  "integrated",
  "migrated",
  "configured",
  "mentored",
  "coordinated",
  "resolved",
  "streamlined",
  "established",
];

const WEAK_PHRASES = [
  "hard working",
  "hardworking",
  "team player",
  "responsible for",
  "worked on",
  "helped with",
  "good communication",
  "quick learner",
  "passionate individual",
  "self motivated",
  "self-motivated",
];

const METRIC_PATTERN =
  /\b\d+(?:\.\d+)?\s*(?:%|percent|x|users?|customers?|projects?|months?|years?|days?|hours?|ms|seconds?|million|thousand|k|m)\b/gi;

const DEGREE_PATTERN =
  /\b(?:bachelor|master|ph\.?\s*d|doctorate|b\.?\s*tech|m\.?\s*tech|b\.?\s*e\.?|m\.?\s*e\.?|bca|mca|b\.?\s*sc|m\.?\s*sc|mba|degree|diploma)\b/i;

export function calculateScores(
  resume: ResumeData,
  ats: ATSAnalysis,
): ResumeScores {
  const atsScore = clamp(ats.score);

  const skills = calculateSkillsScore(resume);
  const experience = calculateExperienceScore(resume);
  const education = calculateEducationScore(resume);
  const projects = calculateProjectsScore(resume);
  const content = calculateContentScore(resume);

  const overall = clamp(
    atsScore * 0.25 +
      skills * 0.15 +
      experience * 0.2 +
      education * 0.1 +
      projects * 0.1 +
      content * 0.2,
  );

  return {
    overall,
    ats: atsScore,
    skills,
    experience,
    education,
    projects,
    content,
  };
}

export function calculateOverallScore(scores: ResumeScores): number {
  return clamp(
    scores.ats * 0.25 +
      scores.skills * 0.15 +
      scores.experience * 0.2 +
      scores.education * 0.1 +
      scores.projects * 0.1 +
      scores.content * 0.2,
  );
}

function calculateSkillsScore(resume: ResumeData): number {
  const skills = resume.skills.map(normalizeSkill).filter(Boolean);

  if (skills.length === 0) {
    return 15;
  }

  let score = 35;

  if (skills.length >= 3) {
    score += 10;
  }

  if (skills.length >= 5) {
    score += 10;
  }

  if (skills.length >= 8) {
    score += 8;
  }

  if (skills.length >= 12) {
    score += 7;
  }

  if (resume.skillCategories.length > 0) {
    score += 8;
  }

  const contextualSkills = skills.filter(
    (skill) =>
      skillAppearsInExperience(resume, skill) ||
      skillAppearsInProjects(resume, skill),
  );

  const contextualRatio = contextualSkills.length / Math.max(skills.length, 1);

  score += Math.round(contextualRatio * 15);

  return clamp(score);
}

function calculateExperienceScore(resume: ResumeData): number {
  if (resume.experience.length === 0) {
    if (resume.projects.length > 0) {
      return 45;
    }

    return 25;
  }

  let score = 40;

  const experiences = resume.experience;

  const completeEntries = experiences.filter(
    (item) => Boolean(item.role) && Boolean(item.company),
  ).length;

  if (completeEntries === experiences.length) {
    score += 12;
  } else if (completeEntries > 0) {
    score += 6;
  }

  if (experiences.length >= 2) {
    score += 8;
  }

  if (experiences.length >= 4) {
    score += 5;
  }

  const statements = experiences
    .flatMap((item) => [item.description, ...item.achievements])
    .filter(Boolean);

  if (statements.length >= 3) {
    score += 8;
  }

  if (statements.length >= 6) {
    score += 5;
  }

  const quantifiedCount = statements.filter(containsMetric).length;

  if (quantifiedCount >= 3) {
    score += 10;
  } else if (quantifiedCount >= 1) {
    score += 5;
  }

  const actionStatementCount = statements.filter(containsActionVerb).length;

  if (actionStatementCount >= 5) {
    score += 8;
  } else if (actionStatementCount >= 2) {
    score += 4;
  }

  const datedEntries = experiences.filter(
    (item) => Boolean(item.startDate) || Boolean(item.endDate),
  ).length;

  if (datedEntries === experiences.length) {
    score += 4;
  }

  return clamp(score);
}

function calculateEducationScore(resume: ResumeData): number {
  if (resume.education.length === 0) {
    return 30;
  }

  let score = 55;

  const entries = resume.education;

  const completeEntries = entries.filter(
    (item) => Boolean(item.degree) && Boolean(item.institution),
  ).length;

  if (completeEntries === entries.length) {
    score += 15;
  } else if (completeEntries > 0) {
    score += 8;
  }

  const hasField = entries.some((item) => Boolean(item.field));

  if (hasField) {
    score += 8;
  }

  const hasDates = entries.some(
    (item) => Boolean(item.startDate) || Boolean(item.endDate),
  );

  if (hasDates) {
    score += 7;
  }

  const hasRecognizedDegree = entries.some((item) =>
    DEGREE_PATTERN.test([item.degree, item.field].filter(Boolean).join(" ")),
  );

  if (hasRecognizedDegree) {
    score += 5;
  }

  return clamp(score);
}

function calculateProjectsScore(resume: ResumeData): number {
  const projects = resume.projects;

  if (projects.length === 0) {
    return resume.experience.length > 0 ? 55 : 25;
  }

  let score = 45;

  if (projects.length >= 1) {
    score += 10;
  }

  if (projects.length >= 2) {
    score += 10;
  }

  if (projects.length >= 4) {
    score += 8;
  }

  const documentedProjects = projects.filter((project) =>
    Boolean(project.description),
  ).length;

  if (documentedProjects === projects.length) {
    score += 8;
  } else if (documentedProjects > 0) {
    score += 4;
  }

  const technologyProjects = projects.filter(
    (project) => project.technologies.length > 0,
  ).length;

  if (technologyProjects >= 2) {
    score += 7;
  } else if (technologyProjects === 1) {
    score += 4;
  }

  const linkedProjects = projects.filter((project) =>
    Boolean(project.url),
  ).length;

  if (linkedProjects > 0) {
    score += 4;
  }

  const quantifiedProjects = projects.filter((project) =>
    containsMetric(project.description),
  ).length;

  if (quantifiedProjects > 0) {
    score += 4;
  }

  return clamp(score);
}

function calculateContentScore(resume: ResumeData): number {
  const text = resume.cleanText.trim();

  if (!text) {
    return 0;
  }

  let score = 40;

  const words = text.split(/\s+/).filter(Boolean);

  if (words.length >= 250) {
    score += 8;
  }

  if (words.length >= 500) {
    score += 8;
  }

  if (words.length >= 800) {
    score += 6;
  }

  const actionVerbCount = countActionVerbs(resume);

  if (actionVerbCount >= 6) {
    score += 10;
  } else if (actionVerbCount >= 3) {
    score += 6;
  } else if (actionVerbCount >= 1) {
    score += 3;
  }

  const metricCount = countMetrics(resume);

  if (metricCount >= 4) {
    score += 10;
  } else if (metricCount >= 2) {
    score += 6;
  } else if (metricCount === 1) {
    score += 3;
  }

  if (resume.summary.length >= 80) {
    score += 5;
  }

  if (resume.achievements.length > 0) {
    score += 4;
  }

  const weakPhraseCount = countWeakPhrases(text);

  score -= Math.min(weakPhraseCount * 5, 20);

  return clamp(score);
}

function skillAppearsInExperience(resume: ResumeData, skill: string): boolean {
  const target = normalizeForSearch(skill);

  if (!target) {
    return false;
  }

  return resume.experience.some((item) => {
    const content = [
      item.role,
      item.company,
      item.description,
      ...item.achievements,
      ...item.technologies,
    ]
      .filter(Boolean)
      .join(" ");

    return normalizeForSearch(content).includes(target);
  });
}

function skillAppearsInProjects(resume: ResumeData, skill: string): boolean {
  const target = normalizeForSearch(skill);

  if (!target) {
    return false;
  }

  return resume.projects.some((project) => {
    const content = [project.name, project.description, ...project.technologies]
      .filter(Boolean)
      .join(" ");

    return normalizeForSearch(content).includes(target);
  });
}

function countActionVerbs(resume: ResumeData): number {
  const statements = resume.experience.flatMap((item) => [
    item.description,
    ...item.achievements,
  ]);

  return statements.filter(containsActionVerb).length;
}

function containsActionVerb(text: string): boolean {
  const lower = text.toLowerCase();

  return ACTION_VERBS.some((verb) =>
    new RegExp(`\\b${escapeRegex(verb)}\\b`, "i").test(lower),
  );
}

function countMetrics(resume: ResumeData): number {
  const statements = [
    ...resume.experience.flatMap((item) => [
      item.description,
      ...item.achievements,
    ]),
    ...resume.projects.map((project) => project.description),
  ].filter(Boolean);

  return statements.filter(containsMetric).length;
}

function containsMetric(text: string): boolean {
  METRIC_PATTERN.lastIndex = 0;

  return (
    METRIC_PATTERN.test(text) ||
    /\b(?:increased|reduced|improved|grew|saved|generated|processed|served|managed)\b[\s\S]{0,80}\b\d+/i.test(
      text,
    )
  );
}

function countWeakPhrases(text: string): number {
  const lower = text.toLowerCase();

  return WEAK_PHRASES.filter((phrase) => lower.includes(phrase)).length;
}

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#./-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
