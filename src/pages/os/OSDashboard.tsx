import React from 'react';
import { useOSContext } from './components/OSLayout';
import { useDashboardData } from '@/hooks/origin-os/useDashboard';
import GoalProgressCard from './components/GoalProgressCard';
import StatCard from './components/StatCard';
import {
  TrendingUp, Wallet, Landmark, Search, MessageSquare,
  Users, FileText, CheckCircle, Percent, Video,
  Loader2, RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, FunnelChart, Funnel,
  LabelList, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_KEY } from '@/hooks/origin-os/useDashboard';

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const CHART_COLORS = {
  revenue: 'hsl(25 95% 53%)',
  invested: '#818cf8',
  prospections: '#22c55e',
  patrimony: '#f59e0b',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {typeof p.value === 'number' && p.value > 100
            ? p.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : p.value}
        </p>
      ))}
    </div>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>
    {children}
  </h2>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-2xl p-5"
    style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
  >
    <p className="text-sm font-semibold text-white mb-4">{title}</p>
    {children}
  </motion.div>
);

const OSDashboard: React.FC = () => {
  const { userId } = useOSContext();
  const { data, isLoading, error, refetch } = useDashboardData(userId);
  const qc = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
          <p className="text-sm" style={{ color: '#555' }}>Carregando dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <p className="text-white font-semibold">Erro ao carregar dados</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 mx-auto text-sm px-4 py-2 rounded-xl transition-colors hover:bg-white/10"
            style={{ color: 'hsl(25 95% 53%)' }}
          >
            <RefreshCw size={14} /> Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const { kpis, activeGoal, revenueChart, investedChart, prospectionsChart, funnel } = data!;

  const kpiCards = [
    { label: 'Receita do Mês', value: fmt(kpis.revenue), icon: TrendingUp, color: '#22c55e', bgColor: 'rgba(34,197,94,0.1)' },
    { label: 'Investido', value: fmt(kpis.invested), icon: Wallet, color: '#818cf8', bgColor: 'rgba(129,140,248,0.1)' },
    { label: 'Patrimônio', value: fmt(kpis.patrimony), icon: Landmark, color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
    { label: 'Prospecções', value: kpis.prospections, icon: Search, color: 'hsl(25 95% 53%)', bgColor: 'hsl(25 95% 53% / 0.1)' },
    { label: 'Respostas', value: kpis.responses, icon: MessageSquare, color: '#06b6d4', bgColor: 'rgba(6,182,212,0.1)' },
    { label: 'Reuniões', value: kpis.meetings, icon: Users, color: '#a78bfa', bgColor: 'rgba(167,139,250,0.1)' },
    { label: 'Propostas', value: kpis.proposals, icon: FileText, color: '#fb923c', bgColor: 'rgba(251,146,60,0.1)' },
    { label: 'Projetos Fechados', value: kpis.closings, icon: CheckCircle, color: '#34d399', bgColor: 'rgba(52,211,153,0.1)' },
    { label: 'Conversão', value: kpis.conversion, icon: Percent, color: '#f472b6', bgColor: 'rgba(244,114,182,0.1)', suffix: '%' },
    { label: 'Conteúdos Publicados', value: kpis.publishedContent, icon: Video, color: '#64748b', bgColor: 'rgba(100,116,139,0.1)' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555' }}>
            {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: [DASHBOARD_KEY] })}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-colors hover:bg-white/5"
          style={{ color: '#555', border: '1px solid #2a2a2a' }}
        >
          <RefreshCw size={12} /> Atualizar
        </button>
      </div>

      {/* Goal Card */}
      {activeGoal ? (
        <section>
          <SectionTitle>Meta Ativa</SectionTitle>
          <GoalProgressCard goal={activeGoal} currentRevenue={kpis.revenue} />
        </section>
      ) : (
        <div
          className="rounded-2xl p-6 text-center border-dashed"
          style={{ border: '2px dashed #2a2a2a' }}
        >
          <p className="text-sm" style={{ color: '#555' }}>
            Nenhuma meta ativa.{' '}
            <a href="/os/metas" className="underline" style={{ color: 'hsl(25 95% 53%)' }}>
              Criar meta
            </a>
          </p>
        </div>
      )}

      {/* KPIs */}
      <section>
        <SectionTitle>KPIs do Mês</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiCards.map((card, i) => (
            <StatCard key={card.label} {...card} delay={i * 0.04} />
          ))}
        </div>
      </section>

      {/* Charts row 1 */}
      <section>
        <SectionTitle>Gráficos</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Revenue */}
          <ChartCard title="Receita Diária" delay={0.1}>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v.slice(5)} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={CHART_COLORS.revenue} fill="url(#rev)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Invested */}
          <ChartCard title="Investimento Diário" delay={0.15}>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={investedChart}>
                <defs>
                  <linearGradient id="inv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.invested} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.invested} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v.slice(5)} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke={CHART_COLORS.invested} fill="url(#inv)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Prospections */}
          <ChartCard title="Prospecções por Dia" delay={0.2}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={prospectionsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v.slice(5)} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={CHART_COLORS.prospections} radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Funnel */}
          <ChartCard title="Funil de Conversão" delay={0.25}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={funnel} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 11 }} tickLine={false} axisLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={20}>
                  {funnel.map((_entry, index) => (
                    <Cell key={index} fill={`hsl(${25 + index * 8} 80% ${53 - index * 6}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
    </div>
  );
};

export default OSDashboard;
