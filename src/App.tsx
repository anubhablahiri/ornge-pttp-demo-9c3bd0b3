import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/i18n";
import Welcome from "./pages/Welcome";
import FormatSelector from "./pages/FormatSelector";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AdminPortal from "./pages/AdminPortal";
import AdminLogin from "./pages/AdminLogin";
import DeviceFrame from "./components/DeviceFrame";
import VersionSelector from "./pages/VersionSelector";
import V1Home from "./pages/v1/V1Home";
import V1Status from "./pages/v1/V1Status";
import V1Admin from "./pages/v1/V1Admin";
import V1FAQ from "./pages/v1/V1FAQ";

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
            {/* Version selector */}
            <Route path="/" element={<VersionSelector />} />

            {/* V1 routes */}
            <Route path="/v1" element={<V1Home />} />
            <Route path="/v1/status/:id" element={<V1Status />} />
            <Route path="/v1/admin" element={<V1Admin />} />
            <Route path="/v1/faq" element={<V1FAQ />} />

            {/* V3 routes (current full platform) */}
            <Route path="/v3" element={<Welcome />} />
            <Route path="/v3/platform" element={<FormatSelector />} />
            <Route path="/v3/login" element={<FramedLogin />} />
            <Route path="/v3/track/:id" element={<FramedDashboard />} />
            <Route path="/v3/tablet/track/:id" element={<FramedDashboard />} />
            <Route path="/v3/desktop/track/:id" element={<Dashboard />} />
            <Route path="/v3/admin-login" element={<AdminLogin />} />
            <Route path="/v3/admin" element={<AdminPortal />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
