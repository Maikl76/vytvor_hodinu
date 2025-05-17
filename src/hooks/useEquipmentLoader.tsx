
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getEquipment } from '@/services/supabaseService';

export function useEquipmentLoader() {
  const { toast } = useToast();
  const [equipmentNames, setEquipmentNames] = useState<string[]>([]);

  /**
   * Load equipment names from IDs
   */
  const loadEquipmentNames = async (equipmentIds: number[]) => {
    if (Array.isArray(equipmentIds) && equipmentIds.length > 0) {
      try {
        // Get all equipment and filter by IDs we have
        const allEquipment = await getEquipment();
        
        // Check if allEquipment is a valid array before proceeding
        if (!Array.isArray(allEquipment) || 'error' in allEquipment) {
          console.error("Failed to load equipment:", allEquipment);
          setEquipmentNames([]);
          return;
        }
        
        const equipItems = allEquipment.filter(item => equipmentIds.includes(item.id));
        const names = equipItems.map(item => item?.name || '').filter(Boolean);
        setEquipmentNames(names);
      } catch (error) {
        console.error("Error loading equipment:", error);
        setEquipmentNames([]);
      }
    } else {
      setEquipmentNames([]);
    }
  };

  return {
    equipmentNames,
    setEquipmentNames,
    loadEquipmentNames
  };
}
