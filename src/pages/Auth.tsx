import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"participant" | "clinician">("participant");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = () => {
    // For now, this is a mock authentication
    // In a real app, this would need Supabase integration
    toast({
      title: isSignUp ? "Account created!" : "Signed in successfully",
      description: "Redirecting to your dashboard...",
    });

    // Simulate role-based routing
    setTimeout(() => {
      if (role === "participant") {
        navigate('/consent');
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Welcome to WarriorCare AI</h1>
            <p className="text-muted-foreground mt-2">Sign in to access your secure wellness portal</p>
          </div>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
              <CardDescription>
                {isSignUp 
                  ? "Create your secure account to begin wellness tracking"
                  : "Access your confidential wellness dashboard"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAuth}
                disabled={!email || !password}
              >
                {isSignUp ? "Create Account" : "Sign In"}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary"
                >
                  {isSignUp 
                    ? "Already have an account? Sign in" 
                    : "Need an account? Create one"
                  }
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>I am a:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={role === "participant" ? "default" : "outline"}
                    onClick={() => setRole("participant")}
                    className="justify-start"
                  >
                    Service Member
                  </Button>
                  <Button
                    variant={role === "clinician" ? "default" : "outline"}
                    onClick={() => setRole("clinician")}
                    className="justify-start"
                  >
                    Clinician
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            This is a proof of concept. For backend functionality including authentication, 
            you'll need to connect to Supabase using the integration button.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;