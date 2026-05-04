-- CreateEnum
CREATE TYPE "IlmMemorialKind" AS ENUM ('MEMORIAL', 'LIVING_LEGACY');

-- CreateEnum
CREATE TYPE "IlmTier" AS ENUM ('BASIC', 'PREMIUM', 'GENERATIONS');

-- CreateEnum
CREATE TYPE "IlmPrivacyLevel" AS ENUM ('PUBLIC', 'PASSWORD', 'FAMILY_ONLY', 'INVITE_ONLY');

-- CreateEnum
CREATE TYPE "IlmMediaKind" AS ENUM ('PHOTO', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "IlmSubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IlmEventKind" AS ENUM ('FUNERAL', 'VISITATION', 'OTHER');

-- CreateEnum
CREATE TYPE "IlmOrgKind" AS ENUM ('FUNERAL_HOME', 'MINISTRY');

-- CreateEnum
CREATE TYPE "IlmVaultMemberRole" AS ENUM ('VAULT_OWNER', 'GENERATIONS_GUARDIAN', 'BACKUP_GUARDIAN', 'FAMILY_EDITOR', 'FAMILY_VIEWER', 'SECTION_KEEPER');

-- CreateEnum
CREATE TYPE "IlmGriefRequestStatus" AS ENUM ('OPEN', 'MATCHED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IlmProductOrderStatus" AS ENUM ('PENDING', 'PAID', 'FULFILMENT', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "PlatformApplication" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_application_entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_application_entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_memorial" (
    "id" TEXT NOT NULL,
    "kind" "IlmMemorialKind" NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "IlmTier" NOT NULL DEFAULT 'BASIC',
    "privacyLevel" "IlmPrivacyLevel" NOT NULL DEFAULT 'PUBLIC',
    "passwordHash" TEXT,
    "displayName" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "deathDate" TIMESTAMP(3),
    "biography" TEXT,
    "hideFromDirectory" BOOLEAN NOT NULL DEFAULT false,
    "hideFromSearchEngines" BOOLEAN NOT NULL DEFAULT false,
    "pageKeeperId" TEXT NOT NULL,
    "orgAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_memorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_media" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "kind" "IlmMediaKind" NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "title" TEXT,
    "byteSize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "submittedByUserId" TEXT,
    "authorGuestName" TEXT,
    "status" "IlmSubmissionStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_guestbook_entry" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "status" "IlmSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_guestbook_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_prayer" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "notifyAuthor" BOOLEAN NOT NULL DEFAULT false,
    "status" "IlmSubmissionStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_prayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_event" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "kind" "IlmEventKind" NOT NULL,
    "title" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "venue" TEXT,
    "streamUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_pamphlet" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "qrCodeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_pamphlet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_generations_vault" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "linkedMemorialId" TEXT,
    "storageQuotaBytes" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_generations_vault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_vault_collection" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_vault_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_vault_item" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "kind" "IlmMediaKind" NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_vault_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_vault_message" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "recipientEmail" TEXT,
    "body" TEXT,
    "unlockTrigger" JSONB,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_vault_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_vault_member" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "IlmVaultMemberRole" NOT NULL,
    "sectionRestrictions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_vault_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_counsellor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "specialisations" JSONB,
    "availabilityJson" JSONB,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_counsellor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_grief_request" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" "IlmGriefRequestStatus" NOT NULL DEFAULT 'OPEN',
    "brief" TEXT,
    "matchedCounsellorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_grief_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_org_account" (
    "id" TEXT NOT NULL,
    "kind" "IlmOrgKind" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'starter',
    "adminUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_org_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_product_order" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "status" "IlmProductOrderStatus" NOT NULL DEFAULT 'PENDING',
    "fulfilmentRef" TEXT,
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_product_order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformApplication_slug_key" ON "PlatformApplication"("slug");

-- CreateIndex
CREATE INDEX "user_application_entitlement_userId_idx" ON "user_application_entitlement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_application_entitlement_userId_applicationId_key" ON "user_application_entitlement"("userId", "applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_memorial_slug_key" ON "ilm_memorial"("slug");

-- CreateIndex
CREATE INDEX "ilm_memorial_pageKeeperId_idx" ON "ilm_memorial"("pageKeeperId");

-- CreateIndex
CREATE INDEX "ilm_memorial_orgAccountId_idx" ON "ilm_memorial"("orgAccountId");

-- CreateIndex
CREATE INDEX "ilm_media_memorialId_idx" ON "ilm_media"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_guestbook_entry_memorialId_idx" ON "ilm_guestbook_entry"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_prayer_memorialId_idx" ON "ilm_prayer"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_event_memorialId_idx" ON "ilm_event"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_pamphlet_memorialId_idx" ON "ilm_pamphlet"("memorialId");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_generations_vault_linkedMemorialId_key" ON "ilm_generations_vault"("linkedMemorialId");

-- CreateIndex
CREATE INDEX "ilm_generations_vault_ownerId_idx" ON "ilm_generations_vault"("ownerId");

-- CreateIndex
CREATE INDEX "ilm_vault_collection_vaultId_idx" ON "ilm_vault_collection"("vaultId");

-- CreateIndex
CREATE INDEX "ilm_vault_collection_parentId_idx" ON "ilm_vault_collection"("parentId");

-- CreateIndex
CREATE INDEX "ilm_vault_item_collectionId_idx" ON "ilm_vault_item"("collectionId");

-- CreateIndex
CREATE INDEX "ilm_vault_message_vaultId_idx" ON "ilm_vault_message"("vaultId");

-- CreateIndex
CREATE INDEX "ilm_vault_member_userId_idx" ON "ilm_vault_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_vault_member_vaultId_userId_key" ON "ilm_vault_member"("vaultId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_counsellor_userId_key" ON "ilm_counsellor"("userId");

-- CreateIndex
CREATE INDEX "ilm_grief_request_memorialId_idx" ON "ilm_grief_request"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_grief_request_requesterId_idx" ON "ilm_grief_request"("requesterId");

-- CreateIndex
CREATE UNIQUE INDEX "ilm_org_account_slug_key" ON "ilm_org_account"("slug");

-- CreateIndex
CREATE INDEX "ilm_org_account_adminUserId_idx" ON "ilm_org_account"("adminUserId");

-- CreateIndex
CREATE INDEX "ilm_product_order_memorialId_idx" ON "ilm_product_order"("memorialId");

-- AddForeignKey
ALTER TABLE "user_application_entitlement" ADD CONSTRAINT "user_application_entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_application_entitlement" ADD CONSTRAINT "user_application_entitlement_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "PlatformApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_memorial" ADD CONSTRAINT "ilm_memorial_pageKeeperId_fkey" FOREIGN KEY ("pageKeeperId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_memorial" ADD CONSTRAINT "ilm_memorial_orgAccountId_fkey" FOREIGN KEY ("orgAccountId") REFERENCES "ilm_org_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_media" ADD CONSTRAINT "ilm_media_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_guestbook_entry" ADD CONSTRAINT "ilm_guestbook_entry_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_prayer" ADD CONSTRAINT "ilm_prayer_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_event" ADD CONSTRAINT "ilm_event_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_pamphlet" ADD CONSTRAINT "ilm_pamphlet_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_generations_vault" ADD CONSTRAINT "ilm_generations_vault_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_generations_vault" ADD CONSTRAINT "ilm_generations_vault_linkedMemorialId_fkey" FOREIGN KEY ("linkedMemorialId") REFERENCES "ilm_memorial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_vault_collection" ADD CONSTRAINT "ilm_vault_collection_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "ilm_generations_vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_vault_collection" ADD CONSTRAINT "ilm_vault_collection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ilm_vault_collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_vault_item" ADD CONSTRAINT "ilm_vault_item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ilm_vault_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_vault_message" ADD CONSTRAINT "ilm_vault_message_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "ilm_generations_vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_vault_member" ADD CONSTRAINT "ilm_vault_member_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "ilm_generations_vault"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_vault_member" ADD CONSTRAINT "ilm_vault_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_counsellor" ADD CONSTRAINT "ilm_counsellor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_grief_request" ADD CONSTRAINT "ilm_grief_request_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_grief_request" ADD CONSTRAINT "ilm_grief_request_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_grief_request" ADD CONSTRAINT "ilm_grief_request_matchedCounsellorId_fkey" FOREIGN KEY ("matchedCounsellorId") REFERENCES "ilm_counsellor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_org_account" ADD CONSTRAINT "ilm_org_account_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_product_order" ADD CONSTRAINT "ilm_product_order_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
