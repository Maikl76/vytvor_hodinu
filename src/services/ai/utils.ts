
import { toast } from '@/hooks/use-toast';
import { LessonExerciseData, LessonGenerationRequest } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Přeloží název fáze z angličtiny do češtiny
 */
export function translatePhase(phase: string): string {
  switch (phase) {
    case 'preparation': return 'přípravná část';
    case 'main': return 'hlavní část';
    case 'finish': return 'závěrečná část';
    default: return phase;
  }
}

/**
 * Vytvoří výchozí plán hodiny v případě selhání AI služby
 */
export function createFallbackPlan(request: LessonGenerationRequest): LessonExerciseData {
  return {
    preparation: [
      { name: 'Dynamické protažení', description: 'Série dynamických protahovacích cviků', time: Math.floor(request.preparationTime / 2) },
      { name: 'Pohybové hry', description: 'Krátké hry pro zvýšení tepové frekvence', time: Math.ceil(request.preparationTime / 2) }
    ],
    main: [
      { name: 'Cvičení ve dvojicích', description: 'Koordinační cvičení s vybraným vybavením', time: Math.floor(request.mainTime / 3) },
      { name: 'Štafety', description: 'Štafetové soutěže s využitím konstruktu', time: Math.floor(request.mainTime / 3) },
      { name: 'Herní prvky', description: 'Aplikace naučených dovedností v herních situacích', time: Math.ceil(request.mainTime / 3) }
    ],
    finish: [
      { name: 'Strečink', description: 'Důkladné statické protažení', time: Math.floor(request.finishTime / 2) },
      { name: 'Zpětná vazba', description: 'Zhodnocení hodiny a diskuse', time: Math.ceil(request.finishTime / 2) }
    ]
  };
}

/**
 * Získá znalostní podklady pro danou žádost o generování plánu
 */
async function getRelevantKnowledge(request: LessonGenerationRequest): Promise<string> {
  try {
    // Jednoduchý fulltext search místo vektorového vyhledávání
    const { data: knowledgeChunks, error } = await supabase
      .from('knowledge_chunks')
      .select('content')
      // Hledáme podle klíčových slov
      .or(`content.ilike.%${request.school}%,content.ilike.%${request.construct}%,content.ilike.%${request.environment}%`)
      .limit(5);
    
    if (error) {
      console.error("Chyba při získávání znalostních podkladů:", error);
      return "";
    }
    
    if (!knowledgeChunks || knowledgeChunks.length === 0) {
      console.log("Nenalezeny žádné relevantní znalostní podklady");
      return "";
    }
    
    console.log(`Nalezeno ${knowledgeChunks.length} relevantních znalostních podkladů`);
    
    // Spojíme všechny nalezené podklady do jednoho textu
    return knowledgeChunks.map(chunk => chunk.content).join('\n\n');
  } catch (error) {
    console.error("Chyba při získávání znalostních podkladů:", error);
    return "";
  }
}

/**
 * Získá systémový prompt z nastavení AI
 */
async function getSystemPromptFromSettings(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('system_prompt')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      
    if (error || !data) {
      console.error("Chyba při získávání systémového promptu z nastavení:", error);
      return "";
    }
    
    return data.system_prompt || "";
  } catch (error) {
    console.error("Chyba při získávání systémového promptu z nastavení:", error);
    return "";
  }
}

/**
 * Vytváří text promptu pro generování AI
 */
