CREATE TABLE "ResumeDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResumeDraft_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ResumeDraft_userId_resumeId_key"
ON "ResumeDraft"("userId", "resumeId");

CREATE INDEX "ResumeDraft_userId_idx"
ON "ResumeDraft"("userId");

CREATE INDEX "ResumeDraft_resumeId_idx"
ON "ResumeDraft"("resumeId");

ALTER TABLE "ResumeDraft"
ADD CONSTRAINT "ResumeDraft_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ResumeDraft"
ADD CONSTRAINT "ResumeDraft_resumeId_fkey"
FOREIGN KEY ("resumeId") REFERENCES "Resume"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
