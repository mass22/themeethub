-- Event replays / embedded videos (JSON array of { title, youtube_url })
-- IF NOT EXISTS : la colonne peut déjà exister (db push, appli manuelle, retry après échec).
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "videosJson" TEXT NOT NULL DEFAULT '[]';
