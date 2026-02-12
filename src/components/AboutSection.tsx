import { motion } from "framer-motion";
import { MapPin, Languages, Briefcase, Camera, Sparkles } from "lucide-react";
import sobreImg from "../assets/sobre.jpg";

const highlights = [
  { icon: MapPin, label: "Localização", desc: "Belo Horizonte, Brasil" },
  { icon: Languages, label: "Idiomas", desc: "Português (Nativo) | Inglês (Avançado)" },
  { icon: Briefcase, label: "Experiência", desc: "+6 anos desenvolvendo" },
];

const AboutSection = () => {
  return (
    <section id="sobre" className="py-16 md:py-24 px-4 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="clay-badge text-sm mb-4 inline-block">Sobre Mim</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Código com propósito,{" "}
              <span className="text-primary">design com alma</span>
            </h2>

            {/* Personal photo placeholder */}
            <div className="clay-card w-full aspect-[4/3] rounded-3xl flex flex-col items-center justify-center gap-3 mb-6 relative overflow-visible">
              <img
                src={sobreImg}
                alt="Sobre mim"
                className="w-full h-full object-cover rounded-3xl relative z-10"
              />

              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="clay-card absolute -top-5 -left-5 w-16 h-16 rounded-2xl flex items-center justify-center z-20 bg-card/90 backdrop-blur-sm shadow-md"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
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
                  className="clay-card p-6 flex items-start gap-5 relative group overflow-visible"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                    transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
                    className={`clay-card absolute ${pos} w-12 h-12 rounded-xl flex items-center justify-center z-20 bg-card/90 backdrop-blur-sm shadow-sm border border-primary/5`}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>

                  <div className="clay-icon shrink-0 relative z-10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {item.label}
                    </h3>
                    <p className="text-muted-foreground">{item.desc}</p>
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
