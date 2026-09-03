import { cleanLine, normalizeText, uniqueStrings } from "./normalize";

import { extractSkills } from "./skills";

import type {
  CandidateData,
  ExperienceData,
  ProfileItemData,
  ProjectData,
} from "./types";

type ParsedResume = {
  candidate: CandidateData;
  summary: string;
  skills: string[];
  experienceDetails: ExperienceData[];
  education: ProfileItemData;
  projects: ProjectData[];
  certifications: string[];
  sections: Record<string, string[]>;
};

const SECTION_ALIASES: Record<string, string> = {
  summary: "summary",
  profile: "summary",
  "professional summary": "summary",
  "career summary": "summary",
  objective: "summary",
  "career objective": "summary",

  experience: "experience",
  "work experience": "experience",
  "professional experience": "experience",
  employment: "experience",
  "work history": "experience",

  education: "education",
  academics: "education",
  "academic background": "education",

  skills: "skills",
  "technical skills": "skills",
  "core skills": "skills",
  "key skills": "skills",
  "technical competencies": "skills",
  competencies: "skills",

  projects: "projects",
  "personal projects": "projects",
  "academic projects": "projects",
  "key projects": "projects",

  certifications: "certifications",
  certificates: "certifications",
  licenses: "certifications",

  achievements: "achievements",
  awards: "achievements",

  publications: "publications",
  research: "publications",

  "additional information": "additional",
  "extra curricular": "additional",
  extracurricular: "additional",
};

const DATE_PATTERN =
  /(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\.?\s*(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)?\.?\s*(?:19|20)\d{2}|present|current|now)/i;

const YEAR_RANGE_PATTERN =
  /(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present|current|now)/i;

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const PHONE_PATTERN =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/;

const LINKEDIN_PATTERN = /linkedin\.com\/in\/[A-Za-z0-9._-]+/i;

const GITHUB_PATTERN = /github\.com\/[A-Za-z0-9._-]+/i;

