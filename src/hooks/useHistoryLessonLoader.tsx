
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getLessonById } from '@/services/supabaseService';
import { convertDatabaseLessonToAppFormat } from '@/utils/lessonDataConverters';

export function useHistoryLessonLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadLessonFromHistory = async (
    params: any,
    setLessonData: (data: any) => void,
    onExercisesLoaded: (lessonData: any) => Promise<void>
  ) => {
    if (!params?.id) {
      console.log("❌ No lesson ID provided");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log("🔄 Loading lesson from history with ID:", params.id);
      
      const historyLesson = await getLessonById(params.id);
      
      if (!historyLesson) {
        console.error("❌ Lesson not found in history");
        toast({
          title: "Hodina nenalezena",
          description: "Požadovaná hodina nebyla nalezena v historii.",
          variant: "destructive",
        });
        navigate('/history');
        return;
      }

      console.log("✅ Raw history lesson data:", historyLesson);
      console.log("✅ Raw equipment data from DB:", historyLesson.lesson_equipment);
      
      // Convert database lesson to app format
      const lessonData = convertDatabaseLessonToAppFormat(historyLesson);
      console.log("✅ Converted lesson data:", lessonData);
      console.log("✅ Equipment names from converted data:", lessonData.equipmentNames);
      
      // Set lesson data first
      setLessonData(lessonData);
      
      // Prepare comprehensive lesson data for exercise loading
      const comprehensiveLessonData = {
        ...lessonData,
        lesson_data: historyLesson.lesson_data,
        selectedItems: lessonData.selectedItems || [],
        exerciseData: historyLesson.lesson_data && typeof historyLesson.lesson_data === 'object' && historyLesson.lesson_data !== null
          ? (historyLesson.lesson_data as any).exerciseData || (historyLesson.lesson_data as any).exercises
          : undefined
      };
      
      console.log("✅ Comprehensive lesson data for exercise loading:", comprehensiveLessonData);
      
      // Load exercises with comprehensive data
      await onExercisesLoaded(comprehensiveLessonData);
      
    } catch (error) {
      console.error('❌ Error loading lesson from history:', error);
      toast({
        title: "Chyba při načítání",
        description: "Nepodařilo se načíst hodinu z historie.",
        variant: "destructive",
      });
      navigate('/history');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loadLessonFromHistory,
    isLoading,
    setIsLoading
  };
}
