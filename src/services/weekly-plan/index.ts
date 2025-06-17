
// Main exports for weekly plan generation
export { generateWeeklyPlan, generateSingleLesson } from './generators';
export { exportWeeklyPlanToDocument } from './documentExporter';
export { saveWeeklyPlanToDatabase } from './databasePersistence';
export { getWeeklyPlanData } from './dataLoader';
export { createAIRequest } from './requestBuilder';
export type { WeeklyPlanLessonData, WeeklyPlanLessonRow } from './types';
export { hasExercises, isValidLessonData } from './typeGuards';
