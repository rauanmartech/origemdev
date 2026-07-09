import { useRef, useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

export const InteractivePreview = ({ src, title }: { src: string; title: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [distance, setDistance] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const calculateDistance = () => {
    if (containerRef.current && imageRef.current) {
      const cHeight = containerRef.current.clientHeight;
      const iHeight = imageRef.current.clientHeight;
      if (iHeight > cHeight) {
        setDistance(cHeight - iHeight);
      } else {
        setDistance(0);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(calculateDistance, 100);
    window.addEventListener('resize', calculateDistance);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateDistance);
    };
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrollProgress(Number(e.target.value));
  };

  const currentTranslateY = (scrollProgress / 100) * distance;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
        
        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-3 bg-muted/30 px-4 py-2.5 rounded-full border border-border/50 shadow-sm">
          <ArrowUpDown size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground mr-1">Explorar:</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={scrollProgress}
            onChange={handleSliderChange}
            className="w-32 md:w-48 accent-primary cursor-pointer"
          />
        </div>
      </div>
      
      {/* Image Container */}
      <div 
        ref={containerRef}
        className="w-full aspect-video rounded-2xl overflow-hidden relative border border-border/50 shadow-xl bg-muted/30"
      >
        <img
          ref={imageRef}
          src={src}
          alt={title}
          onLoad={calculateDistance}
          className="w-full h-auto absolute top-0 left-0"
          style={{
            transform: `translateY(${currentTranslateY}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
      </div>

      {/* Mobile Controls */}
      <div className="flex sm:hidden items-center justify-between w-full gap-3 bg-muted/30 px-5 py-3 rounded-xl border border-border/50 shadow-sm mt-1">
        <span className="text-sm font-medium text-foreground whitespace-nowrap">Arraste:</span>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={scrollProgress}
          onChange={handleSliderChange}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </div>
  );
};
