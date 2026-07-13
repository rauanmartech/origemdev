import { osDb } from './client';
import type {
  FollowUp,
  CreateFollowUpPayload,
  UpdateFollowUpPayload,
  FollowUpHistory,
} from '@/types/origin-os';

export const followupsService = {
  async getAll(userId: string): Promise<FollowUp[]> {
    const { data, error } = await osDb
      .from('followups')
      .select('*')
      .eq('user_id', userId)
      .order('status')
      .order('position');
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateFollowUpPayload): Promise<FollowUp> {
    const { data, error } = await osDb
      .from('followups')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(userId: string, followup: FollowUp, payload: UpdateFollowUpPayload): Promise<FollowUp> {
    const statusChanged = payload.status && payload.status !== followup.status;

    const { data, error } = await osDb
      .from('followups')
      .update(payload)
      .eq('id', followup.id)
      .select()
      .single();
    if (error) throw error;

    // Register history if status changed
    if (statusChanged) {
      await osDb.from('followup_history').insert({
        followup_id: followup.id,
        user_id: userId,
        from_status: followup.status,
        to_status: payload.status,
      });
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('followups').delete().eq('id', id);
    if (error) throw error;
  },

  async getHistory(followupId: string): Promise<FollowUpHistory[]> {
    const { data, error } = await osDb
      .from('followup_history')
      .select('*')
      .eq('followup_id', followupId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async reorder(
    userId: string,
    items: { id: string; status: FollowUp['status']; position: number }[],
  ): Promise<void> {
    const updates = items.map(({ id, status, position }) =>
      osDb.from('followups').update({ status, position }).eq('id', id).eq('user_id', userId),
    );
    await Promise.all(updates);
  },
};
