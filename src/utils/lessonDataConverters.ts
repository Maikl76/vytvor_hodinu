
export const convertDatabaseLessonToAppFormat = (dbLesson: any) => {
  console.log("🔄 Converting database lesson to app format:", dbLesson);
  console.log("🔄 Raw equipment data:", dbLesson.lesson_equipment);
  
  // Extract equipment names from the lesson_equipment relationship
  const equipmentNames = dbLesson.lesson_equipment && Array.isArray(dbLesson.lesson_equipment) 
    ? dbLesson.lesson_equipment
        .map((item: any) => item.equipment?.name)
        .filter(Boolean)
    : [];

  // Extract equipment IDs for backward compatibility
  const equipmentIds = dbLesson.lesson_equipment && Array.isArray(dbLesson.lesson_equipment)
    ? dbLesson.lesson_equipment
        .map((item: any) => item.equipment_id)
        .filter(Boolean)
    : [];

  console.log("🔄 Extracted equipment names:", equipmentNames);
  console.log("🔄 Extracted equipment IDs:", equipmentIds);

  const converted = {
    id: dbLesson.id,
    title: dbLesson.title,
    school: dbLesson.school?.name || 'Neznámá škola',
    schoolId: dbLesson.school_id,
    environment: dbLesson.environment?.name || 'Neznámé prostředí',
    environmentId: dbLesson.environment_id,
    construct: dbLesson.constructs?.name || 'Neznámý konstrukt',
    constructId: dbLesson.construct_id,
    grade: dbLesson.grade || 1,
    preparationTime: dbLesson.preparation_time || 10,
    mainTime: dbLesson.main_time || 25,
    finishTime: dbLesson.finish_time || 10,
    preparationRole: dbLesson.preparation_roles?.name || 'Neurčeno',
    preparationRoleId: dbLesson.preparation_role_id,
    mainRole: dbLesson.main_roles?.name || 'Neurčeno',
    mainRoleId: dbLesson.main_role_id,
    finishRole: dbLesson.finish_roles?.name || 'Neurčeno',
    finishRoleId: dbLesson.finish_role_id,
    selectedItems: dbLesson.lesson_items || [],
    equipmentNames, // Use the extracted equipment names
    equipment: equipmentIds, // Keep equipment IDs for compatibility
    createdAt: dbLesson.created_at
  };

  console.log("🔄 Final converted lesson data:", converted);
  return converted;
};
