
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';
import { LessonExerciseData } from '@/services/aiService';

/**
 * Creates default exercises when no specific exercises are available
 */
export const createDefaultExercises = (lessonData: any): LessonExerciseData => {
  return {
    preparation: [{
      name: 'Rozcvička',
      description: 'Základní rozcvičení celého těla',
      time: lessonData.preparationTime,
      phase: 'preparation'
    }],
    main: [{
      name: 'Hlavní aktivita',
      description: `Cvičení zaměřené na ${lessonData.construct || 'vybranou dovednost'}`,
      time: lessonData.mainTime,
      phase: 'main'
    }],
    finish: [{
      name: 'Zklidňující cvičení',
      description: 'Protažení a reflexe hodiny',
      time: lessonData.finishTime,
      phase: 'finish'
    }]
  };
};

/**
 * Fills empty sections with default exercises if needed
 * Only adds default exercises if explicitly requested
 */
export const addDefaultExercisesIfEmpty = (
  lessonData: any,
  preparation: ExerciseItem[],
  main: ExerciseItem[],
  finish: ExerciseItem[],
  addDefaults: boolean = false
): LessonExerciseData => {
  let result = {
    preparation,
    main,
    finish
  };
  
  // Only add defaults if specifically requested
  if (addDefaults) {
    // If a section is empty, add default exercise
    if (preparation.length === 0) {
      result.preparation = [{ 
        name: 'Rozcvička', 
        description: 'Základní rozcvičení celého těla', 
        time: lessonData.preparationTime,
        phase: 'preparation'
      }];
    }
    
    if (main.length === 0) {
      result.main = [{ 
        name: 'Hlavní aktivita', 
        description: `Cvičení zaměřené na ${lessonData.construct || 'vybranou dovednost'}`, 
        time: lessonData.mainTime,
        phase: 'main'
      }];
    }
    
    if (finish.length === 0) {
      result.finish = [{ 
        name: 'Zklidňující cvičení', 
        description: 'Protažení a reflexe hodiny', 
        time: lessonData.finishTime,
        phase: 'finish'
      }];
    }
  }
  
  return result;
};

/**
 * Creates exercises from selected items across all phases
 */
export const createExercisesFromItems = (lessonData: any, selectedItems: any[]): LessonExerciseData => {
  // If no items, return empty exercise data
  if (selectedItems.length === 0) {
    return {
      preparation: [],
      main: [],
      finish: []
    };
  }
  
  // Use phase-specific selections
  if (lessonData.selectedItems) {
    // Find the preparation, main, and finish items separately
    const preparationItems = selectedItems.filter(item => 
      lessonData.selectedItems.preparationItems.includes(item.id)
    );
    
    const mainItems = selectedItems.filter(item => 
      lessonData.selectedItems.mainItems.includes(item.id)
    );
    
    const finishItems = selectedItems.filter(item => 
      lessonData.selectedItems.finishItems.includes(item.id)
    );
    
    // Create exercises for each phase
    const preparationExercises = preparationItems.map(item => ({
      name: item.name,
      description: item.description || '',
      time: Math.round(lessonData.preparationTime / Math.max(1, preparationItems.length)),
      phase: 'preparation' as const
    }));
    
    const mainExercises = mainItems.map(item => ({
      name: item.name,
      description: item.description || '',
      time: Math.round(lessonData.mainTime / Math.max(1, mainItems.length)),
      phase: 'main' as const
    }));
    
    const finishExercises = finishItems.map(item => ({
      name: item.name,
      description: item.description || '',
      time: Math.round(lessonData.finishTime / Math.max(1, finishItems.length)),
      phase: 'finish' as const
    }));
    
    // Only use defaults if no items are selected for a phase
    return {
      preparation: preparationExercises.length > 0 ? preparationExercises : [],
      main: mainExercises.length > 0 ? mainExercises : [],
      finish: finishExercises.length > 0 ? finishExercises : []
    };
  }
  
  // Legacy approach if no phase-specific data
  const totalTime = lessonData.preparationTime + lessonData.mainTime + lessonData.finishTime;
  const totalItems = selectedItems.length;
  
  // Calculate items per phase based on time proportions
  const prepPortion = lessonData.preparationTime / totalTime;
  const mainPortion = lessonData.mainTime / totalTime;
  
  const prepItemCount = Math.max(1, Math.round(totalItems * prepPortion));
  const mainItemCount = Math.max(1, Math.round(totalItems * mainPortion));
  const finishItemCount = Math.max(1, totalItems - prepItemCount - mainItemCount);
  
  // Distribute items to phases
  const preparationItems = selectedItems.slice(0, prepItemCount);
  const mainItems = selectedItems.slice(prepItemCount, prepItemCount + mainItemCount);
  const finishItems = selectedItems.slice(prepItemCount + mainItemCount);
  
  // Create exercises for each phase
  return {
    preparation: preparationItems.map(item => ({
      name: item.name,
      description: item.description || '',
      time: Math.round(lessonData.preparationTime / preparationItems.length),
      phase: 'preparation' as const
    })),
    main: mainItems.map(item => ({
      name: item.name,
      description: item.description || '',
      time: Math.round(lessonData.mainTime / mainItems.length),
      phase: 'main' as const
    })),
    finish: finishItems.map(item => ({
      name: item.name,
      description: item.description || '',
      time: Math.round(lessonData.finishTime / finishItems.length),
      phase: 'finish' as const
    }))
  };
};
