
import { LessonGenerationRequest } from '../ai';
import { LessonExerciseData } from '../aiService';

export async function createAIRequest(
  planData: any, 
  week: number, 
  lessonNumber: number, 
  planId: string,
  previousLessonsContext?: Array<{
    week: number;
    lesson: number;
    exercises: LessonExerciseData;
  }>
): Promise<LessonGenerationRequest & { 
  planId: string; 
  weekNumber: number; 
  lessonNumber: number;
  previousLessonsContext?: Array<{
    week: number;
    lesson: number;
    exercises: LessonExerciseData;
  }>;
}> {
  const { plan, environments, prepItems, mainItems, finishItems, equipment, roles } = planData;
  
  // Sestavíme názvy konstruktů ze VŠECH vybraných aktivit namísto pouze první
  const constructs = [];
  
  // Přidáme všechny aktivity z přípravné části
  if (prepItems && prepItems.length > 0) {
    const prepActivityNames = prepItems
      .map((item: any) => item.item?.name)
      .filter(Boolean);
    constructs.push(...prepActivityNames);
  }
  
  // Přidáme všechny aktivity z hlavní části
  if (mainItems && mainItems.length > 0) {
    const mainActivityNames = mainItems
      .map((item: any) => item.item?.name)
      .filter(Boolean);
    constructs.push(...mainActivityNames);
  }
  
  // Přidáme všechny aktivity ze závěrečné části
  if (finishItems && finishItems.length > 0) {
    const finishActivityNames = finishItems
      .map((item: any) => item.item?.name)
      .filter(Boolean);
    constructs.push(...finishActivityNames);
  }
  
  // Názvy prostředí
  const environmentNames = environments.map((e: any) => e.environment?.name).filter(Boolean);
  
  // Názvy vybavení
  const equipmentNames = equipment.map((e: any) => e.equipment?.name).filter(Boolean);
  
  // Role
  const prepRole = plan.preparation_role_id ? roles.find((r: any) => r.id === plan.preparation_role_id) : null;
  const mainRole = plan.main_role_id ? roles.find((r: any) => r.id === plan.main_role_id) : null;
  const finishRole = plan.finish_role_id ? roles.find((r: any) => r.id === plan.finish_role_id) : null;
  
  const request = {
    school: plan.school?.name || 'Základní škola',
    grade: plan.grade,
    construct: constructs.length > 0 ? constructs.join(', ') : 'Všeobecná průprava',
    environment: environmentNames.join(', ') || 'Tělocvična',
    equipment: equipmentNames,
    preparationTime: plan.preparation_time || 10,
    mainTime: plan.main_time || 25,
    finishTime: plan.finish_time || 10,
    preparationRole: prepRole?.name || 'Rozcvička',
    mainRole: mainRole?.name || 'Hlavní aktivita',
    finishRole: finishRole?.name || 'Uklidnění',
    planId: planId,
    weekNumber: week,
    lessonNumber: lessonNumber,
    previousLessonsContext: previousLessonsContext || []
  };
  
  console.log('🤖 AI REQUEST PRO TÝDEN', week, 'HODINU', lessonNumber, 'S KONTEXTEM PŘEDCHOZÍCH HODIN:', {
    ...request,
    previousLessonsCount: previousLessonsContext?.length || 0,
    totalSelectedActivities: constructs.length,
    prepActivitiesCount: prepItems?.length || 0,
    mainActivitiesCount: mainItems?.length || 0,
    finishActivitiesCount: finishItems?.length || 0
  });
  
  return request;
}
