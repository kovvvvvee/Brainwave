-- Add creative notes and source material fields to cp table
ALTER TABLE cp ADD COLUMN IF NOT EXISTS creative_notes TEXT;
ALTER TABLE cp ADD COLUMN IF NOT EXISTS source_material TEXT;
