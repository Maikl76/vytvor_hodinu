

import { supabase } from '@/integrations/supabase/client';
import { WeeklyPlanLessonData } from './weekly-plan';

export const getSchools = async () => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*');

    if (error) {
      console.error("Error fetching schools:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching schools:", error);
    return [];
  }
};

export const getEnvironments = async () => {
  try {
    const { data, error } = await supabase
      .from('environments')
      .select('*');

    if (error) {
      console.error("Error fetching environments:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching environments:", error);
    return [];
  }
};

export const getConstructItems = async (constructId: number) => {
  try {
    const { data, error } = await supabase
      .from('construct_items')
      .select('*')
      .eq('construct_id', constructId);

    if (error) {
      console.error("Error fetching construct items:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching construct items:", error);
    return [];
  }
};

export const getConstructs = async () => {
  try {
    const { data, error } = await supabase
      .from('constructs')
      .select('*');

    if (error) {
      console.error("Error fetching constructs:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching constructs:", error);
    return [];
  }
};

export const getEquipment = async () => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*');

    if (error) {
      console.error("Error fetching equipment:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching equipment:", error);
    return [];
  }
};

export const getRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');

    if (error) {
      console.error("Error fetching roles:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching roles:", error);
    return [];
  }
};

export const createLesson = async (lessonData: any) => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Uživatel není přihlášen');
  }

  try {
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert([
        {
          title: lessonData.title,
          school_id: lessonData.schoolId,
          environment_id: lessonData.environmentId,
          construct_id: lessonData.constructId,
          grade: lessonData.grade,
          preparation_time: lessonData.preparationTime,
          main_time: lessonData.mainTime,
          finish_time: lessonData.finishTime,
          preparation_role_id: lessonData.preparationRoleId,
          main_role_id: lessonData.mainRoleId,
          finish_role_id: lessonData.finishRoleId,
          created_by: user.id
        }
      ])
      .select()
      .single();

    if (lessonError) {
      console.error("Error creating lesson:", lessonError);
      throw lessonError;
    }

    const equipmentToInsert = lessonData.equipment.map((equipmentId: number) => ({
      lesson_id: lesson.id,
      equipment_id: equipmentId
    }));

    const { error: equipmentError } = await supabase
      .from('lesson_equipment')
      .insert(equipmentToInsert);

    if (equipmentError) {
      console.error("Error creating lesson equipment:", equipmentError);
      throw equipmentError;
    }

    return lesson;
  } catch (error) {
    console.error("Unexpected error creating lesson:", error);
    throw error;
  }
};

export const getLessons = async () => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        schools (
          name
        )
      `);

    if (error) {
      console.error("Error fetching lessons:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching lessons:", error);
    return [];
  }
};

export const getLessonById = async (lessonId: string) => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        schools (
          name
        ),
        environments (
          name
        ),
        constructs (
          name
        ),
        roles (
          id,
          name
        ),
        lesson_equipment (
          equipment_id,
          equipment (
            name
          )
        )
      `)
      .eq('id', lessonId)
      .single();

    if (error) {
      console.error("Error fetching lesson:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching lesson:", error);
    return null;
  }
};

