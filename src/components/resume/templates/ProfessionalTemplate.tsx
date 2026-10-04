import type { ResumeTemplateProps } from "./templateTypes";

export default function ProfessionalTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        color: "#1f2937",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "44px 50px",
        boxSizing: "border-box",
        lineHeight: 1.45,
      }}
    >
      {/* Header */}
      <header
        style={{
          textAlign: "center",
          paddingBottom: 20,
          borderBottom: "1px solid #9ca3af",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {resume.name || "Your Name"}
        </h1>

        {resume.title && (
          <div
            style={{
              marginTop: 7,
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            {resume.title}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "4px 13px",
            marginTop: 11,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 9.5,
            color: "#6b7280",
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
        <Section title="Professional Profile">
          <p style={bodyText}>{resume.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <Section title="Professional Experience">
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
                  <div style={positionStyle}>{item.position}</div>

                  <div style={companyStyle}>
                    {item.company}
                    {item.location ? `, ${item.location}` : ""}
                  </div>
                </div>

                <div style={dateStyle}>
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
            <article key={item.id} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                <div>
                  <div style={positionStyle}>
                    {item.degree}
                    {item.field ? `, ${item.field}` : ""}
                  </div>

                  <div style={companyStyle}>
                    {item.institution}
                    {item.location ? `, ${item.location}` : ""}
                  </div>
                </div>

                <div style={dateStyle}>
                  {item.startDate}
                  {item.endDate ? ` — ${item.endDate}` : ""}
                </div>
              </div>

              {item.description && <p style={bodyText}>{item.description}</p>}
            </article>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <Section title="Core Skills">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              columnGap: 25,
              rowGap: 5,
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 10.5,
            }}
          >
            {resume.skills.map((skill) => (
              <div key={skill}>• {skill}</div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <Section title="Selected Projects">
          {resume.projects.map((project) => (
            <article key={project.id} style={{ marginBottom: 12 }}>
              <div style={positionStyle}>{project.name}</div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: 9.5,
                    color: "#6b7280",
                  }}
                >
                  Technologies: {project.technologies.join(", ")}
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
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 7,
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: 10.5,
              }}
            >
              <span>
                <strong>{item.name}</strong>
                {item.issuer ? ` — ${item.issuer}` : ""}
              </span>

              {item.date && <span style={dateStyle}>{item.date}</span>}
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
    <section style={{ marginTop: 23 }}>
      <h2
        style={{
          margin: "0 0 11px",
          paddingBottom: 5,
          borderBottom: "1px solid #d1d5db",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 10.5,
          fontWeight: 800,
          letterSpacing: "0.13em",
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
  fontSize: 12.5,
  fontWeight: 700,
  color: "#1f2937",
};

const companyStyle: React.CSSProperties = {
  marginTop: 2,
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 10.5,
  color: "#6b7280",
};

const dateStyle: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 9.5,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const bodyText: React.CSSProperties = {
  margin: "6px 0 0",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 10.5,
  color: "#374151",
};

const bulletList: React.CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 18,
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 10.5,
  color: "#374151",
};
