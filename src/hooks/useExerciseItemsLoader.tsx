
import { useState } from 'react';
import { getConstructItems, getConstructs } from '@/services/supabaseService';
import { createDefaultExerciseForPhase } from '@/utils/exerciseItemUtils';

export function useExerciseItemsLoader() {
  
  const loadAllPhaseItems = async () => {
    try {
      console.log("🔧 ITEM LOADER - Loading all phase items...");
      
      // Load items for preparation and finish phases (these are not construct-specific)
      const [preparationItemsResult, finishItemsResult] = await Promise.all([
        getConstructItems(null, 'preparation'),
        getConstructItems(null, 'finish')
      ]);
      
      console.log("🔧 ITEM LOADER - Loaded phase items:", {
        preparation: preparationItemsResult?.length || 0,
        finish: finishItemsResult?.length || 0
      });
      
      return {
        preparationItems: preparationItemsResult || [],
        mainItems: [], // Main items are construct-specific, not loaded here
        finishItems: finishItemsResult || []
      };
    } catch (error) {
      console.error("🔧 ITEM LOADER - Error loading phase items:", error);
      return {
        preparationItems: [],
        mainItems: [],
        finishItems: []
      };
    }
  };

  const loadPhaseItems = async (
    selectedItemIds: number[],
    availableItems: any[],
    totalTime: number,
    phase: 'preparation' | 'main' | 'finish'
  ) => {
    console.log(`🔧 ITEM LOADER - Loading ${phase} items with:`, {
      selectedItemIds,
      availableItemsCount: availableItems.length,
      totalTime
    });

    if (!selectedItemIds || selectedItemIds.length === 0) {
      console.log(`🔧 ITEM LOADER - No ${phase} items selected, creating default`);
      return [createDefaultExerciseForPhase(phase, totalTime)];
    }

    try {
      // Find selected items from available items
      const selectedItems = availableItems.filter(item => 
        selectedItemIds.includes(item.id)
      );
      
      console.log(`🔧 ITEM LOADER - Found ${selectedItems.length} ${phase} items from ${selectedItemIds.length} selected IDs`);

      if (selectedItems.length === 0) {
        console.warn(`🔧 ITEM LOADER - No ${phase} items found for IDs:`, selectedItemIds);
        return [createDefaultExerciseForPhase(phase, totalTime)];
      }

      // Calculate time distribution
      const timePerExercise = Math.floor(totalTime / selectedItems.length);
      const remainingTime = totalTime % selectedItems.length;

      const exercises = selectedItems.map((item, index) => ({
        name: item.name,
        description: item.description || '',
        time: timePerExercise + (index < remainingTime ? 1 : 0)
      }));

      console.log(`🔧 ITEM LOADER - Generated ${phase} exercises:`, exercises);
      return exercises;
      
    } catch (error) {
      console.error(`🔧 ITEM LOADER - Error loading ${phase} items:`, error);
      return [createDefaultExerciseForPhase(phase, totalTime)];
    }
  };

  // OPRAVENÁ funkce pro načtení hlavních aktivit ze VŠECH konstruktů
  const loadMainItemsByConstructAndIds = async (
    constructId: number | null,
    selectedItemIds: number[],
    totalTime: number
  ) => {
    console.log(`🔧 ITEM LOADER - Loading main items for selected IDs:`, selectedItemIds);
    
    if (!selectedItemIds || selectedItemIds.length === 0) {
      console.log(`🔧 ITEM LOADER - No main items selected, creating default`);
      return [createDefaultExerciseForPhase('main', totalTime)];
    }

    try {
      // KLÍČOVÁ OPRAVA: Načteme VŠECHNY konstrukty a pak jejich položky
      console.log(`🔧 ITEM LOADER - Loading all constructs first, then their items`);
      
      const constructs = await getConstructs();
      console.log(`🔧 ITEM LOADER - Found ${constructs.length} constructs`);
      
      let allItems = [];
      
      // Načteme položky ze všech konstruktů
      for (const construct of constructs) {
        try {
          const constructItems = await getConstructItems(construct.id);
          console.log(`🔧 ITEM LOADER - Loaded ${constructItems.length} items from construct ${construct.name} (ID: ${construct.id})`);
          allItems.push(...constructItems);
        } catch (error) {
          console.error(`🔧 ITEM LOADER - Error loading items for construct ${construct.id}:`, error);
        }
      }
      
      console.log(`🔧 ITEM LOADER - Total loaded items from all constructs: ${allItems.length}`);
      console.log(`🔧 ITEM LOADER - All loaded items:`, allItems.map(item => ({ id: item.id, name: item.name, constructId: item.construct_id })));
      
      // Najdeme vybrané položky podle ID
      const selectedItems = allItems.filter(item => 
        selectedItemIds.includes(item.id)
      );
      
      console.log(`🔧 ITEM LOADER - Found ${selectedItems.length} selected main items:`, selectedItems);

      if (selectedItems.length === 0) {
        console.warn(`🔧 ITEM LOADER - No main items found for IDs:`, selectedItemIds);
        console.warn(`🔧 ITEM LOADER - Available item IDs:`, allItems.map(item => item.id));
        return [createDefaultExerciseForPhase('main', totalTime)];
      }

      // Calculate time distribution
      const timePerExercise = Math.floor(totalTime / selectedItems.length);
      const remainingTime = totalTime % selectedItems.length;

      const exercises = selectedItems.map((item, index) => ({
        name: item.name,
        description: item.description || '',
        time: timePerExercise + (index < remainingTime ? 1 : 0)
      }));

      console.log(`🔧 ITEM LOADER - Generated main exercises from multiple constructs:`, exercises);
      return exercises;
      
    } catch (error) {
      console.error(`🔧 ITEM LOADER - Error loading main items:`, error);
      return [createDefaultExerciseForPhase('main', totalTime)];
    }
  };

  return {
    loadPhaseItems,
    loadAllPhaseItems,
    loadMainItemsByConstructAndIds
  };
}
