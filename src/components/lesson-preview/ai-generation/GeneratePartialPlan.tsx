
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateAILessonPlan, LessonGenerationRequest, LessonExerciseData, PromptData } from '@/services/aiService';
import { PhaseSelectionDialog } from './PhaseSelectionDialog';
import { getSelectedItemDetails } from './utils/activityUtils';
import { translatePhase } from './utils/translationUtils';

interface GeneratePartialPlanProps {
  lessonData: any;
  equipmentNames: string[];
  onSuccess: (exerciseData: LessonExerciseData, promptData?: PromptData) => void;
}

export const GeneratePartialPlan: React.FC<GeneratePartialPlanProps> = ({
  lessonData,
  equipmentNames,
  onSuccess
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);

  const handleSelectPhase = (phase: string) => {
    if (selectedPhases.includes(phase)) {
      setSelectedPhases(selectedPhases.filter(p => p !== phase));
    } else {
      setSelectedPhases([...selectedPhases, phase]);
    }
  };

  const openPhasesDialog = () => {
    setSelectedPhases([]);
    setIsDialogOpen(true);
  };

  const handleGenerateFromActivities = async () => {
    if (!lessonData || selectedPhases.length === 0) return;
    
    setIsGenerating(true);
    setIsDialogOpen(false);
    
    try {
      // Připravíme údaje o vybraných aktivitách
      const selectedActivitiesInfo: Record<string, any[]> = {};
      
      // Pro každou vybranou fázi získáme kompletní informace o aktivitách
      // Místo používání selectedItems.phaseItems použijeme přímo exerciseData
      if (selectedPhases.includes('preparation')) {
        // Vytvoříme IDs pro přípravnou část (1000-1999)
        const prepItemIds = lessonData.exerciseData.preparation.map((_: any, index: number) => 1000 + index);
        const itemDetails = await getSelectedItemDetails(prepItemIds, lessonData);
        selectedActivitiesInfo['preparation'] = itemDetails;
      }
      
      if (selectedPhases.includes('main')) {
        // Vytvoříme IDs pro hlavní část (2000-2999)
        const mainItemIds = lessonData.exerciseData.main.map((_: any, index: number) => 2000 + index);
        const itemDetails = await getSelectedItemDetails(mainItemIds, lessonData);
        selectedActivitiesInfo['main'] = itemDetails;
      }
      
      if (selectedPhases.includes('finish')) {
        // Vytvoříme IDs pro závěrečnou část (3000-3999)
        const finishItemIds = lessonData.exerciseData.finish.map((_: any, index: number) => 3000 + index);
        const itemDetails = await getSelectedItemDetails(finishItemIds, lessonData);
        selectedActivitiesInfo['finish'] = itemDetails;
      }
      
      console.log("Selected activities info for prompt:", selectedActivitiesInfo);
      
      // Kontrola, zda máme nějaké aktivity
      let hasActivities = false;
      for (const phase of selectedPhases) {
        if (selectedActivitiesInfo[phase] && selectedActivitiesInfo[phase].length > 0) {
          hasActivities = true;
          break;
        }
      }
      
      if (!hasActivities) {
        toast({
          title: "Žádné aktivity",
          description: "Pro vybrané části nejsou definovány žádné aktivity. Vyberte nejprve aktivity v kroku tvorby hodiny.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      // Příprava dat pro generování
      const request: LessonGenerationRequest = {
        school: lessonData.school || '',
        construct: lessonData.construct || '',
        environment: lessonData.environment || '',
        equipment: [], // Nevkládáme vybavení, aby se model soustředil pouze na aktivity
        preparationTime: lessonData.preparationTime || 10,
        mainTime: lessonData.mainTime || 25,
        finishTime: lessonData.finishTime || 10,
        preparationRole: lessonData.preparationRole || '',
        mainRole: lessonData.mainRole || '',
        finishRole: lessonData.finishRole || '',
        grade: lessonData.grade || 1,
        selectedActivitiesPhases: selectedPhases,
        selectedActivitiesInfo: selectedActivitiesInfo
      };
      
      // Volání AI služby s označením o vybraných fázích a aktivitách
      const result = await generateAILessonPlan(request);
      
      if (result && result.exercises) {
        // Úspěšné generování - připravíme nová data s ohledem na vybrané fáze
        const currentExercises = lessonData.exerciseData || {
          preparation: [],
          main: [],
          finish: []
        };
        
        // Pro každou fázi zkontrolujeme, zda byla vybrána, a pokud ne, zachováme původní cvičení
        const finalExercises = {
          preparation: selectedPhases.includes('preparation') ? result.exercises.preparation : currentExercises.preparation,
          main: selectedPhases.includes('main') ? result.exercises.main : currentExercises.main,
          finish: selectedPhases.includes('finish') ? result.exercises.finish : currentExercises.finish
        };
        
        onSuccess(finalExercises, result.promptData);
        
        toast({
          title: "Alternativní plán vygenerován",
          description: `Byly upraveny vybrané části plánu hodiny (${selectedPhases.map(translatePhase).join(', ')}).`,
        });
      } else {
        toast({
          title: "Chyba při generování",
          description: "Nepodařilo se vygenerovat nový plán. Původní plán zůstává nezměněn.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Chyba při generování alternativního plánu z aktivit:', error);
      toast({
        title: "Chyba při generování",
        description: error.message || "Nastala neočekávaná chyba při generování plánu.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button 
        className="w-full" 
        variant="outline"
        onClick={openPhasesDialog} 
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generuji plán z vybraných aktivit...
          </>
        ) : (
          'Vygenerovat alternativní plán na základě vybraných aktivit pomocí AI'
        )}
      </Button>

      <PhaseSelectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPhases={selectedPhases}
        onSelectPhase={handleSelectPhase}
        onGenerate={handleGenerateFromActivities}
      />
    </>
  );
}
