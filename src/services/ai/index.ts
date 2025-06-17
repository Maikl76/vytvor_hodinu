
import { toast } from '@/hooks/use-toast';
import { getAiSettings } from './settings-service';
import { getAiGenerationSettings } from './generation-settings-service';
import { generateWithOpenAIProvider } from './openai-provider';
import { generateWithGroqProvider } from './groq-provider';
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

// Re-export types and services
export type { 
  AiSettings, 
  ExerciseItem, 
  LessonExerciseData, 
  PromptData,
  LessonGenerationRequest, 
  LessonGenerationResult,
  ActivityItem
};

export { getAiGenerationSettings } from './generation-settings-service';
export type { AiGenerationSettings } from './generation-settings-service';

/**
 * Hlavní funkce pro generování alternativního plánu podle nastavení
 */
export async function generateAILessonPlan(request: LessonGenerationRequest & { planId?: string }): Promise<LessonGenerationResult | null> {
  try {
    console.log('🤖 Začínám generování AI plánu s requestem:', request);
    
    // Získání nastavení AI
    const settings = await getAiSettings();
    
    console.log('⚙️ Získaná AI nastavení:', settings);
    
    if (!settings) {
      console.error('❌ Žádná AI nastavení nenalezena');
      toast({
        title: "Chyba nastavení AI",
        description: "Nebyla nalezena žádná nastavení AI. Přejděte do administrátorského rozhraní a nastavte API klíče.",
        variant: "destructive",
      });
      return null;
    }
    
    if (!settings.ai_enabled) {
      console.error('❌ AI je deaktivováno');
      toast({
        title: "AI je deaktivována",
        description: "Asistent AI je deaktivován v nastavení. Aktivujte jej v administrátorském rozhraní.",
        variant: "destructive",
      });
      return null;
    }
    
    if (!settings.api_key || settings.api_key.trim() === '') {
      console.error('❌ Chybí API klíč');
      toast({
        title: "Chybí API klíč",
        description: "API klíč pro AI službu není nastaven. Přejděte do administrátorského rozhraní a nastavte API klíč.",
        variant: "destructive",
      });
      return null;
    }
    
    console.log(`🚀 Používám ${settings.provider} provider s modelem ${settings.model}`);
    
    // Podle poskytovatele vybíráme správnou metodu generování
    const planId = request.planId;
    
    let result: LessonGenerationResult | null = null;
    
    if (settings.provider === 'openai') {
      console.log('📡 Volám OpenAI provider...');
      result = await generateWithOpenAIProvider(settings, request, planId);
    } else if (settings.provider === 'groq') {
      console.log('📡 Volám Groq provider...');
      result = await generateWithGroqProvider(settings, request, planId);
    } else {
      console.error(`❌ Nepodporovaný provider: ${settings.provider}`);
      toast({
        title: "Nepodporovaný poskytovatel AI",
        description: `Poskytovatel '${settings.provider}' není podporován.`,
        variant: "destructive",
      });
      return null;
    }
    
    if (!result) {
      console.error('❌ Provider vrátil null výsledek');
      throw new Error('AI služba nevrátila žádný výsledek');
    }
    
    console.log('✅ AI úspěšně vygenerovalo plán');
    return result;
    
  } catch (error: any) {
    console.error('❌ Chyba při generování plánu hodiny:', error);
    toast({
      title: "Chyba při generování plánu",
      description: error.message || "Nastala neočekávaná chyba při komunikaci s AI službou.",
      variant: "destructive",
    });
    
    // V případě chyby vracíme záložní plán
    console.log('🔄 Používám fallback plán...');
    return {
      exercises: createFallbackPlan(request),
      promptData: {
        systemPrompt: "Fallback systémový prompt",
        userPrompt: "Fallback uživatelský prompt - AI nebylo k dispozici"
      }
    };
  }
}
