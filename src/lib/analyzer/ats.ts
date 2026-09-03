import { clamp, uniqueStrings } from "./normalize";

type ATSAnalysis = {
  keywordOptimization: string;
  formatting: string;
  sectionStructure: string;
  readability: string;
  issues: string[];
};

type ATSInput = {
  text: string;
  skills: string[];
  sections: Record<string, string[]>;
  experienceCount: number;
  projectCount: number;
};

const IMPORTANT_SECTIONS = ["summary", "experience", "education", "skills"];

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
];

export function analyzeATS(input: ATSInput): ATSAnalysis {
  const text = input.text.trim();

  const lower = text.toLowerCase();

  const issues: string[] = [];

  const presentSections = IMPORTANT_SECTIONS.filter(
    (section) => input.sections[section]?.length,
  );

  const missingSections = IMPORTANT_SECTIONS.filter(
    (section) => !input.sections[section]?.length,
  );

  const actionVerbCount = ACTION_VERBS.filter((verb) =>
    new RegExp(`\\b${escapeRegex(verb)}\\b`, "i").test(lower),
  ).length;

  const weakPhraseMatches = WEAK_PHRASES.filter((phrase) =>
    lower.includes(phrase),
  );

  const bulletCount = (text.match(/(?:^|\n)\s*[•▪◦●○‣⁃*-]\s+/g) ?? []).length;

  const numberCount = (text.match(/\b\d+(?:\.\d+)?%?\b/g) ?? []).length;

  if (!text) {
    issues.push("No readable resume text was detected.");
  }

  if (!input.skills.length) {
    issues.push(
      "No recognizable technical or professional skills were detected.",
    );
  }

  if (missingSections.length) {
    issues.push(
      `Missing common resume section${
        missingSections.length > 1 ? "s" : ""
      }: ${missingSections.join(", ")}.`,
    );
  }

  if (bulletCount === 0 && input.experienceCount > 0) {
    issues.push(
      "Experience content does not appear to use bullet-style statements.",
    );
  }

  if (actionVerbCount < 3 && input.experienceCount > 0) {
    issues.push(
      "Experience content contains limited evidence of strong action verbs.",
    );
  }

  if (numberCount < 2 && input.experienceCount > 0) {
    issues.push("Few measurable numbers or quantified outcomes were detected.");
  }

  if (weakPhraseMatches.length) {
    issues.push(
      `Generic phrases detected: ${weakPhraseMatches.slice(0, 4).join(", ")}.`,
    );
  }

  if (text.length < 700) {
    issues.push(
      "The extracted resume content is relatively short and may lack detail.",
    );
  }

  const keywordScore = calculateKeywordScore(input.skills.length, text);

  const structureScore =
    (presentSections.length / IMPORTANT_SECTIONS.length) * 100;

  const readabilityScore = calculateReadabilityScore(
    text,
    bulletCount,
    weakPhraseMatches.length,
  );

  const formattingScore = calculateFormattingScore(text, bulletCount);

  return {
    keywordOptimization: buildKeywordMessage(keywordScore, input.skills.length),

    formatting: buildFormattingMessage(formattingScore),

    sectionStructure: buildSectionMessage(structureScore, presentSections),

    readability: buildReadabilityMessage(readabilityScore),

    issues: uniqueStrings(issues).slice(0, 10),
  };
}

export function calculateATSScore(input: ATSInput): number {
  const text = input.text.trim();

  if (!text) {
    return 0;
  }

  const keywordScore = calculateKeywordScore(input.skills.length, text);

  const structureScore =
    (IMPORTANT_SECTIONS.filter((section) => input.sections[section]?.length)
      .length /
      IMPORTANT_SECTIONS.length) *
    100;

  const bulletCount = (text.match(/(?:^|\n)\s*[•▪◦●○‣⁃*-]\s+/g) ?? []).length;

  const formattingScore = calculateFormattingScore(text, bulletCount);

  const readabilityScore = calculateReadabilityScore(
    text,
    bulletCount,
    WEAK_PHRASES.filter((phrase) => text.toLowerCase().includes(phrase)).length,
  );

  return clamp(
    keywordScore * 0.35 +
      structureScore * 0.3 +
      formattingScore * 0.15 +
      readabilityScore * 0.2,
  );
}

function calculateKeywordScore(skillCount: number, text: string): number {
  const lengthFactor = Math.min(text.length / 1800, 1);

  const skillFactor = Math.min(skillCount / 12, 1);

  return clamp(skillFactor * 70 + lengthFactor * 30);
}

function calculateFormattingScore(text: string, bulletCount: number): number {
  let score = 70;

  if (bulletCount >= 3) {
    score += 10;
  }

  if (bulletCount >= 8) {
    score += 5;
  }

  if (/\n/.test(text)) {
    score += 5;
  }

  if (/[{}<>]/.test(text)) {
    score -= 10;
  }

  if (/\b(?:page\s+\d+|\d+\s+of\s+\d+)\b/i.test(text)) {
    score -= 5;
  }

  return clamp(score);
}

function calculateReadabilityScore(
  text: string,
  bulletCount: number,
  weakPhraseCount: number,
): number {
  const sentences = text.match(/[.!?]+/g)?.length ?? 1;

  const words = text.split(/\s+/).filter(Boolean).length;

  const averageWordsPerSentence = words / Math.max(sentences, 1);

  let score = 80;

  if (bulletCount >= 5) {
    score += 5;
  }

  if (averageWordsPerSentence > 35) {
    score -= 10;
  }

  if (averageWordsPerSentence > 50) {
    score -= 10;
  }

  score -= Math.min(weakPhraseCount * 5, 20);

  return clamp(score);
}

function buildKeywordMessage(score: number, skillCount: number): string {
  if (score >= 80) {
    return `Strong keyword coverage with ${skillCount} recognizable skills.`;
  }

  if (score >= 60) {
    return `Moderate keyword coverage with ${skillCount} recognizable skills.`;
  }

  return "Keyword coverage could be improved by adding role-relevant skills and terminology supported by actual experience.";
}

function buildFormattingMessage(score: number): string {
  if (score >= 85) {
    return "The extracted text has strong structural signals for ATS parsing.";
  }

  if (score >= 70) {
    return "The extracted text appears reasonably parseable, although formatting signals could be improved.";
  }

  return "The extracted text contains limited ATS-friendly structural signals.";
}

function buildSectionMessage(score: number, sections: string[]): string {
  if (score >= 100) {
    return "Core resume sections were detected.";
  }

  if (score >= 75) {
    return `Most core sections were detected: ${sections.join(", ")}.`;
  }

  return `Some core sections were detected: ${sections.join(", ")}.`;
}

function buildReadabilityMessage(score: number): string {
  if (score >= 85) {
    return "Resume text is generally concise and readable.";
  }

  if (score >= 70) {
    return "Resume text is readable but some statements could be more concise.";
  }

  return "Several statements may benefit from shorter, clearer, more specific wording.";
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
