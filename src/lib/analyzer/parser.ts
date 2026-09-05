import { PDFParse } from "pdf-parse";

import type {
  CandidateInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeData,
  ResumeSection,
  SkillCategory,
} from "./types";

import {
  cleanLine,
  normalizeText,
  repairPdfText,
  uniqueStrings,
} from "./normalize";

// ============================================================
// REGEX
// ============================================================

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/i;

const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?\d{3,5}[\s.-]\d{3,5}/;

const LINKEDIN_PATTERN = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|,)]+/i;

const GITHUB_PATTERN = /(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|,)]+/i;

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"')]+/i;

const DATE_TOKEN =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";

const DATE_RANGE_PATTERN = new RegExp(
  `((?:${DATE_TOKEN}\\s+)?\\d{4})\\s*(?:-|–|—|to|until)\\s*((?:${DATE_TOKEN}\\s+)?\\d{4}|Present|Current|Now)`,
  "i",
);

const BULLET_PATTERN = /^\s*(?:[-•●▪▫◦‣⁃∙*➢➤►▸])\s*/;

// ============================================================
// SECTION ALIASES
// ============================================================

const SECTION_ALIASES: Record<string, string> = {
  summary: "summary",
  profile: "summary",
  about: "summary",
  "professional summary": "summary",
  objective: "summary",

  experience: "experience",
  "work experience": "experience",
  "work history": "experience",
  employment: "experience",
  "professional experience": "experience",

  education: "education",
  academics: "education",
  qualifications: "education",

  projects: "projects",
  "personal projects": "projects",
  "academic projects": "projects",

  skills: "skills",
  "technical skills": "skills",
  technologies: "skills",
  "skills technologies": "skills",
  "skills & technologies": "skills",

  certifications: "certifications",
  licenses: "certifications",
  "licenses certifications": "certifications",
  "licenses & certifications": "certifications",

  languages: "languages",

  achievements: "achievements",
  awards: "achievements",
  "honors awards": "achievements",
  "honors & awards": "achievements",
};

// ============================================================
// MAIN PARSER
// ============================================================

export async function parseResume(
  pdfBuffer: Buffer,
  metadata?: Partial<ResumeData["metadata"]>,
): Promise<ResumeData> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("Resume PDF buffer is empty.");
  }

  const rawText = await extractPdfText(pdfBuffer);

  const normalizedText = repairPdfText(normalizeText(rawText));

  const lines = normalizedText
    .split(/\r?\n+/)
    .map((line) => cleanLine(line))
    .filter((line): line is string => Boolean(line));

  const sections = splitSections(lines);

  const headerSection = sections.find((section) => section.name === "header");

  const candidate = parseCandidate(
    headerSection?.lines?.length ? headerSection.lines : lines.slice(0, 15),
  );

  const summary = extractSummary(sections);

  const education = parseEducation(getSectionLines(sections, "education"));

  const experience = parseExperience(getSectionLines(sections, "experience"));

  const projects = parseProjects(getSectionLines(sections, "projects"));

  const { skills, skillCategories } = parseSkills(
    getSectionLines(sections, "skills"),
  );

  const certifications = parseCertifications(
    getSectionLines(sections, "certifications"),
  );

  const languages = parseLanguages(getSectionLines(sections, "languages"));

  const achievements = parseAchievements(
    getSectionLines(sections, "achievements"),
  );

  const cleanText = buildCleanText(sections);

  return {
    candidate,
    summary,
    education,
    experience,
    projects,
    skills,
    skillCategories,
    certifications,
    languages,
    achievements,
    sections,
    rawText,
    cleanText,

    metadata: {
      pageCount: metadata?.pageCount ?? 1,

      wordCount:
        metadata?.wordCount ?? cleanText.split(/\s+/).filter(Boolean).length,

      characterCount: metadata?.characterCount ?? cleanText.length,

      extractionQuality:
        metadata?.extractionQuality ?? calculateQuality(cleanText, sections),
    },
  };
}

// ============================================================
// PDF TEXT EXTRACTION
// ============================================================

async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("The uploaded PDF is empty.");
  }

  const pdfHeader = pdfBuffer.subarray(0, 5).toString("ascii");

  if (pdfHeader !== "%PDF-") {
    console.error("[Revio] Invalid PDF header:", pdfHeader);

    throw new Error("The downloaded resume is not a valid PDF file.");
  }

  let parser: PDFParse | null = null;

  try {
    const pdfData = new Uint8Array(pdfBuffer);

    parser = new PDFParse({
      data: pdfData,
    });

    const result = await parser.getText();

    const text = typeof result?.text === "string" ? result.text.trim() : "";

    if (!text) {
      throw new Error(
        "The PDF was opened successfully, but no readable text was found.",
      );
    }

    return text;
  } catch (error) {
    console.error("[Revio] PDF parsing failed:", error);

    if (error instanceof Error) {
      throw new Error(
        `Unable to extract text from the uploaded PDF. ${error.message}`,
      );
    }

    throw new Error("Unable to extract text from the uploaded PDF.");
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (destroyError) {
        console.error("[Revio] Failed to destroy PDF parser:", destroyError);
      }
    }
  }
}

