-- Add creative notes, source material, and relationship summary fields to cp table
ALTER TABLE cp ADD COLUMN IF NOT EXISTS creative_notes TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS source_material TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS relationship_summary TEXT;
