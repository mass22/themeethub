-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "tagsJson" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "tier" TEXT,
    "contactId" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sponsor_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "capacity" INTEGER,
    "contactId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Venue_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contractor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "contactId" TEXT,
    "rate" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contractor_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PromoItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "title" TEXT NOT NULL,
    "channel" TEXT,
    "dueAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "copy" TEXT,
    "assetLinksJson" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PromoItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogisticsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "ownerContactId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "dueAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LogisticsItem_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LogisticsItem_ownerContactId_fkey" FOREIGN KEY ("ownerContactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT,
    "platform" TEXT,
    "copy" TEXT,
    "scheduledAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "assetLinksJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SocialPost_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExternalCommunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExternalEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "communityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "location" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExternalEvent_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "ExternalCommunity" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalEventId" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "ownerContactId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "followUpDueAt" DATETIME,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participation_externalEventId_fkey" FOREIGN KEY ("externalEventId") REFERENCES "ExternalEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participation_ownerContactId_fkey" FOREIGN KEY ("ownerContactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "bannerImageUrl" TEXT,
    "lumaEventId" TEXT,
    "zoomUrl" TEXT,
    "replayUrl" TEXT,
    "statsJson" TEXT,
    "speakersJson" TEXT NOT NULL DEFAULT '[]',
    "sponsorsJson" TEXT NOT NULL DEFAULT '[]',
    "contractorsJson" TEXT NOT NULL DEFAULT '[]',
    "toolsJson" TEXT NOT NULL DEFAULT '[]',
    "venueId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "date", "description", "id", "location", "lumaEventId", "replayUrl", "slug", "speakersJson", "statsJson", "title", "updatedAt", "zoomUrl") SELECT "createdAt", "date", "description", "id", "location", "lumaEventId", "replayUrl", "slug", "speakersJson", "statsJson", "title", "updatedAt", "zoomUrl" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE TABLE "new_Speaker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "contactId" TEXT,
    "socialsJson" TEXT,
    "topicsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Speaker_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Speaker" ("avatar", "bio", "createdAt", "id", "name", "role", "socialsJson", "topicsJson", "updatedAt") SELECT "avatar", "bio", "createdAt", "id", "name", "role", "socialsJson", "topicsJson", "updatedAt" FROM "Speaker";
DROP TABLE "Speaker";
ALTER TABLE "new_Speaker" RENAME TO "Speaker";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
