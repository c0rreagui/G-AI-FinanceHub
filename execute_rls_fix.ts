// execute_rls_fix.ts
// Run this script with: npx ts-node execute_rls_fix.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nblzuljuuuvdzrqakccd.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
    console.log('\nTo fix the RLS policies, please run the following SQL in your Supabase SQL Editor:');
    console.log('\n=== SQL TO EXECUTE ===\n');
    console.log(`
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create families" ON public.families;
DROP POLICY IF EXISTS "Users can view their own family" ON public.families;
DROP POLICY IF EXISTS "Users can view members of their family" ON public.user_families;
DROP POLICY IF EXISTS "Users can join families" ON public.user_families;

-- FAMILIES TABLE
-- Allow authenticated users to create families (they become the owner)
CREATE POLICY "Users can create families" ON public.families 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view families they created OR are members of
CREATE POLICY "Users can view their own family" ON public.families 
FOR SELECT 
USING (
    created_by = auth.uid() 
    OR id IN (
        SELECT family_id FROM public.user_families WHERE user_id = auth.uid()
    )
);

-- Allow family admins to update their family
CREATE POLICY "Admins can update their family" ON public.families 
FOR UPDATE 
USING (
    id IN (
        SELECT family_id FROM public.user_families 
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
);

-- USER_FAMILIES TABLE
-- Allow users to view all members of families they belong to
CREATE POLICY "Users can view members of their family" ON public.user_families 
FOR SELECT 
USING (
    family_id IN (
        SELECT family_id FROM public.user_families WHERE user_id = auth.uid()
    )
);

-- Allow authenticated users to join families (via invite or as creator)
CREATE POLICY "Users can join families" ON public.user_families 
FOR INSERT 
WITH CHECK (
    user_id = auth.uid()
);

-- Allow users to leave families (delete their own membership)
CREATE POLICY "Users can leave families" ON public.user_families 
FOR DELETE 
USING (user_id = auth.uid());

-- FAMILY_INVITES TABLE
-- Allow family admins to create invites
CREATE POLICY "Admins can create invites" ON public.family_invites 
FOR INSERT 
WITH CHECK (
    family_id IN (
        SELECT family_id FROM public.user_families 
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
);

-- Allow anyone to view invites by token (for joining)
CREATE POLICY "Anyone can view invite by token" ON public.family_invites 
FOR SELECT 
USING (true);

-- Allow family admins to manage invites
CREATE POLICY "Admins can manage invites" ON public.family_invites 
FOR UPDATE 
USING (
    family_id IN (
        SELECT family_id FROM public.user_families 
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
    OR created_by = auth.uid()
);

-- Allow admins to delete invites
CREATE POLICY "Admins can delete invites" ON public.family_invites 
FOR DELETE 
USING (
    family_id IN (
        SELECT family_id FROM public.user_families 
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
    OR created_by = auth.uid()
);
`);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeRLSFix() {
    console.log('Executing RLS fix for family tables...');

    const statements = [
        `DROP POLICY IF EXISTS "Users can create families" ON public.families`,
        `DROP POLICY IF EXISTS "Users can view their own family" ON public.families`,
        `DROP POLICY IF EXISTS "Users can view members of their family" ON public.user_families`,
        `DROP POLICY IF EXISTS "Users can join families" ON public.user_families`,

        `CREATE POLICY "Users can create families" ON public.families FOR INSERT WITH CHECK (auth.uid() IS NOT NULL)`,

        `CREATE POLICY "Users can view their own family" ON public.families FOR SELECT USING (created_by = auth.uid() OR id IN (SELECT family_id FROM public.user_families WHERE user_id = auth.uid()))`,

        `CREATE POLICY "Admins can update their family" ON public.families FOR UPDATE USING (id IN (SELECT family_id FROM public.user_families WHERE user_id = auth.uid() AND role IN ('admin', 'owner')))`,

        `CREATE POLICY "Users can view members of their family" ON public.user_families FOR SELECT USING (family_id IN (SELECT family_id FROM public.user_families WHERE user_id = auth.uid()))`,

        `CREATE POLICY "Users can join families" ON public.user_families FOR INSERT WITH CHECK (user_id = auth.uid())`,

        `CREATE POLICY "Users can leave families" ON public.user_families FOR DELETE USING (user_id = auth.uid())`,
    ];

    for (const sql of statements) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
        if (error) {
            console.error(`Error executing: ${sql.substring(0, 50)}...`, error);
        } else {
            console.log(`✓ Executed: ${sql.substring(0, 50)}...`);
        }
    }

    console.log('\\nRLS fix complete!');
}

executeRLSFix();
