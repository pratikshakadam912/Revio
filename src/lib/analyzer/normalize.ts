export function normalizeText(input: string): string {
  return String(input ?? "")
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanLine(line: string): string {
  return line
    .replace(/\u2022/g, "•")
    .replace(/^[\s\-–—*]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSkill(skill: string): string {
  const value = skill.trim();

  const aliases: Record<string, string> = {
    js: "JavaScript",
    javascript: "JavaScript",
    "java script": "JavaScript",

    ts: "TypeScript",
    typescript: "TypeScript",
    "type script": "TypeScript",

    "react.js": "React",
    reactjs: "React",
    "react js": "React",

    "next.js": "Next.js",
    nextjs: "Next.js",
    "next js": "Next.js",

    "node.js": "Node.js",
    nodejs: "Node.js",
    "node js": "Node.js",

    postgres: "PostgreSQL",
    postgresql: "PostgreSQL",

    mongo: "MongoDB",
    mongodb: "MongoDB",

    "c++": "C++",
    cpp: "C++",

    "c#": "C#",
    csharp: "C#",

    aws: "AWS",
    azure: "Azure",
    gcp: "Google Cloud",

    git: "Git",
    github: "GitHub",
    gitlab: "GitLab",

    html: "HTML",
    css: "CSS",

    tailwind: "Tailwind CSS",
    tailwindcss: "Tailwind CSS",

    prisma: "Prisma",
  };

  return aliases[value.toLowerCase()] ?? value;
}

export function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();

    if (!normalized) continue;

    const key = normalized.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

export function clamp(value: number, min = 0, max = 100): number {
  if (!Number.isFinite(value)) return min;

  return Math.max(min, Math.min(max, Math.round(value)));
}
