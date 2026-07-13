import React, { useState } from 'react';
import { useOSContext } from './components/OSLayout';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/origin-os/useGoals';
import { useEntries } from '@/hooks/origin-os/useFinancial';
import { Plus, Target, Trash2, Edit2, Loader2, PlayCircle, CheckCircle2, PauseCircle, TrendingUp, DollarSign } from 'lucide-react';
import type { Goal, CreateGoalPayload, GoalStatus } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import GoalProgressCard from './components/GoalProgressCard';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Obrigatório'),
  description: z.string().optional(),
  target_value: z.coerce.number().min(1, 'Deve ser maior que 0'),
  start_date: z.string().min(1, 'Obrigatório'),
  end_date: z.string().min(1, 'Obrigatório'),
});
type Form = z.infer<typeof schema>;

const contributionSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Valor deve ser maior que 0'),
  note: z.string().optional(),
});
type ContributionForm = z.infer<typeof contributionSchema>;

const OSMetas: React.FC = () => {
  const { userId } = useOSContext();
  const { data: goals = [], isLoading } = useGoals(userId);
  const { data: entries = [] } = useEntries(userId);
  const createGoal = useCreateGoal(userId);
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showContributionModal, setShowContributionModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });
  const { register: regC, handleSubmit: handleC, reset: resetC, formState: { errors: errC } } = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { amount: 0, note: '' },
  });

  const activeGoal = goals.find(g => g.status === 'active');
  const pastGoals = goals.filter(g => g.status !== 'active');

  // Sum of all financial entries as the current revenue reference
  const totalEntries = entries.reduce((sum, e) => sum + (e.value ?? 0), 0);

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
    if (status === 'active' && activeGoal) {
      alert('Já existe uma meta ativa. Conclua ou pause a atual primeiro.');
      return;
    }
    updateGoal.mutate({ id, payload: { status } });
  };

  const applyContribution = async (data: ContributionForm) => {
    if (!activeGoal) return;
    const newInvested = (activeGoal.invested_value ?? 0) + data.amount;
    await updateGoal.mutateAsync({
      id: activeGoal.id,
      payload: { invested_value: newInvested },
    });
    toast.success(`R$ ${data.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} aplicado na meta!`);
    setShowContributionModal(false);
    resetC();
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#555' }}>Meta Ativa</h2>
          {activeGoal && (
            <button
              onClick={() => { resetC({ amount: 0, note: '' }); setShowContributionModal(true); }}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-90"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
            >
              <TrendingUp size={13} /> Aplicar Entrada na Meta
            </button>
          )}
        </div>
        {activeGoal ? (
          <div className="relative group">
            <GoalProgressCard goal={activeGoal} currentRevenue={totalEntries} />
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

      {/* Contribution Modal */}
      <Dialog open={showContributionModal} onOpenChange={setShowContributionModal}>
        <DialogContent style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <TrendingUp size={18} style={{ color: '#818cf8' }} />
              Aplicar Entrada na Meta
            </DialogTitle>
            <DialogDescription style={{ color: '#666' }}>
              {activeGoal ? (
                <>Atualize o progresso investido na meta <strong className="text-white">"{activeGoal.name}"</strong>. O valor será somado ao que já foi investido.</>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleC(applyContribution)} className="space-y-4 mt-2">
            {/* Current progress info */}
            {activeGoal && (
              <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: '#252525' }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#666' }}>Já investido</p>
                  <p className="font-bold text-white">
                    {(activeGoal.invested_value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: '#666' }}>Alvo</p>
                  <p className="font-bold" style={{ color: 'hsl(25 95% 53%)' }}>
                    {activeGoal.target_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Valor a Aplicar (R$) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: '#666' }}>R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...regC('amount')}
                  className="w-full rounded-xl pl-10 pr-3 py-2 text-sm text-white outline-none"
                  style={{ background: '#252525', border: '1px solid #333' }}
                  placeholder="0,00"
                />
              </div>
              {errC.amount && <p className="text-xs text-red-400 mt-1">{errC.amount.message}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Observação (opcional)</label>
              <input
                {...regC('note')}
                className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
                style={{ background: '#252525', border: '1px solid #333' }}
                placeholder="Ex: Pagamento do cliente X…"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowContributionModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
                style={{ color: '#888' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)' }}
              >
                <DollarSign size={14} /> Aplicar na Meta
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSMetas;
