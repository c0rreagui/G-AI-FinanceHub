-- Migration: Add Foreign Key from user_families to user_profiles
-- This enables Supabase PostgREST to perform automatic JOINs between these tables

-- Add foreign key constraint
ALTER TABLE user_families 
ADD CONSTRAINT fk_user_families_user_profiles 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Verify the constraint was added
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'user_families';
