import type {
  CandidateInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeSection,
} from "./types";

import {
  canonicalHeading,
  cleanLine,
  normalizeText,
  repairPdfText,
} from "./normalize";

const SECTION_HEADINGS = new Set([
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "languages",
  "achievements",
]);

function isSectionHeading(line: string): boolean {
  const cleaned = line.replace(/[•:|]/g, " ").trim();

  const normalized = canonicalHeading(cleaned);

  if (SECTION_HEADINGS.has(normalized)) {
    return true;
  }

  /*
   * Handle visually split headings such as:
   * EDUC ATION
   * PROJ ECTS
   * CERT IFICATIONS
   */
  const compact = cleaned
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();

  return [
    "SUMMARY",
    "PROFILE",
    "EDUCATION",
    "EXPERIENCE",
    "WORKEXPERIENCE",
    "PROJECT",
    "PROJECTS",
    "SKILLS",
    "TECHNICALSKILLS",
    "CERTIFICATION",
    "CERTIFICATIONS",
    "LANGUAGES",
    "ACHIEVEMENTS",
    "AWARDS",
  ].includes(compact);
}

function sectionName(line: string): ResumeSection["name"] {
  const normalized = canonicalHeading(line);

  if (SECTION_HEADINGS.has(normalized)) {
    return normalized as ResumeSection["name"];
  }

  return "unknown";
}

function splitSections(lines: string[]): ResumeSection[] {
  const sections: ResumeSection[] = [];

  let current: ResumeSection = {
    name: "header",
    heading: "",
    lines: [],
  };

  for (const raw of lines) {
    const line = cleanLine(raw);

    if (!line) continue;

    if (isSectionHeading(line)) {
      if (current.lines.length) {
        sections.push(current);
      }

      current = {
        name: sectionName(line),
        heading: line,
        lines: [],
      };

      continue;
    }

    current.lines.push(line);
  }

  if (current.lines.length) {
    sections.push(current);
  }

  return sections;
}

function extractEmail(text: string): string | undefined {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
}

function extractPhone(text: string): string | undefined {
  const matches = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/g);

  if (!matches) return undefined;

  const candidate = matches
    .map((value) => value.trim())
    .find((value) => value.replace(/\D/g, "").length >= 8);

  return candidate;
}

function extractUrl(
  text: string,
  type: "linkedin" | "github" | "portfolio",
): string | undefined {
  const lower = text.toLowerCase();

  if (type === "linkedin") {
    const match = text.match(
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i,
    );

    return match?.[0];
  }

  if (type === "github") {
    const match = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i);

    return match?.[0];
  }

  if (lower.includes("portfolio") || lower.includes("website")) {
    const match = text.match(/https?:\/\/[^\s|]+/i);

    return match?.[0];
  }

  return undefined;
}

function looksLikeName(line: string): boolean {
  if (!line) return false;

  if (extractEmail(line)) {
    return false;
  }

  if (extractPhone(line)) {
    return false;
  }

  if (/https?:\/\//i.test(line)) {
    return false;
  }

  if (line.length < 3 || line.length > 60) {
    return false;
  }

  if (
    /summary|education|experience|skills|projects|certifications/i.test(line)
  ) {
    return false;
  }

  const words = line.trim().split(/\s+/);

  if (words.length < 2 || words.length > 5) {
    return false;
  }

  return words.every((word) => /^[A-Za-zÀ-ÿ.'-]+$/.test(word));
}

function parseCandidate(headerLines: string[]): CandidateInfo {
  const combined = headerLines.join(" ");

  const candidate: CandidateInfo = {};

  const name = headerLines.find(looksLikeName);

  if (name) {
    candidate.name = name;
  }

  candidate.email = extractEmail(combined);

  candidate.phone = extractPhone(combined);

  candidate.linkedin = extractUrl(combined, "linkedin");

  candidate.github = extractUrl(combined, "github");

  candidate.portfolio = extractUrl(combined, "portfolio");

  const headline = headerLines.find((line) => {
    if (line === candidate.name) {
      return false;
    }

    if (extractEmail(line)) {
      return false;
    }

    if (extractPhone(line)) {
      return false;
    }

    if (/linkedin|github|https?:\/\//i.test(line)) {
      return false;
    }

    return (
      line.length >= 8 &&
      line.length <= 120 &&
      /developer|engineer|analyst|manager|designer|student|machine learning|software|data/i.test(
        line,
      )
    );
  });

  if (headline) {
    candidate.headline = headline;
  }

  return candidate;
}

function parseDateRange(text: string): {
  startDate?: string;
  endDate?: string;
} {
  const match = text.match(
    /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(\d{4})\s*(?:-|–|—|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+)?(\d{4}|Present|Current)/i,
  );

  if (!match) {
    return {};
  }

  return {
    startDate: `${match[1] ?? ""}${match[2]}`,
    endDate: `${match[3] ?? ""}${match[4]}`,
  };
}

function looksLikeEducation(line: string): boolean {
  return /university|college|institute|school|mca|mba|bca|bba|b\.?tech|m\.?tech|master|bachelor|phd|computer applications|computer science/i.test(
    line,
  );
}

function parseEducation(lines: string[]): EducationItem[] {
  const items: EducationItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!looksLikeEducation(line)) {
      continue;
    }

    const date = parseDateRange(line);

    const previous = lines[i - 1];

    const institution = /university|college|institute|school/i.test(line)
      ? line
          .replace(
            /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*(?:-|–|—|to)\s*(?:Present|Current|[A-Za-z]+\s+)?\d{4}\b/gi,
            "",
          )
          .trim()
      : previous && /university|college|institute|school/i.test(previous)
        ? previous
        : line;

    let degree = line;

    const degreeMatch = line.match(
      /\b(MCA|MBA|BCA|BBA|B\.?Tech|M\.?Tech|Bachelor(?:'s)?|Master(?:'s)?|PhD|Doctorate)\b[^,|]*/i,
    );

    if (degreeMatch) {
      degree = degreeMatch[0].trim();
    }

    items.push({
      institution,
      degree,
      startDate: date.startDate,
      endDate: date.endDate,
      details: [],
    });
  }

  return dedupeEducation(items);
}

