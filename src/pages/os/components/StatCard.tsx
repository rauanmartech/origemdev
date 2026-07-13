import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  suffix?: string;
  trend?: { value: number; label: string };
  loading?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color = 'hsl(25 95% 53%)',
  bgColor = 'hsl(25 95% 53% / 0.1)',
  suffix,
  trend,
  loading = false,
  delay = 0,
}) => {
  if (loading) {
    return (
      <div
        className="rounded-2xl p-5 animate-pulse"
        style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
      >
        <div className="h-4 w-24 rounded mb-4" style={{ background: '#2a2a2a' }} />
        <div className="h-8 w-16 rounded" style={{ background: '#2a2a2a' }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-default"
      style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bgColor }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-lg"
            style={{
              background: trend.value >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: trend.value >= 0 ? '#22c55e' : '#ef4444',
            }}
          >
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white leading-none mb-1">
        {value}
        {suffix && <span className="text-lg font-medium ml-1" style={{ color: '#555' }}>{suffix}</span>}
      </p>
      <p className="text-sm font-medium" style={{ color: '#666' }}>{label}</p>
    </motion.div>
  );
};

export default StatCard;
