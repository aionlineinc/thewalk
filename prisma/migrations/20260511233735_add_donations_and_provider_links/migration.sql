-- AlterTable
ALTER TABLE "ilm_flower_donation" ADD COLUMN     "providerId" TEXT;

-- CreateTable
CREATE TABLE "ilm_donation" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "stripePaymentIntentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ilm_donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ilm_donation_memorialId_idx" ON "ilm_donation"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_flower_donation_providerId_idx" ON "ilm_flower_donation"("providerId");

-- AddForeignKey
ALTER TABLE "ilm_flower_donation" ADD CONSTRAINT "ilm_flower_donation_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ilm_service_provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_donation" ADD CONSTRAINT "ilm_donation_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
