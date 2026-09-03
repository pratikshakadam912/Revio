import { normalizeText } from "./normalize";
import { parseResume } from "./parser";
import { analyzeATS, calculateATSScore } from "./ats";
import { calculateOverallScore, calculateScores } from "./scoring";
import {
  buildNextCareerMove,
  calculateSkillGaps,
  recommendRoles,
} from "./roles";

import type { AnalysisResult } from "./types";

export { parseResume } from "./parser";
export { extractSkills } from "./skills";
export { analyzeATS, calculateATSScore } from "./ats";

export function analyzeResume(resumeText: string): AnalysisResult {
  const text = normalizeText(resumeText);

  if (!text) {
    throw new Error("Resume text is empty.");
  }

  const parsed = parseResume(text);

  const atsInput = {
    text,
    skills: parsed.skills,
    sections: parsed.sections,
    experienceCount: parsed.experienceDetails.length,
    projectCount: parsed.projects.length,
  };

  const atsAnalysis = analyzeATS(atsInput);

  const atsScore = calculateATSScore(atsInput);

  const scores = calculateScores({
    text,
    skills: parsed.skills,
    experienceCount: parsed.experienceDetails.length,
    projectCount: parsed.projects.length,
    educationText: parsed.education.value,
    atsScore,
  });

  const overallScore = calculateOverallScore(scores);

  const recommendedRoles = recommendRoles(
    text,
    parsed.skills,
    parsed.experienceDetails.length,
  );

  const skillGaps = calculateSkillGaps(parsed.skills, recommendedRoles);

  const nextCareerMove = buildNextCareerMove(recommendedRoles, skillGaps);

  const strengths = buildStrengths({
    skills: parsed.skills,
    experienceCount: parsed.experienceDetails.length,
    projectCount: parsed.projects.length,
    atsScore: scores.atsCompatibility,
    contentScore: scores.contentQuality,
  });

  const weaknesses = buildWeaknesses({
    skills: parsed.skills,
    experienceCount: parsed.experienceDetails.length,
    projectCount: parsed.projects.length,
    atsScore: scores.atsCompatibility,
    contentScore: scores.contentQuality,
    educationScore: scores.educationMatch,
  });

  const suggestions = buildSuggestions({
    skills: parsed.skills,
    weaknesses,
    skillGaps,
    experienceCount: parsed.experienceDetails.length,
    projectCount: parsed.projects.length,
    contentScore: scores.contentQuality,
  });

  return {
    candidate: parsed.candidate,

    overallScore,

    summary: parsed.summary,

    profile: {
      education: parsed.education,

      experience: {
        label: "Experience",
        value: parsed.experienceDetails.length
          ? `${parsed.experienceDetails.length} ${
              parsed.experienceDetails.length === 1
                ? "experience entry"
                : "experience entries"
            } detected`
          : "No professional experience detected",
        detail: parsed.experienceDetails.length
          ? "Professional experience was detected from the resume text."
          : "Consider highlighting internships, academic work, freelance work, or relevant projects if applicable.",
      },

      careerFocus: buildCareerFocus(parsed),
    },

    skills: parsed.skills,

    projects: parsed.projects,

    experienceDetails: parsed.experienceDetails,

    atsAnalysis,

    strengths,

    weaknesses,

    suggestions,

    scores: {
      atsCompatibility: scores.atsCompatibility,

      skillsStrength: scores.skillsStrength,

      experience: scores.experience,

      educationMatch: scores.educationMatch,

      contentQuality: scores.contentQuality,
    },

    recommendedRoles,

    // We do not fabricate live jobs.
    jobs: [],

    skillGaps,

    nextCareerMove,
  };
}

