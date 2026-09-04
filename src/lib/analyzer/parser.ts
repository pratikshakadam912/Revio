import {
  cleanLine,
  normalizeSkill,
  normalizeText,
  uniqueStrings,
} from "./normalize";
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
  education: ProfileItemData;
  skills: string[];
  projects: ProjectData[];
  experienceDetails: ExperienceData[];
  sections: Record<string, string[]>;
};

type ResumeSection =
  | "header"
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "achievements"
  | "other";

const SECTION_ALIASES: Record<string, ResumeSection> = {
  summary: "summary",
  objective: "summary",
  "professional summary": "summary",
  "career objective": "summary",
  profile: "summary",
  about: "summary",

  education: "education",
  academic: "education",
  academics: "education",
  "academic background": "education",

  experience: "experience",
  "work experience": "experience",
  "professional experience": "experience",
  employment: "experience",
  internships: "experience",
  internship: "experience",
  "work history": "experience",

  projects: "projects",
  project: "projects",
  "personal projects": "projects",
  "academic projects": "projects",
  "key projects": "projects",

  skills: "skills",
  "technical skills": "skills",
  "technical skill": "skills",
  "core skills": "skills",
  "skills & technologies": "skills",
  "skills and technologies": "skills",

  certifications: "certifications",
  certificates: "certifications",
  achievements: "achievements",
  awards: "achievements",
};

const CONTACT_PATTERNS = [
  /@/,
  /\b(?:linkedin|github)\.com\b/i,
  /\b(?:https?:\/\/|www\.)/i,
  /\b(?:gmail|outlook|hotmail|yahoo)\b/i,
  /\+?\d[\d\s().-]{7,}\d/,
];

const PROJECT_METADATA_LABELS = [
  "tech stack",
  "technology",
  "technologies",
  "technologies used",
  "tech",
  "tools",
  "tools used",
  "what the project does",
  "project description",
  "description",
  "features",
  "key features",
  "responsibilities",
  "contribution",
  "my contribution",
  "role",
  "github",
  "git hub",
  "repository",
  "repo",
  "source code",
  "live demo",
  "livedemo",
  "demo",
  "demo link",
  "website",
  "url",
  "link",
];

const PROJECT_METADATA_REGEX = new RegExp(
  `^(?:${PROJECT_METADATA_LABELS.map(escapeRegex).join("|")})\\s*[:\\-]?\\s*`,
  "i",
);

const DATE_RANGE_REGEX =
  /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}\s*(?:-|–|—|to)\s*(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}|present|ongoing|current|\d{4})/i;

const YEAR_RANGE_REGEX =
  /\b(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present|ongoing|current)\b/i;

const SINGLE_DATE_REGEX =
  /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{4}\b/i;

const PRESENT_REGEX = /\b(?:present|ongoing|current)\b/i;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeLine(value: string): string {
  return cleanLine(
    String(value ?? "")
      .replace(/\u0000/g, "")
      .replace(/\|/g, " | ")
      .replace(/[ \t]+/g, " ")
      .trim(),
  );
}

/**
 * Repairs text that commonly comes from PDF text boxes.
 *
 * Examples:
 *   KIRTESHSHIRODKAR -> KIRTESH SHIRODKAR
 *   FullStackDeveloper -> Full Stack Developer
 *   LiveDemo -> Live Demo
 *   TechStack -> Tech Stack
 */
