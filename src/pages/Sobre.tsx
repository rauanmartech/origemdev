import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Github,
  GraduationCap,
  Languages,
  Briefcase,
  Code2,
  Database,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Terminal,
  Layers,
  BrainCircuit,
  Workflow,
  Download,
  Share2,
  ChevronRight,
  Home,
  MessageSquare,
  FileCheck,
  ZoomIn,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Optimized WebP photos
const photos = [
  {
    src: "/images/sobre/IMG_8704.webp",
    alt: "Rauan Rocha - Engenharia de Software e Desenvolvimento",
    caption: "Rauan Rocha — Engenheiro de Software & Full Stack Developer",
    tag: "Perfil Técnico"
  },
  {
    src: "/images/sobre/1000119534.webp",
    alt: "Rauan Rocha - Ambiente de Trabalho & Projetos",
    caption: "Foco em código limpo, arquitetura modular e soluções escaláveis",
    tag: "Workspace"
  },
  {
    src: "/images/sobre/1000119558.webp",
    alt: "Rauan Rocha - Análise e Arquitetura",
    caption: "Visão estratégica unindo lógica de engenharia e desenvolvimento de produtos",
    tag: "Engenharia & Negócio"
  }
];

const technicalSkills = [
  {
    category: "Frontend Moderno",
    icon: LayoutIcon,
    description: "Interfaces reativas, responsivas e de alta fidelidade com foco em performance e experiência do usuário.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "HTML5 / CSS3",
      "Componentização Avançada",
      "Framer Motion",
      "Web Performance & SEO"
    ]
  },
  {
    category: "Backend & APIs",
    icon: Terminal,
    description: "Construção de endpoints resilientes, serviços modulares e integração entre sistemas heterogêneos.",
    skills: [
      "APIs REST",
      "Node.js",
      "Python (FastAPI / Flask)",
      "Mercado Pago API",
      "Webhooks & Event-driven",
      "Autenticação & Autorização",
      "Integração de Gateways",
      "POO & Design Patterns"
    ]
  },
  {
    category: "Banco de Dados & Segurança",
    icon: Database,
    description: "Modelagem relacional consistente e implementação de políticas de segurança na camada de persistência.",
    skills: [
      "PostgreSQL",
      "Supabase",
      "Row Level Security (RLS)",
      "Modelagem Relacional",
      "Consultas SQL Avançadas",
      "Isolamento Multi-tenant",
      "Integridade Referencial",
      "Prisma ORM"
    ]
  },
  {
    category: "IA, Dados & Automação",
    icon: BrainCircuit,
    description: "Modelagem preditiva para contextos industriais e automação de fluxos comerciais complexos com IA.",
    skills: [
      "Machine Learning (Scikit-learn)",
      "Data Science em Python",
      "Análise Exploratória de Dados",
      "Agentes de IA",
      "N8N Workflows",
      "Kommo CRM Automation",
      "Evolution API (WhatsApp)",
      "Normalização de Dados (ISO 4406)"
    ]
  }
];

function LayoutIcon(props: any) {
  return <Layers {...props} />;
}

