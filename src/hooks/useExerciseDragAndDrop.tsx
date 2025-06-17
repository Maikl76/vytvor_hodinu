
import { useState, useMemo } from 'react';
import { 
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';

export const useExerciseDragAndDrop = (
  exercises: ExerciseItem[],
  phase: string,
  onReorderExercises: (oldIndex: number, newIndex: number) => void,
  onExerciseChange?: (phase: 'preparation' | 'main' | 'finish', exercises: ExerciseItem[]) => void
) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedExercise, setDraggedExercise] = useState<ExerciseItem | null>(null);

  // Setup DnD sensors with improved sensitivity
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate unique IDs for exercises if they don't have them - use useMemo for stability
  const exercisesWithIds = useMemo(() => {
    return exercises.map((exercise, index) => ({
      ...exercise,
      id: exercise.id || `${phase}-exercise-${index}-${Date.now()}-${Math.random()}`
    }));
  }, [exercises, phase]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id.toString());
    
    // Find the exercise by ID
    const draggedEx = exercisesWithIds.find(ex => ex.id === active.id);
    if (draggedEx) {
      setDraggedExercise(draggedEx);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setDraggedExercise(null);

    if (!over || active.id === over.id) {
      return;
    }

    // Find indices by ID
    const activeIndex = exercisesWithIds.findIndex(ex => ex.id === active.id);
    const overIndex = exercisesWithIds.findIndex(ex => ex.id === over.id);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      // Call the reorder function which should update the parent state
      onReorderExercises(activeIndex, overIndex);
      
      // Notify parent component about exercise changes if callback is provided
      if (onExerciseChange) {
        const updatedExercises = arrayMove(exercises, activeIndex, overIndex);
        onExerciseChange(phase as 'preparation' | 'main' | 'finish', updatedExercises);
      }
    }
  };

  return {
    sensors,
    exercisesWithIds,
    activeId,
    draggedExercise,
    handleDragStart,
    handleDragEnd,
  };
};
