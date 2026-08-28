import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

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

export async function POST(request: NextRequest) {
  try {
    // =========================================================
    // 1. AUTHENTICATION
    // =========================================================

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

    // =========================================================
    // 2. READ FORM DATA
    // =========================================================

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

    // =========================================================
    // 3. VALIDATE FILE TYPE
    // =========================================================

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF resumes are supported.",
        },
        { status: 400 },
      );
    }

    // =========================================================
    // 4. VALIDATE FILE SIZE
    // =========================================================

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

    // =========================================================
    // 5. CONVERT FILE TO BUFFER
    // =========================================================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // =========================================================
    // 6. UPLOAD TO CLOUDINARY
    // =========================================================

    const uploadedFile = await uploadToCloudinary(buffer);

    if (!uploadedFile?.secure_url || !uploadedFile?.public_id) {
      throw new Error("Cloudinary upload failed.");
    }

    // =========================================================
    // 7. SAVE RESUME TO DATABASE
    // =========================================================

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,

        fileName: file.name,
        fileUrl: uploadedFile.secure_url,
        cloudinaryId: uploadedFile.public_id,
        fileType: file.type,
        fileSize: file.size,

        // We will populate this when the AI analysis
        // pipeline extracts the resume text.
        extractedText: null,
      },
    });

    // =========================================================
    // 8. CREATE ANALYSIS RECORD
    // =========================================================

    const analysis = await prisma.resumeAnalysis.create({
      data: {
        userId: session.user.id,
        resumeId: resume.id,
        status: "PENDING",
      },
    });

    // =========================================================
    // 9. RETURN SUCCESS RESPONSE
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        message: "Resume uploaded successfully.",

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
