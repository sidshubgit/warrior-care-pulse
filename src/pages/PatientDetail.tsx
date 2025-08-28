import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge, RiskLevel } from "@/components/RiskBadge";
import { ArrowLeft, Download, Calendar, TrendingUp, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";

// Mock patient data (would come from Supabase in real app)
const mockPatientData = {
  "1": {
    id: "1",
    name: "Alex R.",
    email: "alex.r@example.com",
    joinedAt: "2024-01-01",
    lastCheckinAt: "2024-01-15",
    aggregateRisk: "green" as RiskLevel,
    totalCheckins: 14,
    lastAiSummary: "Patient shows consistent positive mood trends and healthy sleep patterns. Recent entries indicate stable mental health with no concerning indicators.",
    chartData: [
      { date: "Jan 2", mood: 4, sleepHours: 7.5, pain: 1, phqScore: 0 },
      { date: "Jan 3", mood: 3, sleepHours: 6.8, pain: 2, phqScore: 1 },
      { date: "Jan 4", mood: 4, sleepHours: 8.0, pain: 0, phqScore: 0 },
      { date: "Jan 5", mood: 5, sleepHours: 7.2, pain: 1, phqScore: 1 },
      { date: "Jan 6", mood: 4, sleepHours: 7.8, pain: 0, phqScore: 0 },
      { date: "Jan 7", mood: 3, sleepHours: 6.5, pain: 2, phqScore: 2 },
      { date: "Jan 8", mood: 4, sleepHours: 8.2, pain: 1, phqScore: 1 },
      { date: "Jan 9", mood: 5, sleepHours: 7.0, pain: 0, phqScore: 0 },
      { date: "Jan 10", mood: 4, sleepHours: 7.5, pain: 1, phqScore: 1 },
      { date: "Jan 11", mood: 4, sleepHours: 8.0, pain: 0, phqScore: 0 },
      { date: "Jan 12", mood: 3, sleepHours: 6.8, pain: 2, phqScore: 2 },
      { date: "Jan 13", mood: 4, sleepHours: 7.3, pain: 1, phqScore: 1 },
      { date: "Jan 14", mood: 5, sleepHours: 8.1, pain: 0, phqScore: 0 },
      { date: "Jan 15", mood: 4, sleepHours: 7.6, pain: 1, phqScore: 1 }
    ]
  }
};

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const patient = mockPatientData[id as keyof typeof mockPatientData];

  if (!patient) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleExportPdf = async () => {
    setIsExporting(true);
    
    // Simulate PDF export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Export Complete",
      description: `Patient report for ${patient.name} has been generated.`,
    });
    
    setIsExporting(false);
  };

  const averages = {
    mood: (patient.chartData.reduce((sum, entry) => sum + entry.mood, 0) / patient.chartData.length).toFixed(1),
    sleep: (patient.chartData.reduce((sum, entry) => sum + entry.sleepHours, 0) / patient.chartData.length).toFixed(1),
    pain: (patient.chartData.reduce((sum, entry) => sum + entry.pain, 0) / patient.chartData.length).toFixed(1),
    phq: (patient.chartData.reduce((sum, entry) => sum + entry.phqScore, 0) / patient.chartData.length).toFixed(1)
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <p className="text-muted-foreground">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RiskBadge risk={patient.aggregateRisk} />
              <Button 
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Total Check-ins</p>
                  <p className="text-2xl font-bold">{patient.totalCheckins}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Avg Mood</p>
                  <p className="text-2xl font-bold text-primary">{averages.mood}/5</p>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Avg Sleep</p>
                  <p className="text-2xl font-bold text-secondary">{averages.sleep}h</p>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Avg PHQ</p>
                  <p className="text-2xl font-bold text-warning">{averages.phq}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    14-Day Wellness Trends
                  </CardTitle>
                  <CardDescription>
                    Patient's wellness metrics over the past two weeks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={patient.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Mood (1-5)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sleepHours" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={2}
                          name="Sleep Hours"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pain" 
                          stroke="hsl(var(--warning))" 
                          strokeWidth={2}
                          name="Pain Level"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="phqScore" 
                          stroke="hsl(var(--destructive))" 
                          strokeWidth={2}
                          name="PHQ Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Summary */}
            <div>
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    AI Analysis Summary
                  </CardTitle>
                  <CardDescription>
                    Latest insights from journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      {patient.lastAiSummary}
                    </p>
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Last updated: {patient.lastCheckinAt}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Info */}
              <Card className="medical-card mt-6">
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span className="font-medium">{patient.joinedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Check-in:</span>
                      <span className="font-medium">{patient.lastCheckinAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Entries:</span>
                      <span className="font-medium">{patient.totalCheckins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Level:</span>
                      <RiskBadge risk={patient.aggregateRisk} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetail;