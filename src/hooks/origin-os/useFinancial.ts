import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entriesService, expensesService, investmentsService } from '@/services/origin-os/financial';
import type { CreateEntryPayload, CreateExpensePayload, CreateInvestmentPayload } from '@/types/origin-os';
import { toast } from 'sonner';

export const ENTRIES_KEY = 'os-entries';
export const EXPENSES_KEY = 'os-expenses';
export const INVESTMENTS_KEY = 'os-investments';

// Entries
export function useEntries(userId: string) {
  return useQuery({
    queryKey: [ENTRIES_KEY, userId],
    queryFn: () => entriesService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateEntry(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEntryPayload) => entriesService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ENTRIES_KEY] });
      toast.success('Entrada registrada!');
    },
    onError: () => toast.error('Erro ao registrar entrada'),
  });
}

export function useUpdateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateEntryPayload> }) =>
      entriesService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ENTRIES_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar entrada'),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => entriesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ENTRIES_KEY] });
      toast.success('Entrada removida');
    },
    onError: () => toast.error('Erro ao remover entrada'),
  });
}

// Expenses
export function useExpenses(userId: string) {
  return useQuery({
    queryKey: [EXPENSES_KEY, userId],
    queryFn: () => expensesService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateExpense(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExpensePayload) => expensesService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EXPENSES_KEY] });
      toast.success('Saída registrada!');
    },
    onError: () => toast.error('Erro ao registrar saída'),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateExpensePayload> }) =>
      expensesService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EXPENSES_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar saída'),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [EXPENSES_KEY] });
      toast.success('Saída removida');
    },
    onError: () => toast.error('Erro ao remover saída'),
  });
}

// Investments
export function useInvestments(userId: string) {
  return useQuery({
    queryKey: [INVESTMENTS_KEY, userId],
    queryFn: () => investmentsService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateInvestment(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvestmentPayload) => investmentsService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [INVESTMENTS_KEY] });
      qc.invalidateQueries({ queryKey: ['os-goals'] });
      toast.success('Investimento registrado! Patrimônio atualizado.');
    },
    onError: () => toast.error('Erro ao registrar investimento'),
  });
}

export function useDeleteInvestment(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, goalId }: { id: string; goalId?: string | null }) =>
      investmentsService.delete(userId, id, goalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [INVESTMENTS_KEY] });
      qc.invalidateQueries({ queryKey: ['os-goals'] });
      toast.success('Investimento removido');
    },
    onError: () => toast.error('Erro ao remover investimento'),
  });
}

export function usePatrimony(userId: string) {
  return useQuery({
    queryKey: [INVESTMENTS_KEY, 'total', userId],
    queryFn: () => investmentsService.getTotalPatrimony(userId),
    enabled: !!userId,
  });
}
