import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo and Brand */}
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">WarriorCare AI</h1>
              <p className="text-xl text-white/90 mb-2">Confidential Check-ins. Clear Insights.</p>
              <p className="text-white/80 max-w-2xl mx-auto">
                This tool is for wellbeing tracking and is not a medical device. 
                Your privacy and safety are our top priorities.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-2">Daily Wellness</h3>
                <p className="text-sm text-white/80">Track mood, sleep, and overall wellbeing</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Lock className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-2">Private & Secure</h3>
                <p className="text-sm text-white/80">Your data is encrypted and confidential</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-semibold mb-2">Professional Care</h3>
                <p className="text-sm text-white/80">Connect with mental health professionals</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
            <p className="text-white/70 text-sm mt-4">
              Free and confidential • Available 24/7
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Welcome;