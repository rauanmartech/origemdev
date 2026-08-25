# SISTEMA INTELIGENTE DE PERSONALIZAÇÃO DE CURRÍCULO — ORIGEM

## 1. OBJETIVO PRINCIPAL

Você deverá transformar o sistema atual de currículo em um **sistema inteligente de personalização de currículo orientado a vagas**, capaz de analisar automaticamente cada oportunidade adicionada pelo usuário, identificar os requisitos mais importantes da vaga e gerar uma versão do currículo especificamente otimizada para aquela oportunidade.

O objetivo não é criar um currículo genérico "bonito".

O objetivo é construir um currículo que:

1. seja verdadeiro e totalmente baseado nas experiências reais do candidato;
2. demonstre claramente as competências exigidas pela vaga;
3. utilize a linguagem e terminologia da própria vaga quando houver correspondência real;
4. seja altamente compatível com sistemas ATS;
5. priorize as experiências e projetos mais relevantes para aquela oportunidade;
6. aumente a probabilidade de o recrutador identificar rapidamente o fit;
7. alcance **mínimo de 85% de compatibilidade ATS sempre que isso for possível com base nas experiências reais disponíveis**;
8. gere um relatório detalhado explicando a compatibilidade e eventuais gaps;
9. mantenha uma base profissional reutilizável para futuras vagas;
10. mantenha o site profissional atualizado em:

**https://origindev.com.br/sobre**

---

# 2. CONTEXTO DO CANDIDATO

O candidato é:

**Rauan Rocha**

Profissional com formação em **Engenharia de Controle e Automação**, atuação prática em desenvolvimento de software, criação de produtos digitais, aplicações web, automações, integrações, sistemas e projetos próprios/clientes.

A base profissional deve ser construída a partir dos arquivos existentes no projeto.

### REGRA FUNDAMENTAL

Não assumir que esta descrição representa toda a experiência do candidato.

A fonte oficial da experiência profissional será:

- arquivo de currículo/base curricular;
- arquivo de experiências profissionais;
- arquivo de projetos;
- demais documentos existentes na pasta de dados do candidato.

Você deverá ler esses arquivos antes de gerar ou modificar qualquer currículo.

---

# 3. ARQUITETURA DE DADOS DO SISTEMA

O projeto deverá trabalhar conceitualmente com três camadas:

```text
CANDIDATO
    ↓
BASE DE EXPERIÊNCIAS E PROJETOS
    ↓
OPORTUNIDADE DE VAGA
    ↓
ANÁLISE DE COMPATIBILIDADE
    ↓
SELEÇÃO DAS MELHORES EVIDÊNCIAS
    ↓
CURRÍCULO PERSONALIZADO
    ↓
VALIDAÇÃO ATS
    ↓
RELATÓRIO DE COMPATIBILIDADE
```

Não misturar essas responsabilidades.

A base do candidato representa a realidade profissional.

A vaga representa o que a empresa está procurando.

O currículo personalizado representa a interseção entre os dois.

---

# 4. LEITURA AUTOMÁTICA DAS OPORTUNIDADES

O usuário irá adicionar arquivos de oportunidades de emprego dentro de uma pasta específica do projeto.

O sistema deverá detectar e ler esses arquivos.

As oportunidades poderão estar em formatos como:

- PDF;
- DOCX;
- TXT;
- Markdown;
- HTML;
- arquivos exportados de plataformas de recrutamento;
- outros formatos textuais suportados pelo projeto.

Sempre que uma nova oportunidade for adicionada, o sistema deverá ser capaz de analisá-la.

---

# 5. EXTRAÇÃO ESTRUTURADA DA VAGA

Para cada vaga, criar internamente uma representação estruturada contendo:

### Identificação

- empresa;
- cargo;
- departamento, quando disponível;
- senioridade;
- modalidade;
- localização;
- tipo de contratação.

### Requisitos obrigatórios

Identificar explicitamente:

- tecnologias;
- linguagens;
- frameworks;
- bancos de dados;
- ferramentas;
- metodologias;
- competências técnicas;
- competências comportamentais;
- formação;
- experiência mínima;
- certificações;
- idiomas;
- requisitos específicos.

### Requisitos desejáveis

Separar:

