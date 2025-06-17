
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, ArrowLeft } from 'lucide-react';

interface WeeklyPlanConfigStepProps {
  planData: {
    weeksCount: number;
    lessonsPerWeek: number;
  };
  updatePlanData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isStepComplete: () => boolean;
}

const WeeklyPlanConfigStep: React.FC<WeeklyPlanConfigStepProps> = ({
  planData,
  updatePlanData,
  goToNextStep,
  goToPrevStep,
  isStepComplete
}) => {
  // Výpočet celkového počtu hodin
  const totalLessons = planData.weeksCount * planData.lessonsPerWeek;
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Konfigurace plánu</h2>
      <p className="text-gray-600 mb-4">
        Nastavte počet týdnů a počet hodin týdně pro váš více týdenní plán.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="weeksCount">Počet týdnů</Label>
          <Input
            id="weeksCount"
            type="number"
            min="1"
            max="52"
            value={planData.weeksCount}
            onChange={(e) => updatePlanData({ weeksCount: Math.max(1, parseInt(e.target.value) || 1) })}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lessonsPerWeek">Počet hodin týdně</Label>
          <Input
            id="lessonsPerWeek"
            type="number"
            min="1"
            max="10"
            value={planData.lessonsPerWeek}
            onChange={(e) => updatePlanData({ lessonsPerWeek: Math.max(1, parseInt(e.target.value) || 1) })}
            className="mt-1"
          />
        </div>
        
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="font-medium">Shrnutí plánu:</p>
          <ul className="mt-2 space-y-1">
            <li>Počet týdnů: <span className="font-medium">{planData.weeksCount}</span></li>
            <li>Počet hodin týdně: <span className="font-medium">{planData.lessonsPerWeek}</span></li>
            <li>Celkový počet hodin: <span className="font-medium">{totalLessons}</span></li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <Button onClick={goToNextStep} disabled={!isStepComplete()}>
          Pokračovat
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanConfigStep;
