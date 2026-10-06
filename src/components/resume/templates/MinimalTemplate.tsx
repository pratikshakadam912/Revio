import type { ResumeTemplateProps } from "./templateTypes";

export default function MinimalTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        color: "#18181b",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "42px 48px",
        boxSizing: "border-box",
        lineHeight: 1.45,
      }}
    >
      {/* Header */}
      <header
        style={{
          paddingBottom: 18,
          borderBottom: "1px solid #e4e4e7",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {resume.name || "Your Name"}
        </h1>

        {resume.title && (
          <div
            style={{
              marginTop: 7,
              fontSize: 13,
              color: "#52525b",
              fontWeight: 500,
            }}
          >
            {resume.title}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 13px",
            marginTop: 11,
            fontSize: 9.5,
            color: "#71717a",
          }}
        >
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
          {resume.github && <span>{resume.github}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {resume.summary && (
        <Section title="Summary">
          <p style={bodyText}>{resume.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((item) => (
            <article key={item.id} style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {item.position}
                  </div>

                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 10,
                      color: "#52525b",
                    }}
                  >
                    {item.company}
                    {item.location ? ` · ${item.location}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 9,
                    color: "#71717a",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.startDate}
                  {(item.startDate || item.endDate) && " — "}
                  {item.current ? "Present" : item.endDate}
                </div>
              </div>

              {item.description.length > 0 && (
                <ul style={bulletList}>
                  {item.description.map((description, index) => (
                    <li key={index}>{description}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Section>
      )}

      {/* Education */}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((item) => (
            <article key={item.id} style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {item.degree}
                {item.field ? `, ${item.field}` : ""}
              </div>

              <div
                style={{
                  marginTop: 2,
                  fontSize: 10,
                  color: "#52525b",
                }}
              >
                {item.institution}
              </div>

              {(item.startDate || item.endDate) && (
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 9,
                    color: "#71717a",
                  }}
                >
                  {item.startDate}
                  {item.endDate ? ` — ${item.endDate}` : ""}
                </div>
              )}

              {item.description && <p style={bodyText}>{item.description}</p>}
            </article>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {resume.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: "4px 8px",
                  border: "1px solid #e4e4e7",
                  borderRadius: 4,
                  fontSize: 9,
                  color: "#3f3f46",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((project) => (
            <article key={project.id} style={{ marginBottom: 13 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {project.name}
              </div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 9,
                    color: "#71717a",
                  }}
                >
                  {project.technologies.join(" · ")}
                </div>
              )}

              {project.url && (
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 8.5,
                    color: "#71717a",
                  }}
                >
                  {project.url}
                </div>
              )}

              {project.github && (
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 8.5,
                    color: "#71717a",
                  }}
                >
                  {project.github}
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <Section title="Certifications">
          {resume.certifications.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: 8,
                fontSize: 10,
              }}
            >
              <strong>{item.name}</strong>

              {item.issuer && <span> — {item.issuer}</span>}

              {item.date && (
                <span
                  style={{
                    marginLeft: 5,
                    color: "#71717a",
                  }}
                >
                  ({item.date})
                </span>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {resume.achievements.length > 0 && (
        <Section title="Achievements">
          <ul style={bulletList}>
            {resume.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2
        style={{
          margin: "0 0 10px",
          paddingBottom: 5,
          borderBottom: "1px solid #e4e4e7",
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#3f3f46",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

const bodyText: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 10,
  color: "#3f3f46",
};

const bulletList: React.CSSProperties = {
  margin: "6px 0 0",
  paddingLeft: 17,
  fontSize: 9.5,
  color: "#3f3f46",
};
