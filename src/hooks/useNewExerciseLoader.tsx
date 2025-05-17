
import { useToast } from '@/hooks/use-toast';
import { LessonExerciseData } from '@/services/aiService';
import { useExerciseItemsLoader } from './useExerciseItemsLoader';
import { createDefaultExerciseForPhase } from '@/utils/exerciseItemUtils';

export function useNewExerciseLoader() {
  const { toast } = useToast();
  const { loadPhaseItems, loadAllPhaseItems } = useExerciseItemsLoader();

  /**
   * Load exercises for a new lesson
   */
  const loadExercisesForNewLesson = async (lessonData: any): Promise<LessonExerciseData> => {
    console.log("Loading exercises for new lesson with data:", lessonData);
    
    try {
      // Load all items for all phases
      const { preparationItems, mainItems, finishItems } = await loadAllPhaseItems();
      
      // Get phase-specific item selections from lessonData
      const selectedItems = lessonData.selectedItems || {};
      const preparationItemIds = selectedItems.preparationItems || [];
      const mainItemIds = selectedItems.mainItems || [];
      const finishItemIds = selectedItems.finishItems || [];
      
      console.log("Selected item IDs:", {
        preparation: preparationItemIds,
        main: mainItemIds,
        finish: finishItemIds
      });
      
      // Generate exercises for preparation phase
      const preparationExercises = await loadPhaseItems(
        preparationItemIds,
        preparationItems,
        lessonData.preparationTime,
        'preparation'
      );
      
      // Generate exercises for main phase
      console.log("About to generate main exercises with:", {
        mainItemIds,
        mainItems: mainItems?.length || 0,
        mainTime: lessonData.mainTime
      });
      
      const mainExercises = await loadPhaseItems(
        mainItemIds,
        mainItems,
        lessonData.mainTime,
        'main'
      );
      
      console.log("Generated main exercises:", mainExercises);
      
      // Generate exercises for finish phase
      const finishExercises = await loadPhaseItems(
        finishItemIds,
        finishItems,
        lessonData.finishTime,
        'finish'
      );
      
      // Create final exercise data
      const finalExercises = {
        preparation: preparationExercises,
        main: mainExercises,
        finish: finishExercises
      };
      
      console.log("Final exercises for new lesson:", finalExercises);
      return finalExercises;
    } catch (error) {
      console.error("Error generating exercises:", error);
      
      // Return default exercises for all phases if there's an error
      return {
        preparation: [createDefaultExerciseForPhase('preparation', lessonData.preparationTime)],
        main: [createDefaultExerciseForPhase('main', lessonData.mainTime)],
        finish: [createDefaultExerciseForPhase('finish', lessonData.finishTime)]
      };
    }
  };

  return {
    loadExercisesForNewLesson
  };
}
