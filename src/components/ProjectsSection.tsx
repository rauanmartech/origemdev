import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { projectsData } from "../data/projectsData";
import { ProjectCard } from "./ProjectCard";
import projetosMascot from "../assets/projetos.webp";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const ProjectsSection = () => {
  // Desktop: Exclude 'nerine' and take exactly 5 projects
  const desktopProjects = projectsData
    .filter((p) => p.id !== "nerine-clube-de-cartas")
    .slice(0, 5);
    
  // Mobile: Take 6 projects
  const mobileProjects = projectsData.slice(0, 6);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === mobileProjects.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? mobileProjects.length - 1 : prev - 1));
  };

  return (
    <section id="projetos" className="py-12 md:py-24 px-4 relative mt-8 md:mt-0">
      {/* Desktop Mascot */}
      <img
        src={projetosMascot}
        alt="Mascote Projetos"
        className="hidden md:block absolute bottom-0 left-0 z-20 h-[400px] lg:h-[500px] w-auto object-contain pointer-events-none"
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="clay-badge text-sm mb-4 inline-block">Portfólio</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Projetos em Destaque
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Uma seleção dos meus trabalhos mais recentes e relevantes.
          </p>
        </motion.div>

        {/* Grid View (Desktop Only) */}
        <motion.div
          className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {desktopProjects.map((project, index) => {
            let colClasses = "col-span-4 md:col-span-2 lg:col-span-2";
            if (index === 3) {
              colClasses += " lg:col-start-2";
            }
            if (index === 4) {
              colClasses += " md:col-start-2 lg:col-start-4";
            }
            return (
              <div key={project.id} className={colClasses}>
                <ProjectCard project={project} index={index} />
              </div>
            );
          })}
        </motion.div>

        {/* Carousel View (Mobile Only) */}
        <div className="md:hidden flex flex-col items-center w-full">
          <div className="w-full relative px-2 py-8 overflow-visible">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ProjectCard project={mobileProjects[currentIndex]} index={0} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-md active:scale-95 transition-transform"
              aria-label="Projeto anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex gap-2">
              {mobileProjects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "bg-[hsl(25,95%,53%)] scale-125" : "bg-gray-300"
                  }`}
                  aria-label={`Ir para projeto ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-md active:scale-95 transition-transform"
              aria-label="Próximo projeto"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* View All Projects Button */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link
            to="/projetos"
            className="group flex items-center justify-between gap-4 md:gap-8 rounded-full bg-[#181c20] text-white p-1.5 pl-6 md:pl-8 active:scale-95 transition-transform"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
          >
            <span className="uppercase text-xs md:text-sm font-bold tracking-wider pt-0.5">Ver Todos os Projetos</span>
            <div className="rounded-full flex items-center justify-center w-10 h-10 md:w-11 md:h-11 shrink-0" style={{ background: "hsl(25, 95%, 53%)" }}>
              <ArrowRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
            </div>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default ProjectsSection;
