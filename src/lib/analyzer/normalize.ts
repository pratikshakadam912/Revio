// Conservative resume text normalization and canonicalization utilities.

const BULLET_CHARS = "•●▪▫◦‣⁃∙➢➤►▸";

const SKILL_CANONICAL_MAP: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  "react.js": "React",
  reactjs: "React",
  "next.js": "Next.js",
  nextjs: "Next.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  "express.js": "Express.js",
  expressjs: "Express.js",
  "tailwind css": "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  mysql: "MySQL",
  python: "Python",
  java: "Java",
  "c++": "C++",
  "c#": "C#",
  "machine learning": "Machine Learning",
  "deep learning": "Deep Learning",
  "artificial intelligence": "Artificial Intelligence",
  "power bi": "Power BI",
  "scikit learn": "scikit-learn",
  "scikit-learn": "scikit-learn",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  postman: "Postman",
  github: "GitHub",
  gitlab: "GitLab",
  docker: "Docker",
  kubernetes: "Kubernetes",
  aws: "AWS",
  azure: "Azure",
  "google cloud": "Google Cloud",
  gcp: "Google Cloud",
  firebase: "Firebase",
  supabase: "Supabase",
  prisma: "Prisma",
  graphql: "GraphQL",
  "rest api": "REST API",
  "rest apis": "REST APIs",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  "ui/ux": "UI/UX",
  figma: "Figma",
  tableau: "Tableau",
  excel: "Excel",
  pandas: "Pandas",
  numpy: "NumPy",
};

const HEADING_ALIASES: Record<string, string> = {
  summary: "summary",
  profile: "summary",
  about: "summary",
  objective: "summary",
  "career objective": "summary",
  "professional summary": "summary",
  "professional profile": "summary",

  experience: "experience",
  "work experience": "experience",
  "professional experience": "experience",
  employment: "experience",
  "employment history": "experience",
  "work history": "experience",
  career: "experience",
  internships: "experience",
  internship: "experience",

  education: "education",
  academics: "education",
  academic: "education",
  qualification: "education",
  qualifications: "education",
  "academic qualifications": "education",
  "education and qualifications": "education",

  project: "projects",
  projects: "projects",
  "personal projects": "projects",
  "academic projects": "projects",
  "key projects": "projects",
  "selected projects": "projects",

  skills: "skills",
  "technical skills": "skills",
  "technical skill": "skills",
  "core skills": "skills",
  "key skills": "skills",
  technologies: "skills",
  "technical expertise": "skills",
  "tools and technologies": "skills",
  "skills and technologies": "skills",

  certification: "certifications",
  certifications: "certifications",
  "professional certifications": "certifications",
  licenses: "certifications",
  "licenses and certifications": "certifications",

  language: "languages",
  languages: "languages",

  achievements: "achievements",
  achievement: "achievements",
  awards: "achievements",
  honors: "achievements",
  "honors and awards": "achievements",
  accomplishments: "achievements",
};

export function normalizeText(value: string): string {
  if (!value) return "";

  let text = String(value);

  text = text
    .replace(/\ufeff/g, "")
    .replace(/\u200b/g, "")
    .replace(/\u200c/g, "")
    .replace(/\u200d/g, "")
    .replace(/\u2060/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  text = normalizeUnicodePunctuation(text);

  text = text
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{4,}/g, "\n\n\n");

  return text.trim();
}

export function cleanLine(value: string): string {
  if (!value) return "";

  let line = String(value)
    .replace(/\u00a0/g, " ")
    .replace(/\u200b/g, "")
    .replace(/\u200c/g, "")
    .replace(/\u200d/g, "")
    .replace(/\ufeff/g, "")
    .replace(/\r/g, "")
    .replace(/\n/g, " ");

  line = normalizeUnicodePunctuation(line);

  line = line.replace(/[ \t]+/g, " ").trim();

  line = removeLeadingBullet(line);

  return line.trim();
}

export function normalizeSkill(value: string): string {
  const cleaned = cleanLine(value);

  if (!cleaned) return "";

  const key = cleaned.toLowerCase().replace(/\s+/g, " ").trim();

  if (SKILL_CANONICAL_MAP[key]) {
    return SKILL_CANONICAL_MAP[key];
  }

  return cleaned
    .replace(/\bjavascript\b/gi, "JavaScript")
    .replace(/\btypescript\b/gi, "TypeScript")
    .replace(/\breact\.?\s*js\b/gi, "React")
    .replace(/\bnext\.?\s*js\b/gi, "Next.js")
    .replace(/\bnode\.?\s*js\b/gi, "Node.js")
    .replace(/\bexpress\.?\s*js\b/gi, "Express.js")
    .replace(/\btailwind\s*css\b/gi, "Tailwind CSS")
    .replace(/\bpostgres(?:ql)?\b/gi, "PostgreSQL")
    .replace(/\bmongo(?:db)?\b/gi, "MongoDB")
    .replace(/\bmysql\b/gi, "MySQL")
    .replace(/\bpython\b/gi, "Python")
    .replace(/\bjava\b/gi, "Java")
    .replace(/\bc\+\+\b/gi, "C++")
    .replace(/\bc#\b/gi, "C#")
    .replace(/\bpower\s*bi\b/gi, "Power BI")
    .replace(/\bscikit[\s-]?learn\b/gi, "scikit-learn")
    .replace(/\btensorflow\b/gi, "TensorFlow")
    .replace(/\bpytorch\b/gi, "PyTorch")
    .replace(/\bgithub\b/gi, "GitHub")
    .replace(/\bgitlab\b/gi, "GitLab")
    .trim();
}

export function uniqueStrings(values: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const cleaned = cleanLine(value);

    if (!cleaned) continue;

    const key = normalizeComparisonKey(cleaned);

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(cleaned);
  }

  return result;
}

