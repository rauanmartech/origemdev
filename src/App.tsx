import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Lazy load pages for code splitting with absolute paths
const Index = lazy(() => import("@/pages/Index"));
const Orcamentos = lazy(() => import("@/pages/Orcamentos"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ProjectTimelineNEF = lazy(() => import("@/pages/ProjectTimelineNEF"));
const BriefingBoyczuk = lazy(() => import("@/pages/BriefingBoyczuk"));
const Login = lazy(() => import("@/pages/Login"));
const ClientArea = lazy(() => import("@/pages/ClientArea"));
const AdminArea = lazy(() => import("@/pages/AdminArea"));

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const ScrollToSection = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      } else {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = el.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 500);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ToasterSonner />
      <BrowserRouter>
        <ScrollToSection />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/orcamentos" element={<Orcamentos />} />
            <Route path="/trilha/nef-seguros" element={<ProjectTimelineNEF />} />
            <Route path="/briefing/boyczuk" element={<BriefingBoyczuk />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cliente" element={<ClientArea />} />
            <Route path="/admin" element={<AdminArea />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Helper for sonar rename if needed
const ToasterSonner = Sonner;

export default App;
