-- CRITICAL SECURITY FIX: Enable Row Level Security on all tables
-- The tables have policies but RLS was not enabled, making all data publicly accessible

-- Enable RLS on all tables to protect sensitive healthcare data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_team ENABLE ROW LEVEL SECURITY;

-- Verify that RLS is now enabled (this will show in logs)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'participants', 'clinicians', 'check_ins', 'consents', 'notes', 'care_team');