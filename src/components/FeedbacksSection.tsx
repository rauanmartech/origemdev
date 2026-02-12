import { motion } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";
const feedbackImages = import.meta.glob('../assets/feedbacks/feedback_*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });

const feedbacks = Object.entries(feedbackImages).map(([path, url], index) => {
    // Extract filename from path (e.g., "../assets/feedbacks/feedback_ana.jpg" -> "ana")
    const fileName = path.split('/').pop()?.split('.')[0] || "";
    const namePart = fileName.replace('feedback_', '');

    // Format name: "ana_brant" -> "Ana Brant"
    const formattedName = namePart
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Deterministic random positions based on index to ensure consistent layout
    // We distribute them across the container using a grid-like or scattered approach
    const positions = [
        { x: "10%", y: "10%", rot: -5 },
        { x: "60%", y: "20%", rot: 3 },
        { x: "30%", y: "45%", rot: -2 },
        { x: "70%", y: "50%", rot: 6 },
        { x: "20%", y: "25%", rot: -4 },
        { x: "50%", y: "10%", rot: 2 },
        { x: "15%", y: "55%", rot: -3 },
        { x: "80%", y: "30%", rot: 5 },
    ];

    const pos = positions[index % positions.length];

    return {
        id: index + 1,
        image: url,
        name: formattedName,
        rotation: pos.rot,
        x: pos.x,
        y: pos.y
    };
});

const FeedbacksSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Helper to get random positions that look "scattered" but readable
    // For simplicity, I'm using pre-defined approximate positions in percentage 
    // to avoid overlap mess, but they can still be dragged.

    return (
        <section id="feedbacks" className="py-24 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="clay-badge text-sm mb-4 inline-block">Feedbacks</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                        O que dizem sobre <span className="text-primary">mim</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Confira como foi a experiência de quem já tirou o projeto do papel comigo.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative w-full h-[600px] md:h-[700px] rounded-[3rem] bg-card flex items-center justify-center overflow-hidden border border-primary/5"
                    style={{ boxShadow: 'var(--clay-shadow-inset)' }}
                    ref={containerRef}
                >
                    {/* Background Decor */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none flex items-center justify-center">
                        <Quote className="w-96 h-96 text-primary/5" />
                    </div>

                    <div className="absolute top-8 left-8 text-muted-foreground/40 font-handwriting text-xl pointer-events-none select-none">
                        Arraste os polaroids...
                    </div>

                    {feedbacks.map((item, index) => (
                        <Polaroid
                            key={item.id}
                            item={item}
                            containerRef={containerRef}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const Polaroid = ({ item, containerRef, index }: { item: any; containerRef: any; index: number }) => {
    // Generate random initial positions if not using the preset ones, 
    // but preset ones (x, y) give a better initial layout.

    return (
        <motion.div
            drag
            dragConstraints={containerRef}
            whileHover={{ scale: 1.1, zIndex: 50, rotate: 0 }}
            whileDrag={{ scale: 1.15, zIndex: 100, rotate: 0, cursor: "grabbing" }}
            initial={{
                rotate: item.rotation,
                x: Math.random() * 50 - 25, // minimal random offset
                y: Math.random() * 50 - 25
            }}
            className="absolute p-3 pb-8 bg-white shadow-xl rounded-sm cursor-grab w-48 md:w-64 transform-gpu transition-shadow duration-300"
            style={{
                top: item.y,
                left: item.x,
                // On mobile, we might want to center them more or let them stack naturally?
                // Let's rely on the relative percentages.
                boxShadow: "5px 5px 15px rgba(0,0,0,0.15)"
            }}
        >
            {/* Pin or Tape could be added here for detail, but plain polaroid is fine */}
            {/* Pin or Tape could be added here for detail, but plain polaroid is fine */}
            <div className="w-full overflow-hidden bg-gray-100 mb-3 pointer-events-none">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto select-none block"
                    draggable={false}
                />
            </div>
            <p className="font-handwriting font-medium text-center text-gray-800 text-lg md:text-xl select-none">
                {item.name}
            </p>
        </motion.div>
    );
};

export default FeedbacksSection;
