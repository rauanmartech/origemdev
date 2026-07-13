import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesService, prioritiesService } from '@/services/origin-os/companies';
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from '@/types/origin-os';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const COMPANIES_KEY = 'os-companies';
export const PRIORITIES_KEY = 'os-priorities';

export function useCompanies(userId: string) {
  return useQuery({
    queryKey: [COMPANIES_KEY, userId],
    queryFn: () => companiesService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCompaniesToday(userId: string, date?: string) {
  const today = date ?? format(new Date(), 'yyyy-MM-dd');
  return useQuery({
    queryKey: [COMPANIES_KEY, 'today', userId, today],
    queryFn: () => companiesService.getForToday(userId, today),
    enabled: !!userId,
  });
}

export function useCreateCompany(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => companiesService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPANIES_KEY] });
      toast.success('Empresa adicionada!');
    },
    onError: () => toast.error('Erro ao adicionar empresa'),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCompanyPayload }) =>
      companiesService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPANIES_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar empresa'),
  });
}

export function useDeleteCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companiesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPANIES_KEY] });
      toast.success('Empresa removida');
    },
    onError: () => toast.error('Erro ao remover empresa'),
  });
}

export function useMarkAsProspected(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (company: Company) => companiesService.markAsProspected(userId, company),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPANIES_KEY] });
      qc.invalidateQueries({ queryKey: ['os-followups'] });
      toast.success('Empresa prospectada! Follow up criado automaticamente.');
    },
    onError: () => toast.error('Erro ao registrar prospecção'),
  });
}

export function useUpdateCompanyStatus(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ company, status }: { company: Company; status: Company['prospect_status'] }) =>
      companiesService.updateStatus(userId, company, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COMPANIES_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar status'),
  });
}

// Daily Priorities
export function useDailyPriorities(userId: string, date: string) {
  return useQuery({
    queryKey: [PRIORITIES_KEY, userId, date],
    queryFn: () => prioritiesService.getByDate(userId, date),
    enabled: !!userId,
  });
}

export function useUpsertPriorities(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { date: string; priority_1?: string; priority_2?: string; priority_3?: string }) =>
      prioritiesService.upsert(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
    },
    onError: () => toast.error('Erro ao salvar prioridades'),
  });
}
