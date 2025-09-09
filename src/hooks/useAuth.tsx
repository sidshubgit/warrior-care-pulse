import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: 'participant' | 'clinician' | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, role: 'participant' | 'clinician') => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<'participant' | 'clinician' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Get role from user metadata first, fallback to database
        const roleFromMetadata = session.user.user_metadata?.role
        if (roleFromMetadata) {
          setUserRole(roleFromMetadata)
          setLoading(false)
        } else {
          fetchUserRole(session.user.id)
        }
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Get role from user metadata first, fallback to database
        const roleFromMetadata = session.user.user_metadata?.role
        if (roleFromMetadata) {
          setUserRole(roleFromMetadata)
          setLoading(false)
        } else {
          setTimeout(() => {
            fetchUserRole(session.user.id)
          }, 0)
        }
      } else {
        setUserRole(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user role:', error)
        setUserRole(null)
      } else if (data) {
        setUserRole(data.role)
      } else {
        console.log('No user role found, defaulting to participant')
        setUserRole('participant')
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
      setUserRole('participant') // Default to participant if there's an error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }

  const signUp = async (email: string, password: string, role: 'participant' | 'clinician') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          name: email.split('@')[0],
          display_name: email.split('@')[0],
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}