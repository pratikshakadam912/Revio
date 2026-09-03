import { clamp } from "./normalize";

type ScoreInput = {
  text: string;
  skills: string[];
  experienceCount: number;
  projectCount: number;
  educationText: string;
  atsScore: number;
};

type Scores = {
  atsCompatibility: number;
  skillsStrength: number;
  experience: number;
  educationMatch: number;
  contentQuality: number;
};

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
];

const METRIC_PATTERN =
  /\b\d+(?:\.\d+)?\s*(?:%|percent|x|users?|customers?|projects?|months?|years?|days?|hours?|ms|seconds?|million|thousand|k|m)\b/gi;

const EDUCATION_TERMS = [
  "bachelor",
  "master",
  "phd",
  "doctorate",
  "b.tech",
  "m.tech",
  "b.e.",
  "m.e.",
  "bca",
  "mca",
  "bsc",
  "msc",
  "mba",
  "degree",
  "diploma",
];

const CONTENT_WEAK_PHRASES = [
  "hard working",
  "hardworking",
  "team player",
  "responsible for",
  "worked on",
  "helped with",
  "good communication",
  "quick learner",
];

export function calculateScores(input: ScoreInput): Scores {
  const skillsStrength = calculateSkillsScore(input.skills.length);

  const experience = calculateExperienceScore(
    input.experienceCount,
    input.text,
  );

  const educationMatch = calculateEducationScore(input.educationText);

  const contentQuality = calculateContentScore(input.text, input.projectCount);

  const atsCompatibility = clamp(input.atsScore);

  const overallScore = clamp(
    atsCompatibility * 0.25 +
      contentQuality * 0.2 +
      skillsStrength * 0.2 +
      experience * 0.2 +
      educationMatch * 0.15,
  );

  return {
    atsCompatibility,
    skillsStrength,
    experience,
    educationMatch,
    contentQuality,
    overallScore,
  } as Scores & {
    overallScore: number;
  };
}

export function calculateOverallScore(scores: Scores): number {
  return clamp(
    scores.atsCompatibility * 0.25 +
      scores.contentQuality * 0.2 +
      scores.skillsStrength * 0.2 +
      scores.experience * 0.2 +
      scores.educationMatch * 0.15,
  );
}

function calculateSkillsScore(skillCount: number): number {
  if (skillCount <= 0) {
    return 20;
  }

  if (skillCount >= 15) {
    return 95;
  }

  if (skillCount >= 10) {
    return 88;
  }

  if (skillCount >= 7) {
    return 80;
  }

  if (skillCount >= 5) {
    return 70;
  }

  if (skillCount >= 3) {
    return 58;
  }

  return 42;
}

function calculateExperienceScore(
  experienceCount: number,
  text: string,
): number {
  if (experienceCount === 0) {
    return /\bintern(ship)?\b|\bproject\b/i.test(text) ? 45 : 25;
  }

  let score = 45;

  score += Math.min(experienceCount * 10, 35);

  const metrics = text.match(METRIC_PATTERN)?.length ?? 0;

  score += Math.min(metrics * 4, 12);

  const actionVerbCount = ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${escapeRegex(verb)}\\b`, "i").test(text),
  ).length;

  score += Math.min(actionVerbCount * 1.5, 8);

  return clamp(score);
}

function calculateEducationScore(educationText: string): number {
  const value = educationText.trim().toLowerCase();

  if (!value || value === "not specified") {
    return 35;
  }

  const hasDegree = EDUCATION_TERMS.some((term) => value.includes(term));

  if (hasDegree) {
    return 85;
  }

  return 65;
}

function calculateContentScore(text: string, projectCount: number): number {
  const normalized = text.trim();

  if (!normalized) {
    return 0;
  }

  let score = 50;

  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length >= 250) {
    score += 10;
  }

  if (words.length >= 500) {
    score += 10;
  }

  if (words.length >= 900) {
    score += 5;
  }

  const metrics = normalized.match(METRIC_PATTERN)?.length ?? 0;

  score += Math.min(metrics * 3, 12);

  const actionVerbs = ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${escapeRegex(verb)}\\b`, "i").test(normalized),
  ).length;

  score += Math.min(actionVerbs * 1.5, 10);

  score += Math.min(projectCount * 2, 6);

  const weakPhraseCount = CONTENT_WEAK_PHRASES.filter((phrase) =>
    normalized.toLowerCase().includes(phrase),
  ).length;

  score -= Math.min(weakPhraseCount * 5, 20);

  return clamp(score);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