// ============================================================
// SECTION SEGMENTATION
// ============================================================

function splitSections(lines: string[]): ResumeSection[] {
  const sections: ResumeSection[] = [];

  let current: ResumeSection = {
    name: "header",
    title: "",
    lines: [],
    content: "",
  };

  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (current.lines.length > 0) {
        current.content = current.lines.join("\n");
        sections.push(current);
      }

      current = {
        name: resolveSectionName(line),
        title: cleanHeading(line),
        lines: [],
        content: "",
      };

      continue;
    }

    current.lines.push(line);
  }

  if (current.lines.length > 0) {
    current.content = current.lines.join("\n");
    sections.push(current);
  }

  return sections;
}

function isSectionHeading(line: string): boolean {
  const cleaned = normalizeHeading(line);

  return Boolean(SECTION_ALIASES[cleaned]);
}

function resolveSectionName(line: string): string {
  const cleaned = normalizeHeading(line);

  return SECTION_ALIASES[cleaned] ?? "unknown";
}

function normalizeHeading(line: string): string {
  return cleanHeading(line)
    .toLowerCase()
    .replace(/[^a-z0-9&\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanHeading(line: string): string {
  return line
    .replace(/^[•●▪▫◦‣⁃∙*➢➤►▸\s]+/, "")
    .replace(/[|:]+$/, "")
    .trim();
}

function getSectionLines(sections: ResumeSection[], name: string): string[] {
  return sections
    .filter((section) => section.name === name)
    .flatMap((section) => section.lines);
}

// ============================================================
// CANDIDATE
// ============================================================

function parseCandidate(lines: string[]): CandidateInfo {
  const combined = lines.join(" ");

  const email = combined.match(EMAIL_PATTERN)?.[0] ?? "";

  const phone = combined.match(PHONE_PATTERN)?.[0]?.trim() ?? "";

  const linkedin = combined.match(LINKEDIN_PATTERN)?.[0] ?? "";

  const github = combined.match(GITHUB_PATTERN)?.[0] ?? "";

  let name = "";

  for (const line of lines.slice(0, 8)) {
    const trimmed = line.trim();

    if (trimmed.length < 3 || trimmed.length > 60) {
      continue;
    }

    if (EMAIL_PATTERN.test(trimmed)) {
      continue;
    }

    if (PHONE_PATTERN.test(trimmed)) {
      continue;
    }

    if (URL_PATTERN.test(trimmed)) {
      continue;
    }

    if (isSectionHeading(trimmed)) {
      continue;
    }

    name = trimmed;
    break;
  }

  return {
    name,
    email,
    phone,
    location: "",
    linkedin,
    github,
    portfolio: "",
    headline: "",
  };
}

// ============================================================
// SUMMARY
// ============================================================

function extractSummary(sections: ResumeSection[]): string {
  return getSectionLines(sections, "summary")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// EDUCATION
// ============================================================

function parseEducation(lines: string[]): EducationItem[] {
  const items: EducationItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!isEducationLine(line)) {
      continue;
    }

    const dateMatch = line.match(DATE_RANGE_PATTERN);

    const degree = line.replace(DATE_RANGE_PATTERN, "").trim();

    const nextLine = lines[i + 1] ?? "";

    const institution =
      nextLine &&
      !DATE_RANGE_PATTERN.test(nextLine) &&
      !isEducationLine(nextLine)
        ? nextLine
        : "";

    items.push({
      degree,
      field: "",
      institution,
      location: "",
      startDate: dateMatch?.[1] ?? "",
      endDate: dateMatch?.[2] ?? "",
      description: "",
    });
  }

  return items;
}

function isEducationLine(line: string): boolean {
  return /\b(bachelor|bachelors|master|masters|b\.?tech|m\.?tech|b\.?sc|m\.?sc|b\.?e|m\.?e|phd|diploma|degree|associate)\b/i.test(
    line,
  );
}

// ============================================================
// EXPERIENCE
// ============================================================

function parseExperience(lines: string[]): ExperienceItem[] {
  const items: ExperienceItem[] = [];

  let current: ExperienceItem | null = null;

  for (const line of lines) {
    const dateMatch = line.match(DATE_RANGE_PATTERN);

    const looksLikeHeader = Boolean(dateMatch) || isExperienceTitle(line);

    if (looksLikeHeader && !BULLET_PATTERN.test(line)) {
      if (current) {
        items.push(current);
      }

      current = createExperienceItem(line, dateMatch);

      continue;
    }

    if (!current) {
      continue;
    }

    if (BULLET_PATTERN.test(line)) {
      current.achievements.push(removeBullet(line));
    } else {
      current.description = current.description
        ? `${current.description} ${line}`
        : line;
    }
  }

  if (current) {
    items.push(current);
  }

  return items;
}

function isExperienceTitle(line: string): boolean {
  return /\b(developer|engineer|manager|analyst|designer|consultant|lead|architect|administrator|specialist|director|intern|trainee|officer|executive)\b/i.test(
    line,
  );
}

function createExperienceItem(
  line: string,
  dateMatch: RegExpMatchArray | null,
): ExperienceItem {
  const withoutDate = dateMatch
    ? line.replace(DATE_RANGE_PATTERN, "").trim()
    : line.trim();

  const parts = withoutDate
    .split(/\s+[-–—|@]\s+|@/)
    .map((part) => part.trim())
    .filter(Boolean);

  const role = parts[0] ?? withoutDate;
  const company = parts[1] ?? "";

  return {
    company,
    role,
    location: "",
    startDate: dateMatch?.[1] ?? "",
    endDate: dateMatch?.[2] ?? "",
    description: "",
    achievements: [],
    technologies: [],
  };
}

// ============================================================
// PROJECTS
// ============================================================

function parseProjects(lines: string[]): ProjectItem[] {
  const projects: ProjectItem[] = [];

  let current: ProjectItem | null = null;

  for (const line of lines) {
    const dates = line.match(DATE_RANGE_PATTERN);

    const url = line.match(URL_PATTERN)?.[0] ?? "";

    const isProjectHeader =
      line.length < 100 && !BULLET_PATTERN.test(line) && !line.includes(":");

    if (isProjectHeader) {
      if (current) {
        projects.push(current);
      }

      current = {
        name: line
          .replace(DATE_RANGE_PATTERN, "")
          .replace(URL_PATTERN, "")
          .trim(),

        description: "",

        technologies: [],

        url,

        startDate: dates?.[1] ?? "",

        endDate: dates?.[2] ?? "",
      };

      continue;
    }

    if (!current) {
      continue;
    }

    const content = removeBullet(line);

    current.description = current.description
      ? `${current.description} ${content}`
      : content;
  }

  if (current) {
    projects.push(current);
  }

  return projects;
}

// ============================================================
// SKILLS
// ============================================================

function parseSkills(lines: string[]): {
  skills: string[];
  skillCategories: SkillCategory[];
} {
  const skillCategories: SkillCategory[] = [];
  const allSkills: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      continue;
    }

    if (trimmed.includes(":")) {
      const separatorIndex = trimmed.indexOf(":");

      const category = trimmed.slice(0, separatorIndex).trim();

      const list = trimmed.slice(separatorIndex + 1);

      const skills = splitSkillList(list);

      if (category && skills.length > 0) {
        skillCategories.push({
          category,
          skills: uniqueStrings(skills),
        });
      }

      allSkills.push(...skills);
      continue;
    }

    allSkills.push(...splitSkillList(trimmed));
  }

  return {
    skills: uniqueStrings(allSkills),
    skillCategories,
  };
}

