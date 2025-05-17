
import { useToast } from '@/hooks/use-toast';
import { LessonExerciseData } from '@/services/aiService';
import { useExerciseItemsLoader } from './useExerciseItemsLoader';
import { createDefaultExerciseForPhase } from '@/utils/exerciseItemUtils';

export function useHistoryExerciseLoader() {
  const { toast } = useToast();
  const { loadPhaseItems, loadAllPhaseItems } = useExerciseItemsLoader();

  /**
   * Load exercises for a lesson from history
   */
  const loadExercisesForHistoryLesson = async (lessonData: any): Promise<LessonExerciseData> => {
    console.log("Loading exercises for history lesson with data:", lessonData);
    
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
      
      // Generate exercises for each phase
      const preparationExercises = await loadPhaseItems(
        preparationItemIds,
        preparationItems,
        lessonData.preparationTime,
        'preparation'
      );
      
      const mainExercises = await loadPhaseItems(
        mainItemIds,
        mainItems,
        lessonData.mainTime,
        'main'
      );
      
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
      
      console.log("Final exercises for history lesson:", finalExercises);
      return finalExercises;
    } catch (error) {
      console.error("Error loading exercises:", error);
      
      // Return default exercises for all phases if there's an error
      return {
        preparation: [{
          name: 'Rozcvička',
          description: 'Základní rozcvičení celého těla',
          time: lessonData.preparationTime
        }],
        main: [{
          name: 'Hlavní aktivita',
          description: `Cvičení zaměřené na vybranou dovednost`,
          time: lessonData.mainTime
        }],
        finish: [{
          name: 'Zklidňující cvičení',
          description: 'Protažení a reflexe hodiny',
          time: lessonData.finishTime
        }]
      };
    }
  };

  return {
    loadExercisesForHistoryLesson
  };
}
