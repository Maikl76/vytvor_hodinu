
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getLessonById } from '@/services/supabaseService';
import { convertDatabaseLessonToAppFormat } from '@/utils/lessonDataConverters';

export function useHistoryLessonLoader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load lesson from history by ID
   */
  const loadLessonFromHistory = async (
    params: any, 
    setLessonData: React.Dispatch<React.SetStateAction<any>>,
    loadExercisesForHistoryLesson: (lessonData: any) => Promise<void>,
    loadEquipmentNames: (equipmentIds: number[]) => Promise<void>
  ) => {
    if (!params.id) return null;
    
    setIsLoading(true);
    try {
      // Fetch lesson data from the database
      const historyLesson = await getLessonById(params.id);
      
      if (!historyLesson) {
        toast({
          title: "Hodina nenalezena",
          description: "Požadovaná hodina nebyla nalezena v historii.",
          variant: "destructive",
        });
        navigate('/history');
        return null;
      }
      
      console.log("Loaded history lesson from database:", historyLesson);
      
      // Convert database record to application format
      const convertedLessonData = convertDatabaseLessonToAppFormat(historyLesson);
      
      console.log("Converted lesson data for application:", convertedLessonData);
      
      // Update state with the loaded data
      setLessonData(convertedLessonData);
      
      // Load exercises and equipment for this lesson
      await Promise.all([
        loadExercisesForHistoryLesson(convertedLessonData),
        loadEquipmentNames(convertedLessonData.equipment)
      ]);
      
      return convertedLessonData;
    } catch (error) {
      console.error("Error loading lesson from history:", error);
      toast({
        title: "Error loading",
        description: "There was an error loading the lesson from history.",
        variant: "destructive",
      });
      return null;
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
