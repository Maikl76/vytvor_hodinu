
import { AiSettings, LessonGenerationResult } from './types';
import { processApiResponse, showErrorToast, createFallbackPlan, createPromptText } from './utils';
import { getAiGenerationSettings } from './generation-settings-service';

export async function generateWithGroqProvider(
  settings: AiSettings,
  request: any,
  planId?: string
): Promise<LessonGenerationResult | null> {
  console.log('🤖 Začínám generování plánu hodiny pomocí Groq API pro:', request);
  
  try {
    // Načteme nastavení generování
    const generationSettings = await getAiGenerationSettings();
    
    const { systemPrompt, userPrompt } = await createPromptText(request, planId, generationSettings);
    
    console.log('📝 Vytvořené prompty pro Groq:', {
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      hasGenerationSettings: !!generationSettings,
      hasPlanId: !!planId,
      hasProgressionContext: !!request.progressionContext,
      previousLessonsCount: request.previousLessonsContext?.length || 0
    });

    console.log('🚀 Volám Groq API...');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model || 'llama3-8b-8192',
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
      console.error('❌ Chyba Groq API:', errorData);
      throw new Error(`Groq API chyba: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('✅ Přijata odpověď z Groq API');
    console.log('📄 Raw response:', data.choices[0].message.content);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Neplatná struktura odpovědi z Groq API');
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
    console.error('❌ Chyba při generování plánu pomocí Groq:', error);
    throw error;
  }
}

export async function generateWithGroq(
  settings: AiSettings,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model || 'llama3-8b-8192',
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
      console.error('Groq API Error:', errorData);
      showErrorToast(`Groq API error: ${response.status} - ${errorData}`);
      return null;
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      showErrorToast('Invalid response structure from Groq API');
      return null;
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error generating with Groq:', error);
    showErrorToast(error.message || 'An unexpected error occurred while generating with Groq.');
    return null;
  }
}
