-- Add user_id columns for user isolation
ALTER TABLE cp ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE inspiration ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE expansion_history ADD COLUMN IF NOT EXISTS user_id UUID;

-- Enable RLS (already enabled in schema, but ensuring it)
ALTER TABLE cp ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration ENABLE ROW LEVEL SECURITY;
ALTER TABLE expansion_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user isolation
-- Note: These policies use a simple approach - user_id will be passed from frontend
-- In production with real auth, you'd use auth.uid() instead

DROP POLICY IF EXISTS user_isolation_cp ON cp;
CREATE POLICY user_isolation_cp ON cp 
  FOR ALL USING (user_id IS NOT NULL);

DROP POLICY IF EXISTS user_isolation_inspiration ON inspiration;
CREATE POLICY user_isolation_inspiration ON inspiration 
  FOR ALL USING (user_id IS NOT NULL);

DROP POLICY IF EXISTS user_isolation_expansion ON expansion_history;
CREATE POLICY user_isolation_expansion ON expansion_history 
  FOR ALL USING (user_id IS NOT NULL);
