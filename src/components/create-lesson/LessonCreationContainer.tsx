
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import StepHeader from './StepHeader';
import StepContent from './StepContent';

interface LessonCreationContainerProps {
  currentStep: number;
  lessonState: {
    schoolId: number | null;
    environmentId: number | null;
    constructId: number | null;
    equipment: number[];
    grade: number;
    preparationTime: number;
    mainTime: number;
    finishTime: number;
    preparationRoleId: number | null;
    mainRoleId: number | null;
    finishRoleId: number | null;
    selectedItems: {
      preparationItems: number[];
      mainItems: number[];
      finishItems: number[];
    };
  };
  resources: {
    schools: any[];
    environments: any[];
    constructs: any[];
    availableEquipment: any[];
    roles: any[];
  };
  handlers: {
    setSchoolId: (id: number | null) => void;
    setEnvironmentId: (id: number | null) => void;
    setConstructId: (id: number | null) => void;
    setEquipment: (equipment: number[]) => void;
    setGrade: (grade: number) => void;
    setPreparationTime: (time: number) => void;
    setMainTime: (time: number) => void;
    setFinishTime: (time: number) => void;
    setPreparationRoleId: (id: number | null) => void;
    setMainRoleId: (id: number | null) => void;
    setFinishRoleId: (id: number | null) => void;
    setSelectedItems: React.Dispatch<React.SetStateAction<{
      preparationItems: number[];
      mainItems: number[];
      finishItems: number[];
    }>>;
    nextStep: () => void;
    prevStep: () => void;
    handleCreate: () => void;
  };
  isLoading: boolean;
}

const LessonCreationContainer: React.FC<LessonCreationContainerProps> = ({
  currentStep,
  lessonState,
  resources,
  handlers,
  isLoading
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vytvořit novou hodinu</h1>
        <p className="text-gray-600">
          Postupně projděte všemi kroky k vytvoření nové hodiny tělesné výchovy
        </p>
      </div>

      <div className="mb-8 overflow-x-auto">
        <StepHeader currentStep={currentStep} />
      </div>

      <Card className="p-6">
        <StepContent
          currentStep={currentStep}
          lessonState={lessonState}
          resources={resources}
          handlers={handlers}
          isLoading={isLoading}
        />
        
        {/* Only render navigation buttons for step 1 where individual steps don't have their own buttons */}
        {currentStep === 1 && (
          <div className="flex justify-between mt-6">
            <div></div>
            <Button onClick={handlers.nextStep}>
              Pokračovat
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LessonCreationContainer;
