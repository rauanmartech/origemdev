import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  BarChart3,
  ShieldAlert,
  Footprints,
  DollarSign,
  BookOpen,
  Flame,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const servicesTable = [
  { service: "Landing Page", delivery: "Página focada em conversão" },
  { service: "Site Institucional", delivery: "Presença digital completa" },
  { service: "Sistemas Web", delivery: "Soluções personalizadas" },
  { service: "Automações", delivery: "Integrações e processos automatizados" },
];

const objections = [
  {
    title: '"Já tenho Instagram"',
    answer:
      "Perfeito. O site não substitui o Instagram, ele complementa. Ele funciona como estrutura oficial da empresa para validação e credibilidade.",
  },
  {
    title: '"Isso é só um site simples"',
    answer:
      "Não se trata apenas de um site. Trata-se de uma estrutura digital pensada para posicionamento e geração de oportunidades.",
  },
  {
    title: '"Não sei se preciso disso agora"',
    answer:
      "Muitas empresas só percebem a falta dessa estrutura quando começam a perder oportunidades para concorrentes mais organizados digitalmente.",
  },
  {
    title: '"Está caro"',
    answer:
      "O ponto principal não é o custo do site, mas o impacto de não ter uma estrutura digital profissional na percepção e nas oportunidades de negócio.",
  },
  {
    title: '"Preciso pensar"',
    answer:
      "Sem problema. A questão principal é entender se hoje a empresa está satisfeita com a forma como está sendo percebida online.",
  },
];

const saleSteps = [
  { step: "1", label: "Prospecção", desc: "Identificação de potenciais clientes em nichos com presença digital fraca ou inconsistente." },
  { step: "2", label: "Qualificação", desc: "Perguntas diretas: a empresa já possui site? Como chegam os clientes hoje? Existe investimento em presença digital?" },
  { step: "3", label: "Diagnóstico", desc: "Identificação de: ausência de estrutura digital, perda de credibilidade, dependência excessiva de redes sociais." },
  { step: "4", label: "Apresentação", desc: 'Condução da conversa usando o posicionamento: "Trabalhamos com…"' },
  { step: "5", label: "Proposta", desc: "Apresentação do serviço adequado com base no catálogo oficial." },
  { step: "6", label: "Fechamento", desc: "Encaminhamento para início do projeto." },
  { step: "7", label: "Direcionamento", desc: "Cliente aprovado segue para execução técnica." },
];

