import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BoyczukBriefing from "@/briefings/boyczuk/index";
import { supabase } from "@/lib/supabase";

const BriefingBoyczuk = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      
      {/* Background Parallax */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div style={{ y: y1 }} className="clay-blob w-[500px] h-[500px] top-[10%] -left-[10%] animate-float-slow opacity-60" />
        <motion.div style={{ y: y2 }} className="clay-blob w-[400px] h-[400px] top-[40%] -right-[5%] animate-float-medium opacity-40 hidden md:block" />
      </div>

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-12 selection:bg-primary/30">
        <BoyczukBriefing userId={userId} />
      </main>

      <Footer />
    </div>
  );
};

export default BriefingBoyczuk;
