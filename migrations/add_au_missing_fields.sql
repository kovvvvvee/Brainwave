-- Migration to add missing AU fields to match frontend schema
-- This ensures auService.js, AuDetail.jsx, and Supabase au table are in sync

-- Drop the old world_rules JSONB column (will be replaced with individual TEXT fields)
ALTER TABLE au DROP COLUMN IF EXISTS world_rules;

-- Drop daily_details column (removed from frontend)
ALTER TABLE au DROP COLUMN IF EXISTS daily_details;

-- Add missing AU fields as TEXT columns
ALTER TABLE au ADD COLUMN IF NOT EXISTS social_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS life_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS body_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS desire_mechanism TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_pressure TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS emotional_consequences TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS physical_consequences TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS interaction_logic TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS intimacy_logic TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS emotional_logic TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS power_system TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS taboo_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS instability_factors TEXT;

-- Verify all fields exist (these should already exist in current schema)
-- core_atmosphere (already exists)
-- relationship_surface_layer (already exists)
-- relationship_actual_state (already exists)
-- relationship_conflict (already exists)
-- au_amplification (already exists)
-- relationship_triggers (already exists)
-- ooc_rules (already exists)
-- world_notes (already exists)
-- relationship_state (already exists)
