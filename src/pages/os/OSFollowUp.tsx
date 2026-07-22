import React, { useMemo, useState } from 'react';
import { useOSContext } from './components/OSLayout';
import { useFollowups, useCreateFollowup, useUpdateFollowup, useDeleteFollowup, useReorderFollowups } from '@/hooks/origin-os/useFollowups';
import KanbanBoard, { KanbanColumnDef, KanbanItem } from './components/KanbanBoard';
import { Plus, Trash2, Phone, MessageCircle, Tag, History, X, Loader2, Copy } from 'lucide-react';
import type { FollowUp, FollowUpStatus, CreateFollowUpPayload } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { followupsService } from '@/services/origin-os/followups';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_LABELS: Record<FollowUpStatus, string> = {
  aguardando: 'Aguardando',
  respondeu: 'Respondeu',
  nao_respondeu: 'Não Respondeu',
  reuniao: 'Reunião',
  proposta_enviada: 'Proposta Enviada',
  fechado: 'Fechado',
  encerrado: 'Encerrado',
};

const STATUS_COLORS: Record<FollowUpStatus, string> = {
  aguardando: '#f59e0b',
  respondeu: '#22c55e',
  nao_respondeu: '#ef4444',
  reuniao: '#818cf8',
  proposta_enviada: '#06b6d4',
  fechado: '#34d399',
  encerrado: '#64748b',
};

const ALL_STATUSES: FollowUpStatus[] = ['aguardando', 'respondeu', 'nao_respondeu', 'reuniao', 'proposta_enviada', 'fechado', 'encerrado'];

const fuSchema = z.object({
  company_name: z.string().min(1, 'Obrigatório'),
  responsible: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  niche: z.string().optional(),
  notes: z.string().optional(),
});
type FUForm = z.infer<typeof fuSchema>;

