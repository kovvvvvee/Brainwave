-- Create inspiration_tags junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS inspiration_tags (
  inspiration_id UUID NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (inspiration_id, tag_id)
);

-- Enable RLS
ALTER TABLE inspiration_tags ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
CREATE POLICY IF NOT EXISTS "Allow all operations on inspiration_tags" ON inspiration_tags
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_inspiration_tags_inspiration_id ON inspiration_tags(inspiration_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_tags_tag_id ON inspiration_tags(tag_id);
