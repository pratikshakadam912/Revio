"use client";

import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Code2,
  ExternalLink,
  FileSearch,
  FileText,
  Lightbulb,
  Loader2,
  MapPin,
  Menu,
  MessageSquareText,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

type CandidateData = {
  name?: string;
  headline?: string;
  location?: string;
};

type ProfileItemData = {
  label: string;
  value: string;
  detail?: string;
};

type ProjectData = {
  name: string;
  description?: string;
  contribution?: string;
  technologies?: string[];
  impact?: string;
  url?: string;
  isLive?: boolean;
};

type ExperienceData = {
  company: string;
  role: string;
  duration?: string;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
};

type ATSAnalysisData = {
  keywordOptimization?: string;
  formatting?: string;
  sectionStructure?: string;
  readability?: string;
  issues?: string[];
};

type RoleData = {
  rank?: string;
  role: string;
  match: number;
  description?: string;
  skills?: string[];
};

type JobData = {
  title?: string;
  company?: string;
  location?: string;
  match?: number;
  type?: string;
};

type SkillGapData = {
  name: string;
  level: number;
  reason?: string;
};

type AnalysisResult = {
  id?: string;
  candidate?: CandidateData;
  overallScore: number;
  summary?: string;
  profile?: {
    education?: ProfileItemData;
    experience?: ProfileItemData;
    careerFocus?: ProfileItemData;
  };
  skills?: string[];
  projects?: ProjectData[];
  experienceDetails?: ExperienceData[];
  atsAnalysis?: ATSAnalysisData;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  scores?: {
    atsCompatibility?: number;
    skillsStrength?: number;
    experience?: number;
    educationMatch?: number;
    contentQuality?: number;
  };
  recommendedRoles?: RoleData[];
  jobs?: JobData[];
  skillGaps?: SkillGapData[];
  nextCareerMove?: {
    title?: string;
    description?: string;
  };
  aiCredits?: {
    used?: number;
    total?: number;
  };
};

/* Helpers */

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return "";
}

function toSafeNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function looksLikeLocationValue(
  value: unknown,
  candidateLocation?: unknown,
): boolean {
  const normalizedValue = toStringValue(value).toLowerCase().trim();

  if (!normalizedValue) return false;

  const normalizedCandidateLocation = toStringValue(candidateLocation)
    .toLowerCase()
    .trim();

  if (
    normalizedCandidateLocation &&
    normalizedValue === normalizedCandidateLocation
  ) {
    return true;
  }

  const commonLocations = [
    "bangalore",
    "bengaluru",
    "mumbai",
    "delhi",
    "new delhi",
    "hyderabad",
    "chennai",
    "pune",
    "kolkata",
    "noida",
    "gurgaon",
    "gurugram",
    "indore",
    "jaipur",
    "ahmedabad",
    "chandigarh",
    "kochi",
    "kerala",
    "india",
    "usa",
    "united states",
    "uk",
    "united kingdom",
    "canada",
    "australia",
    "singapore",
    "uae",
  ];

  if (commonLocations.includes(normalizedValue)) return true;

  return /^(?:[a-z .'-]+,\s*){1,3}(?:india|usa|uk|canada|australia|uae|singapore)$/i.test(
    normalizedValue,
  );
}

function getCareerFocus(
  headline: unknown,
  candidateLocation: unknown,
  roles: any[],
  experience: any[],
): string {
  const headlineValue = toStringValue(headline);

  if (
    headlineValue &&
    !looksLikeLocationValue(headlineValue, candidateLocation)
  ) {
    return headlineValue;
  }

  const recommendedRole = roles.find((role) => {
    const value = toStringValue(role?.role);
    return value && !looksLikeLocationValue(value, candidateLocation);
  });

  if (recommendedRole) return toStringValue(recommendedRole.role);

  const experienceRole = experience.find((item) => {
    const value = toStringValue(item?.role);
    return value && !looksLikeLocationValue(value, candidateLocation);
  });

  if (experienceRole) return toStringValue(experienceRole.role);

  return "Not identified";
}

function getProjectStatus(project: ProjectData): {
  label: string;
  isLive: boolean;
  isRepository: boolean;
} {
  const url = toStringValue(project.url);

  if (!url) {
    return {
      label: "No live demo",
      isLive: false,
      isRepository: false,
    };
  }

  const isRepository = /github\.com/i.test(url);

  return {
    label: isRepository ? "Repository" : "Live",
    isLive: !isRepository,
    isRepository,
  };
}

/* Normalize API response */

function normalizeAnalysisResult(apiResult: any): AnalysisResult {
  const resume = apiResult?.resume ?? {};
  const candidate = resume?.candidate ?? {};
  const scores = apiResult?.scores ?? {};
  const ats = apiResult?.ats ?? {};

  const education = Array.isArray(resume?.education) ? resume.education : [];

  const experience = Array.isArray(resume?.experience) ? resume.experience : [];

  const projects = Array.isArray(resume?.projects) ? resume.projects : [];

  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const roles = Array.isArray(apiResult?.roles) ? apiResult.roles : [];

  const skillGaps = Array.isArray(apiResult?.skillGaps)
    ? apiResult.skillGaps
    : [];

  const overallScore = toSafeNumber(scores?.overall);
  const candidateLocation = toStringValue(candidate?.location);

  const careerFocus = getCareerFocus(
    candidate?.headline,
    candidateLocation,
    roles,
    experience,
  );

  const normalizedExperience = experience.map(
    (item: any): ExperienceData => ({
      company: toStringValue(item?.company) || "Company not identified",
      role: toStringValue(item?.role) || "Role not identified",
      duration: [toStringValue(item?.startDate), toStringValue(item?.endDate)]
        .filter(Boolean)
        .join(" — "),
      description: toStringValue(item?.description),
      responsibilities: Array.isArray(item?.responsibilities)
        ? item.responsibilities
            .map((itemValue: unknown) => toStringValue(itemValue))
            .filter(Boolean)
        : [],
      achievements: Array.isArray(item?.achievements)
        ? item.achievements
            .map((itemValue: unknown) => toStringValue(itemValue))
            .filter(Boolean)
        : [],
    }),
  );

  const normalizedProjects = projects.map((project: any): ProjectData => {
    const projectUrl = toStringValue(project?.url);

    return {
      name: toStringValue(project?.name) || "Untitled Project",
      description: toStringValue(project?.description),
      contribution: toStringValue(project?.description),
      technologies: Array.isArray(project?.technologies)
        ? project.technologies
            .map((technology: unknown) => toStringValue(technology))
            .filter(Boolean)
        : [],
      impact: "",
      url: projectUrl,
      isLive: Boolean(projectUrl) && !/github\.com/i.test(projectUrl),
    };
  });

  return {
    id: typeof apiResult?.id === "string" ? apiResult.id : undefined,
    candidate: {
      name: toStringValue(candidate?.name),
      headline: toStringValue(candidate?.headline),
      location: candidateLocation,
    },
    overallScore,
    summary: toStringValue(resume?.summary),
    profile: {
      education: {
        label: "Education",
        value:
          toStringValue(education[0]?.degree) ||
          toStringValue(education[0]?.field) ||
          "Not identified",
        detail: toStringValue(education[0]?.institution),
      },
      experience: {
        label: "Experience",
        value:
          normalizedExperience.length > 0
            ? `${normalizedExperience.length} ${
                normalizedExperience.length === 1 ? "role" : "roles"
              }`
            : "Not identified",
        detail: normalizedExperience[0]?.role || "",
      },
      careerFocus: {
        label: "Career Focus",
        value: careerFocus,
        detail:
          toStringValue(roles[0]?.reasoning) ||
          toStringValue(roles[0]?.description),
      },
    },
    skills: skills
      .map((skill: unknown) => toStringValue(skill))
      .filter(Boolean),
    projects: normalizedProjects,
    experienceDetails: normalizedExperience,
    atsAnalysis: {
      keywordOptimization:
        typeof ats?.keywordOptimization === "number"
          ? `${ats.keywordOptimization}/100`
          : "",
      formatting:
        typeof ats?.formatting === "number" ? `${ats.formatting}/100` : "",
      sectionStructure:
        typeof ats?.sectionStructure === "number"
          ? `${ats.sectionStructure}/100`
          : "",
      readability:
        typeof ats?.readability === "number" ? `${ats.readability}/100` : "",
      issues: Array.isArray(ats?.issues)
        ? ats.issues
            .map((issue: any) =>
              typeof issue === "string" ? issue : toStringValue(issue?.message),
            )
            .filter(Boolean)
        : [],
    },
    strengths: Array.isArray(apiResult?.strengths)
      ? apiResult.strengths
          .map((item: unknown) => toStringValue(item))
          .filter(Boolean)
      : [],
    weaknesses: Array.isArray(apiResult?.weaknesses)
      ? apiResult.weaknesses
          .map((item: unknown) => toStringValue(item))
          .filter(Boolean)
      : [],
    suggestions: Array.isArray(apiResult?.suggestions)
      ? apiResult.suggestions
          .map((item: unknown) => toStringValue(item))
          .filter(Boolean)
      : [],
    scores: {
      atsCompatibility: toSafeNumber(scores?.ats),
      skillsStrength: toSafeNumber(scores?.skills),
      experience: toSafeNumber(scores?.experience),
      educationMatch: toSafeNumber(scores?.education),
      contentQuality: toSafeNumber(scores?.content),
    },
    recommendedRoles: roles.map(
      (role: any, index: number): RoleData => ({
        rank: toStringValue(role?.rank) || `#${index + 1}`,
        role: toStringValue(role?.role) || "Recommended Role",
        match: toSafeNumber(role?.matchScore ?? role?.match),
        description:
          toStringValue(role?.reasoning) || toStringValue(role?.description),
        skills: Array.isArray(role?.matchedSkills)
          ? role.matchedSkills
              .map((skill: unknown) => toStringValue(skill))
              .filter(Boolean)
          : Array.isArray(role?.skills)
            ? role.skills
                .map((skill: unknown) => toStringValue(skill))
                .filter(Boolean)
            : [],
      }),
    ),
    jobs: [],
    skillGaps: skillGaps.map(
      (gap: any): SkillGapData => ({
        name: toStringValue(gap?.name) || toStringValue(gap?.skill) || "Skill",
        level: toSafeNumber(gap?.level),
        reason: toStringValue(gap?.reason),
      }),
    ),
    nextCareerMove: apiResult?.careerMove
      ? {
          title:
            toStringValue(apiResult?.careerMove?.title) ||
            "Your next career move",
          description: toStringValue(apiResult?.careerMove?.description),
        }
      : undefined,
  };
}

/* UI components */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCE7DF] bg-[#EAF1EB]">
        <Icon className="h-5 w-5 text-[#315E50]" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#263B33]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[#777D76]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const safeValue = Math.max(0, Math.min(100, toSafeNumber(value)));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#777D76]">{label}</span>
        <span className="font-semibold text-[#263B33]">
          {Math.round(safeValue)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#EAE9E1]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#315E50] via-[#719681] to-[#D9C5A2] transition-all duration-700"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectData }) {
  const status = getProjectStatus(project);

  return (
    <div className="rounded-2xl border border-[#E7E5DC] bg-white/65 p-5 shadow-[0_8px_24px_rgba(38,59,51,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#C9D9CE] hover:shadow-[0_12px_28px_rgba(38,59,51,0.08)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[#263B33]">{project.name}</h3>

          {project.description ? (
            <p className="mt-2 text-sm leading-6 text-[#777D76]">
              {project.description}
            </p>
          ) : null}
        </div>

        <div
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
            status.isLive
              ? "border-[#C9DED0] bg-[#EDF5EF] text-[#315E50]"
              : status.isRepository
                ? "border-[#DADFEA] bg-[#F0F2F7] text-[#596783]"
                : "border-[#E7E5DC] bg-[#F5F4EF] text-[#858A83]"
          }`}
        >
          {status.isLive ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : status.isRepository ? (
            <Code2 className="h-3.5 w-3.5" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5" />
          )}

          {status.label}
        </div>
      </div>

      {project.technologies && project.technologies.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((technology, index) => (
            <span
              key={`${technology}-${index}`}
              className="rounded-lg border border-[#E7E5DC] bg-[#F7F5EF] px-2.5 py-1 text-xs text-[#59645D]"
            >
              {technology}
            </span>
          ))}
        </div>
      ) : null}

      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#315E50] transition hover:text-[#719681]"
        >
          {status.isLive ? "Open live project" : "View project repository"}
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

/* Main page */

export default function AnalyzerPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  async function analyzeFile(file: File) {
    setError("");
    setResult(null);
    setIsAnalyzing(true);
    setUploadProgress(10);

    try {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        throw new Error("Please upload a PDF resume.");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Resume must be smaller than 10MB.");
      }

      const formData = new FormData();
      formData.append("file", file);

      setUploadProgress(25);

      const uploadResponse = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      let uploadData: any = null;

      try {
        uploadData = await uploadResponse.json();
      } catch {
        uploadData = null;
      }

      if (!uploadResponse.ok) {
        throw new Error(uploadData?.error || "Unable to upload the resume.");
      }

      const resumeId =
        uploadData?.resume?.id ?? uploadData?.resumeId ?? uploadData?.id;

      if (typeof resumeId !== "string") {
        throw new Error("Resume was uploaded, but no resume ID was returned.");
      }

      setUploadProgress(50);

      const analysisResponse = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeId }),
      });

      let analysisData: any = null;

      try {
        analysisData = await analysisResponse.json();
      } catch {
        analysisData = null;
      }

      if (!analysisResponse.ok) {
        throw new Error(
          analysisData?.error ||
            analysisData?.details ||
            "Unable to analyze the resume.",
        );
      }

      if (analysisData?.success === false) {
        throw new Error(analysisData?.error || "Unable to analyze the resume.");
      }

      setUploadProgress(80);

      const apiResult =
        analysisData?.result ?? analysisData?.analysis ?? analysisData;

      if (!apiResult) {
        throw new Error("The analysis response was empty.");
      }

      const normalized = normalizeAnalysisResult(apiResult);

      setResult(normalized);
      setUploadProgress(100);
    } catch (analysisError) {
      console.error("Resume analysis error:", analysisError);

      const message =
        analysisError instanceof Error
          ? analysisError.message
          : "Unable to analyze the resume.";

      setError(message);
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) void analyzeFile(file);

    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) void analyzeFile(file);
  }

  function handleNewAnalysis() {
    setError("");
    setResult(null);
    setUploadProgress(0);
    setDragActive(false);
  }

  const candidateHeadline =
    result?.candidate?.headline &&
    !looksLikeLocationValue(
      result.candidate.headline,
      result.candidate.location,
    )
      ? result.candidate.headline
      : "";

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/resume", label: "My Resume", icon: FileText },
    { href: "/templates", label: "Templates", icon: FileSearch },
    { href: "/analyzer", label: "Resume Analyzer", icon: Target },
    { href: "/ai", label: "AI Career Coach", icon: MessageSquareText },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#263B33]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#719681]/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-[#D9C5A2]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#B97862]/10 blur-3xl" />
      </div>

      {/* Mobile header */}

      <div className="sticky top-0 z-40 border-b border-[#E7E5DC] bg-[#F7F5EF]/90 shadow-[0_4px_20px_rgba(38,59,51,0.04)] backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#315E50] to-[#719681] text-white shadow-md shadow-[#315E50]/15">
              <Zap className="h-5 w-5" />
            </div>

            <span className="text-lg font-black tracking-tight text-[#263B33]">
              Revio
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="rounded-lg border border-[#E7E5DC] bg-white/70 p-2 text-[#59645D] transition hover:bg-white"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav className="border-t border-[#E7E5DC] bg-[#F7F5EF]/95 px-4 py-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  href === "/analyzer"
                    ? "bg-[#EAF1EB] font-semibold text-[#315E50]"
                    : "text-[#59645D] hover:bg-white/70"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        ) : null}
      </div>

      <div className="relative flex min-h-screen">
        {/* Sidebar */}

        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#E7E5DC] bg-[#F4F2EB]/90 shadow-[4px_0_24px_rgba(38,59,51,0.03)] backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex h-20 items-center border-b border-[#E7E5DC] px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#315E50] to-[#719681] text-white shadow-lg shadow-[#315E50]/15">
                <Zap className="h-5 w-5" />
              </div>

              <span className="text-xl font-black tracking-tight text-[#263B33]">
                Revio
              </span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  href === "/analyzer"
                    ? "border border-[#DCE7DF] bg-gradient-to-r from-[#EAF1EB] to-white/80 font-semibold text-[#315E50] shadow-sm"
                    : "text-[#777D76] hover:bg-white/70 hover:text-[#315E50]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[#E7E5DC] p-4">
            <div className="rounded-2xl border border-white/90 bg-white/65 p-4 shadow-[0_8px_24px_rgba(38,59,51,0.04)]">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#315E50]" />
                <span className="text-xs font-semibold text-[#263B33]">
                  Resume analysis
                </span>
              </div>

              <p className="text-xs leading-5 text-[#858A83]">
                Your resume is processed through the Revio analysis pipeline.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}

        <main className="w-full lg:ml-64">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}

            <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-[#858A83]">
                  <Link
                    href="/dashboard"
                    className="transition hover:text-[#315E50]"
                  >
                    Dashboard
                  </Link>

                  <ChevronRight className="h-3.5 w-3.5" />

                  <span className="font-medium text-[#59645D]">
                    Resume Analyzer
                  </span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#263B33] sm:text-4xl">
                  Resume Analyzer
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777D76]">
                  Get a complete breakdown of your resume, ATS compatibility,
                  skills, projects, experience, and next career move.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {result ? (
                  <button
                    type="button"
                    onClick={handleNewAnalysis}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E2E3D9] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#59645D] shadow-sm transition hover:border-[#C9D9CE] hover:bg-white hover:text-[#315E50]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    New Analysis
                  </button>
                ) : null}
              </div>
            </div>

            {/* Error */}

            {error ? (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#E9C9C0] bg-[#FBF0ED] p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B97862]" />

                <div>
                  <p className="font-semibold text-[#8E5142]">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-[#9A6558]">
                    {error}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Upload */}

            {!result ? (
              <div className="mx-auto max-w-4xl">
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-[0_16px_48px_rgba(38,59,51,0.05)] backdrop-blur-xl transition duration-300 sm:p-12 ${
                    dragActive
                      ? "border-[#719681] bg-[#EAF1EB]"
                      : "border-white/90 bg-white/65"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#719681]/[0.07] via-transparent to-[#D9C5A2]/[0.13]" />

                  <div className="relative">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DCE7DF] bg-[#EAF1EB] shadow-sm">
                      {isAnalyzing ? (
                        <Loader2 className="h-7 w-7 animate-spin text-[#315E50]" />
                      ) : (
                        <Upload className="h-7 w-7 text-[#315E50]" />
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-[#263B33]">
                      {isAnalyzing
                        ? "Analyzing your resume..."
                        : "Upload your resume"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#777D76]">
                      Upload your PDF resume and Revio will analyze its
                      structure, ATS compatibility, skills, experience,
                      projects, and career opportunities.
                    </p>

                    {!isAnalyzing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#315E50] to-[#527B68] px-6 py-3 font-bold text-white shadow-lg shadow-[#315E50]/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#315E50]/20"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Resume
                        </button>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <p className="mt-4 text-xs text-[#858A83]">
                          PDF only • Maximum 10MB
                        </p>
                      </>
                    ) : (
                      <div className="mx-auto mt-8 max-w-md">
                        <div className="mb-2 flex justify-between text-xs text-[#858A83]">
                          <span>Processing</span>
                          <span className="font-semibold text-[#315E50]">
                            {uploadProgress}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#EAE9E1]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#315E50] via-[#719681] to-[#D9C5A2] transition-all duration-500"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Search,
                      title: "ATS Analysis",
                      text: "Check compatibility and resume structure.",
                    },
                    {
                      icon: Activity,
                      title: "Skill Analysis",
                      text: "Identify strengths and missing skills.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Career Direction",
                      text: "Find roles that fit your profile.",
                    },
                  ].map(({ icon: Icon, title, text }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/90 bg-white/60 p-5 shadow-[0_8px_24px_rgba(38,59,51,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(38,59,51,0.07)]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF1EB]">
                        <Icon className="h-5 w-5 text-[#315E50]" />
                      </div>

                      <h3 className="mt-4 text-sm font-bold text-[#263B33]">
                        {title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#858A83]">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Results */

              <div className="space-y-6">
                {/* Candidate profile */}

                <section className="overflow-hidden rounded-3xl border border-white/90 bg-white/65 shadow-[0_12px_36px_rgba(38,59,51,0.05)] backdrop-blur-xl">
                  <div className="border-b border-[#E7E5DC] p-6 sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#DCE7DF] bg-gradient-to-br from-[#EAF1EB] to-[#F4EFE4] text-[#315E50]">
                          <CircleUserRound className="h-8 w-8" />
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#719681]">
                            Candidate Profile
                          </p>

                          <h2 className="mt-1 text-2xl font-black text-[#263B33]">
                            {result.candidate?.name || "Candidate"}
                          </h2>

                          {candidateHeadline ? (
                            <p className="mt-1 text-sm text-[#777D76]">
                              {candidateHeadline}
                            </p>
                          ) : null}

                          {result.candidate?.location ? (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#858A83]">
                              <MapPin className="h-3.5 w-3.5" />
                              {result.candidate.location}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#DCE7DF] bg-gradient-to-br from-[#EAF1EB] to-white px-6 py-4 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#777D76]">
                          Overall Score
                        </p>

                        <p className="mt-1 text-4xl font-black text-[#315E50]">
                          {Math.round(result.overallScore)}
                        </p>

                        <p className="text-xs text-[#858A83]">/ 100</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-px bg-[#E7E5DC] sm:grid-cols-3">
                    {[
                      result.profile?.education,
                      result.profile?.experience,
                      result.profile?.careerFocus,
                    ].map((item, index) => (
                      <div
                        key={`${item?.label}-${index}`}
                        className="bg-white/75 p-6"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#858A83]">
                          {item?.label}
                        </p>

                        <p className="mt-2 font-bold text-[#263B33]">
                          {item?.value || "Not identified"}
                        </p>

                        {item?.detail ? (
                          <p className="mt-1 text-sm text-[#858A83]">
                            {item.detail}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Score breakdown */}

                <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                  <SectionHeader
                    icon={BarChart3}
                    title="Score Breakdown"
                    description="A detailed view of the major areas evaluated in your resume."
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <ScoreBar
                      label="ATS Compatibility"
                      value={result.scores?.atsCompatibility ?? 0}
                    />
                    <ScoreBar
                      label="Skills Strength"
                      value={result.scores?.skillsStrength ?? 0}
                    />
                    <ScoreBar
                      label="Experience"
                      value={result.scores?.experience ?? 0}
                    />
                    <ScoreBar
                      label="Education Match"
                      value={result.scores?.educationMatch ?? 0}
                    />
                    <ScoreBar
                      label="Content Quality"
                      value={result.scores?.contentQuality ?? 0}
                    />
                  </div>
                </section>

                {/* Summary */}

                {result.summary ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader icon={FileText} title="Resume Summary" />

                    <p className="max-w-4xl text-sm leading-7 text-[#59645D]">
                      {result.summary}
                    </p>
                  </section>
                ) : null}

                {/* Skills */}

                {result.skills && result.skills.length > 0 ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader
                      icon={Code2}
                      title="Skills"
                      description="Skills detected from your resume."
                    />

                    <div className="flex flex-wrap gap-2.5">
                      {result.skills.map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-xl border border-[#DCE7DF] bg-[#EAF1EB] px-3 py-2 text-sm font-medium text-[#315E50]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* Projects */}

                {result.projects && result.projects.length > 0 ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader
                      icon={Briefcase}
                      title="Projects"
                      description="Projects detected from your resume, including available project links."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      {result.projects.map((project, index) => (
                        <ProjectCard
                          key={`${project.name}-${index}`}
                          project={project}
                        />
                      ))}
                    </div>

                    <p className="mt-5 text-xs leading-5 text-[#858A83]">
                      Project status is inferred from the URL listed in your
                      resume. A non-GitHub URL is treated as a live project
                      link; Revio does not automatically verify whether the
                      website is currently online.
                    </p>
                  </section>
                ) : null}

                {/* Experience */}

                {result.experienceDetails &&
                result.experienceDetails.length > 0 ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader icon={Award} title="Experience Details" />

                    <div className="space-y-4">
                      {result.experienceDetails.map((experience, index) => (
                        <div
                          key={`${experience.company}-${experience.role}-${index}`}
                          className="rounded-2xl border border-[#E7E5DC] bg-white/70 p-5"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="font-bold text-[#263B33]">
                                {experience.role}
                              </h3>

                              <p className="mt-1 text-sm font-medium text-[#527B68]">
                                {experience.company}
                              </p>
                            </div>

                            {experience.duration ? (
                              <span className="text-xs text-[#858A83]">
                                {experience.duration}
                              </span>
                            ) : null}
                          </div>

                          {experience.description ? (
                            <p className="mt-4 text-sm leading-6 text-[#777D76]">
                              {experience.description}
                            </p>
                          ) : null}

                          {experience.achievements &&
                          experience.achievements.length > 0 ? (
                            <div className="mt-4 space-y-2">
                              {experience.achievements.map(
                                (achievement, achievementIndex) => (
                                  <div
                                    key={achievementIndex}
                                    className="flex gap-2 text-sm text-[#59645D]"
                                  >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#527B68]" />
                                    <span>{achievement}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* ATS */}

                {result.atsAnalysis ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader
                      icon={ShieldCheck}
                      title="ATS Analysis"
                      description="How well your resume is structured for applicant tracking systems."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        {
                          label: "Keywords",
                          value: result.atsAnalysis.keywordOptimization,
                        },
                        {
                          label: "Formatting",
                          value: result.atsAnalysis.formatting,
                        },
                        {
                          label: "Section Structure",
                          value: result.atsAnalysis.sectionStructure,
                        },
                        {
                          label: "Readability",
                          value: result.atsAnalysis.readability,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-[#E7E5DC] bg-white/70 p-5"
                        >
                          <p className="text-xs text-[#858A83]">{item.label}</p>

                          <p className="mt-2 text-xl font-black text-[#315E50]">
                            {item.value || "—"}
                          </p>
                        </div>
                      ))}
                    </div>

                    {result.atsAnalysis.issues &&
                    result.atsAnalysis.issues.length > 0 ? (
                      <div className="mt-6">
                        <h3 className="mb-3 text-sm font-bold text-[#263B33]">
                          Issues Found
                        </h3>

                        <div className="space-y-2">
                          {result.atsAnalysis.issues.map((issue, index) => (
                            <div
                              key={index}
                              className="flex gap-3 rounded-xl border border-[#E9DCC2] bg-[#F9F4E9] p-3 text-sm text-[#6D6250]"
                            >
                              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B28A4F]" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {/* Insights */}

                <div className="grid gap-6 lg:grid-cols-3">
                  <section className="rounded-3xl border border-[#DCE7DF] bg-[#EDF4EE]/80 p-6 shadow-[0_8px_24px_rgba(38,59,51,0.03)]">
                    <SectionHeader icon={CheckCircle2} title="Strengths" />

                    {result.strengths && result.strengths.length > 0 ? (
                      <div className="space-y-3">
                        {result.strengths.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-2 text-sm leading-6 text-[#59645D]"
                          >
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#527B68]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#858A83]">
                        No specific strengths identified.
                      </p>
                    )}
                  </section>

                  <section className="rounded-3xl border border-[#E9D5CF] bg-[#FAF0ED]/80 p-6 shadow-[0_8px_24px_rgba(38,59,51,0.03)]">
                    <SectionHeader icon={AlertCircle} title="Weaknesses" />

                    {result.weaknesses && result.weaknesses.length > 0 ? (
                      <div className="space-y-3">
                        {result.weaknesses.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-2 text-sm leading-6 text-[#735B54]"
                          >
                            <AlertCircle className="mt-1 h-4 w-4 shrink-0 text-[#B97862]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#858A83]">
                        No major weaknesses identified.
                      </p>
                    )}
                  </section>

                  <section className="rounded-3xl border border-[#E9DFC9] bg-[#F9F5EA]/80 p-6 shadow-[0_8px_24px_rgba(38,59,51,0.03)]">
                    <SectionHeader icon={Lightbulb} title="Suggestions" />

                    {result.suggestions && result.suggestions.length > 0 ? (
                      <div className="space-y-3">
                        {result.suggestions.map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-2 text-sm leading-6 text-[#6D6250]"
                          >
                            <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-[#B28A4F]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#858A83]">
                        No additional suggestions.
                      </p>
                    )}
                  </section>
                </div>

                {/* Recommended roles */}

                {result.recommendedRoles &&
                result.recommendedRoles.length > 0 ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader
                      icon={TrendingUp}
                      title="Recommended Roles"
                      description="Roles that best match the skills and experience detected in your resume."
                    />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {result.recommendedRoles.map((role, index) => (
                        <div
                          key={`${role.role}-${index}`}
                          className="rounded-2xl border border-[#E7E5DC] bg-white/70 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9D9CE] hover:shadow-[0_10px_24px_rgba(38,59,51,0.06)]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-[#527B68]">
                              {role.rank || `#${index + 1}`}
                            </span>

                            <span className="rounded-full border border-[#DCE7DF] bg-[#EDF4EE] px-2.5 py-1 text-xs font-bold text-[#315E50]">
                              {Math.round(role.match)}% match
                            </span>
                          </div>

                          <h3 className="mt-4 text-base font-bold text-[#263B33]">
                            {role.role}
                          </h3>

                          {role.description ? (
                            <p className="mt-2 text-sm leading-6 text-[#777D76]">
                              {role.description}
                            </p>
                          ) : null}

                          {role.skills && role.skills.length > 0 ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {role.skills
                                .slice(0, 5)
                                .map((skill, skillIndex) => (
                                  <span
                                    key={`${skill}-${skillIndex}`}
                                    className="rounded-lg border border-[#E7E5DC] bg-[#F7F5EF] px-2 py-1 text-[11px] text-[#777D76]"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* Skill gaps */}

                {result.skillGaps && result.skillGaps.length > 0 ? (
                  <section className="rounded-3xl border border-white/90 bg-white/65 p-6 shadow-[0_10px_30px_rgba(38,59,51,0.04)] sm:p-8">
                    <SectionHeader
                      icon={Target}
                      title="Skill Gaps"
                      description="Skills that could improve your fit for the recommended roles."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      {result.skillGaps.map((gap, index) => {
                        const safeLevel = Math.max(
                          0,
                          Math.min(100, toSafeNumber(gap.level)),
                        );

                        return (
                          <div
                            key={`${gap.name}-${index}`}
                            className="rounded-2xl border border-[#E7E5DC] bg-white/70 p-5"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-[#263B33]">
                                {gap.name}
                              </h3>

                              <span className="text-xs font-semibold text-[#858A83]">
                                {Math.round(safeLevel)}/100
                              </span>
                            </div>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EAE9E1]">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#D9C5A2] to-[#B97862]"
                                style={{ width: `${safeLevel}%` }}
                              />
                            </div>

                            {gap.reason ? (
                              <p className="mt-3 text-sm leading-6 text-[#777D76]">
                                {gap.reason}
                              </p>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {/* Next career move */}

                {result.nextCareerMove ? (
                  <section className="overflow-hidden rounded-3xl border border-[#DCE7DF] bg-gradient-to-br from-[#EAF1EB] via-white/80 to-[#F4EFE4] p-6 shadow-[0_12px_32px_rgba(38,59,51,0.05)] sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE7DF] bg-white/75">
                            <ArrowRight className="h-4 w-4 text-[#315E50]" />
                          </div>

                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#527B68]">
                            Next Career Move
                          </span>
                        </div>

                        <h2 className="text-2xl font-black text-[#263B33]">
                          {result.nextCareerMove.title ||
                            "Your next career move"}
                        </h2>

                        {result.nextCareerMove.description ? (
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#777D76]">
                            {result.nextCareerMove.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </section>
                ) : null}

                {/* Bottom action */}

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/90 bg-white/65 p-5 shadow-[0_8px_24px_rgba(38,59,51,0.04)] sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF1EB]">
                      <RefreshCw className="h-4 w-4 text-[#315E50]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#263B33]">
                        Analyze another resume
                      </p>

                      <p className="text-xs text-[#858A83]">
                        Start a fresh analysis anytime.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNewAnalysis}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7DF] bg-[#EAF1EB] px-4 py-2.5 text-sm font-semibold text-[#315E50] transition hover:bg-[#DCE9DF]"
                  >
                    New Analysis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
