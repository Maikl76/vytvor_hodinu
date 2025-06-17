
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveWeeklyPlanToDatabase } from '@/services/weekly-plan/databasePersistence';
import { LessonExerciseData } from '@/services/aiService';
import { WeeklyPlanLessonData } from '@/services/weekly-plan/types';

export function useWeeklyPlanSaver() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveWeeklyPlanExercises = async (
    planId: string, 
    lessonsData: Record<string, WeeklyPlanLessonData>
  ) => {
    setIsSaving(true);
    try {
      console.log('Saving weekly plan exercises for plan ID:', planId);
      console.log('Lessons data to save:', lessonsData);

      const success = await saveWeeklyPlanToDatabase(planId, lessonsData);

      if (success) {
        toast({
          title: "Plán uložen",
          description: "Změny v týdenním plánu byly úspěšně uloženy.",
        });
        return true;
      } else {
        throw new Error("Failed to save weekly plan");
      }
    } catch (error) {
      console.error('Error saving weekly plan exercises:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny v týdenním plánu.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveWeeklyPlanExercises,
    isSaving
  };
}
