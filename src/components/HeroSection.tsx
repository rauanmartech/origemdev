import { motion } from "framer-motion";
import { Zap, Layout, Code, Server, ArrowUpRight, ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-section.jpeg";

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
    <span className="inline-block min-w-[4ch] relative" style={{ color: "hsl(25, 95%, 53%)" }}>
      {displayText}
      {isDecoding && (
        <span className="absolute -right-1 top-0 w-[2px] h-full animate-pulse" style={{ background: "hsl(25, 95%, 53%)" }} />
      )}
    </span>
  );
};

const HeroSection = () => {
  const words = ["experiências", "soluções", "produtos", "interfaces", "sistemas"];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center px-4 py-32 md:py-20"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Left-to-right white fade — solid on left, transparent at center */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.9) 25%, transparent 55%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Text content — left aligned */}
        <div className="text-left flex-1 px-2 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="text-xs md:text-sm mb-6 inline-block rounded-xl px-3 py-1 font-medium"
              style={{
                background: "hsl(25 95% 53% / 0.12)",
                color: "hsl(25, 95%, 53%)",
                boxShadow: "4px 4px 10px hsl(0 0% 82%), -2px -2px 8px hsl(0 0% 100% / 0.8)",
              }}
            >
              Desenvolvedor Web Fullstack
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
            style={{ color: "hsl(20, 14%, 10%)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Transformo ideias em{" "}
            <br className="md:hidden" />
            <DecodingText words={words} />
            <div style={{ color: "hsl(20, 14%, 10%)" }}>digitais</div>
          </motion.h1>

          <motion.p
            className="text-base md:text-xl max-w-xl mb-10 md:mb-8 leading-relaxed"
            style={{ color: "hsl(20, 10%, 42%)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Crio aplicações web modernas e performáticas, com design que encanta{" "}
            <span style={{ color: "hsl(25, 95%, 53%)", fontWeight: 500 }}>desde a origem</span>.
            Do conceito ao deploy, cada detalhe importa.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-start mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {/* Primary button */}
            <a
              href="#projetos"
              className="group flex items-center justify-between gap-4 md:gap-8 rounded-full bg-[#181c20] text-white p-1.5 pl-6 md:pl-8 active:scale-95 transition-transform"
              style={{
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              }}
            >
              <span className="uppercase text-xs md:text-sm font-bold tracking-wider pt-0.5">Ver Projetos</span>
              <div className="rounded-full flex items-center justify-center w-10 h-10 md:w-11 md:h-11 shrink-0" style={{ background: "hsl(25, 95%, 53%)" }}>
                <ArrowUpRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
              </div>
            </a>

            {/* Secondary button */}
            <Link
              to="/orcamentos"
              className="group flex items-center justify-between gap-4 md:gap-8 rounded-full bg-white text-gray-800 p-1.5 pl-6 md:pl-8 active:scale-95 transition-all shadow-md hover:shadow-lg"
              style={{
                border: "1px solid rgba(0,0,0,0.05)"
              }}
            >
              <span className="uppercase text-xs md:text-sm font-bold tracking-wider pt-0.5">Criar Site Profissional</span>
              <div className="rounded-full flex items-center justify-center w-10 h-10 md:w-11 md:h-11 shrink-0 shadow-sm" style={{ background: "hsl(25, 95%, 53%)" }}>
                <ArrowUpRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-45" strokeWidth={2.5} />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>


      {/* Futuristic Feature Band (Leaks out of bottom) */}
      <div className="absolute left-0 right-0 -bottom-16 md:-bottom-10 z-40 px-4 flex justify-center">
        <motion.div
          className="bg-white rounded-[1.5rem] max-w-7xl w-full py-4 px-6 md:py-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          style={{
            boxShadow: "0 25px 50px -12px rgba(25, 10, 5, 0.15), 0 0 0 1px rgba(255, 102, 0, 0.1), inset 0 0 20px rgba(255, 102, 0, 0.03)",
          }}
        >
          {/* Feature 1 */}
          <div className="flex flex-row items-center gap-3 pt-3 md:pt-0 md:pl-4 first:pt-0 first:pl-0">
            <div className="p-2 rounded-lg shrink-0" style={{ background: "hsl(25 95% 53% / 0.1)" }}>
              <Zap className="w-5 h-5" style={{ color: "hsl(25, 95%, 53%)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">Alta Performance</h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-snug mt-0.5">Carregamento e SEO otimizados.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-row items-center gap-3 pt-3 md:pt-0 md:pl-6">
            <div className="p-2 rounded-lg shrink-0" style={{ background: "hsl(25 95% 53% / 0.1)" }}>
              <Layout className="w-5 h-5" style={{ color: "hsl(25, 95%, 53%)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">Design Moderno</h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-snug mt-0.5">Interfaces e micro-interações.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-row items-center gap-3 pt-3 md:pt-0 md:pl-6">
            <div className="p-2 rounded-lg shrink-0" style={{ background: "hsl(25 95% 53% / 0.1)" }}>
              <Code className="w-5 h-5" style={{ color: "hsl(25, 95%, 53%)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">Tecnologia de Ponta</h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-snug mt-0.5">Stacks modernas do mercado.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-row items-center gap-3 pt-3 md:pt-0 md:pl-6">
            <div className="p-2 rounded-lg shrink-0" style={{ background: "hsl(25 95% 53% / 0.1)" }}>
              <Server className="w-5 h-5" style={{ color: "hsl(25, 95%, 53%)" }} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">Escalabilidade</h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-snug mt-0.5">Arquitetura robusta para crescer.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
