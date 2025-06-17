
import { useToast } from '@/hooks/use-toast';
import { LessonExerciseData } from '@/services/aiService';
import { useExerciseItemsLoader } from './useExerciseItemsLoader';
import { createDefaultExerciseForPhase } from '@/utils/exerciseItemUtils';

export function useNewExerciseLoader() {
  const { toast } = useToast();
  const { loadPhaseItems, loadAllPhaseItems, loadMainItemsByConstructAndIds } = useExerciseItemsLoader();

  /**
   * Load exercises for a new lesson
   */
  const loadExercisesForNewLesson = async (lessonData: any): Promise<LessonExerciseData> => {
    console.log("🚀 NEW LESSON LOADER - Loading exercises for new lesson with data:", lessonData);
    
    try {
      // Zkontroluj, zda máme selectedItems v lessonData
      const selectedItems = lessonData.selectedItems || {};
      console.log("🚀 NEW LESSON LOADER - Selected items from lesson data:", selectedItems);
      
      const preparationItemIds = selectedItems.preparationItems || [];
      const mainItemIds = selectedItems.mainItems || [];
      const finishItemIds = selectedItems.finishItems || [];
      
      console.log("🚀 NEW LESSON LOADER - Selected item IDs:", {
        preparation: preparationItemIds,
        main: mainItemIds,
        finish: finishItemIds
      });

      // Pokud nemáme žádné vybrané položky, vytvoř výchozí cvičení
      if (preparationItemIds.length === 0 && mainItemIds.length === 0 && finishItemIds.length === 0) {
        console.log("🚀 NEW LESSON LOADER - No items selected, creating default exercises");
        return {
          preparation: [createDefaultExerciseForPhase('preparation', lessonData.preparationTime || 10)],
          main: [createDefaultExerciseForPhase('main', lessonData.mainTime || 25)],
          finish: [createDefaultExerciseForPhase('finish', lessonData.finishTime || 10)]
        };
      }

      // Načti dostupné položky pro preparation a finish (nejsou závislé na konstruktu)
      const { preparationItems, finishItems } = await loadAllPhaseItems();
      
      console.log("🚀 NEW LESSON LOADER - Available items loaded:", {
        preparationCount: preparationItems.length,
        finishCount: finishItems.length
      });

      let preparationExercises = [];
      let mainExercises = [];
      let finishExercises = [];

      // Load preparation exercises
      if (preparationItemIds.length > 0) {
        console.log("🚀 NEW LESSON LOADER - Loading preparation exercises from selected IDs");
        preparationExercises = await loadPhaseItems(
          preparationItemIds,
          preparationItems,
          lessonData.preparationTime || 10,
          'preparation'
        );
      } else {
        console.log("🚀 NEW LESSON LOADER - No preparation items selected, using default");
        preparationExercises = [createDefaultExerciseForPhase('preparation', lessonData.preparationTime || 10)];
      }
      
      // Load main exercises
      if (mainItemIds.length > 0) {
        console.log("🚀 NEW LESSON LOADER - Loading main exercises from selected IDs:", mainItemIds);
        
        const constructIdToUse = lessonData.constructId;
        console.log("🚀 NEW LESSON LOADER - Using construct ID:", constructIdToUse);
        
        mainExercises = await loadMainItemsByConstructAndIds(
          constructIdToUse,
          mainItemIds,
          lessonData.mainTime || 25
        );
      } else {
        console.log("🚀 NEW LESSON LOADER - No main items selected, using default");
        mainExercises = [createDefaultExerciseForPhase('main', lessonData.mainTime || 25)];
      }
      
      // Load finish exercises
      if (finishItemIds.length > 0) {
        console.log("🚀 NEW LESSON LOADER - Loading finish exercises from selected IDs");
        finishExercises = await loadPhaseItems(
          finishItemIds,
          finishItems,
          lessonData.finishTime || 10,
          'finish'
        );
      } else {
        console.log("🚀 NEW LESSON LOADER - No finish items selected, using default");
        finishExercises = [createDefaultExerciseForPhase('finish', lessonData.finishTime || 10)];
      }
      
      // Create final exercise data
      const finalExercises = {
        preparation: preparationExercises,
        main: mainExercises,
        finish: finishExercises
      };
      
      console.log("🚀 NEW LESSON LOADER - FINAL RESULT - Generated exercises for new lesson:", finalExercises);
      return finalExercises;
      
    } catch (error) {
      console.error("🚀 NEW LESSON LOADER - ERROR - Error generating exercises:", error);
      
      // Return default exercises for all phases if there's an error
      return {
        preparation: [createDefaultExerciseForPhase('preparation', lessonData.preparationTime || 10)],
        main: [createDefaultExerciseForPhase('main', lessonData.mainTime || 25)],
        finish: [createDefaultExerciseForPhase('finish', lessonData.finishTime || 10)]
      };
    }
  };

  return {
    loadExercisesForNewLesson
  };
}
