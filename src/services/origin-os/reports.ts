import { osDb } from './client';
import type { DailyReport, UpsertDailyReportPayload } from '@/types/origin-os';

export const reportsService = {
  async getAll(userId: string, limit = 30): Promise<DailyReport[]> {
    const { data, error } = await osDb
      .from('daily_reports')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },

  async getByDate(userId: string, date: string): Promise<DailyReport | null> {
    const { data, error } = await osDb
      .from('daily_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByPeriod(userId: string, startDate: string, endDate: string): Promise<DailyReport[]> {
    const { data, error } = await osDb
      .from('daily_reports')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async upsert(userId: string, payload: UpsertDailyReportPayload): Promise<DailyReport> {
    const { data, error } = await osDb
      .from('daily_reports')
      .upsert(
        { ...payload, user_id: userId },
        { onConflict: 'user_id,date' },
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMonthSummary(userId: string, year: number, month: number) {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = new Date(year, month, 0).toISOString().split('T')[0];
    const reports = await this.getByPeriod(userId, start, end);

    return {
      prospections: reports.reduce((s, r) => s + r.prospections, 0),
      responses: reports.reduce((s, r) => s + r.responses, 0),
      meetings: reports.reduce((s, r) => s + r.meetings, 0),
      proposals: reports.reduce((s, r) => s + r.proposals, 0),
      revenue: reports.reduce((s, r) => s + Number(r.revenue), 0),
      invested: reports.reduce((s, r) => s + Number(r.invested), 0),
      days: reports.length,
    };
  },
};
