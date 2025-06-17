
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FavoriteExercise, createFavoriteExercise, updateFavoriteExercise } from '@/services/favoriteExercisesService';

interface FavoriteExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  exercise?: FavoriteExercise | null;
  onSave: () => void;
}

const FavoriteExerciseForm: React.FC<FavoriteExerciseFormProps> = ({
  isOpen,
  onClose,
  exercise,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    time: 5,
    phase: 'main' as 'preparation' | 'main' | 'finish'
  });
  const [isSaving, setIsSaving] = useState(false);

  const isEdit = !!exercise;

  useEffect(() => {
    if (exercise) {
      setFormData({
        name: exercise.name,
        description: exercise.description || '',
        time: exercise.time,
        phase: exercise.phase
      });
    } else {
      setFormData({
        name: '',
        description: '',
        time: 5,
        phase: 'main'
      });
    }
  }, [exercise, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Chyba",
        description: "Název cviku je povinný",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      let success = false;
      
      if (isEdit && exercise) {
        success = await updateFavoriteExercise(exercise.id, formData);
      } else {
        success = await createFavoriteExercise(formData);
      }

      if (success) {
        toast({
          title: isEdit ? "Cvik upraven" : "Cvik přidán",
          description: isEdit 
            ? "Oblíbený cvik byl úspěšně upraven" 
            : "Nový oblíbený cvik byl úspěšně přidán",
        });
        onSave();
        onClose();
      } else {
        throw new Error(isEdit ? "Nepodařilo se upravit cvik" : "Nepodařilo se přidat cvik");
      }
    } catch (error) {
      console.error("Error saving exercise:", error);
      toast({
        title: "Chyba",
        description: isEdit ? "Nepodařilo se upravit cvik" : "Nepodařilo se přidat cvik",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'preparation': return 'Přípravná část';
      case 'main': return 'Hlavní část';
      case 'finish': return 'Závěrečná část';
      default: return phase;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Upravit oblíbený cvik' : 'Přidat nový oblíbený cvik'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Název cviku *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Zadejte název cviku"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Zadejte popis cviku"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phase">Fáze</Label>
            <Select value={formData.phase} onValueChange={(value: 'preparation' | 'main' | 'finish') => setFormData(prev => ({ ...prev, phase: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Vyberte fázi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparation">{getPhaseLabel('preparation')}</SelectItem>
                <SelectItem value="main">{getPhaseLabel('main')}</SelectItem>
                <SelectItem value="finish">{getPhaseLabel('finish')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Čas (minuty)</Label>
            <Input
              id="time"
              type="number"
              min="1"
              max="60"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: parseInt(e.target.value) || 5 }))}
              placeholder="5"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Zrušit
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? 'Ukládám...' : (isEdit ? 'Upravit' : 'Přidat')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FavoriteExerciseForm;
