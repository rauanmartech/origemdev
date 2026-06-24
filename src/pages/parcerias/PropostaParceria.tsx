import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Globe,
  MessageSquare,
  Mail,
  Instagram,
} from "lucide-react";
import { services } from "@/data/servicesData";

// ─── Animation ────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h2
      className="text-base font-bold text-foreground uppercase tracking-wider mb-6 flex items-center gap-2"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <span className="w-1.5 h-4 bg-primary rounded-full inline-block" />
      {children}
    </h2>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropostaParceria() {
  return (
    <div className="space-y-8 md:space-y-10">

      {/* ── Hero ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="clay-card p-8 md:p-10 relative overflow-hidden text-center"
      >
        <div className="clay-blob w-96 h-96 -top-24 -right-24 opacity-30" />
        <div className="clay-blob w-64 h-64 -bottom-16 -left-16 opacity-20" />
        <div className="relative z-10">
          <div className="clay-badge inline-flex items-center gap-1.5 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Programa de Parcerias Comerciais
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Proposta de Parceria
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Indique clientes, gere oportunidades e receba comissões por cada
            projeto fechado. Sem precisar executar nada.
          </p>
        </div>
      </motion.div>

      {/* ── Como Funciona o Fluxo ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle>Como Funciona o Fluxo</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
          {[
            { step: "1", desc: "Identificar oportunidade" },
            { step: "2", desc: "Realizar a indicação" },
            { step: "3", desc: "Reunião comercial" },
            { step: "4", desc: "Apresentar proposta" },
            { step: "5", desc: "Aprovação do projeto" },
            { step: "6", desc: "Pagamento confirmado" },
            { step: "7", desc: "Comissão liberada" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1 + idx * 0.15}
              className="flex flex-col items-center bg-background/60 rounded-2xl p-3 border border-border/60 hover:border-primary/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-md mb-2">
                {item.step}
              </div>
              <span className="text-[11px] font-semibold text-foreground leading-tight">
                {item.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Tabela de Serviços & Comissões ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle>Tabela de Serviços & Comissões (33,33%)</SectionTitle>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3">Serviço</th>
                <th className="px-5 py-3 text-right whitespace-nowrap">
                  Valor Inicial
                </th>
                <th className="px-5 py-3 hidden md:table-cell">
                  Principais Entregáveis
                </th>
                <th className="px-5 py-3 text-right whitespace-nowrap text-primary">
                  Comissão (1/3)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {services.map((s, i) => {
                const commission = s.priceNum / 3;
                return (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl ${s.color} flex items-center justify-center shrink-0`}
                        >
                          <s.icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                        </div>
                        <span className="font-semibold text-foreground text-xs md:text-sm">
                          {s.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-foreground whitespace-nowrap text-xs md:text-sm">
                      {s.originalPrice && (
                        <span className="block text-[10px] text-muted-foreground line-through">
                          R$ {s.originalPrice}
                        </span>
                      )}
                      R$ {s.price}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs hidden md:table-cell">
                      <ul className="space-y-0.5">
                        {s.included.slice(0, 3).map((item, j) => (
                          <li key={j} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                            {item}
                          </li>
                        ))}
                        {s.included.length > 3 && (
                          <li className="text-primary/70 text-[10px]">
                            + {s.included.length - 3} mais…
                          </li>
                        )}
                      </ul>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-primary whitespace-nowrap text-xs md:text-sm">
                      R${" "}
                      {commission.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Benefícios + Transparência ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="clay-card p-6 md:p-8"
        >
          <SectionTitle>Benefícios da Parceria</SectionTitle>
          <ul className="space-y-3">
            {[
              "Sem necessidade de executar os projetos ou programar",
              "Sem necessidade de fornecer suporte técnico aos clientes",
              "Sem necessidade de atuar no desenvolvimento",
              "Processo comercial simplificado (você indica, nós vendemos)",
              "Comissões altamente atrativas (33,33% de comissão direta)",
              "Possibilidade real de ganhos recorrentes",
              "Parceria transparente, segura e focada no longo prazo",
            ].map((beneficio, idx) => (
              <motion.li
                key={idx}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3 + idx * 0.1}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{beneficio}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="clay-card p-6 md:p-8 flex flex-col gap-6"
        >
          {/* Compromisso de Transparência */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center gap-3">
            <div className="absolute top-3 right-3 opacity-5">
              <ShieldCheck className="w-20 h-20 text-primary" />
            </div>
            <div className="clay-icon p-3 relative z-10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3
              className="font-bold text-primary text-sm uppercase tracking-wider relative z-10"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Compromisso de Transparência
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed font-medium text-center relative z-10 max-w-xs">
              "As comissões são calculadas em 33,33% do valor de cada projeto
              fechado e são pagas após a confirmação do pagamento do cliente."
            </p>
          </div>

          {/* CTA */}
          <div className="bg-background/60 border border-border/60 rounded-2xl p-5 text-center">
            <p
              className="font-bold text-foreground text-sm mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Quer fazer parte?
            </p>
            <p className="text-muted-foreground text-xs mb-4">
              Entre em contato para iniciar a parceria.
            </p>
            <a
              href="https://wa.me/5571983789492"
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn text-sm py-2.5 px-6 inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* ── Contato / Rodapé da Proposta ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle>Contato & Canais</SectionTitle>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Globe,
              label: "Site",
              value: "origemdev.com.br",
              href: "https://origemdev.com.br",
            },
            {
              icon: MessageSquare,
              label: "WhatsApp",
              value: "(71) 98378-9492",
              href: "https://wa.me/5571983789492",
            },
            {
              icon: Mail,
              label: "E-mail",
              value: "rauanrocha.martech@gmail.com",
              href: "mailto:rauanrocha.martech@gmail.com",
            },
            {
              icon: Instagram,
              label: "Instagram",
              value: "@dev.rauan",
              href: "https://instagram.com/dev.rauan",
            },
          ].map((contact, i) => (
            <a
              key={i}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-background/60 rounded-2xl p-4 border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="clay-icon p-2 shrink-0 group-hover:scale-110 transition-transform">
                <contact.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{contact.label}</p>
                <p className="text-xs font-semibold text-foreground break-all leading-snug">
                  {contact.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-primary text-sm font-bold italic">
            "Crescemos juntos quando geramos resultados juntos."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
