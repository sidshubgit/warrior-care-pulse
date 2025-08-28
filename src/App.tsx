import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth } from "@/components/RequireAuth";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Consent from "./pages/Consent";
import DailyCheckIn from "./pages/DailyCheckIn";
import History from "./pages/History";
import ClinicianDashboard from "./pages/ClinicianDashboard";
import PatientDetail from "./pages/PatientDetail";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/consent" element={
              <RequireAuth role="participant">
                <Consent />
              </RequireAuth>
            } />
            <Route path="/checkin" element={
              <RequireAuth role="participant">
                <DailyCheckIn />
              </RequireAuth>
            } />
            <Route path="/history" element={
              <RequireAuth role="participant">
                <History />
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth role="clinician">
                <ClinicianDashboard />
              </RequireAuth>
            } />
            <Route path="/patient/:id" element={
              <RequireAuth role="clinician">
                <PatientDetail />
              </RequireAuth>
            } />
            <Route path="/help" element={<Help />} />
            {/* Legacy route for the original index */}
            <Route path="/index" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
