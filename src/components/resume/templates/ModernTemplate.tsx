import type { CSSProperties } from "react";
import type { ResumeTemplateProps } from "./templateTypes";

const colors = {
  paper: "#FFFFFF",
  ivory: "#F7F5EF",
  sage: "#315E50",
  mutedSage: "#719681",
  champagne: "#D9C5A2",
  text: "#263B33",
  body: "#59665E",
  muted: "#858A83",
  border: "#E7E5DC",
  softSage: "#F0F4EF",
};

export default function ModernTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: colors.paper,
        color: colors.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "38px 42px",
        boxSizing: "border-box",
        lineHeight: 1.5,
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 24,
          padding: "23px 24px",
          background: colors.ivory,
          borderTop: `4px solid ${colors.sage}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: colors.mutedSage,
              marginBottom: 9,
            }}
          >
            Professional Profile
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 30,
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              color: colors.text,
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
                color: colors.sage,
              }}
            >
              {resume.title}
            </div>
          )}

          <div
            style={{
              width: 38,
              height: 3,
              background: colors.champagne,
              marginTop: 15,
            }}
          />
        </div>

        <div
          style={{
            textAlign: "right",
            fontSize: 9.5,
            color: colors.body,
            lineHeight: 1.85,
            overflowWrap: "anywhere",
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
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Profile</h2>
          <p style={bodyText}>{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Experience</h2>

          {resume.experience.map((item) => (
            <article key={item.id} style={articleStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  alignItems: "flex-start",
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
        <section style={sectionStyle}>
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
                  padding: "5px 10px",
                  background: colors.softSage,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 3,
                  fontSize: 9.5,
                  color: colors.sage,
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Projects</h2>

          {resume.projects.map((project) => (
            <article key={project.id} style={articleStyle}>
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
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Education</h2>

          {resume.education.map((item) => (
            <article key={item.id} style={articleStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  alignItems: "flex-start",
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
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Certifications</h2>

          {resume.certifications.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 9,
                fontSize: 10.5,
                color: colors.body,
              }}
            >
              <span>
                <strong style={{ color: colors.text }}>{item.name}</strong>
                {item.issuer ? ` · ${item.issuer}` : ""}
              </span>

              {item.date && <span style={dateStyle}>{item.date}</span>}
            </div>
          ))}
        </section>
      )}

      {resume.achievements.length > 0 && (
        <section style={sectionStyle}>
          <h2 style={sectionTitle}>Achievements</h2>

          <ul style={bulletList}>
            {resume.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>
      )}

      <footer
        style={{
          marginTop: 28,
          paddingTop: 10,
          borderTop: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 8,
            color: colors.muted,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Modern Resume
        </span>
        <span
          style={{
            width: 28,
            height: 2,
            background: colors.champagne,
          }}
        />
      </footer>
    </div>
  );
}

const sectionStyle: CSSProperties = {
  marginTop: 22,
};

const sectionTitle: CSSProperties = {
  margin: "0 0 11px",
  paddingBottom: 7,
  borderBottom: `1px solid ${colors.border}`,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: colors.sage,
};

const articleStyle: CSSProperties = {
  marginBottom: 16,
};

const itemTitle: CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  color: colors.text,
};

const muted: CSSProperties = {
  marginTop: 3,
  fontSize: 10.5,
  color: colors.mutedSage,
  fontWeight: 500,
};

const dateStyle: CSSProperties = {
  fontSize: 9.5,
  color: colors.muted,
  whiteSpace: "nowrap",
};

const bodyText: CSSProperties = {
  margin: "5px 0 0",
  fontSize: 10.5,
  lineHeight: 1.7,
  color: colors.body,
};

const bulletList: CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 18,
  fontSize: 10,
  lineHeight: 1.7,
  color: colors.body,
};
