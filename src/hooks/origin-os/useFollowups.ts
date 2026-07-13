import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followupsService } from '@/services/origin-os/followups';
import type { FollowUp, CreateFollowUpPayload, UpdateFollowUpPayload } from '@/types/origin-os';
import { toast } from 'sonner';

export const FOLLOWUPS_KEY = 'os-followups';

export function useFollowups(userId: string) {
  return useQuery({
    queryKey: [FOLLOWUPS_KEY, userId],
    queryFn: () => followupsService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateFollowup(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFollowUpPayload) => followupsService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY] });
      toast.success('Follow up criado!');
    },
    onError: (err: any) => toast.error(`Erro ao criar follow up: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useUpdateFollowup(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ followup, payload }: { followup: FollowUp; payload: UpdateFollowUpPayload }) =>
      followupsService.update(userId, followup, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao atualizar follow up: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useDeleteFollowup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => followupsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY] });
      toast.success('Follow up removido');
    },
    onError: (err: any) => toast.error(`Erro ao remover follow up: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useReorderFollowups(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { id: string; status: FollowUp['status']; position: number }[]) =>
      followupsService.reorder(userId, items),
    onMutate: async (items) => {
      await qc.cancelQueries({ queryKey: [FOLLOWUPS_KEY, userId] });
      const prev = qc.getQueryData([FOLLOWUPS_KEY, userId]);
      qc.setQueryData([FOLLOWUPS_KEY, userId], (old: FollowUp[] | undefined) => {
        if (!old) return old;
        return old.map(fu => {
          const updated = items.find(i => i.id === fu.id);
          return updated ? { ...fu, status: updated.status, position: updated.position } : fu;
        });
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData([FOLLOWUPS_KEY, userId], ctx.prev);
      toast.error('Erro ao reordenar');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY] });
    },
  });
}