- nice-to-have;
- diferenciais;
- tecnologias secundárias;
- experiências complementares.

### Responsabilidades

Extrair as principais atividades esperadas no cargo.

### Keywords

Criar três grupos:

```text
KEYWORDS CRÍTICAS
KEYWORDS IMPORTANTES
KEYWORDS SECUNDÁRIAS
```

Dar maior peso às keywords:

- repetidas diversas vezes;
- presentes em requisitos obrigatórios;
- presentes no título do cargo;
- presentes nas responsabilidades principais;
- associadas a tecnologias centrais;
- associadas a competências indispensáveis.

---

# 6. ANÁLISE SEMÂNTICA DA VAGA

Não limitar a análise a palavras isoladas.

Identificar também:

- competências;
- contexto de uso;
- tecnologias relacionadas;
- responsabilidades;
- senioridade;
- domínio de negócio;
- expectativa de autonomia;
- tipo de problema que o profissional deverá resolver.

Exemplo:

Se a vaga solicitar:

> "Desenvolvimento de aplicações web utilizando React e integração com APIs REST."

O sistema deverá reconhecer:

```text
React
Desenvolvimento Web
APIs REST
Integração de sistemas
Frontend
```

Mas deverá preservar também a expressão original:

```text
"React"
"APIs REST"
"desenvolvimento de aplicações web"
```

Quando uma keyword existir na experiência real do candidato, priorizar a terminologia utilizada pela vaga.

---

# 7. REGRA ABSOLUTA CONTRA INVENÇÃO

Esta é uma das regras mais importantes do sistema.

## NUNCA:

- inventar experiência;
- inventar emprego;
- inventar projeto;
- inventar cliente;
- inventar resultado;
- inventar tecnologia;
- inventar certificação;
- inventar formação;
- inventar número;
- inventar senioridade;
- afirmar domínio de uma tecnologia nunca utilizada;
- inserir uma keyword simplesmente porque ela aparece na vaga.

O sistema deve trabalhar somente com evidências disponíveis na base do candidato.

### Exemplo

Se a vaga exige:

```text
AWS
Docker
Kubernetes
```

e a base do candidato demonstra:

```text
Docker
```

mas não demonstra AWS ou Kubernetes:

Não escrever:

> "Experiência com AWS, Docker e Kubernetes."

Escrever somente o que puder ser comprovado.

O relatório deverá mostrar:

```text
Docker → COMPATÍVEL
AWS → GAP
Kubernetes → GAP
```

---

# 8. BANCO DE EXPERIÊNCIAS

O arquivo de experiências profissionais deverá funcionar como uma espécie de:

**Career Experience Database**

Cada experiência/projeto deve ser interpretado como uma fonte de evidências.

Sempre que possível, estruturar cada experiência internamente com:

```text
Projeto
Contexto
Problema
Solução
Responsabilidades
Tecnologias
Arquitetura
Integrações
Resultados
Competências demonstradas
Domínio
Complexidade
Evidências quantitativas
```

Não tratar todos os projetos como equivalentes.

Cada projeto deverá possuir uma relevância diferente dependendo da vaga analisada.

---

# 9. PROJETOS IMPORTANTES DO CANDIDATO

Entre os projetos existentes na base, considerar especialmente projetos que demonstrem:

- desenvolvimento web;
- aplicações completas;
- SaaS;
- e-commerce;
- APIs;
- integrações;
- pagamentos;
- banco de dados;
- autenticação;
- automações;
- sistemas administrativos;
- arquitetura de software;
- desenvolvimento frontend;
- desenvolvimento backend;
- integração entre serviços;
- deploy;
- cloud;
- gestão de produto;
- resolução de problemas reais.

### VOID DRIP SOCIETY

O projeto da **VOID Drip Society** deve receber atenção especial quando for relevante para a vaga.

O projeto possui:

- loja virtual;
- integração de pagamentos;
- integração com API do Mercado Pago;
- fluxo real de e-commerce;
- arquitetura de aplicação;
- desenvolvimento de funcionalidades de negócio;
- integração com serviços externos.

Não reduzir esse projeto a:

> "Criação de uma loja virtual."

Quando relevante, utilizar as evidências técnicas reais existentes no arquivo de experiências.

