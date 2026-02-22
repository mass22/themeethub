/*
  Warnings:

  - You are about to alter the column `createdAt` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `date` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `createdAt` on the `Request` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `exploringCallEmailSentAt` on the `Request` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `Request` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to drop the column `company` on the `Speaker` table. All the data in the column will be lost.
  - You are about to drop the column `historyJson` on the `Speaker` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Speaker` table. All the data in the column will be lost.
  - You are about to alter the column `createdAt` on the `Speaker` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `Speaker` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("timestamp(3)")` to `DateTime`.

*/
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
    "lumaEventId" TEXT,
    "zoomUrl" TEXT,
    "replayUrl" TEXT,
    "statsJson" TEXT,
    "speakersJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "date", "description", "id", "location", "lumaEventId", "replayUrl", "slug", "speakersJson", "statsJson", "title", "updatedAt", "zoomUrl") SELECT "createdAt", "date", "description", "id", "location", "lumaEventId", "replayUrl", "slug", "speakersJson", "statsJson", "title", "updatedAt", "zoomUrl" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE TABLE "new_Request" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "companyName" TEXT,
    "role" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exploringCallEmailSentAt" DATETIME,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Request" ("companyName", "createdAt", "email", "exploringCallEmailSentAt", "id", "name", "role", "status", "type", "updatedAt") SELECT "companyName", "createdAt", "email", "exploringCallEmailSentAt", "id", "name", "role", "status", "type", "updatedAt" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
CREATE TABLE "new_Speaker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "socialsJson" TEXT,
    "topicsJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Speaker" ("avatar", "bio", "createdAt", "id", "name", "socialsJson", "topicsJson", "updatedAt") SELECT "avatar", "bio", "createdAt", "id", "name", "socialsJson", "topicsJson", "updatedAt" FROM "Speaker";
DROP TABLE "Speaker";
ALTER TABLE "new_Speaker" RENAME TO "Speaker";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
