
import { supabase } from '@/integrations/supabase/client';

export interface FavoriteExercise {
  id: string;
  name: string;
  description: string | null;
  time: number;
  phase: 'preparation' | 'main' | 'finish';
  created_at: string;
  updated_at: string;
}

export const getFavoriteExercises = async (): Promise<FavoriteExercise[]> => {
  const { data, error } = await supabase
    .from('favorite_exercises')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorite exercises:', error);
    return [];
  }

  return (data || []) as FavoriteExercise[];
};

export const getFavoriteExercisesByPhase = async (phase: string): Promise<FavoriteExercise[]> => {
  const { data, error } = await supabase
    .from('favorite_exercises')
    .select('*')
    .eq('phase', phase)
    .order('name');

  if (error) {
    console.error('Error fetching favorite exercises by phase:', error);
    return [];
  }

  return (data || []) as FavoriteExercise[];
};

export const createFavoriteExercise = async (exercise: Omit<FavoriteExercise, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
  const { error } = await supabase
    .from('favorite_exercises')
    .insert([exercise]);

  if (error) {
    console.error('Error creating favorite exercise:', error);
    return false;
  }

  return true;
};

export const updateFavoriteExercise = async (id: string, exercise: Partial<FavoriteExercise>): Promise<boolean> => {
  const { error } = await supabase
    .from('favorite_exercises')
    .update({ ...exercise, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating favorite exercise:', error);
    return false;
  }

  return true;
};

export const deleteFavoriteExercise = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('favorite_exercises')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting favorite exercise:', error);
    return false;
  }

  return true;
};

export const searchFavoriteExercises = async (searchTerm: string, phase?: string): Promise<FavoriteExercise[]> => {
  let query = supabase
    .from('favorite_exercises')
    .select('*')
    .ilike('name', `%${searchTerm}%`);

  if (phase) {
    query = query.eq('phase', phase);
  }

  const { data, error } = await query.order('name');

  if (error) {
    console.error('Error searching favorite exercises:', error);
    return [];
  }

  return (data || []) as FavoriteExercise[];
};
