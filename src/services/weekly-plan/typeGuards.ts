
import { LessonExerciseData } from '../aiService';
import { WeeklyPlanLessonRow } from './types';

// Type guard to check if JSON data contains exercises
export function hasExercises(data: any): data is { exercises: LessonExerciseData } {
  return data && typeof data === 'object' && 'exercises' in data;
}

// Type guard to check if response is an error or valid data
export function isValidLessonData(data: any): data is WeeklyPlanLessonRow[] {
  return Array.isArray(data) && (!data.length || (
    'week_number' in data[0] && 
    'lesson_number' in data[0]
  ));
}
