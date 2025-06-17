
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createLesson } from '@/services/supabaseService';
import { generateAndDownloadLessonPlan } from '@/utils/documentUtils';
import { LessonExerciseData, PromptData } from '@/services/aiService';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';

export function usePreviewActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Helper function to convert AI ExerciseItem to Component ExerciseItem
  const convertExerciseData = (data: LessonExerciseData): { preparation: ExerciseItem[]; main: ExerciseItem[]; finish: ExerciseItem[] } => {
    const convertItems = (items: any[], phase: 'preparation' | 'main' | 'finish'): ExerciseItem[] => {
      return items.map(item => ({
        name: item.name,
        description: item.description,
        time: item.time,
        phase: item.phase || phase
      }));
    };

    return {
      preparation: convertItems(data.preparation, 'preparation'),
      main: convertItems(data.main, 'main'),
      finish: convertItems(data.finish, 'finish')
    };
  };

  const handleSaveToHistory = async (lessonData: any, exerciseData: LessonExerciseData, promptData?: PromptData) => {
    try {
      console.log("🚀 SAVE TO HISTORY - Starting save with data:", { lessonData, exerciseData, promptData });
      console.log("🚀 SAVE TO HISTORY - Equipment data being saved:", lessonData.equipment);
      
      // Určujeme, zda je to vygenerovaná hodina na základě přítomnosti promptData
      const isGeneratedLesson = promptData !== undefined && promptData !== null;
      
      // Vytvoříme správný název - pokud je vygenerováno AI, přidáme suffix
      let title = lessonData.title;
      if (isGeneratedLesson && !title.includes('(Vygenerováno)')) {
        title = `${title} (Vygenerováno)`;
      }
      
      console.log("🚀 SAVE TO HISTORY - Is generated lesson:", isGeneratedLesson, "Title:", title);
      
      // Prepare comprehensive lesson data - DŮLEŽITÉ: zajistit, že equipment je array
      const equipmentArray = Array.isArray(lessonData.equipment) ? lessonData.equipment : [];
      console.log("🚀 SAVE TO HISTORY - Final equipment array:", equipmentArray);
      
      const lessonToSave = {
        title,
        schoolId: lessonData.schoolId,
        environmentId: lessonData.environmentId,
        constructId: lessonData.constructId,
        equipment: equipmentArray, // Zajistit že je to array
        grade: lessonData.grade || 1,
        preparationTime: lessonData.preparationTime || 10,
        mainTime: lessonData.mainTime || 25,
        finishTime: lessonData.finishTime || 10,
        preparationRoleId: lessonData.preparationRoleId,
        mainRoleId: lessonData.mainRoleId,
        finishRoleId: lessonData.finishRoleId,
        selectedItems: lessonData.selectedItems,
        exerciseData,
        promptData: isGeneratedLesson ? promptData : null // Uložíme promptData pouze u AI vygenerovaných hodin
      };

      console.log("🚀 SAVE TO HISTORY - Final lesson data to save:", lessonToSave);

      const success = await createLesson(lessonToSave);
      
      if (success) {
        toast({
          title: "Hodina uložena",
          description: `Hodina "${title}" byla úspěšně uložena do historie.`,
        });
        navigate('/history');
      } else {
        throw new Error("Failed to save lesson");
      }
    } catch (error) {
      console.error("🚀 SAVE TO HISTORY - Error saving lesson:", error);
      toast({
        title: "Chyba při ukládání",
        description: "Při ukládání hodiny došlo k chybě.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (lessonData: any, equipmentNames: string[], exerciseData: LessonExerciseData) => {
    try {
      toast({
        title: "Stahování zahájeno",
        description: "Dokument se připravuje ke stažení.",
      });

      // Convert exercise data to the format expected by generateAndDownloadLessonPlan
      const convertedExerciseData = convertExerciseData(exerciseData);
      const success = await generateAndDownloadLessonPlan(lessonData, equipmentNames, convertedExerciseData);
      
      if (success) {
        toast({
          title: "Stažení dokončeno",
          description: "Hodina byla úspěšně stažena jako Word dokument.",
        });
      } else {
        throw new Error("Chyba při generování dokumentu");
      }
    } catch (error) {
      console.error("Error downloading lesson:", error);
      toast({
        title: "Chyba při stahování",
        description: "Nepodařilo se stáhnout hodinu.",
        variant: "destructive"
      });
    }
  };

  return {
    handleSaveToHistory,
    handleDownload
  };
}
