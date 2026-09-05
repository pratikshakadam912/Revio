// Evidence-based ATS analysis using the canonical Revio ResumeData model.

import {
  clamp,
  normalizeSkill,
  uniqueSkills,
  uniqueStrings,
} from "./normalize";

import type {
  ATSAnalysis,
  ATSIssue,
  ATSIssueSeverity,
  ResumeData,
} from "./types";

const IMPORTANT_SECTIONS = ["summary", "experience", "education", "skills"];

const OPTIONAL_SECTIONS = [
  "projects",
  "certifications",
  "languages",
  "achievements",
];

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
  "achieved",
  "generated",
  "streamlined",
  "architected",
  "integrated",
  "migrated",
  "configured",
  "mentored",
  "coordinated",
  "resolved",
  "accelerated",
  "established",
  "implemented",
  "transformed",
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
  "detail oriented",
  "detail-oriented",
  "go getter",
  "go-getter",
];

const CONTACT_PATTERNS = {
  email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  phone:
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]?\d{3,5}(?:[\s.-]?\d{1,5})?/,
};

export function analyzeATS(resume: ResumeData): ATSAnalysis {
  const text = resume.cleanText.trim();

  if (!text) {
    return createEmptyAnalysis();
  }

  const detectedSections = getDetectedSections(resume);

  const missingSections = getMissingSections(resume);

  const keywordOptimization = calculateKeywordOptimization(resume);

  const sectionStructure = calculateSectionStructure(resume, detectedSections);

  const formatting = calculateFormatting(resume);

  const readability = calculateReadability(resume);

  const contentQuality = calculateContentQuality(resume);

  const experienceQuality = calculateExperienceQuality(resume);

  const skillsQuality = calculateSkillsQuality(resume);

  const educationQuality = calculateEducationQuality(resume);

  const issues = collectIssues({
    resume,
    missingSections,
    detectedSections,
    keywordOptimization,
    sectionStructure,
    formatting,
    readability,
    contentQuality,
    experienceQuality,
    skillsQuality,
    educationQuality,
  });

  const keywordStrength = getKeywordStrength(resume);

  const weakKeywords = getWeakKeywords(resume);

  const score = calculateOverallATSScore({
    keywordOptimization,
    sectionStructure,
    formatting,
    readability,
    contentQuality,
    experienceQuality,
    skillsQuality,
    educationQuality,
    extractionQuality: resume.metadata.extractionQuality,
  });

  return {
    score,
    keywordOptimization,
    sectionStructure,
    formatting,
    readability,
    contentQuality,
    experienceQuality,
    skillsQuality,
    educationQuality,
    issues,
    missingSections,
    detectedSections,
    keywordStrength,
    weakKeywords,
  };
}

export function calculateATSScore(resume: ResumeData): number {
  return analyzeATS(resume).score;
}

function calculateKeywordOptimization(resume: ResumeData): number {
  const skills = uniqueSkills(resume.skills);

  if (skills.length === 0) {
    return 20;
  }

  const normalizedText = normalizeForSearch(resume.cleanText);

  let presentSkills = 0;
  let contextualSkills = 0;

  for (const skill of skills) {
    const normalizedSkill = normalizeForSearch(skill);

    if (!normalizedSkill || !normalizedText.includes(normalizedSkill)) {
      continue;
    }

    presentSkills += 1;

    if (
      appearsInExperience(resume, skill) ||
      appearsInProjects(resume, skill)
    ) {
      contextualSkills += 1;
    }
  }

  const coverage = presentSkills / Math.max(skills.length, 1);

  const context = contextualSkills / Math.max(presentSkills, 1);

  const diversity = Math.min(skills.length / 12, 1);

  return clamp(coverage * 45 + context * 30 + diversity * 25);
}

