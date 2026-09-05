export function normalizeText(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[‐-‒–—−]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanLine(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/^[•●▪◦‣►▸]\s*/u, "")
    .trim();
}

export function normalizeSkill(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\bjavascript\b/gi, "JavaScript")
    .replace(/\btypescript\b/gi, "TypeScript")
    .replace(/\breact\.?js\b/gi, "React")
    .replace(/\bnext\.?js\b/gi, "Next.js")
    .replace(/\bnode\.?js\b/gi, "Node.js")
    .replace(/\bexpress\.?js\b/gi, "Express.js")
    .replace(/\btailwind\s*css\b/gi, "Tailwind CSS")
    .replace(/\bpostgresql\b/gi, "PostgreSQL")
    .replace(/\bmongodb\b/gi, "MongoDB")
    .replace(/\bmysql\b/gi, "MySQL")
    .replace(/\bpython\b/gi, "Python")
    .replace(/\bjava\b/gi, "Java")
    .replace(/\bc\+\+\b/gi, "C++")
    .replace(/\bc#\b/gi, "C#");
}

export function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const cleaned = value.trim();

    if (!cleaned) continue;

    const key = cleaned.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(cleaned);
  }

  return result;
}

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Repairs common PDF extraction artifacts without trying
 * to aggressively rewrite normal English.
 */
export function repairPdfText(value: string): string {
  let text = value;

  text = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  text = text.replace(
    /\b(FullStack|FrontEnd|BackEnd|MachineLearning|DataScience|WebDevelopment)\b/gi,
    (match) => {
      const replacements: Record<string, string> = {
        fullstack: "Full Stack",
        frontend: "Front End",
        backend: "Back End",
        machinelearning: "Machine Learning",
        datascience: "Data Science",
        webdevelopment: "Web Development",
      };

      return replacements[match.toLowerCase()] ?? match;
    },
  );

  text = text.replace(
    /\b(EDUC|EDUCATION|EXPERIENCE|PROJECTS|PROJ|SKILLS|CERT|CERTIFICATIONS)\s+([A-Z]+)\b/gi,
    (_, first, second) => {
      const combined = `${first}${second}`;

      const map: Record<string, string> = {
        EDUCATION: "EDUCATION",
        EXPERIENCE: "EXPERIENCE",
        PROJECTS: "PROJECTS",
        SKILLS: "SKILLS",
        CERTIFICATIONS: "CERTIFICATIONS",
      };

      return map[combined.toUpperCase()] ?? `${first} ${second}`;
    },
  );

  return text.replace(/[ \t]+/g, " ").trim();
}

export function canonicalHeading(value: string): string {
  const cleaned = value.toUpperCase().replace(/[^A-Z]/g, "");

  if (cleaned === "EDUCATION" || cleaned === "EDUCATIONANDQUALIFICATIONS") {
    return "education";
  }

  if (
    cleaned === "EXPERIENCE" ||
    cleaned === "WORKEXPERIENCE" ||
    cleaned === "PROFESSIONALEXPERIENCE"
  ) {
    return "experience";
  }

  if (
    cleaned === "PROJECT" ||
    cleaned === "PROJECTS" ||
    cleaned === "PERSONALPROJECTS"
  ) {
    return "projects";
  }

  if (
    cleaned === "SKILLS" ||
    cleaned === "TECHNICALSKILLS" ||
    cleaned === "TECHNICALSKILL"
  ) {
    return "skills";
  }

  if (cleaned === "CERTIFICATION" || cleaned === "CERTIFICATIONS") {
    return "certifications";
  }

  if (cleaned === "SUMMARY" || cleaned === "PROFILE") {
    return "summary";
  }

  if (cleaned === "LANGUAGES") {
    return "languages";
  }

  if (cleaned === "ACHIEVEMENTS" || cleaned === "AWARDS") {
    return "achievements";
  }

  return "unknown";
}
