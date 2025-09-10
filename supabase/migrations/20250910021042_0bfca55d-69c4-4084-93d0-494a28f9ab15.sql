-- 1) Create an authorization mapping table between participants and clinicians
-- This restricts clinician access to only assigned patients

-- Create table if it doesn't exist
create table if not exists public.care_team (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  clinician_id uuid not null references public.clinicians(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (participant_id, clinician_id)
);

-- Enable Row Level Security
alter table public.care_team enable row level security;

-- Policies: allow participants and clinicians to view only their own relationships
create policy "care_team_participant_can_select_own"
  on public.care_team
  for select
  using (participant_id = auth.uid());

create policy "care_team_clinician_can_select_own"
  on public.care_team
  for select
  using (clinician_id = auth.uid());

-- Do NOT allow inserts/updates/deletes from the client to prevent unauthorized linking
-- (Admins or service role can manage links outside of RLS)

-- Helpful indexes
create index if not exists idx_care_team_participant on public.care_team(participant_id);
create index if not exists idx_care_team_clinician on public.care_team(clinician_id);
create index if not exists idx_care_team_participant_clinician on public.care_team(participant_id, clinician_id);

-- 2) Tighten check_ins SELECT policy to allow only participant and assigned clinicians
-- Drop overly broad policy if it exists
do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'check_ins'
      and policyname = 'check_ins_select_self_or_clinician'
  ) then
    execute 'drop policy "check_ins_select_self_or_clinician" on public.check_ins';
  end if;
end $$;

-- Create precise policy
create policy "check_ins_select_self_or_authorized_clinician"
  on public.check_ins
  for select
  using (
    -- The participant can view their own check-ins
    participant_id = auth.uid()
    OR
    -- Only clinicians assigned to the participant via care_team can view
    exists (
      select 1
      from public.care_team ct
      where ct.clinician_id = auth.uid()
        and ct.participant_id = check_ins.participant_id
    )
  );

-- Keep existing insert policy for participants as-is (already restricts inserts to owner)
-- No updates/deletes are enabled, which is appropriate for auditability