
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimeStepProps {
  lessonData: {
    preparationTime: number;
    mainTime: number;
    finishTime: number;
  };
  updateLessonData: (data: any) => void;
  goToNextStep: (currentStep: string, nextStep: string) => void;
  isStepComplete: (step: string) => boolean;
  setActiveTab: (tab: string) => void;
}

const TimeStep: React.FC<TimeStepProps> = ({
  lessonData,
  updateLessonData,
  goToNextStep,
  isStepComplete,
  setActiveTab
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Časové rozdělení hodiny</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doba přípravné části (minuty)
            </label>
            <input 
              type="number" 
              min="5"
              max="20"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={lessonData.preparationTime}
              onChange={(e) => updateLessonData({ preparationTime: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doba hlavní části (minuty)
            </label>
            <input 
              type="number" 
              min="10"
              max="40"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={lessonData.mainTime}
              onChange={(e) => updateLessonData({ mainTime: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doba závěrečné části (minuty)
            </label>
            <input 
              type="number" 
              min="5"
              max="15"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={lessonData.finishTime}
              onChange={(e) => updateLessonData({ finishTime: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="text-right text-gray-600">
            Celková délka hodiny: {lessonData.preparationTime + lessonData.mainTime + lessonData.finishTime} minut
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setActiveTab('step4')}>
              Zpět
            </Button>
            <Button 
              onClick={() => goToNextStep('step5', 'step6')}
              disabled={!isStepComplete('step5')}
            >
              Pokračovat
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default TimeStep;
