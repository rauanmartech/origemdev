import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '@/services/origin-os/reports';
import type { UpsertDailyReportPayload } from '@/types/origin-os';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const REPORTS_KEY = 'os-reports';

export function useReports(userId: string, limit = 30) {
  return useQuery({
    queryKey: [REPORTS_KEY, userId, limit],
    queryFn: () => reportsService.getAll(userId, limit),
    enabled: !!userId,
  });
}

export function useTodayReport(userId: string) {
  const today = format(new Date(), 'yyyy-MM-dd');
  return useQuery({
    queryKey: [REPORTS_KEY, 'today', userId, today],
    queryFn: () => reportsService.getByDate(userId, today),
    enabled: !!userId,
  });
}

export function useMonthSummary(userId: string, year?: number, month?: number) {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth() + 1;
  return useQuery({
    queryKey: [REPORTS_KEY, 'month', userId, y, m],
    queryFn: () => reportsService.getMonthSummary(userId, y, m),
    enabled: !!userId,
  });
}

export function useUpsertReport(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertDailyReportPayload) => reportsService.upsert(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success('Fechamento do dia salvo! Dashboard atualizado.');
    },
    onError: (err: any) => toast.error(`Erro ao salvar fechamento: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useReportsByPeriod(userId: string, startDate: string, endDate: string) {
  return useQuery({
    queryKey: [REPORTS_KEY, 'period', userId, startDate, endDate],
    queryFn: () => reportsService.getByPeriod(userId, startDate, endDate),
    enabled: !!userId && !!startDate && !!endDate,
  });
}
