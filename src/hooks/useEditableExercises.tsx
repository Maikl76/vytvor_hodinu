
import { useState, useEffect } from 'react';
import { LessonExerciseData } from '@/services/aiService';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';

export function useEditableExercises(initialExerciseData: LessonExerciseData) {
  const [exerciseData, setExerciseData] = useState<LessonExerciseData>(initialExerciseData);
  const [isModified, setIsModified] = useState(false);

  // Update when initial data changes
  useEffect(() => {
    setExerciseData(initialExerciseData);
    setIsModified(false);
  }, [initialExerciseData]);

  const updateExercise = (phase: 'preparation' | 'main' | 'finish', index: number, field: keyof ExerciseItem, value: string | number) => {
    setExerciseData(prev => {
      const newData = { ...prev };
      const exercises = [...newData[phase]];
      exercises[index] = { ...exercises[index], [field]: value };
      newData[phase] = exercises;
      return newData;
    });
    setIsModified(true);
  };

  const reorderExercises = (phase: 'preparation' | 'main' | 'finish', oldIndex: number, newIndex: number) => {
    setExerciseData(prev => {
      const newData = { ...prev };
      const exercises = [...newData[phase]];
      const [reorderedItem] = exercises.splice(oldIndex, 1);
      exercises.splice(newIndex, 0, reorderedItem);
      newData[phase] = exercises;
      return newData;
    });
    setIsModified(true);
  };

  const deleteExercise = (phase: 'preparation' | 'main' | 'finish', index: number) => {
    setExerciseData(prev => {
      const newData = { ...prev };
      const exercises = [...newData[phase]];
      exercises.splice(index, 1);
      newData[phase] = exercises;
      return newData;
    });
    setIsModified(true);
  };

  const addExercise = (phase: 'preparation' | 'main' | 'finish') => {
    const newExercise: ExerciseItem = {
      name: 'Nové cvičení',
      description: 'Popis cvičení',
      time: 5,
      phase: phase
    };

    setExerciseData(prev => {
      const newData = { ...prev };
      const exercises = [...newData[phase]];
      exercises.push(newExercise);
      newData[phase] = exercises;
      return newData;
    });
    setIsModified(true);
  };

  const calculateTotalTime = () => {
    const preparationTime = exerciseData.preparation.reduce((sum, ex) => sum + (ex.time || 0), 0);
    const mainTime = exerciseData.main.reduce((sum, ex) => sum + (ex.time || 0), 0);
    const finishTime = exerciseData.finish.reduce((sum, ex) => sum + (ex.time || 0), 0);
    
    return {
      preparation: preparationTime,
      main: mainTime,
      finish: finishTime,
      total: preparationTime + mainTime + finishTime
    };
  };

  const resetModifications = () => {
    setExerciseData(initialExerciseData);
    setIsModified(false);
  };

  return {
    exerciseData,
    setExerciseData,
    isModified,
    updateExercise,
    reorderExercises,
    deleteExercise,
    addExercise,
    calculateTotalTime,
    resetModifications
  };
}
