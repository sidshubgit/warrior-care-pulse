import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"participant" | "clinician">("participant");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, userRole } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && userRole) {
      if (userRole === "clinician") {
        navigate('/dashboard');
      } else {
        // For participants, check if they have given consent
        checkConsentAndRedirect();
      }
    }
  }, [user, userRole, navigate]);

  const checkConsentAndRedirect = async () => {
    if (!user) return;
    
    try {
      const { data: consent } = await supabase
        .from('consents')
        .select('accepted')
        .eq('participant_id', user.id)
        .eq('accepted', true)
        .maybeSingle();

      if (consent) {
        navigate('/checkin');
      } else {
        navigate('/consent');
      }
    } catch (error) {
      console.error('Error checking consent:', error);
      navigate('/consent'); // Default to consent page if error
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password, role);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        // Provide specific error messages for common auth failures
        let errorMessage = result.error;
        
        if (result.error.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (result.error.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        } else if (result.error.includes("Too many requests")) {
          errorMessage = "Too many login attempts. Please wait a moment before trying again.";
        } else if (result.error.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        }

        toast({
          title: isSignUp ? "Registration Failed" : "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Account created!",
            description: "Please check your email to confirm your account, then sign in.",
          });
          // Switch to login mode after successful signup
          setIsSignUp(false);
          setPassword(""); // Clear password for security
        } else {
          toast({
            title: "Signed in successfully",
            description: "Redirecting to your dashboard...",
          });
        }
        
        // Navigation will be handled by useEffect above for sign in
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                {isSignUp && (
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
                )}

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
                disabled={!email || !password || loading}
              >
                {loading ? "Loading..." : (isSignUp ? "Create Account" : "Sign In")}
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

            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            Supabase is connected. Your authentication and data will be securely stored.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;