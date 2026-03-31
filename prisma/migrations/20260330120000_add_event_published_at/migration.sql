-- Add explicit publication timestamp for public event visibility
ALTER TABLE "Event"
ADD COLUMN "publishedAt" TIMESTAMP(3);
