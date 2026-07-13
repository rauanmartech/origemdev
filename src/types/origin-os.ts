// =====================================================
// ORIGIN OS — Types & Interfaces
// =====================================================

export type GoalStatus = 'active' | 'completed' | 'paused';
export type ProspectStatus = 'hoje' | 'prospectado' | 'nao_prospectado';
export type FollowUpStatus =
  | 'aguardando'
  | 'respondeu'
  | 'nao_respondeu'
  | 'reuniao'
  | 'proposta_enviada'
  | 'fechado'
  | 'encerrado';
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';
export type DevTaskStatus = 'backlog' | 'fazendo' | 'revisao' | 'concluido';
export type ImprovementStatus = 'pendente' | 'em_andamento' | 'concluido';
export type ImprovementCategory =
  | 'marketing'
  | 'comercial'
  | 'portfolio'
  | 'site'
  | 'processos'
  | 'automacoes'
  | 'financeiro'
  | 'templates';
export type ContentStatus = 'ideia' | 'escrevendo' | 'produzindo' | 'publicado';
export type EntryStatus = 'pendente' | 'recebido';

// =====================================================
// Goal
// =====================================================
export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  target_value: number;
  invested_value: number;
  start_date: string;
  end_date: string;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalPayload {
  name: string;
  description?: string;
  target_value: number;
  start_date: string;
  end_date: string;
  status?: GoalStatus;
}

export interface UpdateGoalPayload extends Partial<CreateGoalPayload> {
  invested_value?: number;
  status?: GoalStatus;
}

// =====================================================
// Daily Priorities
// =====================================================
export interface DailyPriority {
  id: string;
  user_id: string;
  date: string;
  priority_1: string | null;
  priority_2: string | null;
  priority_3: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertDailyPriorityPayload {
  date: string;
  priority_1?: string;
  priority_2?: string;
  priority_3?: string;
}

// =====================================================
// Company
// =====================================================
export interface Company {
  id: string;
  user_id: string;
  name: string;
  responsible: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  site: string | null;
  city: string | null;
  niche: string | null;
  notes: string | null;
  selected_for_today: boolean;
  plan_date: string | null;
  prospect_status: ProspectStatus;
  prospected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyPayload {
  name: string;
  responsible?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  site?: string;
  city?: string;
  niche?: string;
  notes?: string;
  plan_date?: string;
  selected_for_today?: boolean;
}

export interface UpdateCompanyPayload extends Partial<CreateCompanyPayload> {
  prospect_status?: ProspectStatus;
  prospected_at?: string;
}

// =====================================================
// Prospecting History
// =====================================================
export interface ProspectingHistory {
  id: string;
  company_id: string;
  user_id: string;
  from_status: string;
  to_status: string;
  notes: string | null;
  created_at: string;
}

// =====================================================
// Follow Up
// =====================================================
export interface FollowUp {
  id: string;
  user_id: string;
  company_id: string | null;
  company_name: string;
  responsible: string | null;
  phone: string | null;
  whatsapp: string | null;
  niche: string | null;
  notes: string | null;
  status: FollowUpStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFollowUpPayload {
  company_id?: string;
  company_name: string;
  responsible?: string;
  phone?: string;
  whatsapp?: string;
  niche?: string;
  notes?: string;
  status?: FollowUpStatus;
}

export interface UpdateFollowUpPayload extends Partial<CreateFollowUpPayload> {
  position?: number;
}

export interface FollowUpHistory {
  id: string;
  followup_id: string;
  user_id: string;
  from_status: string;
  to_status: string;
  notes: string | null;
  created_at: string;
}

// =====================================================
// Development Task (Produzir)
// =====================================================
export interface DevelopmentTask {
  id: string;
  user_id: string;
  project: string;
  client: string | null;
  description: string | null;
  priority: TaskPriority;
  due_date: string | null;
  status: DevTaskStatus;
  position: number;
  created_at: string;
  updated_at: string;
  task_checklists?: TaskChecklist[];
  task_comments?: TaskComment[];
}

export interface TaskChecklist {
  id: string;
  task_id: string;
  text: string;
  completed: boolean;
  position: number;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CreateDevTaskPayload {
  project: string;
  client?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  status?: DevTaskStatus;
}

export interface UpdateDevTaskPayload extends Partial<CreateDevTaskPayload> {
  position?: number;
}

// =====================================================
// Improvement Task (Construir)
// =====================================================
export interface ImprovementTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: ImprovementCategory;
  due_date: string | null;
  status: ImprovementStatus;
  created_at: string;
  updated_at: string;
  improvement_checklists?: ImprovementChecklist[];
}

export interface ImprovementChecklist {
  id: string;
  task_id: string;
  text: string;
  completed: boolean;
  position: number;
  created_at: string;
}

export interface CreateImprovementPayload {
  title: string;
  description?: string;
  category: ImprovementCategory;
  due_date?: string;
  status?: ImprovementStatus;
}

// =====================================================
// Content Calendar (Autoridade)
// =====================================================
export interface ContentItem {
  id: string;
  user_id: string;
  title: string;
  format: string | null;
  category: string | null;
  objective: string | null;
  idea: string | null;
  status: ContentStatus;
  scheduled_date: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateContentPayload {
  title: string;
  format?: string;
  category?: string;
  objective?: string;
  idea?: string;
  status?: ContentStatus;
  scheduled_date?: string;
}

// =====================================================
// Financial
// =====================================================
export interface FinancialEntry {
  id: string;
  user_id: string;
  client: string;
  project: string | null;
  value: number;
  date: string;
  status: EntryStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateEntryPayload {
  client: string;
  project?: string;
  value: number;
  date: string;
  status?: EntryStatus;
}

export interface FinancialExpense {
  id: string;
  user_id: string;
  category: string;
  description: string | null;
  value: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpensePayload {
  category: string;
  description?: string;
  value: number;
  date: string;
}

export interface Investment {
  id: string;
  user_id: string;
  value: number;
  date: string;
  goal_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvestmentPayload {
  value: number;
  date: string;
  goal_id?: string;
  notes?: string;
}

// =====================================================
// Daily Report (Fechamento do Dia)
// =====================================================
export interface DailyReport {
  id: string;
  user_id: string;
  date: string;
  prospections: number;
  responses: number;
  meetings: number;
  proposals: number;
  revenue: number;
  invested: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpsertDailyReportPayload {
  date: string;
  prospections: number;
  responses: number;
  meetings: number;
  proposals: number;
  revenue: number;
  invested: number;
  notes?: string;
}

// =====================================================
// Note (Anotações)
// =====================================================
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  category: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNotePayload {
  title?: string;
  content?: string;
  category?: string;
  is_favorite?: boolean;
}

export interface UpdateNotePayload extends Partial<CreateNotePayload> {}

// =====================================================
// Dashboard KPIs
// =====================================================
export interface DashboardKPIs {
  revenue: number;
  invested: number;
  patrimony: number;
  prospections: number;
  responses: number;
  meetings: number;
  proposals: number;
  closings: number;
  conversion: number;
  publishedContent: number;
}

export interface DailyChartPoint {
  date: string;
  value: number;
}

export interface FunnelPoint {
  name: string;
  value: number;
}
