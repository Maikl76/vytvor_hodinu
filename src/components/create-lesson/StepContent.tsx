import React from 'react';
import SchoolStep from './SchoolStep';
import EnvironmentStep from './EnvironmentStep';
import PreparationStep from './PreparationStep';
import MainStep from './MainStep';
import FinishStep from './FinishStep';
import EquipmentStep from './EquipmentStep';
import TimeStep from './TimeStep';
import RoleStep from './RoleStep';

interface StepContentProps {
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

const StepContent: React.FC<StepContentProps> = ({ 
  currentStep, 
  lessonState, 
  resources, 
  handlers,
  isLoading
}) => {
  console.log("StepContent - Current step:", currentStep);
  console.log("StepContent - Construct ID:", lessonState.constructId);

  switch (currentStep) {
    case 1:
      return (
        <SchoolStep 
          lessonData={{ 
            school: '', 
            schoolId: lessonState.schoolId, 
            lessonsPerWeek: 2, 
            grade: lessonState.grade
          }} 
          schools={resources.schools}
          updateLessonData={(data) => {
            if (data.schoolId !== undefined) handlers.setSchoolId(data.schoolId);
            if (data.grade !== undefined) handlers.setGrade(data.grade);
          }}
          goToNextStep={handlers.nextStep}
          isStepComplete={() => !!lessonState.schoolId}
        />
      );
    case 2:
      return (
        <EnvironmentStep 
          lessonData={{ 
            environment: '', 
            environmentId: lessonState.environmentId 
          }} 
          environments={resources.environments}
          updateLessonData={(data) => {
            if (data.environmentId !== undefined) handlers.setEnvironmentId(data.environmentId);
          }}
          goToNextStep={handlers.nextStep}
          isStepComplete={() => !!lessonState.environmentId}
          setActiveTab={handlers.prevStep}
        />
      );
    case 3:
      return (
        <PreparationStep
          selectedItems={lessonState.selectedItems.preparationItems}
          setSelectedItems={(items) => handlers.setSelectedItems({
            ...lessonState.selectedItems,
            preparationItems: items
          })}
          goToNextStep={handlers.nextStep}
          setActiveTab={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    case 4:
      return (
        <MainStep
          constructId={lessonState.constructId}
          selectedItems={lessonState.selectedItems.mainItems}
          setSelectedItems={(items) => handlers.setSelectedItems({
            ...lessonState.selectedItems,
            mainItems: items
          })}
          goToNextStep={handlers.nextStep}
          setActiveTab={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    case 5:
      return (
        <FinishStep
          selectedItems={lessonState.selectedItems.finishItems}
          setSelectedItems={(items) => handlers.setSelectedItems({
            ...lessonState.selectedItems,
            finishItems: items
          })}
          goToNextStep={handlers.nextStep}
          setActiveTab={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    case 6:
      return (
        <EquipmentStep 
          lessonData={{
            equipment: lessonState.equipment,
            environmentId: lessonState.environmentId
          }}
          equipment={resources.availableEquipment}
          updateLessonData={(data) => {
            if (data.equipment !== undefined) handlers.setEquipment(data.equipment);
          }}
          goToNextStep={handlers.nextStep}
          isStepComplete={() => true}
          setActiveTab={handlers.prevStep}
        />
      );
    case 7:
      return (
        <TimeStep 
          lessonData={{
            preparationTime: lessonState.preparationTime,
            mainTime: lessonState.mainTime,
            finishTime: lessonState.finishTime
          }}
          updateLessonData={(data) => {
            if (data.preparationTime !== undefined) handlers.setPreparationTime(data.preparationTime);
            if (data.mainTime !== undefined) handlers.setMainTime(data.mainTime);
            if (data.finishTime !== undefined) handlers.setFinishTime(data.finishTime);
          }}
          goToNextStep={handlers.nextStep}
          isStepComplete={() => true}
          setActiveTab={handlers.prevStep}
        />
      );
    case 8:
      return (
        <RoleStep 
          lessonData={{
            preparationRoleId: lessonState.preparationRoleId,
            mainRoleId: lessonState.mainRoleId,
            finishRoleId: lessonState.finishRoleId
          }}
          roles={resources.roles}
          updateLessonData={(data) => {
            if (data.preparationRoleId !== undefined) handlers.setPreparationRoleId(data.preparationRoleId);
            if (data.mainRoleId !== undefined) handlers.setMainRoleId(data.mainRoleId);
            if (data.finishRoleId !== undefined) handlers.setFinishRoleId(data.finishRoleId);
          }}
          goToNextStep={handlers.handleCreate}
          isStepComplete={() => true}
          setActiveTab={handlers.prevStep}
          isLoading={isLoading}
        />
      );
    default:
      return null;
  }
};

export default StepContent;
