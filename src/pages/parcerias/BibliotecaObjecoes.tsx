import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, BookOpen, AlertCircle, Calendar } from "lucide-react";

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

const objecoes = [
  {
    id: "1",
    title: "1. Não temos interesse.",
    context: "O que pode significar: Não é prioridade. Não enxergou valor. Encerramento educado.",
    resposta: "Sem problemas! 😊 Obrigado pelo retorno e pela atenção. Vou deixar meu contato à disposição caso, no futuro, a presença digital entre nas prioridades da empresa. Sucesso para vocês!",
    acao: "Follow-up em 60-90 dias.",
  },
  {
    id: "2",
    title: "2. Por hora não temos interesse.",
    context: "Leitura: Existe possibilidade futura.",
    resposta: "Sem problemas! Obrigado pela sinceridade. Se em algum momento isso entrar nos planos de vocês, será um prazer conversar novamente.",
    acao: "Follow-up em 45-60 dias.",
  },
  {
    id: "3",
    title: "3. Já temos um site.",
    context: "Objetivo: descobrir satisfação.",
    resposta: "Que ótimo! Vocês estão satisfeitos com ele ou existe algo que gostariam de melhorar?",
  },
  {
    id: "4",
    title: "4. Só usamos Instagram.",
    resposta: "Entendi! O Instagram funciona muito bem para atrair atenção. Um site costuma complementar essa estratégia, reunindo todas as informações e transmitindo mais confiança para quem pesquisa a empresa.",
  },
  {
    id: "5",
    title: "5. Quanto custa?",
    resposta: "Consigo passar uma estimativa, sim. Antes disso, queria entender rapidamente o objetivo de vocês para indicar a solução mais adequada.",
  },
  {
    id: "6",
    title: "6. Vou falar com o sócio / administradora.",
    resposta: "Perfeito! Muito obrigado pelo retorno. Fico à disposição caso ela(e) tenha qualquer dúvida. Se fizer sentido, também posso apresentar algumas ideias específicas para a empresa.",
    acao: "Follow-up em 3-5 dias.",
  },
  {
    id: "7",
    title: "7. Manda seu portfólio.",
    resposta: "Claro! Vou te enviar alguns projetos para conhecer meu trabalho. Depois gostaria de entender um pouco melhor o negócio de vocês para sugerir algo realmente útil.",
    observacao: "(Enviar no máximo 3 projetos.)",
  },
  {
    id: "8",
    title: "8. Não temos orçamento.",
    resposta: "Entendo perfeitamente. Nem sempre é o momento ideal. Posso manter meu contato com vocês e, quando essa demanda virar prioridade, conversamos novamente.",
  },
  {
    id: "9",
    title: "9. Já temos quem faz isso.",
    resposta: "Que bom! Então vocês já dão importância para essa área. Caso um dia precisem de uma segunda opinião ou de um projeto específico, fico à disposição.",
  },
  {
    id: "10",
    title: "10. Agora estamos sem tempo.",
    resposta: "Sem problemas. Qual seria um período melhor para eu voltar a falar com vocês?",
    observacao: "Registrar a data.",
  },
  {
    id: "11",
    title: "11. Visualizou e não respondeu.",
    observacao: "Esperar 2 dias.",
    resposta: "Oi! Tudo bem? Passando apenas para confirmar se conseguiu ver minha mensagem anterior. Fico à disposição caso faça sentido conversarmos.",
  },
  {
    id: "12",
    title: "12. Pode enviar.",
    observacao: "Enviar os projetos e depois perguntar:",
    resposta: "Aproveitando, hoje vocês já possuem um site ou a presença digital fica mais concentrada no Instagram, Google e indicações?",
  },
  {
    id: "13",
    title: "13. Última tentativa (Encerramento)",
    resposta: "Oi! Prometo que essa é minha última mensagem. 😅\n\nEntrei em contato porque realmente identifiquei algumas oportunidades na presença digital do escritório que acredito que podem ajudar na geração de novos clientes.\n\nSe esse não for um momento para vocês, sem problemas. Mas caso tenha interesse em ver uma análise rápida, é só me responder com um 'pode enviar' que compartilho sem compromisso.",
  },
  {
    id: "14",
    title: "14. Enviou os projetos e não teve retorno",
    observacao: "Mandei os projetos mas ela não respondeu ou não deu retorno.",
    resposta: "Oi! Tudo bem? 😊\n\nLembrei da nossa conversa e fiquei curioso para saber se você conseguiu dar uma olhada nos projetos que te enviei.\n\nSe tiver visto, queria muito saber o que você achou. Se surgir qualquer dúvida ou ideia, pode me chamar sem cerimônia.",
  },
];

export default function BibliotecaObjecoes() {
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
            <BookOpen className="w-3.5 h-3.5" />
            Vendas & Negociação
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Biblioteca de Objeções
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Respostas prontas para contornar as objeções mais comuns. Copie, adapte e use no WhatsApp com seus clientes.
          </p>
        </div>
      </motion.div>

      {/* ── Regras de Ouro ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="clay-card p-6 md:p-8 border border-primary/20 bg-primary/5"
      >
        <SectionTitle>Regras de Ouro</SectionTitle>
        <ul className="grid sm:grid-cols-2 gap-3">
          {[
            "Nunca discutir com o cliente.",
            "Nunca insistir após um 'não' definitivo.",
            "Fazer perguntas para entender antes de argumentar.",
            "Registrar toda nova objeção encontrada.",
          ].map((regra, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>{regra}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* ── Lista de Objeções ── */}
      <div className="grid gap-6">
        {objecoes.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2 + idx * 0.1}
            className="clay-card p-6 relative group"
          >
            <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>

            {item.context && (
              <p className="text-sm text-muted-foreground mb-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{item.context}</span>
              </p>
            )}

            {item.observacao && (
              <p className="text-sm text-muted-foreground mb-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{item.observacao}</span>
              </p>
            )}

            <div className="relative mt-4">
              <div className="bg-background/80 rounded-xl p-4 pr-12 text-sm text-foreground border border-border/50 whitespace-pre-wrap">
                {item.resposta}
              </div>
              <button
                onClick={() => handleCopy(item.resposta, item.id)}
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
