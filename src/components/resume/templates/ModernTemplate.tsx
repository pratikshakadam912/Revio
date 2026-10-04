import type { ResumeTemplateProps } from "./templateTypes";

export default function ModernTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        color: "#172033",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "38px 42px",
        boxSizing: "border-box",
        lineHeight: 1.45,
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          paddingBottom: 18,
          borderBottom: "3px solid #172033",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            {resume.name || "Your Name"}
          </h1>

          {resume.title && (
            <div
              style={{
                marginTop: 7,
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
            textAlign: "right",
            fontSize: 10,
            color: "#4b5563",
            lineHeight: 1.7,
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
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Profile</h2>
          <p style={bodyText}>{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Experience</h2>

          {resume.experience.map((item) => (
            <article key={item.id} style={{ marginBottom: 17 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                <div>
                  <div style={itemTitle}>{item.position}</div>
                  <div style={muted}>
                    {item.company}
                    {item.location ? ` · ${item.location}` : ""}
                  </div>
                </div>

                <div style={dateStyle}>
                  {item.startDate}
                  {item.startDate || item.endDate ? " — " : ""}
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
        </section>
      )}

      {resume.skills.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Skills</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
            }}
          >
            {resume.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: "4px 9px",
                  border: "1px solid #d1d5db",
                  borderRadius: 4,
                  fontSize: 10,
                  color: "#374151",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Projects</h2>

          {resume.projects.map((project) => (
            <article key={project.id} style={{ marginBottom: 12 }}>
              <div style={itemTitle}>{project.name}</div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div style={muted}>{project.technologies.join(" · ")}</div>
              )}
            </article>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Education</h2>

          {resume.education.map((item) => (
            <article key={item.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                <div>
                  <div style={itemTitle}>
                    {item.degree}
                    {item.field ? `, ${item.field}` : ""}
                  </div>

                  <div style={muted}>
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
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
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Certifications</h2>

          {resume.certifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 7,
                fontSize: 10.5,
              }}
            >
              <span>
                <strong>{item.name}</strong>
                {item.issuer ? ` · ${item.issuer}` : ""}
              </span>

              {item.date && <span style={dateStyle}>{item.date}</span>}
            </div>
          ))}
        </section>
      )}

      {resume.achievements.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={sectionTitle}>Achievements</h2>

          <ul style={bulletList}>
            {resume.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  margin: "0 0 10px",
  paddingBottom: 5,
  borderBottom: "1px solid #d1d5db",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#172033",
};

const itemTitle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  color: "#172033",
};

const muted: React.CSSProperties = {
  marginTop: 2,
  fontSize: 10.5,
  color: "#6b7280",
};

const dateStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const bodyText: React.CSSProperties = {
  margin: 0,
  fontSize: 10.5,
  color: "#374151",
};

const bulletList: React.CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 18,
  fontSize: 10.5,
  color: "#374151",
};