---

# 10. OUTROS PROJETOS

Também considerar os demais projetos presentes no arquivo de experiências, incluindo projetos relacionados à:

- ORIGEM / Origin Desenvolvimento;
- GRUMINS;
- NEF Seguros;
- sistemas CRM;
- automações;
- Kommo;
- N8N;
- Evolution API;
- Supabase;
- aplicações Next.js;
- WordPress Headless;
- Vercel;
- GitHub;
- projetos SaaS;
- aplicações web;
- integrações;
- projetos de clientes;
- outros projetos documentados na base.

IMPORTANTE:

Não utilizar automaticamente todos os projetos.

A seleção deve ser feita com base na vaga.

---

# 11. ALGORITMO DE SELEÇÃO DOS PROJETOS

Para cada vaga, calcular uma relevância relativa para cada experiência.

Utilizar conceitualmente fatores como:

```text
Compatibilidade técnica        30%
Compatibilidade de competências 20%
Compatibilidade de contexto     15%
Correspondência de keywords     15%
Similaridade de responsabilidades 10%
Complexidade do projeto         5%
Força das evidências/resultados 5%
```

Esses pesos podem ser ajustados se a natureza da vaga justificar.

### Exemplo

Se a vaga procura:

```text
Full Stack Developer
Next.js
React
Supabase
PostgreSQL
APIs
```

um projeto contendo:

```text
Next.js
Supabase
PostgreSQL
API
frontend + backend
```

deve ter prioridade muito maior do que um projeto puramente visual.

---

# 12. SELEÇÃO DINÂMICA DO CURRÍCULO

O currículo não deve utilizar sempre os mesmos projetos.

Para cada vaga:

1. analisar todos os projetos disponíveis;
2. pontuar cada um;
3. selecionar os mais relevantes;
4. ordenar por relevância;
5. destacar as competências que melhor respondem à vaga;
6. reduzir ou remover experiências pouco relevantes;
7. ajustar a quantidade de projetos conforme o espaço disponível.

O sistema deve responder:

> "Quais experiências do candidato melhor provam que ele consegue executar este trabalho?"

e não:

> "Quais experiências o candidato possui?"

Essa diferença é fundamental.

---

# 13. PERSONALIZAÇÃO DO RESUMO PROFISSIONAL

O resumo profissional deverá ser reescrito para cada oportunidade.

Deve conter, quando verdadeiro:

- cargo-alvo;
- especialidades;
- tecnologias principais;
- competências mais importantes da vaga;
- diferenciais relevantes;
- experiência prática.

Evitar:

- frases genéricas;
- clichês;
- adjetivos vazios;
- "apaixonado por tecnologia";
- "proativo";
- "dedicado";
- "busco novos desafios".

Priorizar evidências.

---

# 14. PERSONALIZAÇÃO DAS EXPERIÊNCIAS

As experiências deverão ser reescritas estrategicamente.

Cada bullet deve seguir, sempre que possível:

```text
AÇÃO + TECNOLOGIA/COMPETÊNCIA + CONTEXTO + RESULTADO
```

Exemplo estrutural:

> Desenvolveu [solução] utilizando [tecnologias], integrando [serviços], com foco em [problema], resultando em [resultado/evidência].

Não criar resultados que não estejam documentados.

Se não houver métrica, não inventar métrica.

---

# 15. KEYWORDS ATS

O sistema deverá identificar:

### Exact Match

Termos que aparecem literalmente na vaga.

### Semantic Match

Termos equivalentes ou semanticamente relacionados.

### Evidence Match

Termos que aparecem na vaga e possuem comprovação dentro das experiências.

### Unsupported Match

Termos presentes na vaga, mas sem evidência na base do candidato.

A prioridade é:

```text
Exact + Evidence Match
```

e não simplesmente aumentar a quantidade de palavras.

---

# 16. DISTRIBUIÇÃO DAS KEYWORDS

As keywords mais importantes deverão aparecer naturalmente em:

### 1. Resumo

Quando relevante.

### 2. Competências / Skills

Sempre que houver domínio real.

### 3. Experiências

Principalmente quando houver evidência prática.

Não concentrar todas as keywords na seção de Skills.

Uma keyword importante deve, quando possível, aparecer em contexto real de experiência.

