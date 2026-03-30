-- CreateEnum
CREATE TYPE "SponsorType" AS ENUM ('financial', 'community');

-- AlterTable
ALTER TABLE "Sponsor" ADD COLUMN     "type" "SponsorType" NOT NULL DEFAULT 'financial';
