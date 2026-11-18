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
        background: "#F7F5EF",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <TemplateComponent resume={resume} />
    </div>
  );
}
