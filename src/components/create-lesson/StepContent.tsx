import React from 'react';
import { Card } from '@/components/ui/card';
import SchoolStep from './SchoolStep';
import EnvironmentStep from './EnvironmentStep';
import PreparationStep from './PreparationStep';
import MainStep from './MainStep';
import FinishStep from './FinishStep';
import ConstructStep from './construct/ConstructStep';
import EquipmentStep from './EquipmentStep';
import TimeStep from './TimeStep';
import RoleStep from './RoleStep';

interface StepContentProps {
  currentStep: number;
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
  schools: any[];
  environments: any[];
  constructs: any[];
  availableEquipment: any[];
  roles: any[];
  isLoading: boolean;
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
}

const StepContent: React.FC<StepContentProps> = (props) => {
  const setActiveTab = () => {
    props.prevStep();
  };

  switch (props.currentStep) {
    case 1:
      return (
        <Card>
          <SchoolStep
            lessonData={{
              title: props.title,
              schoolId: props.schoolId,
              school: props.schools.find(s => s.id === props.schoolId)?.name || '',
              lessonsPerWeek: props.schools.find(s => s.id === props.schoolId)?.lessons_per_week || 2,
              grade: props.grade
            }}
            schools={props.schools}
            updateLessonData={(data) => {
              if (data.title !== undefined) props.setTitle(data.title);
              if (data.schoolId !== undefined) props.setSchoolId(data.schoolId);
              if (data.grade !== undefined) props.setGrade(data.grade);
            }}
            goToNextStep={props.nextStep}
            isStepComplete={() => props.title.trim() !== '' && props.schoolId !== null && props.grade > 0}
          />
        </Card>
      );
    case 2:
      return (
        <Card>
          <EnvironmentStep
            lessonData={{
              environment: props.environments.find(e => e.id === props.environmentId)?.name || '',
              environmentId: props.environmentId
            }}
            environments={props.environments}
            updateLessonData={(data) => {
              if (data.environmentId !== undefined) props.setEnvironmentId(data.environmentId);
              if (data.equipment !== undefined) props.setEquipment(data.equipment);
            }}
            goToNextStep={props.nextStep}
            isStepComplete={() => props.environmentId !== null}
            setActiveTab={setActiveTab}
          />
        </Card>
      );
    case 3:
      return (
        <Card>
          <PreparationStep
            selectedItems={props.selectedItems.preparationItems}
            setSelectedItems={(items) => props.setSelectedItems(prev => ({ ...prev, preparationItems: items }))}
            goToNextStep={props.nextStep}
            setActiveTab={setActiveTab}
            isLoading={props.isLoading}
          />
        </Card>
      );
    case 4:
      return (
        <Card>
          <MainStep
            constructId={props.constructId}
            selectedItems={props.selectedItems.mainItems}
            setSelectedItems={(items) => {
              console.log("🎯 STEP CONTENT - Setting main items:", items);
              props.setSelectedItems(prev => ({ 
                ...prev, 
                mainItems: items 
              }));
            }}
            goToNextStep={props.nextStep}
            setActiveTab={setActiveTab}
            isLoading={props.isLoading}
            setConstructId={props.setConstructId}
          />
        </Card>
      );
    case 5:
      return (
        <Card>
          <FinishStep
            selectedItems={props.selectedItems.finishItems}
            setSelectedItems={(items) => props.setSelectedItems(prev => ({ ...prev, finishItems: items }))}
            goToNextStep={props.nextStep}
            setActiveTab={setActiveTab}
            isLoading={props.isLoading}
          />
        </Card>
      );
    case 6:
      return (
        <Card>
          <EquipmentStep
            lessonData={{
              equipment: props.equipment,
              environmentId: props.environmentId,
              schoolId: props.schoolId
            }}
            equipment={props.availableEquipment}
            updateLessonData={(data) => {
              if (data.equipment !== undefined) props.setEquipment(data.equipment);
            }}
            goToNextStep={props.nextStep}
            isStepComplete={() => true}
            setActiveTab={setActiveTab}
          />
        </Card>
      );
    case 7:
      return (
        <Card>
          <TimeStep
            lessonData={{
              preparationTime: props.preparationTime,
              mainTime: props.mainTime,
              finishTime: props.finishTime
            }}
            updateLessonData={(data) => {
              if (data.preparationTime !== undefined) props.setPreparationTime(data.preparationTime);
              if (data.mainTime !== undefined) props.setMainTime(data.mainTime);
              if (data.finishTime !== undefined) props.setFinishTime(data.finishTime);
            }}
            goToNextStep={props.nextStep}
            isStepComplete={() => true}
            setActiveTab={setActiveTab}
          />
        </Card>
      );
    case 8:
      return (
        <Card>
          <RoleStep
            lessonData={{
              preparationRoleId: props.preparationRoleId,
              mainRoleId: props.mainRoleId,
              finishRoleId: props.finishRoleId
            }}
            roles={props.roles}
            updateLessonData={(data) => {
              if (data.preparationRoleId !== undefined) props.setPreparationRoleId(data.preparationRoleId);
              if (data.mainRoleId !== undefined) props.setMainRoleId(data.mainRoleId);
              if (data.finishRoleId !== undefined) props.setFinishRoleId(data.finishRoleId);
            }}
            goToNextStep={props.handleCreate}
            isStepComplete={() => true}
            setActiveTab={setActiveTab}
            isLoading={props.isLoading}
          />
        </Card>
      );
    default:
      return null;
  }
};

export default StepContent;