export const createWeeklyPlan = async (planData: any) => {
  try {
    // Vytvoříme nový weekly_plan
    const { data: newPlan, error: planError } = await supabase
      .from('weekly_plans')
      .insert({
        title: planData.title,
        school_id: planData.schoolId,
        grade: planData.grade,
        preparation_time: planData.preparationTime,
        main_time: planData.mainTime,
        finish_time: planData.finishTime,
        preparation_role_id: planData.preparationRoleId,
        main_role_id: planData.mainRoleId,
        finish_role_id: planData.finishRoleId,
        weeks_count: planData.weeksCount,
        lessons_per_week: planData.lessonsPerWeek
      })
      .select()
      .single();

    if (planError) {
      console.error('❌ Chyba při vytváření weekly_plan:', planError);
      throw planError;
    }

    // Vytvoříme záznamy v weekly_plan_environments
    if (planData.environments && planData.environments.length > 0) {
      const environmentsToInsert = planData.environments.map((environmentId: number) => ({
        plan_id: newPlan.id,
        environment_id: environmentId
      }));

      const { error: envError } = await supabase
        .from('weekly_plan_environments')
        .insert(environmentsToInsert);

      if (envError) {
        console.error('❌ Chyba při vytváření weekly_plan_environments:', envError);
        throw envError;
      }
    }

    // Vytvoříme záznamy v weekly_plan_items pro preparation
    if (planData.preparationItems && planData.preparationItems.length > 0) {
      const preparationItemsToInsert = planData.preparationItems.map((itemId: number) => ({
        plan_id: newPlan.id,
        item_id: itemId,
        phase: 'preparation'
      }));

      const { error: prepError } = await supabase
        .from('weekly_plan_items')
        .insert(preparationItemsToInsert);

      if (prepError) {
        console.error('❌ Chyba při vytváření weekly_plan_items (preparation):', prepError);
        throw prepError;
      }
    }

    // Vytvoříme záznamy v weekly_plan_items pro main
    if (planData.mainItems && planData.mainItems.length > 0) {
      const mainItemsToInsert = planData.mainItems.map((itemId: number) => ({
        plan_id: newPlan.id,
        item_id: itemId,
        phase: 'main'
      }));

      const { error: mainError } = await supabase
        .from('weekly_plan_items')
        .insert(mainItemsToInsert);

      if (mainError) {
        console.error('❌ Chyba při vytváření weekly_plan_items (main):', mainError);
        throw mainError;
      }
    }

    // Vytvoříme záznamy v weekly_plan_items pro finish
    if (planData.finishItems && planData.finishItems.length > 0) {
      const finishItemsToInsert = planData.finishItems.map((itemId: number) => ({
        plan_id: newPlan.id,
        item_id: itemId,
        phase: 'finish'
      }));

      const { error: finishError } = await supabase
        .from('weekly_plan_items')
        .insert(finishItemsToInsert);

      if (finishError) {
        console.error('❌ Chyba při vytváření weekly_plan_items (finish):', finishError);
        throw finishError;
      }
    }

    // Vytvoříme záznamy v weekly_plan_equipment
    if (planData.equipment && planData.equipment.length > 0) {
      const equipmentToInsert = planData.equipment.map((equipmentId: number) => ({
        plan_id: newPlan.id,
        equipment_id: equipmentId
      }));

      const { error: equipmentError } = await supabase
        .from('weekly_plan_equipment')
        .insert(equipmentToInsert);

      if (equipmentError) {
        console.error('❌ Chyba při vytváření weekly_plan_equipment:', equipmentError);
        throw equipmentError;
      }
    }

    return newPlan;
  } catch (error) {
    console.error('❌ Chyba při vytváření více týdenního plánu:', error);
    throw error;
  }
};

