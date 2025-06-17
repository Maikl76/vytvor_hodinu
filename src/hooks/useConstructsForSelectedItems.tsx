
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useConstructsForSelectedItems(selectedItems: any) {
  const [constructs, setConstructs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadConstructs = async () => {
      if (!selectedItems) {
        setConstructs([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Získej všechna vybraná ID aktivit ze všech fází
        const allItemIds: number[] = [];
        
        if (selectedItems.preparationItems) {
          allItemIds.push(...selectedItems.preparationItems);
        }
        if (selectedItems.mainItems) {
          allItemIds.push(...selectedItems.mainItems);
        }
        if (selectedItems.finishItems) {
          allItemIds.push(...selectedItems.finishItems);
        }

        if (allItemIds.length === 0) {
          setConstructs([]);
          return;
        }

        // Načti konstrukty pro vybrané aktivity
        const { data: items, error } = await supabase
          .from('construct_items')
          .select(`
            construct:construct_id(name)
          `)
          .in('id', allItemIds);

        if (error) {
          console.error('Error loading constructs for selected items:', error);
          return;
        }

        // Extrahuj unikátní názvy konstruktů
        const uniqueConstructs: string[] = [];
        items?.forEach(item => {
          if (item.construct?.name && !uniqueConstructs.includes(item.construct.name)) {
            uniqueConstructs.push(item.construct.name);
          }
        });

        console.log('🎯 CONSTRUCTS - Loaded constructs for selected items:', uniqueConstructs);
        setConstructs(uniqueConstructs);
        
      } catch (error) {
        console.error('Error in useConstructsForSelectedItems:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConstructs();
  }, [selectedItems ? JSON.stringify(selectedItems) : null]); // Stabilní závislost

  return { constructs, isLoading };
}
