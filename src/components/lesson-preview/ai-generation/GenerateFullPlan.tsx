
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateAILessonPlan, LessonGenerationRequest, LessonExerciseData, PromptData } from '@/services/aiService';

interface GenerateFullPlanProps {
  lessonData: any;
  equipmentNames: string[];
  onSuccess: (exerciseData: LessonExerciseData, promptData?: PromptData) => void;
}

export const GenerateFullPlan: React.FC<GenerateFullPlanProps> = ({
  lessonData,
  equipmentNames,
  onSuccess
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!lessonData) {
      console.error('❌ Chybí lesson data');
      return;
    }
    
    setIsGenerating(true);
    console.log('🚀 Začínám generování AI plánu...');
    
    try {
      // Příprava dat pro generování
      const request: LessonGenerationRequest = {
        school: lessonData.school || '',
        construct: lessonData.construct || '',
        environment: lessonData.environment || '',
        equipment: equipmentNames || [],
        preparationTime: lessonData.preparationTime || 10,
        mainTime: lessonData.mainTime || 25,
        finishTime: lessonData.finishTime || 10,
        preparationRole: lessonData.preparationRole || '',
        mainRole: lessonData.mainRole || '',
        finishRole: lessonData.finishRole || '',
        grade: lessonData.grade || 1
      };
      
      console.log('📋 Request pro AI:', request);
      console.log('🎒 Vybavení:', equipmentNames);
      
      // Volání AI služby
      const result = await generateAILessonPlan(request);
      
      console.log('📥 Výsledek z AI:', result);
      
      if (result && result.exercises) {
        console.log('✅ AI úspěšně vygenerovalo plán');
        // Úspěšné generování
        onSuccess(result.exercises, result.promptData);
        
        toast({
          title: "Alternativní plán vygenerován",
          description: "Byl vytvořen nový plán hodiny s alternativními cvičeními.",
        });
      } else {
        console.warn('⚠️ AI nevrátilo validní výsledek, používám záložní plán');
        // Použít záložní plán při chybě
        const backupExercises: LessonExerciseData = {
          preparation: [
            { name: 'Dynamické protažení', description: 'Série dynamických protahovacích cviků', time: Math.floor(lessonData.preparationTime / 2), phase: 'preparation' },
            { name: 'Pohybové hry', description: 'Krátké hry pro zvýšení tepové frekvence', time: Math.ceil(lessonData.preparationTime / 2), phase: 'preparation' }
          ],
          main: [
            { name: 'Cvičení ve dvojicích', description: 'Koordinační cvičení s vybraným vybavením', time: Math.floor(lessonData.mainTime / 3), phase: 'main' },
            { name: 'Štafety', description: 'Štafetové soutěže s využitím konstruktu', time: Math.floor(lessonData.mainTime / 3), phase: 'main' },
            { name: 'Herní prvky', description: 'Aplikace naučených dovedností v herních situacích', time: Math.ceil(lessonData.mainTime / 3), phase: 'main' }
          ],
          finish: [
            { name: 'Strečink', description: 'Důkladné statické protažení', time: Math.floor(lessonData.finishTime / 2), phase: 'finish' },
            { name: 'Zpětná vazba', description: 'Zhodnocení hodiny a diskuse', time: Math.ceil(lessonData.finishTime / 2), phase: 'finish' }
          ]
        };
        
        onSuccess(backupExercises);
        
        toast({
          title: "Použit záložní plán",
          description: "Nepodařilo se spojit s AI, byl použit záložní plán cvičení.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('❌ Chyba při generování alternativního plánu:', error);
      
      // Vytvoříme záložní plán i při chybě
      const backupExercises: LessonExerciseData = {
        preparation: [
          { name: 'Rozcvička', description: 'Základní rozcvičení celého těla', time: lessonData.preparationTime, phase: 'preparation' }
        ],
        main: [
          { name: 'Hlavní aktivita', description: 'Cvičení zaměřené na vybranou dovednost', time: lessonData.mainTime, phase: 'main' }
        ],
        finish: [
          { name: 'Zklidňující cvičení', description: 'Protažení a reflexe hodiny', time: lessonData.finishTime, phase: 'finish' }
        ]
      };
      
      onSuccess(backupExercises);
      
      toast({
        title: "Použit záložní plán",
        description: `AI generování selhalo: ${error.message || 'Neočekávaná chyba'}. Byl použit záložní plán.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      onClick={handleGenerate} 
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generuji plán...
        </>
      ) : (
        'Vygenerovat alternativní plán na základě vybraného vybavení pomocí AI'
      )}
    </Button>
  );
};
