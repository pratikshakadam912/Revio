import type { ResumeTemplateProps } from "./templateTypes";

export default function CreativeTemplate({ resume }: ResumeTemplateProps) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        color: "#1f2937",
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: 0,
        boxSizing: "border-box",
        lineHeight: 1.45,
      }}
    >
      {/* Creative header */}
      <header
        style={{
          padding: "38px 44px 30px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 13,
          }}
        >
          <div
            style={{
              width: 38,
              height: 4,
              background: "#111827",
            }}
          />

          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Resume
          </div>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 34,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {resume.name || "Your Name"}
        </h1>

        {resume.title && (
          <div
            style={{
              marginTop: 9,
              fontSize: 14,
              fontWeight: 600,
              color: "#6b7280",
            }}
          >
            {resume.title}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px 14px",
            marginTop: 14,
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

      <main
        style={{
          display: "grid",
          gridTemplateColumns: "155px 1fr",
          minHeight: 500,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            padding: "28px 22px",
            borderRight: "1px solid #e5e7eb",
          }}
        >
          {resume.skills.length > 0 && (
            <SideSection title="Skills">
              {resume.skills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    fontSize: 9.5,
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
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
                    marginBottom: 13,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {item.degree}
                  </div>

                  {item.field && (
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 9,
                        color: "#6b7280",
                      }}
                    >
                      {item.field}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 9,
                      color: "#6b7280",
                    }}
                  >
                    {item.institution}
                  </div>

                  {item.endDate && (
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 8.5,
                        color: "#9ca3af",
                      }}
                    >
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
                    marginBottom: 10,
                    fontSize: 9,
                  }}
                >
                  <strong>{item.name}</strong>

                  {item.issuer && (
                    <div
                      style={{
                        marginTop: 2,
                        color: "#6b7280",
                      }}
                    >
                      {item.issuer}
                    </div>
                  )}

                  {item.date && (
                    <div
                      style={{
                        marginTop: 1,
                        color: "#9ca3af",
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

        {/* Main content */}
        <div
          style={{
            padding: "28px 30px 40px",
          }}
        >
          {resume.summary && (
            <MainSection title="About">
              <p style={bodyText}>{resume.summary}</p>
            </MainSection>
          )}

          {resume.experience.length > 0 && (
            <MainSection title="Experience">
              {resume.experience.map((item) => (
                <article
                  key={item.id}
                  style={{
                    position: "relative",
                    paddingLeft: 17,
                    marginBottom: 19,
                    borderLeft: "2px solid #d1d5db",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -5,
                      top: 3,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#111827",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 15,
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
            </MainSection>
          )}

          {resume.projects.length > 0 && (
            <MainSection title="Projects">
              {resume.projects.map((project) => (
                <article
                  key={project.id}
                  style={{
                    marginBottom: 14,
                  }}
                >
                  <div style={itemTitle}>{project.name}</div>

                  {project.description && (
                    <p style={bodyText}>{project.description}</p>
                  )}

                  {project.technologies.length > 0 && (
                    <div style={muted}>{project.technologies.join(" · ")}</div>
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
    </div>
  );
}

function SideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 26 }}>
      <h2
        style={{
          margin: "0 0 12px",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#111827",
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
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 25 }}>
      <h2
        style={{
          margin: "0 0 12px",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#111827",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 20,
            height: 2,
            background: "#111827",
            display: "inline-block",
          }}
        />

        {title}
      </h2>

      {children}
    </section>
  );
}

const itemTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#111827",
};

const muted: React.CSSProperties = {
  marginTop: 3,
  fontSize: 9.5,
  color: "#6b7280",
};

const dateStyle: React.CSSProperties = {
  fontSize: 8.5,
  color: "#9ca3af",
  whiteSpace: "nowrap",
};

const bodyText: React.CSSProperties = {
  margin: 0,
  fontSize: 10,
  color: "#374151",
};

const bulletList: React.CSSProperties = {
  margin: "7px 0 0",
  paddingLeft: 17,
  fontSize: 9.5,
  color: "#374151",
};
