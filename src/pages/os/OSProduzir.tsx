import React, { useMemo, useState } from 'react';
import { useOSContext } from './components/OSLayout';
import { useDevelopmentTasks, useCreateDevTask, useUpdateDevTask, useDeleteDevTask, useReorderDevTasks, useTaskChecklist, useTaskComment } from '@/hooks/origin-os/useDevelopmentTasks';
import KanbanBoard, { KanbanColumnDef, KanbanItem } from './components/KanbanBoard';
import { Plus, Trash2, Calendar, CheckSquare, MessageSquare, Loader2, Check, X } from 'lucide-react';
import type { DevelopmentTask, DevTaskStatus, TaskPriority } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  baixa: '#64748b',
  media: '#f59e0b',
  alta: '#f97316',
  urgente: '#ef4444',
};
const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa', media: 'Média', alta: 'Alta', urgente: 'Urgente',
};

const taskSchema = z.object({
  project: z.string().min(1, 'Obrigatório'),
  client: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
  due_date: z.string().optional(),
  status: z.enum(['backlog', 'fazendo', 'revisao', 'concluido']).default('backlog'),
});
type TaskForm = z.infer<typeof taskSchema>;

const TaskCard: React.FC<{ task: DevelopmentTask; onClick: () => void }> = ({ task, onClick }) => {
  const done = task.task_checklists?.filter(c => c.completed).length ?? 0;
  const total = task.task_checklists?.length ?? 0;
  return (
    <div
      className="rounded-xl p-3.5 group cursor-grab"
      style={{ background: '#252525', border: '1px solid #333' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-white font-semibold text-sm leading-tight flex-1 pr-2">{task.project}</p>
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
          style={{ background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority] }}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      {task.client && <p className="text-xs mb-2" style={{ color: '#888' }}>{task.client}</p>}
      {task.description && <p className="text-[11px] line-clamp-2 mb-2" style={{ color: '#666' }}>{task.description}</p>}
      <div className="flex items-center gap-3 text-[10px]" style={{ color: '#555' }}>
        {total > 0 && (
          <span className="flex items-center gap-1"><CheckSquare size={9} />{done}/{total}</span>
        )}
        {(task.task_comments?.length ?? 0) > 0 && (
          <span className="flex items-center gap-1"><MessageSquare size={9} />{task.task_comments?.length}</span>
        )}
        {task.due_date && (
          <span className="flex items-center gap-1 ml-auto"><Calendar size={9} />{format(new Date(task.due_date), 'dd/MM', { locale: ptBR })}</span>
        )}
      </div>
      {total > 0 && (
        <div className="h-1 rounded-full mt-2" style={{ background: '#333' }}>
          <div
            className="h-1 rounded-full transition-all"
            style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%`, background: 'hsl(25 95% 53%)' }}
          />
        </div>
      )}
    </div>
  );
};

const OSProduzir: React.FC = () => {
  const { userId } = useOSContext();
  const { data: tasks = [], isLoading } = useDevelopmentTasks(userId);
  const createTask = useCreateDevTask(userId);
  const updateTask = useUpdateDevTask();
  const deleteTask = useDeleteDevTask();
  const reorder = useReorderDevTasks();
  const checklist = useTaskChecklist();
  const comment = useTaskComment(userId);

  const [showCreate, setShowCreate] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<DevTaskStatus>('backlog');
  const [detailTask, setDetailTask] = useState<DevelopmentTask | null>(null);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [newComment, setNewComment] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskForm>({ resolver: zodResolver(taskSchema) });

  const STATUSES: { id: DevTaskStatus; label: string; accent: string }[] = [
    { id: 'backlog', label: 'Backlog', accent: '#64748b' },
    { id: 'fazendo', label: 'Fazendo', accent: '#f59e0b' },
    { id: 'revisao', label: 'Revisão', accent: '#818cf8' },
    { id: 'concluido', label: 'Concluído', accent: '#22c55e' },
  ];

  const columns: KanbanColumnDef[] = useMemo(() =>
    STATUSES.map(s => ({
      id: s.id,
      label: s.label,
      color: s.accent,
      accent: s.accent,
      items: tasks.filter(t => t.status === s.id).sort((a, b) => a.position - b.position) as unknown as KanbanItem[],
    })),
    [tasks]
  );

  const handleDragEnd = (itemId: string, fromCol: string, toCol: string, newIndex: number) => {
    if (fromCol === toCol) return;
    updateTask.mutate({ id: itemId, payload: { status: toCol as DevTaskStatus, position: newIndex } });
  };

  const onSubmit = async (data: TaskForm) => {
    await createTask.mutateAsync({ ...data, status: defaultStatus });
    setShowCreate(false);
    reset();
  };

  const openCreate = (colId: string) => {
    setDefaultStatus(colId as DevTaskStatus);
    reset({ status: colId as DevTaskStatus });
    setShowCreate(true);
  };

  // Re-sync detailTask from tasks list
  const syncedDetail = detailTask ? (tasks.find(t => t.id === detailTask.id) ?? detailTask) : null;

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
        <h1 className="text-2xl font-bold text-white">Produzir</h1>
        <p className="text-sm mt-0.5" style={{ color: '#666' }}>{tasks.length} tarefas no total</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          columns={columns}
          renderCard={(item) => {
            const task = item as unknown as DevelopmentTask;
            return <TaskCard task={task} onClick={() => setDetailTask(task)} />;
          }}
          onDragEnd={handleDragEnd}
          onAddCard={openCreate}
          addLabel="Nova tarefa"
        />
      </div>

      {/* Create */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Nova Tarefa</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Projeto *</label>
              <input {...register('project')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Nome do projeto" />
              {errors.project && <p className="text-xs text-red-400 mt-1">{errors.project.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Cliente</label>
                <input {...register('client')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Nome do cliente" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Prazo</label>
                <input type="date" {...register('due_date')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Prioridade</label>
                <select {...register('priority')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Coluna</label>
                <select {...register('status')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  <option value="backlog">Backlog</option>
                  <option value="fazendo">Fazendo</option>
                  <option value="revisao">Revisão</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Descrição</label>
              <textarea {...register('description')} rows={2} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ color: '#888' }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'hsl(25 95% 53%)' }}>Criar</button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={!!syncedDetail} onOpenChange={() => setDetailTask(null)}>
        <DialogContent className="max-w-lg" style={{ background: '#1e1e1e', border: '1px solid #333', maxHeight: '85vh', overflowY: 'auto' }}>
          {syncedDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center justify-between pr-8">
                  <span className="truncate">{syncedDetail.project}</span>
                  <button onClick={() => { deleteTask.mutate(syncedDetail.id); setDetailTask(null); }} className="flex-shrink-0 ml-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors" title="Excluir tarefa">
                    <Trash2 size={15} />
                  </button>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                {syncedDetail.client && <p className="text-sm" style={{ color: '#888' }}>Cliente: {syncedDetail.client}</p>}
                {syncedDetail.description && <p className="text-sm" style={{ color: '#aaa' }}>{syncedDetail.description}</p>}

                {/* Status change */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#555' }}>Status</p>
                  <div className="flex gap-1.5">
                    {STATUSES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => updateTask.mutate({ id: syncedDetail.id, payload: { status: s.id } })}
                        className="text-[10px] font-semibold px-2.5 py-1.5 rounded-xl transition-colors"
                        style={{
                          background: syncedDetail.status === s.id ? `${s.accent}30` : '#252525',
                          color: syncedDetail.status === s.id ? s.accent : '#666',
                          border: `1px solid ${syncedDetail.status === s.id ? s.accent + '50' : '#333'}`,
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#555' }}>Checklist</p>
                  <div className="space-y-1.5 mb-2">
                    {(syncedDetail.task_checklists ?? []).map(item => (
                      <div key={item.id} className="flex items-center gap-2">
                        <button
                          onClick={() => checklist.toggle.mutate({ id: item.id, completed: !item.completed })}
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                          style={{ background: item.completed ? 'hsl(25 95% 53%)' : '#333', border: `1px solid ${item.completed ? 'hsl(25 95% 53%)' : '#444'}` }}
                        >
                          {item.completed && <Check size={10} className="text-white" />}
                        </button>
                        <span className="text-sm flex-1" style={{ color: item.completed ? '#555' : '#aaa', textDecoration: item.completed ? 'line-through' : 'none' }}>{item.text}</span>
                        <button onClick={() => checklist.remove.mutate(item.id)} className="text-gray-700 hover:text-red-400 transition-colors"><X size={11} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={newCheckItem}
                      onChange={e => setNewCheckItem(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newCheckItem.trim()) {
                          checklist.add.mutate({ taskId: syncedDetail.id, text: newCheckItem.trim(), position: (syncedDetail.task_checklists?.length ?? 0) });
                          setNewCheckItem('');
                        }
                      }}
                      className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      style={{ background: '#252525', border: '1px solid #333' }}
                      placeholder="Adicionar item… (Enter)"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#555' }}>Comentários</p>
                  <div className="space-y-2 mb-2 max-h-32 overflow-y-auto">
                    {(syncedDetail.task_comments ?? []).map(c => (
                      <div key={c.id} className="rounded-xl p-2.5" style={{ background: '#252525' }}>
                        <p className="text-sm" style={{ color: '#aaa' }}>{c.content}</p>
                        <p className="text-[10px] mt-1" style={{ color: '#444' }}>{format(new Date(c.created_at), 'dd/MM HH:mm')}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          comment.add.mutate({ taskId: syncedDetail.id, content: newComment.trim() });
                          setNewComment('');
                        }
                      }}
                      className="flex-1 rounded-xl px-3 py-2 text-sm text-white outline-none"
                      style={{ background: '#252525', border: '1px solid #333' }}
                      placeholder="Comentar… (Enter)"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSProduzir;
