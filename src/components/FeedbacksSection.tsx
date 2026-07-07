import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import bgImage from "../assets/feedbacks-origem.jpeg";

// Map filenames to structured data
const feedbacksData = [
  {
    file: "feedback_ana_brant",
    name: "Ana Brant",
    role: "Professora de Yoga",
    detail: "Landing Page",
  },
  {
    file: "feedback_ruan_bara\u00FAna",
    name: "Ruan Baraúna",
    role: "Preparador Físico",
    detail: "Landing Page",
  },
  {
    file: "feedback_toninho",
    name: "Toninho",
    role: "Empresário",
    detail: "Site Institucional / CRM",
  },
  {
    file: "feedback_bendegar",
    name: "Bendegar",
    role: "Tatuadora",
    detail: "Site Institucional",
  },
  {
    file: "feedback_camila",
    name: "Camilla",
    role: "Tatuadora",
    detail: "E-commerce + Sistema de Pagamentos",
  },
];

// Eager import all feedback images
const feedbackImages = import.meta.glob('../assets/feedbacks/feedback_*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });

// Match structured data to actual imported images by filename stem
const feedbacks = feedbacksData.map(item => {
  const matchKey = Object.keys(feedbackImages).find(k => k.includes(item.file));
  return {
    ...item,
    image: matchKey ? feedbackImages[matchKey] as string : null,
  };
}).filter(f => f.image !== null);

const FeedbacksSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = feedbacks[activeIndex];

  return (
    <section id="feedbacks" className="relative w-full min-h-screen flex flex-col items-stretch overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat"
        }}
      />

      {/* Gradient Overlay */}
      {/* Mobile */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent md:bg-none" />
      {/* Desktop: left 10% opacity, right fades to solid white */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background: "linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,1) 75%)"
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-screen items-center py-16 md:py-24">
        {/* Left Side — empty, shows background */}
        <div className="hidden md:block" />

        {/* Right Side — feedbacks */}
        <div className="flex flex-col h-full justify-center">
          {/* Header */}
          <div className="mb-8 mt-8 md:mt-0">
            <span className="clay-badge text-sm mb-4 inline-block bg-white shadow-sm border border-gray-100">Feedbacks</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              O que dizem sobre <span className="text-primary">mim</span>
            </h2>
            <p className="text-gray-500 text-base">
              Confira como foi a experiência de quem já tirou o projeto do papel comigo.
            </p>
          </div>

          {/* Feedback Row Layout: image left (half width), details right */}
          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.file}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-30px" }}
                onClick={() => setActiveIndex(index)}
                className={`flex flex-row items-start gap-4 rounded-2xl p-3 cursor-pointer transition-all duration-200 border ${
                  activeIndex === index
                    ? "border-primary/60 bg-white shadow-lg"
                    : "border-primary/20 bg-white/70 hover:bg-white hover:border-primary/40 hover:shadow-md"
                }`}
              >
                {/* Print — half card width, natural height */}
                <div className="shrink-0 w-1/2 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                  {feedback.image && (
                    <img
                      src={feedback.image}
                      alt={feedback.name}
                      loading="lazy"
                      className="w-full h-auto block"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center min-w-0">
                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="hsl(25, 95%, 53%)">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className="font-display font-bold text-lg md:text-xl leading-tight truncate"
                    style={{ color: "hsl(25, 95%, 50%)" }}
                  >
                    {feedback.name}
                  </span>
                  <span className="text-gray-700 text-sm font-medium mt-0.5 truncate">
                    {feedback.role}
                  </span>
                  <span className="text-gray-400 text-xs mt-1 truncate">
                    {feedback.detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbacksSection;
