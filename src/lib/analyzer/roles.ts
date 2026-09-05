import type { ExperienceItem, ProjectItem } from "./types";

import { normalizeSkill, uniqueStrings } from "./normalize";

type RoleDefinition = {
  role: string;
  description: string;
  skills: string[];
  aliases: string[];
};

export type RecommendedRole = {
  role: string;
  match: number;
  description: string;
  skills: string[];
};

export type SkillGap = {
  name: string;
  level: number;
  reason?: string;
};

export type CareerMove = {
  title: string;
  description: string;
};

// ======================================================
// ROLE DATABASE
// ======================================================

const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: "Frontend Developer",

    description:
      "Builds responsive and interactive web interfaces using modern frontend technologies.",

    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "HTML",
      "CSS",
      "Tailwind CSS",
    ],

    aliases: ["frontend", "front end", "ui developer", "web developer"],
  },

  {
    role: "Full Stack Developer",

    description:
      "Builds complete web applications across frontend, backend, databases, APIs, and deployment.",

    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "REST",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Git",
    ],

    aliases: ["full stack", "fullstack", "web developer", "software developer"],
  },

  {
    role: "Backend Developer",

    description:
      "Develops server-side applications, APIs, databases, authentication systems, and backend services.",

    skills: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express.js",
      "REST",
      "GraphQL",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
    ],

    aliases: ["backend", "back end", "server developer", "api developer"],
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
      "C++",
      "Git",
      "SQL",
      "REST",
      "OOP",
      "DSA",
    ],

    aliases: [
      "software engineer",
      "software developer",
      "developer",
      "programmer",
    ],
  },

  {
    role: "Data Analyst",

    description:
      "Uses data analysis, statistics, SQL, and visualization techniques to generate useful insights.",

    skills: [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Data Analysis",
      "Excel",
      "Statistics",
    ],

    aliases: ["data analyst", "data analysis", "business analyst"],
  },

  {
    role: "Machine Learning Engineer",

    description:
      "Develops machine learning systems, data pipelines, predictive models, and intelligent applications.",

    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Machine Learning",
      "Data Analysis",
      "Scikit-learn",
      "SQL",
    ],

    aliases: [
      "machine learning",
      "ml engineer",
      "machine learning engineer",
      "ai engineer",
    ],
  },

  {
    role: "DevOps / Cloud Engineer",

    description:
      "Automates deployment and infrastructure while building reliable cloud-based development environments.",

    skills: [
      "Git",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
      "CI/CD",
      "Linux",
    ],

    aliases: ["devops", "cloud", "cloud engineer", "devops engineer"],
  },

  {
    role: "Product Manager",

    description:
      "Coordinates product strategy, requirements, priorities, stakeholders, and product delivery.",

    skills: [
      "Product Management",
      "Communication",
      "Leadership",
      "Project Management",
      "Problem Solving",
    ],

    aliases: ["product manager", "product management", "pm"],
  },
];

// ======================================================
// NORMALIZATION
// ======================================================

function normalizeForComparison(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.#/+_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasSkill(candidateSkills: string[], targetSkill: string): boolean {
  const target = normalizeForComparison(normalizeSkill(targetSkill));

  return candidateSkills.some((skill) => {
    const normalized = normalizeForComparison(normalizeSkill(skill));

    return (
      normalized === target ||
      normalized.includes(target) ||
      target.includes(normalized)
    );
  });
}

// ======================================================
// ROLE RECOMMENDATION
// ======================================================

