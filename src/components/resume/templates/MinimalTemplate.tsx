import type { ResumeData } from "@/types/resume";

interface MinimalTemplateProps {
  resume: ResumeData;
}

export function MinimalTemplate({ resume }: MinimalTemplateProps) {
  return (
    <article className="w-full bg-white px-8 py-10 text-[#171914]">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <header className="relative border-b border-[#171914]/10 pb-6">
        {/* Accent line */}
        <div className="absolute bottom-[-1px] left-0 h-[2px] w-16 rounded-full bg-[#B7DD55]" />

        <h1 className="text-3xl font-bold tracking-[-0.04em]">
          {resume.personal.name}
        </h1>

        <p className="mt-1 text-sm font-medium text-[#171914]/60">
          {resume.personal.title}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#171914]/50">
          <span>{resume.personal.email}</span>

          <span>{resume.personal.phone}</span>

          <span>{resume.personal.location}</span>

          {resume.personal.website && <span>{resume.personal.website}</span>}
        </div>
      </header>

      {/* ============================================================
          SUMMARY
      ============================================================ */}

      {resume.summary && (
        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7DD55]" />
            Profile
          </h2>

          <p className="mt-3 text-[10px] leading-5 text-[#171914]/65">
            {resume.summary}
          </p>
        </section>
      )}

      {/* ============================================================
          EXPERIENCE
      ============================================================ */}

      {resume.experience.length > 0 && (
        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7DD55]" />
            Experience
          </h2>

          <div className="mt-4 space-y-5">
            {resume.experience.map((item, index) => (
              <div key={`${item.company}-${index}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold tracking-[-0.01em]">
                      {item.role}
                    </h3>

                    <p className="mt-0.5 text-[10px] text-[#171914]/55">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-[9px] text-[#171914]/45">
                    {item.startDate} — {item.endDate}
                  </p>
                </div>

                <ul className="mt-2 space-y-1 pl-3">
                  {item.description.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="list-disc text-[9px] leading-4 text-[#171914]/60 marker:text-[#9FBE48]"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          PROJECTS
      ============================================================ */}

      {resume.projects.length > 0 && (
        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7DD55]" />
            Projects
          </h2>

          <div className="mt-4 space-y-4">
            {resume.projects.map((project, index) => (
              <div key={`${project.name}-${index}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold">{project.name}</h3>

                  {project.link && (
                    <span className="text-[9px] text-[#171914]/40">
                      {project.link}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[9px] leading-4 text-[#171914]/60">
                  {project.description}
                </p>

                {project.technologies.length > 0 && (
                  <p className="mt-1.5 text-[9px] font-medium text-[#657A32]">
                    {project.technologies.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          EDUCATION
      ============================================================ */}

      {resume.education.length > 0 && (
        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7DD55]" />
            Education
          </h2>

          <div className="mt-4 space-y-3">
            {resume.education.map((item, index) => (
              <div
                key={`${item.institution}-${index}`}
                className="flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="text-xs font-semibold">{item.degree}</h3>

                  <p className="mt-0.5 text-[10px] text-[#171914]/55">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                </div>

                <p className="whitespace-nowrap text-[9px] text-[#171914]/45">
                  {item.startDate} — {item.endDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          SKILLS
      ============================================================ */}

      {resume.skills.length > 0 && (
        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7DD55]" />
            Skills
          </h2>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[#B7DD55]/30 bg-[#B7DD55]/10 px-2.5 py-1 text-[9px] font-medium text-[#52652A]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          CERTIFICATIONS
      ============================================================ */}

      {resume.certifications.length > 0 && (
        <section className="mt-7">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7DD55]" />
            Certifications
          </h2>

          <div className="mt-3 space-y-2">
            {resume.certifications.map((certification, index) => (
              <div key={`${certification.name}-${index}`}>
                <p className="text-[10px] font-medium">{certification.name}</p>

                <p className="text-[9px] text-[#171914]/45">
                  {certification.issuer}
                  {certification.year ? ` · ${certification.year}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