const careerExperiences = [
  {
    role: "Desenvolvedor Full Stack & Engenharia de Software",
    company: "Origem Desenvolvimento / Atuação Independente",
    period: "2022 – Atual",
    type: "Contrato / Projetos",
    location: "Belo Horizonte, MG",
    summary: "Atuação de ponta a ponta na arquitetura, modelagem de banco de dados, desenvolvimento frontend/backend e implantação de aplicações corporativas, plataformas SaaS e soluções governamentais.",
    achievements: [
      "Desenvolvimento do Sistema Interno de Museus para o Município de Ouro Preto, estruturando banco PostgreSQL e interfaces administrativas completas.",
      "Criação e lançamento do e-commerce VOID Drip Society com integração direta à API do Mercado Pago para checkout e webhooks de pagamento.",
      "Implementação de políticas de Row Level Security (RLS) no PostgreSQL para isolamento de dados no sistema SaaS Corpus Prime.",
      "Construção de fluxos automatizados de atendimento e qualificação de leads com N8N, Agentes de IA e integração CRM para NEF Seguros."
    ],
    tech: ["Next.js", "React", "TypeScript", "PostgreSQL", "Supabase", "APIs REST", "RLS", "Python", "Git", "Vercel"]
  },
  {
    role: "Pesquisador em Machine Learning & Engenharia de Dados",
    company: "Universidade Federal de Catalão (UFCAT)",
    period: "2022 – 2023",
    type: "Pesquisa Aplicada / P&D",
    location: "Catalão, GO",
    summary: "Desenvolvimento de rotinas computacionais e modelos de Machine Learning aplicados à análise preditiva de contaminação em óleos lubrificantes industriais.",
    achievements: [
      "Tratamento e preparação de dados industriais complexos segundo normativas técnicas de classificação (ISO 4406).",
      "Desenvolvimento de modelos preditivos e classificatórios em Python utilizando Scikit-learn, árvores de decisão e lógica computacional.",
      "Condução de análises estatísticas exploratórias para suporte à tomada de decisão na manutenção preditiva de ativos industriais."
    ],
    tech: ["Python", "Machine Learning", "Scikit-learn", "Pandas", "NumPy", "Estatística Aplicada", "ISO 4406"]
  }
];

const featuredProjects = [
  {
    id: "ml-lubrificantes",
    title: "Machine Learning para Ativos Industriais",
    badge: "IA & Engenharia de Dados",
    description: "Solução preditiva baseada em Python e Scikit-learn para análise de padrões de contaminação em óleos lubrificantes sob norma ISO 4406, voltada a manutenção preditiva industrial.",
    tech: ["Python", "Scikit-Learn", "Machine Learning", "Data Analysis", "ISO 4406"],
    highlights: [
      "Classificação automatizada de severidade de contaminação",
      "Tratamento e limpeza de bases de dados de ativos mecânicos",
      "Modelagem preditiva e relatórios analíticos de engenharia"
    ],
    link: null
  },
  {
    id: "void-drip-society",
    title: "VOID Drip Society — E-commerce & Mercado Pago",
    badge: "Full Stack & Pagamentos",
    description: "Plataforma de e-commerce completa com catálogo dinâmico, controle de estoque, painel de pedidos e integração de checkout transacional via API do Mercado Pago.",
    tech: ["Next.js", "React", "TypeScript", "Mercado Pago API", "Supabase", "PostgreSQL"],
    highlights: [
      "Integração nativa com gateway de pagamento Mercado Pago",
      "Tratamento assíncrono de notificações de pagamento via Webhooks",
      "Checkout otimizado com cálculo de frete e cupons em tempo real"
    ],
    link: "/projetos/void-drip-society"
  },
  {
    id: "gestao-museus-ouro-preto",
    title: "Sistema de Gestão de Museus — Ouro Preto",
    badge: "Sistemas Governamentais",
    description: "Sistema web corporativo desenvolvido para a administração municipal de Ouro Preto, centralizando registros patrimoniais, controle de acervo e processos administrativos.",
    tech: ["Next.js", "React", "TypeScript", "PostgreSQL", "Supabase", "APIs REST"],
    highlights: [
      "Modelagem relacional completa em PostgreSQL para acervos e museus",
      "Módulos administrativos com controle de usuários e auditoria",
      "Interface responsiva com alta performance para equipes públicas"
    ],
    link: null
  },
  {
    id: "corpus-prime",
    title: "Corpus Prime — SaaS com Segurança RLS",
    badge: "SaaS & Database Security",
    description: "Sistema de gestão de treinos e rotinas com arquitetura multi-perfil, implementando políticas de Row Level Security (RLS) diretamente na camada do PostgreSQL.",
    tech: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Row Level Security (RLS)"],
    highlights: [
      "Políticas de isolamento de dados com RLS no PostgreSQL",
      "Autenticação e controle granular de permissões por perfil",
      "Painel interativo para acompanhamento de evolução física"
    ],
    link: "/projetos/corpus-prime"
  },
  {
    id: "nef-seguros",
    title: "CRM Automatizado & Agentes de IA — NEF Seguros",
    badge: "Automação & Integrações",
    description: "Ecossistema de captação e qualificação automática de leads, integrando landing pages de alta conversão, N8N, Kommo CRM, WhatsApp API e Agentes de Inteligência Artificial.",
    tech: ["Next.js", "N8N", "Kommo CRM", "Evolution API", "AI Agents", "TypeScript"],
    highlights: [
      "Jornadas automáticas de qualificação e encaminhamento de leads",
      "Disparo inteligente e humanizado de mensagens via WhatsApp",
      "Pipeline comercial sincronizado em tempo real com CRM"
    ],
    link: "/projetos/nef-seguros"
  },
  {
    id: "negocio-e-franquia",
    title: "Negócio e Franquia — Editorial Digital & CMS",
    badge: "CMS Headless & Full Stack",
    description: "Portal editorial de notícias de negócios e franquias construído com arquitetura Headless, Next.js, PostgreSQL e WordPress REST API.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "WordPress REST API", "Supabase"],
    highlights: [
      "Renderização estática e dinâmica para alto índice no Google (SEO)",
      "Painel editorial desacoplado para redatores e administradores",
      "Estrutura otimizada para monetização com banners e anúncios"
    ],
    link: "/projetos/negocio-e-franquia"
  }
];

