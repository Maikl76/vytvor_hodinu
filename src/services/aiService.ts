
// Re-export everything from the new modular service
export type {
  AiSettings,
  ExerciseItem,
  LessonExerciseData,
  PromptData,
  LessonGenerationRequest,
  LessonGenerationResult,
  ActivityItem
} from './ai';

export { generateAILessonPlan } from './ai';
