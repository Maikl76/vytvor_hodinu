
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ExerciseCountsSectionProps {
  preparationMin: number;
  preparationMax: number;
  mainMin: number;
  mainMax: number;
  finishMin: number;
  finishMax: number;
  onCountChange: (field: string, value: number) => void;
}

export const ExerciseCountsSection: React.FC<ExerciseCountsSectionProps> = ({
  preparationMin,
  preparationMax,
  mainMin,
  mainMax,
  finishMin,
  finishMax,
  onCountChange,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Počet cvičení podle části hodiny</h3>
      
      {/* Přípravná část */}
      <div className="border rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-green-700">Přípravná část</h4>
        <div>
          <Label htmlFor="prep_exercises">Počet cvičení</Label>
          <div className="flex items-center gap-2">
            <Input
              id="prep_exercises_min"
              type="number"
              min={1}
              max={preparationMax}
              value={preparationMin}
              onChange={(e) => onCountChange('preparation_exercises_min', parseInt(e.target.value))}
              className="w-20"
            />
            <span>až</span>
            <Input
              id="prep_exercises_max"
              type="number"
              min={preparationMin}
              max={10}
              value={preparationMax}
              onChange={(e) => onCountChange('preparation_exercises_max', parseInt(e.target.value))}
              className="w-20"
            />
            <span className="ml-2 text-sm text-muted-foreground">cvičení</span>
          </div>
        </div>
      </div>

      {/* Hlavní část */}
      <div className="border rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-blue-700">Hlavní část</h4>
        <div>
          <Label htmlFor="main_exercises">Počet cvičení</Label>
          <div className="flex items-center gap-2">
            <Input
              id="main_exercises_min"
              type="number"
              min={1}
              max={mainMax}
              value={mainMin}
              onChange={(e) => onCountChange('main_exercises_min', parseInt(e.target.value))}
              className="w-20"
            />
            <span>až</span>
            <Input
              id="main_exercises_max"
              type="number"
              min={mainMin}
              max={15}
              value={mainMax}
              onChange={(e) => onCountChange('main_exercises_max', parseInt(e.target.value))}
              className="w-20"
            />
            <span className="ml-2 text-sm text-muted-foreground">cvičení</span>
          </div>
        </div>
      </div>

      {/* Závěrečná část */}
      <div className="border rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-orange-700">Závěrečná část</h4>
        <div>
          <Label htmlFor="finish_exercises">Počet cvičení</Label>
          <div className="flex items-center gap-2">
            <Input
              id="finish_exercises_min"
              type="number"
              min={1}
              max={finishMax}
              value={finishMin}
              onChange={(e) => onCountChange('finish_exercises_min', parseInt(e.target.value))}
              className="w-20"
            />
            <span>až</span>
            <Input
              id="finish_exercises_max"
              type="number"
              min={finishMin}
              max={10}
              value={finishMax}
              onChange={(e) => onCountChange('finish_exercises_max', parseInt(e.target.value))}
              className="w-20"
            />
            <span className="ml-2 text-sm text-muted-foreground">cvičení</span>
          </div>
        </div>
      </div>
    </div>
  );
};
