-- Migration to add character name fields to CP table
-- This allows users to specify custom character names instead of using "角色A"/"角色B"

-- Add character name fields as TEXT columns
ALTER TABLE cp ADD COLUMN IF NOT EXISTS character_a_name TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS character_b_name TEXT;
