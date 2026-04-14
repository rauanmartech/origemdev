import { motion } from "framer-motion";
import { ArrowDown, Camera, Code, Cpu, Database, Terminal } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/1000119534.jpg";

const DecodingText = ({ words, interval = 3000, duration = 500 }: { words: string[], interval?: number, duration?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);
  const [isDecoding, setIsDecoding] = useState(false);

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@&%*";

  const decode = useCallback(async (newWord: string) => {
    setIsDecoding(true);
    const steps = 10;
    const stepDuration = duration / steps;
    const currentWord = words[currentIndex];

    // Max length to handle transition
    const maxLength = Math.max(currentWord.length, newWord.length);

    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));

      let progress = i / steps;
      let result = "";

      // Calculate current length based on progress
      const currentLen = Math.floor(currentWord.length + (newWord.length - currentWord.length) * progress);

      for (let j = 0; j < currentLen; j++) {
        if (progress > 0.8 || (j < newWord.length && Math.random() < progress)) {
          result += newWord[j] || "";
        } else {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
      }
      setDisplayText(result);
    }
    setIsDecoding(false);
  }, [currentIndex, duration, words]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % words.length;
      decode(words[nextIndex]);
      setCurrentIndex(nextIndex);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, decode, interval, words]);

  return (
    <span className="inline-block min-w-[4ch] text-primary relative">
      {displayText}
      {isDecoding && (
        <span className="absolute -right-1 top-0 w-[2px] h-full bg-primary animate-pulse" />
      )}
    </span>
  );
};

const HeroSection = () => {
  const words = ["experiências", "soluções", "produtos", "interfaces", "sistemas"];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32 md:py-20">
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">
        {/* Photo Container with Bubbles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative shrink-0 mb-8 lg:mb-0"
        >
          {/* Main Photo Card - Increased Size */}
          <div className="clay-card w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative z-10 border border-primary/10 shadow-xl">
            <img
              src={heroImage}
              alt="Perfil"
              width="384"
              height="384"
              fetchpriority="high"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>

          {/* Programming Bubbles - Adjusted positions */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="clay-card absolute -top-4 -right-4 md:-top-6 md:-right-6 w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center z-20 bg-card/80 backdrop-blur-sm shadow-lg border border-primary/5"
          >
            <Code className="w-7 h-7 md:w-10 md:h-10 text-primary" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="clay-card absolute bottom-10 -left-6 md:bottom-16 md:-left-12 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center z-20 bg-card/80 backdrop-blur-sm shadow-lg border border-primary/5"
          >
            <Cpu className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          </motion.div>

          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="clay-card absolute -bottom-4 right-8 md:-bottom-6 md:right-12 w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center z-20 bg-card/80 backdrop-blur-sm shadow-md border border-primary/5"
          >
            <Database className="w-5 h-5 md:w-7 md:h-7 text-primary" />
          </motion.div>

          <motion.div
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="clay-card absolute top-10 -right-6 md:top-16 md:-right-10 w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center z-20 bg-card/80 backdrop-blur-sm shadow-md border border-primary/5"
          >
            <Terminal className="w-5 h-5 md:w-7 md:h-7 text-primary" />
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="text-center lg:text-left flex-1 px-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="clay-badge text-xs md:text-sm mb-6 inline-block">
              Desenvolvedor Web Fullstack
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Transformo ideias em{" "}
            <br className="md:hidden" />
            <DecodingText words={words} />
            <div className="text-foreground">digitais</div>
          </motion.h1>

          <motion.p
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 md:mb-8 leading-relaxed px-4 md:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Crio aplicações web modernas e performáticas, com design que encanta{" "}
            <span className="text-primary font-medium">desde a origem</span>.
            Do conceito ao deploy, cada detalhe importa.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <a href="#projetos" className="clay-btn text-base md:text-lg min-w-[180px] text-center shadow-lg active:scale-95 transition-transform">
              Ver Projetos
            </a>
            <Link to="/orcamentos" className="clay-btn-outline text-base md:text-lg min-w-[180px] text-center shadow-md active:scale-95 transition-transform">
              Criar Meu Site Profissional
            </Link>
            {/* Solicitar Orçamento button - Mobile only */}
            <Link to="/orcamentos" className="md:hidden clay-btn-outline text-base min-w-[180px] text-center shadow-md active:scale-95 transition-transform">
              Receber Proposta
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <a href="#projetos" className="inline-block animate-float relative z-30">
          <div className="clay-icon bg-card shadow-lg border border-primary/10">
            <ArrowDown className="w-6 h-6 text-primary" />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
