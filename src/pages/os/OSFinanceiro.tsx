import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOSContext } from './components/OSLayout';
import { useEntries, useCreateEntry, useUpdateEntry, useDeleteEntry, useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense, useInvestments, useCreateInvestment, useDeleteInvestment, usePatrimony } from '@/hooks/origin-os/useFinancial';
import { useGoals } from '@/hooks/origin-os/useGoals';
import { Plus, Trash2, TrendingUp, TrendingDown, Landmark, Check, Loader2, ArrowRightLeft } from 'lucide-react';
import type { FinancialEntry, FinancialExpense, Investment, CreateEntryPayload, CreateExpensePayload, CreateInvestmentPayload } from '@/types/origin-os';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const OSFinanceiro: React.FC = () => {
  const { userId } = useOSContext();
  const { data: entries = [], isLoading: loadE } = useEntries(userId);
  const { data: expenses = [], isLoading: loadEx } = useExpenses(userId);
  const { data: investments = [], isLoading: loadI } = useInvestments(userId);
  const { data: patrimony = 0 } = usePatrimony(userId);
  const { data: goals = [] } = useGoals(userId);

  const createEntry = useCreateEntry(userId);
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();

  const createExpense = useCreateExpense(userId);
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const createInv = useCreateInvestment(userId);
  const deleteInv = useDeleteInvestment(userId);

  const [activeTab, setActiveTab] = useState<'entries' | 'expenses' | 'investments'>('entries');
  const [showModal, setShowModal] = useState<'entry' | 'expense' | 'investment' | null>(null);

  const { register: regE, handleSubmit: handleE, reset: resetE } = useForm<CreateEntryPayload>();
  const { register: regEx, handleSubmit: handleEx, reset: resetEx } = useForm<CreateExpensePayload>();
  const { register: regI, handleSubmit: handleI, reset: resetI } = useForm<CreateInvestmentPayload>();

  const onEntry = async (data: any) => {
    await createEntry.mutateAsync({ ...data, value: Number(data.value) });
    setShowModal(null); resetE();
  };
  const onExpense = async (data: any) => {
    await createExpense.mutateAsync({ ...data, value: Number(data.value) });
    setShowModal(null); resetEx();
  };
  const onInv = async (data: any) => {
    await createInv.mutateAsync({ ...data, value: Number(data.value), goal_id: data.goal_id || undefined });
    setShowModal(null); resetI();
  };

  const totals = {
    entries: entries.reduce((s, i) => s + Number(i.value), 0),
    expenses: expenses.reduce((s, i) => s + Number(i.value), 0),
  };

  const isLoading = loadE || loadEx || loadI;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <p className="text-sm mt-0.5" style={{ color: '#666' }}>Controle de Entradas, Saídas e Patrimônio</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500"><TrendingUp size={20} /></div>
            <p className="font-semibold" style={{ color: '#888' }}>Entradas</p>
          </div>
          <p className="text-3xl font-bold text-green-500">{fmt(totals.entries)}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500"><TrendingDown size={20} /></div>
            <p className="font-semibold" style={{ color: '#888' }}>Saídas</p>
          </div>
          <p className="text-3xl font-bold text-red-500">{fmt(totals.expenses)}</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, hsl(25 95% 53% / 0.1), hsl(18 90% 45% / 0.05))', border: '1px solid hsl(25 95% 53% / 0.3)' }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'hsl(25 95% 53%)' }}><Landmark size={20} /></div>
            <p className="font-semibold text-white">Patrimônio Líquido</p>
          </div>
          <p className="text-3xl font-bold text-white">{fmt(patrimony)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b" style={{ borderColor: '#2a2a2a' }}>
        {[
          { id: 'entries', label: 'Entradas', icon: <TrendingUp size={14} /> },
          { id: 'expenses', label: 'Saídas', icon: <TrendingDown size={14} /> },
          { id: 'investments', label: 'Investimentos', icon: <Landmark size={14} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all relative"
            style={{ color: activeTab === t.id ? 'white' : '#666' }}
          >
            {t.icon} {t.label}
            {activeTab === t.id && (
              <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t" style={{ background: 'hsl(25 95% 53%)' }} />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#2a2a2a' }}>
          <h3 className="font-bold text-white">
            {activeTab === 'entries' ? 'Histórico de Entradas' : activeTab === 'expenses' ? 'Histórico de Saídas' : 'Aportes & Patrimônio'}
          </h3>
          <button
            onClick={() => setShowModal(activeTab === 'entries' ? 'entry' : activeTab === 'expenses' ? 'expense' : 'investment')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: activeTab === 'entries' ? '#22c55e' : activeTab === 'expenses' ? '#ef4444' : '#818cf8' }}
          >
            <Plus size={12} /> Adicionar
          </button>
        </div>

        <div className="divide-y" style={{ borderColor: '#2a2a2a' }}>
          {activeTab === 'entries' && entries.map(e => (
            <div key={e.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div>
                <p className="text-white font-semibold text-sm">{e.client}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: '#888' }}>{format(new Date(e.date), 'dd/MM/yyyy')}</span>
                  {e.project && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#252525', color: '#888' }}>{e.project}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-green-500">{fmt(Number(e.value))}</p>
                  <button
                    onClick={() => updateEntry.mutate({ id: e.id, payload: { status: e.status === 'pendente' ? 'recebido' : 'pendente' } })}
                    className="text-[10px] font-semibold flex items-center gap-1 justify-end ml-auto"
                    style={{ color: e.status === 'recebido' ? '#22c55e' : '#f59e0b' }}
                  >
                    {e.status === 'recebido' ? <><Check size={10} /> Recebido</> : <><ArrowRightLeft size={10} /> Pendente</>}
                  </button>
                </div>
                <button onClick={() => deleteEntry.mutate(e.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}

          {activeTab === 'expenses' && expenses.map(e => (
            <div key={e.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div>
                <p className="text-white font-semibold text-sm">{e.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: '#888' }}>{format(new Date(e.date), 'dd/MM/yyyy')}</span>
                  {e.description && <span className="text-xs" style={{ color: '#666' }}>{e.description}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-red-500">-{fmt(Number(e.value))}</p>
                <button onClick={() => deleteExpense.mutate(e.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}

          {activeTab === 'investments' && investments.map(e => {
            const goal = goals.find(g => g.id === e.goal_id);
            return (
              <div key={e.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-white font-semibold text-sm">Aporte</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: '#888' }}>{format(new Date(e.date), 'dd/MM/yyyy')}</span>
                    {goal && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#818cf820', color: '#818cf8' }}>Meta: {goal.name}</span>}
                    {e.notes && <span className="text-xs" style={{ color: '#666' }}>{e.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#818cf8]">+{fmt(Number(e.value))}</p>
                  <button onClick={() => deleteInv.mutate({ id: e.id, goalId: e.goal_id })} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showModal !== null} onOpenChange={() => setShowModal(null)}>
        <DialogContent className="max-w-md" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">
              {showModal === 'entry' ? 'Nova Entrada' : showModal === 'expense' ? 'Nova Saída' : 'Novo Aporte'}
            </DialogTitle>
          </DialogHeader>

          {showModal === 'entry' && (
            <form onSubmit={handleE(onEntry)} className="space-y-3 mt-2">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Cliente *</label>
                <input {...regE('client', { required: true })} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Valor *</label>
                  <input type="number" step="0.01" {...regE('value', { required: true })} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Data *</label>
                  <input type="date" {...regE('date', { required: true })} defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Projeto</label>
                  <input {...regE('project')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Status</label>
                  <select {...regE('status')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                    <option value="pendente">Pendente</option>
                    <option value="recebido">Recebido</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-4 py-2.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90 bg-green-500">Salvar Entrada</button>
            </form>
          )}

          {showModal === 'expense' && (
            <form onSubmit={handleEx(onExpense)} className="space-y-3 mt-2">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Categoria *</label>
                <input {...regEx('category', { required: true })} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Ex: Software, Tráfego, Contador" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Valor *</label>
                  <input type="number" step="0.01" {...regEx('value', { required: true })} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Data *</label>
                  <input type="date" {...regEx('date', { required: true })} defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Descrição</label>
                <input {...regEx('description')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <button type="submit" className="w-full mt-4 py-2.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90 bg-red-500">Salvar Saída</button>
            </form>
          )}

          {showModal === 'investment' && (
            <form onSubmit={handleI(onInv)} className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Valor *</label>
                  <input type="number" step="0.01" {...regI('value', { required: true })} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Data *</label>
                  <input type="date" {...regI('date', { required: true })} defaultValue={format(new Date(), 'yyyy-MM-dd')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333', colorScheme: 'dark' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Atrelar à Meta (Opcional)</label>
                <select {...regI('goal_id')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }}>
                  <option value="">Nenhuma</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Observações</label>
                <input {...regI('notes')} className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <button type="submit" className="w-full mt-4 py-2.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90 bg-[#818cf8]">Salvar Aporte</button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSFinanceiro;