export const getWeeklyPlans = async () => {
  try {
    const { data, error } = await supabase
      .from('weekly_plans')
      .select(`
        *,
        schools (
          name
        )
      `);

    if (error) {
      console.error("Error fetching weekly plans:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching weekly plans:", error);
    return [];
  }
};

export const getWeeklyPlanById = async (planId: string) => {
  try {
    const { data, error } = await supabase
      .from('weekly_plans')
      .select(`
        *,
        schools (
          name
        ),
        weekly_plan_environments (
          environment_id,
          environments (
            name
          )
        ),
        weekly_plan_items (
          item_id,
          phase,
          construct_items (
            name,
            description
          )
        ),
        weekly_plan_equipment (
          equipment_id,
          equipment (
            name
          )
        )
      `)
      .eq('id', planId)
      .single();

    if (error) {
      console.error("Error fetching weekly plan:", error);
      return null;
    }

    // Načteme role samostatně podle ID
    const rolePromises = [];
    if (data.preparation_role_id) {
      rolePromises.push(
        supabase.from('roles').select('name').eq('id', data.preparation_role_id).single()
      );
    } else {
      rolePromises.push(Promise.resolve({ data: null }));
    }
    
    if (data.main_role_id) {
      rolePromises.push(
        supabase.from('roles').select('name').eq('id', data.main_role_id).single()
      );
    } else {
      rolePromises.push(Promise.resolve({ data: null }));
    }
    
    if (data.finish_role_id) {
      rolePromises.push(
        supabase.from('roles').select('name').eq('id', data.finish_role_id).single()
      );
    } else {
      rolePromises.push(Promise.resolve({ data: null }));
    }

    const [prepRole, mainRole, finishRole] = await Promise.all(rolePromises);

    // Přidáme role k datům
    const enrichedData = {
      ...data,
      preparation_roles: prepRole.data,
      main_roles: mainRole.data,
      finish_roles: finishRole.data
    };

    return enrichedData;
  } catch (error) {
    console.error("Unexpected error fetching weekly plan:", error);
    return null;
  }
};

export const saveGeneratedWeeklyPlan = async (planData: {
  title: string;
  originalPlanId: string;
  lessonsData: Record<string, WeeklyPlanLessonData>;
  weeksCount: number;
  lessonsPerWeek: number;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Uživatel není přihlášen');

  try {
    // Načteme původní plán pro získání všech potřebných dat
    const originalPlan = await getWeeklyPlanById(planData.originalPlanId);
    if (!originalPlan) {
      throw new Error('Původní plán nebyl nalezen');
    }

    // Zajistíme, že název obsahuje (Vygenerováno) suffix
    let generatedTitle = planData.title;
    if (!generatedTitle.includes('(Vygenerováno)')) {
      generatedTitle = `${generatedTitle} (Vygenerováno)`;
    }

    // Vytvoříme nový záznam v weekly_plans s (Vygenerováno) v názvu
    const { data: newPlan, error: planError } = await supabase
      .from('weekly_plans')
      .insert({
        title: generatedTitle,
        school_id: originalPlan.school_id,
        grade: originalPlan.grade,
        preparation_time: originalPlan.preparation_time,
        main_time: originalPlan.main_time,
        finish_time: originalPlan.finish_time,
        preparation_role_id: originalPlan.preparation_role_id,
        main_role_id: originalPlan.main_role_id,
        finish_role_id: originalPlan.finish_role_id,
        weeks_count: planData.weeksCount,
        lessons_per_week: planData.lessonsPerWeek
      })
      .select()
      .single();

    if (planError) {
      console.error("Error creating generated weekly plan:", planError);
      throw planError;
    }

    // Zkopírujeme prostředí z původního plánu
    if (originalPlan.weekly_plan_environments?.length > 0) {
      const environmentsToInsert = originalPlan.weekly_plan_environments.map((env: any) => ({
        plan_id: newPlan.id,
        environment_id: env.environment_id
      }));

      const { error: envError } = await supabase
        .from('weekly_plan_environments')
        .insert(environmentsToInsert);

      if (envError) {
        console.error('Error copying environments:', envError);
      }
    }

    // Zkopírujeme položky z původního plánu
    if (originalPlan.weekly_plan_items?.length > 0) {
      const itemsToInsert = originalPlan.weekly_plan_items.map((item: any) => ({
        plan_id: newPlan.id,
        item_id: item.item_id,
        phase: item.phase
      }));

      const { error: itemsError } = await supabase
        .from('weekly_plan_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error copying items:', itemsError);
      }
    }

    // Zkopírujeme vybavení z původního plánu
    if (originalPlan.weekly_plan_equipment?.length > 0) {
      const equipmentToInsert = originalPlan.weekly_plan_equipment.map((equip: any) => ({
        plan_id: newPlan.id,
        equipment_id: equip.equipment_id
      }));

      const { error: equipError } = await supabase
        .from('weekly_plan_equipment')
        .insert(equipmentToInsert);

      if (equipError) {
        console.error('Error copying equipment:', equipError);
      }
    }

    // Uložíme vygenerované hodiny do weekly_plan_lessons
    for (const [key, lessonData] of Object.entries(planData.lessonsData)) {
      if (lessonData.exercises) {
        const [week, lessonNumber] = key.split('-').map(Number);
        
        // Převedeme data na JSON kompatibilní formát
        const lessonDataJson = JSON.parse(JSON.stringify({
          exercises: lessonData.exercises,
          promptData: lessonData.promptData
        }));
        
        const { error: lessonError } = await supabase
          .from('weekly_plan_lessons')
          .insert({
            plan_id: newPlan.id,
            week_number: week,
            lesson_number: lessonNumber,
            lesson_data: lessonDataJson
          });

        if (lessonError) {
          console.error(`Error saving lesson ${key}:`, lessonError);
        }
      }
    }

    return newPlan;
  } catch (error) {
    console.error("Unexpected error saving generated weekly plan:", error);
    throw error;
  }
};

export const updateWeeklyPlan = async (planId: string, planData: any) => {
  console.log('🔄 Aktualizuji plán:', planId, planData);

  try {
    // Nejdříve aktualizujeme základní data plánu
    const { data: updatedPlan, error: updateError } = await supabase
      .from('weekly_plans')
      .update({
        title: planData.title,
        school_id: planData.schoolId,
        grade: planData.grade,
        preparation_time: planData.preparationTime,
        main_time: planData.mainTime,
        finish_time: planData.finishTime,
        preparation_role_id: planData.preparationRoleId,
        main_role_id: planData.mainRoleId,
        finish_role_id: planData.finishRoleId,
        weeks_count: planData.weeksCount,
        lessons_per_week: planData.lessonsPerWeek
      })
      .eq('id', planId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Chyba při aktualizaci plánu:', updateError);
      throw updateError;
    }

    // Smažeme stará prostředí a přidáme nová
    await supabase.from('weekly_plan_environments').delete().eq('plan_id', planId);
    if (planData.environments.length > 0) {
      const environmentsToInsert = planData.environments.map((envId: number) => ({
        plan_id: planId,
        environment_id: envId
      }));
      await supabase.from('weekly_plan_environments').insert(environmentsToInsert);
    }

    // Smažeme staré položky a přidáme nové
    await supabase.from('weekly_plan_items').delete().eq('plan_id', planId);
    const itemsToInsert = [
      ...planData.preparationItems.map((itemId: number) => ({
        plan_id: planId,
        item_id: itemId,
        phase: 'preparation'
      })),
      ...planData.mainItems.map((itemId: number) => ({
        plan_id: planId,
        item_id: itemId,
        phase: 'main'
      })),
      ...planData.finishItems.map((itemId: number) => ({
        plan_id: planId,
        item_id: itemId,
        phase: 'finish'
      }))
    ];
    if (itemsToInsert.length > 0) {
      await supabase.from('weekly_plan_items').insert(itemsToInsert);
    }

    // Smažeme staré vybavení a přidáme nové
    await supabase.from('weekly_plan_equipment').delete().eq('plan_id', planId);
    if (planData.equipment.length > 0) {
      const equipmentToInsert = planData.equipment.map((equipId: number) => ({
        plan_id: planId,
        equipment_id: equipId
      }));
      await supabase.from('weekly_plan_equipment').insert(equipmentToInsert);
    }

    console.log('✅ Plán úspěšně aktualizován:', updatedPlan);
    return updatedPlan;

  } catch (error) {
    console.error('❌ Chyba při aktualizaci plánu:', error);
    throw error;
  }
};

export const deleteWeeklyPlan = async (planId: string) => {
  try {
    const { error } = await supabase
      .from('weekly_plans')
      .delete()
      .eq('id', planId);

    if (error) {
      console.error("Error deleting weekly plan:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error deleting weekly plan:", error);
    throw error;
  }
};

export const getGeneratedLessons = async (planId: string) => {
  try {
    const { data, error } = await supabase
      .from('weekly_plan_lessons')
      .select('*')
      .eq('plan_id', planId);

    if (error) {
      console.error("Error fetching generated lessons:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching generated lessons:", error);
    return [];
  }
};

