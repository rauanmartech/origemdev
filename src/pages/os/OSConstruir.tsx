import React, { useState, useEffect } from 'react';
import { useOSContext } from './components/OSLayout';
import { useImprovementTasks, useCreateImprovement, useUpdateImprovement, useDeleteImprovement, useImprovementChecklist } from '@/hooks/origin-os/useImprovementTasks';
import { Plus, Trash2, Check, X, ChevronDown, ChevronUp, Loader2, Calendar, Megaphone, Briefcase, Palette, Globe, Settings, Bot, DollarSign, FileText } from 'lucide-react';
import type { ImprovementTask, ImprovementCategory, ImprovementStatus, CreateImprovementPayload } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CATEGORIES: { id: ImprovementCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: '#f472b6' },
  { id: 'comercial', label: 'Comercial', icon: Briefcase, color: '#f59e0b' },
  { id: 'portfolio', label: 'Portfólio', icon: Palette, color: '#818cf8' },
  { id: 'site', label: 'Site', icon: Globe, color: '#06b6d4' },
  { id: 'processos', label: 'Processos', icon: Settings, color: '#22c55e' },
  { id: 'automacoes', label: 'Automações', icon: Bot, color: '#a78bfa' },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign, color: '#34d399' },
  { id: 'templates', label: 'Templates', icon: FileText, color: '#fb923c' },
];

const STATUS_COLORS: Record<ImprovementStatus, string> = {
  pendente: '#64748b',
  em_andamento: '#f59e0b',
  concluido: '#22c55e',
};
const STATUS_LABELS: Record<ImprovementStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
};

const schema = z.object({
  title: z.string().min(1, 'Obrigatório'),
  description: z.string().optional(),
  category: z.enum(['marketing','comercial','portfolio','site','processos','automacoes','financeiro','templates']),
  due_date: z.string().optional(),
  status: z.enum(['pendente','em_andamento','concluido']).default('pendente'),
});
type Form = z.infer<typeof schema>;

