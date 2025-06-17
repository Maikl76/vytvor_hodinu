
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LessonHeader from '@/components/lesson-preview/LessonHeader';
import ExerciseSection from '@/components/lesson-preview/ExerciseSection';
import { AIGenerationSection } from '@/components/lesson-preview/ai-generation';
import ActionButtons from '@/components/lesson-preview/ActionButtons';
import EditToggle from '@/components/lesson-preview/EditToggle';
import { LessonExerciseData, PromptData } from '@/services/aiService';
import { useLoadLessonData } from '@/hooks/useLoadLessonData';
import { usePreviewActions } from '@/hooks/usePreviewActions';
import { useEditableExercises } from '@/hooks/useEditableExercises';
import { useLessonSaver } from '@/hooks/useLessonSaver';
import { useConstructsForSelectedItems } from '@/hooks/useConstructsForSelectedItems';
import LoadingState from '@/components/lesson-preview/LoadingState';
import { useToast } from '@/hooks/use-toast';

const PreviewLesson: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  
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
  
  // Load constructs for selected items
  const { constructs: selectedConstructs } = useConstructsForSelectedItems(lessonData?.selectedItems);
  
  // Editable exercises hook
  const {
    exerciseData: editableExerciseData,
    isModified,
    updateExercise,
    reorderExercises,
    deleteExercise,
    addExercise,
    calculateTotalTime,
    resetModifications
  } = useEditableExercises(exerciseData);
  
  // Get preview actions
  const { handleDownload, handleSaveToHistory } = usePreviewActions();
  
  // Lesson saver hook
  const { saveLessonExercises, isSaving } = useLessonSaver();
  
  // State for AI prompts
  const [promptData, setPromptData] = useState<PromptData | undefined>(undefined);
  
  // State to track if AI generation was successful
  const [showGeneratedActions, setShowGeneratedActions] = useState(false);
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Check if this is a generated lesson - moved up before useEffect
  const isGeneratedLesson = lessonData && lessonData.title && lessonData.title.includes('(Vygenerováno)');

  // Get display constructs - use selected constructs if available, fallback to single construct
  const displayConstructs = selectedConstructs.length > 0 ? selectedConstructs : 
    (lessonData?.construct ? [lessonData.construct] : []);

  // Handle AI success
  const handleAISuccess = (newExerciseData: LessonExerciseData, newPromptData?: PromptData) => {
    setExerciseData(newExerciseData);
    if (newPromptData) {
      setPromptData(newPromptData);
    }
    setShowGeneratedActions(true);
  };
  
  // Handle save edited exercises
  const handleSaveEdits = async () => {
    // If this is a history lesson, save changes to database
    if (params.id) {
      const success = await saveLessonExercises(params.id, editableExerciseData);
      if (success) {
        setExerciseData(editableExerciseData);
        setIsEditing(false);
      }
    } else {
      // For new lessons, just update local state
      setExerciseData(editableExerciseData);
      setIsEditing(false);
      toast({
        title: "Změny uloženy",
        description: "Úpravy hodiny byly úspěšně uloženy.",
      });
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    if (isModified) {
      resetModifications();
    }
    setIsEditing(false);
  };

  // Handle exercise changes for auto-save in edit mode
  const handleExerciseChange = async (phase: 'preparation' | 'main' | 'finish', exercises: any[]) => {
    if (isEditing && params.id) {
      // Auto-save changes to database when editing a history lesson
      const updatedExerciseData = {
        ...editableExerciseData,
        [phase]: exercises
      };
      
      // Update local state immediately for responsiveness
      updateExercise(phase, 0, 'name', exercises[0]?.name || '');
      
      // Save to database in background
      await saveLessonExercises(params.id, updatedExerciseData);
    }
  };
  
  // Redirect to create lesson page if no data is available - optimized
  useEffect(() => {
    if (!lessonData && !isLoading && !params.id && !locationLessonData) {
      navigate('/create-lesson');
    }
  }, [lessonData, isLoading, params.id, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  // If no data is available yet, show a temporary loading message
  if (!lessonData) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <p className="text-lg">Načítání dat hodiny...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalTime = lessonData ? 
    lessonData.preparationTime + lessonData.mainTime + lessonData.finishTime : 0;

  // Use edited data when in edit mode, otherwise use original data
  const displayExerciseData = isEditing ? editableExerciseData : exerciseData;
  const timeSummary = isEditing ? calculateTotalTime() : null;

  // Prepare enhanced lesson data with all necessary information
  const enhancedLessonData = {
    ...lessonData,
    exerciseData: displayExerciseData,
  };

  // KRITICKÉ: Pro equipment names používej VŽDY data z lessonData pro history hodiny
  const displayEquipmentNames = lessonData?.equipmentNames || equipmentNames || [];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Náhled hodiny
                {isModified && <span className="text-orange-600 ml-2">(upraveno)</span>}
                {isSaving && <span className="text-blue-600 ml-2">(ukládání...)</span>}
              </h1>
              <p className="text-gray-600 mt-2">
                {params.id ? 'Detail uložené hodiny' : 'Zkontrolujte vygenerovaný plán hodiny a uložte ho nebo stáhněte'}
              </p>
            </div>
            <EditToggle
              isEditing={isEditing}
              isModified={isModified}
              onToggleEdit={() => setIsEditing(true)}
              onSave={handleSaveEdits}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
        
        <LessonHeader 
          school={lessonData.school}
          construct={lessonData.construct}
          constructs={displayConstructs}
          environment={lessonData.environment}
          equipmentNames={displayEquipmentNames}
          totalTime={totalTime}
          preparationTime={lessonData.preparationTime}
          mainTime={lessonData.mainTime}
          finishTime={lessonData.finishTime}
          preparationRole={lessonData.preparationRole || "Neurčeno"}
          mainRole={lessonData.mainRole || "Neurčeno"}
          finishRole={lessonData.finishRole || "Neurčeno"}
          lessonTitle={lessonData.title}
        />
        
        {isEditing && timeSummary && (
          <Card className="mb-4 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Kontrola času cvičení</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Přípravná:</span> {timeSummary.preparation} min
                  <span className={`ml-1 ${timeSummary.preparation !== lessonData.preparationTime ? 'text-orange-600' : 'text-green-600'}`}>
                    ({timeSummary.preparation - lessonData.preparationTime > 0 ? '+' : ''}{timeSummary.preparation - lessonData.preparationTime})
                  </span>
                </div>
                <div>
                  <span className="font-medium">Hlavní:</span> {timeSummary.main} min
                  <span className={`ml-1 ${timeSummary.main !== lessonData.mainTime ? 'text-orange-600' : 'text-green-600'}`}>
                    ({timeSummary.main - lessonData.mainTime > 0 ? '+' : ''}{timeSummary.main - lessonData.mainTime})
                  </span>
                </div>
                <div>
                  <span className="font-medium">Závěrečná:</span> {timeSummary.finish} min
                  <span className={`ml-1 ${timeSummary.finish !== lessonData.finishTime ? 'text-orange-600' : 'text-green-600'}`}>
                    ({timeSummary.finish - lessonData.finishTime > 0 ? '+' : ''}{timeSummary.finish - lessonData.finishTime})
                  </span>
                </div>
                <div>
                  <span className="font-medium">Celkem:</span> {timeSummary.total} min
                  <span className={`ml-1 ${timeSummary.total !== totalTime ? 'text-orange-600' : 'text-green-600'}`}>
                    ({timeSummary.total - totalTime > 0 ? '+' : ''}{timeSummary.total - totalTime})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="shadow-md mb-6 overflow-hidden">
          <CardContent className="p-0">
            <ExerciseSection 
              title="Přípravná část"
              duration={lessonData.preparationTime}
              role={lessonData.preparationRole || "Neurčeno"}
              exercises={displayExerciseData.preparation}
              phase="preparation"
              isEditable={isEditing}
              onUpdateExercise={(index, field, value) => updateExercise('preparation', index, field, value)}
              onReorderExercises={(oldIndex, newIndex) => reorderExercises('preparation', oldIndex, newIndex)}
              onDeleteExercise={(index) => deleteExercise('preparation', index)}
              onAddExercise={() => addExercise('preparation')}
              actualDuration={timeSummary?.preparation}
              onExerciseChange={handleExerciseChange}
            />
            
            <ExerciseSection 
              title="Hlavní část"
              duration={lessonData.mainTime}
              role={lessonData.mainRole || "Neurčeno"}
              exercises={displayExerciseData.main}
              phase="main"
              isEditable={isEditing}
              onUpdateExercise={(index, field, value) => updateExercise('main', index, field, value)}
              onReorderExercises={(oldIndex, newIndex) => reorderExercises('main', oldIndex, newIndex)}
              onDeleteExercise={(index) => deleteExercise('main', index)}
              onAddExercise={() => addExercise('main')}
              actualDuration={timeSummary?.main}
              onExerciseChange={handleExerciseChange}
            />
            
            <ExerciseSection 
              title="Závěrečná část"
              duration={lessonData.finishTime}
              role={lessonData.finishRole || "Neurčeno"}
              exercises={displayExerciseData.finish}
              phase="finish"
              isEditable={isEditing}
              onUpdateExercise={(index, field, value) => updateExercise('finish', index, field, value)}
              onReorderExercises={(oldIndex, newIndex) => reorderExercises('finish', oldIndex, newIndex)}
              onDeleteExercise={(index) => deleteExercise('finish', index)}
              onAddExercise={() => addExercise('finish')}
              actualDuration={timeSummary?.finish}
              onExerciseChange={handleExerciseChange}
            />
          </CardContent>
        </Card>
        
        {!params.id && !isEditing && (
          <>
            <ActionButtons 
              onSave={() => handleSaveToHistory(lessonData, displayExerciseData)}
              onDownload={() => handleDownload(lessonData, displayEquipmentNames, displayExerciseData)}
              lessonData={lessonData}
              promptData={promptData}
            />
            
            <AIGenerationSection 
              lessonData={enhancedLessonData}
              equipmentNames={displayEquipmentNames}
              onSuccess={handleAISuccess}
            />
          </>
        )}
        
        {params.id && !isEditing && (
          <>
            <div className="flex justify-end mb-8">
              <Button 
                variant="outline" 
                onClick={() => handleDownload(lessonData, displayEquipmentNames, displayExerciseData)}
              >
                Stáhnout hodinu
              </Button>
            </div>
            
            {showGeneratedActions && (
              <ActionButtons 
                onSave={() => handleSaveToHistory(lessonData, displayExerciseData)}
                onDownload={() => handleDownload(lessonData, displayEquipmentNames, displayExerciseData)}
                lessonData={lessonData}
                promptData={promptData}
              />
            )}
            
            {!isGeneratedLesson && (
              <AIGenerationSection 
                lessonData={enhancedLessonData}
                equipmentNames={displayEquipmentNames}
                onSuccess={handleAISuccess}
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PreviewLesson;
