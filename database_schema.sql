-- WarriorCare AI Database Schema
-- Run these SQL commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('participant', 'clinician')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants profile table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinicians profile table  
CREATE TABLE IF NOT EXISTS clinicians (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  sleep INTEGER NOT NULL CHECK (sleep >= 0 AND sleep <= 24),
  pain INTEGER NOT NULL CHECK (pain >= 0 AND pain <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 5),
  symptoms TEXT,
  journal_text TEXT,
  phq_score INTEGER CHECK (phq_score >= 0 AND phq_score <= 27),
  risk_level TEXT CHECK (risk_level IN ('green', 'amber', 'red')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Consents table
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  version TEXT DEFAULT 'v1',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table (for clinician notes about participants)
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES clinicians(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_check_ins_participant_created_at ON check_ins(participant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consents_participant ON consents(participant_id);
CREATE INDEX IF NOT EXISTS idx_notes_participant ON notes(participant_id);
CREATE INDEX IF NOT EXISTS idx_notes_clinician ON notes(clinician_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Participants policies  
CREATE POLICY "Participants can read their own profile" ON participants
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Participants can update their own profile" ON participants
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Clinicians can read participant profiles" ON participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'clinician'
    )
  );

-- Clinicians policies
CREATE POLICY "Clinicians can read their own profile" ON clinicians
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Clinicians can update their own profile" ON clinicians
  FOR UPDATE USING (auth.uid() = id);

-- Check-ins policies
CREATE POLICY "Participants can manage their own check-ins" ON check_ins
  FOR ALL USING (
    participant_id IN (
      SELECT id FROM participants WHERE id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can read all check-ins" ON check_ins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'clinician'
    )
  );

-- Consents policies
CREATE POLICY "Participants can manage their own consents" ON consents
  FOR ALL USING (
    participant_id IN (
      SELECT id FROM participants WHERE id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can read consents" ON consents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'clinician'
    )
  );

-- Notes policies
CREATE POLICY "Participants can read notes about them" ON notes
  FOR SELECT USING (
    participant_id IN (
      SELECT id FROM participants WHERE id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can manage their own notes" ON notes
  FOR ALL USING (
    clinician_id IN (
      SELECT id FROM clinicians WHERE id = auth.uid()
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be handled in the application code instead
  -- to allow for role selection during signup
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (optional - we handle this in app code)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

COMMIT;