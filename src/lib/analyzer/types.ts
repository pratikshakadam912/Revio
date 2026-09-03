export type ProfileItemData = {
  label: string;
  value: string;
  detail?: string;
};

export type RoleData = {
  rank?: string;
  role: string;
  match: number;
  description?: string;
  skills?: string[];
};

export type SkillGapData = {
  name: string;
  level: number;
  reason?: string;
};

export type ProjectData = {
  name: string;
  description: string;
  contribution?: string;
  technologies?: string[];
  impact?: string;
};

export type CandidateData = {
  name?: string;
  headline?: string;
  location?: string;
};

export type ExperienceData = {
  company: string;
  role: string;
  duration: string;
  description: string;
  responsibilities?: string[];
  achievements?: string[];
};

export type AnalysisResult = {
  candidate?: CandidateData;

  overallScore: number;

  summary?: string;

  profile?: {
    education?: ProfileItemData;
    experience?: ProfileItemData;
    careerFocus?: ProfileItemData;
  };

  skills: string[];

  projects: ProjectData[];

  experienceDetails: ExperienceData[];

  atsAnalysis: {
    keywordOptimization: string;
    formatting: string;
    sectionStructure: string;
    readability: string;
    issues: string[];
  };

  strengths: string[];

  weaknesses: string[];

  suggestions: string[];

  scores: {
    atsCompatibility: number;
    skillsStrength: number;
    experience: number;
    educationMatch: number;
    contentQuality: number;
  };

  recommendedRoles: RoleData[];

  jobs: {
    role: string;
    company: string;
    location: string;
    match: number;
  }[];

  skillGaps: SkillGapData[];

  nextCareerMove: {
    title: string;
    description: string;
  };

  aiCredits?: {
    used: number;
    total: number;
  };
};
