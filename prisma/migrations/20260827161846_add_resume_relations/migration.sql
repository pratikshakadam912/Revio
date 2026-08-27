/*
  Warnings:

  - You are about to drop the column `content` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `cloudinaryId` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Resume_userId_status_idx";

-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "content",
DROP COLUMN "status",
DROP COLUMN "title",
ADD COLUMN     "atsScore" INTEGER,
ADD COLUMN     "cloudinaryId" TEXT NOT NULL,
ADD COLUMN     "extractedText" TEXT,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL;
