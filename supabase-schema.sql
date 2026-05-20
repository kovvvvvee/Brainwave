-- Create CP table
CREATE TABLE cp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  characters TEXT,
  ooc_rules TEXT,
  creative_notes TEXT,
  source_material TEXT,
  relationship_summary TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AU table
CREATE TABLE au (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  cp_id UUID NOT NULL REFERENCES cp(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  world_notes TEXT,
  relationship_state TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspiration table
CREATE TABLE inspiration (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  cp_id UUID REFERENCES cp(id) ON DELETE CASCADE,
  au_id UUID REFERENCES au(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('emotion', 'content', 'relationship')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspiration_tags junction table
CREATE TABLE inspiration_tags (
  inspiration_id UUID NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (inspiration_id, tag_id)
);

-- Create expansion_history table for AI expansion records
CREATE TABLE expansion_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  inspiration_id UUID NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  style TEXT CHECK (style IN ('克制', '清冷', '暧昧', '疯感', '温柔')),
  length TEXT CHECK (length IN ('灵感延伸', '短扩写', '中篇扩写', '长篇扩写')),
  pov TEXT CHECK (pov IN ('第一人称', '第二人称', '第三人称')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE cp ENABLE ROW LEVEL SECURITY;
ALTER TABLE au ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE expansion_history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- In production, you should restrict this to authenticated users
CREATE POLICY "Allow all operations on cp" ON cp
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on au" ON au
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on inspiration" ON inspiration
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on tags" ON tags
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on inspiration_tags" ON inspiration_tags
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on expansion_history" ON expansion_history
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create indexes for faster searches
CREATE INDEX idx_cp_name ON cp(name);
CREATE INDEX idx_cp_created_at ON cp(created_at DESC);
CREATE INDEX idx_cp_is_pinned ON cp(is_pinned);
CREATE INDEX idx_cp_pinned_at ON cp(pinned_at DESC);
CREATE INDEX idx_au_cp_id ON au(cp_id);
CREATE INDEX idx_au_user_id ON au(user_id);
CREATE INDEX idx_au_created_at ON au(created_at DESC);
CREATE INDEX idx_au_is_pinned ON au(is_pinned);
CREATE INDEX idx_au_pinned_at ON au(pinned_at DESC);
CREATE INDEX idx_inspiration_cp_id ON inspiration(cp_id);
CREATE INDEX idx_inspiration_au_id ON inspiration(au_id);
CREATE INDEX idx_inspiration_created_at ON inspiration(created_at DESC);
CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_inspiration_tags_inspiration_id ON inspiration_tags(inspiration_id);
CREATE INDEX idx_inspiration_tags_tag_id ON inspiration_tags(tag_id);
CREATE INDEX idx_expansion_history_inspiration_id ON expansion_history(inspiration_id);
CREATE INDEX idx_expansion_history_created_at ON expansion_history(created_at DESC);
