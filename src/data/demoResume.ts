import type { ResumeData } from "@/types/resume";

export const demoResume: ResumeData = {
  personal: {
    name: "Alex Morgan",
    title: "Full Stack Developer",
    email: "alex.morgan@email.com",
    phone: "+1 415 555 0198",
    location: "San Francisco, CA",
    website: "github.com/alexmorgan",
  },

  summary:
    "Full Stack Developer with experience building scalable web applications using React, Next.js, Node.js, and PostgreSQL. Passionate about creating reliable products, clean interfaces, and AI-powered experiences.",

  experience: [
    {
      company: "Northstar Technologies",
      role: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "2024",
      endDate: "Present",
      description: [
        "Built and maintained full-stack applications using React, Next.js, Node.js, and PostgreSQL.",
        "Developed reusable UI components and REST APIs that improved product development speed.",
        "Collaborated with product and design teams to deliver user-focused features.",
      ],
    },
    {
      company: "Pixel Labs",
      role: "Frontend Developer",
      location: "Remote",
      startDate: "2022",
      endDate: "2024",
      description: [
        "Developed responsive web interfaces using React and TypeScript.",
        "Improved application performance and accessibility across core product pages.",
      ],
    },
  ],

  projects: [
    {
      name: "AI Resume Platform",
      description:
        "Built an AI-powered resume platform that helps users create, improve, and optimize resumes for modern hiring workflows.",
      technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "AI"],
      link: "github.com/alexmorgan/resume-ai",
    },
    {
      name: "E-commerce Platform",
      description:
        "Developed a full-stack e-commerce application with authentication, product management, shopping cart, and secure API architecture.",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      link: "github.com/alexmorgan/shop",
    },
  ],

  education: [
    {
      institution: "University of California",
      degree: "B.S. Computer Science",
      location: "Berkeley, CA",
      startDate: "2018",
      endDate: "2022",
    },
  ],

  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "Prisma",
    "Git",
    "AI / ML",
  ],

  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
    },
  ],
};
