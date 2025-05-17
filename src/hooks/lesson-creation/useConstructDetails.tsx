
import { useEffect } from 'react';
import { getConstructs } from '@/services/supabaseService';

export function useConstructDetails(constructId: number | null, setConstruct: (name: string) => void) {
  // Update construct name when constructId changes
  useEffect(() => {
    if (constructId) {
      getConstructName();
    }
  }, [constructId]);

  const getConstructName = async () => {
    try {
      const constructs = await getConstructs();
      const selectedConstruct = constructs.find((c: any) => c.id === constructId);
      if (selectedConstruct) {
        setConstruct(selectedConstruct.name);
      }
    } catch (error) {
      console.error('Error getting construct name:', error);
    }
  };

  return {
    getConstructName
  };
}
