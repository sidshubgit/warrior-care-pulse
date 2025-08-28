import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RiskBadge, RiskLevel } from "@/components/RiskBadge";
import { Search, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock patient data
const mockPatients = [
  {
    id: "1",
    name: "Alex R.",
    email: "alex.r@example.com",
    lastCheckinAt: "2024-01-15",
    risk: "green" as RiskLevel,
    moodTrend: "stable",
    phqScore: 1
  },
  {
    id: "2", 
    name: "Jordan M.",
    email: "jordan.m@example.com",
    lastCheckinAt: "2024-01-14",
    risk: "amber" as RiskLevel,
    moodTrend: "declining",
    phqScore: 4
  },
  {
    id: "3",
    name: "Casey L.",
    email: "casey.l@example.com", 
    lastCheckinAt: "2024-01-13",
    risk: "red" as RiskLevel,
    moodTrend: "concerning",
    phqScore: 6
  },
  {
    id: "4",
    name: "Morgan K.",
    email: "morgan.k@example.com",
    lastCheckinAt: "2024-01-15",
    risk: "green" as RiskLevel,
    moodTrend: "improving",
    phqScore: 0
  },
  {
    id: "5",
    name: "Riley P.",
    email: "riley.p@example.com",
    lastCheckinAt: "2024-01-12",
    risk: "amber" as RiskLevel,
    moodTrend: "stable",
    phqScore: 3
  }
];

const ClinicianDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const riskCounts = mockPatients.reduce((acc, patient) => {
    acc[patient.risk] = (acc[patient.risk] || 0) + 1;
    return acc;
  }, {} as Record<RiskLevel, number>);

  const viewPatient = (patientId: string) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-7xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Patient Dashboard</h1>
              <p className="text-muted-foreground mt-2">Monitor patient wellbeing and risk assessments</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{mockPatients.length} Patients</span>
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
                    <p className="text-2xl font-bold">{mockPatients.length}</p>
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
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                View and manage patient wellness data and risk assessments
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
                          <h3 className="font-semibold">{patient.name}</h3>
                          <RiskBadge risk={patient.risk} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span>Email: </span>
                            <span className="font-medium">{patient.email}</span>
                          </div>
                          <div>
                            <span>Last Check-in: </span>
                            <span className="font-medium">{patient.lastCheckinAt}</span>
                          </div>
                          <div>
                            <span>PHQ Score: </span>
                            <span className="font-medium">{patient.phqScore}</span>
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

              {filteredPatients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No patients found matching your search.</p>
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