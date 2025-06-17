
import { supabase } from '@/integrations/supabase/client';
import { LessonExerciseData } from '../../aiService';

export async function saveLessonToDatabase(
  planId: string,
  week: number,
  lessonNumber: number,
  exercises: LessonExerciseData,
  promptData?: any
) {
  try {
    console.log(`💾 Ukládám hodinu ${week}-${lessonNumber} do databáze...`);
    
    // Převedeme data na JSON kompatibilní formát
    const lessonData = JSON.parse(JSON.stringify({
      exercises,
      promptData
    }));
    
    // Zkontrolujeme, zda hodina již existuje
    const { data: existing } = await supabase
      .from('weekly_plan_lessons')
      .select('id')
      .eq('plan_id', planId)
      .eq('week_number', week)
      .eq('lesson_number', lessonNumber)
      .maybeSingle();
    
    if (existing) {
      // Aktualizujeme existující hodinu
      const { error: updateError } = await supabase
        .from('weekly_plan_lessons')
        .update({
          lesson_data: lessonData
        })
        .eq('plan_id', planId)
        .eq('week_number', week)
        .eq('lesson_number', lessonNumber);
      
      if (updateError) {
        console.error('❌ Chyba při aktualizaci hodiny:', updateError);
        throw updateError;
      }
      
      console.log(`✅ Hodina ${week}-${lessonNumber} aktualizována v databázi`);
    } else {
      // Vytvoříme novou hodinu
      const { error: insertError } = await supabase
        .from('weekly_plan_lessons')
        .insert({
          plan_id: planId,
          week_number: week,
          lesson_number: lessonNumber,
          lesson_data: lessonData
        });
      
      if (insertError) {
        console.error('❌ Chyba při vkládání hodiny:', insertError);
        throw insertError;
      }
      
      console.log(`✅ Hodina ${week}-${lessonNumber} vložena do databáze`);
    }
  } catch (error) {
    console.error('❌ Chyba při ukládání hodiny do databáze:', error);
    // Neházeme chybu dál, protože hodina byla vygenerována úspěšně
  }
}
