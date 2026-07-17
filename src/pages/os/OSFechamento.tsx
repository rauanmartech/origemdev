import React, { useState, useEffect } from 'react';
import { useOSContext } from './components/OSLayout';
import { useReportByDate, useUpsertReport } from '@/hooks/origin-os/useReports';
import { useCompaniesToday } from '@/hooks/origin-os/useCompanies';
import { useFollowups } from '@/hooks/origin-os/useFollowups';
import { CheckSquare, Save, Loader2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OSFechamento: React.FC = () => {
  const { userId } = useOSContext();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: report, isLoading: loadR } = useReportByDate(userId, selectedDate);
  const { data: companies = [], isLoading: loadC } = useCompaniesToday(userId, selectedDate);
  const { data: followups = [], isLoading: loadF } = useFollowups(userId);
  const upsertReport = useUpsertReport(userId);

  const { register, handleSubmit, reset } = useForm();
  const [loadedDate, setLoadedDate] = useState<string | null>(null);

  // Auto-calculate defaults from selected date's activity
  useEffect(() => {
    if (loadR || loadC || loadF) return;

    if (loadedDate !== selectedDate) {
      if (report) {
        reset({
          prospections: report.prospections,
          responses: report.responses,
          meetings: report.meetings,
          proposals: report.proposals,
          revenue: report.revenue,
          invested: report.invested,
          notes: report.notes ?? '',
        });
      } else {
        const prospected = companies.filter(c => c.prospect_status === 'prospectado').length;
        reset({
          prospections: prospected,
          responses: 0,
          meetings: 0,
          proposals: 0,
          revenue: 0,
          invested: 0,
          notes: '',
        });
      }
      setLoadedDate(selectedDate);
    }
  }, [report, companies, followups, loadR, loadC, loadF, reset, selectedDate, loadedDate]);

  const onSubmit = async (data: any) => {
    await upsertReport.mutateAsync({
      date: selectedDate,
      prospections: Number(data.prospections),
      responses: Number(data.responses),
      meetings: Number(data.meetings),
      proposals: Number(data.proposals),
      revenue: Number(data.revenue),
      invested: Number(data.invested),
      notes: data.notes,
    });
  };

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  if (loadR || loadC || loadF) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col h-full">
      <div className="mb-6 flex-shrink-0 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#555' }}>
            {format(new Date(`${selectedDate}T12:00:00`), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="text-green-500" /> Fechamento do Dia
          </h1>
          <p className="text-sm mt-1" style={{ color: '#666' }}>Registre os números finais do seu dia para alimentar o Dashboard.</p>
        </div>
        <div 
          className="flex items-center gap-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-2 cursor-pointer transition-colors hover:border-[#444]"
          onClick={() => dateInputRef.current?.showPicker()}
        >
          <Calendar size={18} style={{ color: 'hsl(25 95% 53%)' }} />
          <input 
            ref={dateInputRef}
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-semibold outline-none w-32 cursor-pointer"
            style={{ colorScheme: 'dark' }}
          />
          <style>{`
            input[type="date"]::-webkit-calendar-picker-indicator {
              cursor: pointer;
              filter: invert(0.6) sepia(1) saturate(5) hue-rotate(360deg);
              opacity: 0.8;
            }
            input[type="date"]::-webkit-calendar-picker-indicator:hover {
              opacity: 1;
            }
          `}</style>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>Métricas Comerciais</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Prospecções Enviadas</label>
                <input type="number" {...register('prospections')} className="w-full rounded-xl px-4 py-3 text-lg font-bold text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Respostas Recebidas</label>
                <input type="number" {...register('responses')} className="w-full rounded-xl px-4 py-3 text-lg font-bold text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Reuniões Realizadas</label>
                <input type="number" {...register('meetings')} className="w-full rounded-xl px-4 py-3 text-lg font-bold text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Propostas Enviadas</label>
                <input type="number" {...register('proposals')} className="w-full rounded-xl px-4 py-3 text-lg font-bold text-white outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>Métricas Financeiras</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Receita Gerada (R$)</label>
                <input type="number" step="0.01" {...register('revenue')} className="w-full rounded-xl px-4 py-3 text-lg font-bold text-green-500 outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#888' }}>Investido Hoje (R$)</label>
                <input type="number" step="0.01" {...register('invested')} className="w-full rounded-xl px-4 py-3 text-lg font-bold text-[#818cf8] outline-none" style={{ background: '#252525', border: '1px solid #333' }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#555' }}>Diário / Reflexões</h2>
            <textarea {...register('notes')} rows={4} className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none" style={{ background: '#252525', border: '1px solid #333' }} placeholder="Como foi o dia? O que aprendeu? O que deu errado?" />
          </div>

          <button
            type="submit"
            disabled={upsertReport.isPending}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: 'hsl(25 95% 53%)' }}
          >
            {upsertReport.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {report ? 'Atualizar Fechamento' : 'Salvar Fechamento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OSFechamento;
