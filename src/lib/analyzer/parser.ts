import { extractText, getDocumentProxy } from "unpdf";

import type {
  CandidateInfo,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  ProjectItem,
  ResumeData,
  ResumeSection,
  SkillCategory,
} from "./types";

/* =========================================================
   PDF EXTRACTION
========================================================= */

async function extractPdfText(pdfBuffer: Buffer): Promise<string> {
  if (!pdfBuffer || pdfBuffer.length === 0) {
    throw new Error("The uploaded PDF is empty.");
  }

  const header = pdfBuffer.subarray(0, 5).toString("ascii");

  if (header !== "%PDF-") {
    throw new Error("The uploaded file is not a valid PDF.");
  }

  try {
    const data = new Uint8Array(
      pdfBuffer.buffer,
      pdfBuffer.byteOffset,
      pdfBuffer.byteLength,
    );

    const pdf = await getDocumentProxy(data);

    const result = await extractText(pdf, {
      mergePages: true,
    });

    const text = typeof result.text === "string" ? result.text : "";

    const cleanedText = text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!cleanedText) {
      throw new Error(
        "The PDF contains no readable text. It may be an image-only or scanned resume.",
      );
    }

    console.log(
      `[Revio] PDF extracted successfully: ${result.totalPages} page(s), ${cleanedText.length} characters`,
    );

    return cleanedText;
  } catch (error) {
    console.error("[Revio] PDF extraction failed:", error);

    if (error instanceof Error) {
      throw new Error(
        `Unable to extract text from the uploaded PDF. ${error.message}`,
      );
    }

    throw new Error("Unable to extract text from the uploaded PDF.");
  }
}

/* =========================================================
   TEXT CLEANING
========================================================= */

function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function repairText(text: string): string {
  return text
    .replace(/([a-z])-\n([a-z])/gi, "$1$2")
    .replace(/\n\s*•\s*/g, "\n• ")
    .replace(/\n\s*-\s+/g, "\n- ")
    .replace(/\n\s*\*\s+/g, "\n* ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/* =========================================================
   SECTION DETECTION
========================================================= */

function normalizeHeading(line: string): string {
  return line.toLowerCase().replace(/[.:|]/g, "").replace(/\s+/g, " ").trim();
}

function isSectionHeading(line: string): boolean {
  const normalized = normalizeHeading(line);

  const headings = new Set([
    "summary",
    "professional summary",
    "profile",
    "professional profile",
    "objective",
    "career objective",
    "about",
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "employment history",
    "work history",
    "education",
    "academic background",
    "academic qualifications",
    "qualifications",
    "skills",
    "technical skills",
    "core skills",
    "key skills",
    "competencies",
    "projects",
    "personal projects",
    "academic projects",
    "professional projects",
    "certifications",
    "certificates",
    "achievements",
    "accomplishments",
    "awards",
    "languages",
    "interests",
    "volunteer",
    "volunteering",
    "publications",
    "references",
  ]);

  if (headings.has(normalized)) {
    return true;
  }

  /*
   * Only consider short ALL-CAPS lines as headings.
   * Do NOT classify a person's uppercase name as a section
   * unless it exactly matches one of the known headings.
   */
  if (
    line.length <= 40 &&
    /^[A-Z][A-Z0-9 &/,'’+-]+$/.test(line) &&
    !/@/.test(line) &&
    !/\d{4}/.test(line)
  ) {
    return false;
  }

  return false;
}

function normalizeSectionName(name: string): string {
  const value = normalizeHeading(name);

  if (
    value.includes("summary") ||
    value.includes("profile") ||
    value.includes("objective") ||
    value === "about"
  ) {
    return "summary";
  }

  if (
    value.includes("experience") ||
    value.includes("employment") ||
    value.includes("work history")
  ) {
    return "experience";
  }

  if (
    value.includes("education") ||
    value.includes("academic") ||
    value.includes("qualification")
  ) {
    return "education";
  }

  if (value.includes("skill") || value.includes("competenc")) {
    return "skills";
  }

  if (value.includes("project")) {
    return "projects";
  }

  if (value.includes("certification") || value.includes("certificate")) {
    return "certifications";
  }

  if (value.includes("language")) {
    return "languages";
  }

  if (
    value.includes("achievement") ||
    value.includes("accomplishment") ||
    value.includes("award")
  ) {
    return "achievements";
  }

  return value;
}

function buildSections(lines: string[]): ResumeSection[] {
  const sections: ResumeSection[] = [];

  let current: ResumeSection | null = null;

  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (current) {
        current.content = current.lines.join("\n").trim();

        if (current.lines.length > 0 || current.name !== "header") {
          sections.push(current);
        }
      }

      current = {
        name: normalizeSectionName(line),
        title: line,
        lines: [],
        content: "",
      };

      continue;
    }

    if (!current) {
      current = {
        name: "header",
        title: "Header",
        lines: [],
        content: "",
      };
    }

    current.lines.push(line);
  }

  if (current) {
    current.content = current.lines.join("\n").trim();

    if (current.lines.length > 0 || current.name !== "header") {
      sections.push(current);
    }
  }

  return sections;
}

function findSection(
  sections: ResumeSection[],
  name: string,
): ResumeSection | undefined {
  return sections.find(
    (section) => section.name === name || section.name.includes(name),
  );
}

/* =========================================================
   CONTACT INFORMATION
========================================================= */

function extractEmail(text: string): string {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function extractPhone(text: string): string {
  const matches = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/g) ?? [];

  return (
    matches
      .map((value) => value.trim())
      .find((value) => value.replace(/\D/g, "").length >= 8) ?? ""
  );
}

function extractLinkedIn(text: string): string {
  return (
    text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s)]+/i)?.[0] ?? ""
  );
}

