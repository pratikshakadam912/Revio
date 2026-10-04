import type { TemplateDefinition } from "./templateTypes";

import MinimalTemplate from "./MinimalTemplate";
import ModernTemplate from "./ModernTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import CreativeTemplate from "./CreativeTemplate";

export const resumeTemplates: TemplateDefinition[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple, and ATS-friendly.",
    component: MinimalTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary layout with a polished look.",
    component: ModernTemplate,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional and highly readable.",
    component: ProfessionalTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Structured design for senior professionals.",
    component: ExecutiveTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Distinctive layout for creative roles.",
    component: CreativeTemplate,
  },
];

export function getResumeTemplate(templateId: string): TemplateDefinition {
  return (
    resumeTemplates.find((template) => template.id === templateId) ??
    resumeTemplates[0]
  );
}

export {
  MinimalTemplate,
  ModernTemplate,
  ProfessionalTemplate,
  ExecutiveTemplate,
  CreativeTemplate,
};
