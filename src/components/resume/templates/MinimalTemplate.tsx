import React from "react";

export type ResumeTemplateData = {
  name?: string;
  fullName?: string;
  title?: string;
  headline?: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
  city?: string;
  linkedin?: string;
  github?: string;
  website?: string;

  skills?: Array<
    | string
    | {
        name?: string;
        label?: string;
      }
  >;

  technologies?: Array<
    | string
    | {
        name?: string;
        label?: string;
      }
  >;

  experience?: Array<{
    company?: string;
    employer?: string;
    position?: string;
    role?: string;
    title?: string;
    location?: string;

    startDate?: string;
    endDate?: string;
    start?: string;
    end?: string;

    // Supports both your ResumeData and template data
    description?: string | string[];

    bullets?: string[];
    achievements?: string[];
  }>;

  education?: Array<{
    institution?: string;
    school?: string;
    degree?: string;
    field?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    year?: string;
    description?: string | string[];
  }>;

  projects?: Array<{
    name?: string;
    title?: string;
    description?: string | string[];
    bullets?: string[];
    technologies?: string[];
    techStack?: string[];
    url?: string;
    github?: string;
  }>;

  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;

  achievements?: string[];

  [key: string]: unknown;
};

type Props = {
  resume: ResumeTemplateData;
};
function text(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function listValue(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      if (item && typeof item === "object") {
        const object = item as Record<string, unknown>;

        return text(
          object.name ?? object.label ?? object.title ?? object.value,
        );
      }

      return "";
    })
    .filter(Boolean);
}

function getName(resume: ResumeTemplateData): string {
  return text(resume.name) || text(resume.fullName) || "Your Name";
}

function getTitle(resume: ResumeTemplateData): string {
  return text(resume.title) || text(resume.headline) || "Professional";
}

function getSkills(resume: ResumeTemplateData): string[] {
  const skills = listValue(resume.skills);

  if (skills.length > 0) {
    return skills;
  }

  return listValue(resume.technologies);
}

function getBullets(item: Record<string, unknown>): string[] {
  const bullets = [...listValue(item.bullets), ...listValue(item.achievements)];

  if (bullets.length > 0) {
    return bullets;
  }

  const description = text(item.description);

  return description ? [description] : [];
}

