
import { useState } from 'react';
import { LessonExerciseData } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { useHistoryExerciseLoader } from './useHistoryExerciseLoader';
import { useNewExerciseLoader } from './useNewExerciseLoader';

export function useExerciseGenerator() {
  const [exerciseData, setExerciseData] = useState<LessonExerciseData>({
    preparation: [],
    main: [],
    finish: []
  });
  
  const { toast } = useToast();
  const { loadExercisesForHistoryLesson: loadHistoryExercises } = useHistoryExerciseLoader();
  const { loadExercisesForNewLesson } = useNewExerciseLoader();

  // Load exercises for history lesson - use the dedicated history loader
  const loadExercisesForHistoryLesson = async (lessonData: any) => {
    try {
      console.log("Loading exercises for history lesson", lessonData);
      
      if (!lessonData) {
        console.error("No lesson data provided");
        return;
      }

      // Use the dedicated history exercise loader
      const loadedExercises = await loadHistoryExercises(lessonData);
      
      console.log("Loaded exercises formatted:", loadedExercises);
      setExerciseData(loadedExercises);
      
    } catch (error) {
      console.error("Error loading exercises for history lesson:", error);
      toast({
        title: "Chyba při načítání cvičení",
        description: "Nepodařilo se načíst cvičení pro tuto hodinu",
        variant: "destructive",
      });
    }
  };
  
  // Load exercises from selected items for new lesson
  const loadExercisesForNewLessonWrapper = async (lessonData: any) => {
    try {
      console.log("Loading exercises for new lesson with data:", lessonData);
      
      const loadedExercises = await loadExercisesForNewLesson(lessonData);
      
      console.log("Loaded exercises for new lesson:", loadedExercises);
      setExerciseData(loadedExercises);
      
    } catch (error) {
      console.error("Error loading exercises for new lesson:", error);
      toast({
        title: "Chyba při načítání cvičení",
        description: "Nepodařilo se načíst cvičení pro tuto hodinu",
        variant: "destructive",
      });
    }
  };
  
  return {
    exerciseData,
    setExerciseData,
    loadExercisesForHistoryLesson,
    loadExercisesForNewLesson: loadExercisesForNewLessonWrapper
  };
}