export function recommendRoles(
  candidateSkills: string[] = [],
  summary: string = "",
  projects: ProjectItem[] = [],
): RecommendedRole[] {
  const normalizedSkills = uniqueStrings(candidateSkills);

  const resumeContext = normalizeForComparison(
    [
      summary,
      ...projects.map(
        (project) =>
          `${project.name} ${project.description} ${project.technologies.join(" ")}`,
      ),
    ].join(" "),
  );

  const recommendations = ROLE_DEFINITIONS.map((definition) => {
    let matched = 0;

    for (const skill of definition.skills) {
      if (hasSkill(normalizedSkills, skill)) {
        matched++;
      }
    }

    let score =
      definition.skills.length > 0
        ? (matched / definition.skills.length) * 100
        : 0;

    /*
     * Add a small contextual boost when the
     * resume explicitly talks about the role.
     */
    for (const alias of definition.aliases) {
      if (resumeContext.includes(normalizeForComparison(alias))) {
        score += 8;
        break;
      }
    }

    /*
     * Projects are useful evidence.
     */
    if (
      projects.length >= 2 &&
      (definition.role === "Software Engineer" ||
        definition.role === "Full Stack Developer")
    ) {
      score += 5;
    }

    score = Math.min(100, Math.round(score));

    return {
      role: definition.role,
      match: score,
      description: definition.description,
      skills: definition.skills,
    };
  });

  return recommendations.sort((a, b) => b.match - a.match).slice(0, 3);
}

// ======================================================
// SKILL GAPS
// ======================================================

export function calculateSkillGaps(
  candidateSkills: string[] = [],
  roles: RecommendedRole[] = [],
): SkillGap[] {
  if (!roles.length) {
    return [];
  }

  const gaps: SkillGap[] = [];

  /*
   * Look at the strongest recommended roles
   * and find skills that repeatedly occur in
   * those roles but are missing from the resume.
   */
  for (const role of roles.slice(0, 3)) {
    for (const skill of role.skills) {
      if (hasSkill(candidateSkills, skill)) {
        continue;
      }

      const existing = gaps.find(
        (gap) =>
          normalizeForComparison(gap.name) === normalizeForComparison(skill),
      );

      if (existing) {
        existing.level += 1;
      } else {
        gaps.push({
          name: skill,
          level: 1,
          reason: `Commonly required for ${role.role}`,
        });
      }
    }
  }

  return gaps
    .sort((a, b) => b.level - a.level)
    .slice(0, 6)
    .map((gap) => ({
      ...gap,
      level: Math.min(100, gap.level * 30),
    }));
}

// ======================================================
// NEXT CAREER MOVE
// ======================================================

export function calculateNextCareerMove(
  candidateSkills: string[] = [],
  experience: ExperienceItem[] = [],
  roles: RecommendedRole[] = [],
): CareerMove {
  const topRole = roles[0];

  if (!topRole) {
    return {
      title: "Build your target skill set",

      description:
        "Add relevant projects, strengthen your core technical skills, and build experience toward a clearly defined target role.",
    };
  }

  const hasProfessionalExperience = experience.length > 0;

  const missingSkills = topRole.skills.filter(
    (skill) => !hasSkill(candidateSkills, skill),
  );

  /*
   * Fresher / student path
   */
  if (!hasProfessionalExperience) {
    if (missingSkills.length > 0) {
      const importantMissing = missingSkills.slice(0, 3).join(", ");

      return {
        title: `Strengthen your ${topRole.role} profile`,

        description: `Focus on ${importantMissing}, build one or two strong projects using these technologies, and use those projects to demonstrate practical ability for entry-level ${topRole.role} positions.`,
      };
    }

    return {
      title: `Apply for entry-level ${topRole.role} roles`,

      description: `Your current skills align well with ${topRole.role}. Strengthen your portfolio, add measurable project outcomes, and begin targeting internships and entry-level positions.`,
    };
  }

  /*
   * Experienced candidate path
   */
  if (topRole.match >= 75 && missingSkills.length <= 2) {
    return {
      title: `Progress toward ${topRole.role} growth`,

      description: `Your existing experience and skills show strong alignment with ${topRole.role}. Focus on deeper ownership, measurable achievements, system-level work, and leadership opportunities.`,
    };
  }

  if (missingSkills.length > 0) {
    return {
      title: `Close the ${topRole.role} skill gaps`,

      description: `Build stronger capability in ${missingSkills
        .slice(0, 3)
        .join(
          ", ",
        )} while continuing to gain practical experience in your current technical areas.`,
    };
  }

  return {
    title: `Advance toward ${topRole.role}`,

    description: `Continue developing deeper technical ownership, measurable achievements, and increasingly complex projects aligned with ${topRole.role}.`,
  };
}
