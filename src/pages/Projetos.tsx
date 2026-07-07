import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { projectsData } from "../data/projectsData";
import { ProjectCard } from "../components/ProjectCard";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const Projetos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-16 md:py-32 px-4 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="clay-badge text-sm mb-4 inline-block">Portfólio Completo</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos Projetos
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Explore o acervo completo de projetos desenvolvidos.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6 lg:gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {projectsData.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projetos;
