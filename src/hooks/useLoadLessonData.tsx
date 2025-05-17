
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LessonExerciseData } from '@/services/aiService';
import { useEquipmentLoader } from './useEquipmentLoader';
import { useExerciseGenerator } from './useExerciseGenerator';
import { useHistoryLessonLoader } from './useHistoryLessonLoader';

export function useLoadLessonData(params: any, locationLessonData: any) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lessonData, setLessonData] = useState<any>(locationLessonData);
  
  // Load equipment related functionality
  const { 
    equipmentNames, 
    setEquipmentNames, 
    loadEquipmentNames 
  } = useEquipmentLoader();
  
  // Load exercise generation functionality
  const { 
    exerciseData, 
    setExerciseData, 
    loadExercisesForHistoryLesson,
    loadExercisesForNewLesson 
  } = useExerciseGenerator();
  
  // Load history lesson loading functionality
  const { 
    loadLessonFromHistory, 
    isLoading, 
    setIsLoading 
  } = useHistoryLessonLoader();
  
  // Check if viewing existing lesson from history
  const isViewingHistoryLesson = params.id !== undefined;

  /**
   * Load data for new lesson from location state
   */
  const loadData = async () => {
    if (!lessonData) return;
    
    setIsLoading(true);
    try {
      console.log("Loading new lesson data from state:", lessonData);
      
      // First load equipment names
      await loadEquipmentNames(lessonData.equipment);
      
      // Then load exercises based on the selected items
      await loadExercisesForNewLesson(lessonData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error loading data",
        description: "There was an error loading lesson details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load data based on whether we're viewing history or not
  useEffect(() => {
    if (isViewingHistoryLesson) {
      console.log("Loading lesson from history with ID:", params.id);
      // Load lesson from database by ID
      loadLessonFromHistory(
        params, 
        setLessonData, 
        loadExercisesForHistoryLesson, 
        loadEquipmentNames
      );
    } else if (locationLessonData) {
      console.log("Loading lesson from navigation state with data:", locationLessonData);
      // Use data from navigation state
      setLessonData(locationLessonData);
      loadData();
    } else {
      console.log("No lesson data available, redirecting to create-lesson");
      navigate('/create-lesson');
    }
  }, [isViewingHistoryLesson, locationLessonData, navigate, params?.id]);

  return {
    lessonData,
    setLessonData,
    equipmentNames,
    setEquipmentNames,
    exerciseData,
    setExerciseData,
    isLoading,
    loadEquipmentNames
  };
}
