import { supabase } from '@/integrations/supabase/client';

export const getSchools = async () => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching schools:', error);
    return [];
  }

  return data || [];
};

export const createSchool = async (name: string, lessonsPerWeek: number) => {
  const { data, error } = await supabase
    .from('schools')
    .insert([{ name, lessons_per_week: lessonsPerWeek }])
    .select()
    .single();

  if (error) {
    console.error('Error creating school:', error);
    return null;
  }

  return data;
};

export const updateSchool = async (id: number, name: string, lessonsPerWeek: number) => {
  const { data, error } = await supabase
    .from('schools')
    .update({ name, lessons_per_week: lessonsPerWeek })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating school:', error);
    return null;
  }

  return data;
};

export const deleteSchool = async (id: number) => {
  const { error } = await supabase
    .from('schools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting school:', error);
    return false;
  }

  return true;
};

export const getEnvironments = async () => {
  const { data, error } = await supabase
    .from('environments')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching environments:', error);
    return [];
  }

  return data || [];
};

export const createEnvironment = async (name: string) => {
  const { data, error } = await supabase
    .from('environments')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    console.error('Error creating environment:', error);
    return null;
  }

  return data;
};

export const updateEnvironment = async (id: number, name: string) => {
  const { data, error } = await supabase
    .from('environments')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating environment:', error);
    return null;
  }

  return data;
};

export const deleteEnvironment = async (id: number) => {
  const { error } = await supabase
    .from('environments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting environment:', error);
    return false;
  }

  return true;
};

export const getConstructs = async () => {
  const { data, error } = await supabase
    .from('constructs')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching constructs:', error);
    return [];
  }

  return data || [];
};

export const createConstruct = async (name: string, description: string) => {
  const { data, error } = await supabase
    .from('constructs')
    .insert([{ name, description }])
    .select()
    .single();

  if (error) {
    console.error('Error creating construct:', error);
    return null;
  }

  return data;
};

export const updateConstruct = async (id: number, name: string, description: string) => {
  const { data, error } = await supabase
    .from('constructs')
    .update({ name, description })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating construct:', error);
    return null;
  }

  return data;
};

export const deleteConstruct = async (id: number) => {
  const { error } = await supabase
    .from('constructs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting construct:', error);
    return false;
  }

  return true;
};

export const getConstructItems = async (constructId?: number | null, phase?: string) => {
  let query = supabase
    .from('construct_items')
    .select('*')
    .order('name');

  if (constructId !== undefined && constructId !== null) {
    query = query.eq('construct_id', constructId);
  } else if (constructId === null) {
    query = query.is('construct_id', null);
  }

  if (phase) {
    query = query.eq('phase', phase);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching construct items:', error);
    return [];
  }

  return data || [];
};

export const createConstructItem = async (
  name: string, 
  description: string, 
  constructId: number | null, 
  phase: string, 
  duration: number
) => {
  const { data, error } = await supabase
    .from('construct_items')
    .insert([{ 
      name, 
      description, 
      construct_id: constructId, 
      phase, 
      duration 
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating construct item:', error);
    return null;
  }

  return data;
};

export const updateConstructItem = async (
  id: number, 
  name: string, 
  description: string, 
  phase: string, 
  duration: number
) => {
  const { data, error } = await supabase
    .from('construct_items')
    .update({ name, description, phase, duration })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating construct item:', error);
    return null;
  }

  return data;
};

export const deleteConstructItem = async (id: number) => {
  const { error } = await supabase
    .from('construct_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting construct item:', error);
    return false;
  }

  return true;
};

export const getEquipment = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }

  return data || [];
};

export const createEquipment = async (name: string) => {
  const { data, error } = await supabase
    .from('equipment')
    .insert([{ name }])
    .select()
    .single();

  if (error) {
    console.error('Error creating equipment:', error);
    return null;
  }

  return data;
};

export const updateEquipment = async (id: number, name: string) => {
  const { data, error } = await supabase
    .from('equipment')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating equipment:', error);
    return null;
  }

  return data;
};

export const deleteEquipment = async (id: number) => {
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting equipment:', error);
    return false;
  }

  return true;
};

export const getRoles = async () => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching roles:', error);
    return [];
  }

  return data || [];
};

