
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface EnvironmentsStepProps {
  planData: {
    environments: number[];
  };
  availableEnvironments: any[];
  updatePlanData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isStepComplete: () => boolean;
}

const EnvironmentsStep: React.FC<EnvironmentsStepProps> = ({
  planData,
  availableEnvironments,
  updatePlanData,
  goToNextStep,
  goToPrevStep,
  isStepComplete
}) => {
  const toggleEnvironment = (environmentId: number) => {
    const updatedEnvironments = planData.environments.includes(environmentId)
      ? planData.environments.filter(id => id !== environmentId)
      : [...planData.environments, environmentId];
    
    updatePlanData({ environments: updatedEnvironments });
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Vyberte prostředí</h2>
      <p className="text-gray-600 mb-4">
        U více týdenního plánu můžete vybrat více prostředí, která budou použita pro jednotlivé hodiny.
      </p>
      
      <div className="space-y-2 mb-6">
        {availableEnvironments.map((environment) => (
          <div key={environment.id} className="flex items-center">
            <Checkbox
              id={`environment-${environment.id}`}
              checked={planData.environments.includes(environment.id)}
              onCheckedChange={() => toggleEnvironment(environment.id)}
            />
            <Label
              htmlFor={`environment-${environment.id}`}
              className="ml-2 cursor-pointer"
            >
              {environment.name}
            </Label>
          </div>
        ))}
        
        {planData.environments.length === 0 && (
          <p className="text-sm text-red-500 mt-1">Vyberte alespoň jedno prostředí</p>
        )}
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

export default EnvironmentsStep;
