
import { AiSettings, LessonGenerationResult } from './types';
import { processApiResponse, showErrorToast, createFallbackPlan, createPromptText } from './utils';
import { getAiGenerationSettings } from './generation-settings-service';

export async function generateWithOpenAIProvider(
  settings: AiSettings,
  request: any,
  planId?: string
): Promise<LessonGenerationResult | null> {
  console.log('🤖 Začínám generování plánu hodiny pomocí OpenAI API pro:', request);
  
  try {
    // Načteme nastavení generování
    const generationSettings = await getAiGenerationSettings();
    
    const { systemPrompt, userPrompt } = await createPromptText(request, planId, generationSettings);
    
    console.log('📝 Vytvořené prompty pro OpenAI:', {
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      hasGenerationSettings: !!generationSettings,
      hasPlanId: !!planId,
      hasProgressionContext: !!request.progressionContext,
      previousLessonsCount: request.previousLessonsContext?.length || 0
    });

    console.log('🚀 Volám OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.max_tokens || 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Chyba OpenAI API:', errorData);
      throw new Error(`OpenAI API chyba: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ Přijata odpověď z OpenAI API');
    console.log('📄 Raw response:', data.choices[0].message.content);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Neplatná struktura odpovědi z OpenAI API');
    }

    const apiResponse = data.choices[0].message.content;

    // Zpracujeme odpověď
    const exercisesData = processApiResponse(apiResponse);
    
    if (!exercisesData) {
      throw new Error('Neplatná struktura dat v odpovědi AI');
    }

    return {
      exercises: exercisesData,
      promptData: {
        systemPrompt,
        userPrompt
      }
    };

  } catch (error: any) {
    console.error('❌ Chyba při generování plánu pomocí OpenAI:', error);
    throw error;
  }
}

export async function generateWithOpenAI(
  settings: AiSettings,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    console.log('🤖 Volám OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.max_tokens || 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Chyba OpenAI API:', errorData);
      showErrorToast(`OpenAI API chyba: ${response.status} - ${errorData}`);
      return null;
    }

    const data = await response.json();
    console.log('✅ Přijata odpověď z OpenAI API');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      showErrorToast('Neplatná struktura odpovědi z OpenAI API');
      return null;
    }

    return data.choices[0].message.content;

  } catch (error: any) {
    console.error('❌ Chyba při volání OpenAI API:', error);
    showErrorToast(error.message || 'Nastala chyba při komunikaci s OpenAI API');
    return null;
  }
}
