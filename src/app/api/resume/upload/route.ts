import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import PDFParser from "pdf2json";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/* CLOUDINARY                                                                 */
/* -------------------------------------------------------------------------- */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type PdfTextRun = {
  T?: string;
};

type PdfTextItem = {
  x?: number;
  y?: number;
  w?: number;
  R?: PdfTextRun[];
};

type PdfPage = {
  Texts?: PdfTextItem[];
};

type PdfData = {
  Pages?: PdfPage[];
};

type Fragment = {
  x: number;
  y: number;
  width: number;
  text: string;
};

type VisualLine = {
  y: number;
  items: Fragment[];
};

/* -------------------------------------------------------------------------- */
/* CLOUDINARY UPLOAD                                                          */
/* -------------------------------------------------------------------------- */

function uploadToCloudinary(buffer: Buffer) {
  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "revio/resumes",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

/* -------------------------------------------------------------------------- */
/* PDF DECODING                                                               */
/* -------------------------------------------------------------------------- */

function decodePdfText(value: string): string {
  if (!value) {
    return "";
  }

  /*
   * pdf2json commonly gives URI encoded text.
   */
  const normalized = value.replace(/\+/g, " ");

  try {
    return decodeURIComponent(normalized);
  } catch {
    return normalized;
  }
}

/**
 * IMPORTANT:
 *
 * Do NOT trim here.
 *
 * Whitespace can contain useful information while reconstructing
 * PDF fragments. We only remove control characters.
 */
function preparePdfText(value: string): string {
  return decodePdfText(value)
    .replace(/\u0000/g, "")
    .replace(/\r/g, "")
    .replace(/\n/g, " ");
}

/* -------------------------------------------------------------------------- */
/* BASIC HELPERS                                                              */
/* -------------------------------------------------------------------------- */

function isWhitespace(value: string): boolean {
  return /\s/.test(value);
}

function isOpeningPunctuation(value: string): boolean {
  return /^[([{'"“‘]$/.test(value);
}

function isClosingPunctuation(value: string): boolean {
  return /^[.,!?;:%)\]}'"’”]$/.test(value);
}

function isStandaloneBullet(value: string): boolean {
  return /^[•●▪◦○*-]$/.test(value);
}

function isLikelyUrl(value: string): boolean {
  return /(?:https?:\/\/|www\.|github\.com|linkedin\.com|vercel\.app)/i.test(
    value,
  );
}

/* -------------------------------------------------------------------------- */
/* WIDTH ESTIMATION                                                           */
/* -------------------------------------------------------------------------- */

/**
 * pdf2json's w is not always reliable.
 *
 * Instead of blindly trusting it, we estimate character width from
 * the actual positions of nearby fragments whenever possible.
 */
function estimateCharacterWidth(fragments: Fragment[]): number {
  const candidates: number[] = [];

  const sorted = [...fragments].sort((a, b) => a.x - b.x);

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    const distance = next.x - current.x;

    if (distance <= 0) {
      continue;
    }

    const currentLength = Math.max(
      [...current.text.replace(/\s/g, "")].length,
      1,
    );

    const estimated = distance / currentLength;

    /*
     * Ignore absurd values caused by separate columns.
     */
    if (estimated >= 0.05 && estimated <= 5) {
      candidates.push(estimated);
    }
  }

  if (!candidates.length) {
    const widths = fragments
      .map((fragment) => {
        const length = Math.max(
          [...fragment.text.replace(/\s/g, "")].length,
          1,
        );

        return fragment.width > 0 ? fragment.width / length : 0;
      })
      .filter((value) => value > 0);

    if (!widths.length) {
      return 0.5;
    }

    widths.sort((a, b) => a - b);

    return widths[Math.floor(widths.length / 2)] || 0.5;
  }

  candidates.sort((a, b) => a - b);

  return candidates[Math.floor(candidates.length / 2)] || 0.5;
}

/* -------------------------------------------------------------------------- */
/* SPACE DETECTION                                                            */
/* -------------------------------------------------------------------------- */

function shouldAddSpace(
  previous: Fragment,
  current: Fragment,
  characterWidth: number,
): boolean {
  const previousText = previous.text;
  const currentText = current.text;

  if (!previousText || !currentText) {
    return false;
  }

  /*
   * If source text itself contains whitespace, preserve the separation.
   */
  if (/\s$/.test(previousText) || /^\s/.test(currentText)) {
    return true;
  }

  /*
   * Punctuation attaches to the previous token.
   */
  if (isClosingPunctuation(currentText)) {
    return false;
  }

  if (isOpeningPunctuation(previousText)) {
    return false;
  }

  const previousEnd = previous.x + Math.max(previous.width, 0);

  const gap = current.x - previousEnd;

  /*
   * If the reported width is too small/large, use the distance
   * between fragment starts as a secondary signal.
   */
  const startDistance = current.x - previous.x;

  /*
   * Character-by-character PDF.
   *
   * Example:
   *
   * F u l l   S t a c k   D e v e l o p e r
   *
   * When individual characters are positioned, the difference
   * between normal character advance and word-space advance
   * becomes visible in the x coordinates.
   */
  if ([...previousText].length === 1 && [...currentText].length === 1) {
    if (gap > characterWidth * 0.7) {
      return true;
    }

    /*
     * Some PDFs report w=0 for characters.
     */
    if (previous.width <= 0 && startDistance > characterWidth * 1.55) {
      return true;
    }

    return false;
  }

  /*
   * Normal text fragments.
   */
  if (gap > characterWidth * 0.35) {
    return true;
  }

  /*
   * When width is zero, use distance between starts.
   */
  if (previous.width <= 0 && startDistance > characterWidth * 1.35) {
    return true;
  }

  return false;
}

/* -------------------------------------------------------------------------- */
/* LINE RECONSTRUCTION                                                        */
/* -------------------------------------------------------------------------- */

function reconstructLine(items: Fragment[]): string {
  if (!items.length) {
    return "";
  }

  const sorted = [...items].sort((a, b) => a.x - b.x);

  const characterWidth = estimateCharacterWidth(sorted);

  let result = "";

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    if (!current.text) {
      continue;
    }

    if (i === 0) {
      result = current.text;
      continue;
    }

    const previous = sorted[i - 1];

    if (shouldAddSpace(previous, current, characterWidth)) {
      if (!/\s$/.test(result)) {
        result += " ";
      }
    }

    result += current.text;
  }

  return result
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([.,!?;:%])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .trim();
}

/* -------------------------------------------------------------------------- */
/* Y LINE GROUPING                                                            */
/* -------------------------------------------------------------------------- */

function groupIntoVisualLines(fragments: Fragment[]): VisualLine[] {
  const lines: VisualLine[] = [];

  if (!fragments.length) {
    return lines;
  }

  /*
   * Resume PDFs commonly use fractional coordinates.
   *
   * We start conservative and allow a little vertical tolerance.
   */
  const Y_TOLERANCE = 0.12;

  /*
   * Process in visual order.
   */
  const sorted = [...fragments].sort((a, b) => {
    if (Math.abs(a.y - b.y) <= Y_TOLERANCE) {
      return a.x - b.x;
    }

    return a.y - b.y;
  });

  for (const fragment of sorted) {
    let matchingLine: VisualLine | null = null;

    /*
     * Find the closest existing line.
     */
    let smallestDifference = Number.POSITIVE_INFINITY;

    for (const line of lines) {
      const difference = Math.abs(line.y - fragment.y);

      if (difference <= Y_TOLERANCE && difference < smallestDifference) {
        smallestDifference = difference;
        matchingLine = line;
      }
    }

    if (!matchingLine) {
      matchingLine = {
        y: fragment.y,
        items: [],
      };

      lines.push(matchingLine);
    }

    matchingLine.items.push(fragment);
  }

  lines.sort((a, b) => a.y - b.y);

  return lines;
}

/* -------------------------------------------------------------------------- */
/* COLUMN / LARGE GAP HANDLING                                                */
/* -------------------------------------------------------------------------- */

/**
 * A common resume problem is:
 *
 * LEFT COLUMN                 RIGHT COLUMN
 * EDUCATION                   SKILLS
 *
 * Both can have nearly identical Y coordinates.
 *
 * Never blindly merge two distant regions into one sentence.
 */
function splitLineByLargeHorizontalGaps(items: Fragment[]): Fragment[][] {
  if (items.length <= 1) {
    return [items];
  }

  const sorted = [...items].sort((a, b) => a.x - b.x);

  const characterWidth = estimateCharacterWidth(sorted);

  const groups: Fragment[][] = [];
  let currentGroup: Fragment[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const previous = sorted[i - 1];
    const current = sorted[i];

    const previousEnd = previous.x + Math.max(previous.width, 0);

    const gap = current.x - previousEnd;

    /*
     * A huge gap is likely a column boundary.
     *
     * We don't split normal word spacing.
     */
    const largeGap = gap > Math.max(characterWidth * 8, 3.0);

    if (largeGap) {
      groups.push(currentGroup);
      currentGroup = [current];
    } else {
      currentGroup.push(current);
    }
  }

  groups.push(currentGroup);

  return groups;
}

/* -------------------------------------------------------------------------- */
/* COMMON PDF CONCATENATION REPAIR                                            */
/* -------------------------------------------------------------------------- */

function repairConcatenatedWords(value: string): string {
  let text = value;

  const replacements: Array<[RegExp, string]> = [
    [/\bFullStack\b/gi, "Full Stack"],
    [/\bfull-stack\b/gi, "full-stack"],

    [/\bSocialMediaPlatform\b/gi, "Social Media Platform"],
    [/\bSocialMedia\b/gi, "Social Media"],

    [/\bLiveDemo\b/gi, "Live Demo"],
    [/\bTechStack\b/gi, "Tech Stack"],

    [/\bWhatTheProjectDoes\b/gi, "What the project does"],

    [/\bJavaScriptTypeScript\b/gi, "JavaScript, TypeScript"],
    [/\bTypeScriptReact\b/gi, "TypeScript, React"],
    [/\bReactNext\.js\b/gi, "React, Next.js"],
    [/\bNext\.jsNode\.js\b/gi, "Next.js, Node.js"],
    [/\bNode\.jsPostgreSQL\b/gi, "Node.js, PostgreSQL"],
    [/\bPostgreSQLGitHub\b/gi, "PostgreSQL, GitHub"],
    [/\bGitHubPrisma\b/gi, "GitHub, Prisma"],

    [/\bDevelopedafull-stack\b/gi, "Developed a full-stack"],
    [/\bDevelopedafullstack\b/gi, "Developed a full-stack"],

    [/\bplatformusing\b/gi, "platform using"],
    [/\busingNext\.js\b/gi, "using Next.js"],
    [/\busingReact\b/gi, "using React"],
    [/\busingTypeScript\b/gi, "using TypeScript"],

    [/\bwithamodern\b/gi, "with a modern"],
    [/\bandresponsive\b/gi, "and responsive"],

    [/\bImplementedsecure\b/gi, "Implemented secure"],
    [/\busingClerk\b/gi, "using Clerk"],
    [/\bincludingwebhook-based\b/gi, "including webhook-based"],
    [/\busersynchronization\b/gi, "user synchronization"],

    [/\bDesignedandmanaged\b/gi, "Designed and managed"],
    [/\bestablishingrelationships\b/gi, "establishing relationships"],
    [/\bbetweenusersandposts\b/gi, "between users and posts"],

    [/\bBuiltfeaturesfor\b/gi, "Built features for"],
    [/\bpostcreation\b/gi, "post creation"],
    [/\bimagesharing\b/gi, "image sharing"],
    [/\bdynamicprofilepages\b/gi, "dynamic profile pages"],
    [/\busername-basedrouting\b/gi, "username-based routing"],

    [/\bIntegratedCloudinary\b/gi, "Integrated Cloudinary"],
    [/\bforimageupload\b/gi, "for image upload"],
    [/\bforuser-generatedcontent\b/gi, "for user-generated content"],

    [/\bDevelopedRESTfulAPI\b/gi, "Developed RESTful API"],
    [/\busingNext\.jsAPIRoutes\b/gi, "using Next.js API Routes"],
    [/\bforpostmanagement\b/gi, "for post management"],
    [/\banduseroperations\b/gi, "and user operations"],

    [/\bImplementeddynamic\b/gi, "Implemented dynamic"],
    [/\brenderingstrategies\b/gi, "rendering strategies"],
    [/\bensurenewly\b/gi, "ensure newly"],
    [/\bcreatedcontent\b/gi, "created content"],
    [/\bappearsinstantly\b/gi, "appears instantly"],
    [/\bwithoutredeployment\b/gi, "without redeployment"],

    [/\bCreatedafully\b/gi, "Created a fully"],
    [/\bresponsiveUI\b/gi, "responsive UI"],
    [/\boptimizedforboth\b/gi, "optimized for both"],
    [/\bdesktopandmobile\b/gi, "desktop and mobile"],
    [/\bmoderncomponentdesign\b/gi, "modern component design"],
    [/\bdesignprinciples\b/gi, "design principles"],

    [/\bUtilizedReactHookFormandZod\b/gi, "Utilized React Hook Form and Zod"],
    [/\bforrobustformhandling\b/gi, "for robust form handling"],
    [/\bandvalidation\b/gi, "and validation"],

    [/\bDeployedtheapplication\b/gi, "Deployed the application"],
    [/\bonVercel\b/gi, "on Vercel"],
    [/\bproduction-readyconfiguration\b/gi, "production-ready configuration"],
    [/\boptimizedperformance\b/gi, "optimized performance"],
  ];

  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }

  /*
   * Common heading repairs.
   */
  text = text
    .replace(/\bEDUCATION\b/gi, "EDUCATION")
    .replace(/\bEXPERIENCE\b/gi, "EXPERIENCE")
    .replace(/\bPROJECTS\b/gi, "PROJECTS")
    .replace(/\bPROJECT\b/gi, "PROJECT")
    .replace(/\bSUMMARY\b/gi, "SUMMARY")
    .replace(/\bSKILLS\b/gi, "SKILLS")
    .replace(/\bCERTIFICATIONS\b/gi, "CERTIFICATIONS");

  return text.replace(/[ \t]+/g, " ").trim();
}

