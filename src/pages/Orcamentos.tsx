import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
    Rocket,
    Building2,
    ShoppingCart,
    Layers,
    Smartphone,
    CheckCircle2,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    Instagram,
    Mail,
    Phone,
    MessageSquare,
    CalendarCheck
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
    {
        title: "Landing Page",
        price: "1.500",
        description: "Perfeita para campanhas específicas, lançamentos de produtos ou captura de leads. Uma página focada em conversão com design atrativo e mensagem direta que guia o visitante a uma ação específica.",
        icon: Rocket,
        included: [
            "Design responsivo (mobile e desktop)",
            "Formulário de captura de leads",
            "Otimização para conversão",
            "Integração com ferramentas de marketing",
            "Seção de depoimentos",
            "Call-to-actions estratégicos"
        ],
        color: "bg-blue-500/10",
        iconColor: "text-blue-500"
    },
    {
        title: "Combo 3 Landing Pages",
        price: "3.000",
        originalPrice: "4.500",
        description: "A solução ideal para múltiplos negócios ou campanhas variadas. Leve 3 landing pages profissionais e economize R$ 1.500 no seu projeto. Ideal para validação de nichos.",
        icon: Rocket,
        included: [
            "3 Landing Pages Completas",
            "Design Premium Responsivo",
            "Otimização de Conversão para todas",
            "Integração de Leads Centralizada",
            "Suporte prioritário na implementação",
            "Tudo que o pacote individual oferece x3"
        ],
        color: "bg-indigo-500/10",
        iconColor: "text-indigo-500"
    },
    {
        title: "Combo 5 Landing Pages",
        price: "4.500",
        originalPrice: "7.500",
        description: "O pacote definitivo para quem quer escala máxima. 5 landing pages de alta conversão por um valor imbatível. Economia real de R$ 3.000 para dominar seu mercado.",
        icon: Rocket,
        isPopular: true,
        included: [
            "5 Landing Pages de Alta Conversão",
            "Estratégia Cross-Page otimizada",
            "Design Exclusivo para cada página",
            "Consultoria de Funil de Vendas",
            "Velocidade de entrega otimizada",
            "Pacote completo com 40% de desconto"
        ],
        color: "bg-violet-500/10",
        iconColor: "text-violet-500"
    },
    {
        title: "Sistema de Agendamento Online",
        price: "800",
        description: "Organize seus atendimentos, facilite o agendamento para seus clientes e reduza o tempo gasto com mensagens e confirmações. Ideal para barbearias, clínicas e negócios que trabalham com horários marcados.",
        icon: CalendarCheck,
        included: [
            "Página ou módulo de agendamento personalizado",
            "Agendamento online 24h",
            "Organização automática de horários",
            "Integração com WhatsApp",
            "Confirmação de agendamento para o cliente",
            "Redução de faltas e retrabalho manual",
            "Interface simples e profissional para o usuário"
        ],
        color: "bg-cyan-500/10",
        iconColor: "text-cyan-500"
    },
    {
        title: "Site Institucional",
        price: "3.000",
        description: "Apresente sua empresa de forma profissional e conquiste a confiança do seu público. Ideal para empresas que precisam estabelecer presença digital sólida e transmitir credibilidade.",
        icon: Building2,
        included: [
            "Até 6 páginas personalizadas",
            "Sobre, Serviços, Portfólio e Contato",
            "Sistema de gerenciamento de conteúdo",
            "Otimização para buscadores (SEO básico)",
            "Integração com redes sociais",
            "Formulário de contato avançado",
            "Google Analytics configurado"
        ],
        color: "bg-purple-500/10",
        iconColor: "text-purple-500"
    },
    {
        title: "E-commerce",
        price: "4.000",
        specialNote: "Condições especiais para projetos acima de R$ 8.000: parcelamento estendido e opções sob medida para o seu negócio.",
        description: "Venda online 24/7 com uma loja virtual completa e segura. Solução ideal para quem quer expandir suas vendas para o digital com sistema de pagamento integrado e gestão de produtos eficiente.",
        icon: ShoppingCart,
        included: [
            "Catálogo de produtos ilimitado",
            "Carrinho de compras completo",
            "Integração com gateways de pagamento",
            "Sistema de gestão de pedidos",
            "Cálculo automático de frete",
            "Painel administrativo completo",
            "Sistema de cupons de desconto",
            "Certificado SSL incluído"
        ],
        color: "bg-emerald-500/10",
        iconColor: "text-emerald-500"
    },
    {
        title: "SaaS (Software as a Service)",
        price: "15.000",
        specialNote: "Projetos de maior investimento contam com condições especiais de pagamento e planejamento faseado da entrega.",
        description: "Transforme sua ideia em um software online escalável. Perfeito para negócios que precisam de plataformas web complexas, sistemas de gestão personalizados ou ferramentas específicas para seu nicho de mercado.",
        icon: Layers,
        included: [
            "Arquitetura de software escalável",
            "Sistema de autenticação e usuários",
            "Dashboard administrativo completo",
            "API REST para integrações",
            "Banco de dados otimizado",
            "Sistema de assinaturas/planos",
            "Relatórios e analytics personalizados",
            "Documentação técnica completa"
        ],
        color: "bg-orange-500/10",
        iconColor: "text-orange-500"
    },
    {
        title: "Aplicativo Mobile",
        price: "20.000",
        specialNote: "Para apps acima de R$ 40.000, fale comigo para condições diferenciadas, cronograma flexível e acompanhamento próximo do projeto.",
        description: "Leve seu negócio para o bolso dos seus clientes. Aplicativo nativo ou híbrido para iOS e Android, oferecendo experiência mobile completa e engajamento direto com seu público.",
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
            "Suporte pós-lançamento"
        ],
        color: "bg-rose-500/10",
        iconColor: "text-rose-500"
    }
];

