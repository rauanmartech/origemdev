import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

// Lazy load non-critical sections
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const FeedbacksSection = lazy(() => import("@/components/FeedbacksSection"));
const AboutSection = lazy(() => import("@/components/AboutSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionSkeleton = () => (
  <div className="py-24 px-4 max-w-6xl mx-auto space-y-8">
    <div className="h-12 w-1/3 bg-muted animate-pulse rounded-xl mx-auto" />
    <div className="h-96 w-full bg-muted animate-pulse rounded-[3rem]" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      <Navbar />
      <HeroSection />
      <Suspense fallback={<SectionSkeleton />}>
        <ProjectsSection />
        <AboutSection />
        <FeedbacksSection />
        <ContactSection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