---

# 17. PROIBIÇÃO DE KEYWORD STUFFING

NUNCA:

```text
React React React
Next.js Next.js Next.js
API API API
```

NUNCA inserir blocos ocultos.

NUNCA utilizar:

- texto branco;
- fonte minúscula;
- texto fora da área visível;
- keywords escondidas;
- listas artificiais;
- descrição da vaga copiada para dentro do currículo;
- manipulação de parsing;
- instruções escondidas para ATS.

O objetivo é otimização legítima, não fraude do sistema.

---

# 18. FORMATO ATS-FIRST

O currículo deverá priorizar máxima legibilidade para ATS.

Preferir:

- uma coluna;
- estrutura linear;
- títulos convencionais;
- texto selecionável;
- hierarquia clara;
- datas consistentes;
- bullets simples;
- fontes legíveis;
- ausência de elementos gráficos essenciais;
- ausência de tabelas para estruturar conteúdo;
- ausência de caixas de texto;
- ausência de informações importantes em headers/footers;
- ausência de ícones substituindo texto;
- ausência de gráficos;
- ausência de barras de proficiência;
- ausência de foto, salvo exigência explícita da oportunidade.

Se houver uma versão visualmente sofisticada, ela poderá existir separadamente.

O currículo destinado a candidatura deve ser:

**ATS-FIRST.**

---

# 19. ESTRUTURA DO CURRÍCULO

A estrutura padrão deverá ser:

```text
NOME
Cargo-alvo / Especialidade
Contato | LinkedIn | GitHub | Site

RESUMO PROFISSIONAL

COMPETÊNCIAS

EXPERIÊNCIA PROFISSIONAL

PROJETOS RELEVANTES

FORMAÇÃO ACADÊMICA

CERTIFICAÇÕES / CURSOS
```

A estrutura pode mudar conforme a vaga.

Por exemplo, se projetos forem mais fortes que experiências formais, a seção de projetos pode ganhar maior destaque.

---

# 20. SITE PROFISSIONAL

Atualizar o direcionamento do currículo para:

**https://origindev.com.br/sobre**

O site profissional deverá ser tratado como parte da estratégia de candidatura.

No currículo:

```text
Site: origindev.com.br/sobre
```

ou equivalente visualmente limpo.

Não utilizar:

- URLs longas desnecessárias;
- links quebrados;
- páginas antigas;
- caminhos obsoletos.

---

# 21. O SITE DEVE SER COMPATÍVEL COM O POSICIONAMENTO PROFISSIONAL

A página:

**origindev.com.br/sobre**

deve funcionar como extensão do currículo.

Ela deve comunicar:

- quem é Rauan;
- especialidade profissional;
- tecnologias;
- forma de trabalho;
- projetos relevantes;
- experiência prática;
- diferenciais;
- portfólio;
- contato.

O conteúdo deve ser coerente com o currículo.

Nunca apresentar no site uma competência que não esteja respaldada pela base profissional.

---

# 22. COMPATIBILIDADE ATS

Criar um sistema de scoring de 0 a 100.

A pontuação deve considerar:

```text
Keywords críticas
Keywords importantes
Tecnologias
Título do cargo
Responsabilidades
Competências
Experiência
Projetos
Formação
Senioridade
Contexto
Parsing / estrutura
```

Uma sugestão de distribuição:

```text
Keywords críticas                  25
Keywords importantes               15
Tecnologias e ferramentas          15
Responsabilidades                  15
Experiências relevantes            10
Projetos relevantes                 8
Título / senioridade                 5
Formação / certificações             4
Estrutura ATS                        3
--------------------------------------
TOTAL                              100
```

---

# 23. META DE 85%

A meta de cada currículo personalizado é:

**>= 85/100**

Porém:

## NÃO aumentar a pontuação artificialmente.

Se a experiência real do candidato não permitir chegar a 85%, o sistema deverá:

1. produzir a melhor versão possível;
2. informar a pontuação real;
3. identificar os gaps;
4. explicar quais requisitos não possuem evidência;
5. indicar o que seria necessário para atingir maior compatibilidade.

Exemplo:

```text
ATS MATCH: 78%

META: 85%

STATUS: ABAIXO DA META

Principais gaps:
- Kubernetes
- AWS
- experiência com microsserviços em produção
```

Isso é preferível a fabricar experiência.

---

# 24. VALIDAÇÃO AUTOMÁTICA

Depois de gerar o currículo, executar uma segunda análise.

Fluxo:

```text
VAGA
 ↓
ANÁLISE
 ↓
CURRÍCULO V1
 ↓
ATS ANALYSIS
 ↓
GAP ANALYSIS
 ↓
CURRÍCULO V2
 ↓
ATS ANALYSIS
 ↓
FINAL
```

O sistema deve fazer pelo menos uma rodada de otimização.

Se a pontuação estiver abaixo de 85%, procurar oportunidades legítimas de melhoria:

- reorganização;
- melhor uso de keywords;
- melhor descrição das experiências;
- substituição de projeto;
- reordenação de skills;
- melhoria do resumo;
- inclusão de evidências existentes;
- melhor correspondência de nomenclatura.

Não inventar competências.

---

# 25. RELATÓRIO DE COMPATIBILIDADE

Para cada currículo criado, gerar um relatório separado.

O relatório deverá conter:

## VISÃO GERAL

```text
Cargo:
Empresa:
ATS Match:
Meta:
Status:
```

## SCORE

Mostrar:

```text
Keywords críticas       XX/25
Keywords importantes    XX/15
Tecnologias             XX/15
Responsabilidades       XX/15
Experiência             XX/10
Projetos                XX/8
Título/Senioridade      XX/5
Formação                XX/4
ATS Formatting          XX/3
```

## KEYWORDS ENCONTRADAS

Tabela:

| Keyword | Prioridade | Evidência | Local no currículo |
|---|---|---|---|

## KEYWORDS AUSENTES

Tabela:

| Keyword | Prioridade | Possui experiência? | Ação |
|---|---|---|---|

Nunca recomendar inserir uma keyword sem experiência real.

## COMPETÊNCIAS COMPROVADAS

Mostrar quais competências da vaga possuem evidência forte.

## PROJETOS SELECIONADOS

Mostrar:

```text
Projeto
Score de relevância
Por que foi selecionado
Competências demonstradas
```

## PROJETOS DESCARTADOS

Opcionalmente mostrar os projetos que foram excluídos e explicar por quê.

## PRINCIPAIS GAPS

Identificar:

- requisitos não atendidos;
- tecnologias ausentes;
- experiência insuficiente;
- senioridade;
- formação;
- certificações;
- idiomas.

## RECOMENDAÇÃO

Classificar a candidatura como:

```text
EXCELENTE FIT
FORTE FIT
BOM FIT
FIT MODERADO
BAIXO FIT
```

---

# 26. EXEMPLO DO RACIOCÍNIO

Suponha uma vaga:

```text
Frontend Developer

Requisitos:
React
Next.js
TypeScript
REST APIs
Git
Supabase
```

O sistema encontra na base:

```text
Projeto A:
Next.js
React
Supabase
REST API
Git

Projeto B:
WordPress
PHP
SEO

Projeto C:
Next.js
React
TypeScript
API
Vercel
```

O currículo deverá priorizar:

```text
Projeto C
Projeto A
```

e não:

```text
Projeto B
```

Mesmo que o Projeto B seja mais antigo ou tenha sido realizado para um cliente importante.

O critério é:

**relevância para a vaga.**

---

# 27. PRINCÍPIO "PROVA > DECLARAÇÃO"

Sempre preferir:

> "Desenvolveu aplicação web utilizando Next.js, React e Supabase, integrando APIs externas..."

a:

> "Possui conhecimentos avançados em Next.js, React e Supabase."

A primeira frase demonstra competência.

A segunda apenas declara.

O currículo deve funcionar como um conjunto de evidências.

---

# 28. PRIORIDADE DAS EXPERIÊNCIAS

Quando houver conflito entre experiências, utilizar esta hierarquia:

```text
1. Experiência diretamente relacionada à vaga
2. Projeto com mesma stack
3. Projeto com mesma responsabilidade
4. Projeto com mesmo domínio
5. Projeto que demonstre competência transferível
6. Demais experiências
```

---

# 29. NÃO EXAGERAR NA PERSONALIZAÇÃO