export function uniqueSkills(values: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const skill = normalizeSkill(value);

    if (!skill) continue;

    const key = normalizeComparisonKey(skill);

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(skill);
  }

  return result;
}

export function clamp(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.max(min, Math.min(max, Math.round(value)));
}

export function repairPdfText(value: string): string {
  if (!value) return "";

  let text = normalizeText(value);

  text = repairBrokenEncoding(text);
  text = repairBrokenLineWords(text);
  text = repairKnownJoinedTerms(text);
  text = repairSplitHeadings(text);

  return text
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function canonicalHeading(value: string): string {
  const normalized = normalizeHeading(value);

  return HEADING_ALIASES[normalized] ?? "unknown";
}

export function isKnownHeading(value: string): boolean {
  return canonicalHeading(value) !== "unknown";
}

export function normalizeHeading(value: string): string {
  if (!value) return "";

  let result = String(value).toLowerCase();

  for (const bullet of BULLET_CHARS) {
    result = result.split(bullet).join(" ");
  }

  result = result
    .replace(/[&+]/g, " and ")
    .replace(/[|:/\\()[\]{}.,;_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return result;
}

export function normalizeDateText(value: string): string {
  return cleanLine(value)
    .replace(/\bSept\.\b/gi, "Sep")
    .replace(/\bSept\b/gi, "Sep")
    .replace(/\bCurrent\b/gi, "Present")
    .replace(/\bNow\b/gi, "Present");
}

export function normalizeUrl(value: string): string {
  let url = value.trim();

  if (!url) return "";

  url = url.replace(/^[<(\[]+/, "");
  url = url.replace(/[>)\],.;]+$/, "");

  if (/^www\./i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

export function normalizeEmail(value: string): string {
  return value
    .trim()
    .replace(/[<>()[\],;]/g, "")
    .toLowerCase();
}

export function normalizePhone(value: string): string {
  return value
    .trim()
    .replace(/[^\d+()\s.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUnicodePunctuation(text: string): string {
  return text
    .replace(/[‐-‒–—―−]/g, "-")
    .replace(/[“”„‟]/g, '"')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/…/g, "...");
}

function removeLeadingBullet(line: string): string {
  let index = 0;

  while (
    index < line.length &&
    (line[index] === " " ||
      line[index] === "\t" ||
      BULLET_CHARS.includes(line[index]))
  ) {
    index += 1;
  }

  return line.slice(index);
}

function repairBrokenEncoding(text: string): string {
  return text
    .replace(/\ufffd+/g, "")
    .replace(/Ã©/g, "é")
    .replace(/Ã¨/g, "è")
    .replace(/Ã¡/g, "á")
    .replace(/Ã³/g, "ó")
    .replace(/Ã±/g, "ñ")
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€\x9d/g, '"')
    .replace(/â€“/g, "-")
    .replace(/â€”/g, "-");
}

function repairBrokenLineWords(text: string): string {
  return text.replace(/([A-Za-z]{2,})-\n([A-Za-z]{2,})/g, "$1$2");
}

function repairKnownJoinedTerms(text: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\bFullStack\b/gi, "Full Stack"],
    [/\bFrontEnd\b/gi, "Front End"],
    [/\bBackEnd\b/gi, "Back End"],
    [/\bMachineLearning\b/gi, "Machine Learning"],
    [/\bDeepLearning\b/gi, "Deep Learning"],
    [/\bDataScience\b/gi, "Data Science"],
    [/\bWebDevelopment\b/gi, "Web Development"],
    [/\bComputerScience\b/gi, "Computer Science"],
    [/\bComputerApplications\b/gi, "Computer Applications"],
    [/\bInformationTechnology\b/gi, "Information Technology"],
  ];

  let result = text;

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

function repairSplitHeadings(text: string): string {
  const headingPatterns: Array<[RegExp, string]> = [
    [/\bE\s*D\s*U\s*C\s*A\s*T\s*I\s*O\s*N\b/gi, "EDUCATION"],
    [/\bE\s*X\s*P\s*E\s*R\s*I\s*E\s*N\s*C\s*E\b/gi, "EXPERIENCE"],
    [/\bP\s*R\s*O\s*J\s*E\s*C\s*T\s*S\b/gi, "PROJECTS"],
    [/\bS\s*K\s*I\s*L\s*L\s*S\b/gi, "SKILLS"],
    [
      /\bC\s*E\s*R\s*T\s*I\s*F\s*I\s*C\s*A\s*T\s*I\s*O\s*N\s*S\b/gi,
      "CERTIFICATIONS",
    ],
    [/\bL\s*A\s*N\s*G\s*U\s*A\s*G\s*E\s*S\b/gi, "LANGUAGES"],
    [/\bA\s*C\s*H\s*I\s*E\s*V\s*E\s*M\s*E\s*N\s*T\s*S\b/gi, "ACHIEVEMENTS"],
  ];

  let result = text;

  for (const [pattern, replacement] of headingPatterns) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

function normalizeComparisonKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#]+/g, "")
    .trim();
}