function normalizeHeader(line: string): string {
  return line
    .toLowerCase()
    .replace(/[:|]/g, "")
    .replace(/[^\w\s&/-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function detectSection(line: string): string | null {
  const normalized = normalizeHeader(line);

  if (!normalized || normalized.length > 60) {
    return null;
  }

  if (SECTION_ALIASES[normalized]) {
    return SECTION_ALIASES[normalized];
  }

  return null;
}

function splitIntoSections(text: string): Record<string, string[]> {
  const lines = normalizeText(text).split("\n").map(cleanLine).filter(Boolean);

  const sections: Record<string, string[]> = {
    header: [],
  };

  let currentSection = "header";

  for (const line of lines) {
    const detected = detectSection(line);

    if (detected) {
      currentSection = detected;

      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }

      continue;
    }

    if (!sections[currentSection]) {
      sections[currentSection] = [];
    }

    sections[currentSection].push(line);
  }

  return sections;
}

function looksLikeContactLine(line: string): boolean {
  return (
    EMAIL_PATTERN.test(line) ||
    PHONE_PATTERN.test(line) ||
    LINKEDIN_PATTERN.test(line) ||
    GITHUB_PATTERN.test(line)
  );
}

function looksLikeName(line: string): boolean {
  const value = line.trim();

  if (!value || value.length < 2 || value.length > 60) {
    return false;
  }

  if (looksLikeContactLine(value)) {
    return false;
  }

  if (/[0-9@]/.test(value)) {
    return false;
  }

  if (detectSection(value)) {
    return false;
  }

  const words = value.split(/\s+/);

  if (words.length < 2 || words.length > 6) {
    return false;
  }

  return words.every((word) => /^[A-Za-z.'-]+$/.test(word));
}

function extractCandidate(sections: Record<string, string[]>): CandidateData {
  const header = sections.header ?? [];

  let name: string | undefined;
  let headline: string | undefined;
  let location: string | undefined;

  for (const line of header.slice(0, 12)) {
    if (!name && looksLikeName(line)) {
      name = line;
      continue;
    }

    if (!headline && isLikelyHeadline(line)) {
      headline = line;
    }

    if (!location && isLikelyLocation(line)) {
      location = line;
    }
  }

  return {
    ...(name ? { name } : {}),
    ...(headline ? { headline } : {}),
    ...(location ? { location } : {}),
  };
}

function isLikelyHeadline(line: string): boolean {
  const value = line.toLowerCase();

  const headlineTerms = [
    "developer",
    "engineer",
    "designer",
    "analyst",
    "manager",
    "consultant",
    "student",
    "intern",
    "architect",
    "scientist",
    "specialist",
    "administrator",
    "marketing",
    "finance",
    "software",
    "data",
    "product",
    "sales",
    "operations",
  ];

  return (
    line.length <= 100 && headlineTerms.some((term) => value.includes(term))
  );
}

function isLikelyLocation(line: string): boolean {
  const value = line.toLowerCase();

  const locationTerms = [
    "india",
    "usa",
    "united states",
    "uk",
    "united kingdom",
    "canada",
    "australia",
    "bengaluru",
    "bangalore",
    "mumbai",
    "delhi",
    "hyderabad",
    "pune",
    "chennai",
    "kolkata",
    "new york",
    "california",
    "texas",
    "london",
    "singapore",
    "remote",
  ];

  return (
    line.length <= 80 && locationTerms.some((term) => value.includes(term))
  );
}

function cleanDescription(lines: string[]): string {
  return lines
    .map((line) => line.replace(/^[•▪◦●○‣⁃*-]\s*/, "").trim())
    .filter(Boolean)
    .join(" ")
    .trim();
}

function isBullet(line: string): boolean {
  return /^[•▪◦●○‣⁃*-]\s+/.test(line);
}

function extractDateRange(lines: string[]): string {
  for (const line of lines) {
    const match = line.match(DATE_PATTERN) ?? line.match(YEAR_RANGE_PATTERN);

    if (match?.[0]) {
      return match[0].replace(/\s+/g, " ").trim();
    }
  }

  return "";
}

function removeDateFromLine(line: string): string {
  return line
    .replace(DATE_PATTERN, "")
    .replace(YEAR_RANGE_PATTERN, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[|,\-–—:]+/, "")
    .replace(/[|,\-–—:]+$/, "")
    .trim();
}

function looksLikeExperienceHeading(line: string): boolean {
  if (line.length > 120) {
    return false;
  }

  if (isBullet(line)) {
    return false;
  }

  if (DATE_PATTERN.test(line) || YEAR_RANGE_PATTERN.test(line)) {
    return true;
  }

  const roleTerms = [
    "engineer",
    "developer",
    "designer",
    "analyst",
    "manager",
    "intern",
    "consultant",
    "specialist",
    "architect",
    "lead",
    "director",
    "associate",
    "administrator",
    "executive",
  ];

  const lower = line.toLowerCase();

  return roleTerms.some((term) => lower.includes(term));
}

function inferRoleAndCompany(lines: string[]): {
  role: string;
  company: string;
} {
  const usable = lines
    .map((line) => removeDateFromLine(line))
    .filter(Boolean)
    .slice(0, 3);

  if (!usable.length) {
    return {
      role: "Experience",
      company: "Not specified",
    };
  }

  const first = usable[0];

  const separators = [" at ", " | ", " — ", " – ", " - ", ", "];

  for (const separator of separators) {
    const index = first.toLowerCase().indexOf(separator.trim());

    if (index > 0) {
      const left = first.slice(0, index).trim();
      const right = first.slice(index + separator.trim().length).trim();

      if (left && right) {
        if (isRoleLike(left)) {
          return {
            role: left,
            company: right,
          };
        }

        if (isRoleLike(right)) {
          return {
            role: right,
            company: left,
          };
        }
      }
    }
  }

  if (usable.length >= 2) {
    const firstRoleLike = usable.findIndex(isRoleLike);

    if (firstRoleLike >= 0) {
      const role = usable[firstRoleLike];
      const company =
        usable.find(
          (line, index) => index !== firstRoleLike && !isRoleLike(line),
        ) ?? usable[0];

      return {
        role,
        company,
      };
    }
  }

  return {
    role: usable[0],
    company: usable[1] ?? "Not specified",
  };
}

function isRoleLike(line: string): boolean {
  const lower = line.toLowerCase();

  const terms = [
    "engineer",
    "developer",
    "designer",
    "analyst",
    "manager",
    "intern",
    "consultant",
    "specialist",
    "architect",
    "lead",
    "director",
    "associate",
    "administrator",
    "executive",
    "scientist",
    "coordinator",
  ];

  return terms.some((term) => lower.includes(term));
}

function parseExperience(lines: string[]): ExperienceData[] {
  if (!lines.length) {
    return [];
  }

  const entries: ExperienceData[] = [];
  let current: string[] = [];

  const flush = () => {
    if (!current.length) {
      return;
    }

    const duration = extractDateRange(current);

    const headerLines = current.filter((line) => !isBullet(line)).slice(0, 3);

    const bulletLines = current
      .filter(isBullet)
      .map((line) => line.replace(/^[•▪◦●○‣⁃*-]\s*/, "").trim())
      .filter(Boolean);

    const { role, company } = inferRoleAndCompany(headerLines);

    const description =
      cleanDescription(bulletLines.slice(0, 3)) ||
      cleanDescription(
        current.filter((line) => !headerLines.includes(line)).slice(0, 3),
      );

    const achievements = bulletLines.filter((line) =>
      /\b(increased|decreased|improved|reduced|saved|grew|generated|delivered|achieved|launched|built|automated|optimized|awarded)\b/i.test(
        line,
      ),
    );

    const responsibilities = bulletLines.filter(
      (line) => !achievements.includes(line),
    );

    if (role || company || description) {
      entries.push({
        company,
        role,
        duration: duration || "Duration not specified",
        description: description || "No detailed description provided.",
        ...(responsibilities.length ? { responsibilities } : {}),
        ...(achievements.length ? { achievements } : {}),
      });
    }

    current = [];
  };

  for (const line of lines) {
    const startsNewEntry =
      current.length > 0 &&
      looksLikeExperienceHeading(line) &&
      !isBullet(line) &&
      (DATE_PATTERN.test(line) || YEAR_RANGE_PATTERN.test(line));

    if (startsNewEntry) {
      flush();
    }

    current.push(line);
  }

  flush();

  return entries.slice(0, 12);
}

function parseEducation(lines: string[]): ProfileItemData {
  if (!lines.length) {
    return {
      label: "Education",
      value: "Not specified",
      detail: "No education details were detected.",
    };
  }

  const meaningful = lines.filter(Boolean).slice(0, 5);

  const joined = meaningful.join(" ");

  const degreePattern =
    /\b(?:bachelor|master|phd|doctorate|b\.?tech|m\.?tech|b\.?e\.?|m\.?e\.?|bca|mca|bsc|msc|mba|ba|ma|bs|ms|associate|diploma)\b[^,\n;]*/i;

  const degreeMatch = joined.match(degreePattern);

  const value =
    degreeMatch?.[0]?.trim() || meaningful[0] || "Education detected";

  const detail = meaningful
    .filter((line) => line !== value)
    .join(" ")
    .trim();

  return {
    label: "Education",
    value,
    ...(detail ? { detail } : {}),
  };
}

function projectNameFromLine(line: string): string {
  return line
    .replace(/^[•▪◦●○‣⁃*-]\s*/, "")
    .replace(/\b(?:technologies?|tech stack|stack|tools?)\s*:/i, "")
    .trim();
}

function parseProjects(lines: string[]): ProjectData[] {
  if (!lines.length) {
    return [];
  }

  const projects: ProjectData[] = [];
  let current: string[] = [];

  const flush = () => {
    if (!current.length) {
      return;
    }

    const nonBullet = current.filter((line) => !isBullet(line));

    const bullets = current
      .filter(isBullet)
      .map((line) => line.replace(/^[•▪◦●○‣⁃*-]\s*/, "").trim())
      .filter(Boolean);

    const name = projectNameFromLine(nonBullet[0] ?? current[0]);

    const description =
      cleanDescription(bullets.slice(0, 3)) ||
      cleanDescription(nonBullet.slice(1)) ||
      "Project details detected in resume.";

    const technologies = extractSkills(current.join("\n"));

    const contribution = bullets.find((line) =>
      /\b(built|developed|created|designed|implemented|developed|engineered|led|integrated|deployed)\b/i.test(
        line,
      ),
    );

    const impact = bullets.find((line) =>
      /\b(increased|improved|reduced|saved|grew|users|customers|performance|faster|efficiency|accuracy|revenue)\b/i.test(
        line,
      ),
    );

    if (name) {
      projects.push({
        name,
        description,
        ...(contribution ? { contribution } : {}),
        ...(technologies.length ? { technologies } : {}),
        ...(impact ? { impact } : {}),
      });
    }

    current = [];
  };

  for (const line of lines) {
    const isPotentialNewProject =
      current.length > 0 &&
      !isBullet(line) &&
      line.length < 100 &&
      !DATE_PATTERN.test(line) &&
      !YEAR_RANGE_PATTERN.test(line);

    if (isPotentialNewProject && current.some(isBullet)) {
      flush();
    }

    current.push(line);
  }

  flush();

  return projects.slice(0, 15);
}

function buildSummary(
  sections: Record<string, string[]>,
  candidate: CandidateData,
  skills: string[],
  experience: ExperienceData[],
  projects: ProjectData[],
): string {
  const explicitSummary = sections.summary?.join(" ").trim();

  if (explicitSummary) {
    return explicitSummary;
  }

  const headline = candidate.headline;

  const parts: string[] = [];

  if (headline) {
    parts.push(headline);
  }

  if (experience.length) {
    parts.push(
      `${experience.length} professional experience ${
        experience.length === 1 ? "entry" : "entries"
      } detected`,
    );
  }

  if (skills.length) {
    parts.push(`${skills.length} relevant skills detected`);
  }

  if (projects.length) {
    parts.push(
      `${projects.length} ${
        projects.length === 1 ? "project" : "projects"
      } identified`,
    );
  }

  return (
    parts.join(". ") || "Resume profile detected from the uploaded document."
  );
}

function buildCareerFocus(
  candidate: CandidateData,
  skills: string[],
  experience: ExperienceData[],
  projects: ProjectData[],
): ProfileItemData {
  const text = [
    candidate.headline ?? "",
    skills.join(" "),
    experience.map((item) => item.role).join(" "),
    projects.map((item) => item.name).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  let focus = "General professional profile";

  if (
    /\breact\b|\bnext\.js\b|\bjavascript\b|\btypescript\b|\bnode\.js\b/.test(
      text,
    )
  ) {
    focus = "Software / Web Development";
  } else if (
    /\bpython\b|\bpandas\b|\bnumpy\b|\bmachine learning\b|\bdata analysis\b/.test(
      text,
    )
  ) {
    focus = "Data / Machine Learning";
  } else if (
    /\baws\b|\bazure\b|\bdocker\b|\bkubernetes\b|\bdevops\b/.test(text)
  ) {
    focus = "Cloud / DevOps";
  } else if (/\bmarketing\b|\bsales\b|\bseo\b|\bcontent\b/.test(text)) {
    focus = "Marketing / Growth";
  } else if (/\bfinance\b|\baccounting\b|\bfinancial\b/.test(text)) {
    focus = "Finance / Business";
  }

  return {
    label: "Career Focus",
    value: focus,
    detail:
      "Inferred from the strongest recurring skills, experience titles, and project evidence.",
  };
}

export function parseResume(resumeText: string): ParsedResume {
  const normalized = normalizeText(resumeText);

  const sections = splitIntoSections(normalized);

  const candidate = extractCandidate(sections);

  const skills = uniqueStrings(extractSkills(normalized));

  const experienceDetails = parseExperience(sections.experience ?? []);

  const projects = parseProjects(sections.projects ?? []);

  const education = parseEducation(sections.education ?? []);

  const certifications = uniqueStrings(sections.certifications ?? []);

  const summary = buildSummary(
    sections,
    candidate,
    skills,
    experienceDetails,
    projects,
  );

  const careerFocus = buildCareerFocus(
    candidate,
    skills,
    experienceDetails,
    projects,
  );

  return {
    candidate,
    summary,
    skills,
    experienceDetails,
    education,
    projects,
    certifications,
    sections: {
      ...sections,
      careerFocus: [careerFocus.value],
    },
  };
}
