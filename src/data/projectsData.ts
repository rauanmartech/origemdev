import { Brush, Shirt, Shield, Newspaper, Palette, LucideIcon, Stethoscope, Smartphone } from "lucide-react";
import alvaroHomeImg from "../assets/assets-de-projeto/alvaro-assets/home.webp";
import alvaroSobreImg from "../assets/assets-de-projeto/alvaro-assets/sobre.webp";
import alvaroTattooImg from "../assets/assets-de-projeto/alvaro-assets/tattoo.webp";
import voiddripConjuntosImg from "../assets/assets-de-projeto/voiddrip-assets/conjuntos.png";
import voiddripLojaImg from "../assets/assets-de-projeto/voiddrip-assets/loja.png";
import nefCompletoImg from "../assets/assets-de-projeto/nef-assets/nef-completo.png";
import nefRespCivilImg from "../assets/assets-de-projeto/nef-assets/responsabilidade-civil.webp";
import nefVidaImg from "../assets/assets-de-projeto/nef-assets/vida.webp";
import nefDiabeticosImg from "../assets/assets-de-projeto/nef-assets/diabeticos.webp";
import nefEFPrincipalImg from "../assets/assets-de-projeto/negocio-e-franquia/principal.webp";
import nefEFSobreImg from "../assets/assets-de-projeto/negocio-e-franquia/sobre-a-negocio-e-franquia.webp";
import nefEFNoticiasImg from "../assets/assets-de-projeto/negocio-e-franquia/noticias.webp";
import nerinePaginaInicialImg from "../assets/assets-de-projeto/nerine/pagina-inicial.webp";
import nerinePortfolioImg from "../assets/assets-de-projeto/nerine/portfiolio.webp";
import nerineClubCartasImg from "../assets/assets-de-projeto/nerine/clube-de-cartas.webp";
import pingadoInicioImg from "../assets/assets-de-projeto/pingado-tattoo/inicio.webp";
import pingadoGaleriaImg from "../assets/assets-de-projeto/pingado-tattoo/galeria-de-tattoos.webp";
import marcoAntonioImg from "../assets/assets-de-projeto/marco-antonio/marco-antonio.png";
import corpusInicioImg from "../assets/assets-de-projeto/corpus-prime/inicio.png";
import corpusPerfilImg from "../assets/assets-de-projeto/corpus-prime/perfil.png";
import corpusTreinoImg from "../assets/assets-de-projeto/corpus-prime/treino.png";
import corpusEvolucaoImg from "../assets/assets-de-projeto/corpus-prime/evolucao.png";
import corpusSocialImg from "../assets/assets-de-projeto/corpus-prime/social.png";
import corpusConquistasImg from "../assets/assets-de-projeto/corpus-prime/conquistas.png";

export interface ProjectPreview {
  title: string;
  image: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string[];
  tech: string[];
  features?: string[];
  icon: LucideIcon;
  image?: string;
  video?: string;
  link?: string;
  previews?: ProjectPreview[];
  isMobile?: boolean;
}

