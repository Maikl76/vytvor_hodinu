
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Heart } from 'lucide-react';
import FavoriteExerciseSelector from '../FavoriteExerciseSelector';

interface ExerciseActionsProps {
  editMode: boolean;
  phase: 'preparation' | 'main' | 'finish';
  onAddExercise: () => void;
  onSelectFavoriteExercise: (exercise: {
    name: string;
    description: string;
    time: number;
    phase: string;
  }) => void;
}

export const ExerciseActions: React.FC<ExerciseActionsProps> = ({
  editMode,
  phase,
  onAddExercise,
  onSelectFavoriteExercise,
}) => {
  const [showFavoriteSelector, setShowFavoriteSelector] = useState(false);

  if (!editMode) {
    return null;
  }

  return (
    <>
      <div className="mt-4 flex gap-2">
        <Button 
          onClick={onAddExercise} 
          variant="outline" 
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Přidat cvičení
        </Button>
        
        <Button 
          onClick={() => setShowFavoriteSelector(true)}
          variant="outline" 
          className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Heart className="mr-2 h-4 w-4" />
          Přidat oblíbené cvičení
        </Button>
      </div>

      <FavoriteExerciseSelector
        isOpen={showFavoriteSelector}
        onClose={() => setShowFavoriteSelector(false)}
        phase={phase}
        onSelectExercise={onSelectFavoriteExercise}
      />
    </>
  );
};
