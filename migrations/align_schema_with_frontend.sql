-- Migration to align database schema with frontend structure
-- This migration:
-- 1. Adds user_id to AU table
-- 2. Adds is_pinned and pinned_at to CP and AU tables
-- 3. Removes unused engineering fields from CP table
-- 4. Removes unused engineering fields from AU table

-- Step 1: Add user_id to AU table
ALTER TABLE au ADD COLUMN IF NOT EXISTS user_id UUID;

-- Step 2: Add is_pinned and pinned_at to CP table
ALTER TABLE cp ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP WITH TIME ZONE;

-- Step 3: Add is_pinned and pinned_at to AU table
ALTER TABLE au ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE au ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP WITH TIME ZONE;

-- Step 4: Remove unused engineering fields from CP table
ALTER TABLE cp DROP COLUMN IF EXISTS keywords;
ALTER TABLE cp DROP COLUMN IF EXISTS emotional_tone;
ALTER TABLE cp DROP COLUMN IF EXISTS relationship_core;
ALTER TABLE cp DROP COLUMN IF EXISTS interaction_style;
ALTER TABLE cp DROP COLUMN IF EXISTS writing_style;
ALTER TABLE cp DROP COLUMN IF EXISTS relationship_memory;
ALTER TABLE cp DROP COLUMN IF EXISTS speech_style_memory;
ALTER TABLE cp DROP COLUMN IF EXISTS writing_style_memory;

-- Step 5: Remove unused engineering fields from AU table
ALTER TABLE au DROP COLUMN IF EXISTS world_setting;
ALTER TABLE au DROP COLUMN IF EXISTS era_background;
ALTER TABLE au DROP COLUMN IF EXISTS occupation_setting;
ALTER TABLE au DROP COLUMN IF EXISTS atmosphere;
ALTER TABLE au DROP COLUMN IF EXISTS behavior_pattern;
ALTER TABLE au DROP COLUMN IF EXISTS writing_style;
ALTER TABLE au DROP COLUMN IF EXISTS worldview_memory;
ALTER TABLE au DROP COLUMN IF EXISTS atmosphere_memory;

-- Step 5.5: Add new natural language fields to AU table
ALTER TABLE au ADD COLUMN IF NOT EXISTS world_notes TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_state TEXT;

-- Step 5.6: Remove atmosphere_notes and writing_notes (replaced by natural language description)
ALTER TABLE au DROP COLUMN IF EXISTS atmosphere_notes;
ALTER TABLE au DROP COLUMN IF EXISTS writing_notes;

-- Step 6: Update indexes for new pinned fields
CREATE INDEX IF NOT EXISTS idx_cp_is_pinned ON cp(is_pinned);
CREATE INDEX IF NOT EXISTS idx_cp_pinned_at ON cp(pinned_at DESC);
CREATE INDEX IF NOT EXISTS idx_au_user_id ON au(user_id);
CREATE INDEX IF NOT EXISTS idx_au_is_pinned ON au(is_pinned);
CREATE INDEX IF NOT EXISTS idx_au_pinned_at ON au(pinned_at DESC);

-- Step 7: Update RLS policy for AU to include user_id
DROP POLICY IF EXISTS user_isolation_au ON au;
CREATE POLICY user_isolation_au ON au 
  FOR ALL USING (user_id IS NOT NULL);
