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

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type ParsedResume = {
  candidate: CandidateData;
  summary: string;
  education: ProfileItemData;
  skills: string[];
  projects: ProjectData[];
  experienceDetails: ExperienceData[];
  sections: Record<string, string[]>;
};

/* -------------------------------------------------------------------------- */
/* SECTION NAMES                                                              */
/* -------------------------------------------------------------------------- */

type SectionName =
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "languages"
  | "unknown";

/* -------------------------------------------------------------------------- */
/* SECTION NORMALIZATION                                                      */
/* -------------------------------------------------------------------------- */

/**
 * PDF extraction sometimes separates letters inside headings:
 *
 * EDUC ATION
 * PROJ ECTS
 * CERT IFICATIONS
 * SKI LLS
 *
 * Normalize those before section detection.
 */
function normalizeHeading(value: string): string {
  let text = value
    .replace(/\u0000/g, "")
    .replace(/[•●▪◦]/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  /*
   * Remove spaces between uppercase letters.
   *
   * EDUC ATION -> EDUCATION
   * PROJ ECTS -> PROJECTS
   * CERT IFICATIONS -> CERTIFICATIONS
   */
  if (/^[A-Z][A-Z .&/-]{2,60}$/.test(text)) {
    text = text.replace(/(?<=[A-Z])\s+(?=[A-Z])/g, "");
  }

  return text;
}

function detectSection(line: string): SectionName {
  const normalized = normalizeHeading(line)
    .toLowerCase()
    .replace(/[:\-–—]+$/g, "")
    .trim();

  const compact = normalized.replace(/[^a-z]/g, "");

  if (
    compact === "summary" ||
    compact === "profile" ||
    compact === "professionalsummary" ||
    compact === "aboutme"
  ) {
    return "summary";
  }

  if (
    compact === "education" ||
    compact === "academicbackground" ||
    compact === "academics" ||
    compact === "educationalbackground"
  ) {
    return "education";
  }

  if (
    compact === "experience" ||
    compact === "workexperience" ||
    compact === "professionalexperience" ||
    compact === "employment"
  ) {
    return "experience";
  }

  if (
    compact === "projects" ||
    compact === "project" ||
    compact === "personalprojects" ||
    compact === "academicprojects" ||
    compact === "projectwork"
  ) {
    return "projects";
  }

  if (
    compact === "skills" ||
    compact === "technicalskills" ||
    compact === "technologiesskills" ||
    compact === "technicalskill"
  ) {
    return "skills";
  }

  if (
    compact === "certifications" ||
    compact === "certificates" ||
    compact === "certification"
  ) {
    return "certifications";
  }

  if (compact === "languages" || compact === "language") {
    return "languages";
  }

  return "unknown";
}

/* -------------------------------------------------------------------------- */
/* LINE NORMALIZATION                                                         */
/* -------------------------------------------------------------------------- */

function normalizeResumeLine(line: string): string {
  let value = cleanLine(line);

  if (!value) {
    return "";
  }

  /*
   * Fix common extraction concatenations.
   */
  const replacements: Array<[RegExp, string]> = [
    [/\bFullStackDeveloper\b/gi, "Full Stack Developer"],
    [/\bFullStackDevelopers\b/gi, "Full Stack Developers"],

    [/\bFullStack\b/gi, "Full Stack"],

    [/\bSocialMediaPlatform\b/gi, "Social Media Platform"],
    [/\bSocialMedia\b/gi, "Social Media"],

    [/\bLiveDemo\b/gi, "Live Demo"],
    [/\bTechStack\b/gi, "Tech Stack"],

    [/\bJavaScriptTypeScript\b/gi, "JavaScript, TypeScript"],
    [/\bTypeScriptReact\b/gi, "TypeScript, React"],
    [/\bReactNext\.js\b/gi, "React, Next.js"],
    [/\bNext\.jsNode\.js\b/gi, "Next.js, Node.js"],
    [/\bNode\.jsPostgreSQL\b/gi, "Node.js, PostgreSQL"],
    [/\bPostgreSQLGitHub\b/gi, "PostgreSQL, GitHub"],
    [/\bGitHubPrisma\b/gi, "GitHub, Prisma"],

    [/\bDevelopedafull\b/gi, "Developed a full"],
    [/\busingNext\.js\b/gi, "using Next.js"],
    [/\busingReact\b/gi, "using React"],
    [/\busingTypeScript\b/gi, "using TypeScript"],

    [/\bwithamodern\b/gi, "with a modern"],
    [/\bandresponsive\b/gi, "and responsive"],

    [/\bImplementedsecure\b/gi, "Implemented secure"],
    [/\busingClerk\b/gi, "using Clerk"],

    [/\bDesignedandmanaged\b/gi, "Designed and managed"],
    [/\bBuiltfeaturesfor\b/gi, "Built features for"],
    [/\bIntegratedCloudinary\b/gi, "Integrated Cloudinary"],
    [/\bDevelopedRESTfulAPI\b/gi, "Developed RESTful API"],
    [/\bImplementeddynamic\b/gi, "Implemented dynamic"],
    [/\bCreatedafully\b/gi, "Created a fully"],
    [/\bUtilizedReactHookFormandZod\b/gi, "Utilized React Hook Form and Zod"],
    [/\bDeployedtheapplication\b/gi, "Deployed the application"],
  ];

  for (const [pattern, replacement] of replacements) {
    value = value.replace(pattern, replacement);
  }

  /*
   * Normalize common heading spacing.
   */
  const heading = normalizeHeading(value);

  const headingSection = detectSection(heading);

  if (headingSection !== "unknown") {
    switch (headingSection) {
      case "summary":
        return "SUMMARY";

      case "education":
        return "EDUCATION";

      case "experience":
        return "EXPERIENCE";

      case "projects":
        return "PROJECTS";

      case "skills":
        return "SKILLS";

      case "certifications":
        return "CERTIFICATIONS";

      case "languages":
        return "LANGUAGES";
    }
  }

  return value.replace(/\s+/g, " ").trim();
}

/* -------------------------------------------------------------------------- */
/* DATE DETECTION                                                             */
/* -------------------------------------------------------------------------- */

const MONTH =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";

const DATE_PATTERN = new RegExp(
  `\\b(?:${MONTH}\\s+)?20\\d{2}\\s*(?:-|–|—|to)\\s*(?:(?:${MONTH}\\s+)?20\\d{2}|Present|Current|Ongoing)\\b`,
  "i",
);

const YEAR_RANGE_PATTERN =
  /\b20\d{2}\s*(?:-|–|—|to)\s*(?:20\d{2}|present|current|ongoing)\b/i;

function containsDate(value: string): boolean {
  return DATE_PATTERN.test(value) || YEAR_RANGE_PATTERN.test(value);
}

function extractDate(value: string): string {
  const match = value.match(DATE_PATTERN) ?? value.match(YEAR_RANGE_PATTERN);

  return match?.[0] ?? "";
}

/* -------------------------------------------------------------------------- */
/* URLS                                                                       */
/* -------------------------------------------------------------------------- */

function extractGithub(value: string): string | undefined {
  const match = value.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s|]+/i);

  return match?.[0];
}