O currículo deve parecer escrito por uma pessoa que realmente possui aquela experiência.

Não transformar o currículo inteiro na descrição da vaga.

A personalização deve ocorrer principalmente em:

- título;
- resumo;
- skills;
- ordem das experiências;
- bullets;
- projetos;
- vocabulário técnico.

Manter a identidade profissional do candidato.

---

# 30. DIFERENCIAR ATS DE RECRUTADOR

O currículo deve satisfazer dois leitores:

### ATS

Precisa encontrar:

- termos;
- competências;
- cargos;
- tecnologias;
- experiência;
- formação.

### RECRUTADOR

Precisa entender rapidamente:

- quem é o candidato;
- o que ele sabe fazer;
- se já resolveu problemas semelhantes;
- quais projetos comprovam isso;
- por que ele merece uma entrevista.

Nunca sacrificar completamente a legibilidade humana em favor do ATS.

---

# 31. ARQUITETURA DE PASTAS

Organizar o projeto de maneira semelhante a:

```text
/
├── oportunidades/
│   ├── vaga-01.pdf
│   ├── vaga-02.pdf
│   └── ...
│
├── candidato/
│   ├── curriculo-base.md
│   ├── experiencias.md
│   ├── projetos.md
│   └── ...
│
├── curriculos/
│   ├── vaga-01/
│   │   ├── curriculo.md
│   │   ├── curriculo.pdf
│   │   └── relatorio-ats.md
│   │
│   └── vaga-02/
│       ├── curriculo.md
│       ├── curriculo.pdf
│       └── relatorio-ats.md
│
└── site/
```

Se a estrutura atual do projeto for diferente, adaptar sem destruir os arquivos existentes.

---

# 32. NOMENCLATURA DOS ARQUIVOS

Utilizar nomes previsíveis.

Exemplo:

```text
curriculo-rauan-rocha-[empresa]-[cargo].pdf
```

e:

```text
relatorio-ats-[empresa]-[cargo].md
```

Evitar caracteres especiais desnecessários.

---

# 33. MODO DE OPERAÇÃO

O sistema deverá suportar dois modos:

## MODO AUTOMÁTICO

Quando uma nova vaga for adicionada:

```text
Detectar vaga
↓
Ler vaga
↓
Analisar requisitos
↓
Ler base profissional
↓
Selecionar projetos
↓
Gerar currículo
↓
Executar ATS scoring
↓
Otimizar
↓
Gerar relatório
```

## MODO MANUAL

Permitir que o usuário selecione uma vaga específica e solicite:

```text
Gerar currículo
```

ou:

```text
Reanalisar compatibilidade
```

ou:

```text
Otimizar currículo
```

ou:

```text
Gerar relatório
```

---

# 34. HISTÓRICO DE VERSÕES

Nunca sobrescrever silenciosamente um currículo anterior.

Guardar versões.

Exemplo:

```text
v1
v2
v3
final
```

Isso permitirá entender como o currículo evoluiu.

---

# 35. PROTEÇÃO CONTRA ALUCINAÇÃO

Antes de adicionar qualquer informação ao currículo, verificar:

```text
Existe na base?
        ↓
SIM → Pode utilizar
        ↓
NÃO
        ↓
É uma inferência diretamente suportada?
        ↓
SIM → Reformular de maneira conservadora
        ↓
NÃO → Não utilizar
```

Se houver dúvida:

**não afirmar.**

---

# 36. MÉTRICAS

Quando existirem métricas reais nos arquivos:

Priorizar:

- percentual;
- quantidade;
- tempo;
- redução;
- aumento;
- volume;
- usuários;
- leads;
- projetos;
- integrações;
- clientes;
- performance;
- resultados financeiros;
- escala.

Exemplo:

> "Integração de pagamentos com Mercado Pago"

é bom.

Mas, se existir evidência real de resultado:

> "Implementou integração de pagamentos com Mercado Pago, estruturando o fluxo de checkout e processamento de transações."

é melhor.

Não inventar números.

---

# 37. IDIOMAS

Se uma vaga exigir idioma:

Verificar a informação real existente na base.

Não aumentar artificialmente o nível.

Exemplo:

