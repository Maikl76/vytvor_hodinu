
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFavoriteExercise } from '@/services/favoriteExercisesService';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';

export const useExerciseFavorites = (phase: 'preparation' | 'main' | 'finish') => {
  const { toast } = useToast();
  const [favoriteExercises, setFavoriteExercises] = useState<Set<number>>(new Set());

  const handleAddToFavorites = async (exercise: ExerciseItem, index: number) => {
    try {
      console.log('Adding exercise to favorites:', exercise);
      
      if (!exercise.name || !exercise.time) {
        console.error('Missing required exercise data:', exercise);
        toast({
          title: "Chyba",
          description: "Cvičení nemá všechny požadované údaje",
          variant: "destructive"
        });
        return;
      }

      const favoriteExerciseData = {
        name: exercise.name,
        description: exercise.description || '',
        time: exercise.time,
        phase: phase,
      };

      console.log('Sending to createFavoriteExercise:', favoriteExerciseData);

      const success = await createFavoriteExercise(favoriteExerciseData);

      if (success) {
        setFavoriteExercises(prev => new Set(prev).add(index));
        
        toast({
          title: "Cvik přidán do oblíbených",
          description: `Cvik "${exercise.name}" byl úspěšně přidán do oblíbených`,
        });
      } else {
        throw new Error("Nepodařilo se přidat cvik do oblíbených");
      }
    } catch (error) {
      console.error("Error adding exercise to favorites:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se přidat cvik do oblíbených",
        variant: "destructive"
      });
    }
  };

  return {
    favoriteExercises,
    handleAddToFavorites,
  };
};
