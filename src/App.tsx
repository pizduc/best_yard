import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DocumentsPage from "./pages/Documents";
import Regulations from "./pages/Documents/Regulations";
import ParticipationRules from "./pages/Documents/ParticipationRules";
import EvaluationCriteria from "./pages/Documents/EvaluationCriteria";
import FAQ from "./pages/Documents/FAQ";
import PrivacyPolicy from "./pages/Documents/PrivacyPolicy";
import Admin from "./pages/Admin";
import UserAgreement from "./pages/Documents/UserAgreement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/regulations" element={<Regulations />} />
          <Route path="/documents/participation-rules" element={<ParticipationRules />} />
          <Route path="/documents/evaluation-criteria" element={<EvaluationCriteria />} />
          <Route path="/documents/faq" element={<FAQ />} />
          <Route path="/documents/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/documents/useragreement" element={<UserAgreement />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
