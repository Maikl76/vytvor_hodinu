
import { supabase } from '@/integrations/supabase/client';

// Construct Items functions
export async function getConstructItems(constructId: number | null, phase?: string | null) {
  try {
    let query = supabase.from('construct_items').select('*');
    
    // Handle null value properly for construct_id
    if (constructId !== undefined) {
      if (constructId === null) {
        // If we're specifically looking for items without a construct
        // query = query.is('construct_id', null);
        // We want ALL items, so we don't filter by construct_id
      } else {
        // If we're looking for items for a specific construct
        query = query.eq('construct_id', constructId);
      }
    }

    // Filter by phase if provided
    if (phase !== undefined && phase !== null) {
      query = query.eq('phase', phase);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Supabase error fetching construct items:", error);
      throw error;
    }
    
    console.log(`Fetched ${data?.length || 0} construct items:`, { constructId, phase, data });
    return data || [];
  } catch (error) {
    console.error('Error fetching construct items:', error);
    return [];
  }
}

export async function createConstructItem(name: string, description: string, constructId: number | null, phase: string = 'main', duration: number = 5) {
  try {
    const { data, error } = await supabase
      .from('construct_items')
      .insert([
        { name, description, construct_id: constructId, phase, duration }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating construct item:', error);
    return null;
  }
}

export async function updateConstructItem(id: number, name: string, description: string, phase: string = 'main', duration: number = 5) {
  try {
    const { data, error } = await supabase
      .from('construct_items')
      .update({ name, description, phase, duration })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating construct item:', error);
    return null;
  }
}

export async function deleteConstructItem(id: number) {
  try {
    const { error } = await supabase
      .from('construct_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting construct item:', error);
    return false;
  }
}

// Constructs functions
export async function getConstructs() {
  try {
    const { data, error } = await supabase
      .from('constructs')
      .select('*');

    if (error) {
      console.error('Error fetching constructs:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching constructs:', error);
    return [];
  }
}

export async function createConstruct(name: string, description: string) {
  try {
    const { data, error } = await supabase
      .from('constructs')
      .insert([{ name, description }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating construct:', error);
    return null;
  }
}

export async function updateConstruct(id: number, name: string, description: string) {
  try {
    const { data, error } = await supabase
      .from('constructs')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating construct:', error);
    return null;
  }
}

export async function deleteConstruct(id: number) {
  try {
    const { error } = await supabase
      .from('constructs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting construct:', error);
    return false;
  }
}

// Equipment functions
export async function getEquipment() {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*');

    if (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
}

export async function createEquipment(name: string) {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    return null;
  }
}

export async function updateEquipment(id: number, name: string) {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating equipment:', error);
    return null;
  }
}

export async function deleteEquipment(id: number) {
  try {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting equipment:', error);
    return false;
  }
}

// School functions
export async function getSchools() {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
}

export async function createSchool(name: string, lessonsPerWeek: number = 2) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([{ name, lessons_per_week: lessonsPerWeek }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating school:', error);
    return null;
  }
}

export async function updateSchool(id: number, name: string, lessonsPerWeek: number) {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update({ name, lessons_per_week: lessonsPerWeek })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating school:', error);
    return null;
  }
}

export async function deleteSchool(id: number) {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting school:', error);
    return false;
  }
}

// Environment functions
export async function getEnvironments() {
  try {
    const { data, error } = await supabase
      .from('environments')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching environments:', error);
    return [];
  }
}

export async function createEnvironment(name: string) {
  try {
    const { data, error } = await supabase
      .from('environments')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating environment:', error);
    return null;
  }
}

export async function updateEnvironment(id: number, name: string) {
  try {
    const { data, error } = await supabase
      .from('environments')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating environment:', error);
    return null;
  }
}

export async function deleteEnvironment(id: number) {
  try {
    const { error } = await supabase
      .from('environments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting environment:', error);
    return false;
  }
}

// Roles functions
export async function getRoles() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
}

// Lesson functions
export async function getLessons() {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        school:school_id(name),
        environment:environment_id(name),
        construct:construct_id(name)
      `);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
}

export async function getLessonById(id: string) {
  try {
    // First, get the lesson details
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        school:school_id(name),
        environment:environment_id(name),
        construct:construct_id(name),
        preparation_role:preparation_role_id(name),
        main_role:main_role_id(name),
        finish_role:finish_role_id(name)
      `)
      .eq('id', id)
      .maybeSingle();
  
    if (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }
    
    if (!lesson) {
      return null;
    }

    // Get the equipment IDs associated with this lesson
    const { data: equipmentRelations, error: equipmentError } = await supabase
      .from('lesson_equipment')
      .select('equipment_id')
      .eq('lesson_id', id);
      
    if (equipmentError) {
      console.error('Error fetching lesson equipment:', equipmentError);
    }
    
    // Get the construct item IDs associated with this lesson
    const { data: itemRelations, error: itemsError } = await supabase
      .from('lesson_items')
      .select('item_id')
      .eq('lesson_id', id);
      
    if (itemsError) {
      console.error('Error fetching lesson items:', itemsError);
    }

    // Extract just the IDs into arrays
    const equipment_ids = equipmentRelations ? equipmentRelations.map(relation => relation.equipment_id).filter(Boolean) : [];
    const item_ids = itemRelations ? itemRelations.map(relation => relation.item_id).filter(Boolean) : [];

    // Return the combined data
    return {
      ...lesson,
      equipment_ids,
      item_ids
    };
  } catch (error) {
    console.error('Error fetching lesson details:', error);
    return null;
  }
}

