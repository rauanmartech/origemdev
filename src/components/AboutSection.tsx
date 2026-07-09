import { motion } from "framer-motion";
import { MapPin, Languages, Briefcase, Sparkles } from "lucide-react";
import sobreImg from "../assets/sobre.jpg";
import sobreMascot from "../assets/sobre.webp";

const highlights = [
  { icon: MapPin, label: "Localização", desc: "Belo Horizonte, Brasil" },
  { icon: Languages, label: "Idiomas", desc: "Português (Nativo) | Inglês (Avançado)" },
  { icon: Briefcase, label: "Experiência", desc: "+6 anos desenvolvendo" },
];

const darkBg = "#141210";
const cardBg = "#1e1a17";
const cardBorder = "rgba(255,165,60,0.12)";

const MarqueeBand = ({ reverse = false }: { reverse?: boolean }) => {
  const text = Array(30).fill("SOBRE   \u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0").join("");
  return (
    <div className="flex overflow-hidden whitespace-nowrap bg-primary py-1.5 md:py-2 select-none shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <motion.div
        className="flex items-center text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em]"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        style={{ width: "fit-content" }}
      >
        <span>{text}</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section
      id="sobre"
      className="relative py-16 md:py-24 px-4 overflow-hidden md:overflow-visible"
      style={{ background: darkBg }}
    >
      {/* Desktop Mascot */}
      <img
        src={sobreMascot}
        alt="Mascote Sobre"
        className="hidden md:block absolute bottom-0 right-0 z-20 h-[400px] lg:h-[500px] w-auto object-contain pointer-events-none"
      />
      {/* Top Marquee */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <MarqueeBand />
      </div>

      {/* Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <MarqueeBand reverse />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pt-6 pb-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-sm mb-4 inline-block px-4 py-1.5 rounded-full font-semibold uppercase tracking-wider"
              style={{
                background: "hsl(25 95% 53% / 0.15)",
                color: "hsl(25, 95%, 65%)",
                border: "1px solid hsl(25 95% 53% / 0.3)"
              }}
            >
              Sobre Mim
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" style={{ color: "#f5f0eb" }}>
              Código com propósito,{" "}
              <span style={{ color: "hsl(25, 95%, 60%)" }}>design com alma</span>
            </h2>

            <div
              className="w-full aspect-[4/3] rounded-3xl mb-6 relative overflow-visible"
              style={{
                border: `1px solid ${cardBorder}`,
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
              }}
            >
              <img
                src={sobreImg}
                alt="Sobre mim"
                width={800}
                height={600}
                loading="lazy"
                className="w-full h-full object-cover rounded-3xl relative z-10"
              />
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -left-5 w-16 h-16 rounded-2xl flex items-center justify-center z-20 backdrop-blur-sm shadow-lg"
                style={{ background: cardBg, border: cardBorder }}
              >
                <Sparkles className="w-8 h-8" style={{ color: "hsl(25, 95%, 60%)" }} />
              </motion.div>
            </div>

            <div className="space-y-4 leading-relaxed text-lg" style={{ color: "#a89f97" }}>
              <p>
                Sou desenvolvedor web apaixonado por criar soluções digitais que realmente
                fazem diferença. Com experiência sólida em tecnologias modernas, combino
                habilidade técnica com sensibilidade estética para entregar projetos que
                impressionam.
              </p>
              <p>
                Acredito que o melhor código é aquele que serve às pessoas — rápido,
                acessível e bonito. Cada projeto é uma oportunidade de superar expectativas
                e construir algo memorável.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {highlights.map((item, index) => {
              const Icon = item.icon;
              const positions = [
                "-bottom-4 -right-4",
                "-top-4 -left-4",
                "top-1/2 -right-6"
              ];
              const pos = positions[index % positions.length];

              return (
                <motion.div
                  key={index}
                  className="p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-5 relative group overflow-visible rounded-3xl"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                    transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute ${pos} w-12 h-12 rounded-xl flex items-center justify-center z-20 backdrop-blur-sm shadow-sm`}
                    style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "hsl(25, 95%, 60%)" }} />
                  </motion.div>

                  <div
                    className="shrink-0 relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "hsl(25 95% 53% / 0.15)", border: "1px solid hsl(25 95% 53% / 0.25)" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: "hsl(25, 95%, 60%)" }} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-display text-lg font-semibold mb-1" style={{ color: "#f5f0eb" }}>
                      {item.label}
                    </h3>
                    <p style={{ color: "#a89f97" }}>{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
