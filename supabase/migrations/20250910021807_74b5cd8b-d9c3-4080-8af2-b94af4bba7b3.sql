-- Enable realtime for check_ins table
ALTER TABLE public.check_ins REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.check_ins;

-- Insert some test care_team assignments for demonstration
-- This allows clinicians to see some patients in their dashboard
-- Note: In production, this would be managed through an admin interface

-- First, let's create a sample assignment if there are any existing clinicians and participants
-- This is safe because of the unique constraint on (participant_id, clinician_id)

INSERT INTO public.care_team (participant_id, clinician_id)
SELECT p.id, c.id
FROM public.participants p
CROSS JOIN public.clinicians c
WHERE NOT EXISTS (
  SELECT 1 FROM public.care_team ct 
  WHERE ct.participant_id = p.id 
  AND ct.clinician_id = c.id
)
LIMIT 10; -- Limit to avoid too many assignments