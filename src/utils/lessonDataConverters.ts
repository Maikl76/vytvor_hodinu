
import { RoleType } from "@/integrations/supabase/client";

/**
 * Convert database lesson record to application format
 */
export const convertDatabaseLessonToAppFormat = (historyLesson: any) => {
  // Safe access to nested properties with fallbacks to prevent "Neurčeno" display
  const schoolName = historyLesson.school?.name || (historyLesson.school_id ? `School ${historyLesson.school_id}` : '');
  const environmentName = historyLesson.environment?.name || (historyLesson.environment_id ? `Environment ${historyLesson.environment_id}` : '');
  const constructName = historyLesson.construct?.name || '';
  
  // Get equipment and item ids
  const equipmentIds = historyLesson.equipment_ids || [];
  const itemIds = historyLesson.item_ids || [];
  
  // Safely access role information
  const prepRole = historyLesson.preparation_role || { name: '' };
  const mainRole = historyLesson.main_role || { name: '' };
  const finishRole = historyLesson.finish_role || { name: '' };
  
  // Extract phase-specific items by filtering lesson_items based on their associated construct_items
  const preparationItems = [];
  const mainItems = [];
  const finishItems = [];
  
  // If the database record includes direct phase mappings, use those
  if (historyLesson.lesson_items && Array.isArray(historyLesson.lesson_items)) {
    historyLesson.lesson_items.forEach((item: any) => {
      if (!item.item_id) return;
      
      // Check if the item has phase information
      if (item.construct_item && item.construct_item.phase) {
        const phase = item.construct_item.phase;
        if (phase === 'preparation') {
          preparationItems.push(item.item_id);
        } else if (phase === 'main') {
          mainItems.push(item.item_id);
        } else if (phase === 'finish') {
          finishItems.push(item.item_id);
        }
      } else {
        // If no phase information, use default mapping based on item order
        // Assume first 20% to preparation, next 60% to main, last 20% to finish
        const itemIndex = historyLesson.lesson_items.findIndex((li: any) => li.item_id === item.item_id);
        const totalItems = historyLesson.lesson_items.length;
        
        if (itemIndex < totalItems * 0.2) {
          preparationItems.push(item.item_id);
        } else if (itemIndex < totalItems * 0.8) {
          mainItems.push(item.item_id);
        } else {
          finishItems.push(item.item_id);
        }
      }
    });
  } else if (historyLesson.selectedItems) {
    // If we have explicit selectedItems data, use that
    if (historyLesson.selectedItems.preparationItems) {
      preparationItems.push(...historyLesson.selectedItems.preparationItems);
    }
    if (historyLesson.selectedItems.mainItems) {
      mainItems.push(...historyLesson.selectedItems.mainItems);
    }
    if (historyLesson.selectedItems.finishItems) {
      finishItems.push(...historyLesson.selectedItems.finishItems);
    }
  } else {
    // If we don't have proper phase information and need to fall back to legacy
    const totalItems = itemIds.length;
    const prepItemCount = Math.max(1, Math.round(totalItems * 0.2));
    const mainItemCount = Math.max(2, Math.round(totalItems * 0.6));
    
    for (let i = 0; i < totalItems; i++) {
      if (i < prepItemCount) {
        preparationItems.push(itemIds[i]);
      } else if (i < prepItemCount + mainItemCount) {
        mainItems.push(itemIds[i]);
      } else {
        finishItems.push(itemIds[i]);
      }
    }
  }
  
  // Convert database data to the format used in the application
  return {
    id: historyLesson.id,
    school: schoolName,
    environment: environmentName,
    construct: constructName,
    equipment: equipmentIds,
    preparationTime: historyLesson.preparation_time,
    mainTime: historyLesson.main_time,
    finishTime: historyLesson.finish_time,
    preparationRole: prepRole.name || '',
    mainRole: mainRole.name || '',
    finishRole: finishRole.name || '',
    constructId: historyLesson.construct_id,
    constructItems: itemIds, // Legacy format - all items combined
    schoolId: historyLesson.school_id,
    environmentId: historyLesson.environment_id,
    preparationRoleId: historyLesson.preparation_role_id,
    mainRoleId: historyLesson.main_role_id,
    finishRoleId: historyLesson.finish_role_id,
    // Ensure all phase-specific selections are populated
    selectedItems: {
      // Use the populated phase arrays
      preparationItems: preparationItems.length > 0 ? preparationItems : [],
      mainItems: mainItems.length > 0 ? mainItems : [],
      finishItems: finishItems.length > 0 ? finishItems : []
    }
  };
};
