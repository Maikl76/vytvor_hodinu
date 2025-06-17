
import { useEffect } from 'react';
import { useLessonCreation } from './lesson-creation/useLessonCreation';

export function useCreateLesson() {
  const lessonCreation = useLessonCreation();
  
  return {
    ...lessonCreation
  };
}
