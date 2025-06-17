import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { LessonExerciseData } from '../aiService';
import { WeeklyPlanLessonData } from './types';

// Helper function to convert LessonExerciseData to a JSON-compatible format
function convertExercisesToJson(exercises: LessonExerciseData): Json {
  return exercises as unknown as Json;
}

export async function saveWeeklyPlanToDatabase(
  weeklyPlanId: string, 
  lessonsData: Record<string, WeeklyPlanLessonData>
): Promise<boolean> {
  try {
    // First, get all existing lesson records for this plan
    const { data: existingLessons, error: fetchError } = await supabase
      .from('weekly_plan_lessons')
      .select('id, week_number, lesson_number')
      .eq('plan_id', weeklyPlanId);
    
    if (fetchError) {
      console.error("Error fetching existing lessons:", fetchError);
      throw fetchError;
    }
    
    const existingLessonMap = new Map();
    if (existingLessons) {
      existingLessons.forEach((lesson: any) => {
        const key = `${lesson.week_number}-${lesson.lesson_number}`;
        existingLessonMap.set(key, lesson.id);
      });
    }
    
    // Process each lesson
    for (const key in lessonsData) {
      const lessonData = lessonsData[key];
      const [week, lessonNumber] = key.split('-').map(Number);
      
      // Skip lessons without exercises
      if (!lessonData.exercises) continue;
      
      // Convert LessonExerciseData to JSON compatible format
      const lessonDataJson: Json = {
        exercises: convertExercisesToJson(lessonData.exercises)
      };
      
      const lessonRecord = {
        plan_id: weeklyPlanId,
        week_number: week,
        lesson_number: lessonNumber,
        lesson_data: lessonDataJson
      };
      
      // If the lesson exists, update it
      if (existingLessonMap.has(key)) {
        const lessonId = existingLessonMap.get(key);
        
        const { error: updateError } = await supabase
          .from('weekly_plan_lessons')
          .update(lessonRecord)
          .eq('id', lessonId);
        
        if (updateError) {
          console.error(`Error updating lesson ${key}:`, updateError);
          throw updateError;
        }
      } 
      // Otherwise, insert a new record
      else {
        const { error: insertError } = await supabase
          .from('weekly_plan_lessons')
          .insert([lessonRecord]);
        
        if (insertError) {
          console.error(`Error inserting lesson ${key}:`, insertError);
          throw insertError;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving weekly plan:", error);
    return false;
  }
}
