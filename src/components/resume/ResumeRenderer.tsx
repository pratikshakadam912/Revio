import type { ResumeBuilderData, ResumeTemplate } from "./types";
import { getResumeTemplate } from "./templates";

type ResumeRendererProps = {
  resume: ResumeBuilderData;
  template: ResumeTemplate;
  className?: string;
};

export default function ResumeRenderer({
  resume,
  template,
  className = "",
}: ResumeRendererProps) {
  const templateDefinition = getResumeTemplate(template);
  const TemplateComponent = templateDefinition.component;

  return (
    <div
      className={className}
      style={{
        width: "100%",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <TemplateComponent resume={resume} />
    </div>
  );
}
