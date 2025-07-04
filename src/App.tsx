
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuardianDashboard from "./components/GuardianDashboard";
import NexusAI from "./components/NexusAI";
import SystemManagement from "./components/SystemManagement";
import GuardianMonitoring from "./components/GuardianMonitoring";
import GuardianProvisioning from "./components/GuardianProvisioning";
import GuardianTelephony from "./components/GuardianTelephony";
import GuardianUsers from "./components/GuardianUsers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
