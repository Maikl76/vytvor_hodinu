
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Check, ArrowLeft } from 'lucide-react';

interface WeeklyPlanTimeStepProps {
  planData: {
    preparationTime: number;
    mainTime: number;
    finishTime: number;
  };
  updatePlanData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isStepComplete: () => boolean;
}

const WeeklyPlanTimeStep: React.FC<WeeklyPlanTimeStepProps> = ({
  planData,
  updatePlanData,
  goToNextStep,
  goToPrevStep,
  isStepComplete
}) => {
  const totalTime = planData.preparationTime + planData.mainTime + planData.finishTime;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Nastavení času jednotlivých částí hodiny</h2>
      <p className="text-gray-600">
        Zvolte časové rozvržení jednotlivých částí hodiny více týdenního plánu.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <span>Přípravná část</span>
                <span>{planData.preparationTime} min</span>
              </div>
              <Slider
                value={[planData.preparationTime]}
                min={5}
                max={20}
                step={1}
                onValueChange={(value) => updatePlanData({ preparationTime: value[0] })}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Hlavní část</span>
                <span>{planData.mainTime} min</span>
              </div>
              <Slider
                value={[planData.mainTime]}
                min={15}
                max={35}
                step={1}
                onValueChange={(value) => updatePlanData({ mainTime: value[0] })}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Závěrečná část</span>
                <span>{planData.finishTime} min</span>
              </div>
              <Slider
                value={[planData.finishTime]}
                min={5}
                max={20}
                step={1}
                onValueChange={(value) => updatePlanData({ finishTime: value[0] })}
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Celkový čas hodiny:</span>
                <span>{totalTime} min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <Button 
          onClick={goToNextStep}
          disabled={!isStepComplete()}
        >
          Pokračovat
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanTimeStep;
