
// Re-export everything from the modular weekly plan services
export { 
  generateWeeklyPlan, 
  generateSingleLesson,
  exportWeeklyPlanToDocument,
  saveWeeklyPlanToDatabase,
  getWeeklyPlanData,
  createAIRequest
} from './weekly-plan';

export type { 
  WeeklyPlanLessonData, 
  WeeklyPlanLessonRow 
} from './weekly-plan';

export { 
  hasExercises, 
  isValidLessonData 
} from './weekly-plan';
