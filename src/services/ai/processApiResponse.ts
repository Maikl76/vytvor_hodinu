import { LessonExerciseData, LessonGenerationRequest } from './types';
import { toast } from '@/hooks/use-toast';

/**
 * Zpracuje odpověď z AI a převede ji na LessonExerciseData
 */
export function processApiResponse(apiResponse: string): LessonExerciseData | null {
  try {
    console.log('🔄 Zpracovávám AI odpověď, délka:', apiResponse.length);
    console.log('📝 Raw AI response:', apiResponse.substring(0, 500) + '...');
    
    // Agresivnější čištění markdown bloků
    let cleanedResponse = apiResponse.trim();
    
    // Odstraň všechny možné varianty markdown bloků
    cleanedResponse = cleanedResponse.replace(/^```(?:json|javascript|js)?\s*/gm, '');
    cleanedResponse = cleanedResponse.replace(/\s*```\s*$/gm, '');
    cleanedResponse = cleanedResponse.replace(/```/g, '');
    
    // Odstraň případné další texty před/po JSON
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    }
    
    console.log('🧹 Cleaned response:', cleanedResponse.substring(0, 300) + '...');
    
    const data = JSON.parse(cleanedResponse) as LessonExerciseData;
    
    // Validace struktury
    if (!data.preparation || !data.main || !data.finish) {
      throw new Error('Odpověď AI neobsahuje všechny požadované části (preparation, main, finish)');
    }
    
    console.log('✅ Successfully parsed AI response:', {
      preparationCount: data.preparation?.length || 0,
      mainCount: data.main?.length || 0,
      finishCount: data.finish?.length || 0
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    console.error('📄 Raw response was:', apiResponse);
    toast({
      title: "Chyba při zpracování odpovědi AI",
      description: "Nepodařilo se zpracovat odpověď z AI. Zkontrolujte formát odpovědi.",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Vytvoří fallback plán hodiny v případě chyby AI
 */
export function createFallbackPlan(request: LessonGenerationRequest): LessonExerciseData {
  return {
    preparation: [
      {
        name: "Zahřátí",
        description: "Lehké kardio a dynamický strečink",
        time: request.preparationTime / 2,
        phase: 'preparation'
      },
      {
        name: "Průprava",
        description: "Základní cviky na mobilitu a stabilitu",
        time: request.preparationTime / 2,
        phase: 'preparation'
      }
    ],
    main: [
      {
        name: "Hlavní aktivita 1",
        description: "Cvik zaměřený na rozvoj síly",
        time: request.mainTime / 3,
        phase: 'main'
      },
      {
        name: "Hlavní aktivita 2",
        description: "Cvik zaměřený na rozvoj vytrvalosti",
        time: request.mainTime / 3,
        phase: 'main'
      },
      {
        name: "Hra",
        description: "Zábavná hra s pohybem",
        time: request.mainTime / 3,
        phase: 'main'
      }
    ],
    finish: [
      {
        name: "Zklidnění",
        description: "Statický strečink a relaxace",
        time: request.finishTime / 2,
        phase: 'finish'
      },
      {
        name: "Reflexe",
        description: "Zhodnocení hodiny a diskuze",
        time: request.finishTime / 2,
        phase: 'finish'
      }
    ]
  };
}
