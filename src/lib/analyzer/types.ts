export type ResumeFragment = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontName?: string;
  page: number;
};

export type ResumeLine = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  fragments: ResumeFragment[];
};

export type ResumeColumn = {
  x: number;
  width: number;
  lines: ResumeLine[];
};

export type ResumePage = {
  page: number;
  width: number;
  height: number;
  fragments: ResumeFragment[];
  lines: ResumeLine[];
  columns: ResumeColumn[];
};

export type ResumeSectionName =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "languages"
  | "achievements"
  | "unknown";

export type ResumeSection = {
  name: ResumeSectionName;
  heading: string;
  lines: string[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  details?: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  responsibilities: string[];
  achievements: string[];
};

export type ProjectItem = {
  name: string;
  description: string;
  contribution?: string;
  technologies: string[];
  impact?: string;
  github?: string;
  liveDemo?: string;
  startDate?: string;
  endDate?: string;
};

export type CandidateInfo = {
  name?: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type ParsedResume = {
  candidate: CandidateInfo;

  summary: string;

  education: EducationItem[];

  experienceDetails: ExperienceItem[];

  projects: ProjectItem[];

  skills: string[];

  certifications: string[];

  languages: string[];

  sections: ResumeSection[];

  rawText: string;
  cleanText: string;
};

export type ResumeDocument = {
  pages: ResumePage[];
  text: string;
  lines: ResumeLine[];
};
