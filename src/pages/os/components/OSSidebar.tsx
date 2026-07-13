import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import logoParceria from '@/assets/icone_parceria.png';
import {
  LayoutDashboard,
  CalendarDays,
  Search,
  MessageSquare,
  Hammer,
  Building2,
  Megaphone,
  DollarSign,
  CheckSquare,
  FileText,
  Target,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';

interface OSSidebarProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  onToggle: () => void;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/os/dashboard' },
  { label: 'Planejar', icon: CalendarDays, path: '/os/planejar' },
  { label: 'Prospectar', icon: Search, path: '/os/prospectar' },
  { label: 'Follow Up', icon: MessageSquare, path: '/os/followup' },
  { label: 'Produzir', icon: Hammer, path: '/os/produzir' },
  { label: 'Construir', icon: Building2, path: '/os/construir' },
  { label: 'Autoridade', icon: Megaphone, path: '/os/autoridade' },
  { label: 'Financeiro', icon: DollarSign, path: '/os/financeiro' },
  { label: 'Fechamento', icon: CheckSquare, path: '/os/fechamento' },
  { label: 'Anotações', icon: FileText, path: '/os/anotacoes' },
  { label: 'Metas', icon: Target, path: '/os/metas' },
];

const OSSidebar: React.FC<OSSidebarProps> = ({ open, onClose, userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sessão encerrada');
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed lg:relative inset-y-0 left-0 z-40
        flex flex-col flex-shrink-0
        w-64 h-full
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{ background: '#161616', borderRight: '1px solid #2a2a2a' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 flex-shrink-0" style={{ borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <img src={logoParceria} alt="Origem" className="w-full h-full object-contain opacity-80" />
            <div className="absolute inset-0 bg-[hsl(25,95%,53%)] mix-blend-color pointer-events-none" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">ORIGIN OS</p>
            <p style={{ color: '#666' }} className="text-[10px] font-medium uppercase tracking-wider">Sistema Operacional</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <X size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: '#444' }}>
          Módulos
        </p>
        {navItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, hsl(25 95% 53% / 0.2), hsl(25 95% 53% / 0.05))',
                    borderLeft: '2px solid hsl(25 95% 53%)',
                    paddingLeft: '10px',
                  }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: isActive ? 'hsl(25 95% 53%)' : undefined }}
                />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={12} style={{ color: 'hsl(25 95% 53%)' }} className="opacity-60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="flex-shrink-0 px-3 py-4" style={{ borderTop: '1px solid #2a2a2a' }}>
        <div className="px-3 py-2.5 rounded-xl mb-2" style={{ background: '#1e1e1e' }}>
          <p className="text-white text-xs font-semibold truncate">{userEmail}</p>
          <p className="text-[10px] mt-0.5" style={{ color: '#555' }}>Administrador</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={15} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default OSSidebar;
