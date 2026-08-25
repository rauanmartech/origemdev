import React, { useState, useEffect } from 'react';
import { useOSContext } from './components/OSLayout';
import { useContent, useCreateContent, useUpdateContent, useDeleteContent, usePublishContent } from '@/hooks/origin-os/useContent';
import { Plus, Trash2, CheckCircle2, Loader2, Calendar, Tag, Lightbulb, PenTool, Video, Rocket } from 'lucide-react';
import type { ContentItem, ContentStatus, CreateContentPayload } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_COLUMNS: { id: ContentStatus; label: string; accent: string; icon: React.ElementType }[] = [
  { id: 'ideia', label: 'Ideia', accent: '#64748b', icon: Lightbulb },
  { id: 'escrevendo', label: 'Escrevendo', accent: '#f59e0b', icon: PenTool },
  { id: 'produzindo', label: 'Produzindo', accent: '#818cf8', icon: Video },
  { id: 'publicado', label: 'Publicado', accent: '#22c55e', icon: Rocket },
];

const schema = z.object({
  title: z.string().min(1, 'Obrigatório'),
  format: z.string().optional(),
  category: z.string().optional(),
  objective: z.string().optional(),
  idea: z.string().optional(),
  status: z.enum(['ideia','escrevendo','produzindo','publicado']).default('ideia'),
  scheduled_date: z.string().optional(),
});
type Form = z.infer<typeof schema>;

const FORMAT_OPTIONS = ['Reels', 'Post Carrossel', 'Stories', 'Post Estático', 'Vídeo Longo', 'Live', 'Artigo', 'Newsletter'];
const CATEGORY_OPTIONS = ['Case', 'Educacional', 'Bastidores', 'Oferta', 'Storytelling', 'Prova Social', 'Dica', 'Tendência'];

const ContentCard: React.FC<{
  item: ContentItem;
  onDelete: () => void;
  onPublish: () => void;
  onStatusChange: (s: ContentStatus) => void;
  accent: string;
}> = ({ item, onDelete, onPublish, onStatusChange, accent }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="rounded-xl p-3.5 group"
    style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
  >
    <div className="flex items-start justify-between mb-2">
      <p className="text-white font-semibold text-sm leading-tight flex-1 pr-2">{item.title}</p>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {item.status !== 'publicado' && (
          <button onClick={onPublish} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-colors" style={{ color: '#22c55e' }} title="Publicar">
            <CheckCircle2 size={12} />
          </button>
        )}
        <button onClick={onDelete} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors text-gray-600 hover:text-red-400">
          <Trash2 size={12} />
        </button>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-2">
      {item.format && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${accent}20`, color: accent }}>
          {item.format}
        </span>
      )}
      {item.category && (
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#252525', color: '#777' }}>
          {item.category}
        </span>
      )}
    </div>

    {item.idea && <p className="text-[11px] line-clamp-2 mb-2" style={{ color: '#666' }}>{item.idea}</p>}

    <div className="flex items-center gap-2">
      {item.scheduled_date && (
        <span className="text-[10px] flex items-center gap-1" style={{ color: '#555' }}>
          <Calendar size={9} />{format(new Date(item.scheduled_date), 'dd/MM', { locale: ptBR })}
        </span>
      )}
      {item.published_at && (
        <span className="text-[10px] flex items-center gap-1 ml-auto" style={{ color: '#22c55e' }}>
          ✓ {format(new Date(item.published_at), 'dd/MM')}
        </span>
      )}
    </div>

    {/* Quick status change */}
    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {STATUS_COLUMNS.filter(s => s.id !== item.status).map(s => (
        <button
          key={s.id}
          onClick={() => onStatusChange(s.id)}
          className="text-[9px] font-semibold px-2 py-0.5 rounded-full transition-colors"
          style={{ background: `${s.accent}15`, color: s.accent }}
        >
          <div className="flex items-center gap-1"><s.icon size={10} /> {s.label}</div>
        </button>
      ))}
    </div>
  </motion.div>
);

const OSAutoridade: React.FC = () => {
  const { userId } = useOSContext();
  const { data: items = [], isLoading } = useContent(userId);
  const createItem = useCreateContent(userId);
  const updateItem = useUpdateContent();
  const deleteItem = useDeleteContent();
  const publishItem = usePublishContent();

  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: (() => {
      try {
        const draft = localStorage.getItem('os-draft-autoridade');
        if (draft) return JSON.parse(draft);
      } catch (err) {
        // Fallback if localStorage parse fails
      }
      return { status: 'ideia' };
    })(),
  });

  const formValues = watch();
  useEffect(() => {
    localStorage.setItem('os-draft-autoridade', JSON.stringify(formValues));
  }, [formValues]);

  const onSubmit = async (data: Form) => {
    await createItem.mutateAsync(data as CreateContentPayload);
    setShowCreate(false);
    reset({ title: '', format: '', category: '', objective: '', idea: '', status: 'ideia', scheduled_date: '' });
    localStorage.removeItem('os-draft-autoridade');
  };

  const stats = {
    total: items.length,
    publicados: items.filter(i => i.status === 'publicado').length,
    emProdução: items.filter(i => i.status === 'produzindo').length,
    ideias: items.filter(i => i.status === 'ideia').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Autoridade</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666' }}>Calendário Editorial</p>
        </div>
        <button
          onClick={() => { reset(); setShowCreate(true); }}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90"
          style={{ background: 'hsl(25 95% 53%)', color: '#fff' }}
        >
          <Plus size={14} /> Novo Conteúdo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: '#888' },
          { label: 'Publicados', value: stats.publicados, color: '#22c55e' },
          { label: 'Em Produção', value: stats.emProdução, color: '#818cf8' },
          { label: 'Ideias', value: stats.ideias, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#555' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map(col => (
          <div key={col.id}>
            <div className="flex items-center gap-2 mb-3">
              <col.icon size={16} style={{ color: col.accent }} />
              <h3 className="text-sm font-bold text-white">{col.label}</h3>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${col.accent}20`, color: col.accent }}
              >
                {items.filter(i => i.status === col.id).length}
              </span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {items.filter(i => i.status === col.id).map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    accent={col.accent}
                    onDelete={() => deleteItem.mutate(item.id)}
                    onPublish={() => publishItem.mutate(item.id)}
                    onStatusChange={(s) => updateItem.mutate({ id: item.id, payload: { status: s } })}
                  />
                ))}
              </AnimatePresence>
              <button
                onClick={() => { reset({ status: col.id }); setShowCreate(true); }}
                className="w-full rounded-xl p-2.5 text-xs font-medium transition-colors hover:bg-white/5 text-center border-dashed"
                style={{ border: '1px dashed #2a2a2a', color: '#444' }}
              >
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Novo Conteúdo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Título *</label>
              <input {...register('title')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Título do conteúdo" />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Formato</label>
                <select {...register('format')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  <option value="">Selecionar…</option>
                  {FORMAT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Categoria</label>
                <select {...register('category')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  <option value="">Selecionar…</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Status</label>
                <select {...register('status')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  {STATUS_COLUMNS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Data Programada</label>
                <input type="date" {...register('scheduled_date')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Objetivo</label>
              <input {...register('objective')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Ex: Gerar leads, awareness…" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Ideia / Roteiro</label>
              <textarea {...register('idea')} rows={3} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Descreva a ideia do conteúdo…" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ color: '#888' }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'hsl(25 95% 53%)' }}>Criar</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSAutoridade;
