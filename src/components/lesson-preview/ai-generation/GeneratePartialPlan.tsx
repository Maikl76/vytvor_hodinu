
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateAILessonPlan, LessonGenerationRequest, LessonExerciseData, PromptData } from '@/services/aiService';
import { PhaseSelectionDialog } from './PhaseSelectionDialog';
import { translatePhase } from './utils/translationUtils';
import { supabase } from '@/integrations/supabase/client';

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

  /**
   * Získá podrobnosti o aktivitách z originalních vybraných položek plánu
   */
  const getSelectedItemDetails = async (itemIds: number[], lessonData: any): Promise<any[]> => {
    console.log('🔍 Načítám podrobnosti pro vybrané položky:', itemIds);
    console.log('📊 Dostupná lesson data:', lessonData);
    
    const selectedActivities: any[] = [];
    
    // Pro hodiny z historie - máme selectedItems ve struktuře {preparationItems, mainItems, finishItems}
    if (lessonData.selectedItems && typeof lessonData.selectedItems === 'object') {
      console.log('📋 Používám selectedItems z historie:', lessonData.selectedItems);
      
      // Pro každé ID najdeme odpovídající aktivitu
      for (const constructItemId of itemIds) {
        try {
          // Načteme podrobnosti o aktivitě z databáze
          const { data: itemData, error } = await supabase
            .from('construct_items')
            .select('name, description, duration, phase')
            .eq('id', constructItemId)
            .single();
            
          if (error) {
            console.error(`Chyba při načítání construct_item ${constructItemId}:`, error);
            continue;
          }
          
          if (itemData) {
            selectedActivities.push({
              id: constructItemId,
              name: itemData.name,
              description: itemData.description,
              duration: itemData.duration,
              phase: itemData.phase
            });
            console.log(`✅ Načtena aktivita: ${itemData.name} (fáze: ${itemData.phase})`);
          }
        } catch (error) {
          console.error(`Chyba při načítání aktivity ${constructItemId}:`, error);
        }
      }
    }
    // Pro nové hodiny - máme constructItems jako pole ID
    else if (lessonData.constructItems && lessonData.constructItems.length > 0) {
      console.log('📋 Používám constructItems pro mapování aktivit:', lessonData.constructItems);
      
      for (const constructItemId of lessonData.constructItems) {
        try {
          const { data: itemData, error } = await supabase
            .from('construct_items')
            .select('name, description, duration, phase')
            .eq('id', constructItemId)
            .single();
            
          if (error) {
            console.error(`Chyba při načítání construct_item ${constructItemId}:`, error);
            continue;
          }
          
          if (itemData) {
            selectedActivities.push({
              id: constructItemId,
              name: itemData.name,
              description: itemData.description,
              duration: itemData.duration,
              phase: itemData.phase
            });
            console.log(`✅ Načtena aktivita: ${itemData.name} (fáze: ${itemData.phase})`);
          }
        } catch (error) {
          console.error(`Chyba při načítání aktivity ${constructItemId}:`, error);
        }
      }
    }
    
    console.log('🎯 Finální seznam aktivit pro prompt:', selectedActivities);
    return selectedActivities;
  };

  const handleGenerateFromActivities = async () => {
    if (!lessonData || selectedPhases.length === 0) return;
    
    setIsGenerating(true);
    setIsDialogOpen(false);
    
    try {
      console.log('🚀 Začínám parciální generování pro fáze:', selectedPhases);
      console.log('📊 Dostupná lessonData:', lessonData);
      
      // Připravíme údaje o vybraných aktivitách podle fází
      const selectedActivitiesInfo: Record<string, any[]> = {};
      
      // Pro hodiny z historie používáme selectedItems
      if (lessonData.selectedItems && typeof lessonData.selectedItems === 'object') {
        console.log('🏛️ Načítám aktivity z historie hodiny');
        
        if (selectedPhases.includes('preparation') && lessonData.selectedItems.preparationItems) {
          const prepActivities = await getSelectedItemDetails(lessonData.selectedItems.preparationItems, lessonData);
          selectedActivitiesInfo['preparation'] = prepActivities.filter(act => act.phase === 'preparation');
          console.log('📋 Preparation aktivity z historie:', selectedActivitiesInfo['preparation']);
        }
        
        if (selectedPhases.includes('main') && lessonData.selectedItems.mainItems) {
          const mainActivities = await getSelectedItemDetails(lessonData.selectedItems.mainItems, lessonData);
          selectedActivitiesInfo['main'] = mainActivities.filter(act => act.phase === 'main');
          console.log('📋 Main aktivity z historie:', selectedActivitiesInfo['main']);
        }
        
        if (selectedPhases.includes('finish') && lessonData.selectedItems.finishItems) {
          const finishActivities = await getSelectedItemDetails(lessonData.selectedItems.finishItems, lessonData);
          selectedActivitiesInfo['finish'] = finishActivities.filter(act => act.phase === 'finish');
          console.log('📋 Finish aktivity z historie:', selectedActivitiesInfo['finish']);
        }
      }
      // Pro nové hodiny používáme původní logiku
      else {
        console.log('🆕 Načítám aktivity z nové hodiny');
        
        if (selectedPhases.includes('preparation') && lessonData.selectedItems?.preparationItems) {
          const prepActivities = await getSelectedItemDetails(lessonData.selectedItems.preparationItems, lessonData);
          selectedActivitiesInfo['preparation'] = prepActivities.filter(act => act.phase === 'preparation');
          console.log('📋 Preparation aktivity:', selectedActivitiesInfo['preparation']);
        }
        
        if (selectedPhases.includes('main') && lessonData.selectedItems?.mainItems) {
          const mainActivities = await getSelectedItemDetails(lessonData.selectedItems.mainItems, lessonData);
          selectedActivitiesInfo['main'] = mainActivities.filter(act => act.phase === 'main');
          console.log('📋 Main aktivity:', selectedActivitiesInfo['main']);
        }
        
        if (selectedPhases.includes('finish') && lessonData.selectedItems?.finishItems) {
          const finishActivities = await getSelectedItemDetails(lessonData.selectedItems.finishItems, lessonData);
          selectedActivitiesInfo['finish'] = finishActivities.filter(act => act.phase === 'finish');
          console.log('📋 Finish aktivity:', selectedActivitiesInfo['finish']);
        }
      }
      
      console.log('🎯 Celkové aktivity pro prompt:', selectedActivitiesInfo);
      
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
        equipment: equipmentNames,
        preparationTime: lessonData.preparationTime || 10,
        mainTime: lessonData.mainTime || 25,
        finishTime: lessonData.finishTime || 10,
        preparationRole: lessonData.preparationRole || '',
        mainRole: lessonData.mainRole || '',
        finishRole: lessonData.finishRole || '',
        grade: lessonData.grade || 1,
        // Důležité: přidáme info o vybraných aktivitách pro parciální generování
        selectedActivitiesPhases: selectedPhases,
        selectedActivitiesInfo: selectedActivitiesInfo
      };
      
      console.log('🤖 Finální AI request:', request);
      
      // Volání AI služby s označením o vybraných fázích a aktivitách
      const result = await generateAILessonPlan(request);
      
      if (result && result.exercises) {
        // Úspěšné generování - připravíme nová data s ohledem na vybrané fáze
        const currentExercises = lessonData.exerciseData || lessonData.lesson_data?.exercises || {
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
