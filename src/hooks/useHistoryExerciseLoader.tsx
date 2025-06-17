
import { useState } from 'react';
import { LessonExerciseData } from '@/services/aiService';
import { getExercisesForLesson } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

export function useHistoryExerciseLoader() {
  const { toast } = useToast();

  const loadExercisesForHistoryLesson = async (lessonData: any): Promise<LessonExerciseData> => {
    try {
      console.log("🔄 Loading exercises for history lesson with data:", lessonData);
      
      if (!lessonData) {
        console.error("❌ No lesson data provided");
        throw new Error("No lesson data provided");
      }

      // First try to get exercises from lesson_data if it exists and has exercises
      if (lessonData.lesson_data && lessonData.lesson_data.exercises) {
        console.log("✅ Found exercises in lesson_data:", lessonData.lesson_data.exercises);
        return lessonData.lesson_data.exercises;
      }

      // If lesson_data exists but doesn't have exercises, try to use exerciseData
      if (lessonData.lesson_data && lessonData.lesson_data.exerciseData) {
        console.log("✅ Found exerciseData in lesson_data:", lessonData.lesson_data.exerciseData);
        return lessonData.lesson_data.exerciseData;
      }

      // Check if we have exerciseData directly on lessonData (from location state)
      if (lessonData.exerciseData) {
        console.log("✅ Found exerciseData directly on lessonData:", lessonData.exerciseData);
        return lessonData.exerciseData;
      }

      // If we have lesson ID, try to fetch from database using the service
      if (lessonData.id) {
        console.log("🔄 Trying to fetch exercises from database for lesson ID:", lessonData.id);
        const exerciseData = await getExercisesForLesson(lessonData.id);
        if (exerciseData) {
          console.log("✅ Loaded exercises from database:", exerciseData);
          return exerciseData;
        }
      }

      // If no exercises found but we have selectedItems, try to reconstruct from that
      if (lessonData.selectedItems && lessonData.selectedItems.length > 0) {
        console.log("🔄 Trying to reconstruct exercises from selectedItems:", lessonData.selectedItems);
        
        // Create exercises based on selected items
        const reconstructedExercises: LessonExerciseData = {
          preparation: [{
            name: 'Rozcvička',
            description: 'Základní rozcvičení celého těla',
            time: lessonData.preparationTime || 10,
            phase: 'preparation'
          }],
          main: lessonData.selectedItems.map((item: any, index: number) => ({
            name: item.name || `Aktivita ${index + 1}`,
            description: item.description || 'Cvičení z vybraných aktivit',
            time: item.duration || Math.floor((lessonData.mainTime || 25) / Math.max(lessonData.selectedItems.length, 1)),
            phase: 'main'
          })),
          finish: [{
            name: 'Zklidňující cvičení',
            description: 'Protažení a reflexe hodiny',
            time: lessonData.finishTime || 10,
            phase: 'finish'
          }]
        };

        console.log("✅ Reconstructed exercises from selectedItems:", reconstructedExercises);
        return reconstructedExercises;
      }

      // If no exercises found, create defaults based on lesson structure
      console.log("⚠️ No exercises found, creating defaults");
      const defaultExercises: LessonExerciseData = {
        preparation: [{
          name: 'Rozcvička',
          description: 'Základní rozcvičení celého těla',
          time: lessonData.preparationTime || 10,
          phase: 'preparation'
        }],
        main: [{
          name: 'Hlavní aktivita',
          description: `Cvičení zaměřené na ${lessonData.construct || 'vybranou dovednost'}`,
          time: lessonData.mainTime || 25,
          phase: 'main'
        }],
        finish: [{
          name: 'Zklidňující cvičení',
          description: 'Protažení a reflexe hodiny',
          time: lessonData.finishTime || 10,
          phase: 'finish'
        }]
      };

      return defaultExercises;
      
    } catch (error) {
      console.error("❌ Error loading exercises for history lesson:", error);
      toast({
        title: "Chyba při načítání cvičení",
        description: "Nepodařilo se načíst cvičení pro tuto hodinu",
        variant: "destructive",
      });
      
      // Return empty structure on error
      return {
        preparation: [],
        main: [],
        finish: []
      };
    }
  };

  return {
    loadExercisesForHistoryLesson
  };
}