function extractGitHub(text: string): string {
  return (
    text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s)]+/i)?.[0] ?? ""
  );
}

function extractPortfolio(text: string): string {
  const urls = text.match(/https?:\/\/[^\s)]+/gi) ?? [];

  return urls.find((url) => !/linkedin\.com|github\.com/i.test(url)) ?? "";
}

/* =========================================================
   CANDIDATE
========================================================= */

function isContactLine(line: string): boolean {
  return (
    line.includes("@") ||
    /https?:\/\//i.test(line) ||
    /linkedin\.com|github\.com/i.test(line) ||
    /\+?\d[\d\s().-]{7,}\d/.test(line)
  );
}

function looksLikeName(line: string): boolean {
  const value = line.trim();

  if (!value || value.length < 2 || value.length > 60) {
    return false;
  }

  if (isContactLine(value)) {
    return false;
  }

  if (isSectionHeading(value)) {
    return false;
  }

  if (/\d/.test(value)) {
    return false;
  }

  if (/[,:;|]/.test(value)) {
    return false;
  }

  const words = value.split(/\s+/);

  if (words.length < 2 || words.length > 5) {
    return false;
  }

  return words.every((word) => /^[A-Za-zÀ-ÿ.'’-]+$/.test(word));
}

function extractName(lines: string[]): string {
  for (const line of lines.slice(0, 12)) {
    if (looksLikeName(line)) {
      return line;
    }
  }

  return "";
}

function extractLocation(text: string): string {
  const patterns = [
    /(?:location|address)\s*[:\-]\s*([^\n]+)/i,
    /(?:based in|located in)\s+([^\n]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function extractHeadline(lines: string[], name: string): string {
  const nameIndex = name
    ? lines.findIndex((line) => line.toLowerCase() === name.toLowerCase())
    : -1;

  const start = nameIndex >= 0 ? nameIndex + 1 : 0;

  for (let index = start; index < Math.min(lines.length, start + 8); index++) {
    const line = lines[index];

    if (!line) {
      continue;
    }

    if (isContactLine(line) || isSectionHeading(line)) {
      continue;
    }

    if (line.length >= 3 && line.length <= 120 && !looksLikeName(line)) {
      return line;
    }
  }

  return "";
}

function buildCandidate(text: string, lines: string[]): CandidateInfo {
  const name = extractName(lines);

  return {
    name,
    email: extractEmail(text),
    phone: extractPhone(text),
    location: extractLocation(text),
    linkedin: extractLinkedIn(text),
    github: extractGitHub(text),
    portfolio: extractPortfolio(text),
    headline: extractHeadline(lines, name),
  };
}

/* =========================================================
   SUMMARY
========================================================= */

function extractSummary(sections: ResumeSection[]): string {
  const section = findSection(sections, "summary");

  return section?.content.trim() ?? "";
}

/* =========================================================
   DATE HELPERS
========================================================= */

function parseDateRange(text: string): {
  startDate: string;
  endDate: string;
} {
  const matches =
    text.match(
      /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)?\s*(?:19|20)\d{2}\b|\b(?:19|20)\d{2}\b/gi,
    ) ?? [];

  return {
    startDate: matches[0]?.trim() ?? "",
    endDate: matches[1]?.trim() ?? "",
  };
}

function containsDate(text: string): boolean {
  return (
    /\b(?:19|20)\d{2}\b/.test(text) ||
    /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(?:19|20)\d{2}\b/i.test(
      text,
    )
  );
}

/* =========================================================
   EDUCATION
========================================================= */

function looksLikeDegree(text: string): boolean {
  const value = text.toLowerCase();

  const degrees = [
    "bachelor",
    "bachelor's",
    "master",
    "master's",
    "phd",
    "ph.d",
    "doctorate",
    "doctor",
    "b.tech",
    "btech",
    "m.tech",
    "mtech",
    "b.e",
    "be",
    "m.e",
    "me",
    "bca",
    "mca",
    "bba",
    "mba",
    "bsc",
    "m.sc",
    "msc",
    "b.com",
    "bcom",
    "m.com",
    "mcom",
    "llb",
    "llm",
    "diploma",
    "associate",
    "degree",
  ];

  return degrees.some((degree) => value.includes(degree));
}

function looksLikeInstitution(text: string): boolean {
  const value = text.toLowerCase();

  const institutionWords = [
    "university",
    "institute",
    "college",
    "school",
    "academy",
    "technological",
    "technology",
    "campus",
  ];

  return institutionWords.some((word) => value.includes(word));
}

function parseEducation(section?: ResumeSection): EducationItem[] {
  if (!section) {
    return [];
  }

  const lines = section.lines.filter(Boolean);
  const result: EducationItem[] = [];

  let current: EducationItem | null = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (looksLikeDegree(line)) {
      if (current) {
        result.push(current);
      }

      const dates = parseDateRange(line);

      current = {
        degree: line
          .replace(/\b(?:19|20)\d{2}\b/g, "")
          .replace(/\s{2,}/g, " ")
          .trim(),
        field: "",
        institution: "",
        location: "",
        startDate: dates.startDate,
        endDate: dates.endDate,
        description: "",
      };

      const nextLine = lines[index + 1] ?? "";

      if (nextLine && looksLikeInstitution(nextLine)) {
        current.institution = nextLine;
        index++;
      }

      continue;
    }

    if (!current) {
      if (looksLikeInstitution(line)) {
        const dates = parseDateRange(line);

        current = {
          degree: "",
          field: "",
          institution: line,
          location: "",
          startDate: dates.startDate,
          endDate: dates.endDate,
          description: "",
        };
      }

      continue;
    }

    if (containsDate(line)) {
      const dates = parseDateRange(line);

      if (!current.startDate) {
        current.startDate = dates.startDate;
      }

      if (!current.endDate) {
        current.endDate = dates.endDate;
      }

      continue;
    }

    if (!current.institution && looksLikeInstitution(line)) {
      current.institution = line;
      continue;
    }

    if (!current.field && !looksLikeInstitution(line)) {
      current.field = line.replace(/^[-•*]\s*/, "").trim();

      continue;
    }

    current.description = current.description
      ? `${current.description} ${line}`
      : line;
  }

  if (current) {
    result.push(current);
  }

  return result.filter((item) => item.degree || item.field || item.institution);
}

/* =========================================================
   EXPERIENCE
========================================================= */

function looksLikeRole(text: string): boolean {
  const value = text.toLowerCase();

  const roleWords = [
    "engineer",
    "developer",
    "designer",
    "manager",
    "analyst",
    "consultant",
    "intern",
    "lead",
    "director",
    "specialist",
    "administrator",
    "architect",
    "scientist",
    "executive",
    "associate",
    "officer",
    "coordinator",
    "programmer",
    "researcher",
    "recruiter",
    "marketer",
    "accountant",
    "supervisor",
    "assistant",
    "technician",
    "trainee",
    "founder",
    "co-founder",
    "head",
    "president",
    "vice president",
    "vp",
  ];

  return roleWords.some((word) => value.includes(word));
}

function looksLikeCompany(text: string): boolean {
  const value = text.toLowerCase();

  const companyWords = [
    "ltd",
    "limited",
    "llc",
    "inc",
    "inc.",
    "incorporated",
    "corp",
    "corporation",
    "technologies",
    "technology",
    "solutions",
    "systems",
    "software",
    "services",
    "consulting",
    "labs",
    "laboratory",
    "group",
    "company",
    "studio",
    "agency",
    "startup",
  ];

  return companyWords.some((word) => value.includes(word));
}

function isBulletLine(text: string): boolean {
  return /^[-•*▪◦●]\s*/.test(text);
}

function cleanBullet(text: string): string {
  return text.replace(/^[-•*▪◦●]\s*/, "").trim();
}

function parseExperience(section?: ResumeSection): ExperienceItem[] {
  if (!section) {
    return [];
  }

  const lines = section.lines.filter(Boolean);

  const result: ExperienceItem[] = [];

  let current: ExperienceItem | null = null;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (isBulletLine(line)) {
      if (current) {
        current.achievements.push(cleanBullet(line));
      }

      continue;
    }

    const dates = parseDateRange(line);
    const hasDate = containsDate(line);
    const role = looksLikeRole(line);
    const company = looksLikeCompany(line);

    /*
     * A date line belongs to the current experience.
     */
    if (hasDate && current) {
      if (!current.startDate) {
        current.startDate = dates.startDate;
      }

      if (!current.endDate) {
        current.endDate = dates.endDate;
      }

      continue;
    }

    /*
     * First line of an experience is often the company.
     */
    if (!current) {
      current = {
        company: company ? line : "",
        role: role ? line : "",
        location: "",
        startDate: dates.startDate,
        endDate: dates.endDate,
        description: "",
        achievements: [],
        technologies: [],
      };

      if (!current.company && !current.role) {
        current.company = line;
      }

      continue;
    }

    /*
     * Company comes before role.
     */
    if (!current.company && company) {
      current.company = line;
      continue;
    }

    /*
     * Role comes after company.
     */
    if (!current.role && role) {
      current.role = line;
      continue;
    }

    /*
     * If we already have company + role and another
     * company/role-looking line appears, begin a new job.
     */
    if (current.company && current.role && (company || role)) {
      result.push(current);

      current = {
        company: company ? line : "",
        role: role ? line : "",
        location: "",
        startDate: dates.startDate,
        endDate: dates.endDate,
        description: "",
        achievements: [],
        technologies: [],
      };

      continue;
    }

    /*
     * Non-bullet text belongs to the current experience.
     */
    if (!current.description) {
      current.description = line;
    } else {
      current.description += ` ${line}`;
    }
  }

  if (current) {
    result.push(current);
  }

  return result.filter(
    (item) =>
      item.company ||
      item.role ||
      item.description ||
      item.achievements.length > 0,
  );
}

/* =========================================================
   PROJECTS
========================================================= */

function isProjectMetadata(line: string): boolean {
  return /^(technologies|technology|tech stack|tools|built with|stack)\s*[:\-]/i.test(
    line,
  );
}

function looksLikeProjectTitle(
  line: string,
  current: ProjectItem | null,
): boolean {
  const value = line.trim();

  if (!value) {
    return false;
  }

  if (isBulletLine(value)) {
    return false;
  }

  if (isProjectMetadata(value)) {
    return false;
  }

  if (/^https?:\/\//i.test(value)) {
    return false;
  }

  if (value.length < 3 || value.length > 90) {
    return false;
  }

  if (/[.!?]$/.test(value)) {
    return false;
  }

  if (
    /\b(developed|created|built|designed|implemented|worked|responsible|developing|using|used|leveraged|integrated|enabled|improved|achieved)\b/i.test(
      value,
    )
  ) {
    return false;
  }

  const words = value.split(/\s+/);

  if (words.length > 12) {
    return false;
  }

  /*
   * First non-bullet line is allowed to start a project.
   */
  if (!current) {
    return true;
  }

  /*
   * A short title-like line beginning with an uppercase
   * character can start the next project.
   */
  return /^[A-Z0-9]/.test(value);
}

function parseProjects(section?: ResumeSection): ProjectItem[] {
  if (!section) {
    return [];
  }

  const lines = section.lines.filter(Boolean);

  const result: ProjectItem[] = [];

  let current: ProjectItem | null = null;

  for (const line of lines) {
    const url = line.match(/https?:\/\/[^\s)]+/i)?.[0] ?? "";

    const metadataMatch = line.match(
      /^(?:technologies|technology|tech stack|tools|built with|stack)\s*[:\-]\s*(.+)$/i,
    );

    if (looksLikeProjectTitle(line, current)) {
      if (current) {
        result.push(current);
      }

      const dates = parseDateRange(line);

      const name = line
        .replace(/\b(?:19|20)\d{2}\b/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      current = {
        name: name || line,
        description: "",
        technologies: [],
        url,
        startDate: dates.startDate,
        endDate: dates.endDate,
      };

      continue;
    }

    if (!current) {
      continue;
    }

    if (url && !current.url) {
      current.url = url;
    }

    if (metadataMatch?.[1]) {
      const technologies = metadataMatch[1]
        .split(/[,;|•]/)
        .map((value) => value.trim())
        .filter(Boolean);

      current.technologies.push(...technologies);

      continue;
    }

    if (containsDate(line)) {
      const dates = parseDateRange(line);

      if (!current.startDate) {
        current.startDate = dates.startDate;
      }

      if (!current.endDate) {
        current.endDate = dates.endDate;
      }

      continue;
    }

    const cleaned = cleanBullet(line);

    if (!cleaned) {
      continue;
    }

    current.description = current.description
      ? `${current.description} ${cleaned}`
      : cleaned;
  }

  if (current) {
    result.push(current);
  }

  return result.filter(
    (project) =>
      project.name &&
      (project.description || project.technologies.length > 0 || project.url),
  );
}

/* =========================================================
   SKILLS
========================================================= */

function parseSkills(section?: ResumeSection): {
  skills: string[];
  categories: SkillCategory[];
} {
  if (!section) {
    return {
      skills: [],
      categories: [],
    };
  }

  const categories: SkillCategory[] = [];
  const skills: string[] = [];

  for (const line of section.lines) {
    const separator = line.match(/^([^:|-]{2,40})\s*[:|-]\s*(.+)$/);

    if (separator) {
      const category = separator[1].trim();

      const values = separator[2]
        .split(/[,;|•]/)
        .map((value) => value.trim())
        .filter(Boolean);

      categories.push({
        category,
        skills: values,
      });

      skills.push(...values);

      continue;
    }

    const values = line
      .replace(/^[-•*]\s*/, "")
      .split(/[,;|]/)
      .map((value) => value.trim())
      .filter(Boolean);

    skills.push(...values);
  }

  return {
    skills: uniqueStrings(skills),
    categories,
  };
}

/* =========================================================
   CERTIFICATIONS
========================================================= */

function parseCertifications(section?: ResumeSection): CertificationItem[] {
  if (!section) {
    return [];
  }

  return section.lines.filter(Boolean).map((line) => ({
    name: cleanBullet(line),
    issuer: "",
    date: parseDateRange(line).endDate,
    url: line.match(/https?:\/\/[^\s)]+/i)?.[0] ?? "",
  }));
}

/* =========================================================
   LANGUAGES
========================================================= */

function parseLanguages(section?: ResumeSection): LanguageItem[] {
  if (!section) {
    return [];
  }

  return section.lines.filter(Boolean).map((line) => {
    const match = line.match(/^(.+?)\s*[:\-|]\s*(.+)$/);

    return {
      name: match?.[1]?.trim() ?? line.trim(),
      proficiency: match?.[2]?.trim() ?? "",
    };
  });
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

function parseAchievements(section?: ResumeSection): string[] {
  if (!section) {
    return [];
  }

  return section.lines.map(cleanBullet).filter(Boolean);
}

/* =========================================================
   TECHNOLOGY SKILLS
========================================================= */

function extractTechnologySkills(text: string): string[] {
  const knownSkills = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "SQL",
    "HTML",
    "CSS",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Angular",
    "Vue",
    "Svelte",
    "Tailwind CSS",
    "Redux",
    "GraphQL",
    "REST API",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Prisma",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "GitHub",
    "Figma",
    "Jest",
    "Cypress",
    "Playwright",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Machine Learning",
    "Deep Learning",
    "Data Analysis",
    "Power BI",
    "Tableau",
    "Excel",
  ];

  const lowerText = text.toLowerCase();

  return knownSkills.filter((skill) => lowerText.includes(skill.toLowerCase()));
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();

    if (!trimmed) {
      continue;
    }

    const normalized = trimmed.toLowerCase();

    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(trimmed);
  }

  return result;
}