```text
Português — Nativo
Inglês — [nível real]
Espanhol — [nível real]
Francês — [nível real]
```

Utilizar somente dados confirmados.

---

# 38. FORMAÇÃO

Utilizar a formação existente na base.

Dar destaque maior quando a vaga exigir explicitamente:

- Engenharia;
- Ciência da Computação;
- Sistemas de Informação;
- áreas correlatas.

Quando a formação do candidato for correlata, explicar isso de maneira objetiva, sem tentar mascarar a nomenclatura original.

---

# 39. LINKEDIN / GITHUB / PORTFÓLIO

Preservar os links profissionais existentes.

Quando a vaga valorizar:

- GitHub;
- portfolio;
- open source;
- projetos;
- software engineering;

dar maior destaque a esses links.

O site profissional deverá apontar para:

**origindev.com.br/sobre**

---

# 40. EXPERIÊNCIA PROFISSIONAL VS. PROJETOS

Não esconder experiências profissionais relevantes apenas porque são projetos.

Projetos podem ser utilizados como evidência técnica especialmente quando:

- foram desenvolvidos de ponta a ponta;
- envolveram cliente real;
- possuem usuários;
- possuem arquitetura relevante;
- possuem integrações;
- demonstram responsabilidade real;
- possuem resultado mensurável.

O objetivo é demonstrar capacidade profissional, não apenas emprego formal.

---

# 41. PRIORIZAÇÃO PARA VAGAS DE DESENVOLVIMENTO

Para vagas técnicas, dar prioridade a evidências de:

```text
Arquitetura
Desenvolvimento
APIs
Banco de dados
Integrações
Autenticação
Deploy
Cloud
Git
Testes
Performance
Segurança
Automação
Frontend
Backend
Full Stack
```

somente quando existirem na base.

---

# 42. PRIORIZAÇÃO PARA OUTROS CARGOS

Não assumir que todas as vagas serão de desenvolvimento.

Se a vaga for:

- Product;
- Project Management;
- Business;
- Operations;
- Marketing;
- Automation;
- Data;
- QA;
- Customer Success;
- outras;

recalcular completamente a estratégia de seleção de experiências.

A base de experiências deve ser reutilizável para diferentes cargos.

---

# 43. SISTEMA DE RELEVÂNCIA

Cada experiência deverá receber uma pontuação:

```text
0–30   baixa relevância
31–50  relevância moderada
51–70  boa relevância
71–85  alta relevância
86–100 excelente relevância
```

Essa pontuação é interna.

Ela deve considerar a vaga inteira e não apenas keywords.

---

# 44. RELATÓRIO FINAL PARA O USUÁRIO

O relatório deve ser objetivo e útil.

Exemplo:

```text
# Análise ATS

Cargo: Frontend Developer
Empresa: Empresa X

Compatibilidade: 91/100
Status: EXCELENTE FIT

## Pontos fortes

✓ React
✓ Next.js
✓ TypeScript
✓ APIs REST
✓ Git
✓ Desenvolvimento web

## Principais evidências

1. Projeto X
2. Projeto Y

## Gaps

⚠ AWS — não identificado
⚠ Testes automatizados — evidência limitada

## Estratégia utilizada

O currículo priorizou os projetos X e Y porque eles apresentam
maior sobreposição técnica com a vaga.

## Recomendação

Candidatura recomendada.
```

---

# 45. CRITÉRIO FINAL DE QUALIDADE

Antes de considerar um currículo pronto, verificar:

### CONTEÚDO

- [ ] Tudo é verdadeiro
- [ ] Experiências são comprováveis
- [ ] Projetos são relevantes
- [ ] Não existem informações inventadas
- [ ] Resultados não foram fabricados

### ATS

- [ ] Estrutura parseável
- [ ] Keywords críticas cobertas quando possível
- [ ] Terminologia da vaga utilizada quando verdadeira
- [ ] Skills relevantes priorizadas
- [ ] Cargo alinhado à oportunidade
- [ ] Sem keyword stuffing
- [ ] Sem texto oculto
- [ ] Sem tabelas desnecessárias
- [ ] Sem elementos gráficos essenciais

### RECRUTADOR

