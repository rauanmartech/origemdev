import { osDb } from './client';
import type {
  ImprovementTask,
  CreateImprovementPayload,
  ImprovementChecklist,
} from '@/types/origin-os';

export const improvementTasksService = {
  async getAll(userId: string): Promise<ImprovementTask[]> {
    const { data, error } = await osDb
      .from('improvement_tasks')
      .select('*, improvement_checklists(*)')
      .eq('user_id', userId)
      .order('category')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateImprovementPayload): Promise<ImprovementTask> {
    const { data, error } = await osDb
      .from('improvement_tasks')
      .insert({ ...payload, user_id: userId })
      .select('*, improvement_checklists(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: Partial<CreateImprovementPayload>): Promise<ImprovementTask> {
    const { data, error } = await osDb
      .from('improvement_tasks')
      .update(payload)
      .eq('id', id)
      .select('*, improvement_checklists(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('improvement_tasks').delete().eq('id', id);
    if (error) throw error;
  },

  async addChecklist(taskId: string, text: string, position: number): Promise<ImprovementChecklist> {
    const { data, error } = await osDb
      .from('improvement_checklists')
      .insert({ task_id: taskId, text, position })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleChecklist(id: string, completed: boolean): Promise<void> {
    const { error } = await osDb
      .from('improvement_checklists')
      .update({ completed })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteChecklist(id: string): Promise<void> {
    const { error } = await osDb.from('improvement_checklists').delete().eq('id', id);
    if (error) throw error;
  },
};
