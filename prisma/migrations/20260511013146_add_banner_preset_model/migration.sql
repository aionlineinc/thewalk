-- CreateTable
CREATE TABLE "ilm_banner_preset" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_banner_preset_pkey" PRIMARY KEY ("id")
);
