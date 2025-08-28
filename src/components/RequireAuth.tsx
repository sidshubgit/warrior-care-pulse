import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'

interface RequireAuthProps {
  children: ReactNode
  role?: 'participant' | 'clinician'
}

export function RequireAuth({ children, role }: RequireAuthProps) {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="medical-card max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (role && userRole !== role) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}