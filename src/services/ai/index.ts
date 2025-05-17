
import { toast } from '@/hooks/use-toast';
import { getAiSettings } from './settings-service';
import { generateWithOpenAI } from './openai-provider';
import { generateWithGroq } from './groq-provider';
import { createFallbackPlan } from './utils';
import type { 
  AiSettings, 
  ExerciseItem, 
  LessonExerciseData, 
  PromptData,
  LessonGenerationRequest, 
  LessonGenerationResult,
  ActivityItem
} from './types';

// Re-export types
export type { 
  AiSettings, 
  ExerciseItem, 
  LessonExerciseData, 
  PromptData,
  LessonGenerationRequest, 
  LessonGenerationResult,
  ActivityItem
};

/**
 * Hlavní funkce pro generování alternativního plánu podle nastavení
 */
export async function generateAILessonPlan(request: LessonGenerationRequest): Promise<LessonGenerationResult | null> {
  try {
    // Získání nastavení AI
    const settings = await getAiSettings();
    
    if (!settings) {
      toast({
        title: "Chyba nastavení AI",
        description: "Nebyla nalezena žádná nastavení AI. Přejděte do administrátorského rozhraní a nastavte API klíče.",
        variant: "destructive",
      });
      return null;
    }
    
    if (!settings.ai_enabled) {
      toast({
        title: "AI je deaktivována",
        description: "Asistent AI je deaktivován v nastavení. Aktivujte jej v administrátorském rozhraní.",
        variant: "destructive",
      });
      return null;
    }
    
    // Podle poskytovatele vybíráme správnou metodu generování
    if (settings.provider === 'openai') {
      return await generateWithOpenAI(settings, request);
    } else if (settings.provider === 'groq') {
      return await generateWithGroq(settings, request);
    } else {
      toast({
        title: "Nepodporovaný poskytovatel AI",
        description: `Poskytovatel '${settings.provider}' není podporován.`,
        variant: "destructive",
      });
      return null;
    }
  } catch (error: any) {
    console.error('Chyba při generování plánu hodiny:', error);
    toast({
      title: "Chyba při generování plánu",
      description: error.message,
      variant: "destructive",
    });
    
    // V případě chyby vracíme záložní plán
    return {
      exercises: createFallbackPlan(request)
    };
  }
}
