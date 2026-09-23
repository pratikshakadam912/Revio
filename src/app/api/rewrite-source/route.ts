import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Candidate = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  headline: string;
};

type Experience = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
};

type Education = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Project = {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
};

type Certification = {
  name: string;
  issuer: string;
  date: string;
  url: string;
};

type Language = {
  name: string;
  proficiency: string;
};

type RewriteResume = {
  candidate: Candidate;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  achievements: string[];
};

const emptyResume: RewriteResume = {
  candidate: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    headline: "",
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
};

export async function GET(req: NextRequest) {
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

    const resumeId = req.nextUrl.searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume ID is required.",
        },
        { status: 400 },
      );
    }

    /*
     * IMPORTANT:
     *
     * We ONLY read the Resume table here.
     *
     * We DO NOT read:
     * - ResumeAnalysis
     * - rawResult
     * - ATS score
     * - detected skills
     * - recommendations
     */

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
      },
    });

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume not found.",
        },
        { status: 404 },
      );
    }

    if (!resume.fileUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "The original resume file is not available.",
        },
        { status: 404 },
      );
    }

    const response = await fetch(resume.fileUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Unable to retrieve the original resume file (${response.status}).`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    /*
     * The rewrite source is extracted directly from the ORIGINAL uploaded
     * file.
     *
     * This has nothing to do with the ATS analysis.
     */

    const firstBytes = buffer.subarray(0, 4).toString("utf8");

    if (firstBytes !== "%PDF") {
      return NextResponse.json(
        {
          success: false,
          error:
            "The current Rewrite Studio supports PDF resumes. Your original file was not detected as a PDF.",
        },
        { status: 400 },
      );
    }

    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    const extracted = await extractText(pdf, {
      mergePages: true,
    });

    const rawText = typeof extracted.text === "string" ? extracted.text : "";

    if (!rawText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "We could not read text from the original resume. Please upload a text-based PDF.",
        },
        { status: 422 },
      );
    }

    const rewriteResume = parseOriginalResume(rawText);

    return NextResponse.json({
      success: true,

      source: {
        id: resume.id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        fileType: resume.fileType,
        fileSize: resume.fileSize,
      },

      /*
       * This is specifically the rewrite source.
       * It is NOT ResumeAnalysis.
       */
      resume: rewriteResume,

      rawText,
    });
  } catch (error) {
    console.error("=================================");
    console.error("REVIO REWRITE SOURCE ERROR");
    console.error("=================================");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the original resume.",
      },
      { status: 500 },
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Original resume parser                                                     */
/* -------------------------------------------------------------------------- */

function parseOriginalResume(text: string): RewriteResume {
  const lines = text
    .split(/\r?\n/)
    .map((line) => cleanLine(line))
    .filter(Boolean);

  if (!lines.length) {
    return emptyResume;
  }

  const resume: RewriteResume = {
    ...emptyResume,
    candidate: {
      ...emptyResume.candidate,
    },
  };

  resume.candidate.name = findName(lines);
  resume.candidate.email = findEmail(text);
  resume.candidate.phone = findPhone(text);
  resume.candidate.linkedin = findUrl(text, /linkedin\.com\/[^\s)]+/i);
  resume.candidate.github = findUrl(text, /github\.com\/[^\s)]+/i);
  resume.candidate.portfolio = findPortfolio(text);

  const sections = splitSections(lines);

  resume.summary = findSection(sections, [
    "summary",
    "professional summary",
    "profile",
    "professional profile",
    "objective",
    "career objective",
  ]);

  resume.skills = parseSkills(
    findSection(sections, [
      "skills",
      "technical skills",
      "core skills",
      "technologies",
      "technical expertise",
    ]),
  );

  resume.experience = parseExperience(
    findSectionLines(sections, [
      "experience",
      "work experience",
      "professional experience",
      "employment",
      "employment history",
    ]),
  );

  resume.education = parseEducation(
    findSectionLines(sections, [
      "education",
      "academic background",
      "academic qualifications",
    ]),
  );

  resume.projects = parseProjects(
    findSectionLines(sections, [
      "projects",
      "personal projects",
      "academic projects",
      "project experience",
    ]),
  );

  resume.certifications = parseCertifications(
    findSectionLines(sections, [
      "certifications",
      "certificates",
      "professional certifications",
    ]),
  );

  resume.languages = parseLanguages(
    findSectionLines(sections, ["languages", "language", "languages known"]),
  );

  resume.achievements = parseSimpleList(
    findSectionLines(sections, ["achievements", "accomplishments", "awards"]),
  );

  resume.candidate.headline = findHeadline(
    lines,
    resume.candidate.name,
    resume.candidate.email,
  );

  resume.candidate.location = findLocation(lines);

  return resume;
}

/* -------------------------------------------------------------------------- */
/* Section handling                                                           */
/* -------------------------------------------------------------------------- */

const SECTION_NAMES = [
  "summary",
  "professional summary",
  "profile",
  "professional profile",
  "objective",
  "career objective",

  "experience",
  "work experience",
  "professional experience",
  "employment",
  "employment history",

  "education",
  "academic background",
  "academic qualifications",

  "skills",
  "technical skills",
  "core skills",
  "technologies",
  "technical expertise",

  "projects",
  "personal projects",
  "academic projects",
  "project experience",

  "certifications",
  "certificates",
  "professional certifications",

  "languages",
  "language",
  "languages known",

  "achievements",
  "accomplishments",
  "awards",
];

function normalizeHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSectionHeading(line: string) {
  const normalized = normalizeHeading(line);

  return SECTION_NAMES.includes(normalized);
}

function splitSections(lines: string[]) {
  const sections: Record<string, string[]> = {};
  let current = "__top__";

  sections[current] = [];

  for (const line of lines) {
    if (isSectionHeading(line)) {
      current = normalizeHeading(line);
      sections[current] ??= [];
      continue;
    }

    sections[current] ??= [];
    sections[current].push(line);
  }

  return sections;
}

function findSection(sections: Record<string, string[]>, names: string[]) {
  for (const name of names) {
    const value = sections[normalizeHeading(name)];

    if (value?.length) {
      return value.join(" ").trim();
    }
  }

  return "";
}

function findSectionLines(sections: Record<string, string[]>, names: string[]) {
  for (const name of names) {
    const value = sections[normalizeHeading(name)];

    if (value?.length) {
      return value;
    }
  }

  return [];
}

/* -------------------------------------------------------------------------- */
/* Candidate                                                                  */
/* -------------------------------------------------------------------------- */

function findName(lines: string[]) {
  for (const line of lines.slice(0, 8)) {
    if (
      line.includes("@") ||
      /\d{5,}/.test(line) ||
      /linkedin|github|http|www\./i.test(line)
    ) {
      continue;
    }

    if (
      line.length >= 3 &&
      line.length <= 70 &&
      /^[A-Za-z][A-Za-z .'-]+$/.test(line)
    ) {
      return line;
    }
  }

  return "";
}

function findEmail(text: string) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  return match?.[0] ?? "";
}

function findPhone(text: string) {
  const match = text.match(
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/,
  );

  return match?.[0] ?? "";
}

function findUrl(text: string, pattern: RegExp) {
  const match = text.match(pattern);

  if (!match?.[0]) {
    return "";
  }

  return match[0].replace(/[),.;]+$/, "").trim();
}

function findPortfolio(text: string) {
  const matches = text.match(
    /(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.(?:dev|me|io|com|in|co|net)(?:\/[^\s)]*)?/gi,
  );

  if (!matches) {
    return "";
  }

  for (const value of matches) {
    if (/linkedin\.com|github\.com/i.test(value)) {
      continue;
    }

    return value.replace(/[),.;]+$/, "");
  }

  return "";
}

function findLocation(lines: string[]) {
  for (const line of lines.slice(0, 12)) {
    if (
      /^(bangalore|bengaluru|mumbai|delhi|new delhi|hyderabad|chennai|pune|kolkata|noida|gurgaon|gurugram)$/i.test(
        line,
      )
    ) {
      return line;
    }

    if (/^[A-Za-z .'-]+,\s*[A-Za-z .'-]+$/.test(line) && !line.includes("@")) {
      return line;
    }
  }

  return "";
}

function findHeadline(lines: string[], name: string, email: string) {
  const nameIndex = name ? lines.indexOf(name) : -1;

  const start = nameIndex >= 0 ? nameIndex + 1 : 0;

  for (const line of lines.slice(start, start + 5)) {
    if (
      !line ||
      line === email ||
      /@/.test(line) ||
      /linkedin|github|http|www\./i.test(line)
    ) {
      continue;
    }

    if (line.length >= 4 && line.length <= 100 && !isSectionHeading(line)) {
      return line;
    }
  }

  return "";
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                     */
/* -------------------------------------------------------------------------- */

function parseSkills(value: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,•|;]+/)
    .map(cleanLine)
    .filter(Boolean)
    .filter((value) => value.length <= 60);
}

/* -------------------------------------------------------------------------- */
/* Experience                                                                 */
/* -------------------------------------------------------------------------- */

function parseExperience(lines: string[]): Experience[] {
  if (!lines.length) {
    return [];
  }

  const result: Experience[] = [];

  let current: Experience | null = null;

  for (const line of lines) {
    if (looksLikeDateLine(line) || looksLikeJobHeading(line)) {
      if (current) {
        result.push(current);
      }

      current = {
        company: "",
        role: line,
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        achievements: [],
        technologies: [],
      };

      const dates = extractDates(line);

      current.startDate = dates.start;
      current.endDate = dates.end;

      continue;
    }

    if (!current) {
      current = {
        company: line,
        role: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        achievements: [],
        technologies: [],
      };

      continue;
    }

    if (looksLikeBullet(line)) {
      current.achievements.push(stripBullet(line));
    } else if (!current.company) {
      current.company = line;
    } else if (!current.description) {
      current.description = line;
    } else {
      current.description = `${current.description} ${line}`.trim();
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
}

function looksLikeJobHeading(line: string) {
  return (
    /\b(engineer|developer|designer|manager|analyst|intern|consultant|lead|architect|specialist|administrator|director)\b/i.test(
      line,
    ) && line.length <= 120
  );
}

function looksLikeDateLine(line: string) {
  return (
    /\b(19|20)\d{2}\b/.test(line) && /[-–—]|to|present|current/i.test(line)
  );
}

function extractDates(line: string) {
  const matches = line.match(
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\.?\s*(?:19|20)\d{2}\b/gi,
  );

  return {
    start: matches?.[0] ?? "",
    end: matches?.[1] ?? "",
  };
}

/* -------------------------------------------------------------------------- */
/* Education                                                                  */
/* -------------------------------------------------------------------------- */

function parseEducation(lines: string[]): Education[] {
  if (!lines.length) {
    return [];
  }

  const result: Education[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (!line) continue;

    const next = lines[index + 1] ?? "";

    const dates = extractDates(line);

    result.push({
      degree: line,
      field: "",
      institution: next,
      location: "",
      startDate: dates.start,
      endDate: dates.end,
      description: "",
    });

    index += 1;
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

function parseProjects(lines: string[]): Project[] {
  if (!lines.length) {
    return [];
  }

  const result: Project[] = [];

  let current: Project | null = null;

  for (const line of lines) {
    if (!current) {
      current = {
        name: line,
        description: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
      };

      continue;
    }

    if (looksLikeBullet(line)) {
      const value = stripBullet(line);

      if (!current.description) {
        current.description = value;
      } else {
        current.description += ` ${value}`;
      }

      continue;
    }

    if (!current.description) {
      current.description = line;
    } else {
      result.push(current);

      current = {
        name: line,
        description: "",
        technologies: [],
        url: "",
        startDate: "",
        endDate: "",
      };
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
}

/* -------------------------------------------------------------------------- */
/* Certifications                                                             */
/* -------------------------------------------------------------------------- */

function parseCertifications(lines: string[]): Certification[] {
  return lines.filter(Boolean).map((line) => ({
    name: line,
    issuer: "",
    date: "",
    url: "",
  }));
}

/* -------------------------------------------------------------------------- */
/* Languages                                                                  */
/* -------------------------------------------------------------------------- */

function parseLanguages(lines: string[]): Language[] {
  return lines.filter(Boolean).map((line) => {
    const parts = line.split(/[-:|]/);

    return {
      name: cleanLine(parts[0] ?? ""),
      proficiency: cleanLine(parts.slice(1).join(" ")),
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Simple lists                                                               */
/* -------------------------------------------------------------------------- */

function parseSimpleList(lines: string[]) {
  return lines.map(stripBullet).map(cleanLine).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function looksLikeBullet(line: string) {
  return /^[-•*▪◦●]\s*/.test(line);
}

function stripBullet(line: string) {
  return line.replace(/^[-•*▪◦●]\s*/, "").trim();
}

function cleanLine(line: string) {
  return line
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
