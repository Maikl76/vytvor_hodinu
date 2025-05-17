
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EnvironmentStepProps {
  lessonData: {
    environment: string;
    environmentId: number | null;
  };
  environments: Array<{
    id: number;
    name: string;
  }>;
  updateLessonData: (data: any) => void;
  goToNextStep: (currentStep: string, nextStep: string) => void;
  isStepComplete: (step: string) => boolean;
  setActiveTab: (tab: string) => void;
}

const EnvironmentStep: React.FC<EnvironmentStepProps> = ({ 
  lessonData, 
  environments, 
  updateLessonData, 
  goToNextStep,
  isStepComplete,
  setActiveTab 
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Výběr prostředí</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prostředí</label>
            <Select
              value={lessonData.environmentId?.toString() || ''}
              onValueChange={(value) => {
                if (value !== 'placeholder') {
                  const selectedId = parseInt(value);
                  const selectedEnvironment = environments.find(env => env.id === selectedId);
                  if (selectedEnvironment) {
                    updateLessonData({
                      environment: selectedEnvironment.name,
                      environmentId: selectedId,
                      // Reset equipment selection when environment changes
                      equipment: []
                    });
                  }
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte prostředí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Vyberte prostředí</SelectItem>
                {environments.map(env => (
                  <SelectItem key={env.id} value={env.id.toString()}>
                    {env.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Výběr prostředí ovlivní dostupné vybavení a cviky v dalších krocích.
            </p>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setActiveTab('step1')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Zpět
            </Button>
            <Button 
              onClick={() => goToNextStep('step2', 'step3')}
              disabled={!isStepComplete('step2')}
            >
              Pokračovat
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default EnvironmentStep;
