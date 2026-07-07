import { motion } from "framer-motion";
import { useState, useRef } from "react";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Project } from "../data/projectsData";

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = project.icon;
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use first preview image as thumbnail, fall back to project.image
  const thumbSrc = project.previews?.[0]?.image ?? project.image;

  const bubblePositions = [
    "-top-4 -right-4",
    "md:-bottom-4 md:-left-4 -bottom-4 -right-4",
    "-top-4 -left-4",
  ];
  const pos = bubblePositions[index % bubblePositions.length];

  const getScrollOffset = () => {
    if (!containerRef.current || !imgRef.current) return "0px";
    const containerH = containerRef.current.clientHeight;
    const imgH = imgRef.current.naturalHeight * (containerRef.current.clientWidth / imgRef.current.naturalWidth);
    const offset = Math.max(0, imgH - containerH);
    return `-${offset}px`;
  };

  return (
    <motion.div variants={item}>
      <Link
        to={`/projetos/${project.id}`}
        className="block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="clay-card h-full flex flex-col group cursor-pointer overflow-visible relative">
          {/* Floating Icon Bubble */}
          <motion.div
            animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
            transition={{ duration: 3 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
            className={`clay-card absolute ${pos} w-14 h-14 rounded-2xl flex items-center justify-center z-30 bg-card/90 backdrop-blur-sm shadow-md border border-primary/5`}
          >
            <Icon className="w-7 h-7 text-primary" />
          </motion.div>

          {/* Thumbnail with scroll-on-hover effect */}
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-t-3xl overflow-hidden bg-muted"
          >
            {thumbSrc ? (
              <img
                ref={imgRef}
                src={thumbSrc}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full block"
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                  height: "auto",
                  minHeight: "100%",
                  transform: isHovered ? `translateY(${getScrollOffset()})` : "translateY(0px)",
                  transition: isHovered
                    ? "transform 4s cubic-bezier(0.4, 0, 0.2, 1)"
                    : "transform 0.8s ease",
                  willChange: "transform",
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent flex items-center justify-center">
                <Icon className="w-12 h-12 text-primary/20" />
              </div>
            )}
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/60 to-transparent z-10 pointer-events-none" />
          </div>

          <div className="p-6 flex flex-col flex-1 relative z-10">
            <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground mb-4 flex-1 leading-relaxed line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.slice(0, 3).map((t: string, i: number) => (
                <span
                  key={t}
                  className={i === 0 ? "clay-badge bg-primary text-primary-foreground border-none" : "clay-badge"}
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-primary font-medium text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 mt-auto">
              <span>Ver detalhes do projeto</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
