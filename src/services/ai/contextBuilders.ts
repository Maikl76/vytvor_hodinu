import { getKnowledgeForPhase } from './knowledge-base-service';
import { ActivityItem, LessonExerciseData } from './types';
import { AiGenerationSettings } from './generation-settings-service';

/**
 * OPTIMALIZOVANÁ VERZE - STRIKTNÍ FÁZOVÉ FILTROVÁNÍ CVIKŮ ZE ZNALOSTNÍ DATABÁZE
 * Pro více týdenní plány používá kratší kontext
 */
export async function getConcreteExercisesForActivitiesByPhases(
  planId: string | undefined, 
  selectedActivities: string[], 
  isWeeklyPlan: boolean = false
): Promise<string> {
  try {
    console.log('📖 Loading exercises context for activities:', selectedActivities, 'weeklyPlan:', isWeeklyPlan);
    
    if (!selectedActivities || selectedActivities.length === 0) {
      console.warn('⚠️ Žádné vybrané aktivity');
      return '';
    }

    // OPTIMALIZACE: Pro více týdenní plány kratší kontext
    let exercisesContext = isWeeklyPlan 
      ? '\n\n🔒 FÁZOVÁ PRAVIDLA: Každý cvik patří do konkrétní fáze!'
      : '\n\n🔒 KRITICKÁ PRAVIDLA PRO ZNALOSTNÍ DATABÁZI - FÁZOVÉ FILTROVÁNÍ:';
    
    if (!isWeeklyPlan) {
      exercisesContext += '\n\n⚠️ ABSOLUTNĚ ZAKÁZÁNO MÍCHÁNÍ FÁZÍ!!! KAŽDÝ CVIK MÁ SVOU PŘESNOU FÁZI!!!';
    }
    
    // Načteme cviky pro každou fázi ZVLÁŠŤ a STRIKTNĚ je oddělíme
    const phases = [
      { phase: 'preparation' as const, name: 'PŘÍPRAVNÁ ČÁST', jsonKey: 'preparation' },
      { phase: 'main' as const, name: 'HLAVNÍ ČÁST', jsonKey: 'main' },
      { phase: 'finish' as const, name: 'ZÁVĚREČNÁ ČÁST', jsonKey: 'finish' }
    ];
    
    let hasAnyExercises = false;
    
    for (const { phase, name, jsonKey } of phases) {
      // Načteme cviky POUZE pro tuto konkrétní fázi
      const phaseExercises = await getKnowledgeForPhase(planId || 'default', phase, selectedActivities);
      
      exercisesContext += `\n\n=== ${name} (PRO "${jsonKey}") ===`;
      
      if (phaseExercises.length > 0) {
        hasAnyExercises = true;
        exercisesContext += isWeeklyPlan 
          ? `\n🔒 POUZE PRO "${jsonKey}":`
          : `\n\n🔒 TYTO CVIKY SMÍŠ POUŽÍT POUZE V "${jsonKey}" ČÁSTI JSON:`;
        
        phaseExercises.forEach((item: ActivityItem, index: number) => {
          exercisesContext += `\n${index + 1}. ${item.activity_name || item.name}`;
          if (item.description) {
            exercisesContext += ` - ${item.description}`;
          }
          if (!isWeeklyPlan && item.notes) {
            exercisesContext += `\n   📄 ZDROJ: ${item.notes}`;
          }
        });
      } else {
        exercisesContext += `\n❌ Žádné cviky pro fázi "${phase}"`;
      }
    }
    
    // OPTIMALIZACE: Pro více týdenní plány kratší kontrolní instrukce
    if (!isWeeklyPlan) {
      exercisesContext += '\n\n🚨🚨🚨 FINÁLNÍ KONTROLA PŘED ODESLÁNÍM JSON 🚨🚨🚨';
      exercisesContext += '\n\n1. KONTROLA "preparation" ČÁSTI JSON:';
      exercisesContext += '\n   ✅ SMÍ obsahovat POUZE cviky označené jako "PŘÍPRAVNÁ ČÁST"';
      exercisesContext += '\n   ❌ NESMÍ obsahovat cviky z "HLAVNÍ ČÁST" nebo "ZÁVĚREČNÁ ČÁST"';
      
      exercisesContext += '\n\n2. KONTROLA "main" ČÁSTI JSON:';
      exercisesContext += '\n   ✅ SMÍ obsahovat POUZE cviky označené jako "HLAVNÍ ČÁST"';
      exercisesContext += '\n   ❌ NESMÍ obsahovat cviky z "PŘÍPRAVNÁ ČÁST" nebo "ZÁVĚREČNÁ ČÁST"';
      
      exercisesContext += '\n\n3. KONTROLA "finish" ČÁSTI JSON:';
      exercisesContext += '\n   ✅ SMÍ obsahovat POUZE cviky označené jako "ZÁVĚREČNÁ ČÁST"';
      exercisesContext += '\n   ❌ NESMÍ obsahovat cviky z "PŘÍPRAVNÁ ČÁST" nebo "HLAVNÍ ČÁST"';
    }
    
    if (!hasAnyExercises) {
      exercisesContext += isWeeklyPlan
        ? '\n❌ Žádné cviky ze znalostní databáze! Použij obecné.'
        : '\n\n❌ POZOR: Žádné cviky ze znalostní databáze nenalezeny!';
    }
    
    console.log('✅ Exercises context created, length:', exercisesContext.length);
    return exercisesContext;
  } catch (error) {
    console.error('❌ Chyba při načítání cviků podle fází:', error);
    return '';
  }
}

/**
 * OPTIMALIZOVANÁ VERZE - kontext pro zabránění opakování cviků
 * Pro více týdenní plány používá kratší format
 */
