import type { CSSProperties, ReactNode } from "react";
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

export default function MinimalTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: colors.paper,
        color: colors.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "42px 48px",
        boxSizing: "border-box",
        lineHeight: 1.5,
      }}
    >
      <header
        style={{
          padding: "22px 24px",
          background: colors.ivory,
          borderTop: `3px solid ${colors.sage}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.12,
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
              fontSize: 13,
              color: colors.sage,
              fontWeight: 600,
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
            marginTop: 14,
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px 13px",
            marginTop: 13,
            fontSize: 9.5,
            color: colors.body,
            overflowWrap: "anywhere",
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

      {resume.summary && (
        <Section title="Summary">
          <p style={bodyText}>{resume.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Experience">
          {resume.experience.map((item) => (
            <article key={item.id} style={{ marginBottom: 19 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={positionStyle}>{item.position}</div>

                  <div style={companyStyle}>
                    {item.company}
                    {item.location ? ` · ${item.location}` : ""}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 9,
                    color: colors.muted,
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

      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((item) => (
            <article key={item.id} style={{ marginBottom: 14 }}>
              <div style={positionStyle}>
                {item.degree}
                {item.field ? `, ${item.field}` : ""}
              </div>

              <div style={companyStyle}>{item.institution}</div>

              {(item.startDate || item.endDate) && (
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 9,
                    color: colors.muted,
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

      {resume.skills.length > 0 && (
        <Section title="Skills">
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
                  fontSize: 9,
                  color: colors.sage,
                  fontWeight: 600,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((project) => (
            <article key={project.id} style={{ marginBottom: 14 }}>
              <div style={positionStyle}>{project.name}</div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div style={metaText}>{project.technologies.join(" · ")}</div>
              )}

              {project.url && <div style={metaText}>{project.url}</div>}

              {project.github && <div style={metaText}>{project.github}</div>}
            </article>
          ))}
        </Section>
      )}

      {resume.certifications.length > 0 && (
        <Section title="Certifications">
          {resume.certifications.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: 9,
                fontSize: 10,
                color: colors.body,
              }}
            >
              <strong style={{ color: colors.text }}>{item.name}</strong>

              {item.issuer && <span> — {item.issuer}</span>}

              {item.date && (
                <span style={{ marginLeft: 5, color: colors.muted }}>
                  ({item.date})
                </span>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.achievements.length > 0 && (
        <Section title="Achievements">
          <ul style={bulletList}>
            {resume.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </Section>
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
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Professional Resume
        </span>
        <span
          style={{
            width: 26,
            height: 2,
            background: colors.champagne,
          }}
        />
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2
        style={{
          margin: "0 0 11px",
          paddingBottom: 7,
          borderBottom: `1px solid ${colors.border}`,
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: colors.sage,
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

const positionStyle: CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  color: colors.text,
};

const companyStyle: CSSProperties = {
  marginTop: 3,
  fontSize: 10,
  color: colors.mutedSage,
  fontWeight: 600,
};

const bodyText: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 10,
  lineHeight: 1.7,
  color: colors.body,
};

const metaText: CSSProperties = {
  marginTop: 4,
  fontSize: 9,
  color: colors.muted,
  overflowWrap: "anywhere",
};

const bulletList: CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 17,
  fontSize: 9.5,
  lineHeight: 1.7,
  color: colors.body,
};
