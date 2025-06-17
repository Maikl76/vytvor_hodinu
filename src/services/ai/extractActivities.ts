import { supabase } from '@/integrations/supabase/client';
import { LessonGenerationRequest } from './types';

/**
 * Extrahuje názvy aktivit z různých zdrojů v request objektu
 */
export async function extractSelectedActivities(request: LessonGenerationRequest & { 
  selectedActivitiesPhases?: string[];
  selectedActivitiesInfo?: Record<string, any[]>;
}): Promise<string[]> {
  const selectedActivities: string[] = [];
  
  console.log('🔍 Extracting selected activities from request:', {
    construct: request.construct,
    selectedActivitiesInfo: request.selectedActivitiesInfo,
    selectedActivitiesPhases: request.selectedActivitiesPhases,
    selectedItems: (request as any).selectedItems
  });
  
  // 1. Extrahujeme z construct (může být seznam oddělený čárkami)
  if (request.construct) {
    const constructActivities = request.construct.split(',').map(activity => activity.trim());
    selectedActivities.push(...constructActivities);
    console.log('📝 Activities from construct:', constructActivities);
  }
  
  // 2. Extrahujeme z selectedActivitiesInfo (prioritní zdroj pro parciální generování)
  if (request.selectedActivitiesInfo) {
    Object.values(request.selectedActivitiesInfo).forEach(activities => {
      if (Array.isArray(activities)) {
        activities.forEach(activity => {
          if (activity.name && !selectedActivities.includes(activity.name)) {
            selectedActivities.push(activity.name);
          }
          if (activity.activity_name && !selectedActivities.includes(activity.activity_name)) {
            selectedActivities.push(activity.activity_name);
          }
        });
      }
    });
    console.log('📝 Activities from selectedActivitiesInfo:', request.selectedActivitiesInfo);
  }
  
  // 3. KLÍČOVÁ LOGIKA: Pokud nemáme žádné aktivity a je to jednotlivá hodina, 
  // zkusíme najít selectedItems v requestu a načíst názvy z databáze
  if (selectedActivities.length === 0 && (request as any).selectedItems) {
    console.log('🔍 Trying to extract activities from selectedItems (single lesson):', (request as any).selectedItems);
    
    const selectedItems = (request as any).selectedItems;
    const allItemIds: number[] = [];
    
    // Shromáždíme všechna ID položek ze všech fází
    if (selectedItems.preparationItems) {
      allItemIds.push(...selectedItems.preparationItems);
    }
    if (selectedItems.mainItems) {
      allItemIds.push(...selectedItems.mainItems);
    }
    if (selectedItems.finishItems) {
      allItemIds.push(...selectedItems.finishItems);
    }
    
    console.log('🔍 All item IDs to load:', allItemIds);
    
    // Načteme názvy aktivit z databáze podle ID
    if (allItemIds.length > 0) {
      try {
        const { data: constructItems, error } = await supabase
          .from('construct_items')
          .select('name')
          .in('id', allItemIds);
          
        if (error) {
          console.error('❌ Error loading construct items:', error);
        } else if (constructItems && constructItems.length > 0) {
          const activityNames = constructItems.map(item => item.name);
          selectedActivities.push(...activityNames);
          console.log('✅ Loaded activity names from database:', activityNames);
        }
      } catch (dbError) {
        console.error('❌ Database error when loading activities:', dbError);
      }
    }
  }
  
  // 4. Pokud máme selectedActivitiesPhases, použijeme je jako hint
  if (request.selectedActivitiesPhases && request.selectedActivitiesPhases.length > 0) {
    console.log('📝 Selected phases:', request.selectedActivitiesPhases);
  }
  
  console.log('✅ Final extracted activities:', selectedActivities);
  return selectedActivities;
}
