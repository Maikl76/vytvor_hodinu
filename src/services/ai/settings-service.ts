
import { supabase } from '@/integrations/supabase/client';
import { AiSettings } from './types';
import { toast } from '@/hooks/use-toast';

/**
 * Načtení nastavení AI z databáze
 */
export async function getAiSettings(): Promise<AiSettings | null> {
  try {
    console.log('🔍 Načítám AI nastavení...');
    
    // Najdeme nejnovější nastavení pro každého providera
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10); // Načteme více záznamů, abychom mohli najít nejnovější pro každého providera
      
    if (error) {
      console.error('❌ Chyba při načítání AI nastavení:', error);
      return null;
    }
    
    console.log('📄 Všechna AI nastavení z DB:', data);
    
    if (!data || data.length === 0) {
      console.log('📝 Žádná AI nastavení nenalezena, používám výchozí');
      // Výchozí nastavení
      return {
        provider: 'openai' as 'openai' | 'groq',
        api_key: '',
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 1000,
        system_prompt: 'Jsi asistent, který pomáhá vytvářet plány hodin tělesné výchovy.',
        ai_enabled: false
      };
    }
    
    // Najdeme nejnovější aktivní nastavení
    const activeSettings = data.find(setting => setting.ai_enabled === true);
    
    if (!activeSettings) {
      console.log('⚠️ Žádná aktivní AI nastavení nenalezena');
      // Vrátíme nejnovější nastavení, i když není aktivní
      const latestSettings = data[0];
      return {
        id: latestSettings.id,
        provider: latestSettings.provider as 'openai' | 'groq',
        api_key: latestSettings.api_key || '',
        model: latestSettings.model || 'gpt-4o',
        temperature: latestSettings.temperature || 0.7,
        max_tokens: latestSettings.max_tokens || 1000,
        system_prompt: latestSettings.system_prompt || 'Jsi asistent, který pomáhá vytvářet plány hodin tělesné výchovy.',
        ai_enabled: latestSettings.ai_enabled || false
      };
    }
    
    console.log('✅ Načtena aktivní AI nastavení:', activeSettings);
    
    return {
      id: activeSettings.id,
      provider: activeSettings.provider as 'openai' | 'groq',
      api_key: activeSettings.api_key,
      model: activeSettings.model,
      temperature: activeSettings.temperature,
      max_tokens: activeSettings.max_tokens,
      system_prompt: activeSettings.system_prompt,
      ai_enabled: activeSettings.ai_enabled
    };
  } catch (error: any) {
    console.error('❌ Chyba v getAiSettings:', error);
    return null;
  }
}
