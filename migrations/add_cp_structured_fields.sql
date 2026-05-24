-- Add new structured fields to cp table
-- These fields support the new AI-friendly CP structure

ALTER TABLE cp
ADD COLUMN IF NOT EXISTS core_dynamic TEXT,
ADD COLUMN IF NOT EXISTS relationship_dynamic TEXT,
ADD COLUMN IF NOT EXISTS character_profiles TEXT,
ADD COLUMN IF NOT EXISTS sexual_dynamic TEXT,
ADD COLUMN IF NOT EXISTS relationship_atmosphere TEXT,
ADD COLUMN IF NOT EXISTS interaction_details TEXT,
ADD COLUMN IF NOT EXISTS relationship_boundaries TEXT,
ADD COLUMN IF NOT EXISTS power_flow TEXT;