function calculateSectionStructure(
  resume: ResumeData,
  detectedSections: string[],
): number {
  let score =
    (detectedSections.filter((section) => IMPORTANT_SECTIONS.includes(section))
      .length /
      IMPORTANT_SECTIONS.length) *
    75;

  const optionalPresent = detectedSections.filter((section) =>
    OPTIONAL_SECTIONS.includes(section),
  ).length;

  score += (optionalPresent / OPTIONAL_SECTIONS.length) * 15;

  if (resume.candidate.name) {
    score += 4;
  }

  if (resume.candidate.email || resume.candidate.phone) {
    score += 4;
  }

  if (resume.summary || resume.candidate.headline) {
    score += 2;
  }

  return clamp(score);
}

function calculateFormatting(resume: ResumeData): number {
  const text = resume.cleanText;

  let score = 70;

  const bulletCount = countBullets(text);

  const lines = text.split("\n").filter(Boolean);

  const averageLineLength = lines.length > 0 ? text.length / lines.length : 0;

  if (bulletCount >= 3) {
    score += 7;
  }

  if (bulletCount >= 8) {
    score += 5;
  }

  if (resume.sections.length >= 3) {
    score += 5;
  }

  if (averageLineLength > 180) {
    score -= 8;
  }

  if (/page\s+\d+|^\s*\d+\s+of\s+\d+/im.test(text)) {
    score -= 5;
  }

  if (/[{}<>]{2,}/.test(text)) {
    score -= 8;
  }

  if (/([A-Za-z])\1{5,}/.test(text)) {
    score -= 5;
  }

  if (resume.metadata.extractionQuality < 60) {
    score -= 15;
  } else if (resume.metadata.extractionQuality < 80) {
    score -= 7;
  }

  return clamp(score);
}

function calculateReadability(resume: ResumeData): number {
  const text = resume.cleanText;

  const words = countWords(text);

  if (!words) {
    return 0;
  }

  const sentences = countSentences(text);

  const averageWordsPerSentence = words / Math.max(sentences, 1);

  const bulletCount = countBullets(text);

  let score = 82;

  if (averageWordsPerSentence > 32) {
    score -= 8;
  }

  if (averageWordsPerSentence > 45) {
    score -= 10;
  }

  if (averageWordsPerSentence > 60) {
    score -= 10;
  }

  if (bulletCount >= 5) {
    score += 5;
  }

  const weakPhraseCount = countWeakPhrases(text);

  score -= Math.min(weakPhraseCount * 4, 20);

  return clamp(score);
}

function calculateContentQuality(resume: ResumeData): number {
  let score = 40;

  if (resume.summary) {
    score += 12;
  }

  if (resume.experience.length > 0) {
    score += 10;
  }

  if (resume.projects.length > 0) {
    score += 8;
  }

  if (resume.achievements.length > 0) {
    score += 5;
  }

  if (resume.certifications.length > 0) {
    score += 3;
  }

  const quantifiedAchievements = countQuantifiedStatements(resume);

  if (quantifiedAchievements >= 2) {
    score += 10;
  } else if (quantifiedAchievements === 1) {
    score += 5;
  }

  const actionVerbCount = countActionVerbUsage(resume);

  if (actionVerbCount >= 6) {
    score += 7;
  } else if (actionVerbCount >= 3) {
    score += 4;
  }

  score -= Math.min(countWeakPhrases(resume.cleanText) * 3, 15);

  return clamp(score);
}

function calculateExperienceQuality(resume: ResumeData): number {
  if (resume.experience.length === 0) {
    return 25;
  }

  let score = 45;

  const descriptions = resume.experience.flatMap((item) => [
    item.description,
    ...item.achievements,
  ]);

  const statementCount = descriptions.filter(Boolean).length;

  if (statementCount >= 3) {
    score += 12;
  }

  if (statementCount >= 6) {
    score += 10;
  }

  const quantified = descriptions.filter(containsQuantification).length;

  if (quantified >= 2) {
    score += 12;
  } else if (quantified === 1) {
    score += 6;
  }

  const actionVerbs = descriptions.filter(containsActionVerb).length;

  if (actionVerbs >= 4) {
    score += 8;
  } else if (actionVerbs >= 2) {
    score += 4;
  }

  const dated = resume.experience.filter(
    (item) => item.startDate || item.endDate,
  ).length;

  if (dated === resume.experience.length) {
    score += 6;
  }

  return clamp(score);
}