export const projectsData: Project[] = [
  {
    id: "alvarosobral",
    title: "Álvaro Sobral",
    description: "Desenvolvimento de uma plataforma exclusiva para Álvaro Sobral, multiartista de Catalão (GO), reunindo em um único ambiente digital todas as suas expressões criativas.",
    fullDescription: [
      "Desenvolvimento de uma plataforma exclusiva para Álvaro Sobral, multiartista de Catalão (GO), reunindo em um único ambiente digital todas as suas expressões criativas. O projeto foi concebido para traduzir sua identidade artística em uma experiência imersiva, permitindo que visitantes naveguem entre diferentes universos como tatuagem, grafite, ilustrações digitais, pintura, música e outros trabalhos autorais.",
      "Mais do que um portfólio tradicional, a plataforma conta com gerenciamento dinâmico de conteúdo, permitindo a atualização independente de obras e projetos por meio de um sistema integrado ao banco de dados. Cada segmento artístico possui sua própria galeria, organização e identidade visual, proporcionando uma navegação intuitiva e valorizando cada área de atuação do artista.",
      "O design foi desenvolvido de forma totalmente personalizada, com foco em uma estética contemporânea, animações fluidas e uma experiência responsiva que reforça o caráter criativo da marca pessoal do Álvaro."
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
    features: [
      "Design UI/UX totalmente exclusivo.",
      "Portfólios independentes para cada segmento artístico.",
      "Sistema de gerenciamento de conteúdo integrado ao banco de dados.",
      "Galerias dinâmicas e organizadas por categoria.",
      "Animações e microinterações utilizando Framer Motion.",
      "Interface responsiva com foco em performance e UX.",
      "Arquitetura moderna utilizando Next.js, Supabase e Tailwind CSS."
    ],
    icon: Brush,
    previews: [
      { title: "Home", image: alvaroHomeImg },
      { title: "Sobre", image: alvaroSobreImg },
      { title: "Portfólio Tattoo", image: alvaroTattooImg }
    ]
  },
  {
    id: "void-drip-society",
    title: "VOID Drip Society",
    description: "Desenvolvimento de um e-commerce completo para a VOID Drip Society, marca de roupas com identidade voltada ao universo streetwear.",
    fullDescription: [
      "Desenvolvimento de um e-commerce completo para a VOID Drip Society, marca de roupas com identidade voltada ao universo streetwear. O projeto foi criado para oferecer uma experiência de compra premium, aliando design exclusivo, alta performance e uma estrutura robusta para gestão do negócio.",
      "A plataforma conta com catálogo dinâmico de produtos, controle de estoque em tempo real, sistema de cupons promocionais, gerenciamento completo de pedidos e integração com banco de dados, permitindo que toda a operação da loja seja administrada de forma prática e eficiente.",
      "Além disso, foi implementada a integração com o Mercado Pago, possibilitando pagamentos via Pix, cartão de crédito, boleto e demais métodos disponíveis, garantindo segurança e flexibilidade para os clientes durante todo o processo de compra."
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Mercado Pago"],
    features: [
      "Design premium e totalmente personalizado.",
      "E-commerce 100% funcional.",
      "Gerenciamento de produtos, estoque e pedidos.",
      "Sistema de cupons integrado.",
      "Banco de dados em tempo real com Supabase.",
      "Integração completa com Mercado Pago.",
      "Checkout otimizado e experiência responsiva.",
      "Arquitetura moderna utilizando Next.js, TypeScript, Tailwind CSS, Supabase e Mercado Pago API."
    ],
    icon: Shirt,
    previews: [
      { title: "Página da Loja", image: voiddripLojaImg },
      { title: "Conjuntos", image: voiddripConjuntosImg }
    ]
  },
  {
    id: "nef-seguros",
    title: "NEF Seguros & Benefícios",
    description: "Desenvolvimento de um ecossistema digital completo para a NEF Seguros & Benefícios, centralizando toda a estratégia de aquisição de clientes em uma única plataforma.",
    fullDescription: [
      "Desenvolvimento de um ecossistema digital completo para a NEF Seguros & Benefícios, centralizando toda a estratégia de aquisição de clientes em uma única plataforma. O projeto integra diversas landing pages segmentadas por modalidade de seguro, oferecendo uma experiência otimizada tanto para os visitantes quanto para a equipe comercial.",
      "Cada landing page foi desenvolvida com foco em conversão, seguindo estratégias de UX, copywriting e performance para maximizar a geração de leads. Todas as informações são armazenadas em um banco de dados centralizado e alimentam automaticamente o fluxo comercial da empresa.",
      "A plataforma conta com captação automática de leads, integração com CRM, envio automatizado de mensagens via WhatsApp, gerenciamento centralizado das campanhas e uma estrutura escalável que facilita a criação de novas páginas para diferentes produtos e públicos."
    ],
    tech: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "N8N"],
    features: [
      "Ecossistema centralizado de landing pages de alta conversão.",
      "Banco de dados integrado para gerenciamento de leads.",
      "Automação de atendimento via WhatsApp.",
      "Integração com CRM e fluxo comercial automatizado.",
      "Formulários inteligentes com armazenamento em tempo real.",
      "Plataforma escalável para novos produtos e campanhas.",
      "Design personalizado com foco em performance e conversão.",
      "Arquitetura moderna utilizando Next.js, Supabase, TypeScript, Tailwind CSS, N8N e integrações com APIs externas."
    ],
    icon: Shield,
    previews: [
      { title: "Plataforma NEF (Completo)", image: nefCompletoImg },
      { title: "Responsabilidade Civil para Médicos", image: nefRespCivilImg },
      { title: "Seguro de Vida / Residencial", image: nefVidaImg },
      { title: "Seguro para Diabéticos", image: nefDiabeticosImg }
    ]
  },
  {
    id: "negocio-e-franquia",
    title: "Negócio e Franquia",
    description: "Desenvolvimento de uma plataforma editorial completa para o Negócio e Franquia, projetada para oferecer uma experiência moderna na publicação e consumo de notícias sobre empreendedorismo e franchising.",
    fullDescription: [
      "Desenvolvimento de uma plataforma editorial completa para o Negócio e Franquia, projetada para oferecer uma experiência moderna na publicação e consumo de notícias sobre empreendedorismo, franchising, varejo e negócios. O projeto foi estruturado para unir performance, organização de conteúdo e monetização em uma única solução.",
      "A plataforma conta com um sistema de gerenciamento de conteúdo (CMS) integrado, permitindo que redatores e administradores publiquem, editem e organizem notícias de forma simples e eficiente. Todo o conteúdo é armazenado em banco de dados, com estrutura preparada para categorias, autores, destaques e gerenciamento editorial.",
      "Além da experiência de leitura, o portal foi desenvolvido com foco em monetização, incluindo áreas estratégicas para exibição de anúncios, banners patrocinados e campanhas publicitárias, proporcionando uma estrutura escalável para crescimento da audiência e geração de receita."
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Prisma"],
    features: [
      "Portal editorial de notícias totalmente personalizado.",
      "Sistema de gerenciamento de conteúdo (CMS) integrado.",
      "Banco de dados para notícias, autores e categorias.",
      "Estrutura preparada para monetização com anúncios e banners.",
      "Painel administrativo para gerenciamento editorial.",
      "Interface responsiva com foco em performance e SEO.",
      "Arquitetura moderna utilizando Next.js, TypeScript, Supabase, Tailwind CSS e Prisma."
    ],
    icon: Newspaper,
    previews: [
      { title: "Página Principal", image: nefEFPrincipalImg },
      { title: "Sobre a Negócio e Franquia", image: nefEFSobreImg },
      { title: "Notícias", image: nefEFNoticiasImg }
    ]
  },
  {
    id: "nerine-clube-de-cartas",
    title: "Nerine Clube de Cartas",
    description: "Desenvolvimento de uma plataforma exclusiva para a Nerine Clube de Cartas, unindo o portfólio digital de uma artista plástica a um sistema de assinaturas mensais.",
    fullDescription: [
      "Desenvolvimento de uma plataforma exclusiva para a Nerine Clube de Cartas, unindo o portfólio digital de uma artista plástica a um sistema de assinaturas mensais. O projeto foi concebido para valorizar a identidade visual da artista enquanto oferece uma experiência intuitiva para colecionadores e assinantes.",
      "Além de apresentar obras e peças autorais em galerias dinâmicas, a plataforma conta com um clube de assinaturas totalmente integrado ao Mercado Pago, permitindo pagamentos recorrentes e gerenciamento automatizado dos membros. Todo o acervo artístico é administrado por meio de um banco de dados, facilitando a organização e atualização do conteúdo."
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Mercado Pago"],
    features: [
      "Design exclusivo desenvolvido para refletir a identidade da artista.",
      "Portfólio digital com galerias organizadas por categoria.",
      "Sistema de assinaturas mensais integrado ao Mercado Pago.",
      "Gerenciamento de obras e peças através de banco de dados.",
      "Painel administrativo para atualização de conteúdo.",
      "Plataforma responsiva com foco em experiência do usuário.",
      "Arquitetura moderna utilizando Next.js, TypeScript, Supabase, Tailwind CSS e Mercado Pago API."
    ],
    icon: Palette,
    previews: [
      { title: "Página Inicial", image: nerinePaginaInicialImg },
      { title: "Portfólio", image: nerinePortfolioImg },
      { title: "Clube de Cartas", image: nerineClubCartasImg }
    ]
  },
  {
    id: "pingado-tattoo-studio",
    title: "Pingado Tattoo Studio",
    description: "Desenvolvimento de uma plataforma digital para o Pingado Tattoo Studio, estúdio de tatuagem em BH, destacando o trabalho de três tatuadores em um único ambiente.",
    fullDescription: [
      "Desenvolvimento de uma plataforma digital para o Pingado Tattoo Studio, estúdio de tatuagem localizado em Belo Horizonte (MG). O projeto foi criado para destacar o trabalho de três tatuadores em um único ambiente, oferecendo uma navegação intuitiva entre os estilos, portfólios e informações de cada artista.",
      "A plataforma reúne galerias organizadas por tatuador e categoria, permitindo uma apresentação profissional dos trabalhos realizados. Todo o conteúdo é gerenciado por meio de um banco de dados, facilitando a atualização constante do portfólio e garantindo uma experiência moderna tanto para os clientes quanto para a equipe do estúdio."
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Framer Motion"],
    features: [
      "Design exclusivo alinhado à identidade do estúdio.",
      "Portfólios individuais para cada tatuador.",
      "Galerias organizadas por estilos e categorias.",
      "Sistema de gerenciamento de conteúdo integrado ao banco de dados.",
      "Interface responsiva com foco em performance e experiência do usuário.",
      "Arquitetura moderna utilizando Next.js, TypeScript, Supabase, Tailwind CSS e Framer Motion."
    ],
    icon: Brush,
    previews: [
      { title: "Início", image: pingadoInicioImg },
      { title: "Galeria de Tattoos", image: pingadoGaleriaImg }
    ]
  },
  {
    id: "clinica-dr-marco-antonio",
    title: "Clínica Veterinária Dr. Marco Antônio",
    description: "Desenvolvimento de uma landing page para a Clínica Veterinária Dr. Marco Antônio, projetada para transformar visitantes em pacientes por meio de uma experiência simples, objetiva e focada em conversão.",
    fullDescription: [
      "Desenvolvimento de uma landing page para a Clínica Veterinária Dr. Marco Antônio, projetada para transformar visitantes em pacientes por meio de uma experiência simples, objetiva e focada em conversão. O projeto combina uma identidade visual acolhedora com uma navegação intuitiva, transmitindo confiança aos tutores desde o primeiro contato.",
      "O principal diferencial da plataforma é o sistema de agendamento integrado, que permite o envio automático das solicitações de consulta por meio de formulários inteligentes. Todas as informações são armazenadas em banco de dados, facilitando a organização dos atendimentos e agilizando o processo de contato com os clientes.",
      "O resultado é uma plataforma que fortalece a presença digital da clínica e simplifica o processo de agendamento, proporcionando mais praticidade para os tutores e maior eficiência no atendimento da equipe veterinária."
    ],
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    features: [
      "Landing page desenvolvida com foco em conversão.",
      "Design exclusivo alinhado à identidade da clínica.",
      "Sistema de agendamento integrado.",
      "Formulários inteligentes com armazenamento em banco de dados.",
      "Interface responsiva e otimizada para dispositivos móveis.",
      "Arquitetura moderna utilizando Next.js, TypeScript, Supabase e Tailwind CSS."
    ],
    icon: Stethoscope,
    previews: [
      { title: "Landing Page", image: marcoAntonioImg }
    ]
  },
  {
    id: "corpus-prime",
    title: "Corpus Prime",
    description: "Desenvolvimento de um aplicativo completo para a Corpus Prime, projetado para transformar a experiência dos alunos dentro e fora da academia.",
    fullDescription: [
      "Desenvolvimento de um aplicativo completo para a Corpus Prime, projetado para transformar a experiência dos alunos dentro e fora da academia. A plataforma centraliza todas as informações do usuário em um ambiente moderno, intuitivo e totalmente integrado, incentivando a consistência nos treinos por meio de recursos de acompanhamento, gamificação e interação social.",
      "O aplicativo oferece uma dashboard personalizada, gerenciamento de fichas de treino, registro de cargas e repetições, gráficos de evolução, sistema de conquistas, ranking entre alunos, comunidade para compartilhamento de resultados e um perfil completo com acompanhamento de métricas físicas. Todos os dados são armazenados em banco de dados e vinculados individualmente a cada usuário, garantindo uma experiência personalizada e segura.",
      "O resultado é um aplicativo completo para academias, que une tecnologia, motivação e acompanhamento de desempenho em uma única plataforma, proporcionando aos alunos uma experiência muito além da ficha de treino tradicional."
    ],
    tech: ["React Native", "TypeScript", "Supabase", "Expo"],
    features: [
      "Dashboard personalizada com visão geral da evolução do aluno.",
      "Criação e gerenciamento de fichas de treino.",
      "Registro de séries, repetições, cargas e histórico de exercícios.",
      "Sistema de conquistas, experiência e ranking (gamificação).",
      "Comunidade integrada para publicações e interação entre alunos.",
      "Gráficos de evolução física e progressão de cargas.",
      "Perfil com acompanhamento de peso, massa magra e métricas corporais.",
      "Banco de dados estruturado com informações separadas por usuário.",
      "Arquitetura moderna utilizando React Native, TypeScript, Supabase e Expo."
    ],
    icon: Smartphone,
    isMobile: true,
    previews: [
      { title: "Início", image: corpusInicioImg },
      { title: "Perfil", image: corpusPerfilImg },
      { title: "Treino", image: corpusTreinoImg },
      { title: "Evolução", image: corpusEvolucaoImg },
      { title: "Social", image: corpusSocialImg },
      { title: "Conquistas", image: corpusConquistasImg }
    ]
  },
];
