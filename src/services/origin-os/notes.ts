import { osDb } from './client';
import type { Note, CreateNotePayload, UpdateNotePayload } from '@/types/origin-os';

export const notesService = {
  async getAll(userId: string): Promise<Note[]> {
    const { data, error } = await osDb
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Note | null> {
    const { data, error } = await osDb
      .from('notes')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(userId: string, payload: CreateNotePayload = {}): Promise<Note> {
    const { data, error } = await osDb
      .from('notes')
      .insert({
        user_id: userId,
        title: payload.title ?? 'Nova Anotação',
        content: payload.content ?? '',
        category: payload.category ?? 'Geral',
        is_favorite: payload.is_favorite ?? false,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: UpdateNotePayload): Promise<Note> {
    const { data, error } = await osDb
      .from('notes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('notes').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    const { error } = await osDb
      .from('notes')
      .update({ is_favorite: isFavorite })
      .eq('id', id);
    if (error) throw error;
  },

  async getCategories(userId: string): Promise<string[]> {
    const { data, error } = await osDb
      .from('notes')
      .select('category')
      .eq('user_id', userId);
    if (error) throw error;
    const cats = [...new Set((data ?? []).map(n => n.category).filter(Boolean))] as string[];
    return cats;
  },
};
