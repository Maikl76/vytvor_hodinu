
import { generateAILessonPlan } from '../../ai';
import { WeeklyPlanLessonData } from '../types';
import { hasExercises, isValidLessonData } from '../typeGuards';
import { getWeeklyPlanData } from '../dataLoader';
import { createAIRequest } from '../requestBuilder';
import { saveLessonToDatabase } from './databaseHelpers';
import { supabase } from '@/integrations/supabase/client';
import { LessonExerciseData } from '../../aiService';

export async function generateSingleLesson(
  weeklyPlanId: string,
  week: number,
  lessonNumber: number
): Promise<WeeklyPlanLessonData> {
  try {
    console.log(`🤖 GENERUJI JEDNOTLIVOU HODINU ${lessonNumber} V TÝDNU ${week}`);
    
    // Načteme data plánu pro AI
    const planData = await getWeeklyPlanData(weeklyPlanId);
    
    // Načteme VŠECHNY existující hodiny z databáze pro kontext
    const { data: existingLessons, error } = await supabase
      .from('weekly_plan_lessons')
      .select('week_number, lesson_number, lesson_data')
      .eq('plan_id', weeklyPlanId)
      .order('week_number', { ascending: true })
      .order('lesson_number', { ascending: true });
    
    if (error) {
      console.error('❌ Chyba při načítání existujících hodin:', error);
    }
    
    // Připravíme kontext předchozích hodin
    const previousLessonsContext: Array<{
      week: number;
      lesson: number;
      exercises: LessonExerciseData;
    }> = [];
    
    if (existingLessons && isValidLessonData(existingLessons)) {
      console.log(`📚 Načteno ${existingLessons.length} existujících hodin z databáze`);
      
      for (const existingLesson of existingLessons) {
        // Přeskočíme hodiny, které jsou později než ta, kterou generujeme
        if (existingLesson.week_number > week || 
            (existingLesson.week_number === week && existingLesson.lesson_number >= lessonNumber)) {
          continue;
        }
        
        const lessonData = existingLesson.lesson_data;
        const exercises = lessonData && hasExercises(lessonData) 
          ? lessonData.exercises 
          : undefined;
        
        if (exercises) {
          previousLessonsContext.push({
            week: existingLesson.week_number,
            lesson: existingLesson.lesson_number,
            exercises
          });
        }
      }
    }
    
    console.log(`📚 KONTEXT PRO HODINU ${lessonNumber} V TÝDNU ${week}: ${previousLessonsContext.length} předchozích hodin`);
    
    // Vytvoříme AI request s kontextem
    const aiRequest = await createAIRequest(planData, week, lessonNumber, weeklyPlanId, previousLessonsContext);
    
    console.log('🚀 Volám AI s kontextem předchozích hodin...');
    const aiResult = await generateAILessonPlan(aiRequest);
    
    if (!aiResult) {
      throw new Error('AI generování selhalo');
    }
    
    // Uložíme hodinu do databáze
    await saveLessonToDatabase(weeklyPlanId, week, lessonNumber, aiResult.exercises, aiResult.promptData);
    
    console.log(`✅ HODINA ${lessonNumber} V TÝDNU ${week} VYGENEROVÁNA A ULOŽENA`);
    
    return {
      week,
      lessonNumber,
      exercises: aiResult.exercises,
      promptData: aiResult.promptData
    };
  } catch (error: any) {
    console.error(`❌ CHYBA PŘI AI GENEROVÁNÍ JEDNOTLIVÉ HODINY ${lessonNumber} V TÝDNU ${week}:`, error);
    throw error;
  }
}
