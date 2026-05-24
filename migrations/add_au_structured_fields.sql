-- Add new structured fields to au table
-- These fields support the new AI-friendly AU structure with world rules, relationship mechanisms, and AI expansion

ALTER TABLE au
ADD COLUMN IF NOT EXISTS social_rules TEXT,
ADD COLUMN IF NOT EXISTS life_rules TEXT,
ADD COLUMN IF NOT EXISTS body_rules TEXT,
ADD COLUMN IF NOT EXISTS world_rules TEXT,
ADD COLUMN IF NOT EXISTS desire_mechanism TEXT,
ADD COLUMN IF NOT EXISTS relationship_pressure TEXT,
ADD COLUMN IF NOT EXISTS emotional_consequences TEXT,
ADD COLUMN IF NOT EXISTS physical_consequences TEXT,
ADD COLUMN IF NOT EXISTS au_amplification TEXT,
ADD COLUMN IF NOT EXISTS interaction_logic TEXT,
ADD COLUMN IF NOT EXISTS intimacy_logic TEXT,
ADD COLUMN IF NOT EXISTS emotional_logic TEXT,
ADD COLUMN IF NOT EXISTS power_system TEXT,
ADD COLUMN IF NOT EXISTS taboo_rules TEXT,
ADD COLUMN IF NOT EXISTS instability_factors TEXT;
