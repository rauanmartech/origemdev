import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    ChevronRight,
    Target,
    Flag,
    User,
    Building,
    CreditCard,
    BadgeCheck,
} from "lucide-react";

type PhaseStatus = "concluido" | "em_andamento" | "pendente";

interface SubMark {
    title: string;
}

interface Payment {
    id: number;
    description: string;
    value: number;
    dueDate: string;
    isPaid?: boolean;
}

interface Phase {
    id: number;
    title: string;
    period: string;
    startDate?: string;
    endDate?: string;
    items: SubMark[];
    result?: string;
    status: PhaseStatus;
    isDelivery?: boolean;
    dividerBefore?: boolean;
}

const phases: Phase[] = [
    {
        id: 1,
        title: "Estruturação do Sistema",
        period: "01/03 a 05/03",
        startDate: "2026-03-01",
        endDate: "2026-03-05",
        items: [
            { title: "Criação do repositório oficial do projeto" },
            { title: "Estrutura inicial do sistema" },
            { title: "Configuração do banco de dados" },
            { title: "Organização da estrutura dos leads" },
            { title: "Definição do funil comercial" },
        ],
        result: "Base técnica pronta para desenvolvimento.",
        status: "pendente", // Default will be overwritten by logic
    },
    {
        id: 2,
        title: "Desenvolvimento do CRM",
        period: "06/03 a 12/03",
        startDate: "2026-03-06",
        endDate: "2026-03-12",
        items: [
            { title: "Tela de login" },
            { title: "Painel principal (dashboard)" },
            { title: "Listagem e organização dos leads" },
            { title: "Filtros e segmentação" },
            { title: "Mudança de status no funil" },
            { title: "Campo de observações" },
            { title: "Importação dos 2.500 leads" },
        ],
        result: "Sistema operacional internamente.",
        status: "pendente",
    },
    {
        id: 3,
        title: "Ajustes, Automação e Testes",
        period: "13/03 a 16/03",
        startDate: "2026-03-13",
        endDate: "2026-03-16",
        items: [
            { title: "Estruturação das automações básicas" },
            { title: "Ajustes de usabilidade" },
            { title: "Testes gerais" },
            { title: "Correção de eventuais falhas" },
        ],
        result: "Entrega do Sistema CRM funcionando – 16/03",
        status: "pendente",
        isDelivery: true,
    },
    {
        id: 4,
        title: "Planejamento e Estrutura (Landing Page)",
        period: "17/03 a 20/03",
        startDate: "2026-03-17",
        endDate: "2026-03-20",
        items: [
            { title: "Definição da estrutura da página" },
            { title: "Organização das seções" },
            { title: "Estrutura visual" },
        ],
        status: "pendente",
        dividerBefore: true,
    },
    {
        id: 5,
        title: "Desenvolvimento e Integração",
        period: "21/03 a 26/03",
        startDate: "2026-03-21",
        endDate: "2026-03-26",
        items: [
            { title: "Programação da landing page" },
            { title: "Integração com o CRM" },
            { title: "Testes de envio de leads" },
            { title: "Publicação final" },
        ],
        result: "Entrega da Landing Page publicada – 26/03",
        status: "pendente",
        isDelivery: true,
    },
    {
        id: 6,
        title: "Finalização",
        period: "Pós 26/03",
        startDate: "2026-03-27",
        endDate: "2026-04-30",
        items: [
            { title: "Reunião de onboarding" },
            { title: "Entrega de acessos administrativos" },
            { title: "Início da garantia técnica de 30 dias" },
        ],
        status: "pendente",
    },
];

const payments: Payment[] = [
    {
        id: 1,
        description: "Primeira Parcela",
        value: 900,
        dueDate: "2026-03-01T12:00:00",
        isPaid: true,
    },
    {
        id: 2,
        description: "Segunda Parcela",
        value: 600,
        dueDate: "2026-04-01T12:00:00",
        isPaid: false,
    },
    {
        id: 3,
        description: "Terceira Parcela",
        value: 600,
        dueDate: "2026-05-01T12:00:00",
        isPaid: false,
    },
];

const getDynamicStatus = (startDate: string, endDate: string): PhaseStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    if (today < start) {
        return "pendente";
    } else if (today >= start && today <= end) {
        return "em_andamento";
    } else {
        return "concluido";
    }
};

