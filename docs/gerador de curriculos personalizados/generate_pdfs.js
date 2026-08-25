const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const resumes = [
  {
    folder: 'radix-engenharia-desenvolvedor-junior',
    filename: 'curriculo-rauan-rocha-radix-desenvolvedor-junior',
    title: 'Desenvolvedor de Software Júnior | Full Stack & Engenharia',
    companyTarget: 'Radix Engenharia e Software',
    summary: 'Desenvolvedor de Software com formação em Engenharia de Controle e Automação (UFMG), unindo sólida base de engenharia, lógica de programação e análise de dados industriais ao desenvolvimento de aplicações web completas. Experiência prática na construção de interfaces com foco em usabilidade, manipulação e visualização de dados via APIs REST, modelagem de banco relacional e aplicação de Python em problemas reais de engenharia e Machine Learning no contexto industrial. Perfil orientado a código limpo, boas práticas, versionamento com Git e resolução analítica de problemas.',
    experiences: [
      {
        role: 'Desenvolvedor Full Stack & Engenharia de Software',
        company: 'Atuação Independente / Origem Desenvolvimento',
        period: '2022 – Atual',
        bullets: [
          'Desenvolvimento de aplicações web completas, sistemas administrativos e interfaces dinâmicas com Next.js, React, TypeScript, Python e PostgreSQL.',
          'Construção, consumo e integração de APIs REST para conexão entre frontends, serviços backend e bancos de dados estruturados.',
          'Modelagem de esquemas relacionais, consultas SQL e implementação de controle de acesso e segurança na camada de dados.'
        ]
      },
      {
        role: 'Pesquisador em Machine Learning & Engenharia de Dados',
        company: 'Universidade Federal de Catalão',
        period: '2022 – 2023',
        bullets: [
          'Desenvolveu solução preditiva em Python aplicada a dados industriais para detecção de contaminação em óleos lubrificantes (normas ISO 4406).',
          'Tratamento, limpeza e análise exploratória de dados complexos com Scikit-learn, lógica fuzzy e modelos de clusterização/árvores de decisão.'
        ]
      }
    ],
    projects: [
      {
        name: 'Sistema Interno de Gestão e Visualização de Dados — Município de Ouro Preto',
        tech: 'Next.js, React, TypeScript, PostgreSQL, Supabase, APIs REST, Git',
        bullets: [
          'Desenvolveu aplicação web administrativa para centralização, organização e visualização de dados operacionais e patrimoniais.',
          'Construiu interfaces focadas em usabilidade e consumo dinâmico de APIs REST, além de modelagem relacional em PostgreSQL.'
        ]
      },
      {
        name: 'Olha Museu — Plataforma Digital e Consumo de APIs',
        tech: 'React, Next.js, TypeScript, APIs REST, PostgreSQL, Supabase, Git',
        bullets: [
          'Desenvolveu plataforma digital interativa com renderização dinâmica baseada em APIs REST e banco de dados relacional.',
          'Projetou componentes reutilizáveis focados em performance, responsividade e visualização fluida de informações.'
        ]
      },
      {
        name: 'Guia Digital — Museu Casa dos Contos',
        tech: 'Trabalho em Equipe Multidisciplinar, UX/UI, Web Development',
        bullets: [
          'Desenvolveu aplicação digital em equipe multidisciplinar (desenvolvedor, museóloga e turismólogo), focando na experiência do usuário.'
        ]
      }
    ],
    skills: [
      { label: 'Linguagens', items: 'Python, JavaScript, TypeScript, SQL, HTML5, CSS3' },
      { label: 'Frontend', items: 'React, Next.js, Componentização, Interfaces Responsivas, Visualização de Dados (conhecimento transferível para Angular)' },
      { label: 'Backend & APIs', items: 'APIs REST, Consumo e Construção de Endpoints, Integração de Sistemas, Node.js, Python (FastAPI/Flask)' },
      { label: 'Bancos de Dados', items: 'PostgreSQL, Supabase, Modelagem Relacional, Consultas SQL, Row Level Security (RLS)' },
      { label: 'Ciência de Dados & IA', items: 'Machine Learning, Scikit-Learn, Análise Exploratória de Dados, Tratamento de Dados Industriais' },
      { label: 'Ferramentas & DevOps', items: 'Git, GitHub, Versionamento de Código, Vercel, Code Review, Boas Práticas' }
    ]
  },
  {
    folder: 'vindi-desenvolvedor-fullstack',
    filename: 'curriculo-rauan-rocha-vindi-desenvolvedor-fullstack',
    title: 'Desenvolvedor Full Stack Júnior | APIs REST, React & Integração de Pagamentos',
    companyTarget: 'LWSA / Vindi',
    summary: 'Desenvolvedor Full Stack com formação em Engenharia de Controle e Automação (UFMG), com experiência prática no desenvolvimento de aplicações web completas, construção e consumo de APIs REST e integração de fluxos de checkout e meios de pagamento (Mercado Pago). Vivência na implementação de arquiteturas modernas utilizando React, Next.js e TypeScript no frontend, estruturação de endpoints no backend e modelagem avançada de bancos de dados relacionais (PostgreSQL/SQL) com aplicação de segurança na camada de dados (Row Level Security - RLS). Perfil orientado a regras de negócio financeiras/comerciais, código limpo, POO, versionamento com Git e resolução pragmática de problemas.',
    experiences: [
      {
        role: 'Desenvolvedor Full Stack & Engenharia de Software',
        company: 'Atuação Independente / Origem Desenvolvimento',
        period: '2022 – Atual',
        bullets: [
          'Desenvolvimento e implantação de aplicações web completas, plataformas SaaS, e-commerces e sistemas administrativos.',
          'Construção e consumo de APIs REST para integração fluida entre interfaces frontend, regras de negócio e bancos de dados relacionais.',
          'Modelagem de bancos de dados relacionais, queries SQL e aplicação de políticas de isolamento de dados com Row Level Security (RLS).'
        ]
      },
      {
        role: 'Pesquisador em Machine Learning & Dados',
        company: 'Universidade Federal de Catalão',
        period: '2022 – 2023',
        bullets: [
          'Modelagem estatística e desenvolvimento de algoritmos em Python para análise e processamento de dados industriais complexos.',
          'Aplicação de lógica computacional, estruturação de dados e boas práticas de desenvolvimento de software.'
        ]
      }
    ],
    projects: [
      {
        name: 'VOID Drip Society — E-commerce & Integração de Pagamentos',
        tech: 'Next.js, React, TypeScript, APIs REST, Mercado Pago API, PostgreSQL, Git',
        bullets: [
          'Desenvolveu loja virtual completa com fluxo de compra de ponta a ponta, catálogo dinâmico e gestão de pedidos.',
          'Integrou a API de pagamentos do Mercado Pago para processamento seguro de transações financeiras e webhooks de confirmação.',
          'Estruturou a camada de checkout e processamento de pagamentos com tratamento de erros e integração com serviços externos.'
        ]
      },
      {
        name: 'Sistema de Gestão de Treinos e Segurança de Dados — Corpus Prime',
        tech: 'Next.js, React, TypeScript, PostgreSQL, Supabase, Row Level Security (RLS), Git',
        bullets: [
          'Desenvolveu aplicação SaaS para gestão de treinos e usuários, implementando regras de negócio e controle de acesso granular.',
          'Projetou a arquitetura em PostgreSQL, aplicando políticas de Row Level Security (RLS) para proteção de dados na persistência.'
        ]
      },
      {
        name: 'Sistema Interno de Gestão — Município de Ouro Preto',
        tech: 'React, Next.js, TypeScript, PostgreSQL, Supabase, APIs REST, Git',
        bullets: [
          'Desenvolveu sistema administrativo web para centralização de registros e controle de acervo com integridade relacional em PostgreSQL.'
        ]
      }
    ],
    skills: [
      { label: 'Frontend', items: 'React, Next.js, TypeScript, JavaScript, Vue.js (conceitos transferíveis via ecossistema SPA), HTML5, CSS3, Componentização' },
      { label: 'Backend & APIs', items: 'APIs REST (Construção e Integração), Autenticação & Autorização, Gateways de Pagamento, Node.js, Python, POO e Design Patterns' },
      { label: 'Bancos de Dados', items: 'PostgreSQL, Supabase, Modelagem Relacional (compatível com MySQL), Consultas SQL Estruturadas, Row Level Security (RLS)' },
      { label: 'E-commerce & Negócio', items: 'Integração de API de Pagamento (Mercado Pago), Fluxo de Checkout, Processamento de Transações, Gestão de Pedidos' },
      { label: 'DevOps & Ferramentas', items: 'Git, GitHub, Versionamento de Código, Vercel, Webhooks, N8N' }
    ]
  },
  {
    folder: 'nansen-desenvolvedor-sistemas',
    filename: 'curriculo-rauan-rocha-nansen-desenvolvedor-sistemas',
    title: 'Desenvolvedor de Sistemas | Engenharia de Software & Banco de Dados',
    companyTarget: 'Nansen',
    summary: 'Desenvolvedor de Sistemas com formação em Engenharia de Controle e Automação (UFMG), unindo raciocínio analítico de engenharia, sólidos conceitos de engenharia de software e experiência prática no design, codificação e manutenção de módulos funcionais para sistemas web e corporativos. Experiência na modelagem e gerenciamento de bancos de dados relacionais (PostgreSQL/SQL), elaboração de scripts estruturados, arquitetura de dados e aplicação de algoritmos em contextos industriais. Vivência em levantamento de requisitos com partes interessadas, documentação técnica, depuração de código, testes de módulos e integração contínua com Git.',
    experiences: [
      {
        role: 'Desenvolvedor de Software & Sistemas Web',
        company: 'Atuação Independente / Origem Desenvolvimento',
        period: '2022 – Atual',
        bullets: [
          'Design preliminar e detalhado, arquitetura e codificação de módulos funcionais para sistemas administrativos e plataformas web.',
          'Modelagem de bancos relacionais (PostgreSQL/SQL), estruturação de tabelas, índices e implementação de segurança com RLS.',
          'Elaboração de documentações funcionais, manuais técnicos e condução de testes e depuração de módulos de software.'
        ]
      },
      {
        role: 'Pesquisador em Engenharia de Dados & Machine Learning',
        company: 'Universidade Federal de Catalão',
        period: '2022 – 2023',
        bullets: [
          'Desenvolvimento de rotinas computacionais e modelos preditivos em Python para análise de dados de ativos e óleos industriais (ISO 4406).',
          'Aplicação de métodos estatísticos e engenharia de dados em problemas reais da indústria.'
        ]
      }
    ],
    projects: [
      {
        name: 'Sistema Interno de Gestão e Administração de Dados — Município de Ouro Preto',
        tech: 'Next.js, React, TypeScript, PostgreSQL, Supabase, APIs REST, Git',
        bullets: [
          'Realizou o design detalhado, arquitetura e codificação de módulos funcionais para centralização e gerenciamento de dados patrimoniais.',
          'Projetou a modelagem relacional em PostgreSQL, criando esquemas estruturados e scripts otimizados para operações de consulta.',
          'Conduziu testes internos e depuração conjunta para assegurar a estabilidade operacional do sistema, além de alinhamento com partes interessadas.'
        ]
      },
      {
        name: 'Aplicação de Machine Learning para Análise de Dados Industriais',
        tech: 'Python, Dados Industriais, Estatística Computacional, ISO 4406',
        bullets: [
          'Desenvolveu solução computacional para análise e identificação de padrões de contaminação em óleos lubrificantes industriais.',
          'Desenvolveu rotinas e scripts em Python para tratamento, limpeza e pré-processamento de fluxos de dados de equipamentos.'
        ]
      },
      {
        name: 'Sistema de Gestão e Segurança de Acesso — Corpus Prime',
        tech: 'PostgreSQL, Supabase, Row Level Security, Next.js, TypeScript, Git',
        bullets: [
          'Projetou e implementou módulos de controle de acesso de usuários, regras de autorização e políticas de RLS no banco de dados.'
        ]
      }
    ],
    skills: [
      { label: 'Engenharia de Software', items: 'Design Detalhado de Módulos, Arquitetura Modular, Documentação de Projeto, POO, Resolução de Problemas' },
      { label: 'Linguagens & Scripts', items: 'JavaScript, TypeScript, Python (Scripts de Dados e Automação), SQL, HTML5, CSS3' },
      { label: 'Banco de Dados', items: 'Modelagem Relacional, PostgreSQL, Supabase, Queries e Scripts SQL (compatível com MySQL), Row Level Security (RLS)' },
      { label: 'Desenvolvimento de Sistemas', items: 'Next.js, React, APIs REST, Microsserviços e Integração entre Módulos, Node.js' },
      { label: 'Qualidade & Depuração', items: 'Testes de Módulos, Depuração de Código, Refatoração, Garantia de Estabilidade de Sistemas' },
      { label: 'Controle de Versão & Ferramentas', items: 'Git, GitHub, Versionamento de Código, Alinhamento Técnico Multidisciplinar' }
    ]
  },
  {
    folder: 'ats-informatica-desenvolvedor-pleno',
    filename: 'curriculo-rauan-rocha-ats-informatica-desenvolvedor-pleno',
    title: 'Desenvolvedor Pleno | Full Stack, Arquitetura de Sistemas & Integrações',
    companyTarget: 'ATS Informática',
    summary: 'Desenvolvedor de Software com formação em Engenharia de Controle e Automação (UFMG) e sólida atuação no desenvolvimento de sistemas corporativos, aplicações web completas, plataformas digitais e soluções de automação e integração de dados. Experiência de ponta a ponta na arquitetura de software, modelagem avançada de bancos de dados relacionais (PostgreSQL/SQL), implementação de políticas de segurança e controle de acesso (Row Level Security - RLS), desenvolvimento de interfaces modernas e performáticas (React, Next.js, TypeScript) e construção de APIs REST resilientes. Histórico comprovado na entrega de sistemas para administração pública, automação de processos comerciais e plataformas de e-commerce com integração de meios de pagamento.',
    experiences: [
      {
        role: 'Desenvolvedor Full Stack & Engenheiro de Software',
        company: 'Atuação Independente / Origem Desenvolvimento',
        period: '2022 – Atual',
        bullets: [
          'Liderança técnica e desenvolvimento de ponta a ponta em projetos de software corporativo, aplicações SaaS e sistemas de gestão.',
          'Definição da arquitetura de backend e frontend com Next.js, React, TypeScript, Node.js e Python.',
          'Modelagem avançada de dados relacionais em PostgreSQL, otimização de consultas e aplicação de segurança com RLS.',
          'Concepção e integração de APIs REST para conexão de gateways de pagamento, CRMs e plataformas de terceiros.'
        ]
      },
      {
        role: 'Pesquisador em Engenharia de Dados & Machine Learning',
        company: 'Universidade Federal de Catalão',
        period: '2022 – 2023',
        bullets: [
          'Desenvolvimento de modelos preditivos e algoritmos computacionais em Python aplicados à análise de dados industriais.',
          'Estruturação de rotinas de processamento de dados e aplicação de rigor metodológico e normas técnicas.'
        ]
      }
    ],
    projects: [
      {
        name: 'Sistema Integrado de Gestão Administrativa — Município de Ouro Preto',
        tech: 'Next.js, React, TypeScript, PostgreSQL, Supabase, APIs REST, Git',
        bullets: [
          'Liderou a arquitetura do sistema web para centralização de dados, controle patrimonial e operações administrativas.',
          'Projetou a modelagem relacional no PostgreSQL, estruturando endpoints de APIs para operações de criação, consulta e auditoria.',
          'Desenvolveu interfaces administrativas intuitivas e responsivas com TypeScript e React, garantindo alta eficiência operacional.'
        ]
      },
      {
        name: 'VOID Drip Society — E-commerce & Processamento de Pagamentos',
        tech: 'Next.js, React, TypeScript, Mercado Pago API, PostgreSQL, REST APIs',
        bullets: [
          'Desenvolveu plataforma de e-commerce estruturando desde o catálogo de produtos até o processamento transacional seguro.',
          'Projetou e implementou a integração com a API do Mercado Pago, gerenciando checkout e webhooks de confirmação assíncrona.'
        ]
      },
      {
        name: 'Sistema SaaS de Gestão e Segurança de Acesso — Corpus Prime',
        tech: 'Next.js, React, TypeScript, PostgreSQL, Supabase, Row Level Security',
        bullets: [
          'Arquitetou sistema SaaS para gerenciamento operacional com múltiplos perfis de permissão e isolamento de registros via RLS no PostgreSQL.'
        ]
      }
    ],
    skills: [
      { label: 'Arquitetura & Engenharia', items: 'Desenvolvimento Full Stack, Modelagem de Domínio, Arquitetura Modular, Design Patterns, POO' },
      { label: 'Frontend Moderno', items: 'React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Componentização Avançada, Otimização de Performance' },
      { label: 'Backend & APIs', items: 'Construção e Integração de APIs REST, Node.js, Python, Microsserviços, Webhooks, Autenticação/Autorização' },
      { label: 'Banco de Dados & Persistência', items: 'PostgreSQL, Supabase, Modelagem Relacional, Consultas SQL Complexas, Row Level Security (RLS)' },
      { label: 'Automação & Integrações', items: 'N8N, Integração de Pagamentos (Mercado Pago), Automação de CRM (Kommo), Agentes de IA' },
      { label: 'DevOps & Ferramentas', items: 'Git, GitHub, Versionamento de Código, Vercel, CI/CD, Deploy de Ambientes de Produção' }
    ]
  }
];

