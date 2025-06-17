
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExerciseDragAndDrop } from '@/hooks/useExerciseDragAndDrop';
import { useExerciseFavorites } from '@/hooks/useExerciseFavorites';
import { ExerciseTable } from './components/ExerciseTable';
import { ExerciseActions } from './components/ExerciseActions';

export interface ExerciseItem {
  name: string;
  description: string;
  time: number;
  phase: 'preparation' | 'main' | 'finish';
  id?: string; // Add unique ID for each exercise
}

interface ExerciseSectionProps {
  title: string;
  phase: 'preparation' | 'main' | 'finish';
  exercises: ExerciseItem[];
  isEditMode?: boolean;
  isEditable?: boolean;
  onUpdateExercise: (index: number, field: keyof ExerciseItem, value: string | number) => void;
  onReorderExercises: (oldIndex: number, newIndex: number) => void;
  onDeleteExercise: (index: number) => void;
  onAddExercise: () => void;
  totalTime?: number;
  duration?: number;
  actualDuration?: number;
  titleColor?: string;
  role?: string;
  onExerciseChange?: (phase: 'preparation' | 'main' | 'finish', exercises: ExerciseItem[]) => void;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  title,
  phase,
  exercises,
  isEditMode = false,
  isEditable = false,
  onUpdateExercise,
  onReorderExercises,
  onDeleteExercise,
  onAddExercise,
  totalTime,
  duration,
  actualDuration,
  titleColor = "text-gray-800",
  role,
  onExerciseChange,
}) => {
  // Use isEditable for WeeklyPlanGenerated or isEditMode for PreviewLesson
  const editMode = isEditMode || isEditable;

  // Calculate total time for display
  const displayTime = totalTime || duration || exercises.reduce((sum, ex) => sum + (ex.time || 0), 0);

  // Custom hooks for drag and drop functionality
  const {
    sensors,
    exercisesWithIds,
    activeId,
    draggedExercise,
    handleDragStart,
    handleDragEnd,
  } = useExerciseDragAndDrop(exercises, phase, onReorderExercises, onExerciseChange);

  // Custom hook for favorites functionality
  const { favoriteExercises, handleAddToFavorites } = useExerciseFavorites(phase);

  const handleSelectFavoriteExercise = (exercise: {
    name: string;
    description: string;
    time: number;
    phase: string;
  }) => {
    onAddExercise();
    const newIndex = exercises.length;
    onUpdateExercise(newIndex, 'name', exercise.name);
    onUpdateExercise(newIndex, 'description', exercise.description);
    onUpdateExercise(newIndex, 'time', exercise.time);
  };

  // Wrapper functions that also call onExerciseChange when exercises are modified
  const handleUpdateExercise = (index: number, field: keyof ExerciseItem, value: string | number) => {
    onUpdateExercise(index, field, value);
    
    // Notify parent component about exercise changes if callback is provided
    if (onExerciseChange) {
      const updatedExercises = [...exercises];
      if (updatedExercises[index]) {
        updatedExercises[index] = { ...updatedExercises[index], [field]: value };
        onExerciseChange(phase, updatedExercises);
      }
    }
  };

  const handleDeleteExercise = (index: number) => {
    onDeleteExercise(index);
    
    // Notify parent component about exercise changes if callback is provided
    if (onExerciseChange) {
      const updatedExercises = exercises.filter((_, i) => i !== index);
      onExerciseChange(phase, updatedExercises);
    }
  };

  const handleAddExercise = () => {
    onAddExercise();
    
    // Notify parent component about exercise changes if callback is provided
    if (onExerciseChange) {
      const newExercise: ExerciseItem = {
        name: 'Nové cvičení',
        description: 'Popis cvičení',
        time: 5,
        phase: phase
      };
      const updatedExercises = [...exercises, newExercise];
      onExerciseChange(phase, updatedExercises);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`${titleColor} flex justify-between items-center`}>
          <div>
            <span>{title}</span>
            {role && <span className="text-sm font-normal text-gray-500 ml-2">({role})</span>}
          </div>
          <div className="text-sm font-normal text-gray-600">
            {actualDuration !== undefined ? (
              <span className={actualDuration !== displayTime ? 'text-orange-600' : 'text-green-600'}>
                {actualDuration} min / {displayTime} min
              </span>
            ) : (
              <span>Celkem: {displayTime} min</span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ExerciseTable
          exercises={exercises}
          exercisesWithIds={exercisesWithIds}
          editMode={editMode}
          sensors={sensors}
          activeId={activeId}
          draggedExercise={draggedExercise}
          favoriteExercises={favoriteExercises}
          onUpdateExercise={handleUpdateExercise}
          onDeleteExercise={handleDeleteExercise}
          onReorderExercises={onReorderExercises}
          onAddToFavorites={handleAddToFavorites}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        
        <ExerciseActions
          editMode={editMode}
          phase={phase}
          onAddExercise={handleAddExercise}
          onSelectFavoriteExercise={handleSelectFavoriteExercise}
        />
      </CardContent>
    </Card>
  );
};

export default ExerciseSection;
