import { osDb } from './client';
import type { Goal, CreateGoalPayload, UpdateGoalPayload } from '@/types/origin-os';

export const goalsService = {
  async getAll(userId: string): Promise<Goal[]> {
    const { data, error } = await osDb
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getActive(userId: string): Promise<Goal | null> {
    const { data, error } = await osDb
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(userId: string, payload: CreateGoalPayload): Promise<Goal> {
    const { data, error } = await osDb
      .from('goals')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: UpdateGoalPayload): Promise<Goal> {
    const { data, error } = await osDb
      .from('goals')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('goals').delete().eq('id', id);
    if (error) throw error;
  },

  async updateInvested(id: string, investedValue: number): Promise<void> {
    const { error } = await osDb
      .from('goals')
      .update({ invested_value: investedValue })
      .eq('id', id);
    if (error) throw error;
  },
};