function calculateSkillsQuality(resume: ResumeData): number {
  const skills = uniqueSkills(resume.skills);

  if (skills.length === 0) {
    return 15;
  }

  let score = 45;

  if (skills.length >= 5) {
    score += 15;
  }

  if (skills.length >= 10) {
    score += 10;
  }

  if (skills.length >= 15) {
    score += 5;
  }

  if (resume.skillCategories.length > 0) {
    score += 10;
  }

  const contextual = skills.filter(
    (skill) =>
      appearsInExperience(resume, skill) || appearsInProjects(resume, skill),
  ).length;

  const contextRatio = contextual / Math.max(skills.length, 1);

  score += Math.round(contextRatio * 15);

  return clamp(score);
}

function calculateEducationQuality(resume: ResumeData): number {
  if (resume.education.length === 0) {
    return 30;
  }

  let score = 60;

  const completeEntries = resume.education.filter(
    (item) => Boolean(item.degree) && Boolean(item.institution),
  ).length;

  if (completeEntries === resume.education.length) {
    score += 15;
  }

  const datedEntries = resume.education.filter(
    (item) => item.startDate || item.endDate,
  ).length;

  if (datedEntries > 0) {
    score += 8;
  }

  const fieldEntries = resume.education.filter((item) =>
    Boolean(item.field),
  ).length;

  if (fieldEntries > 0) {
    score += 7;
  }

  return clamp(score);
}