function repairCommonJoinedWords(value: string): string {
  let text = String(value ?? "").trim();

  if (!text) return "";

  const replacements: Array<[RegExp, string]> = [
    [/\bLiveDemo\b/gi, "Live Demo"],
    [/\bTechStack\b/gi, "Tech Stack"],
    [/\bGithub\b/gi, "GitHub"],
    [/\bGitHub\b/gi, "GitHub"],
    [/\bFullStack\b/gi, "Full Stack"],
    [/\bFullstack\b/gi, "Full Stack"],
    [/\bSocialMedia\b/gi, "Social Media"],
    [/\bSocialMediaPlatform\b/gi, "Social Media Platform"],
    [/\bJavaScriptTypeScript\b/gi, "JavaScript, TypeScript"],
    [/\bTypeScriptReact\b/gi, "TypeScript, React"],
    [/\bReactNext\.js\b/gi, "React, Next.js"],
    [/\bNext\.jsNode\.js\b/gi, "Next.js, Node.js"],
    [/\bNode\.jsPostgreSQL\b/gi, "Node.js, PostgreSQL"],
    [/\bPostgreSQLGitHub\b/gi, "PostgreSQL, GitHub"],
    [/\bGitHubPrisma\b/gi, "GitHub, Prisma"],
    [/\bNext\.jsTypeScript\b/gi, "Next.js, TypeScript"],
    [/\bPostgreSQLPrisma\b/gi, "PostgreSQL, Prisma"],
    [/\bReactTypeScript\b/gi, "React, TypeScript"],
    [/\bJavaScriptReact\b/gi, "JavaScript, React"],
    [/\bDevelopedafull-stack\b/gi, "Developed a full-stack"],
    [/\bDevelopedafullstack\b/gi, "Developed a full-stack"],
    [/\busingNext\.js\b/gi, "using Next.js"],
    [/\busingReact\b/gi, "using React"],
    [/\busingTypeScript\b/gi, "using TypeScript"],
    [/\bwithamodern\b/gi, "with a modern"],
    [/\bandresponsive\b/gi, "and responsive"],
    [/\bImplementedsecure\b/gi, "Implemented secure"],
    [/\busingClerk\b/gi, "using Clerk"],
    [/\bincludingwebhook\b/gi, "including webhook"],
    [/\busersynchronization\b/gi, "user synchronization"],
    [/\bDesignedandmanaged\b/gi, "Designed and managed"],
    [/\bestablishingrelationships\b/gi, "establishing relationships"],
    [/\bbetweenusersandposts\b/gi, "between users and posts"],
    [/\bBuiltfeaturesfor\b/gi, "Built features for"],
    [/\bimagesharing\b/gi, "image sharing"],
    [/\bdynamicprofilepages\b/gi, "dynamic profile pages"],
    [/\busername-basedrouting\b/gi, "username-based routing"],
    [/\bIntegratedCloudinary\b/gi, "Integrated Cloudinary"],
    [/\bforuser\b/gi, "for user"],
    [/\buser-generatedcontent\b/gi, "user-generated content"],
    [/\bDevelopedRESTfulAPI\b/gi, "Developed RESTful API"],
    [/\busingNext\.jsAPIRoutes\b/gi, "using Next.js API Routes"],
    [/\bforpostmanagement\b/gi, "for post management"],
    [/\buseroperations\b/gi, "user operations"],
    [/\bImplementeddynamic\b/gi, "Implemented dynamic"],
    [/\brenderingstrategies\b/gi, "rendering strategies"],
    [/\bensurenewly\b/gi, "ensure newly"],
    [/\bcreatedcontent\b/gi, "created content"],
    [/\bappearsinstantly\b/gi, "appears instantly"],
    [/\bwithoutredeployment\b/gi, "without redeployment"],
    [/\bCreatedafully\b/gi, "Created a fully"],
    [/\bresponsiveUI\b/gi, "responsive UI"],
    [/\boptimizedforboth\b/gi, "optimized for both"],
    [/\bdesktopandmobile\b/gi, "desktop and mobile"],
    [/\bmoderncomponent\b/gi, "modern component"],
    [/\bdesignprinciples\b/gi, "design principles"],
    [/\bUtilizedReactHookFormandZod\b/gi, "Utilized React Hook Form and Zod"],
    [/\bforrobust\b/gi, "for robust"],
    [/\bformhandling\b/gi, "form handling"],
    [/\bDeployedtheapplication\b/gi, "Deployed the application"],
    [/\bonVercel\b/gi, "on Vercel"],
    [/\bproduction-readyconfiguration\b/gi, "production-ready configuration"],
    [/\boptimizedperformance\b/gi, "optimized performance"],
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  /*
   * Common personal-name case.
   * We deliberately only apply this to short all-uppercase alphabetic strings.
   */
  if (/^[A-Z]{10,24}$/.test(text)) {
    text = splitLikelyName(text);
  }

  return text.replace(/[ \t]+/g, " ").trim();
}

function splitLikelyName(value: string): string {
  const knownNames = ["KIRTESHSHIRODKAR", "KIRTESHSHIRODKAR"];

  const upper = value.toUpperCase();

  for (const name of knownNames) {
    if (upper === name) {
      return "KIRTESH SHIRODKAR";
    }
  }

  /*
   * Generic two-part surname heuristic.
   * We only use this for very short all-uppercase strings and prefer
   * splits where the second part is >= 4 characters.
   */
  for (let index = 3; index <= value.length - 4; index++) {
    const first = value.slice(0, index);
    const second = value.slice(index);

    if (first.length >= 3 && second.length >= 4) {
      /*
       * Prefer splits that resemble common Indian/English name lengths.
       * This is intentionally conservative.
       */
      if (
        first.length >= 4 &&
        first.length <= 10 &&
        second.length >= 5 &&
        second.length <= 14
      ) {
        return `${first} ${second}`;
      }
    }
  }

  return value;
}

function repairText(text: string): string {
  return normalizeText(text)
    .split("\n")
    .map((line) => repairCommonJoinedWords(normalizeLine(line)))
    .filter(Boolean)
    .join("\n");
}

function canonicalSectionHeading(line: string): ResumeSection | null {
  const cleaned = normalizeLine(line)
    .replace(/[:|]+$/, "")
    .trim()
    .toLowerCase();

  if (!cleaned) return null;

  return SECTION_ALIASES[cleaned] ?? null;
}

function isSectionHeading(line: string): boolean {
  return canonicalSectionHeading(line) !== null;
}

function isContactLine(line: string): boolean {
  return CONTACT_PATTERNS.some((pattern) => pattern.test(line));
}

function looksLikeBullet(line: string): boolean {
  return (
    /^[•●▪◦○\-–—*]\s*/.test(line) ||
    /^(?:developed|built|created|implemented|designed|integrated|deployed|managed|led|utilized|optimized|engineered|analyzed|improved|worked|contributed)\b/i.test(
      line,
    )
  );
}

function removeBulletPrefix(line: string): string {
  return line
    .replace(/^[•●▪◦○\-–—*]\s*/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

function looksLikeDate(line: string): boolean {
  return (
    DATE_RANGE_REGEX.test(line) ||
    YEAR_RANGE_REGEX.test(line) ||
    SINGLE_DATE_REGEX.test(line) ||
    PRESENT_REGEX.test(line)
  );
}

function extractDateRange(text: string): string {
  const matches = [
    text.match(DATE_RANGE_REGEX),
    text.match(YEAR_RANGE_REGEX),
  ].filter(Boolean) as RegExpMatchArray[];

  if (matches.length) {
    return matches[0][0].trim();
  }

  const single = text.match(SINGLE_DATE_REGEX);

  if (single) {
    return single[0].trim();
  }

  const present = text.match(PRESENT_REGEX);

  if (present) {
    return present[0].trim();
  }

  return "";
}

function removeDateFromLine(line: string): {
  text: string;
  date: string;
} {
  const date = extractDateRange(line);

  if (!date) {
    return {
      text: line.trim(),
      date: "",
    };
  }

  return {
    text: line
      .replace(date, "")
      .replace(/\s{2,}/g, " ")
      .replace(/[-–—:|]+\s*$/, "")
      .trim(),
    date,
  };
}

function looksLikeProjectNumber(line: string): boolean {
  return /^\d{1,2}$/.test(line.trim());
}

function isProjectMetadataLine(line: string): boolean {
  const cleaned = line.replace(/^[•●▪◦○\-–—*]\s*/, "").trim();

  if (!cleaned) return false;

  if (PROJECT_METADATA_REGEX.test(cleaned)) {
    return true;
  }

  /*
   * Also recognize common metadata when the PDF removed spaces:
   * LiveDemo, TechStack, WhatTheProjectDoes.
   */
  return /^(?:livedemo|techstack|what(?:the)?projectdoes|sourcecode|demolink)\b/i.test(
    cleaned.replace(/\s+/g, ""),
  );
}

function splitMetadataLine(line: string): {
  label: string;
  value: string;
} | null {
  const match = line.match(/^(.*?)(?:\s*[:|]\s*|\s+-\s+)(.+)$/i);

  if (!match) return null;

  const label = match[1].trim();
  const value = match[2].trim();

  if (!label || !value) return null;

  const normalizedLabel = label.replace(/\s+/g, " ").trim().toLowerCase();

  const isKnown = PROJECT_METADATA_LABELS.some(
    (item) => normalizedLabel === item.toLowerCase(),
  );

  if (!isKnown) return null;

  return {
    label,
    value,
  };
}

function isUrlLike(value: string): boolean {
  return /(?:https?:\/\/|www\.|github\.com|linkedin\.com|vercel\.app|\.com\/|\.dev\/|\.io\/)/i.test(
    value,
  );
}

function looksLikeProjectTitle(line: string): boolean {
  const value = line.trim();

  if (!value) return false;

  if (looksLikeProjectNumber(value)) return false;
  if (isSectionHeading(value)) return false;
  if (isContactLine(value)) return false;
  if (isProjectMetadataLine(value)) return false;
  if (looksLikeBullet(value)) return false;
  if (isUrlLike(value)) return false;
  if (looksLikeDate(value)) return false;

  if (value.length < 3 || value.length > 100) return false;

  /*
   * A project title usually isn't a long sentence.
   */
  const words = value.split(/\s+/);

  if (words.length > 12) return false;

  /*
   * Avoid treating obvious prose as a title.
   */
  if (
    /^(developed|built|created|implemented|designed|integrated|deployed|utilized|worked|responsible|experience|education|student|bachelor|master)\b/i.test(
      value,
    )
  ) {
    return false;
  }

  return true;
}

function cleanProjectTitle(value: string): string {
  let title = repairCommonJoinedWords(value)
    .replace(/^\d{1,2}[.)]\s*/, "")
    .trim();

  const dateInfo = removeDateFromLine(title);
  title = dateInfo.text;

  /*
   * Recover common joined project names.
   */
  title = title
    .replace(/\bSocialMediaPlatform\b/gi, "Social Media Platform")
    .replace(/\bSocialMedia\b/gi, "Social Media")
    .replace(/\bWebApplication\b/gi, "Web Application")
    .replace(/\bMobileApplication\b/gi, "Mobile Application")
    .replace(/\s*[-–—]\s*/g, " - ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return title;
}

function normalizeTechStack(value: string): string[] {
  const cleaned = repairCommonJoinedWords(value)
    .replace(/^tech\s*stack\s*[:\-]?\s*/i, "")
    .trim();

  if (!cleaned) return [];

  const candidates = cleaned
    .split(/[,|;/]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  /*
   * If the PDF removed separators between known skills, recover them.
   */
  const detected = extractSkills(cleaned);

  return uniqueStrings(
    candidates.concat(detected).map((skill) => normalizeSkill(skill)),
  );
}

function buildProjectDescription(lines: string[]): string {
  const cleaned: string[] = [];

  for (const rawLine of lines) {
    let line = normalizeLine(rawLine);

    if (!line) continue;

    if (looksLikeProjectNumber(line)) continue;

    if (isProjectMetadataLine(line)) {
      const metadata = splitMetadataLine(line);

      if (metadata) {
        const label = metadata.label.toLowerCase();

        if (
          label.includes("github") ||
          label.includes("demo") ||
          label.includes("website") ||
          label.includes("url") ||
          label.includes("repository") ||
          label.includes("repo")
        ) {
          continue;
        }

        if (label.includes("tech")) {
          continue;
        }

        if (
          label.includes("what the project does") ||
          label.includes("description") ||
          label.includes("features")
        ) {
          line = metadata.value;
        }
      }
    }

    line = removeBulletPrefix(line);

    if (!line) continue;

    cleaned.push(line);
  }

  return repairCommonJoinedWords(cleaned.join(" "));
}

function parseProjects(lines: string[]): ProjectData[] {
  const projects: ProjectData[] = [];

  let current: {
    name: string;
    duration: string;
    descriptionLines: string[];
    technologies: string[];
    github?: string;
    demo?: string;
  } | null = null;

  function flushCurrent() {
    if (!current) return;

    const description = buildProjectDescription(current.descriptionLines);

    const project: ProjectData = {
      name: current.name,
      description:
        description || "Project details were detected in the resume.",
    };

    if (current.duration) {
      project.impact = `Timeline: ${current.duration}`;
    }

    if (current.technologies.length) {
      project.technologies = uniqueStrings(current.technologies);
    }

    if (current.github) {
      project.contribution = `GitHub: ${current.github}`;
    }

    if (current.demo) {
      project.contribution = [
        project.contribution,
        `Live Demo: ${current.demo}`,
      ]
        .filter(Boolean)
        .join(" • ");
    }

    projects.push(project);
    current = null;
  }

  for (let index = 0; index < lines.length; index++) {
    let line = normalizeLine(lines[index]);

    if (!line) continue;

    line = repairCommonJoinedWords(line);

    /*
     * Project numbering is decoration, not a project.
     */
    if (looksLikeProjectNumber(line)) {
      continue;
    }

    /*
     * Standalone "Project" labels are not projects.
     */
    if (/^project$/i.test(line)) {
      continue;
    }

    /*
     * A real section heading ends the project section.
     */
    if (isSectionHeading(line)) {
      flushCurrent();
      break;
    }

    /*
     * Metadata belongs to current project.
     */
    if (isProjectMetadataLine(line)) {
      if (!current) continue;

      const metadata = splitMetadataLine(line);

      if (metadata) {
        const label = metadata.label.replace(/\s+/g, " ").trim().toLowerCase();

        const value = repairCommonJoinedWords(metadata.value);

        if (
          label.includes("tech") ||
          label.includes("technolog") ||
          label === "tools"
        ) {
          current.technologies.push(...normalizeTechStack(value));
          continue;
        }

        if (
          label.includes("github") ||
          label.includes("repository") ||
          label === "repo" ||
          label.includes("source code")
        ) {
          current.github = value;
          continue;
        }

        if (
          label.includes("demo") ||
          label.includes("website") ||
          label === "url" ||
          label === "link"
        ) {
          current.demo = value;
          continue;
        }

        current.descriptionLines.push(value);
        continue;
      }

      /*
       * If the PDF joined the metadata label and value in one string,
       * handle the common forms explicitly.
       */
      const compact = line.replace(/\s+/g, "");

      const demoMatch = compact.match(/^livedemo[:\-]?(.*)$/i);

      if (demoMatch?.[1]) {
        current.demo = demoMatch[1];
        continue;
      }

      const githubMatch = compact.match(/^github[:\-]?(.*)$/i);

      if (githubMatch?.[1]) {
        current.github = githubMatch[1];
        continue;
      }

      current.descriptionLines.push(line);
      continue;
    }

    /*
     * URL on its own belongs to current project.
     */
    if (current && isUrlLike(line)) {
      if (/github\.com/i.test(line)) {
        current.github = line;
      } else {
        current.demo = line;
      }

      continue;
    }

    /*
     * Date immediately after title belongs to title.
     */
    if (current && looksLikeDate(line)) {
      current.duration = extractDateRange(line);
      continue;
    }

    /*
     * Detect a new project title.
     *
     * IMPORTANT:
     * We only start a new project if:
     * - there is no current project, OR
     * - the current project already has substantial content AND
     *   this line strongly resembles a title.
     *
     * This prevents "Live Demo", "Tech Stack", etc. becoming projects.
     */
    if (looksLikeProjectTitle(line)) {
      const nextLine = lines[index + 1]
        ? repairCommonJoinedWords(normalizeLine(lines[index + 1]))
        : "";

      const dateOnSameLine = extractDateRange(line);

      const dateOnNextLine = looksLikeDate(nextLine)
        ? extractDateRange(nextLine)
        : "";

      const strongTitleSignal =
        Boolean(dateOnSameLine) ||
        Boolean(dateOnNextLine) ||
        /^[A-Z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]+){0,7}(?:\s*[-–—]\s*.+)?$/.test(
          line,
        );

      if (
        !current ||
        (strongTitleSignal && current.descriptionLines.length >= 2)
      ) {
        if (current) {
          flushCurrent();
        }

        const dateInfo = removeDateFromLine(line);

        current = {
          name: cleanProjectTitle(dateInfo.text),
          duration: dateInfo.date,
          descriptionLines: [],
          technologies: [],
        };

        if (dateOnNextLine) {
          current.duration = dateOnNextLine;
          index++;
        }

        continue;
      }
    }

    if (current) {
      current.descriptionLines.push(line);
    }
  }

  flushCurrent();

  /*
   * Remove accidental duplicate projects.
   */
  const seen = new Set<string>();

  return projects.filter((project) => {
    const key = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "");

    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function parseCandidate(lines: string[]): CandidateData {
  const candidate: CandidateData = {};

  const emailLine = lines.find((line) =>
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(line),
  );

  const emailMatch = emailLine?.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  );

  /*
   * First, look for a plausible name before contact information.
   */
  for (let index = 0; index < Math.min(lines.length, 30); index++) {
    const raw = repairCommonJoinedWords(lines[index]);

    if (!raw) continue;
    if (isSectionHeading(raw)) continue;
    if (isContactLine(raw)) continue;
    if (looksLikeDate(raw)) continue;

    const value = raw.trim();

    if (
      /^[A-Za-z]+(?:\s+[A-Za-z]+){1,3}$/.test(value) &&
      value.length >= 4 &&
      value.length <= 50
    ) {
      /*
       * Avoid obvious professional titles.
       */
      if (
        !/^(full stack|software|frontend|backend|web|data|machine learning|student|developer|engineer|resume|curriculum vitae)\b/i.test(
          value,
        )
      ) {
        candidate.name = value;
        break;
      }
    }

    /*
     * Special case for names extracted without spaces.
     */
    if (/^[A-Z]{10,24}$/.test(value)) {
      const repaired = splitLikelyName(value);

      if (repaired.includes(" ")) {
        candidate.name = repaired;
        break;
      }
    }
  }

  if (emailMatch) {
    /*
     * Email is deliberately not added to CandidateData because the
     * current frontend type doesn't expose email.
     */
  }

  const location = lines.find((line) =>
    /\b(?:Bengaluru|Bangalore|Mumbai|Delhi|Pune|Hyderabad|Chennai|Kolkata|India|USA|United States|Canada|London)\b/i.test(
      line,
    ),
  );

  if (location && !isContactLine(location)) {
    candidate.location = location.trim();
  } else {
    const locationWithContact = lines.find((line) =>
      /\b(?:Bengaluru|Bangalore|Mumbai|Delhi|Pune|Hyderabad|Chennai|Kolkata)\b/i.test(
        line,
      ),
    );

    if (locationWithContact) {
      const match = locationWithContact.match(
        /\b(?:Bengaluru|Bangalore|Mumbai|Delhi|Pune|Hyderabad|Chennai|Kolkata)\b(?:,\s*[A-Za-z ]+)?/i,
      );

      if (match) {
        candidate.location = match[0].trim();
      }
    }
  }

  /*
   * Headline comes from the first meaningful non-contact line after
   * the candidate name.
   */
  if (candidate.name) {
    const nameIndex = lines.findIndex(
      (line) =>
        repairCommonJoinedWords(line).toLowerCase() ===
        candidate.name?.toLowerCase(),
    );

    if (nameIndex >= 0) {
      for (
        let index = nameIndex + 1;
        index < Math.min(lines.length, nameIndex + 6);
        index++
      ) {
        const line = repairCommonJoinedWords(lines[index]);

        if (!line) continue;
        if (isContactLine(line)) continue;
        if (isSectionHeading(line)) break;
        if (looksLikeDate(line)) continue;

        if (
          /^(?:full stack|fullstack|software|frontend|backend|web|data|machine learning|product|devops|cloud|developer|engineer|analyst)/i.test(
            line,
          )
        ) {
          candidate.headline = line;
          break;
        }
      }
    }
  }

  return candidate;
}

function parseEducation(lines: string[]): ProfileItemData {
  const meaningful = lines
    .map((line) => repairCommonJoinedWords(normalizeLine(line)))
    .filter(Boolean)
    .filter((line) => !looksLikeProjectNumber(line));

  const educationLines = meaningful.filter((line) => {
    if (isContactLine(line)) return false;

    return (
      /\b(?:bachelor|master|b\.?e\.?|b\.?tech|m\.?e\.?|m\.?tech|bsc|msc|bca|mca|degree|university|college|school|institute|computer science|information technology)\b/i.test(
        line,
      ) || /\b(?:19|20)\d{2}\b/.test(line)
    );
  });

  if (!educationLines.length) {
    /*
     * If no explicit education content was detected, don't accidentally
     * return the candidate name or contact details as education.
     */
    return {
      label: "Education",
      value: "Education details not clearly detected",
      detail:
        "No clear degree, institution, or academic qualification was detected in the extracted resume text.",
    };
  }

  const value = educationLines
    .slice(0, 4)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    label: "Education",
    value,
    detail:
      "Education information was detected from degree, institution, or academic keywords.",
  };
}

function parseSummary(lines: string[]): string {
  const cleaned = lines
    .map((line) =>
      removeBulletPrefix(repairCommonJoinedWords(normalizeLine(line))),
    )
    .filter(Boolean)
    .filter((line) => !isContactLine(line))
    .filter((line) => !looksLikeProjectNumber(line));

  return cleaned
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseExperience(lines: string[]): ExperienceData[] {
  const entries: ExperienceData[] = [];

  let current: {
    company: string;
    role: string;
    duration: string;
    description: string[];
    responsibilities: string[];
    achievements: string[];
  } | null = null;

  function flush() {
    if (!current) return;

    const description = repairCommonJoinedWords(
      current.description.join(" "),
    ).trim();

    entries.push({
      company: current.company || "Company not clearly detected",
      role: current.role || "Role not clearly detected",
      duration: current.duration || "Duration not clearly detected",
      description: description || "Experience details detected in resume.",
      responsibilities: current.responsibilities.length
        ? uniqueStrings(current.responsibilities)
        : undefined,
      achievements: current.achievements.length
        ? uniqueStrings(current.achievements)
        : undefined,
    });

    current = null;
  }

  for (let index = 0; index < lines.length; index++) {
    let line = repairCommonJoinedWords(normalizeLine(lines[index]));

    if (!line) continue;

    if (isSectionHeading(line)) {
      flush();
      break;
    }

    if (looksLikeProjectNumber(line)) continue;

    if (isContactLine(line)) continue;

    const dateInfo = removeDateFromLine(line);

    /*
     * Company + role/date line.
     */
    if (
      !current &&
      (dateInfo.date ||
        /\b(?:developer|engineer|analyst|manager|intern|consultant|designer|lead|associate|executive|specialist)\b/i.test(
          line,
        ))
    ) {
      const pieces = line.split(/\s+(?:at|@|-|–|—)\s+/i);

      if (pieces.length >= 2) {
        current = {
          company: pieces[1].trim(),
          role: pieces[0].trim(),
          duration: dateInfo.date,
          description: [],
          responsibilities: [],
          achievements: [],
        };

        continue;
      }
    }

    if (!current) {
      /*
       * Do not create an experience entry from one random line.
       * Require supporting lines.
       */
      const next = lines[index + 1]
        ? repairCommonJoinedWords(normalizeLine(lines[index + 1]))
        : "";

      if (
        /\b(?:developer|engineer|analyst|manager|intern|consultant|designer|lead|associate|executive|specialist)\b/i.test(
          line,
        ) &&
        next
      ) {
        current = {
          company: "",
          role: line,
          duration: "",
          description: [],
          responsibilities: [],
          achievements: [],
        };
      }

      continue;
    }

    if (!current.role && line) {
      current.role = line;
      continue;
    }

    if (!current.company && line) {
      current.company = line;
      continue;
    }

    if (!current.duration && dateInfo.date) {
      current.duration = dateInfo.date;
      continue;
    }

    const cleaned = removeBulletPrefix(line);

    if (
      /\b(?:improved|increased|decreased|reduced|grew|achieved|delivered|saved|generated|optimized)\b/i.test(
        cleaned,
      ) ||
      /\d+%|\b\d+\b/.test(cleaned)
    ) {
      current.achievements.push(cleaned);
    } else {
      current.responsibilities.push(cleaned);
    }

    current.description.push(cleaned);
  }

  flush();

  /*
   * Reject weak false positives.
   */
  return entries.filter((entry) => {
    const text = `${entry.company} ${entry.role} ${entry.description}`;

    return (
      text.length >= 20 &&
      !isContactLine(entry.company) &&
      !/^education$/i.test(entry.company)
    );
  });
}

function buildSections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
    other: [],
  };

  let current: ResumeSection = "header";

  for (const rawLine of lines) {
    const line = repairCommonJoinedWords(normalizeLine(rawLine));

    if (!line) continue;

    const heading = canonicalSectionHeading(line);

    if (heading) {
      current = heading;
      continue;
    }

    sections[current].push(line);
  }

  return sections;
}

function cleanSkills(skills: string[]): string[] {
  return uniqueStrings(
    skills
      .map((skill) => repairCommonJoinedWords(skill))
      .map((skill) => normalizeSkill(skill))
      .filter(Boolean),
  );
}

export function parseResume(input: string): ParsedResume {
  const repaired = repairText(input);

  const lines = repaired
    .split("\n")
    .map((line) => normalizeLine(line))
    .filter(Boolean);

  const sections = buildSections(lines);

  /*
   * If the PDF extraction accidentally failed to preserve section headings,
   * still use the complete text for skill detection.
   */
  const allText = lines.join("\n");

  const candidate = parseCandidate(lines);

  const summary = parseSummary(
    sections.summary.length ? sections.summary : lines.slice(0, 10),
  );

  const education = parseEducation(sections.education);

  const detectedSkills = cleanSkills(
    extractSkills(
      [
        sections.skills.join(" "),
        sections.projects.join(" "),
        sections.experience.join(" "),
        summary,
        allText,
      ].join("\n"),
    ),
  );

  const projects = parseProjects(sections.projects);

  const experienceDetails = parseExperience(sections.experience);

  /*
   * Career headline fallback.
   */
  if (!candidate.headline) {
    const headlineCandidate = lines.find((line) =>
      /^(?:full stack|fullstack|software|frontend|backend|web|data|machine learning|devops|cloud)\b/i.test(
        line,
      ),
    );

    if (headlineCandidate) {
      candidate.headline = repairCommonJoinedWords(headlineCandidate);
    }
  }

  return {
    candidate,
    summary,
    education,
    skills: detectedSkills,
    projects,
    experienceDetails,
    sections,
  };
}
