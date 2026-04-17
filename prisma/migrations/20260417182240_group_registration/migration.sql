-- CreateEnum
CREATE TYPE "GroupRegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "GroupRegistration" (
    "id" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "desiredSlug" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "phone" TEXT,
    "notes" TEXT,
    "status" "GroupRegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupRegistration_status_idx" ON "GroupRegistration"("status");

-- CreateIndex
CREATE INDEX "GroupRegistration_contactEmail_idx" ON "GroupRegistration"("contactEmail");