function collectIssues(input: {
  resume: ResumeData;
  missingSections: string[];
  detectedSections: string[];
  keywordOptimization: number;
  sectionStructure: number;
  formatting: number;
  readability: number;
  contentQuality: number;
  experienceQuality: number;
  skillsQuality: number;
  educationQuality: number;
}): ATSIssue[] {
  const issues: ATSIssue[] = [];

  const {
    resume,
    missingSections,
    keywordOptimization,
    sectionStructure,
    formatting,
    readability,
    contentQuality,
    experienceQuality,
    skillsQuality,
    educationQuality,
  } = input;

  if (!resume.candidate.name) {
    issues.push(
      createIssue(
        "structure",
        "high",
        "Candidate name could not be confidently detected.",
        "Place your full name prominently at the top of the resume.",
      ),
    );
  }

  if (!resume.candidate.email && !resume.candidate.phone) {
    issues.push(
      createIssue(
        "structure",
        "high",
        "No reliable contact information was detected.",
        "Include a professional email address and phone number in the header.",
      ),
    );
  }

  if (
    missingSections.includes("experience") &&
    missingSections.includes("education")
  ) {
    issues.push(
      createIssue(
        "structure",
        "high",
        "Both experience and education sections are missing or could not be confidently detected.",
        "Use clear standard headings such as Experience and Education.",
      ),
    );
  } else if (missingSections.length > 0) {
    issues.push(
      createIssue(
        "structure",
        "medium",
        `Common resume sections were not detected: ${missingSections.join(", ")}.`,
        "Use standard section headings so ATS systems can identify your resume structure reliably.",
      ),
    );
  }

  if (skillsQuality < 50) {
    issues.push(
      createIssue(
        "skills",
        "high",
        "The resume contains limited or weakly structured skill evidence.",
        "List relevant skills clearly and connect important skills to actual experience or projects.",
      ),
    );
  }

  if (keywordOptimization < 55) {
    issues.push(
      createIssue(
        "keyword",
        "medium",
        "Keyword coverage is relatively weak.",
        "Use relevant terminology that accurately reflects your actual skills, experience, and projects.",
      ),
    );
  }

  if (experienceQuality < 55 && resume.experience.length > 0) {
    issues.push(
      createIssue(
        "experience",
        "medium",
        "Experience entries contain limited evidence of measurable impact.",
        "Describe what you did, which technologies or methods you used, and the measurable result when the resume genuinely contains that evidence.",
      ),
    );
  }

  if (resume.experience.length > 0 && countQuantifiedStatements(resume) === 0) {
    issues.push(
      createIssue(
        "content",
        "medium",
        "No quantified outcomes were detected in the experience content.",
        "Where truthful and supported by your experience, include metrics such as revenue, performance, scale, time saved, users served, or percentage improvement.",
      ),
    );
  }

  if (contentQuality < 55) {
    issues.push(
      createIssue(
        "content",
        "medium",
        "The resume provides limited evidence of impact, achievements, or detailed professional contributions.",
        "Replace generic descriptions with specific responsibilities, technologies, outcomes, and achievements.",
      ),
    );
  }

  if (readability < 60) {
    issues.push(
      createIssue(
        "readability",
        "medium",
        "Some resume statements may be difficult to scan quickly.",
        "Use concise statements, strong verbs, and shorter achievement-focused bullets.",
      ),
    );
  }

  if (formatting < 60) {
    issues.push(
      createIssue(
        "formatting",
        "medium",
        "The extracted document contains weak ATS-friendly formatting signals.",
        "Prefer clear headings, consistent spacing, conventional bullets, and a simple single-column structure when ATS compatibility is the priority.",
      ),
    );
  }

  if (educationQuality < 50 && resume.education.length > 0) {
    issues.push(
      createIssue(
        "education",
        "low",
        "Education information appears incomplete.",
        "Include the degree, field of study, institution, and dates when those details are available.",
      ),
    );
  }

  if (resume.projects.length === 0 && resume.experience.length === 0) {
    issues.push(
      createIssue(
        "experience",
        "high",
        "No meaningful experience or project evidence was detected.",
        "Include relevant professional, internship, academic, freelance, or personal project work that genuinely represents your experience.",
      ),
    );
  }

  if (resume.metadata.extractionQuality < 60) {
    issues.push(
      createIssue(
        "formatting",
        "high",
        "PDF extraction quality is low, so some ATS findings may be affected by the source document structure.",
        "Use a text-readable PDF with selectable text and conventional resume formatting.",
      ),
    );
  }

  return dedupeIssues(issues).slice(0, 10);
}

function calculateOverallATSScore(input: {
  keywordOptimization: number;
  sectionStructure: number;
  formatting: number;
  readability: number;
  contentQuality: number;
  experienceQuality: number;
  skillsQuality: number;
  educationQuality: number;
  extractionQuality: number;
}): number {
  const score =
    input.keywordOptimization * 0.2 +
    input.sectionStructure * 0.15 +
    input.formatting * 0.1 +
    input.readability * 0.1 +
    input.contentQuality * 0.15 +
    input.experienceQuality * 0.15 +
    input.skillsQuality * 0.1 +
    input.educationQuality * 0.05;

  const extractionPenalty =
    input.extractionQuality < 50 ? 10 : input.extractionQuality < 70 ? 5 : 0;

  return clamp(score - extractionPenalty);
}

function getDetectedSections(resume: ResumeData): string[] {
  return uniqueStrings(
    resume.sections
      .filter(
        (section) =>
          section.name !== "header" &&
          section.name !== "unknown" &&
          section.lines.length > 0,
      )
      .map((section) => section.name),
  );
}

function getMissingSections(resume: ResumeData): string[] {
  const detected = new Set(getDetectedSections(resume));

  const inferred = new Set(detected);

  if (resume.summary || resume.candidate.headline) {
    inferred.add("summary");
  }

  if (resume.experience.length > 0) {
    inferred.add("experience");
  }

  if (resume.education.length > 0) {
    inferred.add("education");
  }

  if (resume.skills.length > 0) {
    inferred.add("skills");
  }

  return IMPORTANT_SECTIONS.filter((section) => !inferred.has(section));
}

