import type { ResumeData } from "@/types/resume";

interface MinimalTemplateProps {
  resume: ResumeData;
}

export function MinimalTemplate({ resume }: MinimalTemplateProps) {
  return (
    <article className="w-full bg-white px-8 py-10 text-black">
      {/* Header */}
      <header className="border-b border-black/10 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.03em]">
          {resume.personal.name}
        </h1>

        <p className="mt-1 text-sm font-medium text-black/60">
          {resume.personal.title}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-black/50">
          <span>{resume.personal.email}</span>
          <span>{resume.personal.phone}</span>
          <span>{resume.personal.location}</span>

          {resume.personal.website && <span>{resume.personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {resume.summary && (
        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Profile
          </h2>

          <p className="mt-3 text-[10px] leading-5 text-black/65">
            {resume.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Experience
          </h2>

          <div className="mt-4 space-y-5">
            {resume.experience.map((item, index) => (
              <div key={`${item.company}-${index}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-semibold">{item.role}</h3>

                    <p className="mt-0.5 text-[10px] text-black/55">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-[9px] text-black/45">
                    {item.startDate} — {item.endDate}
                  </p>
                </div>

                <ul className="mt-2 space-y-1 pl-3">
                  {item.description.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="list-disc text-[9px] leading-4 text-black/60"
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

      {/* Projects */}
      {resume.projects.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Projects
          </h2>

          <div className="mt-4 space-y-4">
            {resume.projects.map((project, index) => (
              <div key={`${project.name}-${index}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xs font-semibold">{project.name}</h3>

                  {project.link && (
                    <span className="text-[9px] text-black/40">
                      {project.link}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[9px] leading-4 text-black/60">
                  {project.description}
                </p>

                <p className="mt-1.5 text-[9px] text-black/45">
                  {project.technologies.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
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

                  <p className="mt-0.5 text-[10px] text-black/55">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                </div>

                <p className="whitespace-nowrap text-[9px] text-black/45">
                  {item.startDate} — {item.endDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Skills
          </h2>

          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
            {resume.skills.map((skill) => (
              <span key={skill} className="text-[9px] text-black/60">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <section className="mt-7">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Certifications
          </h2>

          <div className="mt-3 space-y-2">
            {resume.certifications.map((certification, index) => (
              <div key={`${certification.name}-${index}`}>
                <p className="text-[10px] font-medium">{certification.name}</p>

                <p className="text-[9px] text-black/45">
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
