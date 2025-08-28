import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MessageCircle, Globe, Heart, Shield } from "lucide-react";

const Help = () => {
  const emergencyNumbers = [
    {
      title: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support in English and Spanish"
    },
    {
      title: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis counseling via text message"
    },
    {
      title: "Veterans Crisis Line",
      number: "1-800-273-8255 (Press 1)",
      description: "24/7 support specifically for veterans"
    },
    {
      title: "Military Crisis Line",
      number: "1-800-273-8255 (Press 1)",
      description: "Confidential support for active duty service members"
    }
  ];

  const resources = [
    {
      title: "Military Family Life Counselors",
      description: "Confidential counseling support for military families",
      icon: Heart
    },
    {
      title: "Chaplain Services", 
      description: "Spiritual care and counseling available 24/7",
      icon: Shield
    },
    {
      title: "Employee Assistance Program",
      description: "Free counseling and support services",
      icon: Phone
    },
    {
      title: "Mental Health America",
      description: "Resources and support for mental health conditions",
      icon: Globe
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen p-4 bg-muted/30">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold">Crisis Resources & Help</h1>
            <p className="text-muted-foreground mt-2">
              If you're experiencing a mental health crisis, help is available 24/7
            </p>
          </div>

          {/* Emergency Alert */}
          <Card className="border-destructive/20 bg-destructive/5 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-destructive mt-1" />
                <div>
                  <h3 className="font-bold text-destructive mb-2">If this is an emergency:</h3>
                  <p className="text-sm mb-4">
                    If you are in immediate danger or having thoughts of suicide, please contact emergency services immediately.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => window.open('tel:911')}
                    >
                      Call 911
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open('tel:988')}
                    >
                      Call 988 (Suicide Prevention)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Numbers */}
          <Card className="medical-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Crisis Support Numbers
              </CardTitle>
              <CardDescription>
                Free, confidential support available 24/7
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {emergencyNumbers.map((resource, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`tel:${resource.number.replace(/[^0-9]/g, '')}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                    </div>
                    <p className="text-lg font-mono text-primary mb-1">{resource.number}</p>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card className="medical-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Additional Support Resources
              </CardTitle>
              <CardDescription>
                Professional counseling and support services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Safety Planning */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Crisis Safety Planning
              </CardTitle>
              <CardDescription>
                Steps to take when experiencing a mental health crisis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">1. Recognize Warning Signs</h4>
                  <p className="text-sm text-muted-foreground">
                    Notice early signs like changes in sleep, mood, or thinking patterns
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">2. Use Coping Strategies</h4>
                  <p className="text-sm text-muted-foreground">
                    Try deep breathing, grounding techniques, or calling a trusted friend
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">3. Reach Out for Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact a crisis line, counselor, or trusted person in your support network
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold mb-2">4. Create a Safe Environment</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove means of self-harm and stay with supportive people
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Help;