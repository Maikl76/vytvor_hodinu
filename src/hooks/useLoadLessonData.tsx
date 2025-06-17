
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LessonExerciseData } from '@/services/aiService';
import { useHistoryExerciseLoader } from './useHistoryExerciseLoader';
import { useNewExerciseLoader } from './useNewExerciseLoader';
import { useHistoryLessonLoader } from './useHistoryLessonLoader';
import { getEquipment } from '@/services/supabaseService';

export function useLoadLessonData(params: any, locationLessonData: any) {
  const [lessonData, setLessonData] = useState<any>(null);
  const [equipmentNames, setEquipmentNames] = useState<string[]>([]);
  const [exerciseData, setExerciseData] = useState<LessonExerciseData>({
    preparation: [],
    main: [],
    finish: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const { loadExercisesForHistoryLesson } = useHistoryExerciseLoader();
  const { loadExercisesForNewLesson } = useNewExerciseLoader();
  const { loadLessonFromHistory } = useHistoryLessonLoader();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (params.id) {
          // Historická hodina - načti z databáze
          console.log("🔄 Loading history lesson with ID:", params.id);
          
          if (locationLessonData) {
            // Máme data z location state
            console.log("🎯 Using lesson data from location state:", locationLessonData);
            setLessonData(locationLessonData);
            
            const loadedExercises = await loadExercisesForHistoryLesson(locationLessonData);
            setExerciseData(loadedExercises);
            
            if (locationLessonData.equipmentNames) {
              setEquipmentNames(locationLessonData.equipmentNames);
            }
          } else {
            // Nemáme data z location state, načti z databáze
            console.log("🔄 No location data, loading from database");
            await loadLessonFromHistory(
              params,
              setLessonData,
              async (lessonData) => {
                const loadedExercises = await loadExercisesForHistoryLesson(lessonData);
                setExerciseData(loadedExercises);
              }
            );
          }
        } else if (locationLessonData) {
          // Nová hodina - data z location state
          console.log("🆕 Loading new lesson from location state:", locationLessonData);
          setLessonData(locationLessonData);
          
          const loadedExercises = await loadExercisesForNewLesson(locationLessonData);
          console.log("✅ Loaded exercises for new lesson:", loadedExercises);
          setExerciseData(loadedExercises);
          
          if (locationLessonData.equipment && locationLessonData.equipment.length > 0) {
            const allEquipment = await getEquipment();
            const selectedEquipmentNames = allEquipment
              .filter(eq => locationLessonData.equipment.includes(eq.id))
              .map(eq => eq.name);
            setEquipmentNames(selectedEquipmentNames);
          }
        }
        
      } catch (error) {
        console.error("❌ Error loading lesson data:", error);
        toast({
          title: "Chyba při načítání hodiny",
          description: "Nepodařilo se načíst data hodiny",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id]); // Odebrány problematické závislosti

  return {
    lessonData,
    equipmentNames,
    exerciseData,
    setExerciseData,
    isLoading
  };
}
