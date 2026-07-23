import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronsDown } from "lucide-react";
import { ProjectPreview } from "../data/projectsData";

interface MobilePreviewsProps {
  previews: ProjectPreview[];
}

export const MobilePreviews = ({ previews }: MobilePreviewsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === previews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? previews.length - 1 : prev - 1));
  };

  return (
    <div className="w-full">
      <h2 className="font-display text-3xl font-bold text-foreground mb-8">
        Previews do Aplicativo
      </h2>

      {/* Desktop View (Grid 3 columns) */}
      <div className="hidden md:grid md:grid-cols-3 gap-8">
        {previews.map((preview, idx) => (
          <MobileMockupCard key={idx} preview={preview} />
        ))}
      </div>

      {/* Mobile View (Carousel) */}
      <div className="md:hidden relative">
        <div className="overflow-hidden relative w-full flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[280px]"
            >
              <MobileMockupCard preview={previews[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {previews.length}
          </div>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileMockupCard = ({ preview }: { preview: ProjectPreview }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const getScrollOffset = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return "0px";
    if (!containerRef.current || !imgRef.current) return "0px";
    const containerH = containerRef.current.clientHeight;
    const imgH = imgRef.current.naturalHeight * (containerRef.current.clientWidth / imgRef.current.naturalWidth);
    const offset = Math.max(0, imgH - containerH);
    return `-${offset}px`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone Mockup Frame */}
      <div 
        className="group relative w-full max-w-[280px] aspect-[9/19] bg-card rounded-[2.5rem] border-[8px] border-orange-600 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-500 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-orange-600 rounded-b-xl z-20" />
        
        {/* Image Container with native CSS scroll on mobile, hover logic on desktop */}
        <div 
          ref={containerRef}
          className="w-full h-full relative overflow-y-auto md:overflow-hidden overflow-x-hidden bg-muted [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={() => { if (!hasScrolled) setHasScrolled(true); }}
        >
          <img
            ref={imgRef}
            src={preview.image}
            alt={preview.title}
            className="w-full block"
            style={{
              objectFit: "cover",
              objectPosition: "top",
              height: "auto",
              minHeight: "100%",
              transform: isHovered ? `translateY(${getScrollOffset()})` : "translateY(0px)",
              transition: isHovered
                ? "transform 5s cubic-bezier(0.4, 0, 0.2, 1)"
                : "transform 1s ease",
              willChange: "transform",
            }}
          />
        </div>

        {/* Scroll Hint Overlay (Mobile Only) */}
        <AnimatePresence>
          {!hasScrolled && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none flex items-center justify-center md:hidden z-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="bg-black/60 text-white px-4 py-3 rounded-2xl flex flex-col items-center gap-1.5 backdrop-blur-sm"
              >
                <ChevronsDown className="w-5 h-5" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-center leading-tight">
                  Deslize<br />para ver
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title Below */}
      <div className="mt-6 text-center">
        <h3 className="font-display text-xl font-bold text-foreground">
          {preview.title}
        </h3>
      </div>
    </div>
  );
};
