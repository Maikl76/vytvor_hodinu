import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, Save, RefreshCw, Eye, CheckCircle, Settings } from 'lucide-react';
import { LessonExerciseData } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { useWeeklyPlanSaver } from '@/hooks/useWeeklyPlanSaver';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EditToggle from '../lesson-preview/EditToggle';
import ExerciseSection from '../lesson-preview/ExerciseSection';
import { ExerciseItem } from '../lesson-preview/ExerciseSection';

interface WeeklyPlanGeneratedProps {
  planTitle: string;
  weeks: number;
  lessonsPerWeek: number;
  lessonsData: {
    [key: string]: {
      week: number;
      lessonNumber: number;
      exercises?: LessonExerciseData;
      isGenerating?: boolean;
      error?: string;
      promptData?: {
        systemPrompt?: string;
        userPrompt?: string;
      };
    }
  };
  onSavePlan: () => Promise<void>;
  onExportPlan: () => void;
  onGenerateSingleLesson: (week: number, lessonNumber: number) => void;
  isSaved?: boolean;
  savedPlanId?: string | null;
  onBackToPreview?: () => void;
  onEditActivities?: () => void;
}

const WeeklyPlanGenerated: React.FC<WeeklyPlanGeneratedProps> = ({
  planTitle,
  weeks,
  lessonsPerWeek,
  lessonsData,
  onSavePlan,
  onExportPlan,
  onGenerateSingleLesson,
  isSaved = false,
  savedPlanId,
  onBackToPreview,
  onEditActivities
}) => {
  const [activeWeek, setActiveWeek] = useState<string>("1");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [selectedPromptData, setSelectedPromptData] = useState<any>(null);
  const [editingLessons, setEditingLessons] = useState<Record<string, boolean>>({});
  const [editableData, setEditableData] = useState<Record<string, any>>({});
  const [generatingLessons, setGeneratingLessons] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { saveWeeklyPlanExercises, isSaving: isSavingExercises } = useWeeklyPlanSaver();
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('🔄 Ukládám plán...');
      console.log('savedPlanId:', savedPlanId);
      console.log('editableData:', editableData);
      
      // Vždy použijeme onSavePlan z parent komponenty
      await onSavePlan();
      
      toast({
        title: "Plán uložen",
        description: "Týdenní plán byl úspěšně uložen.",
      });
    } catch (error) {
      console.error('❌ Chyba při ukládání plánu:', error);
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit týdenní plán.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportPlan();
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateSingleLesson = async (week: number, lessonNumber: number) => {
    const lessonKey = `${week}-${lessonNumber}`;
    
    // Add to generating set
    setGeneratingLessons(prev => new Set(prev).add(lessonKey));
    
    try {
      await onGenerateSingleLesson(week, lessonNumber);
    } finally {
      // Remove from generating set after completion (success or error)
      setGeneratingLessons(prev => {
        const newSet = new Set(prev);
        newSet.delete(lessonKey);
        return newSet;
      });
    }
  };
  
  const handleShowPrompt = (week: number, lessonNumber: number) => {
    const lessonKey = `${week}-${lessonNumber}`;
    const lessonData = lessonsData[lessonKey];
    
    if (lessonData?.promptData) {
      setSelectedPromptData(lessonData.promptData);
      setShowPrompt(true);
    } else {
      toast({
        title: "Prompt nedostupný",
        description: "Pro tuto hodinu není prompt k dispozici",
        variant: "destructive"
      });
    }
  };

  const handleToggleEdit = (lessonKey: string) => {
    const isCurrentlyEditing = editingLessons[lessonKey];
    
    if (isCurrentlyEditing) {
      // Cancel editing
      setEditingLessons(prev => ({ ...prev, [lessonKey]: false }));
      // Reset data to original
      if (lessonsData[lessonKey]?.exercises) {
        setEditableData(prev => ({ ...prev, [lessonKey]: lessonsData[lessonKey].exercises }));
      }
    } else {
      // Start editing
      setEditingLessons(prev => ({ ...prev, [lessonKey]: true }));
      // Initialize editable data
      if (lessonsData[lessonKey]?.exercises) {
        setEditableData(prev => ({ ...prev, [lessonKey]: lessonsData[lessonKey].exercises }));
      }
    }
  };

  const handleSaveLesson = async (lessonKey: string) => {
    if (savedPlanId && editableData[lessonKey]) {
      // Convert the single lesson data to the format expected by saveWeeklyPlanToDatabase
      const [week, lessonNumber] = lessonKey.split('-').map(Number);
      const lessonDataToSave = {
        [lessonKey]: {
          week,
          lessonNumber,
          exercises: editableData[lessonKey]
        }
      };
      
      const success = await saveWeeklyPlanExercises(savedPlanId, lessonDataToSave);
      
      if (success) {
        // Update the main lessons data
        lessonsData[lessonKey].exercises = editableData[lessonKey];
        setEditingLessons(prev => ({ ...prev, [lessonKey]: false }));
      }
    } else {
      // For unsaved plans, just exit edit mode
      setEditingLessons(prev => ({ ...prev, [lessonKey]: false }));
      
      toast({
        title: "Hodina uložena",
        description: "Změny v hodině byly úspěšně uloženy.",
      });
    }
  };

  // Handle exercise changes for auto-save during editing
  const handleExerciseChange = async (lessonKey: string, phase: 'preparation' | 'main' | 'finish', exercises: ExerciseItem[]) => {
    const isEditing = editingLessons[lessonKey];
    
    if (isEditing && savedPlanId) {
      // Update editable data
      setEditableData(prev => {
        const currentData = prev[lessonKey] || lessonsData[lessonKey]?.exercises;
        if (!currentData) return prev;

        const newData = { ...currentData };
        newData[phase] = exercises;

        return { ...prev, [lessonKey]: newData };
      });

      // Auto-save to database if plan is already saved
      const [week, lessonNumber] = lessonKey.split('-').map(Number);
      const updatedExerciseData = {
        ...editableData[lessonKey],
        [phase]: exercises
      };
      
      const lessonDataToSave = {
        [lessonKey]: {
          week,
          lessonNumber,
          exercises: updatedExerciseData
        }
      };
      
      await saveWeeklyPlanExercises(savedPlanId, lessonDataToSave);
    }
  };

  const updateLessonExercise = (lessonKey: string, phase: 'preparation' | 'main' | 'finish', index: number, field: string, value: string | number) => {
    setEditableData(prev => {
      const currentData = prev[lessonKey] || lessonsData[lessonKey]?.exercises;
      if (!currentData) return prev;

      const newData = { ...currentData };
      const exercises = [...(newData[phase] || [])];
      if (exercises[index]) {
        exercises[index] = { ...exercises[index], [field]: value };
        newData[phase] = exercises;
      }

      return { ...prev, [lessonKey]: newData };
    });
  };

  const reorderLessonExercises = (lessonKey: string, phase: 'preparation' | 'main' | 'finish', oldIndex: number, newIndex: number) => {
    setEditableData(prev => {
      const currentData = prev[lessonKey] || lessonsData[lessonKey]?.exercises;
      if (!currentData) return prev;

      const newData = { ...currentData };
      const exercises = [...(newData[phase] || [])];
      const [reorderedItem] = exercises.splice(oldIndex, 1);
      exercises.splice(newIndex, 0, reorderedItem);
      newData[phase] = exercises;

      return { ...prev, [lessonKey]: newData };
    });
  };

  const deleteLessonExercise = (lessonKey: string, phase: 'preparation' | 'main' | 'finish', index: number) => {
    setEditableData(prev => {
      const currentData = prev[lessonKey] || lessonsData[lessonKey]?.exercises;
      if (!currentData) return prev;

      const newData = { ...currentData };
      const exercises = [...(newData[phase] || [])];
      exercises.splice(index, 1);
      newData[phase] = exercises;

      return { ...prev, [lessonKey]: newData };
    });
  };

  const addLessonExercise = (lessonKey: string, phase: 'preparation' | 'main' | 'finish') => {
    const newExercise: ExerciseItem = {
      name: 'Nové cvičení',
      description: 'Popis cvičení',
      time: 5,
      phase: phase
    };

    setEditableData(prev => {
      const currentData = prev[lessonKey] || lessonsData[lessonKey]?.exercises;
      if (!currentData) return prev;

      const newData = { ...currentData };
      const exercises = [...(newData[phase] || [])];
      exercises.push(newExercise);
      newData[phase] = exercises;

      return { ...prev, [lessonKey]: newData };
    });
  };

  const getCurrentExerciseData = (lessonKey: string) => {
    return editableData[lessonKey] || lessonsData[lessonKey]?.exercises;
  };

  const isLessonModified = (lessonKey: string) => {
    const original = lessonsData[lessonKey]?.exercises;
    const current = editableData[lessonKey];
    return current && JSON.stringify(original) !== JSON.stringify(current);
  };
  
  // Check if we have any generated lessons to save
  const hasGeneratedLessons = Object.values(lessonsData).some(lesson => lesson.exercises);
  
  const generateWeekTabs = () => {
    const tabs = [];
    for (let i = 1; i <= weeks; i++) {
      tabs.push(
        <TabsTrigger key={`week-${i}`} value={i.toString()}>
          Týden {i}
        </TabsTrigger>
      );
    }
    return tabs;
  };
  
  const generateWeekContent = () => {
    const content = [];
    for (let week = 1; week <= weeks; week++) {
      const weekLessons = [];
      for (let lesson = 1; lesson <= lessonsPerWeek; lesson++) {
        const lessonKey = `${week}-${lesson}`;
        const lessonData = lessonsData[lessonKey] || { 
          week, 
          lessonNumber: lesson, 
          isGenerating: false 
        };
        const isEditing = editingLessons[lessonKey];
        const currentExerciseData = getCurrentExerciseData(lessonKey);
        const isGeneratingLesson = generatingLessons.has(lessonKey);
        
        weekLessons.push(
          <Card key={`lesson-${lessonKey}`} className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>
                  Hodina {lesson}
                  {isSavingExercises && <span className="text-blue-600 ml-2 text-sm">(ukládání...)</span>}
                </span>
                <div className="flex gap-2 items-center">
                  {lessonData.exercises && (
                    <EditToggle
                      isEditing={isEditing}
                      isModified={isLessonModified(lessonKey)}
                      onToggleEdit={() => handleToggleEdit(lessonKey)}
                      onSave={() => handleSaveLesson(lessonKey)}
                      onCancel={() => handleToggleEdit(lessonKey)}
                    />
                  )}
                  {!lessonData.isGenerating && !isGeneratingLesson && (
                    <>
                      {!lessonData.exercises && !lessonData.error && (
                        <Button 
                          onClick={() => handleGenerateSingleLesson(week, lesson)}
                          size="sm"
                        >
                          Vygenerovat hodinu
                        </Button>
                      )}
                      {(lessonData.exercises || lessonData.error) && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShowPrompt(week, lesson)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Zobrazit prompt
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleGenerateSingleLesson(week, lesson)}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerovat
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessonData.isGenerating || isGeneratingLesson ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <span className="ml-3">Generuji hodinu...</span>
                </div>
              ) : lessonData.error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-md">
                  <p className="font-medium">Chyba při generování</p>
                  <p className="text-sm">{lessonData.error}</p>
                </div>
              ) : currentExerciseData ? (
                <div className="space-y-6">
                  {currentExerciseData.preparation && currentExerciseData.preparation.length > 0 && (
                    <ExerciseSection
                      title="Přípravná část"
                      duration={10}
                      role="Příprava"
                      exercises={currentExerciseData.preparation}
                      phase="preparation"
                      isEditable={isEditing}
                      onUpdateExercise={(index, field, value) => 
                        updateLessonExercise(lessonKey, 'preparation', index, field, value)
                      }
                      onReorderExercises={(oldIndex, newIndex) => 
                        reorderLessonExercises(lessonKey, 'preparation', oldIndex, newIndex)
                      }
                      onDeleteExercise={(index) => 
                        deleteLessonExercise(lessonKey, 'preparation', index)
                      }
                      onAddExercise={() => 
                        addLessonExercise(lessonKey, 'preparation')
                      }
                      actualDuration={currentExerciseData.preparation.reduce((sum, ex) => sum + (ex.time || 0), 0)}
                      onExerciseChange={(phase, exercises) => handleExerciseChange(lessonKey, phase, exercises)}
                    />
                  )}
                  
                  {currentExerciseData.main && currentExerciseData.main.length > 0 && (
                    <ExerciseSection
                      title="Hlavní část"
                      duration={25}
                      role="Hlavní činnost"
                      exercises={currentExerciseData.main}
                      phase="main"
                      isEditable={isEditing}
                      onUpdateExercise={(index, field, value) => 
                        updateLessonExercise(lessonKey, 'main', index, field, value)
                      }
                      onReorderExercises={(oldIndex, newIndex) => 
                        reorderLessonExercises(lessonKey, 'main', oldIndex, newIndex)
                      }
                      onDeleteExercise={(index) => 
                        deleteLessonExercise(lessonKey, 'main', index)
                      }
                      onAddExercise={() => 
                        addLessonExercise(lessonKey, 'main')
                      }
                      actualDuration={currentExerciseData.main.reduce((sum, ex) => sum + (ex.time || 0), 0)}
                      onExerciseChange={(phase, exercises) => handleExerciseChange(lessonKey, phase, exercises)}
                    />
                  )}
                  
                  {currentExerciseData.finish && currentExerciseData.finish.length > 0 && (
                    <ExerciseSection
                      title="Závěrečná část"
                      duration={10}
                      role="Uklidnění"
                      exercises={currentExerciseData.finish}
                      phase="finish"
                      isEditable={isEditing}
                      onUpdateExercise={(index, field, value) => 
                        updateLessonExercise(lessonKey, 'finish', index, field, value)
                      }
                      onReorderExercises={(oldIndex, newIndex) => 
                        reorderLessonExercises(lessonKey, 'finish', oldIndex, newIndex)
                      }
                      onDeleteExercise={(index) => 
                        deleteLessonExercise(lessonKey, 'finish', index)
                      }
                      onAddExercise={() => 
                        addLessonExercise(lessonKey, 'finish')
                      }
                      actualDuration={currentExerciseData.finish.reduce((sum, ex) => sum + (ex.time || 0), 0)}
                      onExerciseChange={(phase, exercises) => handleExerciseChange(lessonKey, phase, exercises)}
                    />
                  )}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Hodina ještě nebyla vygenerována</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }
      
      content.push(
        <TabsContent key={`week-content-${week}`} value={week.toString()}>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Týden {week}</h2>
          </div>
          {weekLessons}
        </TabsContent>
      );
    }
    return content;
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{planTitle}</h1>
            {isSaved && savedPlanId && (
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Plán je uložen v historii (ID: {savedPlanId.slice(0, 8)}...)
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {onBackToPreview && (
              <Button 
                variant="outline" 
                onClick={onBackToPreview}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                Zpět na přehled
              </Button>
            )}
            {onEditActivities && (
              <Button 
                variant="outline" 
                onClick={onEditActivities}
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Upravit aktivity pro AI
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleSave}
              className="flex items-center"
              disabled={isSaving || !hasGeneratedLessons}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isSaved ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Ukládání..." : isSaved ? "Aktualizovat plán" : "Uložit plán"}
            </Button>
            <Button 
              onClick={handleExport}
              className="flex items-center"
              disabled={isExporting || !hasGeneratedLessons}
            >
              {isExporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExporting ? "Exportuji..." : "Stáhnout plán"}
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Vygenerovaný více týdenní plán s {weeks} týdny a {lessonsPerWeek} hodinami týdně
          {!hasGeneratedLessons && (
            <span className="text-amber-600 ml-2">
              (Vygenerujte alespoň jednu hodinu pro uložení)
            </span>
          )}
        </p>
      </div>
      
      <Tabs defaultValue="1" value={activeWeek} onValueChange={setActiveWeek}>
        <TabsList className="mb-6 flex overflow-x-auto">
          {generateWeekTabs()}
        </TabsList>
        {generateWeekContent()}
      </Tabs>

      <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Prompt použitý pro AI generování</DialogTitle>
            <DialogDescription>
              Tyto prompty byly použity pro generování plánu hodiny pomocí AI.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto">
            {selectedPromptData?.systemPrompt && (
              <div>
                <h3 className="font-semibold mb-1">Systémový prompt:</h3>
                <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedPromptData.systemPrompt}
                </div>
              </div>
            )}
            
            {selectedPromptData?.userPrompt && (
              <div>
                <h3 className="font-semibold mb-1">Uživatelský prompt:</h3>
                <div className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {selectedPromptData.userPrompt}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyPlanGenerated;
