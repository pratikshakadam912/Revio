// Single source of truth for PDF extraction, resume parsing, ATS analysis, and career intelligence.

export type PdfFragment = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  page: number;
};

export type PdfLine = {
  y: number;
  text: string;
  x: number;
  width: number;
};

export type PdfColumn = {
  x: number;
  width: number;
  lines: PdfLine[];
};

export type PdfPageLayout = {
  page: number;
  width: number;
  height: number;
  fragments: PdfFragment[];
  lines: PdfLine[];
  columns: PdfColumn[];
};

export type CandidateInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  headline: string;
};

export type EducationItem = {
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
};

export type ProjectItem = {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
  url: string;
};

export type LanguageItem = {
  name: string;
  proficiency: string;
};

export type ResumeSection = {
  name: string;
  title: string;
  lines: string[];
  content: string;
};

export type SkillCategory = {
  category: string;
  skills: string[];
};

export type ResumeMetadata = {
  pageCount: number;
  wordCount: number;
  characterCount: number;
  extractionQuality: number;
};

export type ResumeData = {
  candidate: CandidateInfo;

  summary: string;

  education: EducationItem[];

  experience: ExperienceItem[];

  projects: ProjectItem[];

  skills: string[];

  skillCategories: SkillCategory[];

  certifications: CertificationItem[];

  languages: LanguageItem[];

  achievements: string[];

  sections: ResumeSection[];

  rawText: string;

  cleanText: string;

  metadata: ResumeMetadata;
};

export type ATSIssueType =
  | "keyword"
  | "formatting"
  | "structure"
  | "readability"
  | "content"
  | "experience"
  | "skills"
  | "education";

export type ATSIssueSeverity = "low" | "medium" | "high";

export type ATSIssue = {
  type: ATSIssueType;
  severity: ATSIssueSeverity;
  message: string;
  recommendation: string;
};

export type ATSAnalysis = {
  score: number;

  keywordOptimization: number;

  sectionStructure: number;

  formatting: number;

  readability: number;

  contentQuality: number;

  experienceQuality: number;

  skillsQuality: number;

  educationQuality: number;

  issues: ATSIssue[];

  missingSections: string[];

  detectedSections: string[];

  keywordStrength: string[];

  weakKeywords: string[];
};

export type RoleMatch = {
  role: string;

  matchScore: number;

  matchedSkills: string[];

  missingSkills: string[];

  reasoning: string;
};

export type SkillGap = {
  skill: string;

  importance: "high" | "medium" | "low";

  reason: string;

  relatedRoles: string[];
};

export type CareerMove = {
  currentLevel: string;

  recommendedRole: string;

  readinessScore: number;

  reason: string;

  nextSkills: string[];

  nextSteps: string[];
};

export type ResumeScores = {
  overall: number;

  ats: number;

  skills: number;

  experience: number;

  education: number;

  projects: number;

  content: number;
};

export type ResumeAnalysisResult = {
  resume: ResumeData;

  ats: ATSAnalysis;

  scores: ResumeScores;

  roles: RoleMatch[];

  skillGaps: SkillGap[];

  careerMove: CareerMove;

  strengths: string[];

  weaknesses: string[];

  suggestions: string[];
};

export type PDFExtractionResult = {
  pages: PdfPageLayout[];

  rawText: string;

  cleanText: string;

  pageCount: number;

  wordCount: number;

  characterCount: number;

  extractionQuality: number;
};
