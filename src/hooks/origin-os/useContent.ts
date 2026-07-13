import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/services/origin-os/content';
import type { CreateContentPayload, ContentItem } from '@/types/origin-os';
import { toast } from 'sonner';

export const CONTENT_KEY = 'os-content';

export function useContent(userId: string) {
  return useQuery({
    queryKey: [CONTENT_KEY, userId],
    queryFn: () => contentService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateContent(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContentPayload) => contentService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CONTENT_KEY] });
      toast.success('Conteúdo criado!');
    },
    onError: (err: any) => toast.error(`Erro ao criar conteúdo: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateContentPayload & { published_at: string }> }) =>
      contentService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CONTENT_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao atualizar conteúdo: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CONTENT_KEY] });
      toast.success('Conteúdo removido');
    },
    onError: (err: any) => toast.error(`Erro ao remover conteúdo: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function usePublishContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentService.publish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CONTENT_KEY] });
      toast.success('Conteúdo publicado! 🎉');
    },
    onError: (err: any) => toast.error(`Erro ao publicar: ${err?.message || err || 'Erro desconhecido'}`),
  });
}
