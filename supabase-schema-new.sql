-- New CP table schema for AI-friendly relationship behavior database
-- This schema is designed to be easily parsed by AI for prompt generation

-- Drop existing CP table (WARNING: This will delete existing data)
-- DROP TABLE cp CASCADE;

-- Create new CP table with structured relationship data
CREATE TABLE cp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  
  -- Basic Settings (expanded by default)
  -- 1. CP核心一句话
  core_one_liner TEXT,
  
  -- 2. 关系动态 (stored as JSONB for structured querying)
  relationship_dynamics JSONB DEFAULT '{
    "emotional_inertia": "",
    "interaction_inertia": "",
    "desire_inertia": ""
  }'::jsonb,
  
  -- 3. 角色单独档案 (stored as JSONB for two characters)
  character_profiles JSONB DEFAULT '{
    "character_a": {
      "explicit_state": "",
      "true_state": "",
      "language_habits": ""
    },
    "character_b": {
      "explicit_state": "",
      "true_state": "",
      "language_habits": ""
    }
  }'::jsonb,
  
  -- 4. 性关系动态
  sexual_dynamics JSONB DEFAULT '{
    "desire_structure": "",
    "behavioral_inertia": "",
    "basic_positioning": ""
  }'::jsonb,
  
  -- 5. 关系氛围
  relationship_atmosphere TEXT,
  
  -- 6. 互动细节库 (stored as array for card-based system)
  interaction_details TEXT[] DEFAULT '{}',
  
  -- 7. 原作信息
  source_material TEXT,
  
  -- Advanced Settings (collapsed by default)
  -- 1. 禁止OOC规则
  ooc_rules TEXT,
  
  -- 2. 权力流动
  power_dynamics TEXT,
  
  -- 3. 关系禁区
  relationship_boundaries TEXT,
  
  -- Legacy fields for backward compatibility (can be migrated)
  description TEXT,
  characters TEXT,
  creative_notes TEXT,
  
  -- Metadata
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for JSONB fields to enable efficient querying
CREATE INDEX idx_cp_relationship_dynamics ON cp USING GIN (relationship_dynamics);
CREATE INDEX idx_cp_character_profiles ON cp USING GIN (character_profiles);
CREATE INDEX idx_cp_sexual_dynamics ON cp USING GIN (sexual_dynamics);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cp_updated_at BEFORE UPDATE ON cp
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE cp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on cp" ON cp
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_cp_name ON cp(name);
CREATE INDEX idx_cp_created_at ON cp(created_at DESC);
CREATE INDEX idx_cp_is_pinned ON cp(is_pinned);
CREATE INDEX idx_cp_pinned_at ON cp(pinned_at DESC);
