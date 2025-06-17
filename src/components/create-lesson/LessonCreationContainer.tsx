
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import StepHeader from './StepHeader';
import StepContent from './StepContent';

interface LessonCreationContainerProps {
  currentStep: number;
  lessonState: {
    title: string;
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
    constructItems: any[];
    availableEquipment: any[];
    roles: any[];
  };
  handlers: {
    setTitle: (title: string) => void;
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
          title={lessonState.title}
          schoolId={lessonState.schoolId}
          environmentId={lessonState.environmentId}
          constructId={lessonState.constructId}
          equipment={lessonState.equipment}
          grade={lessonState.grade}
          preparationTime={lessonState.preparationTime}
          mainTime={lessonState.mainTime}
          finishTime={lessonState.finishTime}
          preparationRoleId={lessonState.preparationRoleId}
          mainRoleId={lessonState.mainRoleId}
          finishRoleId={lessonState.finishRoleId}
          selectedItems={lessonState.selectedItems}
          schools={resources.schools}
          environments={resources.environments}
          constructs={resources.constructs}
          availableEquipment={resources.availableEquipment}
          roles={resources.roles}
          isLoading={isLoading}
          setTitle={handlers.setTitle}
          setSchoolId={handlers.setSchoolId}
          setEnvironmentId={handlers.setEnvironmentId}
          setConstructId={handlers.setConstructId}
          setEquipment={handlers.setEquipment}
          setGrade={handlers.setGrade}
          setPreparationTime={handlers.setPreparationTime}
          setMainTime={handlers.setMainTime}
          setFinishTime={handlers.setFinishTime}
          setPreparationRoleId={handlers.setPreparationRoleId}
          setMainRoleId={handlers.setMainRoleId}
          setFinishRoleId={handlers.setFinishRoleId}
          setSelectedItems={handlers.setSelectedItems}
          nextStep={handlers.nextStep}
          prevStep={handlers.prevStep}
          handleCreate={handlers.handleCreate}
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
