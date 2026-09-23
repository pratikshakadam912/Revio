import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ResumeExperience = {
  company?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
};

type ResumeEducation = {
  degree?: string;
  field?: string;
  institution?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

type ResumeProject = {
  name?: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
};

type ResumeCertification = {
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
};

type ResumeLanguage = {
  name?: string;
  proficiency?: string;
};

type ResumeCandidate = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  headline?: string;
};

type ResumeDraft = {
  candidate?: ResumeCandidate;
  summary?: string;
  experience?: ResumeExperience[];
  education?: ResumeEducation[];
  projects?: ResumeProject[];
  skills?: string[];
  certifications?: ResumeCertification[];
  languages?: ResumeLanguage[];
  achievements?: string[];
};

type ResumeChange = {
  path: string;
  before: unknown;
  after: unknown;
  label: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const instruction = String(body?.instruction ?? "").trim();

    const resume = (body?.resume ?? {}) as ResumeDraft;

    if (!instruction) {
      return NextResponse.json(
        {
          success: false,
          error: "Tell Revio what you want to change.",
        },
        { status: 400 },
      );
    }

    const changes = parseInstruction(instruction, resume);

    if (!changes.length) {
      return NextResponse.json(
        {
          success: false,
          error:
            "I couldn't identify a specific change. Try something like “Change my name to Kirtesh” or “Remove my GitHub”.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      changes,
    });
  } catch (error) {
    console.error("AI REWRITE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to apply resume changes.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Instruction parser                                                         */
/* -------------------------------------------------------------------------- */

function parseInstruction(
  instruction: string,
  resume: ResumeDraft,
): ResumeChange[] {
  const text = instruction.trim();

  const changes: ResumeChange[] = [];

  /*
   * ------------------------------------------------------------------------
   * NAME
   * Examples:
   * Change my name to Kirtesh
   * Change the name to Kirtesh
   * My name should be Kirtesh
   * Rename me to Kirtesh
   * ------------------------------------------------------------------------
   */

  const nameMatch = text.match(
    /(?:change|update|set|replace)\s+(?:my\s+)?name\s+(?:to|as)\s+(.+)$/i,
  );

  const renameMatch = text.match(
    /(?:my\s+name\s+should\s+be|rename\s+me\s+to)\s+(.+)$/i,
  );

  const newName = nameMatch?.[1]?.trim() || renameMatch?.[1]?.trim();

  if (newName) {
    const cleanedName = cleanValue(newName);

    if (cleanedName) {
      changes.push({
        path: "candidate.name",
        before: resume.candidate?.name ?? "",
        after: cleanedName,
        label: "Full name",
      });

      return changes;
    }
  }

  /*
   * ------------------------------------------------------------------------
   * REMOVE FIELDS
   * ------------------------------------------------------------------------
   */

  if (
    /\b(remove|delete|clear|hide)\b.*\b(github|github profile|github link)\b/i.test(
      text,
    )
  ) {
    changes.push({
      path: "candidate.github",
      before: resume.candidate?.github ?? "",
      after: "",
      label: "GitHub",
    });

    return changes;
  }

  if (
    /\b(remove|delete|clear|hide)\b.*\b(linkedin|linkedin profile|linkedin link)\b/i.test(
      text,
    )
  ) {
    changes.push({
      path: "candidate.linkedin",
      before: resume.candidate?.linkedin ?? "",
      after: "",
      label: "LinkedIn",
    });

    return changes;
  }

  if (
    /\b(remove|delete|clear|hide)\b.*\b(phone|phone number|mobile number)\b/i.test(
      text,
    )
  ) {
    changes.push({
      path: "candidate.phone",
      before: resume.candidate?.phone ?? "",
      after: "",
      label: "Phone number",
    });

    return changes;
  }

  if (/\b(remove|delete|clear|hide)\b.*\b(email|email address)\b/i.test(text)) {
    changes.push({
      path: "candidate.email",
      before: resume.candidate?.email ?? "",
      after: "",
      label: "Email",
    });

    return changes;
  }

  if (
    /\b(remove|delete|clear|hide)\b.*\b(portfolio|portfolio link|website)\b/i.test(
      text,
    )
  ) {
    changes.push({
      path: "candidate.portfolio",
      before: resume.candidate?.portfolio ?? "",
      after: "",
      label: "Portfolio",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * SUMMARY
   * ------------------------------------------------------------------------
   */

  const summaryMatch = text.match(
    /(?:change|update|replace|rewrite)\s+(?:my\s+)?(?:professional\s+)?summary\s+(?:to|as)\s+(.+)$/i,
  );

  if (summaryMatch?.[1]) {
    changes.push({
      path: "summary",
      before: resume.summary ?? "",
      after: cleanValue(summaryMatch[1]),
      label: "Professional summary",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * HEADLINE
   * ------------------------------------------------------------------------
   */

  const headlineMatch = text.match(
    /(?:change|update|replace|set)\s+(?:my\s+)?(?:professional\s+)?headline\s+(?:to|as)\s+(.+)$/i,
  );

  if (headlineMatch?.[1]) {
    changes.push({
      path: "candidate.headline",
      before: resume.candidate?.headline ?? "",
      after: cleanValue(headlineMatch[1]),
      label: "Professional headline",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * LOCATION
   * ------------------------------------------------------------------------
   */

  const locationMatch = text.match(
    /(?:change|update|replace|set)\s+(?:my\s+)?location\s+(?:to|as)\s+(.+)$/i,
  );

  if (locationMatch?.[1]) {
    changes.push({
      path: "candidate.location",
      before: resume.candidate?.location ?? "",
      after: cleanValue(locationMatch[1]),
      label: "Location",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * JOB TITLE
   *
   * Examples:
   * Change my job title to Senior Software Engineer
   * Change my role to Product Manager
   * ------------------------------------------------------------------------
   */

  const roleMatch = text.match(
    /(?:change|update|replace)\s+(?:my\s+)?(?:job\s+title|role|position)\s+(?:to|as)\s+(.+)$/i,
  );

  if (roleMatch?.[1]) {
    const role = cleanValue(roleMatch[1]);

    if (resume.experience?.length) {
      changes.push({
        path: "experience[0].role",
        before: resume.experience[0]?.role ?? "",
        after: role,
        label: "Current job title",
      });

      return changes;
    }
  }

  /*
   * ------------------------------------------------------------------------
   * ADD SKILL
   *
   * Examples:
   * Add Next.js to my skills
   * Add React, Next.js and TypeScript to my skills
   * Include Python in my skills
   * ------------------------------------------------------------------------
   */

  const addSkillMatch = text.match(
    /(?:add|include)\s+(.+?)\s+(?:to|in)\s+(?:my\s+)?skills?$/i,
  );

  if (addSkillMatch?.[1]) {
    const skillsToAdd = splitList(addSkillMatch[1]);

    const currentSkills = [...(resume.skills ?? [])];

    const newSkills = [...currentSkills];

    for (const skill of skillsToAdd) {
      const exists = newSkills.some(
        (existing) =>
          existing.trim().toLowerCase() === skill.trim().toLowerCase(),
      );

      if (!exists) {
        newSkills.push(skill);
      }
    }

    changes.push({
      path: "skills",
      before: currentSkills,
      after: newSkills,
      label: "Skills",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * REMOVE SKILL
   *
   * Example:
   * Remove Java from my skills
   * ------------------------------------------------------------------------
   */

  const removeSkillMatch = text.match(
    /(?:remove|delete)\s+(.+?)\s+(?:from)\s+(?:my\s+)?skills?$/i,
  );

  if (removeSkillMatch?.[1]) {
    const skillsToRemove = splitList(removeSkillMatch[1]).map((skill) =>
      skill.toLowerCase(),
    );

    const currentSkills = [...(resume.skills ?? [])];

    const newSkills = currentSkills.filter(
      (skill) => !skillsToRemove.includes(skill.trim().toLowerCase()),
    );

    changes.push({
      path: "skills",
      before: currentSkills,
      after: newSkills,
      label: "Skills",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * ADD ACHIEVEMENT
   * ------------------------------------------------------------------------
   */

  const addAchievementMatch = text.match(
    /(?:add|include)\s+(?:this\s+)?achievement\s*[:\-]?\s*(.+)$/i,
  );

  if (addAchievementMatch?.[1]) {
    const achievement = cleanValue(addAchievementMatch[1]);

    const currentAchievements = [...(resume.achievements ?? [])];

    changes.push({
      path: "achievements",
      before: currentAchievements,
      after: [...currentAchievements, achievement],
      label: "Achievements",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * PROJECT NAME
   * ------------------------------------------------------------------------
   */

  const projectNameMatch = text.match(
    /(?:change|update|rename)\s+(?:my\s+)?(?:project\s+name|project)\s+(?:to|as)\s+(.+)$/i,
  );

  if (projectNameMatch?.[1] && resume.projects?.length) {
    changes.push({
      path: "projects[0].name",
      before: resume.projects[0]?.name ?? "",
      after: cleanValue(projectNameMatch[1]),
      label: "Project name",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * PROJECT DESCRIPTION
   * ------------------------------------------------------------------------
   */

  const projectDescriptionMatch = text.match(
    /(?:change|update|rewrite|replace)\s+(?:my\s+)?project\s+(?:description|details)\s+(?:to|as)\s+(.+)$/i,
  );

  if (projectDescriptionMatch?.[1] && resume.projects?.length) {
    changes.push({
      path: "projects[0].description",
      before: resume.projects[0]?.description ?? "",
      after: cleanValue(projectDescriptionMatch[1]),
      label: "Project description",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * EDUCATION
   * ------------------------------------------------------------------------
   */

  const degreeMatch = text.match(
    /(?:change|update|replace)\s+(?:my\s+)?degree\s+(?:to|as)\s+(.+)$/i,
  );

  if (degreeMatch?.[1] && resume.education?.length) {
    changes.push({
      path: "education[0].degree",
      before: resume.education[0]?.degree ?? "",
      after: cleanValue(degreeMatch[1]),
      label: "Degree",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * CERTIFICATION
   * ------------------------------------------------------------------------
   */

  const certificationMatch = text.match(
    /(?:change|update|replace)\s+(?:my\s+)?certification\s+(?:to|as)\s+(.+)$/i,
  );

  if (certificationMatch?.[1] && resume.certifications?.length) {
    changes.push({
      path: "certifications[0].name",
      before: resume.certifications[0]?.name ?? "",
      after: cleanValue(certificationMatch[1]),
      label: "Certification",
    });

    return changes;
  }

  /*
   * ------------------------------------------------------------------------
   * LANGUAGE
   * ------------------------------------------------------------------------
   */

  const languageMatch = text.match(
    /(?:add|include)\s+(.+?)\s+(?:to|in)\s+(?:my\s+)?languages?$/i,
  );

  if (languageMatch?.[1]) {
    const languages = [...(resume.languages ?? [])];

    const newLanguage = cleanValue(languageMatch[1]);

    const exists = languages.some(
      (language) =>
        language.name?.trim().toLowerCase() === newLanguage.toLowerCase(),
    );

    if (!exists) {
      languages.push({
        name: newLanguage,
        proficiency: "",
      });
    }

    changes.push({
      path: "languages",
      before: resume.languages ?? [],
      after: languages,
      label: "Languages",
    });

    return changes;
  }

  return [];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function cleanValue(value: string) {
  return value
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitList(value: string) {
  return value
    .replace(/\band\b/gi, ",")
    .split(/[,•|\n]+/)
    .map((item) => cleanValue(item))
    .filter(Boolean);
}
