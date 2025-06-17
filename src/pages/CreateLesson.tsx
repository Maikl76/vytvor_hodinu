import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import LessonCreationContainer from '@/components/create-lesson/LessonCreationContainer';
import { useCreateLesson } from '@/hooks/useCreateLesson';

const CreateLesson: React.FC = () => {
  const location = useLocation();
  const savedLessonData = location.state?.lessonData;
  const returnFromPreview = location.state?.returnFromPreview;
  
  const {
    currentStep,
    title,
    schoolId,
    environmentId,
    constructId,
    equipment,
    grade,
    preparationTime,
    mainTime,
    finishTime,
    preparationRoleId,
    mainRoleId,
    finishRoleId,
    selectedItems,
    schools,
    environments,
    constructs,
    constructItems, // Now available from the hook
    availableEquipment,
    roles,
    isLoading,
    setTitle,
    setSchoolId,
    setEnvironmentId,
    setConstructId,
    setEquipment,
    setGrade,
    setPreparationTime,
    setMainTime,
    setFinishTime,
    setPreparationRoleId,
    setMainRoleId,
    setFinishRoleId,
    setSelectedItems,
    setCurrentStep,
    nextStep,
    prevStep,
    handleCreate,
    resetData
  } = useCreateLesson();

  // Restore the saved state if returning from preview
  useEffect(() => {
    if (savedLessonData && returnFromPreview) {
      console.log("Restoring lesson data:", savedLessonData);
      
      // Set title
      if (savedLessonData.title) setTitle(savedLessonData.title);
      
      // Set school related data
      if (savedLessonData.schoolId) setSchoolId(savedLessonData.schoolId);
      if (savedLessonData.grade) setGrade(savedLessonData.grade);
      
      // Set environment
      if (savedLessonData.environmentId) setEnvironmentId(savedLessonData.environmentId);
      
      // Set construct
      if (savedLessonData.constructId) setConstructId(savedLessonData.constructId);
      
      // Set equipment
      if (savedLessonData.equipment) setEquipment(savedLessonData.equipment);
      
      // Set times
      if (savedLessonData.preparationTime) setPreparationTime(savedLessonData.preparationTime);
      if (savedLessonData.mainTime) setMainTime(savedLessonData.mainTime);
      if (savedLessonData.finishTime) setFinishTime(savedLessonData.finishTime);
      
      // Set roles
      if (savedLessonData.preparationRoleId) setPreparationRoleId(savedLessonData.preparationRoleId);
      if (savedLessonData.mainRoleId) setMainRoleId(savedLessonData.mainRoleId);
      if (savedLessonData.finishRoleId) setFinishRoleId(savedLessonData.finishRoleId);
      
      // Set selected items
      if (savedLessonData.selectedItems) {
        setSelectedItems({
          preparationItems: savedLessonData.selectedItems.preparationItems || [],
          mainItems: savedLessonData.selectedItems.mainItems || [],
          finishItems: savedLessonData.selectedItems.finishItems || []
        });
      }
      
      // Go directly to the preparation step (step 3) 
      setCurrentStep(3);
    }
  }, [savedLessonData, returnFromPreview, setTitle, setSchoolId, setGrade, setEnvironmentId, setConstructId, setEquipment, setPreparationTime, setMainTime, setFinishTime, setPreparationRoleId, setMainRoleId, setFinishRoleId, setSelectedItems, setCurrentStep]);

  const lessonState = {
    title,
    schoolId,
    environmentId,
    constructId,
    equipment,
    grade,
    preparationTime,
    mainTime,
    finishTime,
    preparationRoleId,
    mainRoleId,
    finishRoleId,
    selectedItems
  };

  const resources = {
    schools,
    environments,
    constructs,
    constructItems, // Pass the actual constructItems from the hook
    availableEquipment,
    roles
  };

  const handlers = {
    setTitle,
    setSchoolId,
    setEnvironmentId,
    setConstructId,
    setEquipment,
    setGrade,
    setPreparationTime,
    setMainTime,
    setFinishTime,
    setPreparationRoleId,
    setMainRoleId,
    setFinishRoleId,
    setSelectedItems,
    nextStep,
    prevStep,
    handleCreate
  };

  return (
    <MainLayout>
      <LessonCreationContainer 
        currentStep={currentStep}
        lessonState={lessonState}
        resources={resources}
        handlers={handlers}
        isLoading={isLoading}
      />
    </MainLayout>
  );
};

export default CreateLesson;
