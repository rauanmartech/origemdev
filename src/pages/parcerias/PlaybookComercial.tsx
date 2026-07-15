import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, BookText, Info, Calendar } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

function SectionTitle({ children }: { children: React.ReactNode }) {
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

const playbook = [
  {
    id: "1",
    title: "1. Primeira abordagem",
    quote: "Oi, tudo bem? 😊\n\nMeu nome é Rauan. Encontrei a empresa de vocês pesquisando negócios da área e queria falar com a pessoa responsável. Poderia me ajudar?"
  },
  {
    id: "2",
    title: "2. Se responder 'Pode falar'",
    quote: "Perfeito, obrigado pelo retorno! 😊\n\nEu trabalho com desenvolvimento de sites profissionais e, analisando rapidamente a presença digital de vocês, percebi algumas oportunidades de fortalecimento da marca na internet.\n\nPosso te mostrar alguns projetos que desenvolvi?"
  },
  {
    id: "3",
    title: "3. Se responder 'Pode enviar'",
    observacao: "Enviar no máximo 3 projetos. Em seguida, enviar:",
    quote: "Esses são alguns exemplos do tipo de projeto que desenvolvo.\n\nAproveitando, fiquei curioso: hoje vocês já possuem um site ou a presença digital fica mais concentrada no Instagram, Google e indicações?"
  },
  {
    id: "4",
    title: "4. Se perguntar 'Como assim?'",
    quote: "Hoje muitas pessoas pesquisam uma empresa antes de entrar em contato.\n\nUm site ajuda a transmitir mais confiança, organizar melhor os serviços e facilitar o contato dos clientes."
  },
  {
    id: "5",
    title: "5. Se encaminhar para um sócio ou administrador",
    quote: "Perfeito, muito obrigado pelo retorno! 😊\n\nFico à disposição caso ela(e) tenha alguma dúvida ou queira conversar melhor sobre a ideia.\n\nSe fizer sentido, posso apresentar algumas sugestões pensando especificamente na empresa de vocês.",
    acao: "Follow-up em 3 a 5 dias."
  },
  {
    id: "6",
    title: "6. Objeção: 'Não temos interesse'",
    quote: "Sem problemas! 😊\n\nObrigado pelo retorno e pela atenção.\n\nCaso em algum momento vocês tenham alguma demanda relacionada à presença digital ou desenvolvimento de um site, fico à disposição.\n\nSucesso para vocês!",
    acao: "Follow-up em 60-90 dias."
  },
  {
    id: "7",
    title: "7. Objeção: 'Por hora não temos interesse'",
    quote: "Sem problemas! 😊\n\nObrigado pela sinceridade.\n\nVou deixar meu contato à disposição e, se no futuro isso entrar nos planos da empresa, será um prazer conversar novamente.",
    acao: "Follow-up em 45-60 dias."
  },
  {
    id: "8",
    title: "8. Se perguntarem preço",
    quote: "Consigo passar uma estimativa sim.\n\nAntes disso, queria entender rapidamente o objetivo de vocês para indicar a solução mais adequada."
  },
  {
    id: "9",
    title: "9. Se visualizar e não responder",
    observacao: "Esperar 2 dias.",
    quote: "Oi! Tudo bem? 😊\n\nPassando para saber se conseguiu ver minha mensagem anterior.\n\nCaso faça sentido para vocês, fico à disposição para conversar."
  },
  {
    id: "10",
    title: "10. Follow-up após 60 dias",
    quote: "Oi! Tudo bem? 😊\n\nHá algum tempo conversamos sobre presença digital e lembrei da empresa de vocês.\n\nQueria saber se esse assunto acabou entrando no planejamento ou se ainda não é prioridade.\n\nFico à disposição caso possa ajudar."
  }
];

export default function PlaybookComercial() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
            <BookText className="w-3.5 h-3.5" />
            Abordagem Estratégica
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Playbook Comercial
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Fluxo de cadência focado em entender a necessidade do cliente antes de oferecer uma solução.
          </p>
        </div>
      </motion.div>

      {/* ── Regras do Playbook ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="clay-card p-6 md:p-8 border border-primary/20 bg-primary/5"
      >
        <SectionTitle>Regras do Playbook</SectionTitle>
        <ul className="grid sm:grid-cols-2 gap-3">
          {[
            "Não discutir preço na primeira mensagem.",
            "Não enviar mais de 3 projetos.",
            "Não insistir após um 'não' claro.",
            "Sempre registrar o próximo passo.",
            "O objetivo da primeira conversa é gerar interesse, não fechar a venda.",
          ].map((regra, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>{regra}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Fluxo de Scripts ── */}
      <div className="grid gap-6">
        {playbook.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2 + idx * 0.1}
            className="clay-card p-6 relative group"
          >
            <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>

            {item.observacao && (
              <p className="text-sm text-muted-foreground mb-3 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{item.observacao}</span>
              </p>
            )}

            <div className="relative mt-4">
              <div className="bg-background/80 rounded-xl p-4 pr-12 text-sm text-foreground border border-border/50 whitespace-pre-wrap">
                {item.quote}
              </div>
              <button
                onClick={() => handleCopy(item.quote, item.id)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                title="Copiar texto"
              >
                {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {item.acao && (
              <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                {item.acao}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
