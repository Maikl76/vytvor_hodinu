import { getAiSettings } from './settings-service';
import { extractSelectedActivities } from './extractActivities';
import { getConcreteExercisesForActivitiesByPhases, createAntiRepetitionContext, createProgressionContext } from './contextBuilders';
import { createOptimizedSystemPrompt } from './systemPromptBuilder';
import { AiGenerationSettings } from './generation-settings-service';
import { LessonGenerationRequest, LessonExerciseData } from './types';

export async function createPromptText(
  request: LessonGenerationRequest & { 
    progressionContext?: {
      weekNumber: number;
      lessonNumber: number;
      totalLessonInPlan: number;
      isFirstLesson: boolean;
      previousLessons: Array<{
        week: number;
        lesson: number;
        exercises: LessonExerciseData;
      }>;
    };
    selectedActivitiesPhases?: string[];
    selectedActivitiesInfo?: Record<string, any[]>;
  },
  planId?: string,
  generationSettings?: AiGenerationSettings
): Promise<{ systemPrompt: string; userPrompt: string }> {
  console.log('📝 Vytvářím AI prompty s optimalizací pro více týdenní plány');
  
  // DETEKCE: Je to více týdenní plán?
  const isWeeklyPlan = !!(request.progressionContext && request.progressionContext.previousLessons.length >= 0);
  console.log('🔍 Detected plan type:', isWeeklyPlan ? 'WEEKLY PLAN' : 'SINGLE LESSON');
  
  // Načteme systémový prompt z admin nastavení
  let baseSystemPrompt = '';
  try {
    console.log('⚙️ Loading AI settings for system prompt...');
    const aiSettings = await getAiSettings();
    if (aiSettings && aiSettings.system_prompt) {
      baseSystemPrompt = aiSettings.system_prompt;
      console.log('✅ Loaded system prompt from admin settings, length:', baseSystemPrompt.length);
    } else {
      console.warn('⚠️ No system prompt found in admin settings, using default');
      baseSystemPrompt = 'Jsi expertní asistent pro tvorbu plánů hodin tělesné výchovy. Tvým úkolem je vytvořit kvalitní, věkově přiměřené a bezpečné cvičení pro žáky.';
    }
  } catch (error) {
    console.error('❌ Error loading AI settings:', error);
    baseSystemPrompt = 'Jsi expertní asistent pro tvorbu plánů hodin tělesné výchovy. Tvým úkolem je vytvořit kvalitní, věkově přiměřené a bezpečné cvičení pro žáky.';
  }
  
  let concreteExercisesContext = '';
  let antiRepetitionContext = '';
  
  // OPTIMALIZACE: Načteme znalostní databázi s optimalizací pro více týdenní plány
  try {
    console.log('📖 Loading knowledge base with optimization for weekly plans');
    
    const selectedActivities = await extractSelectedActivities(request);
    console.log('🎯 Selected activities:', selectedActivities);
    
    if (selectedActivities.length > 0) {
      // OPTIMALIZACE: Předáváme info o typu plánu
      concreteExercisesContext = await getConcreteExercisesForActivitiesByPhases(planId, selectedActivities, isWeeklyPlan);
      console.log('📚 Knowledge base context created, length:', concreteExercisesContext.length);
    }
    
  } catch (error) {
    console.error('❌ Chyba při načítání znalostní databáze:', error);
  }

  // OPTIMALIZACE: Vytvoříme kontext pro zabránění opakování s optimalizací
  if (request.progressionContext && request.progressionContext.previousLessons.length > 0) {
    console.log('📚 Creating optimized anti-repetition context');
    antiRepetitionContext = createAntiRepetitionContext(
      request.progressionContext.previousLessons,
      generationSettings,
      isWeeklyPlan
    );
    console.log('🚫 Anti-repetition context created, length:', antiRepetitionContext.length);
  }

  // OPTIMALIZACE: Progresní kontext zkrácený pro více týdenní plány
  let progressionContext = createProgressionContext(request, isWeeklyPlan);

  // OPTIMALIZACE: Nastavení generování zkrácené pro více týdenní plány
  let generationSettingsContext = '';
  if (generationSettings && !isWeeklyPlan) {
    generationSettingsContext = `\n\nNASTAVENÍ GENEROVÁNÍ PLÁNU:
- Maximální počet opakování cvičení v celém plánu: ${generationSettings.repetition_frequency_global}x
- Minimální pauza mezi opakováním stejného cvičení: ${generationSettings.min_pause_between_repetitions} týdnů
- Koeficient progrese obtížnosti: ${generationSettings.progression_coefficient}
- Počet cviků v přípravné části: ${generationSettings.preparation_exercises_min}-${generationSettings.preparation_exercises_max}
- Počet cviků v hlavní části: ${generationSettings.main_exercises_min}-${generationSettings.main_exercises_max}
- Počet cviků v závěrečné části: ${generationSettings.finish_exercises_min}-${generationSettings.finish_exercises_max}`;
  }

  let selectedActivitiesContext = '';
  if (request.selectedActivitiesPhases && request.selectedActivitiesInfo) {
    selectedActivitiesContext = `\n\nPARCIÁLNÍ GENEROVÁNÍ PRO VYBRANÉ FÁZE: ${request.selectedActivitiesPhases.join(', ')}

VYBRANÉ AKTIVITY PRO GENEROVÁNÍ:`;
    
    request.selectedActivitiesPhases.forEach(phase => {
      const activities = request.selectedActivitiesInfo![phase] || [];
      if (activities.length > 0) {
        selectedActivitiesContext += `\n\n${phase.toUpperCase()} část:`;
        activities.forEach(activity => {
          selectedActivitiesContext += `\n- ${activity.name}: ${activity.description}`;
        });
      }
    });
    
    selectedActivitiesContext += `\n\nVYGENERUJ POUZE cvičení pro vybrané fáze (${request.selectedActivitiesPhases.join(', ')}) na základě uvedených aktivit. Ostatní fáze ponech prázdné nebo neměň.`;
  }

  // KLÍČOVÉ: Použijeme optimalizovaný systémový prompt
  const systemPrompt = createOptimizedSystemPrompt(baseSystemPrompt, isWeeklyPlan) + 
    (generationSettings && !isWeeklyPlan ? generationSettingsContext : '');

  // OPTIMALIZACE: Kratší user prompt pro více týdenní plány
  const userPrompt = `Vytvoř plán hodiny tělesné výchovy s těmito parametry:

ZÁKLADNÍ INFORMACE:
- Škola: ${request.school}
- Ročník: ${request.grade}
- Zaměření: ${request.construct}
- Prostředí: ${request.environment}
- Vybavení: ${request.equipment.join(', ')}

STRUKTURA HODINY:
- Přípravná část: ${request.preparationTime} minut (role: ${request.preparationRole})
- Hlavní část: ${request.mainTime} minut (role: ${request.mainRole})  
- Závěrečná část: ${request.finishTime} minut (role: ${request.finishRole})

${concreteExercisesContext}${progressionContext}${antiRepetitionContext}${selectedActivitiesContext}

🚨 KRITICKÉ UPOZORNĚNÍ PRO VÍCE TÝDENNÍ PLÁNY:
I když je kontext dlouhý, KAŽDÝ popis cvičení MUSÍ být DETAILNÍ a obsahovat MOTIVACI od učitele!
NEZKRACUJ popisy kvůli délce kontextu! Podrobnost je klíčová!`;

  console.log('📋 Final prompts created:', {
    systemPromptLength: systemPrompt.length,
    userPromptLength: userPrompt.length,
    isWeeklyPlan,
    hasPhaseSpecificExercises: concreteExercisesContext.length > 0,
    hasAntiRepetition: antiRepetitionContext.length > 0,
    hasProgressionContext: progressionContext.length > 0
  });

  return { systemPrompt, userPrompt };
}
