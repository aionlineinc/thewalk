-- AlterTable
ALTER TABLE "ilm_memorial" ADD COLUMN     "restingPlaceAddress" TEXT,
ADD COLUMN     "restingPlaceLat" DOUBLE PRECISION,
ADD COLUMN     "restingPlaceLng" DOUBLE PRECISION,
ADD COLUMN     "restingPlaceMapUrl" TEXT,
ADD COLUMN     "restingPlaceName" TEXT;

-- CreateTable
CREATE TABLE "ilm_plan_purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "amountPaid" DOUBLE PRECISION,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_plan_purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ilm_plan_purchase_stripeSessionId_key" ON "ilm_plan_purchase"("stripeSessionId");

-- CreateIndex
CREATE INDEX "ilm_plan_purchase_userId_idx" ON "ilm_plan_purchase"("userId");

-- CreateIndex
CREATE INDEX "ilm_plan_purchase_status_idx" ON "ilm_plan_purchase"("status");

-- AddForeignKey
ALTER TABLE "ilm_plan_purchase" ADD CONSTRAINT "ilm_plan_purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
