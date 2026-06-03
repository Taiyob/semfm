-- Migration: add_street_name_and_sync_drift
-- This migration syncs the migration history with the actual database state.
-- The database already has these columns (added via db push), so we use
-- IF NOT EXISTS to avoid errors if run against a fresh database.

-- Add streetName to Property (already applied via db push)
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "streetName" TEXT;

-- Sync MatchAlert drift (lastTriggeredAt and triggerCount were added via db push)
ALTER TABLE "MatchAlert" ADD COLUMN IF NOT EXISTS "lastTriggeredAt" TIMESTAMP(3);
ALTER TABLE "MatchAlert" ADD COLUMN IF NOT EXISTS "triggerCount" INTEGER NOT NULL DEFAULT 0;
