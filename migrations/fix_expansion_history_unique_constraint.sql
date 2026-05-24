-- Migration to fix expansion_history for history record model
-- This ensures expansion_history supports multiple records per inspiration_id

-- Step 1: Remove any UNIQUE constraint on inspiration_id if it exists
-- (This is safe to run even if the constraint doesn't exist)
ALTER TABLE expansion_history DROP CONSTRAINT IF EXISTS expansion_history_inspiration_id_key;

-- Step 2: Ensure regular index exists for query performance
CREATE INDEX IF NOT EXISTS idx_expansion_history_inspiration_id 
ON expansion_history(inspiration_id);

-- Step 3: Ensure created_at index exists for ordering
CREATE INDEX IF NOT EXISTS idx_expansion_history_created_at 
ON expansion_history(created_at DESC);

-- Step 4: Ensure composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_expansion_history_inspiration_created 
ON expansion_history(inspiration_id, created_at DESC);
