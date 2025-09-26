import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Competitions from "./pages/Competitions";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import Results from "./pages/Results";
import Schools from "./pages/Schools";
import Club from "./pages/Club";
import Sponsors from "./pages/Sponsors";
import Media from "./pages/Media";
import CoachDashboard from "./pages/CoachDashboard";
import SponsorDashboard from "./pages/SponsorDashboard";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/results" element={<Results />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/club" element={<Club />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/media" element={<Media />} />
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/sponsor" element={<SponsorDashboard />} />
          <Route path="/blog" element={<Blog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
