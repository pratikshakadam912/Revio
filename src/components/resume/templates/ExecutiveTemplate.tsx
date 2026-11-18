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

export default function ExecutiveTemplate({ resume }: ResumeTemplateProps) {
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
          display: "grid",
          gridTemplateColumns: "1fr 190px",
          gap: 28,
          padding: "25px 26px 24px",
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
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: colors.mutedSage,
              marginBottom: 11,
            }}
          >
            Executive Profile
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 31,
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
                marginTop: 9,
                fontSize: 13,
                fontWeight: 600,
                color: colors.sage,
                letterSpacing: "0.015em",
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
              marginTop: 17,
            }}
          />
        </div>

        <div
          style={{
            borderLeft: `1px solid ${colors.border}`,
            paddingLeft: 18,
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
                marginBottom: 21,
              }}
            >
              <div
                style={{
                  borderLeft: `2px solid ${colors.champagne}`,
                  paddingLeft: 11,
                }}
              >
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
                      color: colors.muted,
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
          alignItems: "start",
        }}
      >
        {resume.skills.length > 0 && (
          <Section title="Core Competencies">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 9,
                fontSize: 10,
              }}
            >
              {resume.skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "5px 0",
                    borderBottom: `1px solid ${colors.border}`,
                    color: colors.body,
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
                      fontSize: 9.5,
                      color: colors.muted,
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
                marginBottom: 15,
                paddingLeft: 13,
                borderLeft: `2px solid ${colors.champagne}`,
              }}
            >
              <div style={positionStyle}>{project.name}</div>

              {project.description && (
                <p style={bodyText}>{project.description}</p>
              )}

              {project.technologies.length > 0 && (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 9.5,
                    color: colors.mutedSage,
                    fontWeight: 600,
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
              gap: 12,
              fontSize: 10,
            }}
          >
            {resume.certifications.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "9px 11px",
                  background: colors.ivory,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <strong style={{ color: colors.text }}>{item.name}</strong>
                {item.issuer && (
                  <div style={{ marginTop: 3, color: colors.body }}>
                    {item.issuer}
                  </div>
                )}
                {item.date && (
                  <span
                    style={{
                      display: "block",
                      marginTop: 3,
                      fontSize: 9,
                      color: colors.muted,
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

      <footer
        style={{
          marginTop: 30,
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
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Executive Profile
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
          margin: "0 0 12px",
          paddingBottom: 8,
          borderBottom: `1px solid ${colors.border}`,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.17em",
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
  fontSize: 12,
  fontWeight: 700,
  color: colors.text,
};

const companyStyle: CSSProperties = {
  marginTop: 3,
  fontSize: 10.5,
  fontWeight: 600,
  color: colors.mutedSage,
};

const dateStyle: CSSProperties = {
  fontSize: 9.5,
  color: colors.muted,
  lineHeight: 1.6,
};

const bodyText: CSSProperties = {
  margin: "6px 0 0",
  fontSize: 10.5,
  lineHeight: 1.7,
  color: colors.body,
};

const bulletList: CSSProperties = {
  margin: "8px 0 0",
  paddingLeft: 18,
  fontSize: 10.5,
  lineHeight: 1.7,
  color: colors.body,
};
