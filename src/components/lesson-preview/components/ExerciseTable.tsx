
import React from 'react';
import { 
  DndContext, 
  closestCenter,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableExerciseRow from '../DraggableExerciseRow';
import { ExerciseItem } from '../ExerciseSection';

interface ExerciseTableProps {
  exercises: ExerciseItem[];
  exercisesWithIds: ExerciseItem[];
  editMode: boolean;
  sensors: any;
  activeId: string | null;
  draggedExercise: ExerciseItem | null;
  favoriteExercises: Set<number>;
  onUpdateExercise: (index: number, field: keyof ExerciseItem, value: string | number) => void;
  onDeleteExercise: (index: number) => void;
  onReorderExercises: (oldIndex: number, newIndex: number) => void;
  onAddToFavorites: (exercise: ExerciseItem, index: number) => void;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
}

export const ExerciseTable: React.FC<ExerciseTableProps> = ({
  exercises,
  exercisesWithIds,
  editMode,
  sensors,
  activeId,
  draggedExercise,
  favoriteExercises,
  onUpdateExercise,
  onDeleteExercise,
  onReorderExercises,
  onAddToFavorites,
  onDragStart,
  onDragEnd,
}) => {
  if (exercises.length === 0) {
    return <p className="text-gray-500 text-center py-4">Žádná cvičení</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {editMode && <th className="border p-2 w-8"></th>}
            <th className="border p-2 text-left">Název</th>
            <th className="border p-2 text-left">Popis</th>
            <th className="border p-2 text-center w-20">Čas (min)</th>
            {editMode && <th className="border p-2 w-12"></th>}
          </tr>
        </thead>
        <tbody>
          {editMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={exercisesWithIds.map(ex => ex.id!)}
                strategy={verticalListSortingStrategy}
              >
                {exercisesWithIds.map((exercise, index) => (
                  <DraggableExerciseRow
                    key={exercise.id}
                    exercise={exercise}
                    index={index}
                    isEditMode={editMode}
                    onUpdateExercise={onUpdateExercise}
                    onDeleteExercise={onDeleteExercise}
                    onReorderExercises={onReorderExercises}
                    exercises={exercises}
                    onAddToFavorites={onAddToFavorites}
                    isFavorite={favoriteExercises.has(index)}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId && draggedExercise ? (
                  <table className="w-full border-collapse bg-white shadow-lg rounded">
                    <tbody>
                      <tr className="bg-blue-50 border-2 border-blue-200">
                        <td className="border p-2 w-8"></td>
                        <td className="border p-2">{draggedExercise.name}</td>
                        <td className="border p-2">{draggedExercise.description}</td>
                        <td className="border p-2 text-center w-20">{draggedExercise.time} min</td>
                        <td className="border p-2 w-12"></td>
                      </tr>
                    </tbody>
                  </table>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            exercisesWithIds.map((exercise, index) => (
              <DraggableExerciseRow
                key={exercise.id}
                exercise={exercise}
                index={index}
                isEditMode={false}
                onUpdateExercise={onUpdateExercise}
                onDeleteExercise={onDeleteExercise}
                onReorderExercises={onReorderExercises}
                exercises={exercises}
                onAddToFavorites={onAddToFavorites}
                isFavorite={favoriteExercises.has(index)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
