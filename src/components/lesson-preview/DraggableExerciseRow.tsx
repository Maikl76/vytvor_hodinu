
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditableCell from './EditableCell';
import { ExerciseItem } from './ExerciseSection';

interface DraggableExerciseRowProps {
  exercise: ExerciseItem;
  index: number;
  isEditMode: boolean;
  onUpdateExercise: (index: number, field: keyof ExerciseItem, value: string | number) => void;
  onDeleteExercise: (index: number) => void;
  onReorderExercises: (oldIndex: number, newIndex: number) => void;
  exercises: ExerciseItem[];
  onAddToFavorites?: (exercise: ExerciseItem, index: number) => void;
  isFavorite?: boolean;
}

const DraggableExerciseRow: React.FC<DraggableExerciseRowProps> = ({
  exercise,
  index,
  isEditMode,
  onUpdateExercise,
  onDeleteExercise,
  onReorderExercises,
  exercises,
  onAddToFavorites,
  isFavorite = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: exercise.id || `${exercise.phase}-${index}` // Use exercise ID if available
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <tr ref={setNodeRef} style={style} className={isDragging ? 'bg-gray-100' : ''}>
        {isEditMode && (
          <td className="border p-2 w-8">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing flex justify-center"
              title="Přetáhněte pro změnu pořadí"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </td>
        )}
        <td className="border p-2">
          {isEditMode ? (
            <EditableCell
              value={exercise.name}
              onSave={(value) => onUpdateExercise(index, 'name', value)}
              type="text"
            />
          ) : (
            <span>{exercise.name}</span>
          )}
        </td>
        <td className="border p-2">
          {isEditMode ? (
            <EditableCell
              value={exercise.description || ''}
              onSave={(value) => onUpdateExercise(index, 'description', value)}
              type="text"
            />
          ) : (
            <span>{exercise.description}</span>
          )}
        </td>
        <td className="border p-2 text-center w-20">
          {isEditMode ? (
            <EditableCell
              value={exercise.time}
              onSave={(value) => onUpdateExercise(index, 'time', value)}
              type="number"
              className="text-center"
            />
          ) : (
            <span>{exercise.time} min</span>
          )}
        </td>
        {isEditMode && (
          <td className="border p-2 w-12">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteExercise(index)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
              title="Smazat cvičení"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </td>
        )}
      </tr>
      {isEditMode && onAddToFavorites && (
        <tr>
          <td colSpan={5} className="border-0 p-0">
            <div className="flex justify-end p-1">
              <Button
                onClick={() => onAddToFavorites(exercise, index)}
                variant="ghost"
                size="sm"
                className={`${isFavorite 
                  ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
                  : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                title={isFavorite ? "Již v oblíbených" : "Přidat do oblíbených"}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default DraggableExerciseRow;
