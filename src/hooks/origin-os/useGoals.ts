import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsService } from '@/services/origin-os/goals';
import type { CreateGoalPayload, UpdateGoalPayload } from '@/types/origin-os';
import { toast } from 'sonner';

export const GOALS_KEY = 'os-goals';

export function useGoals(userId: string) {
  return useQuery({
    queryKey: [GOALS_KEY, userId],
    queryFn: () => goalsService.getAll(userId),
    enabled: !!userId,
  });
}

export function useActiveGoal(userId: string) {
  return useQuery({
    queryKey: [GOALS_KEY, 'active', userId],
    queryFn: () => goalsService.getActive(userId),
    enabled: !!userId,
  });
}

export function useCreateGoal(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => goalsService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GOALS_KEY] });
      toast.success('Meta criada com sucesso!');
    },
    onError: (err: any) => toast.error(`Erro ao criar meta: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useUpdateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
      goalsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GOALS_KEY] });
      toast.success('Meta atualizada!');
    },
    onError: (err: any) => toast.error(`Erro ao atualizar meta: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GOALS_KEY] });
      toast.success('Meta removida');
    },
    onError: (err: any) => toast.error(`Erro ao remover meta: ${err?.message || err || 'Erro desconhecido'}`),
  });
}