const StatusIcon = ({ status }: { status: PhaseStatus }) => {
    if (status === "concluido") {
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === "em_andamento") {
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
    return <Circle className="w-5 h-5 text-zinc-400" />;
};

const ProjectTimelineNEF: React.FC = () => {
    const [currentDateString, setCurrentDateString] = useState("");
    const [dynamicPhases, setDynamicPhases] = useState<Phase[]>(phases);
    const [dynamicPayments, setDynamicPayments] = useState<Payment[]>(payments);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDateString(today.toLocaleDateString('pt-BR', options));

        const updatedPhases = phases.map(phase => ({
            ...phase,
            status: getDynamicStatus(phase.startDate as string, phase.endDate as string)
        }));
        setDynamicPhases(updatedPhases);

        const updatedPayments = payments.map(pay => ({
            ...pay,
            status: pay.isPaid ? "Quitado" : "Pendente"
        }));
        setDynamicPayments(updatedPayments as any);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative font-sans pt-24 pb-32">
            {/* Global Parallax Background Blobs & Clouds from Design System */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="clay-blob w-[500px] h-[500px] top-[10%] -left-[10%] animate-float-slow opacity-60" />
                <div className="clay-blob w-[400px] h-[400px] top-[40%] -right-[5%] animate-float-medium opacity-40 hidden md:block" />
                <div className="clay-blob w-[300px] h-[300px] bottom-[20%] left-[20%] animate-float-fast opacity-50" />

                {/* 3D Meta-Clouds styling consistent with Index.tsx */}
                <div className="absolute top-[20%] right-[15%] w-64 h-48 pointer-events-none hidden md:block">
                    <div className="clay-cloud w-32 h-32 top-0 left-0 animate-float-medium" />
                    <div className="clay-cloud w-24 h-24 top-8 left-16 animate-float-slow" style={{ animationDelay: "2s" }} />
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col gap-16 relative z-10 px-4 md:px-8">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="clay-card p-8 md:p-12 border border-primary/10 flex flex-col gap-8 md:flex-row md:items-end justify-between z-20"
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="clay-badge self-start uppercase tracking-widest text-xs">
                                Acompanhamento de Projeto
                            </span>
                            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground flex items-center gap-3 mt-2">
                                <Target className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]" />
                                Cronograma de Execução
                            </h1>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 md:gap-12 mt-4">
                            <div className="flex items-center gap-4">
                                <div className="clay-icon w-12 h-12">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                                        Cliente
                                    </span>
                                    <span className="text-base font-semibold text-foreground">
                                        Rodrigo Campelo
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="clay-icon w-12 h-12">
                                    <Building className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                                        Empresa
                                    </span>
                                    <span className="text-base font-semibold text-foreground">
                                        NEF Seguros e Serviços LTDA
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center gap-2 text-sm text-foreground bg-card px-5 py-2.5 rounded-2xl shadow-[var(--clay-shadow-sm)] border border-primary/10">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Início:</span>
                                <span className="font-semibold">01 de março</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground bg-card px-5 py-2.5 rounded-2xl shadow-[var(--clay-shadow-sm)] border border-primary/10">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-muted-foreground">Prazo total:</span>
                                <span className="font-semibold">25 dias corridos</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground bg-primary/10 px-5 py-2.5 rounded-2xl shadow-[var(--clay-shadow-sm)] border border-primary/20">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-primary font-medium">Hoje é:</span>
                                <span className="font-semibold text-primary capitalize">{currentDateString}</span>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Timeline Visual System */}
                <div className="relative flex flex-col items-center py-8 w-full">
                    {/* Linha Contínua Central */}
                    <div className="absolute bg-border w-[4px] h-[calc(100%-2rem)] left-8 md:left-1/2 md:-translate-x-1/2 top-4 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none z-0" />

                    {dynamicPhases.map((phase, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <React.Fragment key={phase.id}>
                                {phase.dividerBefore && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="w-full max-w-lg my-12 md:my-16 flex items-center justify-center gap-4 z-10 relative"
                                    >
                                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                                        <span className="clay-badge whitespace-nowrap px-6 py-2 border border-primary/20 bg-background/80 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest">
                                            Transição de Plataforma (LP)
                                        </span>
                                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className={`relative w-full flex flex-col md:flex-row md:w-1/2 ${isEven ? "md:self-start md:pr-12 lg:pr-16" : "md:self-end md:pl-12 lg:pl-16 md:flex-row-reverse"
                                        } pl-20 pr-4 md:px-0 mb-16 md:mb-24 last:mb-0`}
                                >
                                    {/* Ícone Indicador Desktop & Mobile */}
                                    <div className={`absolute top-6 left-[10px] md:top-1/2 md:-translate-y-1/2 ${isEven ? "md:left-auto md:-right-[26px]" : "md:-left-[26px]"
                                        } flex flex-col items-center justify-center bg-background rounded-full p-1.5 z-20 shadow-sm border border-border`}>
                                        <div
                                            className={`flex items-center justify-center w-10 h-10 rounded-full border-[3px] ${phase.status === "concluido"
                                                ? "border-green-500 bg-green-500/10"
                                                : phase.status === "em_andamento"
                                                    ? "border-yellow-500 bg-yellow-500/10"
                                                    : "border-zinc-300 bg-zinc-50"
                                                } shadow-[var(--clay-shadow-sm)] transition-colors duration-500`}
                                        >
                                            <StatusIcon status={phase.status} />
                                        </div>
                                    </div>

                                    {/* Linha de Conexão Horizontal Desktop */}
                                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[4px] bg-border z-10 ${isEven ? "right-0 w-12 lg:w-16" : "left-0 w-12 lg:w-16"
                                        } shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none`} />

                                    {/* Linha de Conexão Horizontal Mobile */}
                                    <div className="md:hidden absolute top-[44px] left-[34px] w-[46px] h-[4px] bg-border z-10 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none" />

                                    {/* Card de Conteúdo */}
                                    <div className={`clay-card relative z-30 p-6 md:p-8 w-full border border-primary/5 transition-all duration-300 hover:-translate-y-2 ${phase.status === "concluido" ? "opacity-95" : ""
                                        }`}>
                                        <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5">
                                            <span className="font-display text-8xl font-black">{phase.id}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
                                            <span className="clay-badge bg-primary/10 text-primary border border-primary/20 shadow-none text-sm font-semibold">
                                                {phase.period}
                                            </span>
                                            {phase.status === "concluido" && (
                                                <span className="clay-badge bg-green-500/10 text-green-600 border border-green-500/30 font-bold">
                                                    Concluído
                                                </span>
                                            )}
                                            {phase.status === "em_andamento" && (
                                                <span className="clay-badge bg-yellow-500/10 text-yellow-600 border border-yellow-500/30 font-bold">
                                                    Em andamento
                                                </span>
                                            )}
                                            {phase.status === "pendente" && (
                                                <span className="clay-badge bg-zinc-100 text-zinc-500 border border-zinc-200 font-bold shadow-none">
                                                    Pendente
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-display text-2xl font-bold text-foreground mb-6 leading-tight relative z-10">
                                            {phase.title}
                                        </h3>

                                        <ul className="flex flex-col gap-4 mb-8 flex-1 relative z-10">
                                            {phase.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-2">
                                                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)] bg-primary/50`} />
                                                    </div>
                                                    <span className="text-base text-muted-foreground leading-relaxed font-medium">
                                                        {item.title}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {phase.result && (
                                            <div
                                                className={`mt-auto p-5 rounded-2xl text-sm border relative z-10 ${phase.isDelivery
                                                    ? "bg-primary text-primary-foreground shadow-[var(--clay-shadow-primary)] border-transparent flex items-center gap-4 transform hover:scale-[1.02] transition-transform"
                                                    : "bg-card shadow-[var(--clay-shadow-inset)] text-foreground flex items-start gap-4 border-primary/10"
                                                    }`}
                                            >
                                                {phase.isDelivery ? (
                                                    <Flag className="w-6 h-6 flex-shrink-0 text-primary-foreground/90" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                                                )}
                                                <span className={`text-base ${phase.isDelivery ? "font-bold tracking-wide" : "font-semibold text-muted-foreground"}`}>
                                                    {phase.result}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Bloco de Pagamentos */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <div className="clay-card p-8 md:p-12 border border-primary/10">
                        <div className="flex flex-row items-center gap-5 mb-10">
                            <div className="clay-icon w-14 h-14 flex-shrink-0">
                                <CreditCard className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-display text-xl md:text-3xl font-bold text-foreground leading-[1.1] md:leading-tight">
                                    <span className="block sm:inline">Fluxo</span>
                                    <span className="block sm:inline sm:ml-2">Financeiro</span>
                                </h2>
                                <p className="text-muted-foreground font-medium text-[11px] md:text-base leading-tight mt-1">Cronograma de parcelas e status</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {dynamicPayments.map((pay) => {
                                const status = (pay as any).status;
                                const isQuitado = status === "Quitado";

                                return (
                                    <div
                                        key={pay.id}
                                        className={`glass-card p-6 rounded-[2rem] border transition-all duration-300 ${isQuitado
                                            ? "bg-green-50/30 border-green-100"
                                            : "bg-white border-primary/5"
                                            } shadow-[var(--clay-shadow-sm)]`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground opacity-60">
                                                Parcela 0{pay.id}
                                            </span>
                                            {isQuitado ? (
                                                <BadgeCheck className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <Clock className="w-6 h-6 text-zinc-300" />
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-zinc-400 mb-1 uppercase tracking-tight">{pay.description}</h4>
                                            <p className="text-3xl font-display font-black text-foreground">
                                                R$ {pay.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-muted-foreground">Vencimento:</span>
                                                <span className="text-sm font-bold text-foreground">
                                                    {new Date(pay.dueDate).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                                <span className="text-sm font-medium text-muted-foreground">Status:</span>
                                                <span className={`text-sm font-black px-3 py-1 rounded-full ${isQuitado
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-zinc-100 text-zinc-500"
                                                    }`}>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default ProjectTimelineNEF;