- [ ] O fit fica claro nos primeiros segundos
- [ ] Resumo é específico
- [ ] Projetos mais relevantes aparecem primeiro
- [ ] Bullets demonstram ação
- [ ] Competências possuem evidência
- [ ] Currículo é fácil de ler

### SCORE

- [ ] ATS >= 85 quando possível
- [ ] Se <85, gaps identificados
- [ ] Nenhuma melhoria foi obtida através de informação falsa

---

# 46. REGRA DE OURO

O sistema não deve perguntar:

> "Como posso fazer Rauan parecer compatível?"

Deve perguntar:

> "Como posso demonstrar da forma mais forte, clara, precisa e ATS-friendly que as experiências reais de Rauan atendem às necessidades desta vaga?"

Essa é a lógica central do projeto.

---

# 47. IMPLEMENTAÇÃO

Agora analise o projeto existente no Antigravity.

Antes de alterar qualquer coisa:

1. identificar a arquitetura atual;
2. localizar os arquivos de currículo;
3. localizar o arquivo de experiências;
4. localizar os arquivos de projetos;
5. localizar a implementação atual da página de currículo;
6. localizar a implementação atual da página "Sobre";
7. identificar como os arquivos são carregados;
8. identificar como o sistema atualmente gera ou exibe o currículo;
9. preservar funcionalidades existentes que não entrem em conflito com este sistema.

Não recriar o projeto inteiro desnecessariamente.

Modificar a arquitetura existente de forma incremental e organizada.

---

# 48. IMPLEMENTAÇÃO DO MOTOR DE MATCHING

Criar uma camada responsável por:

```text
JobParser
ExperienceRetriever
KeywordExtractor
RequirementClassifier
ProjectRanker
ResumeTailor
ATSScorer
GapAnalyzer
ReportGenerator
```

Responsabilidades:

### JobParser

Interpreta a vaga.

### ExperienceRetriever

Busca experiências relevantes.

### KeywordExtractor

Extrai keywords.

### RequirementClassifier

Classifica requisitos por prioridade.

### ProjectRanker

Pontua projetos.

### ResumeTailor

Gera o currículo personalizado.

### ATSScorer

Calcula a compatibilidade.

### GapAnalyzer

Identifica requisitos não comprovados.

### ReportGenerator

Gera o relatório final.

---

# 49. RETRIEVAL DA BASE PROFISSIONAL

Se o volume de experiências crescer significativamente, não depender apenas de leitura integral dos arquivos.

Implementar uma estratégia de retrieval.

A busca deverá considerar:

```text
keyword matching
+
semantic similarity
+
technology matching
+
responsibility matching
+
domain matching
```

Isso permitirá que novos projetos sejam adicionados ao arquivo sem precisar reprogramar o sistema.

---

# 50. SAÍDA ESPERADA

Para cada vaga processada, entregar:

```text
1. Currículo personalizado em Markdown
2. Currículo final em PDF
3. Relatório ATS em Markdown
4. Score de compatibilidade
5. Lista de keywords encontradas
6. Lista de gaps
7. Projetos selecionados
8. Justificativa da seleção
```

---

# 51. PRINCÍPIO DE EVOLUÇÃO

A base profissional deve ser tratada como um ativo permanente.

Quando o usuário adicionar uma nova experiência ou projeto:

```text
nova experiência
      ↓
base profissional
      ↓
disponível para futuras vagas
```

Não gerar currículos isolados sem aproveitar a base histórica.

---

# 52. OBJETIVO FINAL DO PRODUTO

Ao final, o sistema deverá funcionar como um:

**Career Intelligence + ATS Resume Tailoring System**

capaz de transformar:

```text
uma vaga genérica
```

em:

```text
uma candidatura estrategicamente personalizada.
```

A qualidade final deve ser medida não pelo quanto o currículo "parece bonito", mas pela capacidade de:

**encontrar as melhores evidências da carreira do candidato, conectá-las aos requisitos da oportunidade e apresentá-las de maneira clara, verdadeira, convincente e altamente legível por ATS.**

Prioridade máxima:

```text
VERACIDADE
>
RELEVÂNCIA
>
EVIDÊNCIA
>
ATS COMPATIBILITY
>
CLAREZA
>
ESTÉTICA
```

O sistema deve sempre otimizar nessa ordem.