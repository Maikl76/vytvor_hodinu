
import { LessonExerciseData } from '../aiService';

export interface WeeklyPlanLessonData {
  week: number;
  lessonNumber: number;
  exercises?: LessonExerciseData;
  isGenerating?: boolean;
  error?: string;
  promptData?: {
    systemPrompt?: string;
    userPrompt?: string;
  };
}

// Interface to represent the expected structure of weekly plan lessons
export interface WeeklyPlanLessonRow {
  week_number: number;
  lesson_number: number;
  lesson_data?: {
    exercises?: LessonExerciseData;
  } | null;
}
