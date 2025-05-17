
import { useState, useEffect } from 'react';
import { 
  getConstructs, 
  getSchools, 
  getEnvironments, 
  getEquipment, 
  getRoles
} from '@/services/supabaseService';

export function useLessonResources() {
  // Data for steps
  const [schools, setSchools] = useState<any[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [constructs, setConstructs] = useState<any[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const schoolsData = await getSchools();
      const environmentsData = await getEnvironments();
      const constructsData = await getConstructs();
      const equipmentData = await getEquipment();
      const rolesData = await getRoles();
      
      setSchools(schoolsData);
      setEnvironments(environmentsData);
      setConstructs(constructsData);
      setAvailableEquipment(equipmentData);
      setRoles(rolesData);
    };
    
    loadData();
  }, []);

  return {
    schools,
    environments,
    constructs,
    availableEquipment,
    roles,
    isLoading,
    setIsLoading
  };
}