const rules = [
  'Sempre utilizar "trabalhamos com…"',
  "Nunca personalizar como indicação informal",
  "Nunca alterar valores ou escopo",
  "Nunca prometer condições não confirmadas",
  "Seguir sempre a estrutura oficial de oferta",
  "Manter comunicação objetiva e consultiva",
];

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: "easeOut" },
  }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="clay-icon p-2.5 shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {children}
      </h2>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KitDeGuerra() {
  return (
    <div className="space-y-8 md:space-y-10">

      {/* ── Hero Banner ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="clay-card p-8 md:p-10 relative overflow-hidden"
      >
        <div className="clay-blob w-96 h-96 -top-24 -right-24 opacity-40" />
        <div className="relative z-10">
          <div className="clay-badge inline-flex items-center gap-1.5 mb-4">
            <Flame className="w-3.5 h-3.5" />
            Manual de Vendas e Conversão
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Kit de Guerra — Closers
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Posicionamento, pitch, objeções e processo de venda. Tudo que você
            precisa para transformar conversas em projetos fechados.
          </p>
        </div>
      </motion.div>

      {/* ── Posicionamento + Pitch ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="clay-card p-6 md:p-7"
        >
          <SectionTitle icon={Brain}>Posicionamento da Oferta</SectionTitle>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Trabalhamos com desenvolvimento de sites, landing pages e sistemas
            digitais voltados para empresas que querem estruturar sua presença
            online de forma profissional e gerar mais oportunidades de negócio.
          </p>
          <p className="text-foreground text-sm font-semibold leading-relaxed">
            O foco não é estética isolada. O foco é presença digital que transmite
            credibilidade e aumenta a capacidade de aquisição de clientes.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="clay-card p-6 md:p-7 border-l-4"
          style={{ borderLeftColor: "hsl(var(--primary))" }}
        >
          <SectionTitle icon={Zap}>Pitch de 30 Segundos</SectionTitle>
          <blockquote className="text-muted-foreground text-sm leading-relaxed italic">
            "Trabalhamos com criação de sites, landing pages e sistemas digitais
            para empresas que querem melhorar sua presença online e transformar
            isso em geração de oportunidades reais de negócio.
            <br /><br />
            A ideia não é apenas ter um site, mas estruturar a presença digital da
            empresa para que ela passe mais confiança, seja encontrada com mais
            facilidade e consiga gerar mais oportunidades de forma consistente.
            <br /><br />
            Atendemos principalmente empresas que já estão em operação, mas ainda
            não possuem uma estrutura digital profissional ou estão perdendo
            oportunidades por isso."
          </blockquote>
        </motion.div>
      </div>

      {/* ── Estrutura de Apresentação ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle icon={BarChart3}>Estrutura de Apresentação</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              n: "1",
              title: "Contexto",
              body: "Hoje muitas empresas não perdem por falta de serviço, mas por falta de estrutura digital.",
            },
            {
              n: "2",
              title: "Problema",
              body: ["Falta de site profissional", "Dependência apenas de Instagram ou indicação", "Presença digital fraca ou desatualizada", "Perda de credibilidade em processos de decisão"],
              isList: true,
            },
            {
              n: "3",
              title: "Solução",
              body: "Estruturamos a presença digital da empresa para torná-la mais profissional, confiável e preparada para gerar novas oportunidades.",
            },
            {
              n: "4",
              title: "O que é entregue",
              body: ["Sites institucionais", "Landing pages de conversão", "Sistemas web personalizados", "Automações e integrações", "Estrutura digital completa de presença online"],
              isList: true,
            },
            {
              n: "5",
              title: "Resultado Esperado",
              body: ["Mais credibilidade no mercado", "Mais oportunidades de contato", "Melhor posicionamento digital", "Estrutura profissional de aquisição de clientes"],
              isList: true,
            },
            {
              n: "6",
              title: "Fechamento da Narrativa",
              body: 'A proposta não é "ter um site". A proposta é ter uma estrutura digital que represente a empresa de forma profissional e funcione como ativo de geração de oportunidades.',
            },
          ].map((card, i) => (
            <div
              key={card.n}
              className="bg-background/60 rounded-2xl p-5 border border-border/60 hover:border-primary/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs mb-3">
                {card.n}
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {card.title}
              </h3>
              {(card as any).isList ? (
                <ul className="space-y-1">
                  {(card.body as string[]).map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">{card.body as string}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Tabela de Serviços ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle icon={BookOpen}>Estrutura de Serviços</SectionTitle>
        <p className="text-muted-foreground text-sm mb-5">
          Todos os valores seguem o catálogo oficial do projeto.{" "}
          <span className="font-semibold text-foreground">
            Os valores nunca são alterados a não ser para mais caro.
          </span>
        </p>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider border-b border-border">
                <th className="px-5 py-3">Serviço</th>
                <th className="px-5 py-3">Entrega</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {servicesTable.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-foreground">{row.service}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{row.delivery}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Objeções ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={5}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle icon={MessageCircle}>Objeções e Respostas</SectionTitle>
        <div className="space-y-4">
          {objections.map((obj, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5 + i * 0.5}
              className="bg-background/60 rounded-2xl p-5 border border-border/60 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {obj.title}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{obj.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Processo de Venda ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="clay-card p-6 md:p-8"
      >
        <SectionTitle icon={Footprints}>Processo de Venda</SectionTitle>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />
          <div className="space-y-4">
            {saleSteps.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={6 + i * 0.3}
                className="flex items-start gap-4 pl-0 sm:pl-14 relative"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0 shadow-md sm:absolute sm:left-0 sm:top-0">
                  {s.step}
                </div>
                <div className="bg-background/60 rounded-2xl p-4 border border-border/60 hover:border-primary/30 transition-colors flex-1">
                  <p className="font-semibold text-foreground text-sm mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {s.label}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Comissão + Regras ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={7}
          className="clay-card p-6 md:p-7"
        >
          <SectionTitle icon={DollarSign}>Comissão</SectionTitle>
          <div className="space-y-3">
            {[
              { label: "Comissão padrão", value: "1/3 (33,33%) por projeto fechado" },
              { label: "Pagamento", value: "Após confirmação do pagamento do cliente" },
              { label: "Validade", value: "Apenas para vendas concluídas" },
              { label: "Cancelamentos", value: "Anulam a comissão associada" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-start gap-4 text-sm py-2 border-b border-border/40 last:border-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground text-right">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-primary/10 rounded-xl p-3 text-xs text-primary font-medium">
            💡 Bônus por performance pode ser aplicado conforme volume.
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={8}
          className="clay-card p-6 md:p-7"
        >
          <SectionTitle icon={ShieldAlert}>Regras de Atuação</SectionTitle>
          <ul className="space-y-2.5">
            {rules.map((rule, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* ── Direção Geral ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={9}
        className="clay-card p-8 md:p-10 text-center relative overflow-hidden"
      >
        <div className="clay-blob w-80 h-80 -bottom-20 -left-20 opacity-30" />
        <div className="clay-blob w-64 h-64 -top-16 -right-16 opacity-20" />
        <div className="relative z-10">
          <Flame className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2
            className="text-xl md:text-2xl font-bold text-foreground mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Direção Geral
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            A conversa nunca gira em torno de{" "}
            <span className="line-through opacity-60">"vender site"</span>.
            <br />
            <span className="font-semibold text-foreground text-lg">
              A conversa gira em torno de estrutura digital, posicionamento e
              geração de oportunidades.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
