export type ResumeTemplate =
  | "minimal"
  | "modern"
  | "professional"
  | "executive"
  | "creative";

export type ResumeBuilderData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;

  summary: string;

  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }[];

  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];

  skills: string[];

  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url: string;
    github: string;
  }[];

  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];

  achievements: string[];
};

export const emptyResumeBuilderData: ResumeBuilderData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
};