const MissionCard: React.FC<{
  task: ImprovementTask;
  onEdit: () => void;
  onDelete: () => void;
  catColor: string;
}> = ({ task, onEdit, onDelete, catColor }) => {
  const [expanded, setExpanded] = useState(false);
  const checklist = useImprovementChecklist();
  const [newItem, setNewItem] = useState('');
  const done = task.improvement_checklists?.filter(c => c.completed).length ?? 0;
  const total = task.improvement_checklists?.length ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{task.title}</p>
            {task.description && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#666' }}>{task.description}</p>}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <select
              value={task.status}
              onChange={e => checklist.toggle.mutate({ id: task.id, completed: false })} // placeholder, actual below
              onClick={e => e.stopPropagation()}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg outline-none cursor-pointer"
              style={{ background: `${STATUS_COLORS[task.status]}20`, color: STATUS_COLORS[task.status], border: 'none' }}
            >
              {(['pendente', 'em_andamento', 'concluido'] as ImprovementStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <button onClick={() => setExpanded(e => !e)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ color: '#666' }}>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <button onClick={onDelete} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors text-gray-600 hover:text-red-400">
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px]" style={{ color: '#555' }}>
          {total > 0 && <span>{done}/{total} itens</span>}
          {task.due_date && <span className="flex items-center gap-1"><Calendar size={9} />{format(new Date(task.due_date), 'dd/MM', { locale: ptBR })}</span>}
        </div>

        {total > 0 && (
          <div className="h-1 rounded-full mt-2" style={{ background: '#2a2a2a' }}>
            <div className="h-1 rounded-full transition-all" style={{ width: `${Math.round((done/total)*100)}%`, background: catColor }} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t" style={{ borderColor: '#2a2a2a' }}>
              <p className="text-[10px] uppercase tracking-wider pt-3 mb-2" style={{ color: '#555' }}>Checklist</p>
              {(task.improvement_checklists ?? []).map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <button
                    onClick={() => checklist.toggle.mutate({ id: item.id, completed: !item.completed })}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: item.completed ? catColor : '#333', border: `1px solid ${item.completed ? catColor : '#444'}` }}
                  >
                    {item.completed && <Check size={10} className="text-white" />}
                  </button>
                  <span className="text-sm flex-1" style={{ color: item.completed ? '#555' : '#aaa', textDecoration: item.completed ? 'line-through' : 'none' }}>{item.text}</span>
                  <button onClick={() => checklist.remove.mutate(item.id)} className="text-gray-700 hover:text-red-400 transition-colors"><X size={11} /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <input
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newItem.trim()) {
                      checklist.add.mutate({ taskId: task.id, text: newItem.trim(), position: (task.improvement_checklists?.length ?? 0) });
                      setNewItem('');
                    }
                  }}
                  className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none"
                  style={{ background: '#252525', border: '1px solid #333' }}
                  placeholder="Novo item… (Enter)"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const OSConstruir: React.FC = () => {
  const { userId } = useOSContext();
  const { data: tasks = [], isLoading } = useImprovementTasks(userId);
  const createTask = useCreateImprovement(userId);
  const updateTask = useUpdateImprovement();
  const deleteTask = useDeleteImprovement();

  const [activeCategory, setActiveCategory] = useState<ImprovementCategory>('marketing');
  const [showCreate, setShowCreate] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: (() => {
      try {
        const draft = localStorage.getItem('os-draft-construir');
        if (draft) return JSON.parse(draft);
      } catch {}
      return { category: activeCategory };
    })(),
  });

  const formValues = watch();
  useEffect(() => {
    localStorage.setItem('os-draft-construir', JSON.stringify(formValues));
  }, [formValues]);

  const filteredTasks = tasks.filter(t => t.category === activeCategory);

  const onSubmit = async (data: Form) => {
    await createTask.mutateAsync({ ...data } as CreateImprovementPayload);
    setShowCreate(false);
    reset({ category: activeCategory, title: '', description: '', due_date: '', status: 'pendente' });
    localStorage.removeItem('os-draft-construir');
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Construir</h1>
        <p className="text-sm mt-0.5" style={{ color: '#666' }}>Backlog estratégico da empresa</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 flex-shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0"
            style={{
              background: activeCategory === cat.id ? `${cat.color}20` : '#1e1e1e',
              color: activeCategory === cat.id ? cat.color : '#666',
              border: `1px solid ${activeCategory === cat.id ? cat.color + '40' : '#2a2a2a'}`,
            }}
          >
            <cat.icon size={16} />
            <span>{cat.label}</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: activeCategory === cat.id ? `${cat.color}30` : '#252525', color: activeCategory === cat.id ? cat.color : '#555' }}
            >
              {tasks.filter(t => t.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <activeCat.icon size={18} /> {activeCat.label}
          </h2>
          <button
            onClick={() => { reset({ category: activeCategory }); setShowCreate(true); }}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: activeCat.color + '20', color: activeCat.color, border: `1px solid ${activeCat.color}30` }}
          >
            <Plus size={14} /> Nova Missão
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl p-8 text-center border-dashed" style={{ border: '2px dashed #2a2a2a' }}>
            <div className="flex justify-center mb-2" style={{ color: activeCat.color }}><activeCat.icon size={32} /></div>
            <p className="text-sm" style={{ color: '#555' }}>Nenhuma missão em {activeCat.label}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <MissionCard
                  key={task.id}
                  task={task}
                  catColor={activeCat.color}
                  onEdit={() => {}}
                  onDelete={() => deleteTask.mutate(task.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">Nova Missão — <activeCat.icon size={16} /> {activeCat.label}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Título *</label>
              <input {...register('title')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Nome da missão" />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Descrição</label>
              <textarea {...register('description')} rows={2} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Categoria</label>
                <select {...register('category')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Prazo</label>
                <input type="date" {...register('due_date')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ color: '#888' }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: activeCat.color }}>Criar</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSConstruir;
