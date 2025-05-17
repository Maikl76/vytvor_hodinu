
import { supabase } from '@/integrations/supabase/client';
import { AiSettings } from './types';
import { toast } from '@/hooks/use-toast';

/**
 * Načtení nastavení AI z databáze
 */
export async function getAiSettings(): Promise<AiSettings | null> {
  try {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching AI settings:', error);
      return null;
    }
    
    if (!data) {
      console.log('No AI settings found, using defaults');
      // Výchozí nastavení
      return {
        id: 0,
        provider: 'openai',
        api_key: '',
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 1000,
        systemPrompt: 'Jsi asistent, který pomáhá vytvářet plány hodin tělesné výchovy.',
        ai_enabled: false
      };
    }
    
    return {
      id: data.id,
      provider: data.provider,
      api_key: data.api_key,
      model: data.model,
      temperature: data.temperature,
      max_tokens: data.max_tokens,
      systemPrompt: data.system_prompt,
      ai_enabled: data.ai_enabled
    };
  } catch (error: any) {
    console.error('Error in getAiSettings:', error);
    return null;
  }
}
