
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import LessonHeader from '@/components/lesson-preview/LessonHeader';
import ExerciseSection from '@/components/lesson-preview/ExerciseSection';
import { AIGenerationSection } from '@/components/lesson-preview/ai-generation';
import ActionButtons from '@/components/lesson-preview/ActionButtons';
import { LessonExerciseData, PromptData } from '@/services/aiService';
import { useLoadLessonData } from '@/hooks/useLoadLessonData';
import { usePreviewActions } from '@/hooks/usePreviewActions';
import LoadingState from '@/components/lesson-preview/LoadingState';

const PreviewLesson: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Safely get data from location state
  const { lessonData: locationLessonData } = location.state || { lessonData: null };
  
  // Load lesson data using custom hook
  const {
    lessonData,
    equipmentNames,
    exerciseData,
    setExerciseData,
    isLoading
  } = useLoadLessonData(params, locationLessonData);
  
  // Get preview actions
  const { handleDownload, handleSaveToHistory } = usePreviewActions();
  
  // State for AI prompts
  const [promptData, setPromptData] = useState<PromptData | undefined>(undefined);

  // Handle AI success
  const handleAISuccess = (newExerciseData: LessonExerciseData, newPromptData?: PromptData) => {
    setExerciseData(newExerciseData);
    if (newPromptData) {
      setPromptData(newPromptData);
    }
  };
  
  // Debug: log the current state of the lesson data and exercises
  useEffect(() => {
    if (lessonData) {
      console.log("Current lesson data:", lessonData);
      console.log("Current exercise data:", exerciseData);
    }
  }, [lessonData, exerciseData]);

  // If lessonData is not available, display loading state during redirection
  if (!lessonData && !isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <p className="text-lg">Přesměrování na stránku vytvoření hodiny...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  const totalTime = lessonData ? 
    lessonData.preparationTime + lessonData.mainTime + lessonData.finishTime : 0;

  // Prepare enhanced lesson data with all necessary information
  const enhancedLessonData = {
    ...lessonData,
    exerciseData: exerciseData,
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Náhled hodiny</h1>
          <p className="text-gray-600 mt-2">
            Zkontrolujte vygenerovaný plán hodiny a uložte ho nebo stáhněte
          </p>
        </div>
        
        <LessonHeader 
          school={lessonData.school}
          construct={lessonData.construct}
          environment={lessonData.environment}
          equipmentNames={equipmentNames}
          totalTime={totalTime}
          preparationTime={lessonData.preparationTime}
          mainTime={lessonData.mainTime}
          finishTime={lessonData.finishTime}
          preparationRole={lessonData.preparationRole || "Neurčeno"}
          mainRole={lessonData.mainRole || "Neurčeno"}
          finishRole={lessonData.finishRole || "Neurčeno"}
        />
        
        <Card className="shadow-md mb-6 overflow-hidden">
          <CardContent className="p-0">
            <ExerciseSection 
              title="Přípravná část"
              duration={lessonData.preparationTime}
              role={lessonData.preparationRole || "Neurčeno"}
              exercises={exerciseData.preparation}
            />
            
            <ExerciseSection 
              title="Hlavní část"
              duration={lessonData.mainTime}
              role={lessonData.mainRole || "Neurčeno"}
              exercises={exerciseData.main}
            />
            
            <ExerciseSection 
              title="Závěrečná část"
              duration={lessonData.finishTime}
              role={lessonData.finishRole || "Neurčeno"}
              exercises={exerciseData.finish}
            />
          </CardContent>
        </Card>
        
        <ActionButtons 
          onSave={() => handleSaveToHistory(lessonData, exerciseData)}
          onDownload={() => handleDownload(lessonData, equipmentNames, exerciseData)}
          lessonData={lessonData}
          promptData={promptData}
        />
        
        <AIGenerationSection 
          lessonData={enhancedLessonData}
          equipmentNames={equipmentNames}
          onSuccess={handleAISuccess}
        />
      </div>
    </MainLayout>
  );
};

export default PreviewLesson;
