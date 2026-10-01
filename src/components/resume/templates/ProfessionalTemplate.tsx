import React from "react";
import type { ResumeTemplateData } from "./MinimalTemplate";

type Props = {
  resume: ResumeTemplateData;
};

export function ProfessionalTemplate({ resume }: Props) {
  const skills = Array.isArray(resume.skills)
    ? resume.skills
    : Array.isArray(resume.technologies)
      ? resume.technologies
      : [];

  const experience = Array.isArray(resume.experience) ? resume.experience : [];

  const education = Array.isArray(resume.education) ? resume.education : [];

  const projects = Array.isArray(resume.projects) ? resume.projects : [];

  return (
    <article
      className="mx-auto min-h-[1123px] w-[794px] bg-white text-[#20242a]"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}
      <header className="bg-[#172033] px-[54px] py-[38px] text-white">
        <h1 className="text-[31px] font-bold tracking-[-0.03em]">
          {String(resume.name ?? resume.fullName ?? "Your Name")}
        </h1>

        <p className="mt-1 text-[13px] font-medium uppercase tracking-[0.14em] text-slate-300">
          {String(resume.title ?? resume.headline ?? "Professional")}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[9.5px] text-slate-300">
          {[
            resume.email,
            resume.phone,
            resume.location ?? resume.city,
            resume.linkedin,
            resume.github,
            resume.website,
          ]
            .filter(Boolean)
            .map((item, index) => (
              <span key={`${String(item)}-${index}`}>{String(item)}</span>
            ))}
        </div>
      </header>

      {/* BODY */}
      <div className="grid grid-cols-[1fr_220px]">
        {/* MAIN CONTENT */}
        <main className="px-[46px] py-[34px]">
          {/* PROFILE */}
          {resume.summary && (
            <section className="mb-7">
              <ProfessionalHeading title="Profile" />

              <p className="mt-3 text-[10.5px] leading-[1.65] text-[#454b54]">
                {String(resume.summary)}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section className="mb-7">
              <ProfessionalHeading title="Professional Experience" />

              <div className="mt-4 space-y-5">
                {experience.map((item, index) => {
                  const data = item as Record<string, unknown>;

                  const role = String(
                    data.position ?? data.role ?? data.title ?? "",
                  );

                  const company = String(data.company ?? data.employer ?? "");

                  const startDate = String(data.startDate ?? data.start ?? "");

                  const endDate = String(data.endDate ?? data.end ?? "");

                  const hasDate =
                    startDate.trim().length > 0 || endDate.trim().length > 0;

                  const bullets = Array.isArray(data.bullets)
                    ? data.bullets
                    : data.description != null
                      ? [data.description]
                      : [];

                  return (
                    <div key={index}>
                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="text-[11.5px] font-bold">
                            {role || "Position"}
                          </h3>

                          {company.trim() && (
                            <p className="mt-0.5 text-[10px] font-medium text-[#5d6470]">
                              {company}
                            </p>
                          )}
                        </div>

                        <span className="text-right text-[9px] text-[#6b7280]">
                          {startDate}

                          {hasDate && " – "}

                          {endDate || "Present"}
                        </span>
                      </div>

                      {bullets.length > 0 && (
                        <ul className="mt-2 space-y-1 pl-4 text-[10px] leading-[1.55] text-[#454b54]">
                          {bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="list-disc">
                              {String(bullet)}
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
            <section className="mb-7">
              <ProfessionalHeading title="Selected Projects" />

              <div className="mt-4 space-y-4">
                {projects.map((item, index) => {
                  const data = item as Record<string, unknown>;

                  const name = String(data.name ?? data.title ?? "Project");

                  const technologies = Array.isArray(data.technologies)
                    ? data.technologies
                        .map((technology) => String(technology))
                        .filter((technology) => technology.trim().length > 0)
                    : [];

                  const description = Array.isArray(data.bullets)
                    ? data.bullets
                    : data.description != null
                      ? [data.description]
                      : [];

                  return (
                    <div key={index}>
                      <h3 className="text-[11px] font-bold">{name}</h3>

                      {technologies.length > 0 && (
                        <p className="mt-0.5 text-[9px] font-medium text-[#68707c]">
                          {technologies.join(" · ")}
                        </p>
                      )}

                      {description.length > 0 && (
                        <ul className="mt-1.5 space-y-1 pl-4 text-[9.8px] leading-[1.5] text-[#454b54]">
                          {description.map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="list-disc">
                              {String(bullet)}
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
        </main>

        {/* SIDEBAR */}
        <aside className="border-l border-[#e3e6ea] bg-[#f7f8fa] px-[24px] py-[34px]">
          {/* SKILLS */}
          {skills.length > 0 && (
            <section className="mb-8">
              <ProfessionalSideHeading title="Core Skills" />

              <div className="mt-3 space-y-1.5">
                {skills.map((skill, index) => {
                  let value = "";

                  if (typeof skill === "string") {
                    value = skill;
                  } else if (skill !== null && typeof skill === "object") {
                    const skillData = skill as Record<string, unknown>;

                    value = String(skillData.name ?? skillData.label ?? "");
                  } else if (skill !== null && skill !== undefined) {
                    value = String(skill);
                  }

                  return value.trim() ? (
                    <div
                      key={`${value}-${index}`}
                      className="text-[9.5px] leading-[1.4] text-[#444b55]"
                    >
                      {value}
                    </div>
                  ) : null;
                })}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section className="mb-8">
              <ProfessionalSideHeading title="Education" />

              <div className="mt-3 space-y-4">
                {education.map((item, index) => {
                  const data = item as Record<string, unknown>;

                  const degree = String(data.degree ?? "");

                  const institution = String(
                    data.institution ?? data.school ?? "",
                  );

                  const year = String(data.year ?? data.endDate ?? "");

                  return (
                    <div key={index}>
                      {degree.trim() && (
                        <h3 className="text-[10px] font-bold leading-[1.4]">
                          {degree}
                        </h3>
                      )}

                      {institution.trim() && (
                        <p className="mt-1 text-[9px] leading-[1.4] text-[#59616d]">
                          {institution}
                        </p>
                      )}

                      {year.trim() && (
                        <p className="mt-1 text-[8.5px] text-[#7b838e]">
                          {year}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {Array.isArray(resume.certifications) &&
            resume.certifications.length > 0 && (
              <section>
                <ProfessionalSideHeading title="Certifications" />

                <div className="mt-3 space-y-3">
                  {resume.certifications.map((item, index) => {
                    const certification = item as Record<string, unknown>;

                    const name = String(certification.name ?? "");

                    const issuer = String(certification.issuer ?? "");

                    return (
                      <div key={index}>
                        {name.trim() && (
                          <p className="text-[9.5px] font-semibold leading-[1.4]">
                            {name}
                          </p>
                        )}

                        {issuer.trim() && (
                          <p className="mt-0.5 text-[8.5px] text-[#69717d]">
                            {issuer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
        </aside>
      </div>
    </article>
  );
}

/* =========================================
   MAIN SECTION HEADING
========================================= */

function ProfessionalHeading({ title }: { title: string }) {
  return (
    <div className="border-b border-[#d9dde2] pb-2">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#172033]">
        {title}
      </h2>
    </div>
  );
}

/* =========================================
   SIDEBAR SECTION HEADING
========================================= */

function ProfessionalSideHeading({ title }: { title: string }) {
  return (
    <div className="border-b border-[#d9dde2] pb-2">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#172033]">
        {title}
      </h2>
    </div>
  );
}
