import React, { useState } from 'react';
import { useOSContext } from './components/OSLayout';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/origin-os/useGoals';
import { Plus, Target, Trash2, Edit2, Loader2, PlayCircle, CheckCircle2, PauseCircle } from 'lucide-react';
import type { Goal, CreateGoalPayload, GoalStatus } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import GoalProgressCard from './components/GoalProgressCard';

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  description: z.string().optional(),
  target_value: z.coerce.number().min(1, 'Deve ser maior que 0'),
  start_date: z.string().min(1, 'Obrigatório'),
  end_date: z.string().min(1, 'Obrigatório'),
});
type Form = z.infer<typeof schema>;

const OSMetas: React.FC = () => {
  const { userId } = useOSContext();
  const { data: goals = [], isLoading } = useGoals(userId);
  const createGoal = useCreateGoal(userId);
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const activeGoal = goals.find(g => g.status === 'active');
  const pastGoals = goals.filter(g => g.status !== 'active');

  const openCreate = () => {
    setEditingGoal(null);
    reset({ target_value: 0, start_date: format(new Date(), 'yyyy-MM-dd') });
    setShowModal(true);
  };

  const openEdit = (g: Goal) => {
    setEditingGoal(g);
    reset({
      name: g.name,
      description: g.description ?? '',
      target_value: g.target_value,
      start_date: g.start_date,
      end_date: g.end_date,
    });
    setShowModal(true);
  };

  const onSubmit = async (data: Form) => {
    if (editingGoal) {
      await updateGoal.mutateAsync({ id: editingGoal.id, payload: data });
    } else {
      // se já existe uma ativa, criar como pausada, senão cria como ativa
      const status: GoalStatus = activeGoal ? 'paused' : 'active';
      await createGoal.mutateAsync({ ...data, status });
    }
    setShowModal(false);
  };

  const changeStatus = (id: string, status: GoalStatus) => {
    // se for ativar e já existir ativa, avise
    if (status === 'active' && activeGoal) {
      alert('Já existe uma meta ativa. Conclua ou pause a atual primeiro.');
      return;
    }
    updateGoal.mutate({ id, payload: { status } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target style={{ color: 'hsl(25 95% 53%)' }} /> Metas
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#666' }}>Defina seus alvos e acompanhe o progresso.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90"
          style={{ background: 'hsl(25 95% 53%)', color: '#fff' }}
        >
          <Plus size={14} /> Nova Meta
        </button>
      </div>

      {/* Active Goal */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>Meta Ativa</h2>
        {activeGoal ? (
          <div className="relative group">
            {/* We pass currentRevenue=0 here since we don't have the full dashboard context, but in real use it would fetch current month revenue, or the user can just see it on the Dashboard. For now we just show the card. */}
            <GoalProgressCard goal={activeGoal} currentRevenue={0} />
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => changeStatus(activeGoal.id, 'completed')} className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors" title="Concluir">
                <CheckCircle2 size={16} />
              </button>
              <button onClick={() => changeStatus(activeGoal.id, 'paused')} className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors" title="Pausar">
                <PauseCircle size={16} />
              </button>
              <button onClick={() => openEdit(activeGoal)} className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
                <Edit2 size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center border-dashed" style={{ border: '2px dashed #2a2a2a' }}>
            <Target size={32} className="mx-auto mb-3" style={{ color: '#333' }} />
            <p className="text-sm" style={{ color: '#555' }}>Nenhuma meta ativa.</p>
            <button onClick={openCreate} className="mt-3 text-sm underline" style={{ color: 'hsl(25 95% 53%)' }}>Criar primeira meta</button>
          </div>
        )}
      </section>

      {/* Past/Paused Goals */}
      {pastGoals.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>Histórico / Pausadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastGoals.map(g => (
              <div key={g.id} className="rounded-2xl p-5" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{g.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: g.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: g.status === 'completed' ? '#22c55e' : '#f59e0b' }}>
                      {g.status === 'completed' ? 'Concluída' : 'Pausada'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {g.status === 'paused' && (
                      <button onClick={() => changeStatus(g.id, 'active')} className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors" title="Retomar">
                        <PlayCircle size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteGoal.mutate(g.id)} className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#888' }}>
                  <span>Alvo: <strong className="text-white">R$ {g.target_value}</strong></span>
                  <span>Período: {format(new Date(g.start_date), 'MM/yy')} a {format(new Date(g.end_date), 'MM/yy')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">{editingGoal ? 'Editar Meta' : 'Nova Meta'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Nome da Meta *</label>
              <input {...register('name')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Ex: Rumo aos 100k" />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Alvo Financeiro (R$) *</label>
              <input type="number" step="0.01" {...register('target_value')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              {errors.target_value && <p className="text-xs text-red-400 mt-1">{errors.target_value.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Data de Início *</label>
                <input type="date" {...register('start_date')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
                {errors.start_date && <p className="text-xs text-red-400 mt-1">{errors.start_date.message}</p>}
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Data Final *</label>
                <input type="date" {...register('end_date')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
                {errors.end_date && <p className="text-xs text-red-400 mt-1">{errors.end_date.message}</p>}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Descrição / Recompensa (Opcional)</label>
              <textarea {...register('description')} rows={2} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/5" style={{ color: '#888' }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'hsl(25 95% 53%)' }}>
                {editingGoal ? 'Salvar' : 'Criar Meta'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSMetas;
