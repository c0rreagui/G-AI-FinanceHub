-- =============================================================================
-- FINANCEHUB - FAMILY RLS FIX
-- 
-- This script updates the RLS policies for family-related tables to allow
-- authenticated users to create families and join them.
-- =============================================================================

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
