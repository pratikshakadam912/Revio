import { normalizeSkill, uniqueStrings } from "./normalize";

type SkillDefinition = {
  name: string;
  aliases: string[];
  category: string;
};

const SKILLS: SkillDefinition[] = [
  // Languages
  {
    name: "JavaScript",
    aliases: ["javascript", "js", "ecmascript"],
    category: "Language",
  },
  {
    name: "TypeScript",
    aliases: ["typescript", "ts"],
    category: "Language",
  },
  {
    name: "Python",
    aliases: ["python"],
    category: "Language",
  },
  {
    name: "Java",
    aliases: ["java"],
    category: "Language",
  },
  {
    name: "C++",
    aliases: ["c++", "cpp"],
    category: "Language",
  },
  {
    name: "C#",
    aliases: ["c#", "csharp"],
    category: "Language",
  },
  {
    name: "Go",
    aliases: ["golang"],
    category: "Language",
  },
  {
    name: "PHP",
    aliases: ["php"],
    category: "Language",
  },
  {
    name: "Ruby",
    aliases: ["ruby"],
    category: "Language",
  },

  // Frontend
  {
    name: "React",
    aliases: ["react", "react.js", "reactjs", "react js"],
    category: "Frontend",
  },
  {
    name: "Next.js",
    aliases: ["next.js", "nextjs", "next js"],
    category: "Frontend",
  },
  {
    name: "Angular",
    aliases: ["angular"],
    category: "Frontend",
  },
  {
    name: "Vue",
    aliases: ["vue", "vue.js", "vuejs"],
    category: "Frontend",
  },
  {
    name: "HTML",
    aliases: ["html", "html5"],
    category: "Frontend",
  },
  {
    name: "CSS",
    aliases: ["css", "css3"],
    category: "Frontend",
  },
  {
    name: "Tailwind CSS",
    aliases: ["tailwind", "tailwindcss", "tailwind css"],
    category: "Frontend",
  },

  // Backend
  {
    name: "Node.js",
    aliases: ["node.js", "nodejs", "node js"],
    category: "Backend",
  },
  {
    name: "Express",
    aliases: ["express", "express.js", "expressjs"],
    category: "Backend",
  },
  {
    name: "REST API",
    aliases: ["rest api", "restful api", "rest"],
    category: "Backend",
  },
  {
    name: "GraphQL",
    aliases: ["graphql"],
    category: "Backend",
  },

  // Databases
  {
    name: "PostgreSQL",
    aliases: ["postgresql", "postgres"],
    category: "Database",
  },
  {
    name: "MySQL",
    aliases: ["mysql"],
    category: "Database",
  },
  {
    name: "MongoDB",
    aliases: ["mongodb", "mongo"],
    category: "Database",
  },
  {
    name: "Redis",
    aliases: ["redis"],
    category: "Database",
  },
  {
    name: "SQL",
    aliases: ["sql"],
    category: "Database",
  },

  // Cloud
  {
    name: "AWS",
    aliases: ["aws", "amazon web services"],
    category: "Cloud",
  },
  {
    name: "Azure",
    aliases: ["azure", "microsoft azure"],
    category: "Cloud",
  },
  {
    name: "Google Cloud",
    aliases: ["google cloud", "gcp"],
    category: "Cloud",
  },

  // DevOps
  {
    name: "Docker",
    aliases: ["docker"],
    category: "DevOps",
  },
  {
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s"],
    category: "DevOps",
  },
  {
    name: "Git",
    aliases: ["git"],
    category: "Tools",
  },
  {
    name: "GitHub",
    aliases: ["github"],
    category: "Tools",
  },
  {
    name: "GitLab",
    aliases: ["gitlab"],
    category: "Tools",
  },
  {
    name: "CI/CD",
    aliases: ["ci/cd", "cicd", "continuous integration"],
    category: "DevOps",
  },

  // Frameworks / ORM
  {
    name: "Prisma",
    aliases: ["prisma"],
    category: "Database",
  },
  {
    name: "Django",
    aliases: ["django"],
    category: "Backend",
  },
  {
    name: "Spring Boot",
    aliases: ["spring boot"],
    category: "Backend",
  },

  // Data / AI
  {
    name: "Machine Learning",
    aliases: ["machine learning", "ml"],
    category: "AI",
  },
  {
    name: "Data Analysis",
    aliases: ["data analysis", "data analytics"],
    category: "Data",
  },
  {
    name: "Pandas",
    aliases: ["pandas"],
    category: "Data",
  },
  {
    name: "NumPy",
    aliases: ["numpy"],
    category: "Data",
  },

  // Business / general
  {
    name: "Project Management",
    aliases: ["project management"],
    category: "Business",
  },
  {
    name: "Leadership",
    aliases: ["leadership"],
    category: "Soft Skill",
  },
  {
    name: "Communication",
    aliases: ["communication", "verbal communication"],
    category: "Soft Skill",
  },
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();

  const detected: string[] = [];

  for (const definition of SKILLS) {
    for (const alias of definition.aliases) {
      const pattern = new RegExp(
        `(^|[^a-z0-9+#])${escapeRegExp(alias.toLowerCase())}([^a-z0-9+#]|$)`,
        "i",
      );

      if (pattern.test(lower)) {
        detected.push(normalizeSkill(definition.name));
        break;
      }
    }
  }

  return uniqueStrings(detected);
}

export function getSkillCategory(skill: string): string {
  const found = SKILLS.find(
    (item) => item.name.toLowerCase() === skill.toLowerCase(),
  );

  return found?.category ?? "Other";
}

export function getSkillDefinitions(): SkillDefinition[] {
  return SKILLS;
}
