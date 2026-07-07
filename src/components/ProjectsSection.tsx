import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { projectsData } from "../data/projectsData";
import { ProjectCard } from "./ProjectCard";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const ProjectsSection = () => {
  // Take only the first 6 projects for the home page
  const featuredProjects = projectsData.slice(0, 6);

  return (
    <section id="projetos" className="py-16 md:py-24 px-4 relative">
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

        {/* Grid View (Mobile & Desktop) */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* View All Projects Button */}
        <motion.div 
          className="mt-16 flex justify-center"
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
