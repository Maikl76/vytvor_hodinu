
import React from 'react';
import { Card } from '@/components/ui/card';
import WeeklyPlanStepHeader from './WeeklyPlanStepHeader';
import WeeklyPlanStepContent from './WeeklyPlanStepContent';

interface WeeklyPlanCreationContainerProps {
  currentStep: number;
  planState: {
    title: string;
    schoolId: number | null;
    grade: number;
    environments: number[];
    preparationItems: number[];
    mainItems: number[];
    finishItems: number[];
    equipment: number[];
    preparationTime: number;
    mainTime: number;
    finishTime: number;
    preparationRoleId: number | null;
    mainRoleId: number | null;
    finishRoleId: number | null;
    weeksCount: number;
    lessonsPerWeek: number;
  };
  resources: {
    schools: any[];
    environments: any[];
    constructs: any[];
    availableEquipment: any[];
    roles: any[];
  };
  handlers: {
    setTitle: (title: string) => void;
    setSchoolId: (id: number | null) => void;
    setGrade: (grade: number) => void;
    setEnvironments: (environments: number[]) => void;
    setPreparationItems: (items: number[]) => void;
    setMainItems: (items: number[]) => void;
    setFinishItems: (items: number[]) => void;
    setEquipment: (equipment: number[]) => void;
    setPreparationTime: (time: number) => void;
    setMainTime: (time: number) => void;
    setFinishTime: (time: number) => void;
    setPreparationRoleId: (id: number | null) => void;
    setMainRoleId: (id: number | null) => void;
    setFinishRoleId: (id: number | null) => void;
    setWeeksCount: (count: number) => void;
    setLessonsPerWeek: (count: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    handleCreate: () => void;
  };
  isLoading: boolean;
}

const WeeklyPlanCreationContainer: React.FC<WeeklyPlanCreationContainerProps> = ({
  currentStep,
  planState,
  resources,
  handlers,
  isLoading
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vytvořit nový více týdenní plán</h1>
        <p className="text-gray-600">
          Postupně projděte všemi kroky k vytvoření nového více týdenního plánu tělesné výchovy
        </p>
      </div>

      <div className="mb-8 overflow-x-auto">
        <WeeklyPlanStepHeader currentStep={currentStep} />
      </div>

      <Card className="p-6">
        <WeeklyPlanStepContent
          currentStep={currentStep}
          planState={planState}
          resources={resources}
          handlers={handlers}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default WeeklyPlanCreationContainer;
