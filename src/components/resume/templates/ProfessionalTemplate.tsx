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

export default function ProfessionalTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: colors.paper,
        color: colors.text,
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "44px 50px",
        boxSizing: "border-box",
        lineHeight: 1.5,
      }}
    >
      <header
        style={{
          textAlign: "center",
          padding: "24px 20px 22px",
          background: colors.ivory,
          borderTop: `4px solid ${colors.sage}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: "0.015em",
            color: colors.text,
          }}
        >
          {resume.name || "Your Name"}
        </h1>

        {resume.title && (
          <div
            style={{
              marginTop: 8,
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: colors.sage,
            }}
          >
            {resume.title}
          </div>
        )}

        <div
          style={{
            width: 42,
            height: 3,
            background: colors.champagne,
            margin: "15px auto 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "5px 13px",
            marginTop: 13,
            fontFamily: "Arial, Helvetica, sans-serif",
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
        <Section title="Professional Profile">
          <p style={bodyText}>{resume.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Professional Experience">
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

      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((item) => (
            <article key={item.id} style={{ marginBottom: 15 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  alignItems: "flex-start",
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

      {resume.skills.length > 0 && (
        <Section title="Core Skills">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              columnGap: 25,
              rowGap: 7,
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: 10.5,
              color: colors.body,
            }}
          >
            {resume.skills.map((skill) => (
              <div key={skill}>
                <span style={{ color: colors.mutedSage }}>•</span> {skill}
              </div>
            ))}
          </div>
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Selected Projects">
          {resume.projects.map((project) => (
            <article key={project.id} style={{ marginBottom: 14 }}>
              <div style={positionStyle}>{project.name}</div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontSize: 9.5,
                    color: colors.mutedSage,
                    marginTop: 5,
                  }}
                >
                  Technologies: {project.technologies.join(", ")}
                </div>
              )}
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
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
                marginBottom: 9,
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: 10.5,
                color: colors.body,
              }}
            >
              <span>
                <strong style={{ color: colors.text }}>{item.name}</strong>
                {item.issuer ? ` — ${item.issuer}` : ""}
              </span>

              {item.date && <span style={dateStyle}>{item.date}</span>}
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
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 8,
            color: colors.muted,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Professional Resume
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 23 }}>
      <h2
        style={{
          margin: "0 0 11px",
          paddingBottom: 7,
          borderBottom: `1px solid ${colors.border}`,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 10,
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
  fontSize: 12.5,
  fontWeight: 700,
  color: colors.text,
};

const companyStyle: CSSProperties = {
  marginTop: 3,
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 10.5,
  color: colors.mutedSage,
};

const dateStyle: CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 9.5,
  color: colors.muted,
  whiteSpace: "nowrap",
};

const bodyText: CSSProperties = {
  margin: "6px 0 0",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 10.5,
  lineHeight: 1.7,
  color: colors.body,
};

const bulletList: CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 18,
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 10.5,
  lineHeight: 1.7,
  color: colors.body,
};
