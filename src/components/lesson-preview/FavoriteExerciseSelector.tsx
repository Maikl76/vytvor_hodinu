
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Heart, Search, Clock, Plus } from 'lucide-react';
import { FavoriteExercise, getFavoriteExercisesByPhase, searchFavoriteExercises } from '@/services/favoriteExercisesService';
import { useToast } from '@/hooks/use-toast';

interface FavoriteExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  phase: 'preparation' | 'main' | 'finish';
  onSelectExercise: (exercise: {
    name: string;
    description: string;
    time: number;
    phase: string;
  }) => void;
}

const FavoriteExerciseSelector: React.FC<FavoriteExerciseSelectorProps> = ({
  isOpen,
  onClose,
  phase,
  onSelectExercise,
}) => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<FavoriteExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<FavoriteExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'preparation': return 'Přípravná část';
      case 'main': return 'Hlavní část';
      case 'finish': return 'Závěrečná část';
      default: return phase;
    }
  };

  const loadExercises = async () => {
    setIsLoading(true);
    try {
      const data = await getFavoriteExercisesByPhase(phase);
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.error('Error loading favorite exercises:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst oblíbené cviky",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExercises();
      setSearchTerm('');
    }
  }, [isOpen, phase]);

  useEffect(() => {
    const filterExercises = async () => {
      if (searchTerm.trim() === '') {
        setFilteredExercises(exercises);
        return;
      }

      try {
        const searchResults = await searchFavoriteExercises(searchTerm, phase);
        setFilteredExercises(searchResults);
      } catch (error) {
        console.error('Error searching exercises:', error);
      }
    };

    filterExercises();
  }, [searchTerm, exercises, phase]);

  const handleSelectExercise = (exercise: FavoriteExercise) => {
    onSelectExercise({
      name: exercise.name,
      description: exercise.description || '',
      time: exercise.time,
      phase: exercise.phase,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Vybrat oblíbený cvik - {getPhaseLabel(phase)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Hledat cviky podle názvu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                {searchTerm 
                  ? `Nebyl nalezen žádný cvik pro "${searchTerm}"` 
                  : `Nemáte žádné oblíbené cviky pro ${getPhaseLabel(phase).toLowerCase()}`}
              </p>
              <p className="text-sm text-gray-500">
                Cviky můžete přidávat do oblíbených pomocí ikony hvězdičky v již vygenerovaných hodinách.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Název</TableHead>
                  <TableHead>Popis</TableHead>
                  <TableHead>Čas</TableHead>
                  <TableHead className="text-right">Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="font-medium">{exercise.name}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate" title={exercise.description || ''}>
                        {exercise.description || '-'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {exercise.time} min
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleSelectExercise(exercise)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Přidat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteExerciseSelector;
