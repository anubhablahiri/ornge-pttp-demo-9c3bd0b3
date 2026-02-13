import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/lib/i18n";
import GateLogin from "./pages/GateLogin";
import Stats from "./pages/Stats";
import VersionSelector from "./pages/VersionSelector";
import V1Welcome from "./pages/V1Welcome";
import V1FormatSelector from "./pages/V1FormatSelector";
import V1Login from "./pages/V1Login";
import V1Dashboard from "./pages/V1Dashboard";
import V1AdminLogin from "./pages/V1AdminLogin";
import V1AdminPortal from "./pages/V1AdminPortal";
import V2Welcome from "./pages/V2Welcome";
import V2FormatSelector from "./pages/V2FormatSelector";
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
import GateGuard from "./components/GateGuard";
import SessionEndTracker from "./components/SessionEndTracker";
const queryClient = new QueryClient();

// V1 framed components
function V1FramedLogin() {
  return <DeviceFrame><V1Login /></DeviceFrame>;
}
function V1FramedDashboard() {
  return <DeviceFrame><V1Dashboard /></DeviceFrame>;
}

// V2 framed components
function V2FramedLogin() {
  return <DeviceFrame><V2Login /></DeviceFrame>;
}
function V2FramedDashboard() {
  return <DeviceFrame><V2Dashboard /></DeviceFrame>;
}

// V3 framed components
function FramedLogin() {
  return <DeviceFrame><Login /></DeviceFrame>;
}
function FramedDashboard() {
  return <DeviceFrame><Dashboard /></DeviceFrame>;
}

function G({ children }: { children: React.ReactNode }) {
  return <GateGuard>{children}</GateGuard>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SessionEndTracker />
        <BrowserRouter>
          <Routes>
            {/* Gate login */}
            <Route path="/" element={<GateLogin />} />
            {/* Secret stats page — only accessible by Arlan */}
            <Route path="/stats" element={<Stats />} />
            {/* Version selector */}
            <Route path="/versions" element={<G><VersionSelector /></G>} />

            {/* V1 routes */}
            <Route path="/v1" element={<G><V1Welcome /></G>} />
            <Route path="/v1/platform" element={<G><V1FormatSelector /></G>} />
            <Route path="/v1/login" element={<G><V1FramedLogin /></G>} />
            <Route path="/v1/track/:id" element={<G><V1FramedDashboard /></G>} />
            <Route path="/v1/admin-login" element={<G><V1AdminLogin /></G>} />
            <Route path="/v1/admin" element={<G><V1AdminPortal /></G>} />

            {/* V2 routes */}
            <Route path="/v2" element={<G><V2Welcome /></G>} />
            <Route path="/v2/platform" element={<G><V2FormatSelector /></G>} />
            <Route path="/v2/login" element={<G><V2FramedLogin /></G>} />
            <Route path="/v2/track/:id" element={<G><V2FramedDashboard /></G>} />
            <Route path="/v2/admin-login" element={<G><V2AdminLogin /></G>} />
            <Route path="/v2/admin" element={<G><V2AdminPortal /></G>} />

            {/* V3 routes (current full platform) */}
            <Route path="/v3" element={<G><Welcome /></G>} />
            <Route path="/v3/platform" element={<G><FormatSelector /></G>} />
            <Route path="/v3/login" element={<G><FramedLogin /></G>} />
            <Route path="/v3/track/:id" element={<G><FramedDashboard /></G>} />
            <Route path="/v3/tablet/track/:id" element={<G><FramedDashboard /></G>} />
            <Route path="/v3/desktop/track/:id" element={<G><Dashboard /></G>} />
            <Route path="/v3/admin-login" element={<G><AdminLogin /></G>} />
            <Route path="/v3/admin" element={<G><AdminPortal /></G>} />

            {/* Legacy routes kept for compatibility */}
            <Route path="/platform" element={<G><FormatSelector /></G>} />
            <Route path="/login" element={<G><FramedLogin /></G>} />
            <Route path="/track/:id" element={<G><FramedDashboard /></G>} />
            <Route path="/tablet/track/:id" element={<G><FramedDashboard /></G>} />
            <Route path="/desktop/track/:id" element={<G><Dashboard /></G>} />
            <Route path="/admin-login" element={<G><AdminLogin /></G>} />
            <Route path="/admin" element={<G><AdminPortal /></G>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
