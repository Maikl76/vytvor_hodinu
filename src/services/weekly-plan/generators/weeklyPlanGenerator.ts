
import { generateAILessonPlan } from '../../ai';
import { WeeklyPlanLessonData } from '../types';
import { hasExercises, isValidLessonData } from '../typeGuards';
import { getWeeklyPlanData } from '../dataLoader';
import { createAIRequest } from '../requestBuilder';
import { saveLessonToDatabase } from './databaseHelpers';
import { supabase } from '@/integrations/supabase/client';

export async function generateWeeklyPlan(
  weeklyPlanId: string,
  weeksCount: number,
  lessonsPerWeek: number,
  onLessonGenerated?: (lessonData: WeeklyPlanLessonData) => void,
  onLessonGenerating?: (week: number, lessonNumber: number) => void
): Promise<Record<string, WeeklyPlanLessonData>> {
  const result: Record<string, WeeklyPlanLessonData> = {};
  
  console.log('🚀 ZAČÍNÁM POSTUPNÉ GENEROVÁNÍ VÍCE TÝDENNÍHO PLÁNU S AI KONTEXTEM');
  
  // Načteme data plánu pro AI
  const planData = await getWeeklyPlanData(weeklyPlanId);
  
  // Zkontrolujeme, zda již nějaké hodiny existují
  const { data: existingLessons, error: fetchError } = await supabase
    .from('weekly_plan_lessons')
    .select('week_number, lesson_number, lesson_data')
    .eq('plan_id', weeklyPlanId)
    .order('week_number', { ascending: true })
    .order('lesson_number', { ascending: true });
  
  if (fetchError) {
    console.error("Error fetching existing weekly plan lessons:", fetchError);
  }
  
  // Přidáme existující hodiny do výsledku
  if (existingLessons && isValidLessonData(existingLessons)) {
    existingLessons.forEach(lesson => {
      const key = `${lesson.week_number}-${lesson.lesson_number}`;
      const lessonData = lesson.lesson_data;
      
      const exercises = lessonData && hasExercises(lessonData) 
        ? lessonData.exercises 
        : undefined;
      
      result[key] = {
        week: lesson.week_number,
        lessonNumber: lesson.lesson_number,
        exercises
      };
    });
  }
  
  // Vygenerujeme pouze první hodinu automaticky
  const firstLessonKey = '1-1';
  if (!result[firstLessonKey] || !result[firstLessonKey].exercises) {
    if (onLessonGenerating) {
      onLessonGenerating(1, 1);
    }
    
    result[firstLessonKey] = {
      week: 1,
      lessonNumber: 1,
      isGenerating: true
    };
    
    try {
      console.log('🤖 GENERUJI PRVNÍ HODINU TÝDNE 1 JAKO ZÁKLAD PRO PROGRESIVNÍ PLÁNOVÁNÍ');
      
      const aiRequest = await createAIRequest(planData, 1, 1, weeklyPlanId, []);
      const aiResult = await generateAILessonPlan(aiRequest);
      
      if (!aiResult) {
        throw new Error('AI generování selhalo');
      }
      
      result[firstLessonKey] = {
        week: 1,
        lessonNumber: 1,
        exercises: aiResult.exercises,
        isGenerating: false,
        promptData: aiResult.promptData
      };
      
      // Uložíme první hodinu do databáze
      await saveLessonToDatabase(weeklyPlanId, 1, 1, aiResult.exercises, aiResult.promptData);
      
      console.log('✅ PRVNÍ HODINA VYGENEROVÁNA A ULOŽENA');
      
      if (onLessonGenerated) {
        onLessonGenerated(result[firstLessonKey]);
      }
    } catch (error: any) {
      console.error('❌ CHYBA PŘI AI GENEROVÁNÍ PRVNÍ HODINY:', error);
      result[firstLessonKey] = {
        week: 1,
        lessonNumber: 1,
        isGenerating: false,
        error: error.message || "Nastala chyba při generování hodiny"
      };
      
      if (onLessonGenerated) {
        onLessonGenerated(result[firstLessonKey]);
      }
    }
  }
  
  // Vytvoříme prázdné sloty pro zbývající hodiny
  for (let week = 1; week <= weeksCount; week++) {
    for (let lesson = 1; lesson <= lessonsPerWeek; lesson++) {
      const key = `${week}-${lesson}`;
      
      if (!result[key] && !(week === 1 && lesson === 1)) {
        result[key] = {
          week,
          lessonNumber: lesson,
        };
      }
    }
  }
  
  console.log(`📋 VYTVOŘEN PLÁN S ${Object.keys(result).length} HODINAMI`);
  
  return result;
}