export async function createLesson(lessonData: any) {
  try {
    // Destructure and ensure all IDs are numbers
    const { 
      schoolId, environmentId, constructId, preparationTime, mainTime, finishTime,
      preparationRoleId, mainRoleId, finishRoleId, construct, equipment, 
      selectedItems, grade
    } = lessonData;
    
    // Log the data before insertion to help with debugging
    console.log("Creating lesson with data:", { 
      schoolId, environmentId, constructId, preparationTime, mainTime, finishTime,
      preparationRoleId, mainRoleId, finishRoleId, construct, 
      selectedItems, grade
    });
    
    // Insert lesson - handle null constructId properly
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([{ 
        school_id: Number(schoolId),
        environment_id: Number(environmentId),
        construct_id: constructId ? Number(constructId) : null,
        preparation_time: Number(preparationTime),
        main_time: Number(mainTime),
        finish_time: Number(finishTime),
        preparation_role_id: preparationRoleId ? Number(preparationRoleId) : null,
        main_role_id: mainRoleId ? Number(mainRoleId) : null,
        finish_role_id: finishRoleId ? Number(finishRoleId) : null,
        title: `Tělesná výchova - ${construct || 'Hodina'}`
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
    
    // Associate equipment
    if (equipment && equipment.length > 0 && lesson) {
      // Ensure all equipment IDs are numbers
      const equipmentRows = equipment.map((equipmentId: number | string) => ({
        lesson_id: lesson.id,
        equipment_id: Number(equipmentId)
      }));
      
      console.log("Creating equipment relations:", equipmentRows);
      
      const { error: equipmentError } = await supabase
        .from('lesson_equipment')
        .insert(equipmentRows);
      
      if (equipmentError) {
        console.error('Error associating equipment:', equipmentError);
        throw equipmentError;
      }
    }
    
    // Associate all construct items from each phase
    if (selectedItems && lesson) {
      const allItemsToSave = [
        ...(selectedItems.preparationItems || []).map((id: number | string) => ({ 
          phase: 'preparation', 
          id: Number(id) 
        })),
        ...(selectedItems.mainItems || []).map((id: number | string) => ({ 
          phase: 'main', 
          id: Number(id) 
        })),
        ...(selectedItems.finishItems || []).map((id: number | string) => ({ 
          phase: 'finish', 
          id: Number(id) 
        }))
      ];
      
      if (allItemsToSave.length > 0) {
        const itemRows = allItemsToSave.map(item => ({
          lesson_id: lesson.id,
          item_id: item.id
        }));
        
        console.log("Creating item relations:", itemRows);
        
        const { error: itemsError } = await supabase
          .from('lesson_items')
          .insert(itemRows);
        
        if (itemsError) {
          console.error('Error associating construct items:', itemsError);
          throw itemsError;
        }
      }
    }
    
    return lesson;
  } catch (error) {
    console.error('Error creating lesson:', error);
    return null;
  }
}

export async function deleteLesson(id: string) {
  try {
    // First delete associated records
    await supabase.from('lesson_equipment').delete().eq('lesson_id', id);
    await supabase.from('lesson_items').delete().eq('lesson_id', id);
    
    // Then delete the lesson
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return false;
  }
}

// AI Settings functions
export async function getAISettings() {
  try {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return null;
  }
}

export async function saveAISettings(settings: any) {
  try {
    // Check if there are existing settings
    const { data: existingSettings } = await supabase
      .from('ai_settings')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    let result;
    
    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('ai_settings')
        .update(settings)
        .eq('id', existingSettings.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('ai_settings')
        .insert([settings])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error('Error saving AI settings:', error);
    return null;
  }
}