const FollowUpCard: React.FC<{ fu: FollowUp; onDelete: () => void; onOpen: () => void }> = ({ fu, onDelete, onOpen }) => (
  <div
    className="rounded-xl p-3.5 group cursor-grab"
    style={{ background: '#252525', border: '1px solid #333' }}
    onClick={onOpen}
  >
    <div className="flex items-start justify-between mb-1">
      <p className="text-white font-semibold text-sm truncate flex-1">{fu.company_name}</p>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20"
        style={{ color: '#666' }}
      >
        <X size={10} />
      </button>
    </div>
    {fu.responsible && <p className="text-xs mb-2" style={{ color: '#888' }}>{fu.responsible}</p>}
    <div className="flex flex-wrap gap-1.5 mb-2">
      {fu.niche && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'hsl(25 95% 53% / 0.1)', color: 'hsl(25 95% 53%)' }}>
          <Tag size={8} />{fu.niche}
        </span>
      )}
    </div>
    {fu.notes && <p className="text-[11px] line-clamp-2" style={{ color: '#666' }}>{fu.notes}</p>}
    <div className="flex items-center gap-1.5 mt-2">
      {fu.phone && <a href={`tel:${fu.phone}`} onClick={e => e.stopPropagation()} className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10" style={{ color: '#555' }}><Phone size={10} /></a>}
      {fu.whatsapp && <a href={`https://wa.me/${fu.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-5 h-5 rounded flex items-center justify-center hover:bg-green-500/20" style={{ color: '#555' }}><MessageCircle size={10} /></a>}
      <span className="text-[10px] ml-auto" style={{ color: '#444' }}>{format(new Date(fu.created_at), 'dd/MM', { locale: ptBR })}</span>
    </div>
  </div>
);

const OSFollowUp: React.FC = () => {
  const { userId } = useOSContext();
  const { data: followups = [], isLoading } = useFollowups(userId);
  const createFU = useCreateFollowup(userId);
  const updateFU = useUpdateFollowup(userId);
  const deleteFU = useDeleteFollowup();
  const reorder = useReorderFollowups(userId);

  const [showCreate, setShowCreate] = useState(false);
  const [detailFU, setDetailFU] = useState<FollowUp | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FUForm>({ resolver: zodResolver(fuSchema) });

  const columns: KanbanColumnDef[] = useMemo(() =>
    ALL_STATUSES.map(status => ({
      id: status,
      label: STATUS_LABELS[status],
      color: STATUS_COLORS[status],
      accent: STATUS_COLORS[status],
      items: followups
        .filter(f => f.status === status)
        .sort((a, b) => a.position - b.position) as unknown as KanbanItem[],
    })),
    [followups]
  );

  const handleDragEnd = (itemId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    const fu = followups.find(f => f.id === itemId);
    if (!fu || fromColumn === toColumn) return;
    updateFU.mutate({ followup: fu, payload: { status: toColumn as FollowUpStatus, position: newIndex } });
  };

  const openDetail = async (fu: FollowUp) => {
    setDetailFU(fu);
    const h = await followupsService.getHistory(fu.id);
    setHistory(h);
  };

  const onSubmit = async (data: FUForm) => {
    await createFU.mutateAsync(data as CreateFollowUpPayload);
    setShowCreate(false);
    reset();
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
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Follow Up</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666' }}>{followups.length} contatos ativos</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90"
          style={{ background: 'hsl(25 95% 53%)', color: '#fff' }}
        >
          <Plus size={14} /> Novo Follow Up
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          columns={columns}
          renderCard={(item) => {
            const fu = item as unknown as FollowUp;
            return (
              <FollowUpCard
                fu={fu}
                onDelete={() => deleteFU.mutate(fu.id)}
                onOpen={() => openDetail(fu)}
              />
            );
          }}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Create modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Novo Follow Up</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
            {[
              { f: 'company_name' as const, label: 'Empresa *', placeholder: 'Nome da empresa' },
              { f: 'responsible' as const, label: 'Responsável', placeholder: 'Nome do contato' },
              { f: 'phone' as const, label: 'Telefone', placeholder: '(11) 99999-9999' },
              { f: 'whatsapp' as const, label: 'Whatsapp', placeholder: '(11) 99999-9999' },
              { f: 'niche' as const, label: 'Nicho', placeholder: 'Ex: E-commerce' },
            ].map(({ f, label, placeholder }) => (
              <div key={f}>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>{label}</label>
                <input {...register(f)} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder={placeholder} />
                {errors[f] && <p className="text-xs text-red-400 mt-1">{errors[f]?.message}</p>}
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Observações</label>
              <textarea {...register('notes')} rows={2} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ color: '#888' }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'hsl(25 95% 53%)' }}>Criar</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail modal */}
      <Dialog open={!!detailFU} onOpenChange={() => setDetailFU(null)}>
        <DialogContent className="max-w-md" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">{detailFU?.company_name}</DialogTitle>
          </DialogHeader>
          {detailFU && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                {detailFU.responsible && <div><p className="text-[10px] uppercase tracking-wider" style={{ color: '#555' }}>Responsável</p><p className="text-sm text-white">{detailFU.responsible}</p></div>}
                {detailFU.niche && <div><p className="text-[10px] uppercase tracking-wider" style={{ color: '#555' }}>Nicho</p><p className="text-sm text-white">{detailFU.niche}</p></div>}
                {detailFU.phone && <div><p className="text-[10px] uppercase tracking-wider" style={{ color: '#555' }}>Telefone</p><div className="flex items-center gap-2"><a href={`tel:${detailFU.phone}`} className="text-sm" style={{ color: 'hsl(25 95% 53%)' }}>{detailFU.phone}</a><button onClick={() => navigator.clipboard.writeText(detailFU.phone!)} className="opacity-50 hover:opacity-100 transition-opacity"><Copy size={12} /></button></div></div>}
                {detailFU.whatsapp && <div><p className="text-[10px] uppercase tracking-wider" style={{ color: '#555' }}>Whatsapp</p><div className="flex items-center gap-2"><a href={`https://wa.me/${detailFU.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: '#22c55e' }}>{detailFU.whatsapp}</a><button onClick={() => navigator.clipboard.writeText(detailFU.whatsapp!)} className="opacity-50 hover:opacity-100 transition-opacity"><Copy size={12} /></button></div></div>}
              </div>
              {detailFU.notes && <div><p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#555' }}>Observações</p><p className="text-sm" style={{ color: '#888' }}>{detailFU.notes}</p></div>}
              
              {/* Move status */}
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#555' }}>Mover para</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATUSES.filter(s => s !== detailFU.status).map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        updateFU.mutate({ followup: detailFU, payload: { status } });
                        setDetailFU(prev => prev ? { ...prev, status } : null);
                      }}
                      className="text-[10px] font-semibold px-2.5 py-1.5 rounded-xl transition-colors hover:opacity-80"
                      style={{ background: `${STATUS_COLORS[status]}20`, color: STATUS_COLORS[status], border: `1px solid ${STATUS_COLORS[status]}30` }}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#555' }}>
                    <History size={10} /> Histórico
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {history.map(h => (
                      <div key={h.id} className="flex items-center gap-2 text-[11px]" style={{ color: '#555' }}>
                        <span>{format(new Date(h.created_at), 'dd/MM HH:mm')}</span>
                        <span style={{ color: '#333' }}>→</span>
                        <span style={{ color: STATUS_COLORS[h.to_status as FollowUpStatus] ?? '#888' }}>{STATUS_LABELS[h.to_status as FollowUpStatus] ?? h.to_status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSFollowUp;
