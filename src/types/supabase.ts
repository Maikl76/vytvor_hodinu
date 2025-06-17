

// Custom type definitions for Supabase data
export interface ConstructItemRow {
  id: number;
  name: string;
  description: string | null;
  duration: number;
  construct_id: number | null;
  phase: string | null;
}

export interface LessonRow {
  id: string;
  school_id?: number | null;
  environment_id?: number | null;
  construct_id?: number | null;
  preparation_time: number;
  main_time: number;
  finish_time: number;
  preparation_role_id?: number | null;
  main_role_id?: number | null;
  finish_role_id?: number | null;
  title: string;
  created_at?: string | null;
  equipment_ids?: number[];
  item_ids?: number[];
  grade: number;
}

export interface RoleType {
  id?: number;
  name?: string;
}

// Nový typ pro více týdenní plány
export interface WeeklyPlanRow {
  id: string;
  title: string;
  school_id: number | null;
  grade: number;
  weeks_count: number;
  lessons_per_week: number;
  created_at: string;
  environments?: number[];
}

export interface WeeklyPlanEnvironmentRow {
  id: number;
  plan_id: string;
  environment_id: number;
}

export interface WeeklyPlanLessonRow {
  id: number;
  plan_id: string;
  lesson_id: string | null;
  week_number: number;
  lesson_number: number;
}

