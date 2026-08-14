export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
  };

  summary: string;

  experience: {
    company: string;
    role: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];

  education: {
    institution: string;
    degree: string;
    location?: string;
    startDate: string;
    endDate: string;
  }[];

  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];

  skills: string[];

  certifications: {
    name: string;
    issuer: string;
    year?: string;
  }[];
}
