import { ReactNode } from "react";
import { Shield, Heart, Brain } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const Layout = ({ children, showHeader = true }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">WarriorCare AI</h1>
                <p className="text-xs text-muted-foreground">Confidential Check-ins. Clear Insights.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && <UserMenu />}
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};