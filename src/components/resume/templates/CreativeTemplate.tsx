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

export default function CreativeTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: colors.paper,
        color: colors.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: 0,
        boxSizing: "border-box",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "relative",
          padding: "38px 44px 32px",
          background: colors.ivory,
          borderBottom: `1px solid ${colors.border}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 130,
            height: 130,
            borderRadius: "0 0 0 100%",
            background: "rgba(113,150,129,0.09)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 28,
              height: 3,
              borderRadius: 4,
              background: colors.sage,
            }}
          />

          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: colors.mutedSage,
            }}
          >
            Professional Profile
          </div>
        </div>

        <h1
          style={{
            position: "relative",
            margin: 0,
            fontSize: 34,
            lineHeight: 1.12,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: colors.text,
          }}
        >
          {resume.name || "Your Name"}
        </h1>

        {resume.title && (
          <div
            style={{
              marginTop: 10,
              fontSize: 14,
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
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            marginTop: 20,
            fontSize: 9.5,
            color: colors.body,
          }}
        >
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
          {resume.linkedin && <span>{resume.linkedin}</span>}
          {resume.github && <span>{resume.github}</span>}
          {resume.website && <span>{resume.website}</span>}
        </div>

        <div
          style={{
            width: 48,
            height: 3,
            marginTop: 23,
            borderRadius: 4,
            background: colors.champagne,
          }}
        />
      </header>

      {/* Main content */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "155px minmax(0, 1fr)",
          minHeight: 500,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            padding: "30px 22px",
            background: "#FAFAF7",
            borderRight: `1px solid ${colors.border}`,
          }}
        >
          {resume.skills.length > 0 && (
            <SideSection title="Core Skills">
              {resume.skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 7,
                    marginBottom: 9,
                    fontSize: 9.5,
                    color: colors.body,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      marginTop: 5,
                      flexShrink: 0,
                      borderRadius: "50%",
                      background: colors.mutedSage,
                    }}
                  />
                  {skill}
                </div>
              ))}
            </SideSection>
          )}

          {resume.education.length > 0 && (
            <SideSection title="Education">
              {resume.education.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: colors.text,
                    }}
                  >
                    {item.degree}
                  </div>

                  {item.field && (
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 9,
                        color: colors.body,
                      }}
                    >
                      {item.field}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 9,
                      fontWeight: 600,
                      color: colors.sage,
                    }}
                  >
                    {item.institution}
                  </div>

                  {item.location && (
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 8.5,
                        color: colors.muted,
                      }}
                    >
                      {item.location}
                    </div>
                  )}

                  {(item.startDate || item.endDate) && (
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 8.5,
                        color: colors.muted,
                      }}
                    >
                      {item.startDate}
                      {item.startDate && item.endDate ? " — " : ""}
                      {item.endDate}
                    </div>
                  )}
                </div>
              ))}
            </SideSection>
          )}

          {resume.certifications.length > 0 && (
            <SideSection title="Certifications">
              {resume.certifications.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom: 13,
                    fontSize: 9,
                  }}
                >
                  <strong
                    style={{
                      color: colors.text,
                      fontSize: 9.5,
                    }}
                  >
                    {item.name}
                  </strong>

                  {item.issuer && (
                    <div
                      style={{
                        marginTop: 3,
                        color: colors.body,
                      }}
                    >
                      {item.issuer}
                    </div>
                  )}

                  {item.date && (
                    <div
                      style={{
                        marginTop: 2,
                        color: colors.muted,
                      }}
                    >
                      {item.date}
                    </div>
                  )}
                </div>
              ))}
            </SideSection>
          )}
        </aside>

        {/* Main resume sections */}
        <div
          style={{
            padding: "30px 30px 40px",
            minWidth: 0,
          }}
        >
          {resume.summary && (
            <MainSection title="Professional Summary">
              <p style={bodyText}>{resume.summary}</p>
            </MainSection>
          )}

          {resume.experience.length > 0 && (
            <MainSection title="Work Experience">
              {resume.experience.map((item) => (
                <article
                  key={item.id}
                  style={{
                    position: "relative",
                    paddingLeft: 17,
                    marginBottom: 21,
                    borderLeft: `2px solid ${colors.border}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -5,
                      top: 4,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: colors.sage,
                      border: `2px solid ${colors.paper}`,
                      boxSizing: "content-box",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={itemTitle}>{item.position}</div>

                      <div style={muted}>
                        {item.company}
                        {item.location ? ` · ${item.location}` : ""}
                      </div>
                    </div>

                    <div style={dateStyle}>
                      {item.startDate}
                      {(item.startDate || item.endDate || item.current) &&
                        " — "}
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
            </MainSection>
          )}

          {resume.projects.length > 0 && (
            <MainSection title="Selected Projects">
              {resume.projects.map((project) => (
                <article
                  key={project.id}
                  style={{
                    marginBottom: 17,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <div style={itemTitle}>{project.name}</div>

                  {project.description && (
                    <p style={bodyText}>{project.description}</p>
                  )}

                  {project.technologies.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                        marginTop: 8,
                      }}
                    >
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          style={{
                            padding: "3px 7px",
                            borderRadius: 4,
                            background: colors.softSage,
                            color: colors.sage,
                            fontSize: 8,
                            fontWeight: 600,
                          }}
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}

                  {(project.url || project.github) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px 12px",
                        marginTop: 7,
                        fontSize: 8.5,
                        color: colors.mutedSage,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {project.url && <span>{project.url}</span>}
                      {project.github && <span>{project.github}</span>}
                    </div>
                  )}
                </article>
              ))}
            </MainSection>
          )}

          {resume.achievements.length > 0 && (
            <MainSection title="Achievements">
              <ul style={bulletList}>
                {resume.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </MainSection>
          )}
        </div>
      </main>

      {/* Footer accent */}
      <footer
        style={{
          height: 5,
          background: `linear-gradient(to right, ${colors.sage}, ${colors.mutedSage}, ${colors.champagne})`,
        }}
      />
    </div>
  );
}

function SideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 27 }}>
      <h2
        style={{
          margin: "0 0 14px",
          paddingBottom: 8,
          borderBottom: `1px solid ${colors.border}`,
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.14em",
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

function MainSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 26 }}>
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          margin: "0 0 15px",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.11em",
          textTransform: "uppercase",
          color: colors.sage,
        }}
      >
        <span
          style={{
            width: 19,
            height: 2,
            borderRadius: 4,
            background: colors.mutedSage,
            display: "inline-block",
            flexShrink: 0,
          }}
        />

        {title}
      </h2>

      {children}
    </section>
  );
}

const itemTitle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: colors.text,
};

const muted: CSSProperties = {
  marginTop: 4,
  fontSize: 9.5,
  color: colors.body,
};

const dateStyle: CSSProperties = {
  flexShrink: 0,
  fontSize: 8.5,
  color: colors.muted,
  whiteSpace: "nowrap",
};

const bodyText: CSSProperties = {
  margin: 0,
  fontSize: 10,
  lineHeight: 1.65,
  color: colors.body,
};

const bulletList: CSSProperties = {
  margin: "8px 0 0",
  paddingLeft: 17,
  fontSize: 9.5,
  lineHeight: 1.65,
  color: colors.body,
};
