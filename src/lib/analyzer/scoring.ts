import { clamp } from "./normalize";

type ScoreInput = {
  resume?: any;
  text?: string;
  skills?: string[];
  experienceCount?: number;
  projectCount?: number;
  educationText?: string;
  atsScore: number;
};

type Scores = {
  atsCompatibility: number;
  skillsStrength: number;
  experience: number;
  educationMatch: number;
  contentQuality: number;
  overallScore: number;
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
  const resume = input.resume;

  const text = input.text || resume?.cleanText || resume?.text || "";

  const skills = Array.isArray(input.skills)
    ? input.skills
    : Array.isArray(resume?.skills)
      ? resume.skills
      : [];

  const experienceCount =
    typeof input.experienceCount === "number"
      ? input.experienceCount
      : Array.isArray(resume?.experienceDetails)
        ? resume.experienceDetails.length
        : 0;

  const projectCount =
    typeof input.projectCount === "number"
      ? input.projectCount
      : Array.isArray(resume?.projects)
        ? resume.projects.length
        : 0;

  const educationText =
    input.educationText || getEducationText(resume?.education);

  const atsCompatibility = clamp(input.atsScore);

  const skillsStrength = calculateSkillsScore(skills.length);

  const experience = calculateExperienceScore(experienceCount, text);

  const educationMatch = calculateEducationScore(educationText);

  const contentQuality = calculateContentScore(text, projectCount);

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

function getEducationText(education: any): string {
  if (!Array.isArray(education) || education.length === 0) {
    return "";
  }

  return education
    .map((item) =>
      [item?.degree, item?.field, item?.institution].filter(Boolean).join(" "),
    )
    .join(" ");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
