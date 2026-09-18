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
  GraduationCap,
  Lightbulb,
  Loader2,
  MapPin,
  Menu,
  MessageSquareText,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Undo2,
  Redo2,
  Upload,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   TYPES
========================================================= */

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

type ResumeData = {
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

type ResumeChange = {
  path: string;
  before: unknown;
  after: unknown;
  label?: string;
};

type RewriteResponse = {
  success: boolean;
  changes?: ResumeChange[];
  message?: string;
  error?: string;
};

type DraftResponse = {
  success: boolean;
  draft?: {
    id: string;
    name: string;
    data: ResumeData;
    updatedAt: string;
  } | null;
  error?: string;
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const emptyCandidate: Candidate = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  headline: "",
};

const emptyResume: ResumeData = {
  candidate: emptyCandidate,
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  languages: [],
  achievements: [],
};

/* =========================================================
   HELPERS
========================================================= */

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item;

      if (
        item &&
        typeof item === "object" &&
        "name" in item &&
        typeof (item as { name?: unknown }).name === "string"
      ) {
        return (item as { name: string }).name;
      }

      return "";
    })
    .filter(Boolean);
}

function arrayValue<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function normalizeResumeData(
  raw: Partial<ResumeData> | null | undefined,
): ResumeData {
  const value = raw ?? {};

  const candidate =
    value.candidate && typeof value.candidate === "object"
      ? value.candidate
      : emptyCandidate;

  return {
    candidate: {
      name: stringValue(candidate.name),
      email: stringValue(candidate.email),
      phone: stringValue(candidate.phone),
      location: stringValue(candidate.location),
      linkedin: stringValue(candidate.linkedin),
      github: stringValue(candidate.github),
      portfolio: stringValue(candidate.portfolio),
      headline: stringValue(candidate.headline),
    },

    summary: stringValue(value.summary),

    experience: arrayValue<Experience>(value.experience).map((item) => ({
      company: stringValue(item?.company),
      role: stringValue(item?.role),
      location: stringValue(item?.location),
      startDate: stringValue(item?.startDate),
      endDate: stringValue(item?.endDate),
      description: stringValue(item?.description),
      achievements: stringArray(item?.achievements),
      technologies: stringArray(item?.technologies),
    })),

    education: arrayValue<Education>(value.education).map((item) => ({
      degree: stringValue(item?.degree),
      field: stringValue(item?.field),
      institution: stringValue(item?.institution),
      location: stringValue(item?.location),
      startDate: stringValue(item?.startDate),
      endDate: stringValue(item?.endDate),
      description: stringValue(item?.description),
    })),

    projects: arrayValue<Project>(value.projects).map((item) => ({
      name: stringValue(item?.name),
      description: stringValue(item?.description),
      technologies: stringArray(item?.technologies),
      url: stringValue(item?.url),
      startDate: stringValue(item?.startDate),
      endDate: stringValue(item?.endDate),
    })),

    skills: stringArray(value.skills),

    certifications: arrayValue<Certification>(value.certifications).map(
      (item) => ({
        name: stringValue(item?.name),
        issuer: stringValue(item?.issuer),
        date: stringValue(item?.date),
        url: stringValue(item?.url),
      }),
    ),

    languages: arrayValue<Language>(value.languages).map((item) => ({
      name: stringValue(item?.name),
      proficiency: stringValue(item?.proficiency),
    })),

    achievements: stringArray(value.achievements),
  };
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function formatChangeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "Empty";
  }

  if (typeof value === "string") {
    return value.trim() || "Empty";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "Empty";

    return value
      .map((item) => {
        if (typeof item === "string") return item;
        return JSON.stringify(item);
      })
      .join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function truncateValue(value: unknown, max = 180): string {
  const formatted = formatChangeValue(value);

  if (formatted.length <= max) {
    return formatted;
  }

  return `${formatted.slice(0, max)}…`;
}

function humanizePath(path: string): string {
  const cleaned = path
    .replace(/\[(\d+)\]/g, " $1")
    .replace(/\./g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return cleaned
    .split(/\s+/)
    .map((word) => {
      if (/^\d+$/.test(word)) {
        return `#${Number(word) + 1}`;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/* =========================================================
   SAFE CHANGE PATHS
========================================================= */

const allowedChangePath =
  /^(candidate\.(name|email|phone|location|linkedin|github|portfolio|headline)|summary|skills|achievements|experience\[\d+\]\.(company|role|location|startDate|endDate|description|achievements|technologies)|education\[\d+\]\.(degree|field|institution|location|startDate|endDate|description)|projects\[\d+\]\.(name|description|technologies|url|startDate|endDate)|certifications\[\d+\]\.(name|issuer|date|url)|languages\[\d+\]\.(name|proficiency))$/;

function isAllowedChangePath(path: string): boolean {
  return allowedChangePath.test(path);
}

function getPathValue(source: unknown, path: string): unknown {
  const tokens = path.match(/[^.[\]]+/g);

  if (!tokens) return undefined;

  let current: unknown = source;

  for (const token of tokens) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (Array.isArray(current)) {
      const index = Number(token);

      if (!Number.isInteger(index)) {
        return undefined;
      }

      current = current[index];
      continue;
    }

    if (typeof current === "object") {
      current = (current as Record<string, unknown>)[token];
      continue;
    }

    return undefined;
  }

  return current;
}

function setPathValue<T>(source: T, path: string, value: unknown): T {
  const tokens = path.match(/[^.[\]]+/g);

  if (!tokens || tokens.length === 0) {
    return source;
  }

  const result = deepClone(source);

  let current: unknown = result;

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];
    const nextToken = tokens[index + 1];

    if (Array.isArray(current)) {
      const arrayIndex = Number(token);

      if (!Number.isInteger(arrayIndex)) {
        return source;
      }

      if (current[arrayIndex] === undefined) {
        current[arrayIndex] = /^\d+$/.test(nextToken) ? [] : {};
      }

      current = current[arrayIndex];
      continue;
    }

    if (current && typeof current === "object") {
      const record = current as Record<string, unknown>;

      if (!(token in record) || record[token] === null) {
        record[token] = /^\d+$/.test(nextToken) ? [] : {};
      }

      current = record[token];
      continue;
    }

    return source;
  }

  const finalToken = tokens[tokens.length - 1];

  if (Array.isArray(current)) {
    const arrayIndex = Number(finalToken);

    if (!Number.isInteger(arrayIndex)) {
      return source;
    }

    current[arrayIndex] = value;
  } else if (current && typeof current === "object") {
    (current as Record<string, unknown>)[finalToken] = value;
  }

  return result;
}

function applyResumeChanges(
  currentResume: ResumeData,
  changes: ResumeChange[],
): ResumeData {
  let nextResume = deepClone(currentResume);

  for (const change of changes) {
    if (!change || typeof change.path !== "string") {
      continue;
    }

    if (!isAllowedChangePath(change.path)) {
      continue;
    }

    nextResume = setPathValue(nextResume, change.path, deepClone(change.after));
  }

  return normalizeResumeData(nextResume);
}

function getValidChanges(
  changes: unknown,
  currentResume: ResumeData,
): ResumeChange[] {
  if (!Array.isArray(changes)) {
    return [];
  }

  return changes.filter((change): change is ResumeChange => {
    if (!change || typeof change !== "object") {
      return false;
    }

    const item = change as Record<string, unknown>;

    if (typeof item.path !== "string") {
      return false;
    }

    if (!isAllowedChangePath(item.path)) {
      return false;
    }

    if (!("after" in item)) {
      return false;
    }

    const currentValue = getPathValue(currentResume, item.path);

    /*
     * We deliberately do not trust the AI's "before" value.
     * The actual current resume is the source of truth.
     */
    if (JSON.stringify(currentValue) === JSON.stringify(item.after)) {
      return false;
    }

    return true;
  });
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AIRewritePage() {
  const [resume, setResume] = useState<ResumeData>(emptyResume);
  const [resumeName, setResumeName] = useState("My Resume");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [instruction, setInstruction] = useState("");

  const [appliedChanges, setAppliedChanges] = useState<ResumeChange[]>([]);
  const [changeMessage, setChangeMessage] = useState("");

  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [history, setHistory] = useState<ResumeData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstLoad = useRef(true);

  /* =======================================================
     LOAD LATEST ANALYSIS / DRAFT
  ======================================================= */

  const loadResume = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/resume/latest-analysis", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to load your analyzed resume.");
      }

      const extractedText =
        typeof data.resume?.extractedText === "string"
          ? data.resume.extractedText
          : "";

      let initialResume = normalizeResumeData(
        data.analysis?.rawResult?.resume ?? data.analysis?.rawResult ?? {},
      );

      /*
       * If the analysis doesn't contain structured resume data,
       * preserve a useful fallback from the extracted resume.
       */
      if (!initialResume.candidate.name && extractedText) {
        initialResume = parseResumeText(extractedText);
      }

      const resumeId =
        typeof data.resume?.id === "string" ? data.resume.id : "";

      if (resumeId) {
        const draftResponse = await fetch(
          `/api/resume/draft?resumeId=${encodeURIComponent(resumeId)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (draftResponse.ok) {
          const draftData = (await draftResponse.json()) as DraftResponse;

          if (draftData.success && draftData.draft?.data) {
            initialResume = normalizeResumeData(draftData.draft.data);

            if (draftData.draft.name) {
              setResumeName(draftData.draft.name);
            }
          }
        }
      }

      setResume(initialResume);
      setHistory([deepClone(initialResume)]);
      setHistoryIndex(0);
      firstLoad.current = false;
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load your resume.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  /* =======================================================
     RESUME ID
  ======================================================= */

  const [resumeId, setResumeId] = useState("");

  useEffect(() => {
    async function getResumeId() {
      try {
        const response = await fetch("/api/resume/latest-analysis", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.success && data.resume?.id) {
          setResumeId(data.resume.id);
        }
      } catch {
        // Already handled by the main loader.
      }
    }

    getResumeId();
  }, []);

  /* =======================================================
     UPDATE RESUME + HISTORY
  ======================================================= */

  const updateResume = useCallback(
    (updater: (current: ResumeData) => ResumeData) => {
      setResume((current) => {
        const updated = normalizeResumeData(updater(current));

        setHistory((currentHistory) => {
          const nextHistory = currentHistory.slice(0, historyIndex + 1);

          nextHistory.push(deepClone(updated));

          return nextHistory.slice(-30);
        });

        setHistoryIndex((currentIndex) => {
          const nextIndex = Math.min(currentIndex + 1, 29);

          return nextIndex;
        });

        return updated;
      });
    },
    [historyIndex],
  );

  /* =======================================================
     UNDO / REDO
  ======================================================= */

  const undo = useCallback(() => {
    setHistoryIndex((currentIndex) => {
      if (currentIndex <= 0) {
        return currentIndex;
      }

      const nextIndex = currentIndex - 1;
      const previous = history[nextIndex];

      if (previous) {
        setResume(deepClone(previous));
      }

      return nextIndex;
    });
  }, [history]);

  const redo = useCallback(() => {
    setHistoryIndex((currentIndex) => {
      if (currentIndex >= history.length - 1) {
        return currentIndex;
      }

      const nextIndex = currentIndex + 1;
      const next = history[nextIndex];

      if (next) {
        setResume(deepClone(next));
      }

      return nextIndex;
    });
  }, [history]);

  /* =======================================================
     AUTOSAVE
  ======================================================= */

  useEffect(() => {
    if (firstLoad.current || !resumeId) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      try {
        setSaving(true);

        const response = await fetch("/api/resume/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId,
            name: resumeName || "My Resume",
            data: resume,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Unable to save your changes.");
        }
      } catch (saveError) {
        console.error("Resume autosave error:", saveError);
      } finally {
        setSaving(false);
      }
    }, 900);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [resume, resumeName, resumeId]);

  /* =======================================================
     AI INSTRUCTION
  ======================================================= */

  const submitInstruction = async () => {
    const trimmedInstruction = instruction.trim();

    if (!trimmedInstruction) {
      setError("Tell Revio what you want to change first.");
      return;
    }

    setGenerating(true);
    setError("");
    setChangeMessage("");
    setAppliedChanges([]);

    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instruction: trimmedInstruction,
          resume,
        }),
      });

      const data = (await response.json()) as RewriteResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to apply your instruction.");
      }

      const changes = getValidChanges(data.changes, resume);

      if (changes.length === 0) {
        setChangeMessage(
          data.message ||
            "No changes were made. Try being more specific about what you want changed.",
        );

        return;
      }

      const nextResume = applyResumeChanges(resume, changes);

      /*
       * Push the complete modified resume into history,
       * so Ctrl/Cmd + Undo can reverse the AI edit.
       */
      setResume(nextResume);

      setHistory((currentHistory) => {
        const nextHistory = currentHistory.slice(0, historyIndex + 1);

        nextHistory.push(deepClone(nextResume));

        return nextHistory.slice(-30);
      });

      setHistoryIndex((currentIndex) => Math.min(currentIndex + 1, 29));

      setAppliedChanges(
        changes.map((change) => ({
          ...change,
          before: getPathValue(resume, change.path),
        })),
      );

      setChangeMessage(
        `${changes.length} ${
          changes.length === 1 ? "change" : "changes"
        } applied successfully.`,
      );

      setInstruction("");
    } catch (rewriteError) {
      setError(
        rewriteError instanceof Error
          ? rewriteError.message
          : "Unable to apply your instruction.",
      );
    } finally {
      setGenerating(false);
    }
  };

  /* =======================================================
     KEYBOARD SHORTCUTS
  ======================================================= */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const modifier = event.metaKey || event.ctrlKey;

      if (!modifier) return;

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if (event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [redo, undo]);

  /* =======================================================
     EXPORT
  ======================================================= */

  const exportPdf = () => {
    window.print();
  };

  /* =======================================================
     SCORE
  ======================================================= */

  const completionScore = useMemo(() => {
    const checks = [
      Boolean(resume.candidate.name),
      Boolean(resume.candidate.email),
      Boolean(resume.candidate.phone),
      Boolean(resume.candidate.location),
      Boolean(resume.candidate.headline),
      Boolean(resume.summary),
      resume.experience.length > 0,
      resume.education.length > 0,
      resume.skills.length > 0,
      resume.projects.length > 0,
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [resume]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#070A10] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute right-[-180px] top-[20%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      <div className="relative flex min-h-screen">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-[260px]
            border-r border-white/[0.07]
            bg-[#090C13]/95 backdrop-blur-xl
            transition-transform duration-300
            lg:static lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-[78px] items-center justify-between border-b border-white/[0.06] px-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="text-lg font-bold tracking-tight">Revio</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Career Intelligence
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6">
              <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Workspace
              </div>

              <SidebarItem
                href="/dashboard"
                icon={<BarChart3 className="h-4 w-4" />}
                label="Dashboard"
              />

              <SidebarItem
                href="/resumes"
                icon={<FileText className="h-4 w-4" />}
                label="My Resumes"
              />

              <SidebarItem
                href="/templates"
                icon={<LayoutIcon />}
                label="Templates"
              />

              <div className="my-5 border-t border-white/[0.05]" />

              <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                Tools
              </div>

              <SidebarItem
                href="/analyzer"
                icon={<FileSearch className="h-4 w-4" />}
                label="Resume Analyzer"
              />

              <SidebarItem
                href="/ai"
                active
                icon={<Sparkles className="h-4 w-4" />}
                label="Rewrite Resume"
              />

              <div className="my-5 border-t border-white/[0.05]" />

              <SidebarItem
                href="/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
              />
            </nav>

            <div className="border-t border-white/[0.06] p-4">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-medium text-white/70">
                      Resume status
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-cyan-400">
                    {completionScore}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all"
                    style={{
                      width: `${completionScore}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-[11px] leading-5 text-white/35">
                  Your edits are automatically saved while you work.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#070A10]/85 backdrop-blur-xl">
            <div className="flex h-[78px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5 text-white/60 hover:text-white lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="hidden h-4 w-4 text-indigo-400 sm:block" />

                    <input
                      value={resumeName}
                      onChange={(event) => setResumeName(event.target.value)}
                      className="max-w-[220px] truncate border-none bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30 sm:max-w-[320px]"
                      placeholder="My Resume"
                    />
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-white/35">
                    {saving ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Saving changes…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        All changes saved
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  title="Undo"
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <Undo2 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo"
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-2.5 text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <Redo2 className="h-4 w-4" />
                </button>

                <div className="mx-1 hidden h-6 w-px bg-white/[0.08] sm:block" />

                <button
                  type="button"
                  onClick={exportPdf}
                  className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white sm:flex"
                >
                  <Upload className="h-4 w-4 rotate-180" />
                  Export PDF
                </button>
              </div>
            </div>
          </header>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Heading */}
            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                AI Resume Editor
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Tell Revio what you want to change.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Your resume stays yours. Give Revio a specific instruction and
                it will change only the parts you ask for.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-300">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-300/60">
                    {error}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setError("")}
                  className="text-red-300/40 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* =================================================
                AI INSTRUCTION BAR
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/[0.09] via-white/[0.025] to-cyan-400/[0.05] shadow-2xl shadow-indigo-950/20">
              <div className="p-5 sm:p-6">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
                    <MessageSquareText className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      AI Edit
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-white/40">
                      Describe exactly what you want changed. Revio will not
                      rewrite unrelated content.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={instruction}
                    onChange={(event) => setInstruction(event.target.value)}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        (event.metaKey || event.ctrlKey)
                      ) {
                        event.preventDefault();
                        submitInstruction();
                      }
                    }}
                    disabled={generating}
                    rows={3}
                    placeholder="Try: Change my name to Kirtesh"
                    className="w-full resize-none rounded-2xl border border-white/[0.08] bg-[#070A10]/80 px-4 py-4 pr-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    <InstructionExample
                      text="Change my name to Kirtesh"
                      onClick={() =>
                        setInstruction("Change my name to Kirtesh")
                      }
                    />

                    <InstructionExample
                      text="Remove my GitHub"
                      onClick={() => setInstruction("Remove my GitHub")}
                    />

                    <InstructionExample
                      text="Add Next.js to my skills"
                      onClick={() => setInstruction("Add Next.js to my skills")}
                    />

                    <InstructionExample
                      text="Make my summary shorter"
                      onClick={() => setInstruction("Make my summary shorter")}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submitInstruction}
                    disabled={generating || !instruction.trim()}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Applying…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Apply Change
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[10px] text-white/25">
                  <Zap className="h-3 w-3 text-cyan-400/60" />
                  Press Ctrl/Cmd + Enter to apply
                </div>
              </div>
            </section>

            {/* =================================================
                CHANGE SUMMARY
            ================================================= */}

            {(changeMessage || appliedChanges.length > 0) && (
              <section className="mb-6 overflow-hidden rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.035]">
                <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-white">
                        Changes applied
                      </h3>

                      {changeMessage && (
                        <p className="mt-0.5 text-[11px] text-white/35">
                          {changeMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {appliedChanges.length > 0 && (
                    <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                      {appliedChanges.length}{" "}
                      {appliedChanges.length === 1 ? "change" : "changes"}
                    </span>
                  )}
                </div>

                {appliedChanges.length > 0 && (
                  <div className="divide-y divide-white/[0.05]">
                    {appliedChanges.map((change, index) => (
                      <ChangeRow
                        key={`${change.path}-${index}`}
                        change={change}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                MOBILE TOGGLE
            ================================================= */}

            <div className="mb-5 flex rounded-xl border border-white/[0.07] bg-white/[0.025] p-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileView("edit")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                  mobileView === "edit"
                    ? "bg-white/[0.08] text-white"
                    : "text-white/35"
                }`}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => setMobileView("preview")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                  mobileView === "preview"
                    ? "bg-white/[0.08] text-white"
                    : "text-white/35"
                }`}
              >
                Preview
              </button>
            </div>

            {/* =================================================
                EDIT + PREVIEW GRID
            ================================================= */}

            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(480px,620px)]">
              {/* =================================================
                  EDITOR
              ================================================= */}

              <div
                className={
                  mobileView === "preview" ? "hidden lg:block" : "block"
                }
              >
                <div className="space-y-5">
                  {/* Personal */}
                  <EditorSection
                    icon={<CircleUserRound className="h-4 w-4" />}
                    title="Personal Information"
                    description="Your contact and professional identity."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <EditorInput
                        label="Full name"
                        value={resume.candidate.name}
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              name: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="Headline"
                        value={resume.candidate.headline}
                        placeholder="e.g. Full Stack Developer"
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              headline: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="Email"
                        value={resume.candidate.email}
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              email: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="Phone"
                        value={resume.candidate.phone}
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              phone: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="Location"
                        value={resume.candidate.location}
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              location: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="LinkedIn"
                        value={resume.candidate.linkedin}
                        placeholder="linkedin.com/in/..."
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              linkedin: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="GitHub"
                        value={resume.candidate.github}
                        placeholder="github.com/..."
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              github: value,
                            },
                          }))
                        }
                      />

                      <EditorInput
                        label="Portfolio"
                        value={resume.candidate.portfolio}
                        placeholder="yourwebsite.com"
                        onChange={(value) =>
                          updateResume((current) => ({
                            ...current,
                            candidate: {
                              ...current.candidate,
                              portfolio: value,
                            },
                          }))
                        }
                      />
                    </div>
                  </EditorSection>

                  {/* Summary */}
                  <EditorSection
                    icon={<FileText className="h-4 w-4" />}
                    title="Professional Summary"
                    description="A concise overview of your professional profile."
                  >
                    <EditorTextarea
                      label="Summary"
                      value={resume.summary}
                      rows={7}
                      placeholder="Write a concise professional summary..."
                      onChange={(value) =>
                        updateResume((current) => ({
                          ...current,
                          summary: value,
                        }))
                      }
                    />
                  </EditorSection>

                  {/* Experience */}
                  <EditorSection
                    icon={<Briefcase className="h-4 w-4" />}
                    title="Experience"
                    description="Your professional experience and achievements."
                  >
                    <div className="space-y-4">
                      {resume.experience.map((experience, index) => (
                        <ExperienceEditor
                          key={index}
                          experience={experience}
                          index={index}
                          updateExperience={(updated) => {
                            updateResume((current) => ({
                              ...current,
                              experience: current.experience.map(
                                (item, itemIndex) =>
                                  itemIndex === index ? updated : item,
                              ),
                            }));
                          }}
                          removeExperience={() => {
                            updateResume((current) => ({
                              ...current,
                              experience: current.experience.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            }));
                          }}
                        />
                      ))}

                      <AddButton
                        label="Add Experience"
                        onClick={() =>
                          updateResume((current) => ({
                            ...current,
                            experience: [
                              ...current.experience,
                              {
                                company: "",
                                role: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                                description: "",
                                achievements: [],
                                technologies: [],
                              },
                            ],
                          }))
                        }
                      />
                    </div>
                  </EditorSection>

                  {/* Education */}
                  <EditorSection
                    icon={<GraduationCap className="h-4 w-4" />}
                    title="Education"
                    description="Your academic background."
                  >
                    <div className="space-y-4">
                      {resume.education.map((education, index) => (
                        <EducationEditor
                          key={index}
                          education={education}
                          index={index}
                          updateEducation={(updated) => {
                            updateResume((current) => ({
                              ...current,
                              education: current.education.map(
                                (item, itemIndex) =>
                                  itemIndex === index ? updated : item,
                              ),
                            }));
                          }}
                          removeEducation={() => {
                            updateResume((current) => ({
                              ...current,
                              education: current.education.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            }));
                          }}
                        />
                      ))}

                      <AddButton
                        label="Add Education"
                        onClick={() =>
                          updateResume((current) => ({
                            ...current,
                            education: [
                              ...current.education,
                              {
                                degree: "",
                                field: "",
                                institution: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                                description: "",
                              },
                            ],
                          }))
                        }
                      />
                    </div>
                  </EditorSection>

                  {/* Skills */}
                  <EditorSection
                    icon={<Code2 className="h-4 w-4" />}
                    title="Skills"
                    description="Technical and professional skills."
                  >
                    <TagEditor
                      values={resume.skills}
                      placeholder="Type a skill and press Enter"
                      onChange={(skills) =>
                        updateResume((current) => ({
                          ...current,
                          skills,
                        }))
                      }
                    />
                  </EditorSection>

                  {/* Projects */}
                  <EditorSection
                    icon={<Target className="h-4 w-4" />}
                    title="Projects"
                    description="Showcase projects that strengthen your profile."
                  >
                    <div className="space-y-4">
                      {resume.projects.map((project, index) => (
                        <ProjectEditor
                          key={index}
                          project={project}
                          index={index}
                          updateProject={(updated) => {
                            updateResume((current) => ({
                              ...current,
                              projects: current.projects.map(
                                (item, itemIndex) =>
                                  itemIndex === index ? updated : item,
                              ),
                            }));
                          }}
                          removeProject={() => {
                            updateResume((current) => ({
                              ...current,
                              projects: current.projects.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            }));
                          }}
                        />
                      ))}

                      <AddButton
                        label="Add Project"
                        onClick={() =>
                          updateResume((current) => ({
                            ...current,
                            projects: [
                              ...current.projects,
                              {
                                name: "",
                                description: "",
                                technologies: [],
                                url: "",
                                startDate: "",
                                endDate: "",
                              },
                            ],
                          }))
                        }
                      />
                    </div>
                  </EditorSection>

                  {/* Certifications */}
                  <EditorSection
                    icon={<Award className="h-4 w-4" />}
                    title="Certifications"
                    description="Professional certifications and credentials."
                  >
                    <div className="space-y-4">
                      {resume.certifications.map((certification, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white/60">
                              Certification {index + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateResume((current) => ({
                                  ...current,
                                  certifications: current.certifications.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                }))
                              }
                              className="text-[11px] text-red-400/60 hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <EditorInput
                              label="Name"
                              value={certification.name}
                              onChange={(value) =>
                                updateResume((current) => ({
                                  ...current,
                                  certifications: current.certifications.map(
                                    (item, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...item,
                                            name: value,
                                          }
                                        : item,
                                  ),
                                }))
                              }
                            />

                            <EditorInput
                              label="Issuer"
                              value={certification.issuer}
                              onChange={(value) =>
                                updateResume((current) => ({
                                  ...current,
                                  certifications: current.certifications.map(
                                    (item, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...item,
                                            issuer: value,
                                          }
                                        : item,
                                  ),
                                }))
                              }
                            />

                            <EditorInput
                              label="Date"
                              value={certification.date}
                              onChange={(value) =>
                                updateResume((current) => ({
                                  ...current,
                                  certifications: current.certifications.map(
                                    (item, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...item,
                                            date: value,
                                          }
                                        : item,
                                  ),
                                }))
                              }
                            />

                            <EditorInput
                              label="URL"
                              value={certification.url}
                              onChange={(value) =>
                                updateResume((current) => ({
                                  ...current,
                                  certifications: current.certifications.map(
                                    (item, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...item,
                                            url: value,
                                          }
                                        : item,
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <AddButton
                        label="Add Certification"
                        onClick={() =>
                          updateResume((current) => ({
                            ...current,
                            certifications: [
                              ...current.certifications,
                              {
                                name: "",
                                issuer: "",
                                date: "",
                                url: "",
                              },
                            ],
                          }))
                        }
                      />
                    </div>
                  </EditorSection>

                  {/* Languages */}
                  <EditorSection
                    icon={<MessageSquareText className="h-4 w-4" />}
                    title="Languages"
                    description="Languages you can communicate in."
                  >
                    <div className="space-y-4">
                      {resume.languages.map((language, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-xs font-semibold text-white/60">
                              Language {index + 1}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateResume((current) => ({
                                  ...current,
                                  languages: current.languages.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                }))
                              }
                              className="text-[11px] text-red-400/60 hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <EditorInput
                              label="Language"
                              value={language.name}
                              onChange={(value) =>
                                updateResume((current) => ({
                                  ...current,
                                  languages: current.languages.map(
                                    (item, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...item,
                                            name: value,
                                          }
                                        : item,
                                  ),
                                }))
                              }
                            />

                            <EditorInput
                              label="Proficiency"
                              value={language.proficiency}
                              placeholder="e.g. Native, Fluent"
                              onChange={(value) =>
                                updateResume((current) => ({
                                  ...current,
                                  languages: current.languages.map(
                                    (item, itemIndex) =>
                                      itemIndex === index
                                        ? {
                                            ...item,
                                            proficiency: value,
                                          }
                                        : item,
                                  ),
                                }))
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <AddButton
                        label="Add Language"
                        onClick={() =>
                          updateResume((current) => ({
                            ...current,
                            languages: [
                              ...current.languages,
                              {
                                name: "",
                                proficiency: "",
                              },
                            ],
                          }))
                        }
                      />
                    </div>
                  </EditorSection>

                  {/* Achievements */}
                  <EditorSection
                    icon={<TrendingUp className="h-4 w-4" />}
                    title="Achievements"
                    description="Additional accomplishments worth highlighting."
                  >
                    <TagEditor
                      values={resume.achievements}
                      placeholder="Add an achievement and press Enter"
                      onChange={(achievements) =>
                        updateResume((current) => ({
                          ...current,
                          achievements,
                        }))
                      }
                    />
                  </EditorSection>
                </div>
              </div>

              {/* =================================================
                  PREVIEW
              ================================================= */}

              <div
                className={`
                  lg:sticky lg:top-[102px]
                  ${mobileView === "edit" ? "hidden lg:block" : "block"}
                `}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/30">
                      Live Preview
                    </p>

                    <p className="mt-1 text-[11px] text-white/20">
                      Updates as you edit
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={exportPdf}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Export
                  </button>
                </div>

                <div className="overflow-auto rounded-2xl border border-white/[0.07] bg-[#11151D] p-2 shadow-2xl shadow-black/30">
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
        active
          ? "bg-indigo-500/10 text-indigo-300"
          : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
      }`}
    >
      {icon}
      <span>{label}</span>

      {active && (
        <ChevronRight className="ml-auto h-3.5 w-3.5 text-indigo-400/60" />
      )}
    </Link>
  );
}

function LayoutIcon() {
  return (
    <div className="grid h-4 w-4 grid-cols-2 gap-[2px]">
      <span className="rounded-[2px] bg-current" />
      <span className="rounded-[2px] bg-current" />
      <span className="rounded-[2px] bg-current" />
      <span className="rounded-[2px] bg-current" />
    </div>
  );
}

/* =========================================================
   AI CHANGE UI
========================================================= */

function InstructionExample({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-white/35 transition hover:border-indigo-400/20 hover:bg-indigo-400/[0.05] hover:text-white/70"
    >
      {text}
    </button>
  );
}

function ChangeRow({ change }: { change: ResumeChange }) {
  const before = truncateValue(change.before);
  const after = truncateValue(change.after);

  const beforeEmpty = before === "Empty" || before.trim() === "";

  const afterEmpty = after === "Empty" || after.trim() === "";

  return (
    <div className="px-5 py-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
        {change.label || humanizePath(change.path)}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div
          className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 ${
            beforeEmpty
              ? "border-white/[0.05] bg-white/[0.015] text-white/20"
              : "border-red-400/10 bg-red-400/[0.025] text-red-200/65"
          }`}
        >
          <div className="mb-1 text-[9px] uppercase tracking-wider opacity-50">
            Before
          </div>

          <div className="break-words text-xs leading-5">{before}</div>
        </div>

        <ArrowRight className="hidden h-4 w-4 shrink-0 text-white/20 sm:block" />

        <div
          className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 ${
            afterEmpty
              ? "border-white/[0.05] bg-white/[0.015] text-white/20"
              : "border-emerald-400/10 bg-emerald-400/[0.025] text-emerald-200/75"
          }`}
        >
          <div className="mb-1 text-[9px] uppercase tracking-wider opacity-50">
            After
          </div>

          <div className="break-words text-xs leading-5">{after}</div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EDITOR COMPONENTS
========================================================= */

function EditorSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            {icon}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white/90">{title}</h2>

            <p className="mt-0.5 text-[11px] text-white/30">{description}</p>
          </div>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function EditorInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/[0.07] bg-[#090C13] px-3.5 py-3 text-xs text-white outline-none placeholder:text-white/20 transition focus:border-indigo-400/30 focus:ring-4 focus:ring-indigo-500/5"
      />
    </label>
  );
}

function EditorTextarea({
  label,
  value,
  rows = 5,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
        {label}
      </span>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-xl border border-white/[0.07] bg-[#090C13] px-3.5 py-3 text-xs leading-6 text-white outline-none placeholder:text-white/20 transition focus:border-indigo-400/30 focus:ring-4 focus:ring-indigo-500/5"
      />
    </label>
  );
}

function ExperienceEditor({
  experience,
  index,
  updateExperience,
  removeExperience,
}: {
  experience: Experience;
  index: number;
  updateExperience: (experience: Experience) => void;
  removeExperience: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60">
          Experience {index + 1}
        </span>

        <button
          type="button"
          onClick={removeExperience}
          className="text-[11px] text-red-400/60 transition hover:text-red-400"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditorInput
          label="Company"
          value={experience.company}
          onChange={(value) =>
            updateExperience({
              ...experience,
              company: value,
            })
          }
        />

        <EditorInput
          label="Role"
          value={experience.role}
          onChange={(value) =>
            updateExperience({
              ...experience,
              role: value,
            })
          }
        />

        <EditorInput
          label="Location"
          value={experience.location}
          onChange={(value) =>
            updateExperience({
              ...experience,
              location: value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <EditorInput
            label="Start"
            value={experience.startDate}
            onChange={(value) =>
              updateExperience({
                ...experience,
                startDate: value,
              })
            }
          />

          <EditorInput
            label="End"
            value={experience.endDate}
            onChange={(value) =>
              updateExperience({
                ...experience,
                endDate: value,
              })
            }
          />
        </div>
      </div>

      <div className="mt-4">
        <EditorTextarea
          label="Description"
          value={experience.description}
          rows={5}
          onChange={(value) =>
            updateExperience({
              ...experience,
              description: value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <TagEditor
          label="Achievements"
          values={experience.achievements}
          placeholder="Add achievement and press Enter"
          onChange={(achievements) =>
            updateExperience({
              ...experience,
              achievements,
            })
          }
        />
      </div>

      <div className="mt-4">
        <TagEditor
          label="Technologies"
          values={experience.technologies}
          placeholder="Add technology and press Enter"
          onChange={(technologies) =>
            updateExperience({
              ...experience,
              technologies,
            })
          }
        />
      </div>
    </div>
  );
}

function EducationEditor({
  education,
  index,
  updateEducation,
  removeEducation,
}: {
  education: Education;
  index: number;
  updateEducation: (education: Education) => void;
  removeEducation: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60">
          Education {index + 1}
        </span>

        <button
          type="button"
          onClick={removeEducation}
          className="text-[11px] text-red-400/60 transition hover:text-red-400"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditorInput
          label="Degree"
          value={education.degree}
          onChange={(value) =>
            updateEducation({
              ...education,
              degree: value,
            })
          }
        />

        <EditorInput
          label="Field"
          value={education.field}
          onChange={(value) =>
            updateEducation({
              ...education,
              field: value,
            })
          }
        />

        <EditorInput
          label="Institution"
          value={education.institution}
          onChange={(value) =>
            updateEducation({
              ...education,
              institution: value,
            })
          }
        />

        <EditorInput
          label="Location"
          value={education.location}
          onChange={(value) =>
            updateEducation({
              ...education,
              location: value,
            })
          }
        />

        <EditorInput
          label="Start"
          value={education.startDate}
          onChange={(value) =>
            updateEducation({
              ...education,
              startDate: value,
            })
          }
        />

        <EditorInput
          label="End"
          value={education.endDate}
          onChange={(value) =>
            updateEducation({
              ...education,
              endDate: value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <EditorTextarea
          label="Description"
          value={education.description}
          rows={4}
          onChange={(value) =>
            updateEducation({
              ...education,
              description: value,
            })
          }
        />
      </div>
    </div>
  );
}

function ProjectEditor({
  project,
  index,
  updateProject,
  removeProject,
}: {
  project: Project;
  index: number;
  updateProject: (project: Project) => void;
  removeProject: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60">
          Project {index + 1}
        </span>

        <button
          type="button"
          onClick={removeProject}
          className="text-[11px] text-red-400/60 transition hover:text-red-400"
        >
          Remove
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <EditorInput
          label="Project name"
          value={project.name}
          onChange={(value) =>
            updateProject({
              ...project,
              name: value,
            })
          }
        />

        <EditorInput
          label="URL"
          value={project.url}
          onChange={(value) =>
            updateProject({
              ...project,
              url: value,
            })
          }
        />

        <EditorInput
          label="Start"
          value={project.startDate}
          onChange={(value) =>
            updateProject({
              ...project,
              startDate: value,
            })
          }
        />

        <EditorInput
          label="End"
          value={project.endDate}
          onChange={(value) =>
            updateProject({
              ...project,
              endDate: value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <EditorTextarea
          label="Description"
          value={project.description}
          rows={5}
          onChange={(value) =>
            updateProject({
              ...project,
              description: value,
            })
          }
        />
      </div>

      <div className="mt-4">
        <TagEditor
          label="Technologies"
          values={project.technologies}
          placeholder="Add technology and press Enter"
          onChange={(technologies) =>
            updateProject({
              ...project,
              technologies,
            })
          }
        />
      </div>
    </div>
  );
}

function TagEditor({
  label,
  values,
  placeholder,
  onChange,
}: {
  label?: string;
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addValue = () => {
    const value = input.trim();

    if (!value) return;

    if (
      values.some((existing) => existing.toLowerCase() === value.toLowerCase())
    ) {
      setInput("");
      return;
    }

    onChange([...values, value]);
    setInput("");
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div>
      {label && (
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
          {label}
        </div>
      )}

      <div className="rounded-xl border border-white/[0.07] bg-[#090C13] p-3">
        {values.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {values.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-400/10 bg-indigo-400/[0.06] px-2.5 py-1.5 text-[11px] text-indigo-200/80"
              >
                {value}

                <button
                  type="button"
                  onClick={() => removeValue(index)}
                  className="text-indigo-200/30 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addValue();
              }
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-xs text-white outline-none placeholder:text-white/20"
          />

          <button
            type="button"
            onClick={addValue}
            className="rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2 text-[10px] font-semibold text-white/50 hover:bg-white/[0.07] hover:text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.09] bg-white/[0.015] px-4 py-3 text-xs font-medium text-white/35 transition hover:border-indigo-400/20 hover:bg-indigo-400/[0.03] hover:text-indigo-300"
    >
      <span className="text-base leading-none">+</span>
      {label}
    </button>
  );
}

/* =========================================================
   RESUME PREVIEW
========================================================= */

function ResumePreview({ resume }: { resume: ResumeData }) {
  const candidate = resume.candidate;

  return (
    <div
      id="resume-print-area"
      className="mx-auto min-h-[1120px] w-full max-w-[794px] bg-white px-8 py-9 text-[#171A1F] shadow-xl sm:px-12 sm:py-11"
    >
      {/* Header */}
      <header className="border-b border-[#D8DCE2] pb-5">
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#111318]">
          {candidate.name || "Your Name"}
        </h1>

        {candidate.headline && (
          <p className="mt-1.5 text-[13px] font-medium text-[#555D68]">
            {candidate.headline}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[9.5px] text-[#626A75]">
          {candidate.email && <span>{candidate.email}</span>}

          {candidate.phone && (
            <>
              <span>•</span>
              <span>{candidate.phone}</span>
            </>
          )}

          {candidate.location && (
            <>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-2.5 w-2.5" />
                {candidate.location}
              </span>
            </>
          )}

          {candidate.linkedin && (
            <>
              <span>•</span>
              <span>{candidate.linkedin}</span>
            </>
          )}

          {candidate.github && (
            <>
              <span>•</span>
              <span>{candidate.github}</span>
            </>
          )}

          {candidate.portfolio && (
            <>
              <span>•</span>
              <span>{candidate.portfolio}</span>
            </>
          )}
        </div>
      </header>

      {resume.summary && (
        <PreviewSection title="Professional Summary">
          <p className="text-[10.5px] leading-[1.65] text-[#414852]">
            {resume.summary}
          </p>
        </PreviewSection>
      )}

      {resume.experience.length > 0 && (
        <PreviewSection title="Experience">
          <div className="space-y-5">
            {resume.experience.map((experience, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[11.5px] font-bold text-[#171A1F]">
                      {experience.role || "Position"}
                    </h3>

                    {experience.company && (
                      <p className="mt-0.5 text-[10px] font-semibold text-[#4B5563]">
                        {experience.company}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right text-[9px] text-[#737A84]">
                    {(experience.startDate || experience.endDate) && (
                      <div>
                        {experience.startDate}
                        {experience.startDate && experience.endDate && " — "}
                        {experience.endDate}
                      </div>
                    )}

                    {experience.location && (
                      <div className="mt-0.5">{experience.location}</div>
                    )}
                  </div>
                </div>

                {experience.description && (
                  <p className="mt-2 text-[10px] leading-[1.55] text-[#4C535D]">
                    {experience.description}
                  </p>
                )}

                {experience.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1 pl-3">
                    {experience.achievements.map(
                      (achievement, achievementIndex) => (
                        <li
                          key={achievementIndex}
                          className="relative text-[9.5px] leading-[1.5] text-[#454C56]"
                        >
                          <span className="absolute -left-3">•</span>
                          {achievement}
                        </li>
                      ),
                    )}
                  </ul>
                )}

                {experience.technologies.length > 0 && (
                  <div className="mt-2 text-[9px] text-[#737A84]">
                    <span className="font-semibold">Technologies:</span>{" "}
                    {experience.technologies.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.projects.length > 0 && (
        <PreviewSection title="Projects">
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[11px] font-bold text-[#171A1F]">
                    {project.name || "Project"}
                  </h3>

                  {(project.startDate || project.endDate) && (
                    <span className="shrink-0 text-[9px] text-[#737A84]">
                      {project.startDate}
                      {project.startDate && project.endDate && " — "}
                      {project.endDate}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="mt-1.5 text-[9.5px] leading-[1.55] text-[#4C535D]">
                    {project.description}
                  </p>
                )}

                {project.technologies.length > 0 && (
                  <div className="mt-1.5 text-[9px] text-[#737A84]">
                    <span className="font-semibold">Technologies:</span>{" "}
                    {project.technologies.join(", ")}
                  </div>
                )}

                {project.url && (
                  <div className="mt-1 text-[9px] text-[#5963A4]">
                    {project.url}
                  </div>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.skills.length > 0 && (
        <PreviewSection title="Skills">
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {resume.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="rounded bg-[#F0F2F5] px-2 py-1 text-[9px] text-[#414852]"
              >
                {skill}
              </span>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.education.length > 0 && (
        <PreviewSection title="Education">
          <div className="space-y-4">
            {resume.education.map((education, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[11px] font-bold text-[#171A1F]">
                      {education.degree || "Degree"}
                      {education.field ? ` in ${education.field}` : ""}
                    </h3>

                    {education.institution && (
                      <p className="mt-0.5 text-[10px] font-semibold text-[#4B5563]">
                        {education.institution}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right text-[9px] text-[#737A84]">
                    {(education.startDate || education.endDate) && (
                      <div>
                        {education.startDate}
                        {education.startDate && education.endDate && " — "}
                        {education.endDate}
                      </div>
                    )}

                    {education.location && (
                      <div className="mt-0.5">{education.location}</div>
                    )}
                  </div>
                </div>

                {education.description && (
                  <p className="mt-1.5 text-[9.5px] leading-[1.5] text-[#4C535D]">
                    {education.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.certifications.length > 0 && (
        <PreviewSection title="Certifications">
          <div className="space-y-2">
            {resume.certifications.map((certification, index) => (
              <div
                key={index}
                className="flex items-start justify-between gap-4 text-[9.5px]"
              >
                <div>
                  <span className="font-semibold text-[#171A1F]">
                    {certification.name}
                  </span>

                  {certification.issuer && (
                    <span className="text-[#59616C]">
                      {" "}
                      — {certification.issuer}
                    </span>
                  )}
                </div>

                {certification.date && (
                  <span className="shrink-0 text-[#737A84]">
                    {certification.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.languages.length > 0 && (
        <PreviewSection title="Languages">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {resume.languages.map((language, index) => (
              <div key={index} className="text-[9.5px] text-[#414852]">
                <span className="font-semibold">{language.name}</span>

                {language.proficiency && (
                  <span className="text-[#737A84]">
                    {" "}
                    — {language.proficiency}
                  </span>
                )}
              </div>
            ))}
          </div>
        </PreviewSection>
      )}

      {resume.achievements.length > 0 && (
        <PreviewSection title="Achievements">
          <ul className="space-y-1 pl-3">
            {resume.achievements.map((achievement, index) => (
              <li
                key={index}
                className="relative text-[9.5px] leading-[1.5] text-[#454C56]"
              >
                <span className="absolute -left-3">•</span>
                {achievement}
              </li>
            ))}
          </ul>
        </PreviewSection>
      )}
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-2.5 border-b border-[#D8DCE2] pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#252A31]">
        {title}
      </h2>

      {children}
    </section>
  );
}

/* =========================================================
   FALLBACK TEXT PARSER
========================================================= */

function parseResumeText(extractedText: string): ResumeData {
  const lines = extractedText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const firstLine = lines[0] || "";

  const email =
    extractedText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";

  const phone = extractedText.match(/(?:\+?\d[\d\s().-]{8,}\d)/)?.[0] || "";

  return {
    ...emptyResume,
    candidate: {
      ...emptyCandidate,
      name: firstLine,
      email,
      phone,
    },
  };
}

/* =========================================================
   LOADING
========================================================= */

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070A10] text-white">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
          <Sparkles className="h-5 w-5 animate-pulse" />
        </div>

        <p className="text-sm font-medium text-white/70">
          Loading your resume…
        </p>

        <p className="mt-1 text-xs text-white/30">
          Preparing your editing workspace
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PRINT STYLES
========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById("revio-print-styles")
) {
  const style = document.createElement("style");

  style.id = "revio-print-styles";

  style.innerHTML = `
    @media print {
      body {
        background: white !important;
      }

      body * {
        visibility: hidden !important;
      }

      #resume-print-area,
      #resume-print-area * {
        visibility: visible !important;
      }

      #resume-print-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        max-width: none !important;
        min-height: auto !important;
        margin: 0 !important;
        padding: 40px !important;
        box-shadow: none !important;
      }

      @page {
        size: A4;
        margin: 0;
      }
    }
  `;

  document.head.appendChild(style);
}
