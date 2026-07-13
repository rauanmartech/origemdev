import { osDb } from './client';
import type {
  FinancialEntry,
  CreateEntryPayload,
  FinancialExpense,
  CreateExpensePayload,
  Investment,
  CreateInvestmentPayload,
} from '@/types/origin-os';
import { goalsService } from './goals';

// =====================================================
// Financial Entries
// =====================================================
export const entriesService = {
  async getAll(userId: string): Promise<FinancialEntry[]> {
    const { data, error } = await osDb
      .from('financial_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getByMonth(userId: string, year: number, month: number): Promise<FinancialEntry[]> {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = new Date(year, month, 0).toISOString().split('T')[0]; // last day of month
    const { data, error } = await osDb
      .from('financial_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateEntryPayload): Promise<FinancialEntry> {
    const { data, error } = await osDb
      .from('financial_entries')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: Partial<CreateEntryPayload>): Promise<FinancialEntry> {
    const { data, error } = await osDb
      .from('financial_entries')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('financial_entries').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================================================
// Financial Expenses
// =====================================================
export const expensesService = {
  async getAll(userId: string): Promise<FinancialExpense[]> {
    const { data, error } = await osDb
      .from('financial_expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getByMonth(userId: string, year: number, month: number): Promise<FinancialExpense[]> {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const end = new Date(year, month, 0).toISOString().split('T')[0];
    const { data, error } = await osDb
      .from('financial_expenses')
      .select('*')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async create(userId: string, payload: CreateExpensePayload): Promise<FinancialExpense> {
    const { data, error } = await osDb
      .from('financial_expenses')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, payload: Partial<CreateExpensePayload>): Promise<FinancialExpense> {
    const { data, error } = await osDb
      .from('financial_expenses')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await osDb.from('financial_expenses').delete().eq('id', id);
    if (error) throw error;
  },
};

// =====================================================
// Investments
// =====================================================
export const investmentsService = {
  async getAll(userId: string): Promise<Investment[]> {
    const { data, error } = await osDb
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getTotalPatrimony(userId: string): Promise<number> {
    const { data, error } = await osDb
      .from('investments')
      .select('value')
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + Number(row.value), 0);
  },

  async create(userId: string, payload: CreateInvestmentPayload): Promise<Investment> {
    const { data, error } = await osDb
      .from('investments')
      .insert({ ...payload, user_id: userId })
      .select()
      .single();
    if (error) throw error;

    // Update goal's invested_value if goal_id is provided
    if (payload.goal_id) {
      const allInvestments = await this.getAll(userId);
      const goalTotal = allInvestments
        .filter(i => i.goal_id === payload.goal_id)
        .reduce((sum, i) => sum + Number(i.value), 0) + Number(payload.value);

      await goalsService.updateInvested(payload.goal_id, goalTotal);
    }

    return data;
  },

  async delete(userId: string, id: string, goalId?: string | null): Promise<void> {
    const { error } = await osDb.from('investments').delete().eq('id', id);
    if (error) throw error;

    // Recalculate goal invested value
    if (goalId) {
      const allInvestments = await this.getAll(userId);
      const goalTotal = allInvestments
        .filter(i => i.goal_id === goalId)
        .reduce((sum, i) => sum + Number(i.value), 0);
      await goalsService.updateInvested(goalId, goalTotal);
    }
  },
};
