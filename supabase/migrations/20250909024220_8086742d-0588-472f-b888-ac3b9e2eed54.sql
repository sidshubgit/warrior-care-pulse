-- Fix infinite recursion in users table RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "users_select_self" ON public.users;
DROP POLICY IF EXISTS "users_select_for_clinicians" ON public.users;

-- Create corrected policies that don't cause recursion
CREATE POLICY "users_can_view_own_profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "clinicians_can_view_all_users" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.clinicians c 
    WHERE c.id = auth.uid()
  )
);