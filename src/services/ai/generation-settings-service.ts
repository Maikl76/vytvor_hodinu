
import { supabase } from '@/integrations/supabase/client';

export interface AiGenerationSettings {
  id?: number;
  repetition_frequency_global: number;
  progression_coefficient: number;
  min_pause_between_repetitions: number;
  preparation_exercises_min: number;
  preparation_exercises_max: number;
  main_exercises_min: number;
  main_exercises_max: number;
  finish_exercises_min: number;
  finish_exercises_max: number;
}

/**
 * Načtení nastavení generování AI z databáze
 */
export async function getAiGenerationSettings(): Promise<AiGenerationSettings | null> {
  try {
    const { data, error } = await supabase
      .from('ai_generation_settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching AI generation settings:', error);
      return null;
    }
    
    if (!data) {
      console.log('No AI generation settings found, using defaults');
      // Výchozí nastavení
      return {
        repetition_frequency_global: 3,
        progression_coefficient: 1.5,
        min_pause_between_repetitions: 2,
        preparation_exercises_min: 2,
        preparation_exercises_max: 3,
        main_exercises_min: 3,
        main_exercises_max: 5,
        finish_exercises_min: 2,
        finish_exercises_max: 3
      };
    }
    
    return {
      id: data.id,
      repetition_frequency_global: data.repetition_frequency_global || 3,
      progression_coefficient: data.progression_coefficient || 1.5,
      min_pause_between_repetitions: data.min_pause_between_repetitions || 2,
      preparation_exercises_min: data.preparation_exercises_min || 2,
      preparation_exercises_max: data.preparation_exercises_max || 3,
      main_exercises_min: data.main_exercises_min || 3,
      main_exercises_max: data.main_exercises_max || 5,
      finish_exercises_min: data.finish_exercises_min || 2,
      finish_exercises_max: data.finish_exercises_max || 3
    };
  } catch (error: any) {
    console.error('Error in getAiGenerationSettings:', error);
    return null;
  }
}
