import React, { useMemo } from 'react';
import { useOSContext } from './components/OSLayout';
import { useCompaniesToday, useUpdateCompanyStatus, useMarkAsProspected } from '@/hooks/origin-os/useCompanies';
import KanbanBoard, { KanbanColumnDef, KanbanItem } from './components/KanbanBoard';
import { format } from 'date-fns';
import { Phone, MessageCircle, Instagram, Tag, MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { Company } from '@/types/origin-os';
import { toast } from 'sonner';

const today = format(new Date(), 'yyyy-MM-dd');

const statusMap: Record<Company['prospect_status'], string> = {
  hoje: 'hoje',
  prospectado: 'prospectado',
  nao_prospectado: 'nao_prospectado',
};

const CompanyCard: React.FC<{ company: Company; onMarkProspected: () => void; onMarkNot: () => void; onMarkToday: () => void }> = ({
  company, onMarkProspected, onMarkNot, onMarkToday
}) => (
  <div
    className="rounded-xl p-3.5 group cursor-grab active:cursor-grabbing"
    style={{ background: '#252525', border: '1px solid #333' }}
  >
    <p className="text-white font-semibold text-sm truncate mb-0.5">{company.name}</p>
    {company.responsible && <p className="text-xs mb-2" style={{ color: '#888' }}>{company.responsible}</p>}

    <div className="flex flex-wrap gap-1.5 mb-3">
      {company.niche && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'hsl(25 95% 53% / 0.1)', color: 'hsl(25 95% 53%)' }}>
          <Tag size={8} />{company.niche}
        </span>
      )}
      {company.city && (
        <span className="text-[10px] flex items-center gap-1" style={{ color: '#555' }}>
          <MapPin size={8} />{company.city}
        </span>
      )}
    </div>

    <div className="flex items-center gap-1.5 mb-3">
      {company.phone && (
        <a href={`tel:${company.phone}`} onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: '#666' }}>
          <Phone size={11} />
        </a>
      )}
      {company.whatsapp && (
        <a href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Oi, tudo bem? Meu nome é Rauan. Encontrei o escritório de vocês pesquisando empresas de ${company.niche || '[nicho]'} aqui na região de ${company.city || '[cidade]'} e queria falar com alguém responsável pelo escritório. Poderia me ajudar?`)}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-colors" style={{ color: '#666' }}>
          <MessageCircle size={11} />
        </a>
      )}
      {company.instagram && (
        <a href={`https://instagram.com/${company.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-purple-500/20 transition-colors" style={{ color: '#666' }}>
          <Instagram size={11} />
        </a>
      )}
    </div>

    {company.notes && (
      <p className="text-[11px] mb-3 line-clamp-2" style={{ color: '#666' }}>{company.notes}</p>
    )}

    {/* Action buttons */}
    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {company.prospect_status !== 'prospectado' && (
        <button
          onMouseDown={e => { e.stopPropagation(); onMarkProspected(); }}
          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors hover:opacity-80"
          style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
        >
          <CheckCircle2 size={9} /> Prospectou
        </button>
      )}
      {company.prospect_status !== 'nao_prospectado' && (
        <button
          onMouseDown={e => { e.stopPropagation(); onMarkNot(); }}
          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors hover:opacity-80"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
        >
          <XCircle size={9} /> Não prospectou
        </button>
      )}
    </div>
  </div>
);

const OSProspectar: React.FC = () => {
  const { userId } = useOSContext();
  const { data: companies = [], isLoading } = useCompaniesToday(userId, today);
  const markProspected = useMarkAsProspected(userId);
  const updateStatus = useUpdateCompanyStatus(userId);

  const columns: KanbanColumnDef[] = useMemo(() => [
    {
      id: 'hoje',
      label: 'Hoje',
      color: '#f59e0b',
      accent: '#f59e0b',
      items: companies.filter(c => c.prospect_status === 'hoje') as unknown as KanbanItem[],
    },
    {
      id: 'prospectado',
      label: 'Prospectado',
      color: '#22c55e',
      accent: '#22c55e',
      items: companies.filter(c => c.prospect_status === 'prospectado') as unknown as KanbanItem[],
    },
    {
      id: 'nao_prospectado',
      label: 'Não Prospectado',
      color: '#ef4444',
      accent: '#ef4444',
      items: companies.filter(c => c.prospect_status === 'nao_prospectado') as unknown as KanbanItem[],
    },
  ], [companies]);

  const handleDragEnd = (itemId: string, fromColumn: string, toColumn: string) => {
    if (fromColumn === toColumn) return;
    const company = companies.find(c => c.id === itemId);
    if (!company) return;

    if (toColumn === 'prospectado' && fromColumn !== 'prospectado') {
      markProspected.mutate(company);
    } else {
      updateStatus.mutate({ company, status: toColumn as Company['prospect_status'] });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555' }}>
          {format(new Date(), 'dd/MM/yyyy')}
        </p>
        <h1 className="text-2xl font-bold text-white">Prospectar</h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>
          Arraste os cards entre as colunas. Mover para <span style={{ color: '#22c55e' }}>Prospectado</span> cria um Follow Up automaticamente.
        </p>
      </div>

      {companies.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white font-semibold mb-2">Nenhuma empresa planejada para hoje</p>
            <a href="/os/planejar" className="text-sm underline" style={{ color: 'hsl(25 95% 53%)' }}>
              Ir para Planejar e adicionar empresas
            </a>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            columns={columns}
            renderCard={(item) => {
              const company = item as unknown as Company;
              return (
                <CompanyCard
                  company={company}
                  onMarkProspected={() => markProspected.mutate(company)}
                  onMarkNot={() => updateStatus.mutate({ company, status: 'nao_prospectado' })}
                  onMarkToday={() => updateStatus.mutate({ company, status: 'hoje' })}
                />
              );
            }}
            onDragEnd={handleDragEnd}
          />
        </div>
      )}
    </div>
  );
};

export default OSProspectar;
