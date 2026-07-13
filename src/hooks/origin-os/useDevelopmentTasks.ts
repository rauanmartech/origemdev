import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { devTasksService } from '@/services/origin-os/development-tasks';
import type { CreateDevTaskPayload, UpdateDevTaskPayload, DevelopmentTask } from '@/types/origin-os';
import { toast } from 'sonner';

export const DEV_TASKS_KEY = 'os-dev-tasks';

export function useDevelopmentTasks(userId: string) {
  return useQuery({
    queryKey: [DEV_TASKS_KEY, userId],
    queryFn: () => devTasksService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateDevTask(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDevTaskPayload) => devTasksService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] });
      toast.success('Tarefa criada!');
    },
    onError: (err: any) => toast.error(`Erro ao criar tarefa: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useUpdateDevTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDevTaskPayload }) =>
      devTasksService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao atualizar tarefa: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useDeleteDevTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => devTasksService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] });
      toast.success('Tarefa removida');
    },
    onError: (err: any) => toast.error(`Erro ao remover tarefa: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useReorderDevTasks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; status: DevelopmentTask['status']; position: number }[]) =>
      devTasksService.reorder(items),
    onMutate: async (items) => {
      await qc.cancelQueries({ queryKey: [DEV_TASKS_KEY] });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao reordenar: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useTaskChecklist() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: ({ taskId, text, position }: { taskId: string; text: string; position: number }) =>
      devTasksService.addChecklist(taskId, text, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] }),
  });

  const toggle = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      devTasksService.toggleChecklist(id, completed),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => devTasksService.deleteChecklist(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] }),
  });

  return { add, toggle, remove };
}

export function useTaskComment(userId: string) {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) =>
      devTasksService.addComment(taskId, userId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => devTasksService.deleteComment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [DEV_TASKS_KEY] }),
  });

  return { add, remove };
}