export function createAntiRepetitionContext(
  previousLessons: Array<{ week: number; lesson: number; exercises: LessonExerciseData; }>,
  generationSettings?: AiGenerationSettings,
  isWeeklyPlan: boolean = false
): string {
  if (!previousLessons || previousLessons.length === 0) {
    return '';
  }
  
  console.log('🚫 Creating anti-repetition context from', previousLessons.length, 'previous lessons');
  
  // Shromáždíme všechny použité cviky z předchozích hodin
  const usedExercises = new Set<string>();
  
  previousLessons.forEach(lesson => {
    lesson.exercises.preparation?.forEach(ex => {
      usedExercises.add(ex.name.toLowerCase().trim());
    });
    
    lesson.exercises.main?.forEach(ex => {
      usedExercises.add(ex.name.toLowerCase().trim());
    });
    
    lesson.exercises.finish?.forEach(ex => {
      usedExercises.add(ex.name.toLowerCase().trim());
    });
  });
  
  console.log('🚫 Total unique used exercises:', usedExercises.size);
  
  // OPTIMALIZACE: Pro více týdenní plány kratší kontext
  let context = isWeeklyPlan 
    ? '\n\n🚫 NEPOUŽÍVEJ OPAKOVANÉ CVIKY:'
    : '\n\n🚫 KRITICKÁ PRAVIDLA PRO ZABRÁNĚNÍ OPAKOVÁNÍ CVIKŮ:';
  
  if (usedExercises.size > 0) {
    if (isWeeklyPlan) {
      // Kratší seznam pro více týdenní plány
      context += '\n❌ ZAKÁZANÉ: ';
      const exercisesList = Array.from(usedExercises).slice(0, 20); // Max 20 pro kratší kontext
      context += exercisesList.map(ex => `"${ex}"`).join(', ');
      if (usedExercises.size > 20) {
        context += ` a dalších ${usedExercises.size - 20} cviků`;
      }
    } else {
      // Plný seznam pro jednotlivé hodiny
      context += '\n\n❌ ZAKÁZANÉ CVIKY - TYTO CVIKY UŽ BYLY POUŽITY:';
      Array.from(usedExercises).forEach((exercise, index) => {
        context += `\n${index + 1}. "${exercise}" - ❌ ZAKÁZÁNO`;
      });
    }
    
    context += isWeeklyPlan 
      ? '\n✅ VŽDY použij JINÉ názvy cviků!'
      : '\n\n🔒 POVINNÉ KONTROLY PŘED ODESLÁNÍM ODPOVĚDI:';
    
    if (!isWeeklyPlan) {
      context += '\n1. ZKONTROLUJ každý cvik v JSON odpovědi';
      context += '\n2. POROVNEJ s výše uvedeným seznamem zakázaných cviků';
      context += '\n3. POKUD najdeš JAKÝKOLIV cvik ze zakázaného seznamu → IHNED ho nahraď jiným';
      context += '\n4. POUŽIJ POUZE cviky, které NEJSOU v zakázaném seznamu';
    }
  }
  
  if (generationSettings && !isWeeklyPlan) {
    context += `\n\nNASTAVENÍ OPAKOVÁNÍ:`;
    context += `\n- Maximální počet opakování cviku v celém plánu: ${generationSettings.repetition_frequency_global}x`;
    context += `\n- Minimální pauza mezi opakováním: ${generationSettings.min_pause_between_repetitions} týdnů`;
  }
  
  console.log('✅ Anti-repetition context created, length:', context.length);
  return context;
}

/**
 * Kontext pro progresi více týdenních plánů atd.
 */
export function createProgressionContext(request: any, isWeeklyPlan: boolean): string {
  let progressionContext = '';
  if (request.progressionContext && request.progressionContext.previousLessons.length > 0) {
    if (isWeeklyPlan) {
      progressionContext = `\n\nKONTEXT: Hodina ${request.progressionContext.lessonNumber} v týdnu ${request.progressionContext.weekNumber} (${request.progressionContext.totalLessonInPlan}. hodina celkem).`;
      const recentLessons = request.progressionContext.previousLessons.slice(-3);
      if (recentLessons.length > 0) {
        progressionContext += '\n\nPOSLEDNÍ HODINY:';
        recentLessons.forEach(lesson => {
          progressionContext += `\nT${lesson.week}H${lesson.lesson}: `;
          const allExercises = [
            ...(lesson.exercises.preparation || []),
            ...(lesson.exercises.main || []),
            ...(lesson.exercises.finish || [])
          ];
          progressionContext += allExercises.slice(0, 3).map(ex => ex.name).join(', ');
          if (allExercises.length > 3) progressionContext += '...';
        });
      }
    } else {
      progressionContext = `\n\nKONTEXT PROGRESE PLÁNU:
Generuješ hodinu ${request.progressionContext.lessonNumber} v týdnu ${request.progressionContext.weekNumber} (celkově ${request.progressionContext.totalLessonInPlan}. hodina v plánu).

HISTORIE PŘEDCHOZÍCH HODIN:`;
      request.progressionContext.previousLessons.forEach(lesson => {
        progressionContext += `\n\nTýden ${lesson.week}, Hodina ${lesson.lesson}:`;
        if (lesson.exercises.preparation?.length > 0) {
          progressionContext += `\n  Přípravná část: ${lesson.exercises.preparation.map(ex => ex.name).join(', ')}`;
        }
        if (lesson.exercises.main?.length > 0) {
          progressionContext += `\n  Hlavní část: ${lesson.exercises.main.map(ex => ex.name).join(', ')}`;
        }
        if (lesson.exercises.finish?.length > 0) {
          progressionContext += `\n  Závěrečná část: ${lesson.exercises.finish.map(ex => ex.name).join(', ')}`;
        }
      });
    }
  }
  return progressionContext;
}
