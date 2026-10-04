import type { ResumeTemplateProps } from "./templateTypes";

export default function ExecutiveTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        color: "#18212f",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "42px 48px",
        boxSizing: "border-box",
        lineHeight: 1.45,
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 190px",
          gap: 28,
          paddingBottom: 22,
          borderBottom: "2px solid #18212f",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6b7280",
              marginBottom: 8,
            }}
          >
            Executive Profile
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 31,
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            {resume.name || "Your Name"}
          </h1>

          {resume.title && (
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#4b5563",
              }}
            >
              {resume.title}
            </div>
          )}
        </div>

        <div
          style={{
            borderLeft: "1px solid #d1d5db",
            paddingLeft: 18,
            fontSize: 9.5,
            color: "#4b5563",
            lineHeight: 1.75,
          }}
        >
          {resume.email && <div>{resume.email}</div>}
          {resume.phone && <div>{resume.phone}</div>}
          {resume.location && <div>{resume.location}</div>}
          {resume.linkedin && <div>{resume.linkedin}</div>}
          {resume.github && <div>{resume.github}</div>}
          {resume.website && <div>{resume.website}</div>}
        </div>
      </header>

      {resume.summary && (
        <Section title="Executive Summary">
          <p style={bodyText}>{resume.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Leadership Experience">
          {resume.experience.map((item) => (
            <article
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "135px 1fr",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div>
                <div style={dateStyle}>
                  {item.startDate}
                  {(item.startDate || item.endDate) && " — "}
                  {item.current ? "Present" : item.endDate}
                </div>

                {item.location && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 9.5,
                      color: "#6b7280",
                    }}
                  >
                    {item.location}
                  </div>
                )}
              </div>

              <div>
                <div style={positionStyle}>{item.position}</div>

                <div style={companyStyle}>{item.company}</div>

                {item.description.length > 0 && (
                  <ul style={bulletList}>
                    {item.description.map((description, index) => (
                      <li key={index}>{description}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </Section>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 35,
        }}
      >
        {resume.skills.length > 0 && (
          <Section title="Core Competencies">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 7,
                fontSize: 10,
              }}
            >
              {resume.skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    paddingBottom: 5,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </Section>
        )}

        {resume.education.length > 0 && (
          <Section title="Education">
            {resume.education.map((item) => (
              <article key={item.id} style={{ marginBottom: 12 }}>
                <div style={positionStyle}>
                  {item.degree}
                  {item.field ? `, ${item.field}` : ""}
                </div>

                <div style={companyStyle}>{item.institution}</div>

                {(item.startDate || item.endDate) && (
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 9.5,
                      color: "#6b7280",
                    }}
                  >
                    {item.startDate}
                    {item.endDate ? ` — ${item.endDate}` : ""}
                  </div>
                )}
              </article>
            ))}
          </Section>
        )}
      </div>

      {resume.projects.length > 0 && (
        <Section title="Selected Initiatives">
          {resume.projects.map((project) => (
            <article
              key={project.id}
              style={{
                marginBottom: 13,
              }}
            >
              <div style={positionStyle}>{project.name}</div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 9.5,
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

      {resume.certifications.length > 0 && (
        <Section title="Certifications">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 8,
              fontSize: 10,
            }}
          >
            {resume.certifications.map((item) => (
              <div key={item.id}>
                <strong>{item.name}</strong>
                {item.issuer ? ` — ${item.issuer}` : ""}
                {item.date && (
                  <span
                    style={{
                      display: "block",
                      marginTop: 2,
                      fontSize: 9,
                      color: "#6b7280",
                    }}
                  >
                    {item.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.achievements.length > 0 && (
        <Section title="Selected Achievements">
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
    <section style={{ marginTop: 23 }}>
      <h2
        style={{
          margin: "0 0 11px",
          paddingBottom: 6,
          borderBottom: "1px solid #d1d5db",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#374151",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

const positionStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#18212f",
};

const companyStyle: React.CSSProperties = {
  marginTop: 3,
  fontSize: 10.5,
  fontWeight: 600,
  color: "#4b5563",
};

const dateStyle: React.CSSProperties = {
  fontSize: 9.5,
  color: "#6b7280",
  lineHeight: 1.5,
};

const bodyText: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: 10.5,
  color: "#374151",
};

const bulletList: React.CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 18,
  fontSize: 10.5,
  color: "#374151",
};
