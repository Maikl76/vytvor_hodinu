
import { useState, useEffect } from 'react';
import { 
  getConstructs, 
  getSchools, 
  getEnvironments, 
  getEquipment, 
  getRoles
} from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

export function useLessonResources() {
  // Data for steps
  const [schools, setSchools] = useState<any[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [constructs, setConstructs] = useState<any[]>([]);
  const [constructItems, setConstructItems] = useState<any[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load construct items
  const loadConstructItems = async () => {
    try {
      const { data, error } = await supabase
        .from('construct_items')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error loading construct items:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error loading construct items:', error);
      return [];
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const schoolsData = await getSchools();
      const environmentsData = await getEnvironments();
      const constructsData = await getConstructs();
      const constructItemsData = await loadConstructItems();
      const equipmentData = await getEquipment();
      const rolesData = await getRoles();
      
      setSchools(schoolsData);
      setEnvironments(environmentsData);
      setConstructs(constructsData);
      setConstructItems(constructItemsData);
      setAvailableEquipment(equipmentData);
      setRoles(rolesData);
    };
    
    loadData();
  }, []);

  return {
    schools,
    environments,
    constructs,
    constructItems,
    availableEquipment,
    roles,
    isLoading,
    setIsLoading
  };
}