const Sobre = () => {
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const email = "rauanrocha.martech@gmail.com";
  const phone = "(71) 98378-9492";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#12100e] text-foreground transition-colors">
      <Navbar />

      {/* Floating Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl bg-card border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Foto ampliada"
                className="w-full h-auto max-h-[85vh] object-contain rounded-3xl"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Início</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-primary font-semibold">Perfil Profissional & Contratação</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Disponível para Oportunidades (CLT / PJ / Full-time)
            </span>
          </div>
        </div>

        {/* Hero Card / Executive Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="clay-card p-6 md:p-10 mb-10 border border-primary/10 relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Profile Avatar / Photo */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative group cursor-pointer" onClick={() => setSelectedPhoto(photos[0].src)}>
                <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-xl relative z-10 bg-muted">
                  <img
                    src={photos[0].src}
                    alt={photos[0].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 z-20 px-3 py-1 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md">
                  UFMG Eng.
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="clay-badge text-xs uppercase tracking-wider font-bold">
                  Dossiê Profissional do Candidato
                </span>
                <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                <span className="text-muted-foreground text-xs hidden sm:inline">Belo Horizonte, MG</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-2">
                Clíres Rauan da Rocha Nascimento
              </h1>

              <p className="text-lg sm:text-xl font-semibold text-primary mb-4">
                Engenheiro de Software & Desenvolvedor Full Stack
              </p>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
                Graduação em <strong>Engenharia de Controle e Automação (UFMG)</strong>. Experiência prática na
                concepção e entrega de aplicações web completas, APIs REST resilientes, modelagem de banco de
                dados com <strong>PostgreSQL / RLS</strong>, integrações com <strong>Mercado Pago</strong>, automações com IA e aplicação de <strong>Machine Learning</strong> em dados industriais reais.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/5571983789492?text=${encodeURIComponent("Olá Rauan, vi seu perfil profissional e gostaria de conversar sobre uma oportunidade!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-btn text-xs sm:text-sm py-3 px-5 inline-flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Conversar via WhatsApp</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/rauanrochadev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-btn-outline text-xs sm:text-sm py-3 px-4 inline-flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4 text-[#0077b5]" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://github.com/rauanmartech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-btn-outline text-xs sm:text-sm py-3 px-4 inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>

                <button
                  onClick={handleCopyEmail}
                  className="clay-btn-outline text-xs sm:text-sm py-3 px-4 inline-flex items-center gap-2 relative"
                  title="Clique para copiar e-mail"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-muted-foreground" />
                      <span>Copiar E-mail</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Dashboard Grid: Sidebar (Info Lateral) + Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT SIDEBAR (INFORMAÇÕES RELEVANTES) ================= */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Contact & Summary Card */}
            <div className="clay-card p-6 border border-primary/10">
              <h2 className="text-xs uppercase tracking-wider font-bold text-primary mb-4 flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                <span>Dados de Contato</span>
              </h2>

              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Localização</span>
                    <span>Belo Horizonte, MG — Brasil</span>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground block">E-mail Direto</span>
                    <a href={`mailto:${email}`} className="text-primary hover:underline break-all">
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Telefone / WhatsApp</span>
                    <a href="tel:+5571983789492" className="hover:text-primary transition-colors">
                      {phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-muted-foreground">
                  <Linkedin className="w-4 h-4 text-[#0077b5] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Perfil LinkedIn</span>
                    <a
                      href="https://www.linkedin.com/in/rauanrochadev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>in/rauanrochadev</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-muted-foreground">
                  <Github className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Repositórios GitHub</span>
                    <a
                      href="https://github.com/rauanmartech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>github.com/rauanmartech</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Academic Formation */}
            <div className="clay-card p-6 border border-primary/10">
              <h2 className="text-xs uppercase tracking-wider font-bold text-primary mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Formação Acadêmica</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Graduação em Engenharia de Controle e Automação
                  </h3>
                  <p className="text-xs text-primary font-semibold">
                    Universidade Federal de Minas Gerais (UFMG)
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">2022 – Cursando</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sólida fundamentação matemática, algoritmos estruturados, arquitetura de sistemas computacionais, lógica de controle e rigor metodológico para resolução de problemas complexos.
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="clay-card p-6 border border-primary/10">
              <h2 className="text-xs uppercase tracking-wider font-bold text-primary mb-4 flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <span>Idiomas</span>
              </h2>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Português</span>
                  <span className="clay-badge text-[11px] py-0.5">Nativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Inglês</span>
                  <span className="clay-badge text-[11px] py-0.5">Intermediário / Leitura Técnica</span>
                </div>
              </div>
            </div>

            {/* Core Principles Card */}
            <div className="clay-card p-6 border border-primary/10 bg-gradient-to-br from-card via-card to-primary/5">
              <h2 className="text-xs uppercase tracking-wider font-bold text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Princípios de Engenharia</span>
              </h2>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-foreground">Prova &gt; Declaração:</strong> Toda competência é validada por implementações e projetos reais documentados.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-foreground">Segurança na Camada de Dados:</strong> Implementação de políticas RLS em PostgreSQL para isolamento efetivo.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-foreground">Código Limpo & Escalável:</strong> Arquitetura modular, TypeScript estrito e aderência às melhores práticas de engenharia de software.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <div className="lg:col-span-8 space-y-10">
            {/* Executive Summary & Background */}
            <section className="clay-card p-6 md:p-8 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Resumo Profissional para Recrutadores
                </h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Sou <strong>desenvolvedor de software</strong> com formação em <strong>Engenharia de Controle e Automação pela UFMG</strong>, combinando o raciocínio analítico, visão sistêmica e lógica estruturada de engenharia com a construção ágil de produtos de software modernos.
                </p>
                <p>
                  Minha atuação cobre todo o ciclo de entrega de valor: desde a arquitetura de software, modelagem relacional de bancos de dados em <strong>PostgreSQL</strong> e isolamento seguro com <strong>Row Level Security (RLS)</strong>, até a estruturação de APIs REST, integração de meios de pagamento (<strong>Mercado Pago</strong>) e desenvolvimento de interfaces fluidas e performáticas com <strong>React, Next.js e TypeScript</strong>.
                </p>
                <p>
                  Além do desenvolvimento web e SaaS, possuo vivência em <strong>pesquisa aplicada em Machine Learning e Engenharia de Dados</strong> com Python, atuando na análise de parâmetros físicos e previsão de contaminação em óleos industriais sob normas técnicas (ISO 4406), além de criação de agentes inteligentes de IA e automações avançadas.
                </p>
              </div>
            </section>

            {/* Photo Highlights Gallery */}
            <section className="clay-card p-6 md:p-8 border border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Galeria & Registro Profissional
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Clique para expandir</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {photos.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(p.src)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-primary/15 bg-muted relative aspect-[4/5] shadow-md hover:shadow-xl transition-all"
                  >
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-black/60 px-2 py-0.5 rounded-md w-fit mb-1">
                        {p.tag}
                      </span>
                      <p className="text-[11px] text-white/90 line-clamp-2 leading-snug">
                        {p.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Career Timeline / Experiences */}
            <section className="clay-card p-6 md:p-8 border border-primary/10">
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Trajetória Profissional & Experiências
                </h2>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-primary/20">
                {careerExperiences.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-primary border-4 border-card shadow-sm" />

                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {exp.role}
                      </h3>
                      <span className="clay-badge text-xs font-semibold py-0.5">
                        {exp.period}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span className="text-muted-foreground">{exp.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                      {exp.summary}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      {exp.achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Skills Matrix */}
            <section className="clay-card p-6 md:p-8 border border-primary/10">
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="w-5 h-5 text-primary" />
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Matriz de Competências Técnicas
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {technicalSkills.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-card border border-primary/10 shadow-sm hover:border-primary/30 transition-all flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-primary/10 text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display font-bold text-base text-foreground">
                          {cat.category}
                        </h3>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4 flex-1">
                        {cat.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Relevant Projects Showcase */}
            <section className="clay-card p-6 md:p-8 border border-primary/10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Projetos Técnicos Relevantes
                  </h2>
                </div>
                <span className="text-xs font-semibold text-primary">
                  Evidências de Aplicação Prática
                </span>
              </div>

              <div className="grid gap-6">
                {featuredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-all group relative"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {proj.title}
                      </h3>
                      <span className="clay-badge text-[11px] font-bold uppercase tracking-wider">
                        {proj.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-4 bg-muted/40 p-3.5 rounded-xl border border-primary/5">
                      {proj.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Badges & Link */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tech.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {proj.link && (
                        <Link
                          to={proj.link}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Ver case completo</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recruiter Call-To-Action Card - Solid Orange */}
            <section className="clay-card p-8 md:p-12 border border-primary/30 bg-primary text-center relative overflow-hidden shadow-2xl">
              <div className="max-w-2xl mx-auto space-y-4 relative z-10">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs uppercase tracking-wider font-extrabold bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-sm">
                  Vamos conversar?
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Procurando um profissional com sólida base técnica e foco em execução?
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                  Estou disponível para processos seletivos e entrevistas para posições de <strong className="text-white font-bold">Engenharia de Software</strong>, <strong className="text-white font-bold">Desenvolvimento Full Stack</strong>, <strong className="text-white font-bold">Backend</strong> e <strong className="text-white font-bold">Dados / IA</strong>.
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <a
                    href={`https://wa.me/5571983789492?text=${encodeURIComponent("Olá Rauan! Gostaria de agendar uma conversa sobre uma oportunidade.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl font-bold px-7 py-3.5 text-sm bg-white text-primary hover:bg-orange-50 active:scale-95 transition-all duration-200 inline-flex items-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Chamar no WhatsApp</span>
                  </a>

                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent("Oportunidade Profissional - Rauan Rocha")}`}
                    className="rounded-2xl font-bold px-7 py-3.5 text-sm bg-black/30 text-white border border-white/40 hover:bg-black/45 active:scale-95 transition-all duration-200 inline-flex items-center gap-2 backdrop-blur-sm shadow-md"
                  >
                    <Mail className="w-4 h-4 text-white" />
                    <span>Enviar E-mail</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
