import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import PDFParser from "pdf2json";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (error: any) => {
      reject(error?.parserError || error);
    });

    parser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        const text = pdfData.Pages.map((page: any) =>
          page.Texts.map((item: any) => decodeURIComponent(item.R[0].T)).join(
            " ",
          ),
        ).join("\n");

        resolve(text.trim());
      } catch (error) {
        reject(error);
      }
    });

    parser.parseBuffer(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extractedText = await extractPdfText(buffer);

    if (!extractedText) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract text from this PDF. Please upload a text-based PDF.",
        },
        { status: 400 },
      );
    }

    const uploadedFile = await uploadToCloudinary(buffer);

    if (!uploadedFile?.secure_url || !uploadedFile?.public_id) {
      throw new Error("Cloudinary upload failed.");
    }

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
    console.error("Resume upload error:", error);

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
