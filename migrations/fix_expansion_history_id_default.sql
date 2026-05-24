-- Fix expansion_history.id to have gen_random_uuid() default
-- This ensures Supabase auto-generates UUID for new records

ALTER TABLE expansion_history
ALTER COLUMN id
SET DEFAULT gen_random_uuid();
