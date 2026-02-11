import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/i18n";
import GateLogin from "./pages/GateLogin";
import VersionSelector from "./pages/VersionSelector";
import Welcome from "./pages/Welcome";
import FormatSelector from "./pages/FormatSelector";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminPortal from "./pages/AdminPortal";
import AdminLogin from "./pages/AdminLogin";
import DeviceFrame from "./components/DeviceFrame";

const queryClient = new QueryClient();

function FramedLogin() {
  return (
    <DeviceFrame>
      <Login />
    </DeviceFrame>
  );
}

function FramedDashboard() {
  return (
    <DeviceFrame>
      <Dashboard />
    </DeviceFrame>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Gate login */}
            <Route path="/" element={<GateLogin />} />
            {/* Version selector */}
            <Route path="/versions" element={<VersionSelector />} />

            {/* V3 routes (current full platform) */}
            <Route path="/v3" element={<Welcome />} />
            <Route path="/v3/platform" element={<FormatSelector />} />
            <Route path="/v3/login" element={<FramedLogin />} />
            <Route path="/v3/track/:id" element={<FramedDashboard />} />
            <Route path="/v3/tablet/track/:id" element={<FramedDashboard />} />
            <Route path="/v3/desktop/track/:id" element={<Dashboard />} />
            <Route path="/v3/admin-login" element={<AdminLogin />} />
            <Route path="/v3/admin" element={<AdminPortal />} />

            {/* Legacy routes kept for compatibility */}
            <Route path="/platform" element={<FormatSelector />} />
            <Route path="/login" element={<FramedLogin />} />
            <Route path="/track/:id" element={<FramedDashboard />} />
            <Route path="/tablet/track/:id" element={<FramedDashboard />} />
            <Route path="/desktop/track/:id" element={<Dashboard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPortal />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
