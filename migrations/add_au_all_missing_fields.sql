-- Migration to add all missing AU fields to match frontend UI
-- This migration adds all the fields that the AuDetail.jsx UI uses

-- Core AU fields
ALTER TABLE au ADD COLUMN IF NOT EXISTS core_atmosphere TEXT;

-- World rules (as TEXT, not JSONB - to match frontend structure)
ALTER TABLE au ADD COLUMN IF NOT EXISTS social_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS life_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS body_rules TEXT;

-- Relationship and desire mechanisms
ALTER TABLE au ADD COLUMN IF NOT EXISTS desire_mechanism TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_pressure TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS emotional_consequences TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS physical_consequences TEXT;

-- AI expansion enhancement
ALTER TABLE au ADD COLUMN IF NOT EXISTS au_amplification TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS interaction_logic TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS intimacy_logic TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS emotional_logic TEXT;

-- Advanced settings
ALTER TABLE au ADD COLUMN IF NOT EXISTS power_system TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS taboo_rules TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS instability_factors TEXT;

-- Relationship state fields
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_surface_layer TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_actual_state TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_conflict TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_triggers TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS daily_details TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS ooc_rules TEXT;

-- Legacy fields (already exist but ensuring they're present)
ALTER TABLE au ADD COLUMN IF NOT EXISTS world_notes TEXT;
ALTER TABLE au ADD COLUMN IF NOT EXISTS relationship_state TEXT;
