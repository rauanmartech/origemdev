import {
  Rocket,
  Building2,
  ShoppingCart,
  Layers,
  Smartphone,
  CalendarCheck,
} from "lucide-react";

// ─── Shared services data — fonte única para Orcamentos e Parcerias ──────────

export const services = [
  {
    title: "Landing Page",
    price: "1.500",
    priceNum: 1500,
    description:
      "Perfeita para campanhas específicas, lançamentos de produtos ou captura de leads. Uma página focada em conversão com design atrativo e mensagem direta que guia o visitante a uma ação específica.",
    icon: Rocket,
    included: [
      "Design responsivo (mobile e desktop)",
      "Formulário de captura de leads",
      "Otimização para conversão",
      "Integração com ferramentas de marketing",
      "Seção de depoimentos",
      "Call-to-actions estratégicos",
    ],
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Combo 3 Landing Pages",
    price: "3.000",
    priceNum: 3000,
    originalPrice: "4.500",
    description:
      "A solução ideal para múltiplos negócios ou campanhas variadas. Leve 3 landing pages profissionais e economize R$ 1.500 no seu projeto. Ideal para validação de nichos.",
    icon: Rocket,
    included: [
      "3 Landing Pages Completas",
      "Design Premium Responsivo",
      "Otimização de Conversão para todas",
      "Integração de Leads Centralizada",
      "Suporte prioritário na implementação",
      "Tudo que o pacote individual oferece x3",
    ],
    color: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
  },
  {
    title: "Combo 5 Landing Pages",
    price: "4.500",
    priceNum: 4500,
    originalPrice: "7.500",
    isPopular: true,
    description:
      "O pacote definitivo para quem quer escala máxima. 5 landing pages de alta conversão por um valor imbatível. Economia real de R$ 3.000 para dominar seu mercado.",
    icon: Rocket,
    included: [
      "5 Landing Pages de Alta Conversão",
      "Estratégia Cross-Page otimizada",
      "Design Exclusivo para cada página",
      "Consultoria de Funil de Vendas",
      "Velocidade de entrega otimizada",
      "Pacote completo com 40% de desconto",
    ],
    color: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
  {
    title: "Sistema de Agendamento Online",
    price: "800",
    priceNum: 800,
    description:
      "Organize seus atendimentos, facilite o agendamento para seus clientes e reduza o tempo gasto com mensagens e confirmações. Ideal para barbearias, clínicas e negócios que trabalham com horários marcados.",
    icon: CalendarCheck,
    included: [
      "Página ou módulo de agendamento personalizado",
      "Agendamento online 24h",
      "Organização automática de horários",
      "Integração com WhatsApp",
      "Confirmação de agendamento para o cliente",
      "Redução de faltas e retrabalho manual",
      "Interface simples e profissional para o usuário",
    ],
    color: "bg-cyan-500/10",
    iconColor: "text-cyan-500",
  },
  {
    title: "Site Institucional",
    price: "3.000",
    priceNum: 3000,
    description:
      "Apresente sua empresa de forma profissional e conquiste a confiança do seu público. Ideal para empresas que precisam estabelecer presença digital sólida e transmitir credibilidade.",
    icon: Building2,
    included: [
      "Até 6 páginas personalizadas",
      "Sobre, Serviços, Portfólio e Contato",
      "Sistema de gerenciamento de conteúdo",
      "Otimização para buscadores (SEO básico)",
      "Integração com redes sociais",
      "Formulário de contato avançado",
      "Google Analytics configurado",
    ],
    color: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    title: "E-commerce",
    price: "4.000",
    priceNum: 4000,
    specialNote:
      "Condições especiais para projetos acima de R$ 8.000: parcelamento estendido e opções sob medida para o seu negócio.",
    description:
      "Venda online 24/7 com uma loja virtual completa e segura. Solução ideal para quem quer expandir suas vendas para o digital com sistema de pagamento integrado e gestão de produtos eficiente.",
    icon: ShoppingCart,
    included: [
      "Catálogo de produtos ilimitado",
      "Carrinho de compras completo",
      "Integração com gateways de pagamento",
      "Sistema de gestão de pedidos",
      "Cálculo automático de frete",
      "Painel administrativo completo",
      "Sistema de cupons de desconto",
      "Certificado SSL incluído",
    ],
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "SaaS (Software as a Service)",
    price: "15.000",
    priceNum: 15000,
    specialNote:
      "Projetos de maior investimento contam com condições especiais de pagamento e planejamento faseado da entrega.",
    description:
      "Transforme sua ideia em um software online escalável. Perfeito para negócios que precisam de plataformas web complexas, sistemas de gestão personalizados ou ferramentas específicas para seu nicho de mercado.",
    icon: Layers,
    included: [
      "Arquitetura de software escalável",
      "Sistema de autenticação e usuários",
      "Dashboard administrativo completo",
      "API REST para integrações",
      "Banco de dados otimizado",
      "Sistema de assinaturas/planos",
      "Relatórios e analytics personalizados",
      "Documentação técnica completa",
    ],
    color: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    title: "Aplicativo Mobile",
    price: "20.000",
    priceNum: 20000,
    specialNote:
      "Para apps acima de R$ 40.000, fale comigo para condições diferenciadas, cronograma flexível e acompanhamento próximo do projeto.",
    description:
      "Leve seu negócio para o bolso dos seus clientes. Aplicativo nativo ou híbrido para iOS e Android, oferecendo experiência mobile completa e engajamento direto com seu público.",
    icon: Smartphone,
    included: [
      "Desenvolvimento para iOS e Android",
      "Design de interface (UI/UX)",
      "Sistema de login e perfis",
      "Notificações push",
      "Integração com APIs",
      "Modo offline (quando aplicável)",
      "Publicação nas lojas (App Store/Play Store)",
      "Painel web administrativo",
      "Suporte pós-lançamento",
    ],
    color: "bg-rose-500/10",
    iconColor: "text-rose-500",
  },
];

export type Service = (typeof services)[number];