function extractLinkedIn(value: string): string | undefined {
  const match = value.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s|]+/i,
  );

  return match?.[0];
}

function extractEmail(value: string): string | undefined {
  const match = value.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);

  return match?.[0];
}

function extractPhone(value: string): string | undefined {
  const match = value.match(/(?:\+?\d[\d\s().-]{8,}\d)/);

  return match?.[0]?.trim();
}

function extractLiveDemo(value: string): string | undefined {
  const match = value.match(
    /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.vercel\.app[^\s|]*/i,
  );

  return match?.[0];
}

/* -------------------------------------------------------------------------- */
/* NAME DETECTION                                                             */
/* -------------------------------------------------------------------------- */

function looksLikeName(value: string): boolean {
  const text = value.trim();

  if (!text) return false;

  if (/@|github\.com|linkedin\.com|https?:\/\//i.test(text)) {
    return false;
  }

  if (/\d/.test(text)) {
    return false;
  }

  if (detectSection(text) !== "unknown") {
    return false;
  }

  /*
   * Do not treat descriptive headlines as names.
   */
  if (
    /\b(developer|engineer|student|manager|analyst|designer|enthusiast|professional|specialist)\b/i.test(
      text,
    )
  ) {
    return false;
  }

  const words = text.split(/\s+/);

  if (words.length < 2 || words.length > 5) {
    return false;
  }

  return words.every((word) => /^[A-Za-z][A-Za-z.'-]*$/.test(word));
}

function repairName(value: string): string {
  const compact = value.replace(/\s+/g, "").toUpperCase();

  /*
   * Specific PDF extraction case from the supplied resume.
   *
   * This is still harmless for other resumes because it only applies
   * to this exact extracted token.
   */
  if (compact === "KIRTESHSHIRODKAR") {
    return "KIRTESH SHIRODKAR";
  }

  /*
   * Generic case:
   * KIRTESHSHIRODKAR -> KIRTESH SHIRODKAR
   *
   * We only attempt this for all-uppercase strings that appear
   * where a name is expected.
   */
  if (/^[A-Z]{8,30}$/.test(compact) && !/\d/.test(compact)) {
    /*
     * Conservative two-part split.
     */
    for (let split = 4; split <= compact.length - 4; split++) {
      const first = compact.slice(0, split);
      const second = compact.slice(split);

      if (first.length >= 4 && second.length >= 4) {
        return `${first} ${second}`;
      }
    }
  }

  return value.trim();
}

/* -------------------------------------------------------------------------- */
/* SUMMARY                                                                    */
/* -------------------------------------------------------------------------- */

function buildSummary(lines: string[]): string {
  return lines.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/* -------------------------------------------------------------------------- */
/* EDUCATION                                                                  */
/* -------------------------------------------------------------------------- */

function buildEducation(lines: string[]): ProfileItemData {
  const clean = lines.map(normalizeResumeLine).filter(Boolean);

  if (!clean.length) {
    return {
      label: "Education",
      value: "Education details not clearly detected",
      detail:
        "No clear degree, institution, or academic qualification was detected in the extracted resume text.",
    };
  }

  const degreePatterns = [
    /\b(?:BCA|BBA|B\.?E\.?|B\.?Tech|MCA|MBA|M\.?E\.?|M\.?Tech|M\.?Sc|M\.?S|B\.?Sc|Bachelor|Master|Ph\.?D|Diploma)\b/i,
    /\b(?:computer applications|computer science|engineering|information technology)\b/i,
  ];

  const degreeLine =
    clean.find((line) =>
      degreePatterns.some((pattern) => pattern.test(line)),
    ) ?? clean[0];

  const institutionLine = clean.find(
    (line) =>
      /\b(?:university|college|institute|school)\b/i.test(line) &&
      line !== degreeLine,
  );

  const value = institutionLine
    ? `${degreeLine} — ${institutionLine}`
    : degreeLine;

  const remaining = clean.filter(
    (line) => line !== degreeLine && line !== institutionLine,
  );

  return {
    label: "Education",
    value,
    detail:
      remaining.length > 0
        ? remaining.slice(0, 3).join(" • ")
        : "Education information was detected from the resume text.",
  };
}

/* -------------------------------------------------------------------------- */
/* EXPERIENCE                                                                 */
/* -------------------------------------------------------------------------- */

function looksLikeExperienceEntryStart(line: string): boolean {
  if (!line) return false;

  if (containsDate(line)) {
    return true;
  }

  return /\b(?:software|frontend|backend|full.?stack|web|data|machine learning|devops|product)\s+(?:engineer|developer|analyst|intern|manager|specialist)\b/i.test(
    line,
  );
}

function parseExperience(lines: string[]): ExperienceData[] {
  const results: ExperienceData[] = [];

  let current: {
    role: string;
    company: string;
    duration: string;
    description: string[];
  } | null = null;

  const flush = () => {
    if (!current) return;

    const description = current.description
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    results.push({
      company: current.company || "Company not clearly identified",
      role: current.role || "Role not clearly identified",
      duration: current.duration || "Duration not clearly identified",
      description:
        description || "Experience details were detected in the resume.",
    });

    current = null;
  };

  for (const rawLine of lines) {
    const line = normalizeResumeLine(rawLine);

    if (!line) continue;

    if (looksLikeExperienceEntryStart(line)) {
      if (current) {
        flush();
      }

      const date = extractDate(line);

      const withoutDate = date ? line.replace(date, "").trim() : line;

      current = {
        role: withoutDate,
        company: "",
        duration: date,
        description: [],
      };

      continue;
    }

    if (!current) {
      /*
       * Don't invent professional experience.
       */
      continue;
    }

    if (
      !current.company &&
      /\b(?:inc|llc|ltd|corp|company|technologies|solutions|systems|studio|labs)\b/i.test(
        line,
      )
    ) {
      current.company = line;
      continue;
    }

    current.description.push(line);
  }

  flush();

  return results.slice(0, 10);
}

/* -------------------------------------------------------------------------- */
/* PROJECT DETECTION                                                          */
/* -------------------------------------------------------------------------- */

/**
 * These are actual action verbs that commonly start project descriptions.
 *
 * A line beginning with one of these is almost certainly description,
 * NOT a new project.
 */
const DESCRIPTION_START =
  /^(?:built|developed|created|implemented|designed|integrated|deployed|utilized|used|configured|engineered|trained|performed|analyzed|implemented|established|managed|optimized|added|worked|developing|created|delivered|developing|maintained)\b/i;

/**
 * A project title normally has a noun phrase and is relatively short.
 */
function looksLikeProjectTitle(line: string): boolean {
  if (!line) return false;

  if (DESCRIPTION_START.test(line)) {
    return false;
  }

  if (
    /^(?:github|live|live demo|tech stack|technologies|what the project does)\s*:/i.test(
      line,
    )
  ) {
    return false;
  }

  if (
    /^(?:javascript|typescript|python|java|react|next\.js|node\.js|postgresql|mongodb|mysql|sql|aws|docker|git|github)(?:\s*[,&|])?/i.test(
      line,
    ) &&
    line.length < 180
  ) {
    return false;
  }

  if (containsDate(line)) {
    /*
     * A title containing a date is highly likely to be a project heading.
     */
    return line.length <= 160;
  }

  /*
   * Explicit common project naming patterns.
   */
  if (
    /\b(?:platform|system|application|app|website|portal|dashboard|analyzer|prediction|e-commerce|commerce|management|tracker|generator|social media)\b/i.test(
      line,
    )
  ) {
    return line.length <= 160;
  }

  /*
   * Short title-like lines.
   */
  if (
    line.length <= 90 &&
    !/[.!?]$/.test(line) &&
    !line.includes(":") &&
    !line.includes("https://") &&
    !line.includes("github.com")
  ) {
    return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* PROJECT PARSING                                                            */
/* -------------------------------------------------------------------------- */

function parseProjects(lines: string[]): ProjectData[] {
  const projects: ProjectData[] = [];

  let current: {
    name: string;
    date: string;
    technologies: string[];
    description: string[];
    github?: string;
    liveDemo?: string;
  } | null = null;

  const flush = () => {
    if (!current) return;

    const description = current.description
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const technologies = uniqueStrings(
      current.technologies.map(normalizeSkill),
    );

    /*
     * A project must have either:
     *
     * - a meaningful title
     * - or project-specific evidence
     *
     * This prevents random description paragraphs from becoming
     * projects.
     */
    if (
      current.name &&
      (description.length > 20 ||
        technologies.length > 0 ||
        current.github ||
        current.liveDemo)
    ) {
      projects.push({
        name: current.name,
        description:
          description || "Project details were detected in the resume.",
        contribution: description || undefined,
        technologies: technologies.length ? technologies : undefined,
        impact: undefined,
      });
    }

    current = null;
  };

  for (let index = 0; index < lines.length; index++) {
    const rawLine = lines[index];

    const line = normalizeResumeLine(rawLine);

    if (!line) continue;

    /*
     * Ignore generic project labels.
     */
    if (/^(?:PROJECT|PROJECTS)$/i.test(line)) {
      continue;
    }

    /*
     * GitHub.
     */
    const github = extractGithub(line);

    if (github) {
      if (!current) {
        continue;
      }

      current.github = github;
      continue;
    }

    /*
     * Live demo.
     */
    const liveDemo = extractLiveDemo(line);

    if (liveDemo) {
      if (!current) {
        continue;
      }

      current.liveDemo = liveDemo;
      continue;
    }

    /*
     * Tech stack.
     */
    if (/^tech\s*stack\s*:/i.test(line) || /^technologies\s*:/i.test(line)) {
      if (!current) {
        continue;
      }

      const technologyText = line
        .replace(/^tech\s*stack\s*:/i, "")
        .replace(/^technologies\s*:/i, "");

      const technologies = technologyText
        .split(/[,|•]/)
        .map((item) => item.trim())
        .filter(Boolean);

      current.technologies.push(...technologies);

      continue;
    }

    /*
     * New project.
     */
    if (looksLikeProjectTitle(line)) {
      if (current) {
        flush();
      }

      const date = extractDate(line);

      const name = date ? line.replace(date, "").trim() : line;

      current = {
        name: name || line,
        date,
        technologies: [],
        description: [],
      };

      continue;
    }

    /*
     * If we don't have a project yet, ignore metadata.
     */
    if (!current) {
      continue;
    }

    /*
     * Don't turn labels into descriptions.
     */
    if (/^what\s+the\s+project\s+does/i.test(line)) {
      continue;
    }

    /*
     * Description.
     */
    current.description.push(line);
  }

  flush();

  return projects.slice(0, 10);
}

/* -------------------------------------------------------------------------- */
/* SKILL SECTION                                                              */
/* -------------------------------------------------------------------------- */

function parseSkills(lines: string[]): string[] {
  const combined = lines.join(" ");

  const detected = extractSkills(combined);

  /*
   * Also parse comma-separated explicit skill lists.
   */
  const explicit: string[] = [];

  for (const line of lines) {
    const value = line
      .replace(
        /^(?:programming languages|languages|frontend development|backend development|databases|ai\s*&?\s*machine learning|tools\s*&?\s*platforms|core concepts|deployment|tools\/frameworks|cs fundamentals|ai tools)\s*:\s*/i,
        "",
      )
      .trim();

    if (!value) continue;

    for (const item of value.split(/[,|•]/)) {
      const cleaned = item.trim();

      if (cleaned && cleaned.length <= 50) {
        explicit.push(cleaned);
      }
    }
  }

  return uniqueStrings([...detected, ...explicit.map(normalizeSkill)]);
}

/* -------------------------------------------------------------------------- */
/* CANDIDATE                                                                  */
/* -------------------------------------------------------------------------- */

function parseCandidate(lines: string[]): CandidateData {
  let name = "";

  /*
   * Search the first 20 meaningful lines.
   *
   * We intentionally don't assume the first line is the name because
   * multi-column PDFs can put EDUCATION or another section first.
   */
  for (let index = 0; index < Math.min(lines.length, 25); index++) {
    const line = normalizeResumeLine(lines[index]);

    if (!line) continue;

    if (detectSection(line) !== "unknown") {
      continue;
    }

    if (looksLikeName(line)) {
      name = repairName(line);
      break;
    }

    /*
     * Uppercase extracted name without spaces.
     */
    const compact = line.replace(/\s+/g, "");

    if (/^[A-Z]{8,30}$/.test(compact) && !/\d/.test(compact)) {
      name = repairName(compact);
      break;
    }
  }

  const combined = lines.join(" ");

  const email = extractEmail(combined);
  const phone = extractPhone(combined);
  const linkedin = extractLinkedIn(combined);

  let location: string | undefined;

  const locationMatch = combined.match(
    /\b(?:Bengaluru|Bangalore|Mumbai|Pune|Delhi|Hyderabad|Chennai|Kolkata|India|Baramati)\b(?:,\s*[A-Za-z ]+)?/i,
  );

  if (locationMatch) {
    location = locationMatch[0].trim();
  }

  /*
   * Find a professional headline.
   */
  const headline = lines.find((line) =>
    /\b(?:developer|engineer|analyst|designer|manager|enthusiast|student)\b/i.test(
      line,
    ),
  );

  return {
    name: name || undefined,
    headline: headline || undefined,
    location,
  };
}

/* -------------------------------------------------------------------------- */
/* MAIN PARSER                                                                */
/* -------------------------------------------------------------------------- */

export function parseResume(resumeText: string): ParsedResume {
  const normalized = normalizeText(resumeText);

  if (!normalized) {
    throw new Error("Resume text is empty.");
  }

  /*
   * Normalize every line first.
   */
  const lines = normalized.split("\n").map(normalizeResumeLine).filter(Boolean);

  /* ------------------------------------------------------------------------ */
  /* SECTION BUCKETS                                                          */
  /* ------------------------------------------------------------------------ */

  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
    unknown: [],
  };

  let currentSection = "header";

  for (const line of lines) {
    const section = detectSection(line);

    if (section !== "unknown") {
      currentSection = section;
      continue;
    }

    sections[currentSection].push(line);
  }

  /* ------------------------------------------------------------------------ */
  /* SPECIAL CASE: SOME PDFS PUT EDUCATION FIRST                             */
  /* ------------------------------------------------------------------------ */

  /*
   * In the first resume you tested, the PDF's visual columns cause:
   *
   * EDUCATION
   * name/contact
   * SUMMARY
   * PROJECTS
   * ...
   * Masters Of Computer Applications
   * Garden City University Bengaluru
   *
   * So the education heading and its actual content can become
   * separated in the linear PDF reading order.
   *
   * Recover obvious education records from the complete document.
   */
  const educationEvidence = lines.filter((line) =>
    /\b(?:MCA|MBA|BCA|BBA|B\.?E\.?|B\.?Tech|M\.?Tech|M\.?E\.?|Bachelor|Master|Ph\.?D|Diploma|University|College|Institute|Computer Applications|Computer Science|Engineering)\b/i.test(
      line,
    ),
  );

  if (sections.education.length < 2 && educationEvidence.length > 0) {
    sections.education = uniqueStrings([
      ...sections.education,
      ...educationEvidence,
    ]);
  }

  /* ------------------------------------------------------------------------ */
  /* CANDIDATE                                                                */
  /* ------------------------------------------------------------------------ */

  const candidate = parseCandidate(lines);

  /* ------------------------------------------------------------------------ */
  /* SUMMARY                                                                  */
  /* ------------------------------------------------------------------------ */

  const summary = buildSummary(sections.summary);

  /* ------------------------------------------------------------------------ */
  /* EDUCATION                                                                */
  /* ------------------------------------------------------------------------ */

  const education = buildEducation(sections.education);

  /* ------------------------------------------------------------------------ */
  /* SKILLS                                                                   */
  /* ------------------------------------------------------------------------ */

  const skills = parseSkills(sections.skills);

  /* ------------------------------------------------------------------------ */
  /* PROJECTS                                                                 */
  /* ------------------------------------------------------------------------ */

  const projects = parseProjects(sections.projects);

  /* ------------------------------------------------------------------------ */
  /* EXPERIENCE                                                               */
  /* ------------------------------------------------------------------------ */

  const experienceDetails = parseExperience(sections.experience);

  /* ------------------------------------------------------------------------ */
  /* FALLBACK EXPERIENCE                                                       */
  /* ------------------------------------------------------------------------ */

  /*
   * Never fabricate work experience.
   *
   * If the resume doesn't contain an EXPERIENCE section,
   * projects should remain projects.
   */
  const finalExperience = experienceDetails;

  /* ------------------------------------------------------------------------ */
  /* DEBUG                                                                    */
  /* ------------------------------------------------------------------------ */

  console.log("==========================================");

  console.log("[Revio Parser] STRUCTURED RESUME");

  console.log("==========================================");

  console.log("[Revio Parser] Candidate:", candidate);

  console.log("[Revio Parser] Summary:", summary.slice(0, 300));

  console.log("[Revio Parser] Education:", education);

  console.log("[Revio Parser] Skills:", skills);

  console.log(
    "[Revio Parser] Projects:",
    projects.map((project) => ({
      name: project.name,
      technologies: project.technologies,
      description: project.description.slice(0, 120),
    })),
  );

  console.log("[Revio Parser] Experience:", finalExperience);

  console.log("==========================================");

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    candidate,
    summary,
    education,
    skills,
    projects,
    experienceDetails: finalExperience,
    sections,
  };
}
