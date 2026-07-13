import { osDb } from './client';
import type {
  DevelopmentTask,
  CreateDevTaskPayload,
  UpdateDevTaskPayload,
  TaskChecklist,
  TaskComment,
} from '@/types/origin-os';

export const devTasksService = {
  async getAll(userId: string): Promise<DevelopmentTask[]> {
    const { data, error } = await osDb
      .from('development_tasks')
      .select('*, task_checklists(*), task_comments(*)')
      .eq('user_id', userId)
      .order('status')
      .order('position');
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateDevTaskPayload): Promise<DevelopmentTask> {
    // Get max position for the column
    const { data: existing } = await osDb
      .from('development_tasks')
      .select('position')
      .eq('user_id', userId)
      .eq('status', payload.status ?? 'backlog')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const position = existing ? existing.position + 1 : 0;

    const { data, error } = await osDb
      .from('development_tasks')
      .insert({ ...payload, user_id: userId, position })
      .select('*, task_checklists(*), task_comments(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: UpdateDevTaskPayload): Promise<DevelopmentTask> {
    const { data, error } = await osDb
      .from('development_tasks')
      .update(payload)
      .eq('id', id)
      .select('*, task_checklists(*), task_comments(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('development_tasks').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(
    items: { id: string; status: DevelopmentTask['status']; position: number }[],
  ): Promise<void> {
    const updates = items.map(({ id, status, position }) =>
      osDb.from('development_tasks').update({ status, position }).eq('id', id),
    );
    await Promise.all(updates);
  },

  // Checklists
  async addChecklist(taskId: string, text: string, position: number): Promise<TaskChecklist> {
    const { data, error } = await osDb
      .from('task_checklists')
      .insert({ task_id: taskId, text, position })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleChecklist(id: string, completed: boolean): Promise<void> {
    const { error } = await osDb
      .from('task_checklists')
      .update({ completed })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteChecklist(id: string): Promise<void> {
    const { error } = await osDb.from('task_checklists').delete().eq('id', id);
    if (error) throw error;
  },

  // Comments
  async addComment(taskId: string, userId: string, content: string): Promise<TaskComment> {
    const { data, error } = await osDb
      .from('task_comments')
      .insert({ task_id: taskId, user_id: userId, content })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteComment(id: string): Promise<void> {
    const { error } = await osDb.from('task_comments').delete().eq('id', id);
    if (error) throw error;
  },
};
