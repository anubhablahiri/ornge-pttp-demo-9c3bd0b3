import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/i18n";
import GateLogin from "./pages/GateLogin";
import VersionSelector from "./pages/VersionSelector";
import V1Welcome from "./pages/V1Welcome";
import V1Login from "./pages/V1Login";
import V1Dashboard from "./pages/V1Dashboard";
import V1AdminLogin from "./pages/V1AdminLogin";
import V1AdminPortal from "./pages/V1AdminPortal";
import V2Welcome from "./pages/V2Welcome";
import V2Login from "./pages/V2Login";
import V2Dashboard from "./pages/V2Dashboard";
import V2AdminLogin from "./pages/V2AdminLogin";
import V2AdminPortal from "./pages/V2AdminPortal";
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

            {/* V1 routes */}
            <Route path="/v1" element={<V1Welcome />} />
            <Route path="/v1/login" element={<V1Login />} />
            <Route path="/v1/track/:id" element={<V1Dashboard />} />
            <Route path="/v1/admin-login" element={<V1AdminLogin />} />
            <Route path="/v1/admin" element={<V1AdminPortal />} />

            {/* V2 routes */}
            <Route path="/v2" element={<V2Welcome />} />
            <Route path="/v2/login" element={<V2Login />} />
            <Route path="/v2/track/:id" element={<V2Dashboard />} />
            <Route path="/v2/admin-login" element={<V2AdminLogin />} />
            <Route path="/v2/admin" element={<V2AdminPortal />} />

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
