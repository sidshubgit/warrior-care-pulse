import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiskBadge, RiskLevel } from "@/components/RiskBadge";
import { Search, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PatientData {
  id: string;
  display_name: string | null;
  email: string;
  lastCheckinAt: string | null;
  risk: RiskLevel;
  moodTrend: string;
  phqScore: number | null;
  totalCheckins: number;
}

const ClinicianDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAssignedPatients = async () => {
    if (!user) return;

    try {
      // Get participants assigned to this clinician through care_team
      const { data: assignments, error: assignmentError } = await supabase
        .from('care_team')
        .select(`
          participant_id,
          participants!inner (
            id,
            display_name,
            users!inner (
              email
            )
          )
        `)
        .eq('clinician_id', user.id);

      if (assignmentError) {
        console.error('Error fetching assignments:', assignmentError);
        toast({
          title: "Error",
          description: "Failed to load assigned patients.",
          variant: "destructive",
        });
        return;
      }

      if (!assignments || assignments.length === 0) {
        setPatients([]);
        return;
      }

      // Get latest check-ins for each assigned participant
      const participantIds = assignments.map(a => a.participant_id);
      
      const { data: checkIns, error: checkInError } = await supabase
        .from('check_ins')
        .select('*')
        .in('participant_id', participantIds)
        .order('created_at', { ascending: false });

      if (checkInError) {
        console.error('Error fetching check-ins:', checkInError);
      }

      // Process data to create patient summaries
      const patientsData: PatientData[] = assignments.map(assignment => {
        const participant = assignment.participants;
        const participantCheckIns = checkIns?.filter(ci => ci.participant_id === assignment.participant_id) || [];
        const latestCheckIn = participantCheckIns[0];
        
        // Calculate averages and trends
        const recentCheckIns = participantCheckIns.slice(0, 5); // Last 5 check-ins for trend
        const avgMood = recentCheckIns.length > 0 
          ? recentCheckIns.reduce((sum, ci) => sum + ci.mood, 0) / recentCheckIns.length 
          : 0;
        
        let moodTrend = "stable";
        if (recentCheckIns.length >= 2) {
          const oldAvg = recentCheckIns.slice(2).reduce((sum, ci) => sum + ci.mood, 0) / Math.max(recentCheckIns.length - 2, 1);
          const newAvg = recentCheckIns.slice(0, 2).reduce((sum, ci) => sum + ci.mood, 0) / 2;
          if (newAvg > oldAvg + 0.5) moodTrend = "improving";
          else if (newAvg < oldAvg - 0.5) moodTrend = "declining";
        }

        return {
          id: participant.id,
          display_name: participant.display_name,
          email: participant.users.email,
          lastCheckinAt: latestCheckIn?.created_at ? new Date(latestCheckIn.created_at).toLocaleDateString() : null,
          risk: (latestCheckIn?.risk_level as RiskLevel) || "green",
          moodTrend,
          phqScore: latestCheckIn?.phq_score || 0,
          totalCheckins: participantCheckIns.length
        };
      });

      setPatients(patientsData);
    } catch (error) {
      console.error('Error in fetchAssignedPatients:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading patients.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedPatients();

    // Set up real-time subscription for check-ins
    const channel = supabase
      .channel('check-ins-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'check_ins'
        },
        (payload) => {
          console.log('Real-time check-in update:', payload);
          // Refresh patient data when check-ins change
          fetchAssignedPatients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredPatients = patients.filter(patient =>
    (patient.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const riskCounts = patients.reduce((acc, patient) => {
    acc[patient.risk] = (acc[patient.risk] || 0) + 1;
    return acc;
  }, {} as Record<RiskLevel, number>);

  const viewPatient = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assigned patients...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-7xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Patient Dashboard</h1>
              <p className="text-muted-foreground mt-2">Monitor assigned patients' wellbeing and risk assessments</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{patients.length} Assigned Patients</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                    <p className="text-2xl font-bold text-success">{riskCounts.green || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Moderate Risk</p>
                    <p className="text-2xl font-bold text-warning">{riskCounts.amber || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-destructive">{riskCounts.red || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{patients.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Table */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Assigned Patients</CardTitle>
              <CardDescription>
                View and manage wellness data for patients assigned to your care
              </CardDescription>
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div 
                    key={patient.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => viewPatient(patient.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{patient.display_name || 'Anonymous'}</h3>
                          <RiskBadge risk={patient.risk} />
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                            {patient.moodTrend}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span>Email: </span>
                            <span className="font-medium">{patient.email}</span>
                          </div>
                          <div>
                            <span>Last Check-in: </span>
                            <span className="font-medium">{patient.lastCheckinAt || 'Never'}</span>
                          </div>
                          <div>
                            <span>PHQ Score: </span>
                            <span className="font-medium">{patient.phqScore}</span>
                          </div>
                          <div>
                            <span>Total Check-ins: </span>
                            <span className="font-medium">{patient.totalCheckins}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPatients.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  {patients.length === 0 ? (
                    <div>
                      <p className="mb-2">No patients assigned to you yet.</p>
                      <p className="text-sm">Contact your administrator to assign patients to your care.</p>
                    </div>
                  ) : (
                    <p>No patients found matching your search.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ClinicianDashboard;