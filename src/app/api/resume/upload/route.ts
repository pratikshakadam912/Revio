import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import PDFParser from "pdf2json";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type PdfTextRun = {
  T?: string;
};

type PdfTextItem = {
  x?: number;
  y?: number;
  R?: PdfTextRun[];
};

type PdfPage = {
  Texts?: PdfTextItem[];
};

type PdfData = {
  Pages?: PdfPage[];
};

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

/**
 * pdf2json stores text in URI-encoded form.
 *
 * Some PDFs contain characters that make decodeURIComponent()
 * throw an exception, so decoding must be defensive.
 */
function decodePdfText(value: string): string {
  if (!value) return "";

  const normalized = value.replace(/\+/g, " ");

  try {
    return decodeURIComponent(normalized);
  } catch {
    return normalized;
  }
}

/**
 * Clean extracted PDF text without destroying useful line structure.
 */
function cleanExtractedText(text: string): string {
  return text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Reconstruct the visual lines of a PDF.
 *
 * pdf2json exposes X/Y coordinates for text fragments.
 * Instead of blindly joining every fragment with spaces,
 * we group fragments that appear on the same Y coordinate.
 */
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

        const pageTexts: string[] = [];

        for (const page of pages) {
          const items = page.Texts ?? [];

          if (!items.length) {
            pageTexts.push("");
            continue;
          }

          const fragments = items
            .map((item) => {
              const x = Number(item.x ?? 0);
              const y = Number(item.y ?? 0);

              const text = (item.R ?? [])
                .map((run) => decodePdfText(run.T ?? ""))
                .join("");

              return {
                x,
                y,
                text: text.trim(),
              };
            })
            .filter((item) => item.text.length > 0);

          /**
           * Group text fragments into lines.
           *
           * PDF coordinates are floating point values, so we use
           * a small tolerance rather than requiring exact equality.
           */
          const lines: {
            y: number;
            items: { x: number; text: string }[];
          }[] = [];

          const Y_TOLERANCE = 0.15;

          for (const fragment of fragments) {
            let existingLine = lines.find(
              (line) => Math.abs(line.y - fragment.y) <= Y_TOLERANCE,
            );

            if (!existingLine) {
              existingLine = {
                y: fragment.y,
                items: [],
              };

              lines.push(existingLine);
            }

            existingLine.items.push({
              x: fragment.x,
              text: fragment.text,
            });
          }

          /**
           * PDF Y coordinates normally increase down the page.
           * Sort top-to-bottom.
           */
          lines.sort((a, b) => a.y - b.y);

          const pageLines = lines
            .map((line) => {
              /**
               * Sort left-to-right so two-column content retains
               * a predictable order.
               */
              line.items.sort((a, b) => a.x - b.x);

              return line.items
                .map((item) => item.text)
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
            })
            .filter(Boolean);

          pageTexts.push(pageLines.join("\n"));
        }

        const finalText = cleanExtractedText(pageTexts.join("\n\n"));

        console.log(
          "[Revio] PDF extraction completed. Characters:",
          finalText.length,
        );

        console.log(
          "[Revio] Extracted text preview:",
          finalText.slice(0, 1500),
        );

        resolve(finalText);
      } catch (error) {
        reject(error);
      }
    });

    parser.parseBuffer(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    // --------------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // FORM DATA
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // FILE VALIDATION
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // READ FILE
    // --------------------------------------------------------

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // --------------------------------------------------------
    // EXTRACT TEXT
    // --------------------------------------------------------

    console.log("==========================================");
    console.log("[Revio] RESUME EXTRACTION");
    console.log("==========================================");
    console.log("[Revio] File:", file.name);
    console.log("[Revio] Size:", file.size);
    console.log("[Revio] Type:", file.type);

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

    console.log("[Revio] Extracted characters:", extractedText.length);

    console.log("[Revio] First 1500 characters:", extractedText.slice(0, 1500));

    console.log("==========================================");

    // --------------------------------------------------------
    // CLOUDINARY UPLOAD
    // --------------------------------------------------------

    const uploadedFile = await uploadToCloudinary(buffer);

    if (!uploadedFile?.secure_url || !uploadedFile?.public_id) {
      throw new Error("Cloudinary upload failed.");
    }

    // --------------------------------------------------------
    // SAVE RESUME
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // CREATE ANALYSIS RECORD
    // --------------------------------------------------------

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
