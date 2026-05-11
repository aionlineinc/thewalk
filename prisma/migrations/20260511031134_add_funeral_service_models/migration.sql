-- AlterTable
ALTER TABLE "ilm_event" ADD COLUMN     "address" TEXT,
ADD COLUMN     "mapUrl" TEXT,
ADD COLUMN     "officiant" TEXT,
ADD COLUMN     "programDetails" TEXT;

-- CreateTable
CREATE TABLE "ilm_flower_donation" (
    "id" TEXT NOT NULL,
    "memorialId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "description" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'FLOWERS',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ilm_flower_donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ilm_event_rsvp" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ilm_event_rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ilm_flower_donation_memorialId_idx" ON "ilm_flower_donation"("memorialId");

-- CreateIndex
CREATE INDEX "ilm_event_rsvp_eventId_idx" ON "ilm_event_rsvp"("eventId");

-- AddForeignKey
ALTER TABLE "ilm_flower_donation" ADD CONSTRAINT "ilm_flower_donation_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "ilm_memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ilm_event_rsvp" ADD CONSTRAINT "ilm_event_rsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "ilm_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