function generateHTML(resume) {
  const experiencesHtml = resume.experiences.map(exp => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${exp.role}</span>
        <span class="item-period">${exp.period}</span>
      </div>
      <div class="item-subtitle">${exp.company}</div>
      <ul class="bullet-list">
        ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const projectsHtml = resume.projects.map(proj => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${proj.name}</span>
      </div>
      <div class="item-tech">${proj.tech}</div>
      <ul class="bullet-list">
        ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const skillsHtml = resume.skills.map(s => `
    <p class="skill-row"><strong>${s.label}:</strong> ${s.items}</p>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Currículo - Clíres Rauan da Rocha Nascimento</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 9mm 12mm 9mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 8.5pt;
      line-height: 1.32;
      color: #1e293b;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      margin-bottom: 7px;
      padding-bottom: 5px;
      border-bottom: 2px solid #2563eb;
    }
    h1.name {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin-bottom: 1px;
      text-transform: uppercase;
    }
    .target-role {
      font-size: 9.8pt;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 4px;
    }
    .contact-info {
      font-size: 8pt;
      color: #475569;
      display: flex;
      flex-wrap: wrap;
      gap: 3px 9px;
      align-items: center;
    }
    .contact-info a {
      color: #2563eb;
      text-decoration: none;
    }
    .section {
      margin-bottom: 7px;
    }
    .section-title {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 3px;
      padding-bottom: 1.5px;
      border-bottom: 1px solid #cbd5e1;
    }
    .summary-text {
      text-align: justify;
      color: #334155;
      font-size: 8.3pt;
      line-height: 1.3;
    }
    .item {
      margin-bottom: 5px;
    }
    .item:last-child {
      margin-bottom: 1px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 8.8pt;
      font-weight: 700;
      color: #0f172a;
    }
    .item-period {
      font-size: 7.8pt;
      font-weight: 600;
      color: #64748b;
    }
    .item-subtitle {
      font-size: 8.2pt;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 1.5px;
    }
    .item-tech {
      font-size: 7.8pt;
      font-style: italic;
      color: #475569;
      margin-bottom: 1.5px;
    }
    .bullet-list {
      list-style-type: disc;
      padding-left: 14px;
      color: #334155;
      font-size: 8.2pt;
      line-height: 1.28;
    }
    .bullet-list li {
      margin-bottom: 1.5px;
      text-align: justify;
    }
    .skill-row {
      font-size: 8.2pt;
      color: #334155;
      margin-bottom: 1.5px;
      line-height: 1.28;
    }
    .skill-row strong {
      color: #0f172a;
    }
    .education-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 1px;
    }
    .edu-title {
      font-size: 8.8pt;
      font-weight: 700;
      color: #0f172a;
    }
    .edu-period {
      font-size: 7.8pt;
      font-weight: 600;
      color: #64748b;
    }
    .edu-inst {
      font-size: 8.2pt;
      color: #2563eb;
      font-weight: 600;
    }
    .edu-desc {
      font-size: 8pt;
      color: #475569;
      margin-top: 1px;
    }
    .lang-row {
      font-size: 8.2pt;
      color: #334155;
    }
  </style>
</head>
<body>

  <header class="header">
    <h1 class="name">Clíres Rauan da Rocha Nascimento</h1>
    <div class="target-role">${resume.title}</div>
    <div class="contact-info">
      <span>Belo Horizonte, MG</span>
      <span>•</span>
      <span>(71) 98378-9492</span>
      <span>•</span>
      <span><a href="mailto:rauanrocha.martech@gmail.com">rauanrocha.martech@gmail.com</a></span>
      <span>•</span>
      <span>Site: <a href="https://origemdev.com.br/sobre" target="_blank">origemdev.com.br/sobre</a></span>
      <span>•</span>
      <span>LinkedIn: <a href="https://www.linkedin.com/in/rauanrochadev/" target="_blank">linkedin.com/in/rauanrochadev</a></span>
      <span>•</span>
      <span>GitHub: <a href="https://github.com/rauanmartech" target="_blank">github.com/rauanmartech</a></span>
    </div>
  </header>

  <section class="section">
    <h2 class="section-title">Resumo Profissional</h2>
    <p class="summary-text">${resume.summary}</p>
  </section>

  <section class="section">
    <h2 class="section-title">Experiência Profissional</h2>
    ${experiencesHtml}
  </section>

  <section class="section">
    <h2 class="section-title">Projetos Técnicos Relevantes</h2>
    ${projectsHtml}
  </section>

  <section class="section">
    <h2 class="section-title">Competências Técnicas</h2>
    ${skillsHtml}
  </section>

  <section class="section">
    <h2 class="section-title">Formação Acadêmica</h2>
    <div class="education-item">
      <span class="edu-title">Graduação em Engenharia de Controle e Automação</span>
      <span class="edu-period">2022 – Cursando</span>
    </div>
    <div class="edu-inst">Universidade Federal de Minas Gerais (UFMG)</div>
    <p class="edu-desc">Fundamentação em engenharia de software, modelagem matemática, arquitetura de sistemas computacionais e processos estruturados.</p>
  </section>

  <section class="section">
    <h2 class="section-title">Idiomas</h2>
    <p class="lang-row"><strong>Português:</strong> Nativo &nbsp;|&nbsp; <strong>Inglês:</strong> Intermediário</p>
  </section>

</body>
</html>`;
}

async function run() {
  const chromePath = fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

  console.log('Using browser binary:', chromePath);

  const baseDir = path.resolve(__dirname, 'curriculos');

  for (const resume of resumes) {
    const targetFolder = path.join(baseDir, resume.folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const htmlPath = path.join(targetFolder, `${resume.filename}.html`);
    const pdfPath = path.join(targetFolder, `${resume.filename}.pdf`);

    const htmlContent = generateHTML(resume);
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Generated HTML: ${htmlPath}`);

    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
    const cmd = `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`;
    
    console.log(`Compiling PDF for ${resume.companyTarget}...`);
    execSync(cmd);
    console.log(`✓ PDF Created: ${pdfPath}`);
  }

  console.log('\nAll 4 PDFs updated and re-generated successfully!');
}

run().catch(console.error);
