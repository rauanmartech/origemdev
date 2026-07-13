import { osDb } from './client';
import type { ContentItem, CreateContentPayload } from '@/types/origin-os';

export const contentService = {
  async getAll(userId: string): Promise<ContentItem[]> {
    const { data, error } = await osDb
      .from('content_calendar')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateContentPayload): Promise<ContentItem> {
    const { data, error } = await osDb
      .from('content_calendar')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: Partial<CreateContentPayload & { published_at: string }>): Promise<ContentItem> {
    const { data, error } = await osDb
      .from('content_calendar')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('content_calendar').delete().eq('id', id);
    if (error) throw error;
  },

  async publish(id: string): Promise<ContentItem> {
    const { data, error } = await osDb
      .from('content_calendar')
      .update({ status: 'publicado', published_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async countByPeriod(userId: string, startDate: string, endDate: string): Promise<number> {
    const { count, error } = await osDb
      .from('content_calendar')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'publicado')
      .gte('published_at', startDate)
      .lte('published_at', endDate);
    if (error) throw error;
    return count ?? 0;
  },
};
