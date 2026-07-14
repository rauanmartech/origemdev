import React, { useState, useEffect } from 'react';
import { useOSContext } from './components/OSLayout';
import { useDailyPriorities, useUpsertPriorities, useCompaniesToday, useCreateCompany, useUpdateCompany, useDeleteCompany } from '@/hooks/origin-os/useCompanies';
import { useAutoSaveDraft } from '@/hooks/useAutoSaveDraft';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Check, X, Users, Building2, Target, Loader2, Phone, Instagram, Globe, MapPin, Tag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Company, CreateCompanyPayload } from '@/types/origin-os';


const companySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  responsible: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  site: z.string().optional(),
  city: z.string().optional(),
  niche: z.string().optional(),
  notes: z.string().optional(),
});
type CompanyForm = z.infer<typeof companySchema>;

const OSPlanejar: React.FC = () => {
  const { userId } = useOSContext();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  const goToPrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(format(d, 'yyyy-MM-dd'));
  };

  const goToNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(format(d, 'yyyy-MM-dd'));
  };

  const goToToday = () => setSelectedDate(format(new Date(), 'yyyy-MM-dd'));

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingPriority, setEditingPriority] = useState<number | null>(null);

  const { data: priData, isLoading: priLoading } = useDailyPriorities(userId, selectedDate);
  const { data: companies = [], isLoading: compLoading } = useCompaniesToday(userId, selectedDate);
  const upsertPri = useUpsertPriorities(userId);
  const createCompany = useCreateCompany(userId);
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();

  const handleAutoSave = async (data: { p1: string; p2: string; p3: string }) => {
    if (!data.p1 && !data.p2 && !data.p3) return;
    await upsertPri.mutateAsync({
      date: selectedDate,
      priority_1: data.p1,
      priority_2: data.p2,
      priority_3: data.p3,
    });
  };

  const { data: priorities, setData: setPriorities } = useAutoSaveDraft(
    `os-draft-priorities-${userId}-${selectedDate}`,
    { p1: '', p2: '', p3: '' },
    handleAutoSave,
    1000
  );

  useEffect(() => {
    if (priData) {
      // Only set if we don't have a local draft that is actively being typed (or we can just blindly update if nothing is typed)
      const hasLocal = priorities.p1 || priorities.p2 || priorities.p3;
      if (!hasLocal || priData.priority_1 || priData.priority_2 || priData.priority_3) {
        setPriorities({ p1: priData.priority_1 ?? '', p2: priData.priority_2 ?? '', p3: priData.priority_3 ?? '' });
      }
    }
  }, [priData]);

  const savePriority = async (idx: number) => {
    setEditingPriority(null);
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
  });

  const openEdit = (c: Company) => {
    setEditingCompany(c);
    reset({ name: c.name, responsible: c.responsible ?? '', phone: c.phone ?? '', whatsapp: c.whatsapp ?? '', instagram: c.instagram ?? '', site: c.site ?? '', city: c.city ?? '', niche: c.niche ?? '', notes: c.notes ?? '' });
    setShowCompanyModal(true);
  };

  const openCreate = () => {
    setEditingCompany(null);
    reset({});
    setShowCompanyModal(true);
  };

  const onSubmit = async (data: CompanyForm) => {
    if (editingCompany) {
      await updateCompany.mutateAsync({ id: editingCompany.id, payload: data });
      toast.success('Empresa atualizada!');
    } else {
      await createCompany.mutateAsync({ ...data, plan_date: selectedDate, selected_for_today: true } as CreateCompanyPayload);
    }
    setShowCompanyModal(false);
  };

  const priorityItems = [
    { key: 'p1' as const, label: '1ª Prioridade', placeholder: 'O que é mais importante hoje?' },
    { key: 'p2' as const, label: '2ª Prioridade', placeholder: 'Segundo item crítico…' },
    { key: 'p3' as const, label: '3ª Prioridade', placeholder: 'Terceiro foco do dia…' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header with date navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Planejar</h1>
          <p className="text-xs font-medium mt-0.5" style={{ color: '#555' }}>
            {format(new Date(selectedDate + 'T00:00:00'), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevDay}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#888' }}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={e => e.target.value && setSelectedDate(e.target.value)}
              className="appearance-none w-36 text-center text-sm font-semibold rounded-xl px-3 py-1.5 outline-none cursor-pointer"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: 'white', colorScheme: 'dark' }}
            />
          </div>

          <button
            onClick={goToNextDay}
            disabled={isToday}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10 disabled:opacity-30"
            style={{ background: '#1e1e1e', border: '1px solid #2a2a2a', color: '#888' }}
          >
            <ChevronRight size={16} />
          </button>

          {!isToday && (
            <button
              onClick={goToToday}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
              style={{ background: 'hsl(25 95% 53% / 0.15)', color: 'hsl(25 95% 53%)' }}
            >
              Hoje
            </button>
          )}
        </div>
      </div>

      {/* Priorities */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: '#555' }}>
          <Target size={16} /> Prioridades do Dia
        </h2>
        <div className="space-y-3">
          {priorityItems.map(({ key, label, placeholder }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: 'hsl(25 95% 53% / 0.15)', color: 'hsl(25 95% 53%)' }}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#555' }}>{label}</p>
                {editingPriority === idx ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={priorities[key]}
                      onChange={e => setPriorities(p => ({ ...p, [key]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') savePriority(idx); if (e.key === 'Escape') setEditingPriority(null); }}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-700"
                      placeholder={placeholder}
                    />
                    <button onClick={() => savePriority(idx)} className="text-green-400 hover:text-green-300 transition-colors"><Check size={15} /></button>
                    <button onClick={() => setEditingPriority(null)} className="text-gray-600 hover:text-gray-400 transition-colors"><X size={15} /></button>
                  </div>
                ) : (
                  <button
                    className="text-left w-full text-sm transition-colors hover:opacity-80"
                    style={{ color: priorities[key] ? '#d4d4d4' : '#444' }}
                    onClick={() => setEditingPriority(idx)}
                  >
                    {priorities[key] || placeholder}
                  </button>
                )}
              </div>
              {editingPriority !== idx && (
                <button onClick={() => setEditingPriority(idx)} className="text-gray-700 hover:text-gray-400 transition-colors">
                  <Edit2 size={13} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Companies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: '#555' }}>
              <Building2 size={16} /> Empresas do Dia
            </h2>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: companies.length >= 20 ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                color: companies.length >= 20 ? '#22c55e' : '#f59e0b',
              }}
            >
              {companies.length}/20
            </span>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ background: 'hsl(25 95% 53%)', color: '#fff' }}
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>

        {compLoading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin" style={{ color: '#555' }} /></div>
        ) : companies.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center border-dashed"
            style={{ border: '2px dashed #2a2a2a' }}
          >
            <Building2 size={32} className="mx-auto mb-3" style={{ color: '#333' }} />
            <p className="text-sm" style={{ color: '#555' }}>Nenhuma empresa adicionada. Meta: 20 empresas!</p>
            <button onClick={openCreate} className="mt-3 text-sm underline" style={{ color: 'hsl(25 95% 53%)' }}>Adicionar empresa</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {companies.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl p-4 group"
                  style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{c.name}</p>
                      {c.responsible && <p className="text-xs truncate mt-0.5" style={{ color: '#666' }}>{c.responsible}</p>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button onClick={() => openEdit(c)} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-gray-500 hover:text-white">
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={() => deleteCompany.mutate(c.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors text-gray-600 hover:text-red-400"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.niche && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'hsl(25 95% 53% / 0.1)', color: 'hsl(25 95% 53%)' }}>
                        {c.niche}
                      </span>
                    )}
                    {c.city && (
                      <span className="text-[10px] flex items-center gap-1" style={{ color: '#555' }}>
                        <MapPin size={9} />{c.city}
                      </span>
                    )}
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto"
                      style={{
                        background: c.prospect_status === 'prospectado' ? 'rgba(34,197,94,0.1)' : c.prospect_status === 'nao_prospectado' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: c.prospect_status === 'prospectado' ? '#22c55e' : c.prospect_status === 'nao_prospectado' ? '#ef4444' : '#f59e0b',
                      }}
                    >
                      {c.prospect_status === 'prospectado' ? '✓ Prospectado' : c.prospect_status === 'nao_prospectado' ? '✗ Não prospectado' : '⏳ Hoje'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Company Modal */}
      <Dialog open={showCompanyModal} onOpenChange={setShowCompanyModal}>
        <DialogContent className="max-w-xl" style={{ background: '#1e1e1e', border: '1px solid #333' }}>
          <DialogHeader>
            <DialogTitle className="text-white">{editingCompany ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Nome da Empresa *</label>
                <input {...register('name')} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Ex: Empresa XYZ" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>
              {[
                { field: 'responsible' as const, label: 'Responsável', placeholder: 'Nome do contato', icon: <Users size={12} /> },
                { field: 'phone' as const, label: 'Telefone', placeholder: '(11) 99999-9999', icon: <Phone size={12} /> },
                { field: 'whatsapp' as const, label: 'Whatsapp', placeholder: '(11) 99999-9999', icon: <Phone size={12} /> },
                { field: 'instagram' as const, label: 'Instagram', placeholder: '@empresa', icon: <Instagram size={12} /> },
                { field: 'site' as const, label: 'Site', placeholder: 'https://...', icon: <Globe size={12} /> },
                { field: 'city' as const, label: 'Cidade', placeholder: 'São Paulo - SP', icon: <MapPin size={12} /> },
                { field: 'niche' as const, label: 'Nicho', placeholder: 'Ex: E-commerce', icon: <Tag size={12} /> },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>{label}</label>
                  <input {...register(field)} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder={placeholder} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Observações</label>
                <textarea {...register('notes')} rows={2} className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Informações relevantes…" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowCompanyModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/5" style={{ color: '#888' }}>Cancelar</button>
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'hsl(25 95% 53%)' }}>
                {editingCompany ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OSPlanejar;