export const createLesson = async (lessonData: any) => {
  console.log("🚀 SAVE LESSON - Creating lesson with data:", lessonData);
  
  try {
    // Prepare the lesson data for insertion
    const lessonToInsert = {
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
      lesson_items: lessonData.selectedItems || null,
      lesson_data: lessonData.exerciseData ? { exercises: lessonData.exerciseData } : null,
      prompt_data: lessonData.promptData || null
    };

    console.log("🚀 SAVE LESSON - Prepared lesson data for insertion:", lessonToInsert);

    const { data: lessonResult, error: lessonError } = await supabase
      .from('lessons')
      .insert([lessonToInsert])
      .select()
      .single();

    if (lessonError) {
      console.error('🚀 SAVE LESSON - Error creating lesson:', lessonError);
      return false;
    }

    console.log("🚀 SAVE LESSON - Lesson created successfully:", lessonResult);

    // Now save equipment if provided
    if (lessonData.equipment && Array.isArray(lessonData.equipment) && lessonData.equipment.length > 0) {
      console.log("🚀 SAVE LESSON - Saving equipment:", lessonData.equipment);
      
      const equipmentToInsert = lessonData.equipment.map((equipmentId: number) => ({
        lesson_id: lessonResult.id,
        equipment_id: equipmentId
      }));

      const { error: equipmentError } = await supabase
        .from('lesson_equipment')
        .insert(equipmentToInsert);

      if (equipmentError) {
        console.error('🚀 SAVE LESSON - Error saving equipment:', equipmentError);
        // Don't fail the entire operation, just log the error
      } else {
        console.log("🚀 SAVE LESSON - Equipment saved successfully");
      }
    }

    return true;
  } catch (error) {
    console.error('🚀 SAVE LESSON - Unexpected error:', error);
    return false;
  }
};

export const getLessons = async () => {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      school:school_id(name),
      environment:environment_id(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }

  return data || [];
};

export const getLessonById = async (id: string) => {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      school:school_id(name),
      environment:environment_id(name),
      constructs:construct_id(name),
      lesson_equipment(
        equipment_id,
        equipment:equipment_id(name)
      ),
      preparation_roles:preparation_role_id(name),
      main_roles:main_role_id(name),
      finish_roles:finish_role_id(name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }

  console.log("Fetched lesson with equipment:", data);
  return data;
};

export const deleteLesson = async (id: string) => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lesson:', error);
    return false;
  }

  return true;
};

export const getExercisesForLesson = async (lessonId: string) => {
  // This function should return exercise data for a specific lesson
  // Implementation depends on your database structure
  const { data, error } = await supabase
    .from('lessons')
    .select('lesson_data')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error('Error fetching exercises for lesson:', error);
    return null;
  }

  // Add proper type checking for the Json type
  if (data?.lesson_data && typeof data.lesson_data === 'object' && data.lesson_data !== null) {
    const lessonData = data.lesson_data as { exercises?: any };
    return lessonData.exercises || null;
  }

  return null;
};

export const getSchoolEquipment = async (schoolId: number) => {
  const { data, error } = await supabase
    .from('school_equipment')
    .select(`
      equipment_id,
      equipment:equipment_id(id, name)
    `)
    .eq('school_id', schoolId);

  if (error) {
    console.error('Error fetching school equipment:', error);
    return [];
  }

  return data?.map(item => item.equipment).filter(Boolean) || [];
};

export const updateSchoolEquipment = async (schoolId: number, equipmentIds: number[]) => {
  try {
    // Nejdříve smažeme stávající přiřazení
    const { error: deleteError } = await supabase
      .from('school_equipment')
      .delete()
      .eq('school_id', schoolId);

    if (deleteError) {
      console.error('Error deleting existing school equipment:', deleteError);
      return false;
    }

    // Pak přidáme nová přiřazení
    if (equipmentIds.length > 0) {
      const equipmentToInsert = equipmentIds.map(equipmentId => ({
        school_id: schoolId,
        equipment_id: equipmentId
      }));

      const { error: insertError } = await supabase
        .from('school_equipment')
        .insert(equipmentToInsert);

      if (insertError) {
        console.error('Error inserting school equipment:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating school equipment:', error);
    return false;
  }
};
