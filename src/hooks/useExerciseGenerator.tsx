
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';
import { LessonExerciseData } from '@/services/aiService';
import { useHistoryExerciseLoader } from './useHistoryExerciseLoader';
import { useNewExerciseLoader } from './useNewExerciseLoader';
import { createDefaultExerciseForPhase } from '@/utils/exerciseItemUtils';

export function useExerciseGenerator() {
  const { toast } = useToast();
  const [exerciseData, setExerciseData] = useState<LessonExerciseData>({
    preparation: [] as ExerciseItem[],
    main: [] as ExerciseItem[],
    finish: [] as ExerciseItem[],
  });

  // Load specialized loaders
  const { loadExercisesForHistoryLesson } = useHistoryExerciseLoader();
  const { loadExercisesForNewLesson } = useNewExerciseLoader();

  /**
   * Load exercises for a history lesson
   */
  const handleLoadExercisesForHistoryLesson = async (lessonData: any) => {
    try {
      const exercises = await loadExercisesForHistoryLesson(lessonData);
      setExerciseData(exercises);
    } catch (error) {
      console.error("Error loading history lesson exercises:", error);
      
      // Create default exercises if there's an error
      setExerciseData({
        preparation: [createDefaultExerciseForPhase('preparation', lessonData.preparationTime)],
        main: [createDefaultExerciseForPhase('main', lessonData.mainTime)],
        finish: [createDefaultExerciseForPhase('finish', lessonData.finishTime)]
      });
    }
  };

  /**
   * Load exercises for a new lesson
   */
  const handleLoadExercisesForNewLesson = async (lessonData: any) => {
    try {
      const exercises = await loadExercisesForNewLesson(lessonData);
      setExerciseData(exercises);
    } catch (error) {
      console.error("Error loading new lesson exercises:", error);
      
      // Create default exercises if there's an error
      setExerciseData({
        preparation: [createDefaultExerciseForPhase('preparation', lessonData.preparationTime)],
        main: [createDefaultExerciseForPhase('main', lessonData.mainTime)],
        finish: [createDefaultExerciseForPhase('finish', lessonData.finishTime)]
      });
    }
  };

  return {
    exerciseData,
    setExerciseData,
    loadExercisesForHistoryLesson: handleLoadExercisesForHistoryLesson,
    loadExercisesForNewLesson: handleLoadExercisesForNewLesson
  };
}
