import type { ResumeBuilderData } from "../types";
import type { ResumeTemplateProps } from "./templateTypes";

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
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          borderBottom: "1px solid #d1d5db",
          paddingBottom: 5,
          marginBottom: 10,
          color: "#111827",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

function Empty({ value }: { value?: string }) {
  return value?.trim() ? value : null;
}

export default function MinimalTemplate({ resume }: ResumeTemplateProps) {
  const data: ResumeBuilderData = resume;

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        color: "#111827",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "42px 48px",
        boxSizing: "border-box",
        lineHeight: 1.45,
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "2px solid #111827",
          paddingBottom: 16,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          {data.name || "Your Name"}
        </h1>

        <Empty value={data.title} />

        {data.title && (
          <div
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#4b5563",
            }}
          >
            {data.title}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px 14px",
            marginTop: 12,
            fontSize: 10.5,
            color: "#4b5563",
          }}
        >
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <Section title="Professional Summary">
          <p
            style={{
              margin: 0,
              fontSize: 11.5,
              color: "#374151",
            }}
          >
            {data.summary}
          </p>
        </Section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((item) => (
            <article
              key={item.id}
              style={{
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {item.position}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "#4b5563",
                      marginTop: 2,
                    }}
                  >
                    {item.company}
                    {item.location ? ` · ${item.location}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.startDate}
                  {" — "}
                  {item.current ? "Present" : item.endDate}
                </div>
              </div>

              {item.description.length > 0 && (
                <ul
                  style={{
                    margin: "7px 0 0",
                    paddingLeft: 18,
                    fontSize: 10.5,
                    color: "#374151",
                  }}
                >
                  {item.description.map((bullet, index) => (
                    <li
                      key={`${item.id}-bullet-${index}`}
                      style={{ marginBottom: 3 }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map((project) => (
            <article
              key={project.id}
              style={{
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {project.name}
              </div>

              {project.description && (
                <p
                  style={{
                    margin: "4px 0",
                    fontSize: 10.5,
                    color: "#374151",
                  }}
                >
                  {project.description}
                </p>
              )}

              {project.technologies.length > 0 && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                  }}
                >
                  {project.technologies.join(" · ")}
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((item) => (
            <article
              key={item.id}
              style={{
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {item.degree}
                    {item.field ? `, ${item.field}` : ""}
                  </div>

                  <div
                    style={{
                      fontSize: 10.5,
                      color: "#4b5563",
                      marginTop: 2,
                    }}
                  >
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.startDate}
                  {item.endDate ? ` — ${item.endDate}` : ""}
                </div>
              </div>

              {item.description && (
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 10.5,
                    color: "#374151",
                  }}
                >
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </Section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <Section title="Skills">
          <div
            style={{
              fontSize: 10.5,
              color: "#374151",
            }}
          >
            {data.skills.join(" · ")}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <Section title="Certifications">
          {data.certifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                marginBottom: 7,
                fontSize: 10.5,
              }}
            >
              <div>
                <strong>{item.name}</strong>
                {item.issuer && ` · ${item.issuer}`}
              </div>

              {item.date && (
                <span
                  style={{
                    color: "#6b7280",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.date}
                </span>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Achievements */}
      {data.achievements.length > 0 && (
        <Section title="Achievements">
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 10.5,
              color: "#374151",
            }}
          >
            {data.achievements.map((achievement, index) => (
              <li key={index} style={{ marginBottom: 3 }}>
                {achievement}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
