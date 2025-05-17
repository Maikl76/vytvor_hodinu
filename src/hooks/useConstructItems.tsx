
import { useState, useEffect } from 'react';
import { getConstructItems, getConstructs } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { ConstructItemRow } from '@/integrations/supabase/client';

export const useConstructItems = (constructId: number | null) => {
  const [preparationItems, setPreparationItems] = useState<ConstructItemRow[]>([]);
  const [mainItems, setMainItems] = useState<ConstructItemRow[]>([]);
  const [finishItems, setFinishItems] = useState<ConstructItemRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [constructs, setConstructs] = useState<any[]>([]);
  const { toast } = useToast();

  // Load constructs
  useEffect(() => {
    const loadConstructs = async () => {
      try {
        const constructsData = await getConstructs();
        setConstructs(constructsData);
      } catch (error) {
        toast({
          title: "Chyba při načítání dat",
          description: "Nepodařilo se načíst cvičební konstrukty",
          variant: "destructive"
        });
      }
    };
    
    loadConstructs();
  }, [toast]);
  
  // Load preparation and finish items separately
  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true);
      try {
        // Load all items
        const allItems = await getConstructItems(null);
        
        // Filter items by phase
        const filteredPrepItems = allItems.filter(item => item.phase === 'preparation');
        const filteredFinishItems = allItems.filter(item => item.phase === 'finish');
        
        console.log('Loaded preparation items:', filteredPrepItems);
        console.log('Loaded finish items:', filteredFinishItems);
        
        setPreparationItems(filteredPrepItems);
        setFinishItems(filteredFinishItems);
        
      } catch (error) {
        console.error('Error loading items:', error);
        toast({
          title: "Chyba při načítání dat",
          description: "Nepodařilo se načíst cvičební položky",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadItems();
  }, [toast]);

  // When construct changes, load its main items
  useEffect(() => {
    const loadMainItems = async () => {
      if (constructId) {
        setIsLoading(true);
        try {
          const items = await getConstructItems(constructId);
          const filteredItems = items.filter(item => item.phase === 'main' || !item.phase);
          setMainItems(filteredItems);
        } catch (error) {
          console.error("Error loading main items:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMainItems([]);
      }
    };
    
    loadMainItems();
  }, [constructId]);

  return {
    preparationItems,
    mainItems,
    finishItems,
    isLoading,
    constructs
  };
};