const ServiceCard = ({ service, index, onWhatsApp }: { service: any, index: number, onWhatsApp: (t: string) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const Icon = service.icon;
    const hasDiscount = service.originalPrice && service.price;
    const savings = hasDiscount ? (parseFloat(service.originalPrice.replace('.', '')) - parseFloat(service.price.replace('.', ''))) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`clay-card p-6 md:p-8 flex flex-col h-full group transition-all duration-300 relative ${service.isPopular ? 'border-primary/30 ring-2 ring-primary/20' : ''}`}
        >
            {service.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider z-20 shadow-lg shadow-primary/20">
                    Sugerido / Melhor Valor
                </div>
            )}

            <div className="flex items-center gap-4 mb-4 md:mb-6 md:block">
                <div className={`clay-icon shrink-0 w-12 h-12 md:w-16 md:h-16 ${service.color} mb-0 md:mb-6`}>
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${service.iconColor}`} />
                </div>
                <div>
                    <h3 className="font-display text-lg md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                    </h3>
                    <div className="flex flex-col md:hidden">
                        {hasDiscount && (
                            <span className="text-muted-foreground text-[10px] line-through">De R$ {service.originalPrice}</span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-muted-foreground text-[10px]">A partir de</span>
                            <span className="text-lg font-bold text-primary text-nowrap">R$ {service.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex flex-col mb-6">
                {hasDiscount && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-muted-foreground text-sm line-through">De R$ {service.originalPrice}</span>
                        <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Economize R$ {savings.toLocaleString('pt-BR')}
                        </span>
                    </div>
                )}
                <div className="flex items-baseline gap-1">
                    <span className="text-muted-foreground text-sm">A partir de</span>
                    <span className="text-3xl font-bold text-primary">R$ {service.price}</span>
                </div>
            </div>

            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4 md:mb-8 flex-1">
                {service.description}
            </p>

            {service.specialNote && (
                <div className="bg-primary/5 rounded-2xl p-3 md:p-4 mb-4 md:mb-8 border border-primary/10">
                    <p className="text-[10px] md:text-xs text-primary font-medium italic">
                        {service.specialNote}
                    </p>
                </div>
            )}

            {/* Expandable Details for Mobile & Desktop */}
            <div className="mb-4 md:mb-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-xs md:text-sm font-semibold text-foreground hover:text-primary transition-colors mb-2"
                >
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-primary" />
                    </div>
                    Detalhes do serviço
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3 pt-2 pb-4">
                                <p className="text-[10px] md:text-sm font-semibold text-foreground flex items-center gap-2">
                                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                                    O que está incluído:
                                </p>
                                <ul className="space-y-1.5 md:space-y-2">
                                    {service.included.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-[10px] md:text-sm text-muted-foreground">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button
                onClick={() => onWhatsApp(service.title)}
                className="clay-btn w-full flex items-center justify-center gap-2 group/btn text-xs md:text-base py-3 md:py-4 mt-auto"
            >
                Quero Esse Modelo
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};

const Orcamentos = () => {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, 500]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
    const phoneNumber = "5571983789492";

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.children[0]?.clientWidth || 0;
            const gap = 16; // gap-4 is 1rem = 16px

            // Calculate index based on scroll position + half card width to find center
            const index = Math.round(scrollLeft / (cardWidth + gap));
            setActiveIndex(index);
        }
    };

    const handleWhatsApp = (serviceTitle: string) => {
        const text = `Olá! Gostaria de solicitar um orçamento para: ${serviceTitle}`;
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-background overflow-x-hidden relative">
            <Navbar />

            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div style={{ y: y1 }} className="clay-blob w-[500px] h-[500px] top-[10%] -left-[10%] animate-float-slow opacity-60" />
                <motion.div style={{ y: y2 }} className="clay-blob w-[400px] h-[400px] top-[40%] -right-[5%] animate-float-medium opacity-40 hidden md:block" />
            </div>

            <main className="relative z-10 pt-24 md:pt-32 pb-24 px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="clay-badge text-[10px] md:text-sm mb-4 inline-block">Investimento & Valor</span>
                        <h1 className="font-display text-3xl md:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
                            Orçamentos sob <span className="text-primary">medida</span>
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Transforme sua visão em realidade com soluções digitais de alto impacto.
                            Escolha a base ideal para o seu projeto e vamos construir juntos.
                        </p>
                    </motion.div>
                </div>

                {/* Pricing Grid / Slider */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="
                        flex overflow-x-auto snap-x snap-mandatory items-stretch
                        gap-4 py-10 -mx-4 px-8
                        md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:py-0 md:mx-auto md:px-0 md:mb-24 md:overflow-visible
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
                    "
                >
                    {services.map((service, index) => (
                        <div key={index} className="min-w-[85vw] md:min-w-0 snap-center flex flex-col h-full">
                            <ServiceCard
                                service={service}
                                index={index}
                                onWhatsApp={handleWhatsApp}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Navigation & Dots */}
                <div className="flex items-center justify-center gap-6 md:hidden mb-16 px-4">
                    <button
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                const container = scrollContainerRef.current;
                                const cardWidth = container.children[0]?.clientWidth || 0;
                                const gap = 16;
                                const newIndex = Math.max(0, activeIndex - 1);
                                container.scrollTo({ left: newIndex * (cardWidth + gap), behavior: 'smooth' });
                            }
                        }}
                        disabled={activeIndex === 0}
                        className={`
                            p-2 rounded-full border transition-all duration-300
                            ${activeIndex === 0
                                ? 'border-primary/10 text-primary/20 cursor-not-allowed'
                                : 'border-primary/20 text-primary hover:bg-primary/5 active:scale-95 cursor-pointer'}
                        `}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex justify-center gap-2">
                        {services.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (scrollContainerRef.current) {
                                        const container = scrollContainerRef.current;
                                        const cardWidth = container.children[0]?.clientWidth || 0;
                                        const gap = 16;
                                        container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
                                    }
                                }}
                                className={`
                                    h-2 rounded-full transition-all duration-300
                                    ${index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-primary/20 hover:bg-primary/40'}
                                `}
                                aria-label={`Ir para slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                const container = scrollContainerRef.current;
                                const cardWidth = container.children[0]?.clientWidth || 0;
                                const gap = 16;
                                const newIndex = Math.min(services.length - 1, activeIndex + 1);
                                container.scrollTo({ left: newIndex * (cardWidth + gap), behavior: 'smooth' });
                            }
                        }}
                        disabled={activeIndex === services.length - 1}
                        className={`
                            p-2 rounded-full border transition-all duration-300
                            ${activeIndex === services.length - 1
                                ? 'border-primary/10 text-primary/20 cursor-not-allowed'
                                : 'border-primary/20 text-primary hover:bg-primary/5 active:scale-95 cursor-pointer'}
                        `}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Contact Summary Card */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="clay-card p-6 md:p-12 relative overflow-visible"
                    >
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                                    Ainda tem <span className="text-primary">dúvidas?</span>
                                </h2>
                                <p className="text-muted-foreground text-sm md:text-base mb-8">
                                    Se o seu projeto não se encaixa exatamente nestas categorias, não se preocupe.
                                    Entre em contato e criaremos uma proposta personalizada para você.
                                </p>
                                <div className="space-y-4">
                                    <a href={`https://wa.me/${phoneNumber}`} target="_blank" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group">
                                        <div className="clay-icon w-10 h-10 md:w-12 md:h-12 bg-green-500/10 group-hover:scale-110 transition-transform">
                                            <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">WhatsApp</p>
                                            <p className="font-semibold text-sm md:text-base">(71) 98378-9492</p>
                                        </div>
                                    </a>
                                    <a href="https://instagram.com/dev.rauan" target="_blank" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group">
                                        <div className="clay-icon w-10 h-10 md:w-12 md:h-12 bg-rose-500/10 group-hover:scale-110 transition-transform">
                                            <Instagram className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">Instagram</p>
                                            <p className="font-semibold text-sm md:text-base">@dev.rauan</p>
                                        </div>
                                    </a>
                                    <a href="mailto:rauanrocha.martech@gmail.com" className="flex items-center gap-4 text-foreground hover:text-primary transition-colors group">
                                        <div className="clay-icon w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 group-hover:scale-110 transition-transform">
                                            <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground">E-mail</p>
                                            <p className="font-semibold text-[11px] md:text-sm">rauanrocha.martech@gmail.com</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="clay-card bg-primary/5 p-6 md:p-8 border border-primary/10 rounded-[1.5rem] md:rounded-[2.5rem] relative z-10">
                                    <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-primary mb-4 md:mb-6 animate-float-medium" />
                                    <blockquote className="text-sm md:text-lg italic text-foreground leading-relaxed mb-4 md:mb-6">
                                        "O design não é apenas o que parece e o que se sente. O design é como funciona."
                                    </blockquote>
                                    <cite className="text-primary text-xs md:text-base font-bold not-italic">— Steve Jobs</cite>
                                </div>
                                {/* Decorative bubbles */}
                                <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-10 h-10 md:w-12 md:h-12 clay-blob bg-primary/20 animate-float-slow" />
                                <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 clay-blob bg-primary/30 animate-float-fast" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Orcamentos;
