import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'participant' | 'clinician'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'participant' | 'clinician'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'participant' | 'clinician'
          created_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          display_name: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          phone?: string | null
          created_at?: string
        }
      }
      clinicians: {
        Row: {
          id: string
          name: string
          organization: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          organization?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          organization?: string | null
          created_at?: string
        }
      }
      check_ins: {
        Row: {
          id: string
          participant_id: string
          mood: number
          sleep: number
          pain: number
          energy: number | null
          symptoms: string | null
          journal_text: string | null
          phq_score: number | null
          risk_level: 'green' | 'amber' | 'red' | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          mood: number
          sleep: number
          pain: number
          energy?: number | null
          symptoms?: string | null
          journal_text?: string | null
          phq_score?: number | null
          risk_level?: 'green' | 'amber' | 'red' | null
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          mood?: number
          sleep?: number
          pain?: number
          energy?: number | null
          symptoms?: string | null
          journal_text?: string | null
          phq_score?: number | null
          risk_level?: 'green' | 'amber' | 'red' | null
          created_at?: string
        }
      }
      consents: {
        Row: {
          id: string
          participant_id: string
          accepted: boolean
          version: string
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          accepted: boolean
          version?: string
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          accepted?: boolean
          version?: string
          accepted_at?: string | null
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          participant_id: string
          clinician_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          clinician_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          clinician_id?: string
          body?: string
          created_at?: string
        }
      }
    }
  }
}