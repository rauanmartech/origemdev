import { motion } from "framer-motion";
import { Handshake, Clock } from "lucide-react";

export default function PropostaParceria() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="clay-card p-10 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden"
    >
      <div className="clay-blob w-96 h-96 -top-24 -right-24 opacity-30" />
      <div className="clay-blob w-64 h-64 -bottom-16 -left-16 opacity-20" />

      <div className="clay-icon p-4 relative z-10">
        <Handshake className="w-8 h-8 text-primary" />
      </div>

      <div className="relative z-10 space-y-3">
        <div className="clay-badge inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Em breve
        </div>
        <h2
          className="text-2xl md:text-3xl font-bold text-foreground"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Proposta de Parceria
        </h2>
        <p className="text-muted-foreground text-base max-w-md leading-relaxed">
          Esta seção está sendo preparada. Em breve você encontrará aqui a
          proposta completa de parceria comercial com todos os detalhes,
          benefícios e condições.
        </p>
      </div>
    </motion.div>
  );
}