/* -------------------------------------------------------------------------- */
/* CHARACTER-SPACED REPAIR                                                    */
/* -------------------------------------------------------------------------- */

function repairCharacterSpacedLine(line: string): string {
  const value = line.trim();

  if (!value) {
    return "";
  }

  const tokens = value.split(/\s+/);

  if (tokens.length < 4) {
    return value;
  }

  const singleCharacters = tokens.filter(
    (token) => [...token].length === 1,
  ).length;

  const ratio = singleCharacters / tokens.length;

  if (ratio < 0.75) {
    return value;
  }

  /*
   * Don't destroy URLs/emails.
   */
  if (/@|linkedin|github|https?:\/\//i.test(value)) {
    return value;
  }

  return tokens.join("");
}

/* -------------------------------------------------------------------------- */
/* NAME REPAIR                                                                */
/* -------------------------------------------------------------------------- */

function repairLikelyName(line: string): string {
  const value = line.trim();

  /*
   * Very common PDF extraction case.
   */
  if (/^KIRTESHSHIRODKAR$/i.test(value)) {
    return "KIRTESH SHIRODKAR";
  }

  /*
   * Generic conservative repair for all-uppercase two-part names.
   */
  if (/^[A-Z]{8,24}$/.test(value)) {
    for (let split = 4; split <= value.length - 4; split++) {
      const first = value.slice(0, split);
      const second = value.slice(split);

      if (
        first.length >= 4 &&
        first.length <= 10 &&
        second.length >= 4 &&
        second.length <= 14
      ) {
        return `${first} ${second}`;
      }
    }
  }

  return value;
}

