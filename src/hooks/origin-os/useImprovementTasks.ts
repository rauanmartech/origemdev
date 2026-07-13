import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { improvementTasksService } from '@/services/origin-os/improvement-tasks';
import type { CreateImprovementPayload, ImprovementTask } from '@/types/origin-os';
import { toast } from 'sonner';

export const IMPROVEMENT_KEY = 'os-improvements';

export function useImprovementTasks(userId: string) {
  return useQuery({
    queryKey: [IMPROVEMENT_KEY, userId],
    queryFn: () => improvementTasksService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateImprovement(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateImprovementPayload) => improvementTasksService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [IMPROVEMENT_KEY] });
      toast.success('Missão criada!');
    },
    onError: () => toast.error('Erro ao criar missão'),
  });
}

export function useUpdateImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateImprovementPayload> }) =>
      improvementTasksService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [IMPROVEMENT_KEY] });
    },
    onError: () => toast.error('Erro ao atualizar missão'),
  });
}

export function useDeleteImprovement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => improvementTasksService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [IMPROVEMENT_KEY] });
      toast.success('Missão removida');
    },
    onError: () => toast.error('Erro ao remover missão'),
  });
}

export function useImprovementChecklist() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: ({ taskId, text, position }: { taskId: string; text: string; position: number }) =>
      improvementTasksService.addChecklist(taskId, text, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: [IMPROVEMENT_KEY] }),
  });

  const toggle = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      improvementTasksService.toggleChecklist(id, completed),
    onSuccess: () => qc.invalidateQueries({ queryKey: [IMPROVEMENT_KEY] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => improvementTasksService.deleteChecklist(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [IMPROVEMENT_KEY] }),
  });

  return { add, toggle, remove };
}
