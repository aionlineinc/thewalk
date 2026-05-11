-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'VENDOR';

-- CreateTable
CREATE TABLE "ilm_service_category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ilm_service_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_service_provider" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "photoUrl" TEXT,
    "pricingJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_service_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_service_order" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "memorialId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "description" TEXT,
    "amount" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_service_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ilm_service_category_slug_key" ON "ilm_service_category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_service_provider_userId_key" ON "ilm_service_provider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_service_provider_slug_key" ON "ilm_service_provider"("slug");

-- CreateIndex
CREATE INDEX "ilm_service_provider_categoryId_idx" ON "ilm_service_provider"("categoryId");

-- CreateIndex
CREATE INDEX "ilm_service_order_providerId_idx" ON "ilm_service_order"("providerId");

-- CreateIndex
CREATE INDEX "ilm_service_order_memorialId_idx" ON "ilm_service_order"("memorialId");

-- AddForeignKey
ALTER TABLE "ilm_service_provider" ADD CONSTRAINT "ilm_service_provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_service_provider" ADD CONSTRAINT "ilm_service_provider_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ilm_service_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_service_order" ADD CONSTRAINT "ilm_service_order_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ilm_service_provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_service_order" ADD CONSTRAINT "ilm_service_order_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE SET NULL ON UPDATE CASCADE;
