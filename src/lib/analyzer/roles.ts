import { clamp } from "./normalize";

import type { RoleData, SkillGapData } from "./types";

type RoleDefinition = {
  role: string;
  description: string;
  skills: string[];
  keywords: string[];
  juniorOnly?: boolean;
};

const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: "Frontend Developer",
    description:
      "Builds responsive web interfaces and user experiences using modern frontend technologies.",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Git",
    ],
    keywords: [
      "frontend",
      "front-end",
      "ui",
      "web",
      "react",
      "javascript",
      "typescript",
    ],
  },

  {
    role: "Full Stack Developer",
    description:
      "Develops complete web applications across frontend, backend, APIs, databases, and deployment.",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "REST API",
      "PostgreSQL",
      "MongoDB",
      "Git",
    ],
    keywords: [
      "full stack",
      "full-stack",
      "backend",
      "frontend",
      "api",
      "web application",
    ],
  },

  {
    role: "Backend Developer",
    description:
      "Builds server-side systems, APIs, databases, integrations, and application services.",
    skills: [
      "Node.js",
      "JavaScript",
      "TypeScript",
      "REST API",
      "PostgreSQL",
      "MongoDB",
      "SQL",
      "Git",
    ],
    keywords: ["backend", "back-end", "server", "api", "database", "services"],
  },

  {
    role: "Data Analyst",
    description:
      "Transforms business and operational data into insights using analysis, statistics, and visualization.",
    skills: [
      "SQL",
      "Python",
      "Data Analysis",
      "Pandas",
      "NumPy",
      "Communication",
    ],
    keywords: [
      "data analyst",
      "data analysis",
      "analytics",
      "reporting",
      "dashboard",
      "business intelligence",
    ],
  },

  {
    role: "Machine Learning Engineer",
    description:
      "Develops and deploys machine learning systems using data processing, modeling, evaluation, and engineering practices.",
    skills: ["Python", "Machine Learning", "Pandas", "NumPy", "SQL", "Git"],
    keywords: [
      "machine learning",
      "ml",
      "model",
      "artificial intelligence",
      "ai",
      "prediction",
    ],
  },

  {
    role: "DevOps / Cloud Engineer",
    description:
      "Automates application delivery and manages cloud infrastructure, containers, deployment, and reliability.",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "Git", "Linux"],
    keywords: [
      "devops",
      "cloud",
      "infrastructure",
      "deployment",
      "ci/cd",
      "pipeline",
    ],
  },

  {
    role: "Software Engineer",
    description:
      "Designs, develops, tests, and maintains software applications and engineering systems.",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "Git",
      "REST API",
      "SQL",
    ],
    keywords: [
      "software engineer",
      "software developer",
      "application",
      "engineering",
      "development",
    ],
  },

  {
    role: "Product Manager",
    description:
      "Coordinates product strategy, requirements, prioritization, stakeholder communication, and delivery.",
    skills: ["Communication", "Leadership", "Project Management"],
    keywords: [
      "product",
      "roadmap",
      "requirements",
      "stakeholder",
      "product manager",
    ],
  },
];

export function recommendRoles(
  text: string,
  skills: string[],
  experienceCount: number,
): RoleData[] {
  const lowerText = text.toLowerCase();

  const normalizedSkills = new Set(skills.map((skill) => skill.toLowerCase()));

  const scored = ROLE_DEFINITIONS.map((definition) => {
    let score = 0;

    const matchedSkills = definition.skills.filter((skill) =>
      normalizedSkills.has(skill.toLowerCase()),
    );

    const matchedKeywords = definition.keywords.filter((keyword) =>
      lowerText.includes(keyword),
    );

    score += matchedSkills.length * 9;

    score += matchedKeywords.length * 5;

    if (matchedSkills.length >= 3) {
      score += 8;
    }

    if (experienceCount > 0 && matchedSkills.length >= 2) {
      score += 5;
    }

    const maxPossible =
      definition.skills.length * 9 + definition.keywords.length * 5 + 13;

    const match = clamp((score / maxPossible) * 100, 25, 98);

    return {
      definition,
      match,
      matchedSkills,
    };
  });

  scored.sort((a, b) => b.match - a.match);

  const selected = scored
    .filter((item) => item.matchedSkills.length > 0 || item.match >= 35)
    .slice(0, 3);

  while (selected.length < 3) {
    const fallback = scored.find((item) => !selected.includes(item));

    if (!fallback) {
      break;
    }

    selected.push(fallback);
  }

  return selected.map((item, index) => ({
    rank: `#${index + 1}`,
    role: item.definition.role,
    match: item.match,
    description: item.definition.description,
    skills: item.definition.skills.slice(0, 6),
  }));
}

export function calculateSkillGaps(
  skills: string[],
  recommendedRoles: RoleData[],
): SkillGapData[] {
  const candidateSkills = new Set(skills.map((skill) => skill.toLowerCase()));

  const prioritySkills: string[] = [];

  for (const role of recommendedRoles) {
    for (const skill of role.skills ?? []) {
      if (!candidateSkills.has(skill.toLowerCase())) {
        prioritySkills.push(skill);
      }
    }
  }

  const unique = Array.from(
    new Map(
      prioritySkills.map((skill) => [skill.toLowerCase(), skill]),
    ).values(),
  );

  return unique.slice(0, 6).map((skill, index) => ({
    name: skill,
    level: clamp(30 + (5 - index) * 8, 20, 75),
    reason: `This skill appears in the requirements of the strongest recommended roles but was not detected in the resume evidence.`,
  }));
}

export function buildNextCareerMove(
  recommendedRoles: RoleData[],
  skillGaps: SkillGapData[],
): {
  title: string;
  description: string;
} {
  const topRole = recommendedRoles[0]?.role ?? "your target role";

  const topGap = skillGaps[0]?.name;

  if (topGap) {
    return {
      title: `Strengthen ${topGap} for ${topRole}`,
      description: `Your current resume has signals aligned with ${topRole}. A practical next step is to build stronger evidence around ${topGap}, ideally through a project, work achievement, certification, or measurable result.`,
    };
  }

  return {
    title: `Build stronger evidence for ${topRole}`,
    description: `Your resume currently shows alignment with ${topRole}. Focus next on adding measurable achievements, stronger project outcomes, and role-specific evidence to make that direction more competitive.`,
  };
}