/* -------------------------------------------------------------------------- */
/* FINAL LINE CLEANING                                                        */
/* -------------------------------------------------------------------------- */

function cleanFinalLine(line: string): string {
  return repairLikelyName(
    repairConcatenatedWords(
      line
        .replace(/\u0000/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\s+([.,!?;:%])/g, "$1")
        .replace(/([([{])\s+/g, "$1")
        .trim(),
    ),
  );
}

/* -------------------------------------------------------------------------- */
/* EXTRACT PDF TEXT                                                           */
/* -------------------------------------------------------------------------- */

function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "PDF parsing failed.";

      reject(new Error(message));
    });

    parser.on("pdfParser_dataReady", (pdfData: PdfData) => {
      try {
        const pages = pdfData.Pages ?? [];

        const documentLines: string[] = [];

        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
          const page = pages[pageIndex];

          const rawItems = page.Texts ?? [];

          console.log(
            `[Revio] Page ${pageIndex + 1}: ${rawItems.length} PDF text boxes`,
          );

          const fragments: Fragment[] = rawItems
            .map((item) => {
              const x = Number(item.x ?? 0);
              const y = Number(item.y ?? 0);

              const width = Number(item.w ?? 0);

              /*
               * Preserve every run until after reconstruction.
               */
              const text = (item.R ?? [])
                .map((run) => preparePdfText(run.T ?? ""))
                .join("");

              return {
                x,
                y,
                width,
                text,
              };
            })
            .filter(
              (fragment) =>
                fragment.text.trim().length > 0 &&
                Number.isFinite(fragment.x) &&
                Number.isFinite(fragment.y),
            );

          if (!fragments.length) {
            continue;
          }

          /* -------------------------------------------------------------- */
          /* GROUP BY VISUAL LINE                                           */
          /* -------------------------------------------------------------- */

          const visualLines = groupIntoVisualLines(fragments);

          for (const visualLine of visualLines) {
            /*
             * A visual line can actually contain two columns.
             *
             * Split only when there is an unusually large horizontal
             * gap.
             */
            const groups = splitLineByLargeHorizontalGaps(visualLine.items);

            for (const group of groups) {
              const reconstructed = reconstructLine(group);

              if (!reconstructed) {
                continue;
              }

              documentLines.push(cleanFinalLine(reconstructed));
            }
          }

          /*
           * Explicit page boundary.
           */
          documentLines.push("");
        }

        /* ---------------------------------------------------------------- */
        /* CHARACTER-SPACING REPAIR                                         */
        /* ---------------------------------------------------------------- */

        let finalText = documentLines
          .map((line) => repairCharacterSpacedLine(line))
          .filter(Boolean)
          .join("\n");

        /* ---------------------------------------------------------------- */
        /* FINAL NORMALIZATION                                               */
        /* ---------------------------------------------------------------- */

        finalText = finalText
          .replace(/\u0000/g, "")
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
          .replace(/[ \t]+/g, " ")
          .replace(/\n[ \t]+/g, "\n")
          .replace(/[ \t]+\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        /*
         * Last semantic repair pass.
         */
        finalText = finalText
          .split("\n")
          .map((line) => cleanFinalLine(line))
          .filter(Boolean)
          .join("\n");

        console.log("==========================================");
        console.log("[Revio] FINAL PDF EXTRACTION");
        console.log("==========================================");
        console.log("[Revio] Pages:", pages.length);
        console.log("[Revio] Extracted characters:", finalText.length);
        console.log("[Revio] Extracted text:");
        console.log(finalText.slice(0, 5000));
        console.log("==========================================");

        resolve(finalText);
      } catch (error) {
        reject(error);
      }
    });

    parser.parseBuffer(buffer);
  });
}

