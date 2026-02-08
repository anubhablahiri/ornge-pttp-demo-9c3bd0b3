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
            <Route path="/" element={<Welcome />} />
            <Route path="/platform" element={<FormatSelector />} />
            <Route path="/login" element={<FramedLogin />} />
            <Route path="/track/:id" element={<FramedDashboard />} />
            <Route path="/tablet/track/:id" element={<FramedDashboard />} />
            <Route path="/desktop/track/:id" element={<Dashboard />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
