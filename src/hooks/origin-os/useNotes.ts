import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '@/services/origin-os/notes';
import type { CreateNotePayload, UpdateNotePayload } from '@/types/origin-os';
import { toast } from 'sonner';

export const NOTES_KEY = 'os-notes';

export function useNotes(userId: string) {
  return useQuery({
    queryKey: [NOTES_KEY, userId],
    queryFn: () => notesService.getAll(userId),
    enabled: !!userId,
  });
}

export function useCreateNote(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload?: CreateNotePayload) => notesService.create(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao criar anotação: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      notesService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao salvar anotação: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
      toast.success('Anotação removida');
    },
    onError: (err: any) => toast.error(`Erro ao remover anotação: ${err?.message || err || 'Erro desconhecido'}`),
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      notesService.toggleFavorite(id, isFavorite),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [NOTES_KEY] });
    },
    onError: (err: any) => toast.error(`Erro ao atualizar favorito: ${err?.message || err || 'Erro desconhecido'}`),
  });
}
