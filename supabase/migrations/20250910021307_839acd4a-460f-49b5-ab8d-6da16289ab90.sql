-- Fix infinite recursion in users RLS and update consents policies to avoid referencing users

-- Ensure RLS is enabled
alter table public.users enable row level security;
alter table public.consents enable row level security;

-- 1) Drop all existing policies on public.users to remove any recursive definitions
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
  LOOP
    EXECUTE format('drop policy %I on public.users', pol.policyname);
  END LOOP;
END $$;

-- Recreate minimal, non-recursive users policies
create policy "users_select_self"
  on public.users
  for select
  using (auth.uid() = id);

create policy "users_select_for_clinicians"
  on public.users
  for select
  using (exists (select 1 from public.clinicians c where c.id = auth.uid()));

create policy "users_insert_own"
  on public.users
  for insert
  with check (auth.uid() = id);

-- 2) Replace consents policies to avoid referencing public.users; use care_team for clinician access
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'consents'
  LOOP
    EXECUTE format('drop policy %I on public.consents', pol.policyname);
  END LOOP;
END $$;

create policy "consents_insert_by_owner"
  on public.consents
  for insert
  with check (participant_id = auth.uid());

create policy "consents_select_self_or_assigned_clinician"
  on public.consents
  for select
  using (
    participant_id = auth.uid()
    or exists (
      select 1 from public.care_team ct
      where ct.clinician_id = auth.uid()
        and ct.participant_id = consents.participant_id
    )
  );
