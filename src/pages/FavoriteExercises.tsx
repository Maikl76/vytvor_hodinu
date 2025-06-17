
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Heart,
  Search,
  Filter,
  Trash2,
  Edit,
  Clock,
  Plus
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { FavoriteExercise, getFavoriteExercises, deleteFavoriteExercise, searchFavoriteExercises } from '@/services/favoriteExercisesService';
import FavoriteExerciseForm from '@/components/favorite-exercises/FavoriteExerciseForm';

const FavoriteExercises: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [exercises, setExercises] = useState<FavoriteExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<FavoriteExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<FavoriteExercise | null>(null);
  
  const loadExercises = async () => {
    setIsLoading(true);
    try {
      const data = await getFavoriteExercises();
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
    loadExercises();
  }, []);

  // Filter exercises based on search term and phase
  useEffect(() => {
    const filterExercises = async () => {
      if (searchTerm.trim() === '' && phaseFilter === 'all') {
        setFilteredExercises(exercises);
        return;
      }

      if (searchTerm.trim() !== '') {
        const searchResults = await searchFavoriteExercises(
          searchTerm, 
          phaseFilter !== 'all' ? phaseFilter : undefined
        );
        setFilteredExercises(searchResults);
      } else {
        const filtered = exercises.filter(exercise => 
          phaseFilter === 'all' || exercise.phase === phaseFilter
        );
        setFilteredExercises(filtered);
      }
    };

    filterExercises();
  }, [searchTerm, phaseFilter, exercises]);

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteFavoriteExercise(id);
      if (success) {
        toast({
          title: "Cvik smazán",
          description: "Oblíbený cvik byl úspěšně smazán",
        });
        loadExercises();
      } else {
        throw new Error("Nepodařilo se smazat cvik");
      }
    } catch (error) {
      console.error("Error deleting exercise:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat cvik",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (exercise: FavoriteExercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingExercise(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExercise(null);
  };

  const handleFormSave = () => {
    loadExercises();
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'preparation': return 'Přípravná část';
      case 'main': return 'Hlavní část';
      case 'finish': return 'Závěrečná část';
      default: return phase;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'preparation': return 'text-blue-600 bg-blue-100';
      case 'main': return 'text-green-600 bg-green-100';
      case 'finish': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/')} variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zpět na hlavní stránku
            </Button>
            <h1 className="text-3xl font-bold flex items-center">
              <Heart className="mr-3 h-8 w-8 text-red-500" />
              Oblíbené cviky
            </h1>
          </div>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Přidat nový cvik
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Hledat cviky podle názvu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrovat podle fáze" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny fáze</SelectItem>
                <SelectItem value="preparation">Přípravná část</SelectItem>
                <SelectItem value="main">Hlavní část</SelectItem>
                <SelectItem value="finish">Závěrečná část</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredExercises.length === 0 ? (
          <Card className="p-6 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              {searchTerm || phaseFilter !== 'all' 
                ? 'Pro vybrané filtry nebyly nalezeny žádné cviky.' 
                : 'Zatím nemáte žádné oblíbené cviky.'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Cviky můžete přidávat do oblíbených přímo z vygenerovaných hodin pomocí ikony hvězdičky nebo vytvořit nové cviky zde.
            </p>
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Přidat první cvik
            </Button>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Oblíbené cviky ({filteredExercises.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Název</TableHead>
                    <TableHead>Popis</TableHead>
                    <TableHead>Fáze</TableHead>
                    <TableHead>Čas</TableHead>
                    <TableHead>Přidáno</TableHead>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPhaseColor(exercise.phase)}`}>
                          {getPhaseLabel(exercise.phase)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {exercise.time} min
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(exercise.created_at).toLocaleDateString('cs-CZ')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(exercise)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Smazat oblíbený cvik?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Opravdu chcete smazat cvik "{exercise.name}"? Tato akce je nevratná.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Zrušit</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(exercise.id)}>
                                  Smazat
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <FavoriteExerciseForm
        isOpen={showForm}
        onClose={handleFormClose}
        exercise={editingExercise}
        onSave={handleFormSave}
      />
    </MainLayout>
  );
};

export default FavoriteExercises;
