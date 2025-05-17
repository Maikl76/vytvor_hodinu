
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getConstructItems } from '@/services/supabaseService';
import { ExerciseItem } from '@/components/lesson-preview/ExerciseSection';
import { generateExercisesFromItems, createDefaultExerciseForPhase } from '@/utils/exerciseItemUtils';

export function useExerciseItemsLoader() {
  const { toast } = useToast();
  
  /**
   * Load and process items for a specific phase
   */
  const loadPhaseItems = async (
    phaseItemIds: number[], 
    allPhaseItems: any[] | null,
    phaseTime: number,
    phaseName: 'preparation' | 'main' | 'finish'
  ): Promise<ExerciseItem[]> => {
    // Log for debugging
    console.log(`Loading ${phaseName} items:`, { phaseItemIds, phaseTime });
    
    // If no items are selected, return default exercise
    if (!phaseItemIds || phaseItemIds.length === 0) {
      console.log(`No ${phaseName} items selected, using default`);
      return [createDefaultExerciseForPhase(phaseName, phaseTime)];
    }
    
    try {
      // Always fetch fresh data from the database
      const allItems = await getConstructItems(null, phaseName);
      console.log(`Loaded ${allItems?.length || 0} ${phaseName} items from database`);
      
      if (!Array.isArray(allItems) || allItems.length === 0) {
        console.log(`No ${phaseName} items available in database, using default`);
        return [createDefaultExerciseForPhase(phaseName, phaseTime)];
      }
      
      // Filter items by selected IDs
      const selectedItems = allItems.filter(item => phaseItemIds.includes(item.id));
      
      console.log(`Selected ${phaseName} items after filtering:`, selectedItems);
      
      // If no items were found after filtering, use default
      if (!selectedItems.length) {
        console.log(`No matching ${phaseName} items found, using default`);
        return [createDefaultExerciseForPhase(phaseName, phaseTime)];
      }
      
      // Generate exercises from selected items
      const exercises = generateExercisesFromItems(
        selectedItems, 
        phaseTime
      );
      
      console.log(`Generated ${phaseName} exercises:`, exercises);
      
      return exercises;
    } catch (error) {
      console.error(`Error loading ${phaseName} items:`, error);
      return [createDefaultExerciseForPhase(phaseName, phaseTime)];
    }
  };

  /**
   * Load all items for all phases
   */
  const loadAllPhaseItems = async () => {
    try {
      // Load all items regardless of construct for each phase
      const preparationItems = await getConstructItems(null, 'preparation');
      const mainItems = await getConstructItems(null, 'main');
      const finishItems = await getConstructItems(null, 'finish');
      
      console.log("Loaded all phase items:", {
        preparationItems: preparationItems?.length || 0,
        mainItems: mainItems?.length || 0,
        finishItems: finishItems?.length || 0
      });
      
      return {
        preparationItems: Array.isArray(preparationItems) ? preparationItems : [],
        mainItems: Array.isArray(mainItems) ? mainItems : [],
        finishItems: Array.isArray(finishItems) ? finishItems : []
      };
    } catch (error) {
      console.error("Error loading phase items:", error);
      toast({
        title: "Error loading items",
        description: "Could not load exercise items. Default exercises will be used.",
        variant: "destructive"
      });
      
      return {
        preparationItems: [],
        mainItems: [],
        finishItems: []
      };
    }
  };

  return {
    loadPhaseItems,
    loadAllPhaseItems
  };
}