function getKeywordStrength(resume: ResumeData): string[] {
  const skills = uniqueSkills(resume.skills);

  const contextual = skills.filter(
    (skill) =>
      appearsInExperience(resume, skill) || appearsInProjects(resume, skill),
  );

  return uniqueSkills(contextual).slice(0, 12);
}

function getWeakKeywords(resume: ResumeData): string[] {
  const text = normalizeForSearch(resume.cleanText);

  const skills = uniqueSkills(resume.skills);

  return skills
    .filter((skill) => {
      const normalized = normalizeForSearch(skill);

      return normalized && !text.includes(normalized);
    })
    .slice(0, 10);
}

function appearsInExperience(resume: ResumeData, skill: string): boolean {
  const target = normalizeForSearch(skill);

  if (!target) {
    return false;
  }

  return resume.experience.some((item) =>
    normalizeForSearch(
      [
        item.role,
        item.company,
        item.description,
        ...item.achievements,
        ...item.technologies,
      ].join(" "),
    ).includes(target),
  );
}

function appearsInProjects(resume: ResumeData, skill: string): boolean {
  const target = normalizeForSearch(skill);

  if (!target) {
    return false;
  }

  return resume.projects.some((project) =>
    normalizeForSearch(
      [project.name, project.description, ...project.technologies].join(" "),
    ).includes(target),
  );
}

function countActionVerbUsage(resume: ResumeData): number {
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

function containsQuantification(text: string): boolean {
  return (
    /\b\d+(?:\.\d+)?\s*(?:%|percent|x|k|m|b)?\b/i.test(text) ||
    /\b(?:increased|reduced|improved|grew|saved|generated|delivered|served|managed|processed)\b[\s\S]{0,80}\b\d+/i.test(
      text,
    )
  );
}

function countQuantifiedStatements(resume: ResumeData): number {
  const statements = resume.experience.flatMap((item) => [
    item.description,
    ...item.achievements,
  ]);

  return statements.filter(containsQuantification).length;
}

function countWeakPhrases(text: string): number {
  const lower = text.toLowerCase();

  return WEAK_PHRASES.filter((phrase) => lower.includes(phrase)).length;
}

function countBullets(text: string): number {
  return text.match(/(?:^|\n)\s*(?:[-*•●▪▫◦‣⁃∙➢➤►▸])\s+/g)?.length ?? 0;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countSentences(text: string): number {
  return text.match(/[.!?]+/g)?.length ?? 1;
}

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}+#./-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createIssue(
  type:
    | "keyword"
    | "formatting"
    | "structure"
    | "readability"
    | "content"
    | "experience"
    | "skills"
    | "education",
  severity: ATSIssueSeverity,
  message: string,
  recommendation: string,
): ATSIssue {
  return {
    type,
    severity,
    message,
    recommendation,
  };
}

function dedupeIssues(issues: ATSIssue[]): ATSIssue[] {
  const seen = new Set<string>();
  const result: ATSIssue[] = [];

  for (const issue of issues) {
    const key = issue.message.toLowerCase().trim();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(issue);
  }

  return result;
}

function createEmptyAnalysis(): ATSAnalysis {
  return {
    score: 0,
    keywordOptimization: 0,
    sectionStructure: 0,
    formatting: 0,
    readability: 0,
    contentQuality: 0,
    experienceQuality: 0,
    skillsQuality: 0,
    educationQuality: 0,
    issues: [
      {
        type: "content",
        severity: "high",
        message: "No readable resume content was detected.",
        recommendation: "Upload a text-readable PDF resume.",
      },
    ],
    missingSections: ["summary", "experience", "education", "skills"],
    detectedSections: [],
    keywordStrength: [],
    weakKeywords: [],
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
