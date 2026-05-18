-- Add memory columns to cp table
-- This migration adds the new columns for storing character relationship and style memories

ALTER TABLE cp ADD COLUMN IF NOT EXISTS relationship_memory TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS speech_style_memory TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS writing_style_memory TEXT;

-- Ensure other style columns exist (they should already exist from initial schema)
ALTER TABLE cp ADD COLUMN IF NOT EXISTS emotional_tone TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS relationship_core TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS interaction_style TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS ooc_rules TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS writing_style TEXT;
