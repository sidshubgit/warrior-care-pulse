import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/checkin" element={<DailyCheckIn />} />
          <Route path="/history" element={<History />} />
          <Route path="/dashboard" element={<ClinicianDashboard />} />
          <Route path="/patient/:id" element={<PatientDetail />} />
          <Route path="/help" element={<Help />} />
          {/* Legacy route for the original index */}
          <Route path="/index" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
