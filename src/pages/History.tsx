import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge, RiskLevel } from "@/components/RiskBadge";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for the past 14 days
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 3) + 2 + (Math.random() > 0.7 ? 1 : 0), // 2-5 range
      sleepHours: 6 + Math.random() * 3, // 6-9 hours
      pain: Math.floor(Math.random() * 5), // 0-4 pain level
      phqScore: Math.floor(Math.random() * 4), // 0-3 PHQ score
      risk: Math.random() > 0.8 ? 'amber' : Math.random() > 0.95 ? 'red' : 'green' as RiskLevel
    });
  }
  
  return data;
};

const History = () => {
  const historyData = generateMockData();
  const recentEntries = historyData.slice(-5).reverse();

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-6xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">My Wellness History</h1>
            <p className="text-muted-foreground mt-2">Track your wellbeing trends over time</p>
          </div>

          {/* Trend Chart */}
          <Card className="medical-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                14-Day Wellness Trends
              </CardTitle>
              <CardDescription>
                Your mood, sleep, pain, and mental health scores over the past two weeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label, payload) => {
                        const entry = payload?.[0]?.payload;
                        return entry ? `Date: ${entry.fullDate}` : label;
                      }}
                    />
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
                      name="Pain Level (0-10)"
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

          {/* Recent Entries */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Check-ins
              </CardTitle>
              <CardDescription>
                Your latest wellness assessments and risk evaluations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="font-medium">{entry.fullDate}</span>
                      </div>
                      <RiskBadge risk={entry.risk} />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Mood:</span>
                        <span className="ml-2 font-medium">{entry.mood}/5</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sleep:</span>
                        <span className="ml-2 font-medium">{entry.sleepHours.toFixed(1)}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pain:</span>
                        <span className="ml-2 font-medium">{entry.pain}/10</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">PHQ Score:</span>
                        <span className="ml-2 font-medium">{entry.phqScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default History;