
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';

/**
 * Generates exercise items from construct items
 */
export const generateExercisesFromItems = (
  items: any[], 
  phaseTime: number
): ExerciseItem[] => {
  if (!items || items.length === 0) {
    return [];
  }
  
  console.log("Generating exercises from items:", items);
  
  // Calculate time per exercise
  const timePerExercise = Math.round(phaseTime / items.length);
  
  // Map items to exercise format
  const exercises = items.map(item => ({
    name: item.name || "Aktivita",
    description: item.description || '',
    time: timePerExercise,
    phase: item.phase
  }));
  
  console.log("Generated exercises:", exercises);
  
  return exercises;
};

/**
 * Creates default exercise for a phase when no items are selected
 */
export const createDefaultExerciseForPhase = (
  phaseName: string, 
  phaseTime: number
): ExerciseItem => {
  switch (phaseName) {
    case 'preparation':
      return {
        name: 'Rozcvička',
        description: 'Základní rozcvičení celého těla',
        time: phaseTime,
        phase: 'preparation'
      };
    case 'main':
      return {
        name: 'Hlavní aktivita',
        description: 'Obecné cvičení pro hlavní část hodiny',
        time: phaseTime,
        phase: 'main'
      };
    case 'finish':
      return {
        name: 'Zklidňující cvičení',
        description: 'Protažení a reflexe hodiny',
        time: phaseTime,
        phase: 'finish'
      };
    default:
      return {
        name: 'Aktivita',
        description: 'Obecná aktivita',
        time: phaseTime
      };
  }
};
