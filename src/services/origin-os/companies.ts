import { osDb } from './client';
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  DailyPriority,
  UpsertDailyPriorityPayload,
} from '@/types/origin-os';
import { followupsService } from './followups';

export const companiesService = {
  async getAll(userId: string): Promise<Company[]> {
    const { data, error } = await osDb
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getForToday(userId: string, date: string): Promise<Company[]> {
    const { data, error } = await osDb
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_date', date)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateCompanyPayload): Promise<Company> {
    const { data, error } = await osDb
      .from('companies')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: UpdateCompanyPayload): Promise<Company> {
    const { data, error } = await osDb
      .from('companies')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('companies').delete().eq('id', id);
    if (error) throw error;
  },

  async markAsProspected(userId: string, company: Company): Promise<void> {
    const now = new Date().toISOString();

    // Update company status
    const { error: updateError } = await osDb
      .from('companies')
      .update({
        prospect_status: 'prospectado',
        prospected_at: now,
      })
      .eq('id', company.id);
    if (updateError) throw updateError;

    // Register history
    const { error: historyError } = await osDb
      .from('prospecting_history')
      .insert({
        company_id: company.id,
        user_id: userId,
        from_status: company.prospect_status,
        to_status: 'prospectado',
      });
    if (historyError) throw historyError;

    // Automatically create follow up
    await followupsService.create(userId, {
      company_id: company.id,
      company_name: company.name,
      responsible: company.responsible ?? undefined,
      phone: company.phone ?? undefined,
      whatsapp: company.whatsapp ?? undefined,
      niche: company.niche ?? undefined,
      notes: company.notes ?? undefined,
      status: 'aguardando',
    });
  },

  async updateStatus(
    userId: string,
    company: Company,
    newStatus: Company['prospect_status'],
  ): Promise<void> {
    const { error } = await osDb
      .from('companies')
      .update({ prospect_status: newStatus })
      .eq('id', company.id);
    if (error) throw error;

    // Log history
    await osDb.from('prospecting_history').insert({
      company_id: company.id,
      user_id: userId,
      from_status: company.prospect_status,
      to_status: newStatus,
    });
  },
};

export const prioritiesService = {
  async getByDate(userId: string, date: string): Promise<DailyPriority | null> {
    const { data, error } = await osDb
      .from('daily_priorities')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async upsert(userId: string, payload: UpsertDailyPriorityPayload): Promise<DailyPriority> {
    const { data, error } = await osDb
      .from('daily_priorities')
      .upsert(
        { ...payload, user_id: userId },
        { onConflict: 'user_id,date' },
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
