
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./components/AuthPage";
import GuardianDashboard from "./components/GuardianDashboard";
import NexusAI from "./components/NexusAI";
import SystemManagement from "./components/SystemManagement";
import GuardianMonitoring from "./components/GuardianMonitoring";
import GuardianProvisioning from "./components/GuardianProvisioning";
import GuardianTelephony from "./components/GuardianTelephony";
import GuardianUsers from "./components/GuardianUsers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// App Content Component
const AppContent = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // If user is not authenticated, show auth page
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If user is authenticated but not approved, show auth page with message
  if (profile && profile.status !== 'approved') {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // User is authenticated and approved, show main app
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/guardian" element={<GuardianDashboard />} />
                    <Route path="/guardian/monitoring" element={<GuardianMonitoring />} />
                    <Route path="/guardian/provisioning" element={<GuardianProvisioning />} />
                    <Route path="/guardian/telephony" element={<GuardianTelephony />} />
                    <Route path="/guardian/users" element={<GuardianUsers />} />
                    <Route path="/nexus" element={<NexusAI />} />
                    <Route path="/nexus/*" element={<NexusAI />} />
                    <Route path="/system" element={<SystemManagement />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
