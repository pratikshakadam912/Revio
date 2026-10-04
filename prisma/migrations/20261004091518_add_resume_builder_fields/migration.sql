-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "data" JSONB,
ADD COLUMN     "status" "ResumeStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "template" TEXT NOT NULL DEFAULT 'minimal',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled Resume',
ALTER COLUMN "cloudinaryId" DROP NOT NULL,
ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "fileType" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Resume_userId_updatedAt_idx" ON "Resume"("userId", "updatedAt");