export async function createPromptText(request: LessonGenerationRequest): Promise<{ systemPrompt: string; userPrompt: string }> {
  // Zachováváme původní systémový prompt
  let systemPrompt = "Jsi zkušený tělocvikář a trenér, který se specializuje na tvorbu cvičebních plánů pro hodiny tělesné výchovy. Vždy odpovídáš pouze v českém jazyce. Tvým úkolem je připravit konkrétní plán hodiny s detailním popisem jednotlivých cvičení pro každou část hodiny. Vracíš pouze validní JSON podle zadaného formátu.";
  
  // Získáme systémový prompt z nastavení a přidáme ho k původnímu
  const settingsPrompt = await getSystemPromptFromSettings();
  if (settingsPrompt) {
    systemPrompt += "\n\n" + settingsPrompt;
  }
  
  // Základní prompt
  let userPrompt = `
    Vytvoř plán hodiny tělesné výchovy s následujícími parametry:
    - Škola: ${request.school}
    - Ročník: ${request.grade}
    - Cvičební konstrukt: ${request.construct}
    - Prostředí: ${request.environment}
  `;

  // Přidáme informaci o vybraném vybavení, pokud existuje
  if (request.equipment && request.equipment.length > 0) {
    userPrompt += `\n\nVybrané vybavení uživatelem:`;
    request.equipment.forEach((item, index) => {
      userPrompt += `\n- ${item}`;
    });
    
    // Speciální instrukce pro alternativní plán
    userPrompt += `\n\nDŮLEŽITÉ: Vygeneruj cvičení pro hlavní část hodiny na základě vybraného vybavení. Připrav JEDNO specifické cvičení pro KAŽDÝ kus vybraného vybavení. Každé cvičení by mělo využívat daný kus vybavení optimálním způsobem vzhledem k věku žáků a konstruktu hodiny.`;
  }

  // Získáme relevantní znalostní podklady
  const knowledgeContent = await getRelevantKnowledge(request);
  
  // Pokud máme znalostní podklady, připojíme je k promptu
  if (knowledgeContent) {
    userPrompt += `\n\nZDE JSOU RELEVANTNÍ ZNALOSTNÍ PODKLADY, KTERÉ MŮŽEŠ POUŽÍT:\n${knowledgeContent}\n\nVÝŠE UVEDENÉ PODKLADY VYUŽIJ PŘI TVORBĚ PLÁNU HODINY.`;
  }

  // Pokud jsou vybrány konkrétní fáze, přidáme tuto informaci do promptu
  if (request.selectedActivitiesPhases && request.selectedActivitiesPhases.length > 0) {
    userPrompt += `\n\nPŘIPRAV POUZE TYTO ČÁSTI HODINY: ${request.selectedActivitiesPhases.join(', ')}.`;
    userPrompt += `\nOstatní části budou použity z již existujícího plánu.`;
    
    // Přidáme podrobné informace o vybraných aktivitách pro každou vybranou fázi
    if (request.selectedActivitiesInfo) {
      userPrompt += `\n\nVYTVOŘ PLÁN CVIČENÍ VÝHRADNĚ NA ZÁKLADĚ TĚCHTO AKTIVIT, které byly vybrány pro dané části hodiny:`;
      
      for (const phase of request.selectedActivitiesPhases) {
        const activities = request.selectedActivitiesInfo[phase];
        if (activities && activities.length > 0) {
          userPrompt += `\n\n${translatePhase(phase)} (${phase === 'preparation' ? request.preparationTime : phase === 'main' ? request.mainTime : request.finishTime} minut):`;
          
          // Přidání kompletních informací o každé aktivitě v dané fázi
          activities.forEach((activity, index) => {
            userPrompt += `\n${index + 1}. "${activity.name}"`;
            
            // Vždy přidáváme popis aktivity, pokud existuje
            if (activity.description) {
              userPrompt += `: ${activity.description}`;
            }
            
            // Přidání dalších dostupných informací
            if (activity.notes) {
              userPrompt += `\n   Poznámky: ${activity.notes}`;
            }
            
            if (activity.keywords && activity.keywords.length > 0) {
              userPrompt += `\n   Klíčová slova: ${activity.keywords.join(', ')}`;
            }
          });
        }
      }
      
      userPrompt += `\n\nTVÝM ÚKOLEM JE na základě výše uvedených aktivit a jejich popisů vytvořit konkrétní cvičení a aktivity VÝHRADNĚ pro vybrané části hodiny. NEVYTVÁŘEJ ŽÁDNÁ OBECNÁ CVIČENÍ, která nesouvisí s uvedenými aktivitami. Zaměř se pouze na popis konkrétních cvičení, jak by měly být realizovány s ohledem na věk žáků. Každé cvičení musí vycházet z popisu vybraných aktivit.`;
    }
  } else {
    // Původní prompt pro všechny části, když nejsou vybrány konkrétní fáze
    userPrompt += `
    
    Časy jednotlivých částí:
    - Přípravná část (${request.preparationTime} minut): ${request.preparationRole}
    - Hlavní část (${request.mainTime} minut): ${request.mainRole}
    - Závěrečná část (${request.finishTime} minut): ${request.finishRole}
    `;
  }
  
  userPrompt += `
    
    DŮLEŽITÉ: Odpověz výhradně v ČESKÉM JAZYCE!
    
    Pro každou část vytvoř seznam konkrétních cvičení s názvem, popisem a dobou trvání v minutách.
    Vrať pouze JSON ve formátu:
    {
      "preparation": [{"name": "Název cviku", "description": "Popis cviku", "time": počet_minut}, ...],
      "main": [{"name": "Název cviku", "description": "Popis cviku", "time": počet_minut}, ...],
      "finish": [{"name": "Název cviku", "description": "Popis cviku", "time": počet_minut}, ...]
    }
  `;

  return {
    systemPrompt,
    userPrompt
  };
}

/**
 * Zpracovává odpověď z AI API a extrahuje JSON data
 */
export function processApiResponse(content: string): any {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Neplatná odpověď z API - neobsahuje validní JSON');
  }
  
  return JSON.parse(jsonMatch[0]);
}

/**
 * Zobrazí chybovou hlášku pomocí toast komponenty
 */
export function showErrorToast(message: string): void {
  toast({
    title: "Chyba při generování plánu",
    description: message,
    variant: "destructive",
  });
}
