import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { ExternalLink, Code2, ChevronDown, ChevronLeft, ChevronRight, Palette, Globe, ShoppingCart, BarChart3, Smartphone, ImageIcon, Scissors, Heart, Building2, Dumbbell, Stethoscope, Brush } from "lucide-react";

// Import all project assets
import pingadoImg from "../assets/pingado.ink.png";
import pingadoVideo from "../assets/pingado-video.mp4";
import anaBrantImg from "../assets/ana-brant.png";
import anaBrantVideo from "../assets/ana-brant-video.mp4";
import gruminsImg from "../assets/grumins.png";
import gruminsVideo from "../assets/grumins-video.mp4";
import ruanBaraunaImg from "../assets/ruan-barauna.png";
import ruanBaraunaVideo from "../assets/ruan-barauna-video.mp4";
import drMarcoImg from "../assets/drmarco.png";
import drMarcoVideo from "../assets/drmarco-video.mp4";
import agendamentoBarbeariaImg from "../assets/agendamento-barbearia.png";
import pingadoStoreImg from "../assets/pingadostore.png";
import pingadoStoreVideo from "../assets/pingadostore-video.mp4";

const projects = [
  {
    title: "E-Commerce Pingado",
    description: "E-commerce completo com catálogo, carrinho, checkout seguro, pagamentos via Pix e cartão, painel administrativo e gestão de pedidos.",
    tech: ["Loja Online", "Vite", "Typescript", "React"],
    icon: ShoppingCart,
    image: pingadoStoreImg,
    video: pingadoStoreVideo,
  },
  {
    title: "Pingado.ink",
    description: "Uma experiência digital brutalista que une tatuagem autoral e mineiridade, expressando a essência do estúdio de forma crua, intensa e cheia de identidade.",
    tech: ["Estúdio de Tatuagem", "React", "Node.js", "Stripe"],
    icon: Brush,
    image: pingadoImg,
    video: pingadoVideo,
    link: "https://pingadoink.vercel.app",
  },
  {
    title: "Ana Brant",
    description: "Um site minimalista que transmite leveza e acolhimento, criando uma experiência digital serena, intuitiva e conectada ao bem-estar e à prática do yoga.",
    tech: ["Professora de Yoga", "TypeScript", "D3.js", "API REST"],
    icon: Heart,
    image: anaBrantImg,
    video: anaBrantVideo,
    link: "https://anabrant-yoga.web.app/",
  },
  {
    title: "Grumins - Grupo Mineiro de Negócios",
    description: "Presença digital construída para comunicar autoridade e propriedade, com foco em eficácia, experiência e confiança na intermediação imobiliária.",
    tech: ["Sociedade de Negócios", "React", "PWA", "Firebase"],
    icon: Building2,
    image: gruminsImg,
    video: gruminsVideo,
    link: "https://gruminsparcerias.vercel.app/",
  },
  {
    title: "Ruan Baraúna",
    description: "Um site que transmite alto rendimento e autoridade, refletindo a experiência de um preparador físico de elite focado em performance, disciplina e resultados reais.",
    tech: ["Preparador Físico", "Next.js", "Framer Motion", "SEO"],
    icon: Dumbbell,
    image: ruanBaraunaImg,
    video: ruanBaraunaVideo,
    link: "https://ruan-barauna.web.app/",
  },
  {
    title: "Doutor Marco Antônio",
    description: "Uma plataforma digital que organiza agendamentos e comunica o compromisso da clínica com saúde, carinho e responsabilidade com os pets.",
    tech: ["Clínica Veterinária", "React", "Node.js", "Calendly"],
    icon: Stethoscope,
    image: drMarcoImg,
    video: drMarcoVideo,
  },
  {
    title: "Agendamento Barbearia",
    description: "Plataforma de agendamento que otimiza a rotina de barbearias, oferecendo uma interface fluída para clientes e um painel de gestão robusto para profissionais.",
    tech: ["Barbearia", "React", "Node.js", "PostgreSQL"],
    icon: Scissors,
    image: agendamentoBarbeariaImg,
    link: "https://origemagendamento.vercel.app/",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProjectCard = ({ project, index }: { project: any, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const Icon = project.icon;

  // Bubble positions and animation delays for variety
  const bubblePositions = [
    "-top-4 -right-4",
    "md:-bottom-4 md:-left-4 -bottom-4 -right-4", // Ana Brant: Bottom-left on MD+, Bottom-right on Mobile
    "-top-4 -left-4",
    "-bottom-4 -right-4",
    "top-1/2 -right-6",
    "top-1/4 -left-6"
  ];
  const pos = bubblePositions[index % bubblePositions.length];

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(err => console.log("Video play failed:", err));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  const CardWrapper = project.link ? 'a' : 'div';
  const wrapperProps = project.link ? {
    href: project.link,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "block h-full"
  } : {
    className: "block h-full"
  };

  return (
    <motion.div variants={item}>
      <CardWrapper
        {...wrapperProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="clay-card h-full flex flex-col group cursor-pointer overflow-visible relative">
          {/* Square Claymorphism Bubble */}
          <motion.div
            animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
            transition={{ duration: 3 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
            className={`clay-card absolute ${pos} w-14 h-14 rounded-2xl flex items-center justify-center z-30 bg-card/90 backdrop-blur-sm shadow-md border border-primary/5`}
          >
            <Icon className="w-7 h-7 text-primary" />
          </motion.div>

          {/* Media Container */}
          <div className="relative w-full aspect-video bg-muted flex flex-col items-center justify-center gap-2 rounded-t-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0" />

            {/* Project Image */}
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover relative z-10 transition-opacity duration-500 ${isHovered && project.video ? 'md:opacity-0' : 'opacity-100'}`}
              />
            ) : (
              <div className={`relative z-10 flex flex-col items-center gap-2 transition-opacity duration-500 ${isHovered && project.video ? 'md:opacity-0' : 'opacity-100'}`}>
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <span className="text-muted-foreground text-xs font-medium">Screenshot do projeto</span>
              </div>
            )}

            {/* Project Video - Hidden on mobile */}
            {project.video && (
              <video
                ref={videoRef}
                src={project.video}
                muted
                loop
                playsInline
                className={`hidden md:block absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
          </div>

          <div className="p-6 flex flex-col flex-1 relative z-10">
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              {project.title}
            </h3>
            <p className="text-muted-foreground mb-4 flex-1 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t: string, i: number) => (
                <span
                  key={t}
                  className={i === 0 ? "clay-badge bg-primary text-primary-foreground border-none" : "clay-badge"}
                >
                  {t}
                </span>
              ))}
            </div>

            {project.link ? (
              <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 mt-auto">
                <span>Ver projeto</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 mt-auto">
                <span>Projeto indisponível para view</span>
              </div>
            )}
          </div>
        </div>
      </CardWrapper>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollContainerRef, { once: true, margin: "-100px" });

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const currentProjects = projects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Peek animation on mobile when in view
  useEffect(() => {
    if (isInView && window.innerWidth < 768) {
      const container = scrollContainerRef.current;
      if (!container) return;

      const animateScroll = async () => {
        // Temporarily disable snap to allow smooth peek
        container.style.scrollSnapType = 'none';

        // Delay to let entrance animation finish
        await new Promise(resolve => setTimeout(resolve, 1000));

        const cardWidth = container.children[0]?.clientWidth || 0;
        const peekAmount = cardWidth * 0.35; // Show ~35% of next card

        // Scroll right (peek)
        container.scrollTo({ left: peekAmount, behavior: 'smooth' });

        // Hold briefly
        await new Promise(resolve => setTimeout(resolve, 800));

        // Scroll back (return)
        container.scrollTo({ left: 0, behavior: 'smooth' });

        // Restore snap after animation
        // Wait for return scroll to finish roughly
        setTimeout(() => {
          container.style.scrollSnapType = 'x mandatory';
        }, 500);
      };

      animateScroll();
    }
  }, [isInView]);

  // Reset mobile carousel scroll when page changes
  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [currentPage]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 32; // gap-8 is 2rem = 32px

      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.children[0]?.clientWidth || 0;
      const gap = 32; // gap-8
      container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

        {/* Mobile View - Continuous Carousel */}
        <div className="relative md:hidden">
          <motion.div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="
                flex overflow-x-auto snap-x snap-mandatory items-stretch
                gap-8 pt-12 pb-6 -mx-4 px-8
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
              "
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <div key={index} className="min-w-[85vw] snap-center flex flex-col h-full">
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </motion.div>

          {/* Mobile Swipe Instruction - Removed */}
        </div>

        {/* Desktop View - Paginated Grid */}
        <motion.div
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          key={currentPage}
        >
          {currentProjects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </motion.div>

        {/* Mobile Navigation & Dots (Carousel Controls) */}
        <div className="flex items-center justify-center gap-6 md:hidden mt-4">
          <button
            onClick={() => scrollTo(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={`
                    p-2 rounded-full border transition-all duration-300
                    ${activeIndex === 0
                ? 'border-primary/10 text-primary/20 cursor-not-allowed'
                : 'border-primary/20 text-primary hover:bg-primary/5 active:scale-95 cursor-pointer'}
                `}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex justify-center gap-2">
            {(() => {
              const maxDots = 5;
              const total = projects.length;
              let start = 0;

              if (total > maxDots) {
                start = Math.max(0, Math.min(activeIndex - 2, total - maxDots));
              }

              const visibleDots = total <= maxDots
                ? Array.from({ length: total }, (_, i) => i)
                : Array.from({ length: maxDots }, (_, i) => start + i);

              return visibleDots.map((index) => {
                const isActive = index === activeIndex;
                return (
                  <div key={index} className="relative flex flex-col items-center">
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: -8 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute -top-4 text-[10px] font-bold text-primary"
                        >
                          {index + 1}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => scrollTo(index)}
                      className={`
                                  h-2 rounded-full transition-all duration-300
                                  ${isActive ? 'w-8 bg-primary' : 'w-2 bg-primary/20 hover:bg-primary/40'}
                              `}
                      aria-label={`Ir para projeto ${index + 1}`}
                    />
                  </div>
                );
              });
            })()}
          </div>

          <button
            onClick={() => scrollTo(Math.min(projects.length - 1, activeIndex + 1))}
            disabled={activeIndex === projects.length - 1}
            className={`
                    p-2 rounded-full border transition-all duration-300
                    ${activeIndex === projects.length - 1
                ? 'border-primary/10 text-primary/20 cursor-not-allowed'
                : 'border-primary/20 text-primary hover:bg-primary/5 active:scale-95 cursor-pointer'}
                `}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Global Pagination Controls (Desktop Only) */}
        {totalPages > 1 && (
          <div className="hidden md:flex items-center justify-center gap-4 mt-12 md:mt-16">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                        p-2 rounded-full border transition-all duration-300
                        ${currentPage === 1
                  ? 'border-primary/10 text-primary/20 cursor-not-allowed'
                  : 'border-primary/20 text-primary hover:bg-primary/5 active:scale-95 cursor-pointer'}
                    `}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`
                                w-10 h-10 rounded-full font-bold transition-all duration-300 flex items-center justify-center
                                ${currentPage === idx + 1
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                      : 'bg-transparent text-primary hover:bg-primary/10'}
                            `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                        p-2 rounded-full border transition-all duration-300
                        ${currentPage === totalPages
                  ? 'border-primary/10 text-primary/20 cursor-not-allowed'
                  : 'border-primary/20 text-primary hover:bg-primary/5 active:scale-95 cursor-pointer'}
                    `}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
