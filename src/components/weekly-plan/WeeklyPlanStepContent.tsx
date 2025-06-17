
import React from 'react';
import BasicInfoStep from './steps/BasicInfoStep';
import EnvironmentsStep from './steps/EnvironmentsStep';
import WeeklyPlanPreparationStep from './steps/WeeklyPlanPreparationStep';
import WeeklyPlanMainStep from './steps/WeeklyPlanMainStep';
import WeeklyPlanFinishStep from './steps/WeeklyPlanFinishStep';
import WeeklyPlanEquipmentStep from './steps/WeeklyPlanEquipmentStep';
import WeeklyPlanTimeStep from './steps/WeeklyPlanTimeStep';
import WeeklyPlanRoleStep from './steps/WeeklyPlanRoleStep';
import WeeklyPlanConfigStep from './steps/WeeklyPlanConfigStep';
import WeeklyPlanFinalStep from './steps/WeeklyPlanFinalStep';

interface WeeklyPlanStepContentProps {
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

const WeeklyPlanStepContent: React.FC<WeeklyPlanStepContentProps> = ({ 
  currentStep, 
  planState, 
  resources, 
  handlers,
  isLoading
}) => {
  switch (currentStep) {
    case 1:
      return (
        <BasicInfoStep 
          planData={{ 
            title: planState.title,
            schoolId: planState.schoolId, 
            grade: planState.grade
          }} 
          schools={resources.schools}
          updatePlanData={(data) => {
            if (data.title !== undefined) handlers.setTitle(data.title);
            if (data.schoolId !== undefined) handlers.setSchoolId(data.schoolId);
            if (data.grade !== undefined) handlers.setGrade(data.grade);
          }}
          goToNextStep={handlers.nextStep}
          isStepComplete={() => !!planState.title && !!planState.schoolId}
        />
      );
    case 2:
      return (
        <EnvironmentsStep 
          planData={{ 
            environments: planState.environments 
          }} 
          availableEnvironments={resources.environments}
          updatePlanData={(data) => {
            if (data.environments !== undefined) handlers.setEnvironments(data.environments);
          }}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isStepComplete={() => planState.environments.length > 0}
        />
      );
    case 3:
      return (
        <WeeklyPlanPreparationStep
          selectedItems={planState.preparationItems}
          setSelectedItems={handlers.setPreparationItems}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    case 4:
      return (
        <WeeklyPlanMainStep
          selectedItems={planState.mainItems}
          availableConstructs={resources.constructs}
          setSelectedItems={handlers.setMainItems}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    case 5:
      return (
        <WeeklyPlanFinishStep
          selectedItems={planState.finishItems}
          setSelectedItems={handlers.setFinishItems}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    case 6:
      return (
        <WeeklyPlanEquipmentStep 
          planData={{
            equipment: planState.equipment,
            environments: planState.environments,
            schoolId: planState.schoolId
          }}
          availableEquipment={resources.availableEquipment}
          updatePlanData={(data) => {
            if (data.equipment !== undefined) handlers.setEquipment(data.equipment);
          }}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isStepComplete={() => true}
        />
      );
    case 7:
      return (
        <WeeklyPlanTimeStep 
          planData={{
            preparationTime: planState.preparationTime,
            mainTime: planState.mainTime,
            finishTime: planState.finishTime
          }}
          updatePlanData={(data) => {
            if (data.preparationTime !== undefined) handlers.setPreparationTime(data.preparationTime);
            if (data.mainTime !== undefined) handlers.setMainTime(data.mainTime);
            if (data.finishTime !== undefined) handlers.setFinishTime(data.finishTime);
          }}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isStepComplete={() => true}
        />
      );
    case 8:
      return (
        <WeeklyPlanRoleStep 
          planData={{
            preparationRoleId: planState.preparationRoleId,
            mainRoleId: planState.mainRoleId,
            finishRoleId: planState.finishRoleId
          }}
          roles={resources.roles}
          updatePlanData={(data) => {
            if (data.preparationRoleId !== undefined) handlers.setPreparationRoleId(data.preparationRoleId);
            if (data.mainRoleId !== undefined) handlers.setMainRoleId(data.mainRoleId);
            if (data.finishRoleId !== undefined) handlers.setFinishRoleId(data.finishRoleId);
          }}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isStepComplete={() => true}
        />
      );
    case 9:
      return (
        <WeeklyPlanConfigStep
          planData={{
            weeksCount: planState.weeksCount,
            lessonsPerWeek: planState.lessonsPerWeek,
          }}
          updatePlanData={(data) => {
            if (data.weeksCount !== undefined) handlers.setWeeksCount(data.weeksCount);
            if (data.lessonsPerWeek !== undefined) handlers.setLessonsPerWeek(data.lessonsPerWeek);
          }}
          goToNextStep={handlers.nextStep}
          goToPrevStep={handlers.prevStep}
          isStepComplete={() => planState.weeksCount > 0 && planState.lessonsPerWeek > 0}
        />
      );
    case 10:
      return (
        <WeeklyPlanFinalStep
          planState={planState}
          handleCreate={handlers.handleCreate}
          goToPrevStep={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    default:
      return null;
  }
};

export default WeeklyPlanStepContent;