/* =========================================================
   EXTRACTION QUALITY
========================================================= */

function calculateExtractionQuality(text: string): number {
  if (!text.trim()) {
    return 0;
  }

  const words = text.split(/\s+/).length;

  let score = 50;

  if (words >= 100) {
    score += 15;
  }

  if (words >= 300) {
    score += 10;
  }

  if (words >= 600) {
    score += 10;
  }

  if (/[A-Z][a-z]+/.test(text)) {
    score += 5;
  }

  if (/@/.test(text)) {
    score += 5;
  }

  if (/\d{4}/.test(text)) {
    score += 5;
  }

  return Math.min(100, score);
}

/* =========================================================
   MAIN PARSER
========================================================= */

export async function parseResume(
  pdfBuffer: Buffer,
  metadata?: Partial<ResumeData["metadata"]>,
): Promise<ResumeData> {
  if (!Buffer.isBuffer(pdfBuffer)) {
    throw new Error("Invalid resume file. Expected a PDF buffer.");
  }

  const rawText = await extractPdfText(pdfBuffer);

  const normalizedText = normalizeText(rawText);

  const cleanText = repairText(normalizedText);

  const lines = getLines(cleanText);

  const sections = buildSections(lines);

  const candidate = buildCandidate(cleanText, lines);

  const summary = extractSummary(sections);

  const education = parseEducation(findSection(sections, "education"));

  const experience = parseExperience(findSection(sections, "experience"));

  const projects = parseProjects(findSection(sections, "projects"));

  const parsedSkills = parseSkills(findSection(sections, "skills"));

  const technologySkills = extractTechnologySkills(cleanText);

  const skills = uniqueStrings([...parsedSkills.skills, ...technologySkills]);

  const certifications = parseCertifications(
    findSection(sections, "certifications"),
  );

  const languages = parseLanguages(findSection(sections, "languages"));

  const achievements = parseAchievements(findSection(sections, "achievements"));

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  const characterCount = cleanText.length;

  const pageCount = metadata?.pageCount ?? 1;

  const extractionQuality =
    metadata?.extractionQuality ?? calculateExtractionQuality(cleanText);

  return {
    candidate,
    summary,
    education,
    experience,
    projects,
    skills,
    skillCategories: parsedSkills.categories,
    certifications,
    languages,
    achievements,
    sections,
    rawText,
    cleanText,
    metadata: {
      pageCount,
      wordCount: metadata?.wordCount ?? wordCount,
      characterCount: metadata?.characterCount ?? characterCount,
      extractionQuality,
    },
  };
}

/* =========================================================
   PUBLIC HELPERS
========================================================= */

export async function extractResumeText(pdfBuffer: Buffer): Promise<string> {
  return extractPdfText(pdfBuffer);
}

export function extractSkills(text: string): string[] {
  return uniqueStrings(extractTechnologySkills(text));
}