function splitSkillList(value: string): string[] {
  return value
    .split(/[,;|•●▪▫◦‣⁃∙]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

// ============================================================
// CERTIFICATIONS
// ============================================================

function parseCertifications(lines: string[]): Array<{
  name: string;
  issuer: string;
  date: string;
  url: string;
}> {
  return lines.filter(Boolean).map((line) => {
    const url = line.match(URL_PATTERN)?.[0] ?? "";

    return {
      name: line.replace(URL_PATTERN, "").trim(),
      issuer: "",
      date: "",
      url,
    };
  });
}

// ============================================================
// LANGUAGES
// ============================================================

function parseLanguages(lines: string[]): Array<{
  name: string;
  proficiency: string;
}> {
  return lines.filter(Boolean).map((line) => {
    const parts = line.split(/[:|-]/);

    return {
      name: parts[0]?.trim() ?? "",

      proficiency: parts.slice(1).join(" ").trim(),
    };
  });
}

// ============================================================
// ACHIEVEMENTS
// ============================================================

function parseAchievements(lines: string[]): string[] {
  return uniqueStrings(
    lines
      .map(removeBullet)
      .map((line) => line.trim())
      .filter(Boolean),
  );
}

// ============================================================
// HELPERS
// ============================================================

function removeBullet(line: string): string {
  return line.replace(BULLET_PATTERN, "").trim();
}

function buildCleanText(sections: ResumeSection[]): string {
  return sections
    .map((section) => {
      const content = section.lines.join("\n");

      return section.title ? `${section.title}\n${content}` : content;
    })
    .join("\n\n")
    .trim();
}

function calculateQuality(text: string, sections: ResumeSection[]): number {
  if (!text.trim()) {
    return 0;
  }

  let score = 50;

  if (sections.length >= 3) {
    score += 15;
  }

  if (sections.length >= 5) {
    score += 10;
  }

  if (text.length >= 500) {
    score += 15;
  }

  if (text.length >= 1500) {
    score += 10;
  }

  return Math.min(100, score);
}
