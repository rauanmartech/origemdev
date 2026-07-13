import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Wallet, Clock } from 'lucide-react';
import type { Goal } from '@/types/origin-os';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GoalProgressCardProps {
  goal: Goal;
  currentRevenue: number;
}

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, currentRevenue }) => {
  const percent = goal.target_value > 0
    ? Math.min(Math.round((currentRevenue / goal.target_value) * 100), 100)
    : 0;

  const remaining = Math.max(goal.target_value - currentRevenue, 0);

  const investedPercent = goal.target_value > 0
    ? Math.min(Math.round((goal.invested_value / goal.target_value) * 100), 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 col-span-full"
      style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #1a1a1a 100%)',
        border: '1px solid #2a2a2a',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'hsl(25 95% 53% / 0.15)' }}
          >
            <Target size={22} style={{ color: 'hsl(25 95% 53%)' }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: '#666' }}>
              Meta do Mês
            </p>
            <h3 className="text-xl font-bold text-white">{goal.name}</h3>
            {goal.description && (
              <p className="text-sm mt-0.5" style={{ color: '#666' }}>{goal.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: '#555' }} />
          <span className="text-xs" style={{ color: '#555' }}>
            Até {format(new Date(goal.end_date), 'dd MMM yyyy', { locale: ptBR })}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Alvo', value: fmt(goal.target_value), color: '#888' },
          { label: 'Receita', value: fmt(currentRevenue), color: '#22c55e' },
          { label: 'Restante', value: fmt(remaining), color: '#f97316' },
          { label: 'Investido', value: fmt(goal.invested_value), color: '#818cf8' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: '#252525' }}>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: '#555' }}>{label}</p>
            <p className="text-base font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={13} style={{ color: '#22c55e' }} />
              <span className="text-xs font-semibold text-white">Receita</span>
            </div>
            <span className="text-sm font-bold" style={{ color: 'hsl(25 95% 53%)' }}>{percent}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#2a2a2a' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, hsl(25 95% 53%), hsl(18 90% 65%))',
                boxShadow: '0 0 12px hsl(25 95% 53% / 0.5)',
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Wallet size={13} style={{ color: '#818cf8' }} />
              <span className="text-xs font-semibold text-white">Investimento</span>
            </div>
            <span className="text-sm font-bold" style={{ color: '#818cf8' }}>{investedPercent}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#2a2a2a' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${investedPercent}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                boxShadow: '0 0 12px rgba(99,102,241,0.4)',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalProgressCard;