export function MinimalTemplate({ resume }: Props) {
  const experience = Array.isArray(resume.experience) ? resume.experience : [];

  const education = Array.isArray(resume.education) ? resume.education : [];

  const projects = Array.isArray(resume.projects) ? resume.projects : [];

  const certifications = Array.isArray(resume.certifications)
    ? resume.certifications
    : [];

  const skills = getSkills(resume);

  const achievements = listValue(resume.achievements);

  const contact = [
    text(resume.email),
    text(resume.phone),
    text(resume.location) || text(resume.city),
    text(resume.linkedin),
    text(resume.github),
    text(resume.website),
  ].filter(Boolean);

  return (
    <article
      className="mx-auto min-h-[1123px] w-[794px] bg-white px-[58px] py-[52px] text-[#171717]"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}
      <header className="border-b-2 border-[#171717] pb-5">
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.03em]">
          {getName(resume)}
        </h1>

        <p className="mt-1 text-[15px] font-medium uppercase tracking-[0.12em] text-[#555]">
          {getTitle(resume)}
        </p>

        {contact.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-[#444]">
            {contact.map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        )}
      </header>

      {/* SUMMARY */}
      {text(resume.summary) && (
        <section className="mt-6">
          <SectionTitle title="Professional Summary" />

          <p className="mt-2 text-[11px] leading-[1.65] text-[#333]">
            {text(resume.summary)}
          </p>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mt-6">
          <SectionTitle title="Experience" />

          <div className="mt-3 space-y-5">
            {experience.map((item, index) => {
              const data = item as Record<string, unknown>;

              const role =
                text(data.position) || text(data.role) || text(data.title);

              const company = text(data.company) || text(data.employer);

              const start = text(data.startDate) || text(data.start);

              const end = text(data.endDate) || text(data.end) || "Present";

              const bullets = getBullets(data);

              return (
                <div key={`${company}-${index}`}>
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-[12px] font-bold">
                        {role || "Position"}
                      </h3>

                      <p className="mt-0.5 text-[11px] font-medium text-[#555]">
                        {company}

                        {text(data.location) ? ` · ${text(data.location)}` : ""}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-[10px] text-[#555]">
                      {start}

                      {start || end ? " – " : ""}

                      {end}
                    </span>
                  </div>

                  {bullets.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-4 text-[10.5px] leading-[1.55] text-[#333]">
                      {bullets.map((bullet, bulletIndex) => (
                        <li
                          key={`${bulletIndex}-${bullet}`}
                          className="list-disc"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mt-6">
          <SectionTitle title="Projects" />

          <div className="mt-3 space-y-4">
            {projects.map((item, index) => {
              const data = item as Record<string, unknown>;

              const name = text(data.name) || text(data.title) || "Project";

              const bullets = getBullets(data);

              const technologies =
                listValue(data.technologies).length > 0
                  ? listValue(data.technologies)
                  : listValue(data.techStack);

              return (
                <div key={`${name}-${index}`}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[11.5px] font-bold">{name}</h3>

                    {text(data.url) && (
                      <span className="text-[9px] text-[#666]">
                        {text(data.url)}
                      </span>
                    )}
                  </div>

                  {technologies.length > 0 && (
                    <p className="mt-0.5 text-[9.5px] font-medium text-[#666]">
                      {technologies.join(" · ")}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <ul className="mt-1.5 space-y-1 pl-4 text-[10px] leading-[1.5] text-[#333]">
                      {bullets.map((bullet, bulletIndex) => (
                        <li
                          key={`${bulletIndex}-${bullet}`}
                          className="list-disc"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <section className="mt-6">
          <SectionTitle title="Education" />

          <div className="mt-3 space-y-3">
            {education.map((item, index) => {
              const data = item as Record<string, unknown>;

              const institution = text(data.institution) || text(data.school);

              const degree = text(data.degree);

              const field = text(data.field);

              const year =
                text(data.year) ||
                [text(data.startDate), text(data.endDate)]
                  .filter(Boolean)
                  .join(" – ");

              return (
                <div
                  key={`${institution}-${index}`}
                  className="flex items-start justify-between gap-5"
                >
                  <div>
                    <h3 className="text-[11.5px] font-bold">
                      {degree}

                      {field ? `, ${field}` : ""}
                    </h3>

                    <p className="mt-0.5 text-[10.5px] text-[#555]">
                      {institution}

                      {text(data.location) ? ` · ${text(data.location)}` : ""}
                    </p>
                  </div>

                  {year && (
                    <span className="whitespace-nowrap text-[10px] text-[#555]">
                      {year}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section className="mt-6">
          <SectionTitle title="Skills" />

          <p className="mt-2 text-[10.5px] leading-[1.6] text-[#333]">
            {skills.join(" · ")}
          </p>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section className="mt-6">
          <SectionTitle title="Certifications" />

          <div className="mt-2 space-y-1.5">
            {certifications.map((item, index) => {
              const data = item as Record<string, unknown>;

              return (
                <div
                  key={`${text(data.name)}-${index}`}
                  className="text-[10.5px] text-[#333]"
                >
                  <span className="font-semibold">{text(data.name)}</span>

                  {text(data.issuer) && <span> · {text(data.issuer)}</span>}

                  {text(data.date) && <span> · {text(data.date)}</span>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <section className="mt-6">
          <SectionTitle title="Achievements" />

          <ul className="mt-2 space-y-1 pl-4 text-[10.5px] leading-[1.55] text-[#333]">
            {achievements.map((achievement, index) => (
              <li key={`${achievement}-${index}`} className="list-disc">
                {achievement}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="border-b border-[#222] pb-1">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.16em]">
        {title}
      </h2>
    </div>
  );
}
