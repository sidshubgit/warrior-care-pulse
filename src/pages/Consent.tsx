import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Consent = () => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAccept = async () => {
    if (!accepted) {
      toast({
        title: "Consent Required",
        description: "Please read and accept the consent form to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save consent to database
      const { error } = await supabase
        .from('consents')
        .insert({
          participant_id: user.id,
          accepted: true,
          accepted_at: new Date().toISOString(),
          version: 'v1'
        });

      if (error) {
        console.error('Error saving consent:', error);
        toast({
          title: "Error",
          description: "Failed to save consent. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Consent Accepted",
        description: "Welcome to WarriorCare AI. You can begin your wellness journey.",
      });

      navigate('/checkin');
    } catch (error) {
      console.error('Error saving consent:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    toast({
      title: "Consent Declined",
      description: "Redirecting to welcome page...",
    });
    navigate('/');
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Informed Consent</h1>
            <p className="text-muted-foreground mt-2">Please review and accept to continue</p>
          </div>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                WarriorCare AI Consent Form
              </CardTitle>
              <CardDescription>
                Your participation is voluntary and your privacy is protected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-3">Purpose and Overview</h3>
                <p className="text-muted-foreground mb-4">
                  You are invited to use WarriorCare AI to track your wellbeing and mental health indicators. 
                  This tool is designed to support service members and veterans in monitoring their wellness 
                  and connecting with appropriate care when needed.
                </p>

                <h3 className="text-lg font-semibold mb-3">Voluntary Participation</h3>
                <p className="text-muted-foreground mb-4">
                  Participation is completely voluntary. You can withdraw from using this service at any time 
                  without penalty or loss of benefits. You have the right to skip any questions or assessments 
                  you prefer not to complete.
                </p>

                <h3 className="text-lg font-semibold mb-3">Data Privacy and Confidentiality</h3>
                <p className="text-muted-foreground mb-4">
                  Your data is confidential and encrypted. Information you provide is used to generate insights 
                  about your wellbeing and may be shared with authorized mental health professionals assigned 
                  to your care, but only with your explicit consent.
                </p>

                <h3 className="text-lg font-semibold mb-3">Important Limitations</h3>
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">This tool is NOT a medical device or diagnostic tool.</p>
                      <p>It does not replace professional medical advice, diagnosis, or treatment.</p>
                      <p>In case of emergency, contact local crisis services or emergency services immediately.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">Data Usage</h3>
                <p className="text-muted-foreground mb-4">
                  Your responses will be analyzed to provide insights about your wellbeing trends and 
                  potential risk factors. This information may be used to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-1">
                  <li>Generate personalized wellness insights</li>
                  <li>Alert assigned healthcare providers about potential concerns</li>
                  <li>Improve the service for all users (in anonymized form)</li>
                </ul>
              </div>

              <Separator />

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <Label 
                  htmlFor="consent" 
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I have read and understand the information above. I voluntarily consent to participate 
                  in WarriorCare AI and understand that I can withdraw my consent at any time.
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={handleAccept}
                  disabled={!accepted || loading}
                  className="flex-1"
                >
                  {loading ? "Saving..." : "Accept & Continue"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleDecline}
                  disabled={loading}
                  className="flex-1"
                >
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Consent;