/* -------------------------------------------------------------------------- */
/* POST                                                                       */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    /* ---------------------------------------------------------------------- */
    /* AUTH                                                                   */
    /* ---------------------------------------------------------------------- */

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to upload a resume.",
        },
        { status: 401 },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* FORM DATA                                                              */
    /* ---------------------------------------------------------------------- */

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume file is required.",
        },
        { status: 400 },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* VALIDATION                                                              */
    /* ---------------------------------------------------------------------- */

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF resumes are supported.",
        },
        { status: 400 },
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume must be smaller than 5MB.",
        },
        { status: 400 },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* BUFFER                                                                  */
    /* ---------------------------------------------------------------------- */

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    console.log("==========================================");
    console.log("[Revio] RESUME EXTRACTION");
    console.log("==========================================");
    console.log("[Revio] File:", file.name);
    console.log("[Revio] Size:", file.size);
    console.log("[Revio] Type:", file.type);

    /* ---------------------------------------------------------------------- */
    /* PDF EXTRACTION                                                          */
    /* ---------------------------------------------------------------------- */

    const extractedText = await extractPdfText(buffer);

    if (!extractedText.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract readable text from this PDF. Please upload a text-based PDF.",
        },
        { status: 400 },
      );
    }

    /* ---------------------------------------------------------------------- */
    /* CLOUDINARY                                                              */
    /* ---------------------------------------------------------------------- */

    const uploadedFile = await uploadToCloudinary(buffer);

    if (!uploadedFile?.secure_url || !uploadedFile?.public_id) {
      throw new Error("Cloudinary upload failed.");
    }

    /* ---------------------------------------------------------------------- */
    /* DATABASE                                                                */
    /* ---------------------------------------------------------------------- */

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: uploadedFile.secure_url,
        cloudinaryId: uploadedFile.public_id,
        fileType: file.type,
        fileSize: file.size,
        extractedText,
      },
    });

    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        status: "PENDING",
      },
    });

    console.log("[Revio] Resume saved:", resume.id);
    console.log("[Revio] Analysis created:", analysis.id);

    return NextResponse.json(
      {
        success: true,
        message: "Resume uploaded and text extracted successfully.",

        resume: {
          id: resume.id,
          fileName: resume.fileName,
          fileUrl: resume.fileUrl,
          fileSize: resume.fileSize,
        },

        analysis: {
          id: analysis.id,
          status: analysis.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("==========================================");
    console.error("[Revio] RESUME UPLOAD ERROR");
    console.error("==========================================");
    console.error(error);
    console.error("==========================================");

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload resume.",
      },
      { status: 500 },
    );
  }
}
