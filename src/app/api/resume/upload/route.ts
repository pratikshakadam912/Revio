import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

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
        } else {
          resolve(result);
        }
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function POST(request: NextRequest) {
  try {
    //  Check authentication

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in to upload a resume",
        },
        { status: 401 },
      );
    }

    //  Read uploaded file

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Resume file is required",
        },
        { status: 400 },
      );
    }

    //  Validate file type

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Only PDF resumes are supported",
        },
        { status: 400 },
      );
    }

    //  Validate file size

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Resume must be smaller than 5MB",
        },
        { status: 400 },
      );
    }

    // 5. Convert PDF to Buffer

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    //  Upload to Cloudinary

    const uploadedFile = await uploadToCloudinary(buffer);

    //  Save resume in PostgreSQL

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,

        fileName: file.name,
        fileUrl: uploadedFile.secure_url,
        cloudinaryId: uploadedFile.public_id,
        fileType: file.type,
        fileSize: file.size,
      },
    });

    // 8. Return response

    return NextResponse.json(
      {
        success: true,
        message: "Resume uploaded successfully",
        resume,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Resume upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload resume",
      },
      { status: 500 },
    );
  }
}
