
import { AiSettings, LessonGenerationRequest, LessonGenerationResult } from './types';
import { createPromptText, processApiResponse, showErrorToast } from './utils';

/**
 * Generování plánu pomocí OpenAI API
 */
export async function generateWithOpenAI(settings: AiSettings, request: LessonGenerationRequest): Promise<LessonGenerationResult | null> {
  try {
    // Await the Promise returned by createPromptText
    const promptResult = await createPromptText(request);
    const finalSystemPrompt = promptResult.systemPrompt;
    const userPrompt = promptResult.userPrompt;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: settings.temperature,
        max_tokens: settings.max_tokens,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Chyba při komunikaci s OpenAI API');
    }

    const content = data.choices[0].message.content;
    const exercises = processApiResponse(content);
    
    return {
      exercises,
      promptData: {
        systemPrompt: finalSystemPrompt,
        userPrompt
      }
    };
  } catch (error: any) {
    console.error('Chyba při generování s OpenAI:', error);
    showErrorToast(error.message);
    return null;
  }
}
