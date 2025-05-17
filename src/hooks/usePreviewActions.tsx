
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createLesson } from '@/services/supabaseService';
import { generateAndDownloadLessonPlan } from '@/utils/documentUtils';
import { LessonExerciseData } from '@/services/aiService';

export function usePreviewActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to generate and download Word document
  const handleDownload = async (lessonData: any, equipmentNames: string[], exerciseData: LessonExerciseData) => {
    toast({
      title: "Download started",
      description: "Your document is being prepared for download.",
    });
    
    try {
      const success = await generateAndDownloadLessonPlan(lessonData, equipmentNames, exerciseData);
      
      if (success) {
        // Show successful download
        toast({
          title: "Download complete",
          description: "Document was successfully downloaded.",
        });
      } else {
        throw new Error("Error generating document");
      }
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Download error",
        description: "There was an error creating the document. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveToHistory = async (lessonData: any, exerciseData: LessonExerciseData) => {
    try {
      // Ensure the data is in the correct format before saving
      const dataToSave = {
        ...lessonData,
        // Include the current exercise data
        exerciseData: exerciseData,
        // Make sure constructId is null if not provided
        constructId: lessonData.constructId || null,
        // Ensure selectedItems is properly structured
        selectedItems: lessonData.selectedItems || {
          preparationItems: [],
          mainItems: [],
          finishItems: []
        }
      };
      
      console.log("Saving lesson with data:", dataToSave);
      
      // Save the lesson to the database
      const saved = await createLesson(dataToSave);
      
      if (saved) {
        toast({
          title: "Hodina uložena",
          description: "Vaše hodina byla úspěšně uložena do historie.",
        });
        navigate('/history');
      } else {
        throw new Error("Failed to save lesson");
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast({
        title: "Chyba při ukládání",
        description: "Nastala chyba při ukládání hodiny. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  return {
    handleDownload,
    handleSaveToHistory
  };
}
