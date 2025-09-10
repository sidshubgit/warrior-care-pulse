import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Heart, Moon, Zap, Brain, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const DailyCheckIn = () => {
  const [mood, setMood] = useState([3]);
  const [sleepHours, setSleepHours] = useState("");
  const [pain, setPain] = useState([0]);
  const [phq1, setPhq1] = useState("");
  const [phq2, setPhq2] = useState("");
  const [journalText, setJournalText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    // Basic validation
    if (!sleepHours || parseFloat(sleepHours) < 0 || parseFloat(sleepHours) > 16) {
      toast({
        title: "Invalid Sleep Hours",
        description: "Please enter sleep hours between 0-16.",
        variant: "destructive",
      });
      return;
    }

    if (!phq1 || !phq2) {
      toast({
        title: "Incomplete Assessment",
        description: "Please complete both PHQ-2 questions.",
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

    // Mock AI risk assessment
    const phqScore = parseInt(phq1) + parseInt(phq2);
    const hasRiskKeywords = journalText.toLowerCase().includes('hopeless') || 
                            journalText.toLowerCase().includes('suicide') || 
                            journalText.toLowerCase().includes('self-harm');
    
    let risk: "green" | "amber" | "red" = "green";
    if (hasRiskKeywords || phqScore >= 4) {
      risk = phqScore >= 5 || hasRiskKeywords ? "red" : "amber";
    }

    // Save check-in to database
    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        participant_id: user.id,
        mood: mood[0],
        sleep: parseFloat(sleepHours),
        pain: pain[0],
        phq_score: phqScore,
        journal_text: journalText,
        risk_level: risk
      });

    if (checkInError) {
      console.error('Error saving check-in:', checkInError);
      toast({
        title: "Error",
        description: "Failed to save check-in. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Check-in Saved",
      description: `Your daily check-in has been recorded. Risk level: ${risk.toUpperCase()}`,
    });

    navigate('/history');
  };

  const needHelp = () => {
    navigate('/help');
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Daily Check-in</h1>
            <p className="text-muted-foreground mt-2">How are you feeling today?</p>
          </div>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Wellness Assessment
              </CardTitle>
              <CardDescription>
                Please answer honestly. Your responses are confidential and help us understand your wellbeing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Mood Slider */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  Mood (1=Low, 5=High)
                </Label>
                <div className="px-3">
                  <Slider
                    value={mood}
                    onValueChange={setMood}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Low</span>
                    <span className="font-medium">Current: {mood[0]}</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Sleep Hours */}
              <div className="space-y-2">
                <Label htmlFor="sleep" className="text-base font-medium flex items-center gap-2">
                  <Moon className="w-4 h-4 text-primary" />
                  Sleep (hours)
                </Label>
                <Input
                  id="sleep"
                  type="number"
                  min="0"
                  max="16"
                  step="0.5"
                  placeholder="e.g. 7.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                />
              </div>

              {/* Pain Slider */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Pain (0=No pain, 10=Severe)
                </Label>
                <div className="px-3">
                  <Slider
                    value={pain}
                    onValueChange={setPain}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>No pain</span>
                    <span className="font-medium">Current: {pain[0]}</span>
                    <span>Severe</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* PHQ-2 Assessment */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Brief Mental Health Assessment (PHQ-2)</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Over the past 2 weeks, how often have you been bothered by little interest or pleasure in doing things?
                    </Label>
                    <RadioGroup value={phq1} onValueChange={setPhq1}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="phq1-0" />
                        <Label htmlFor="phq1-0" className="text-sm">Not at all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="phq1-1" />
                        <Label htmlFor="phq1-1" className="text-sm">Several days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="phq1-2" />
                        <Label htmlFor="phq1-2" className="text-sm">More than half the days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="phq1-3" />
                        <Label htmlFor="phq1-3" className="text-sm">Nearly every day</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Over the past 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?
                    </Label>
                    <RadioGroup value={phq2} onValueChange={setPhq2}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="phq2-0" />
                        <Label htmlFor="phq2-0" className="text-sm">Not at all</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="phq2-1" />
                        <Label htmlFor="phq2-1" className="text-sm">Several days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id="phq2-2" />
                        <Label htmlFor="phq2-2" className="text-sm">More than half the days</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="phq2-3" />
                        <Label htmlFor="phq2-3" className="text-sm">Nearly every day</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Journal */}
              <div className="space-y-2">
                <Label htmlFor="journal" className="text-base font-medium">
                  Notes (optional)
                </Label>
                <Textarea
                  id="journal"
                  placeholder="How are you feeling today? Any thoughts, concerns, or positive moments you'd like to share..."
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value.slice(0, 1000))}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {journalText.length}/1000 characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={!sleepHours || !phq1 || !phq2}
                >
                  Save Check-in
                </Button>
                <Button 
                  variant="destructive" 
                  size="lg" 
                  onClick={needHelp}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Need help now?
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DailyCheckIn;