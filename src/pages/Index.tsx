import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import FeedbacksSection from "@/components/FeedbacksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { scrollYProgress } = useScroll();

  // Parallax transforms for different blobs
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -600]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Global Parallax Background Blobs & Clouds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Soft Background Blobs (Base) */}
        <motion.div style={{ y: y1 }} className="clay-blob w-[500px] h-[500px] top-[10%] -left-[10%] animate-float-slow opacity-60" />
        <motion.div style={{ y: y2 }} className="clay-blob w-[400px] h-[400px] top-[40%] -right-[5%] animate-float-medium opacity-40 hidden md:block" />
        <motion.div style={{ y: y3 }} className="clay-blob w-[300px] h-[300px] bottom-[20%] left-[20%] animate-float-fast opacity-50" />

        {/* 3D "Meta-Clouds" - Reference Inspired */}
        <motion.div style={{ y: y3 }} className="absolute top-[20%] right-[15%] w-64 h-48 pointer-events-none hidden md:block">
          <div className="clay-cloud w-32 h-32 top-0 left-0 animate-float-medium" />
          <div className="clay-cloud w-24 h-24 top-8 left-16 animate-float-slow" style={{ animationDelay: "2s" }} />
          <div className="clay-cloud w-20 h-20 -top-4 left-8 animate-float-fast" style={{ animationDelay: "1s" }} />
        </motion.div>

        <motion.div style={{ y: y2 }} className="absolute top-[55%] -left-[5%] w-80 h-64 pointer-events-none opacity-70">
          <div className="clay-cloud w-40 h-40 top-0 left-0 animate-float-slow" />
          <div className="clay-cloud w-32 h-32 top-10 left-20 animate-float-medium" style={{ animationDelay: "3s" }} />
          <div className="clay-cloud w-28 h-28 -top-8 left-32 animate-float-fast" style={{ animationDelay: "1.5s" }} />
        </motion.div>

        <motion.div style={{ y: y4 }} className="absolute top-[80%] right-[10%] w-72 h-56 pointer-events-none opacity-60 hidden md:block">
          <div className="clay-cloud w-36 h-36 bottom-0 right-0 animate-float-fast" />
          <div className="clay-cloud w-28 h-28 bottom-12 right-16 animate-float-slow" style={{ animationDelay: "4s" }} />
          <div className="clay-cloud w-24 h-24 -bottom-4 right-8 animate-float-medium" style={{ animationDelay: "2.5s" }} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProjectsSection />
        <FeedbacksSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