function dedupeEducation(items: EducationItem[]): EducationItem[] {
  const result: EducationItem[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const key = `${item.institution}|${item.degree}`.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(item);
  }

  return result;
}

function isProjectLink(line: string): boolean {
  return /(?:github|gitlab|live\s*(?:demo|link)|demo|portfolio)\s*:/i.test(
    line,
  );
}

function extractProjectLinks(line: string): {
  github?: string;
  liveDemo?: string;
} {
  const github = line.match(
    /(?:github|gitlab)\s*:\s*(https?:\/\/[^\s|]+)/i,
  )?.[1];

  const liveDemo = line.match(
    /(?:live(?:\s+demo)?|demo)\s*:\s*(https?:\/\/[^\s|]+)/i,
  )?.[1];

  return {
    github,
    liveDemo,
  };
}

function looksLikeProjectTitle(line: string): boolean {
  if (!line) return false;

  if (isProjectLink(line)) {
    return false;
  }

  if (/^[•●▪◦‣►▸]/.test(line)) {
    return false;
  }

  if (/^(github|live|demo)\s*:/i.test(line)) {
    return false;
  }

  if (
    /^(developed|built|created|implemented|designed|integrated|deployed|utilized|performed|trained|worked|responsible|managed|led|created|configured|added|improved|optimized|used)\b/i.test(
      line,
    )
  ) {
    return false;
  }

  return line.length >= 3 && line.length <= 100;
}

function parseProjects(lines: string[]): ProjectItem[] {
  const projects: ProjectItem[] = [];

  let current: ProjectItem | null = null;

  for (const rawLine of lines) {
    const line = cleanLine(rawLine);

    if (!line) continue;

    if (looksLikeProjectTitle(line) && !current) {
      current = {
        name: line,
        description: "",
        technologies: [],
      };

      const dates = parseDateRange(line);

      current.startDate = dates.startDate;

      current.endDate = dates.endDate;

      continue;
    }

    if (looksLikeProjectTitle(line) && current && current.description) {
      projects.push(current);

      current = {
        name: line,
        description: "",
        technologies: [],
      };

      continue;
    }

    if (!current) {
      continue;
    }

    if (isProjectLink(line)) {
      const links = extractProjectLinks(line);

      if (links.github) {
        current.github = links.github;
      }

      if (links.liveDemo) {
        current.liveDemo = links.liveDemo;
      }

      continue;
    }

    const techMatch = line.match(/^tech(?:nologies|stack)?\s*:\s*(.+)$/i);

    if (techMatch) {
      current.technologies = techMatch[1]
        .split(/[,|]/)
        .map((value) => value.trim())
        .filter(Boolean);

      continue;
    }

    const bullet = line.replace(/^[•●▪◦‣►▸]\s*/, "").trim();

    if (!current.description) {
      current.description = bullet;
    } else {
      current.description += ` ${bullet}`;
    }
  }

  if (current) {
    projects.push(current);
  }

  return projects.filter((project) => project.name && project.description);
}

function parseSkills(lines: string[]): string[] {
  const result: string[] = [];

  for (const line of lines) {
    const cleaned = line.replace(/^[^:]+:\s*/i, "");

    const values = cleaned.split(/[,|•]/);

    for (const value of values) {
      const skill = value.trim();

      if (skill.length >= 2 && skill.length <= 50) {
        result.push(skill);
      }
    }
  }

  return result;
}

export function parseResume(input: string): {
  candidate: CandidateInfo;
  summary: string;
  education: EducationItem[];
  experienceDetails: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
  certifications: string[];
  languages: string[];
  sections: ResumeSection[];
  rawText: string;
  cleanText: string;
} {
  const rawText = input;

  const repaired = repairPdfText(normalizeText(input));

  const lines = repaired.split("\n").map(cleanLine).filter(Boolean);

  const sections = splitSections(lines);

  const header = sections.find((section) => section.name === "header");

  const candidate = parseCandidate(header?.lines ?? lines.slice(0, 10));

  const summary =
    sections.find((section) => section.name === "summary")?.lines.join(" ") ??
    "";

  const education = parseEducation(
    sections
      .filter((section) => section.name === "education")
      .flatMap((section) => section.lines),
  );

  const projects = parseProjects(
    sections
      .filter((section) => section.name === "projects")
      .flatMap((section) => section.lines),
  );

  const skills = parseSkills(
    sections
      .filter((section) => section.name === "skills")
      .flatMap((section) => section.lines),
  );

  const certifications = sections
    .filter((section) => section.name === "certifications")
    .flatMap((section) => section.lines);

  const languages = sections
    .filter((section) => section.name === "languages")
    .flatMap((section) => section.lines);

  /*
   * IMPORTANT:
   * Do not invent work experience.
   *
   * Experience parser will only create an item
   * when strong company/role evidence exists.
   */
  const experienceDetails: ExperienceItem[] = [];

  return {
    candidate,
    summary,
    education,
    experienceDetails,
    projects,
    skills,
    certifications,
    languages,
    sections,
    rawText,
    cleanText: repaired,
  };
}
