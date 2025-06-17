
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LessonExerciseData } from '@/services/aiService';
import { Json } from '@/integrations/supabase/types';

export function useLessonSaver() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveLessonExercises = async (lessonId: string, exerciseData: LessonExerciseData) => {
    setIsSaving(true);
    try {
      console.log('Saving lesson exercises for lesson ID:', lessonId);
      console.log('Exercise data to save:', exerciseData);

      // Get current lesson data
      const { data: currentLesson, error: fetchError } = await supabase
        .from('lessons')
        .select('lesson_data')
        .eq('id', lessonId)
        .single();

      if (fetchError) {
        console.error('Error fetching current lesson:', fetchError);
        throw fetchError;
      }

      // Safely handle lesson_data which might be null
      const existingLessonData = (currentLesson.lesson_data as Record<string, any>) || {};

      // Convert exercise data to JSON-compatible format
      const exerciseDataJson = exerciseData as unknown as Json;

      // Update lesson_data with new exercises
      const updatedLessonData: Json = {
        ...existingLessonData,
        exercises: exerciseDataJson,
        exerciseData: exerciseDataJson // Keep both for compatibility
      };

      // Save updated exercises to the lesson
      const { error: updateError } = await supabase
        .from('lessons')
        .update({ 
          lesson_data: updatedLessonData
        })
        .eq('id', lessonId);

      if (updateError) {
        console.error('Error updating lesson exercises:', updateError);
        throw updateError;
      }

      toast({
        title: "Cvičení uložena",
        description: "Změny v cvičeních byly úspěšně uloženy.",
      });

      return true;
    } catch (error) {
      console.error('Error saving lesson exercises:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny v cvičeních.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveLessonExercises,
    isSaving
  };
}