function buildCareerFocus(parsed: ReturnType<typeof parseResume>) {
  const text = [
    parsed.candidate.headline ?? "",
    parsed.skills.join(" "),
    parsed.experienceDetails.map((item) => item.role).join(" "),
    parsed.projects.map((item) => item.name).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (
    /\breact\b|\bnext\.js\b|\bjavascript\b|\btypescript\b|\bnode\.js\b/.test(
      text,
    )
  ) {
    return {
      label: "Career Focus",
      value: "Software / Web Development",
      detail:
        "Based on recurring development skills, experience titles, and project evidence.",
    };
  }

  if (
    /\bpython\b|\bpandas\b|\bnumpy\b|\bmachine learning\b|\bdata analysis\b/.test(
      text,
    )
  ) {
    return {
      label: "Career Focus",
      value: "Data / Machine Learning",
      detail: "Based on recurring data and machine-learning related evidence.",
    };
  }

  if (/\baws\b|\bazure\b|\bdocker\b|\bkubernetes\b|\bci\/cd\b/.test(text)) {
    return {
      label: "Career Focus",
      value: "Cloud / DevOps",
      detail:
        "Based on cloud, infrastructure, container, and deployment signals.",
    };
  }

  return {
    label: "Career Focus",
    value: "General Professional Profile",
    detail:
      "Career direction is inferred from the strongest skills, projects, and experience evidence detected.",
  };
}

type StrengthInput = {
  skills: string[];
  experienceCount: number;
  projectCount: number;
  atsScore: number;
  contentScore: number;
};

function buildStrengths(input: StrengthInput): string[] {
  const strengths: string[] = [];

  if (input.skills.length >= 8) {
    strengths.push(
      `Strong breadth of skills detected (${input.skills.length} recognizable skills).`,
    );
  } else if (input.skills.length >= 4) {
    strengths.push(
      `A useful set of ${input.skills.length} relevant skills was detected.`,
    );
  }

  if (input.experienceCount >= 2) {
    strengths.push(
      "Multiple experience entries provide evidence of professional exposure.",
    );
  } else if (input.experienceCount === 1) {
    strengths.push(
      "Professional experience is clearly represented in the resume.",
    );
  }

  if (input.projectCount >= 2) {
    strengths.push(
      "Multiple projects provide additional evidence of practical application.",
    );
  } else if (input.projectCount === 1) {
    strengths.push(
      "A project was detected that can support practical skills evidence.",
    );
  }

  if (input.atsScore >= 80) {
    strengths.push(
      "The extracted resume structure has strong ATS-friendly signals.",
    );
  }

  if (input.contentScore >= 80) {
    strengths.push(
      "Resume content contains relatively strong evidence of specificity and action-oriented language.",
    );
  }

  if (!strengths.length) {
    strengths.push(
      "The resume contains a foundation of information that can be strengthened with more specific evidence.",
    );
  }

  return strengths.slice(0, 5);
}

type WeaknessInput = {
  skills: string[];
  experienceCount: number;
  projectCount: number;
  atsScore: number;
  contentScore: number;
  educationScore: number;
};

function buildWeaknesses(input: WeaknessInput): string[] {
  const weaknesses: string[] = [];

  if (input.skills.length < 5) {
    weaknesses.push(
      "The resume contains relatively limited recognizable skill evidence.",
    );
  }

  if (input.experienceCount === 0) {
    weaknesses.push("No professional experience entry was detected.");
  }

  if (input.projectCount === 0) {
    weaknesses.push("No project section or project evidence was detected.");
  }

  if (input.atsScore < 70) {
    weaknesses.push(
      "ATS compatibility signals could be improved through clearer section structure and stronger role-relevant terminology.",
    );
  }

  if (input.contentScore < 70) {
    weaknesses.push("Content could be more specific and outcome-oriented.");
  }

  if (input.educationScore < 60) {
    weaknesses.push(
      "Education details are limited in the extracted resume text.",
    );
  }

  if (!weaknesses.length) {
    weaknesses.push(
      "No major structural weakness was detected, although further role-specific optimization could still improve the resume.",
    );
  }

  return weaknesses.slice(0, 5);
}

type SuggestionInput = {
  skills: string[];
  weaknesses: string[];
  skillGaps: AnalysisResult["skillGaps"];
  experienceCount: number;
  projectCount: number;
  contentScore: number;
};

function buildSuggestions(input: SuggestionInput): string[] {
  const suggestions: string[] = [];

  if (input.contentScore < 80) {
    suggestions.push(
      "Rewrite key experience bullets to describe the action taken, the technology or method used, and the resulting outcome.",
    );
  }

  if (input.skills.length < 8) {
    suggestions.push(
      "Add relevant skills that are genuinely supported by your experience, projects, coursework, or certifications.",
    );
  }

  if (input.experienceCount > 0) {
    suggestions.push(
      "Add measurable outcomes to experience bullets wherever the underlying work supports a metric.",
    );
  }

  if (input.projectCount > 0) {
    suggestions.push(
      "Make projects stronger by clearly stating your contribution, technologies used, and measurable impact where available.",
    );
  }

  if (input.skillGaps.length) {
    suggestions.push(
      `Consider building evidence for ${input.skillGaps
        .slice(0, 3)
        .map((gap) => gap.name)
        .join(", ")} if these skills match your target career direction.`,
    );
  }

  suggestions.push(
    "Tailor the resume's strongest keywords and achievements toward the specific role you want next.",
  );

  return Array.from(new Set(suggestions)).slice(0, 6);
}
