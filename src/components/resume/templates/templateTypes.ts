import type { ResumeBuilderData, ResumeTemplate } from "../types";

export type ResumeTemplateProps = {
  resume: ResumeBuilderData;
};

export type TemplateDefinition = {
  id: ResumeTemplate;
  name: string;
  description: string;
  component: React.ComponentType<ResumeTemplateProps>;
};
