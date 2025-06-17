
import { LessonGenerationRequest, LessonGenerationResult } from './types';
import { createPromptText, processApiResponse, createFallbackPlan, showErrorToast } from './utils';
import { getAiSettings } from './settings-service';
import { getAiGenerationSettings } from './generation-settings-service';
import { generateWithGroqProvider } from './groq-provider';
import { generateWithOpenAIProvider } from './openai-provider';
import { LessonExerciseData } from './types';

/**
 * Hlavní funkce pro generování plánu hodiny pomocí AI
 * VYLEPŠENÁ VERZE - podporuje progresivní plánování s kontextem pozice hodiny a předchozích hodin
 * + nastavení generování z admin sekce + znalostní databázi
 */
export async function generateAILessonPlan(
  request: LessonGenerationRequest & { 
    planId?: string; 
    weekNumber?: number; 
    lessonNumber?: number;
    previousLessonsContext?: Array<{
      week: number;
      lesson: number;
      exercises: LessonExerciseData;
    }>;
  }
): Promise<LessonGenerationResult | null> {
  try {
    console.log('🤖 Začínám generování plánu hodiny pomocí AI s progresivním kontextem, nastavením generování a znalostní databází');
    console.log('📊 Request data:', {
      school: request.school,
      construct: request.construct,
      environment: request.environment,
      equipment: request.equipment,
      grade: request.grade,
      planId: request.planId,
      weekNumber: request.weekNumber,
      lessonNumber: request.lessonNumber,
      previousLessonsCount: request.previousLessonsContext?.length || 0
    });

    // Získáme nastavení AI
    const settings = await getAiSettings();
    if (!settings) {
      console.error('❌ Chyba: Nenalezena nastavení AI');
      showErrorToast('Nastavení AI nejsou k dispozici');
      return null;
    }

    console.log('⚙️ Použito AI nastavení:', { 
      provider: settings.provider, 
      model: settings.model,
      ai_enabled: settings.ai_enabled 
    });

    if (!settings.ai_enabled) {
      console.error('❌ AI je deaktivováno v nastavení');
      showErrorToast('AI generování je deaktivováno v nastavení');
      return null;
    }

    // Vytvoříme rozšířený request s progresivním kontextem
    const enhancedRequest = {
      ...request,
      // Přidáme kontext pro progresivní plánování
      progressionContext: request.weekNumber && request.lessonNumber ? {
        weekNumber: request.weekNumber,
        lessonNumber: request.lessonNumber,
        totalLessonInPlan: ((request.weekNumber - 1) * 2) + request.lessonNumber, // Předpokládáme 2 hodiny týdně
        isFirstLesson: request.weekNumber === 1 && request.lessonNumber === 1,
        previousLessons: request.previousLessonsContext || []
      } : undefined
    };

    // Použijeme příslušný provider s kompletní logikou
    console.log('🚀 Používám příslušný AI provider s kompletní logikou...');
    let result: LessonGenerationResult | null = null;
    
    if (settings.provider === 'groq') {
      result = await generateWithGroqProvider(settings, enhancedRequest, request.planId);
    } else if (settings.provider === 'openai') {
      result = await generateWithOpenAIProvider(settings, enhancedRequest, request.planId);
    } else {
      throw new Error(`Nepodporovaný AI provider: ${settings.provider}`);
    }

    if (!result) {
      throw new Error('Prázdná odpověď z AI API');
    }

    console.log('✅ AI úspěšně vygenerovalo progresivní plán hodiny s kompletní logikou:', {
      preparation: result.exercises.preparation.length + ' cviků',
      main: result.exercises.main.length + ' cviků', 
      finish: result.exercises.finish.length + ' cviků',
      weekNumber: request.weekNumber,
      lessonNumber: request.lessonNumber,
      usedPreviousContext: (request.previousLessonsContext?.length || 0) > 0,
      usedKnowledgeBase: !!request.planId
    });

    return result;

  } catch (error: any) {
    console.error('❌ Chyba při generování progresivního plánu pomocí AI s kompletní logikou:', error);
    
    // Zobrazíme chybu uživateli
    showErrorToast(error.message || 'Nastala neočekávaná chyba při generování progresivního plánu');
    
    // Vrátíme fallback plán
    console.log('🔄 Používám fallback plán...');
    return {
      exercises: createFallbackPlan(request),
      promptData: {
        systemPrompt: 'Fallback systémový prompt',
        userPrompt: 'Fallback uživatelský prompt - AI nebylo k dispozici'
      }
    };
  }
}
