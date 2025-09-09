-- Fix the infinite recursion in users table policies completely
-- Drop all problematic policies
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.users;
DROP POLICY IF EXISTS "clinicians_can_view_all_users" ON public.users;

-- Create a security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

-- Create safe policies that don't cause recursion
CREATE POLICY "users_can_view_own_profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- For clinicians to view all users, use the participants table instead to avoid recursion
CREATE POLICY "clinicians_can_view_all_users" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.clinicians c 
    WHERE c.id = auth.uid()
  )
);