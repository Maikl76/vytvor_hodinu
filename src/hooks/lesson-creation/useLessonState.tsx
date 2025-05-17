
import { useState } from 'react';

export interface LessonState {
  schoolId: number | null;
  environmentId: number | null;
  constructId: number | null;
  construct: string;
  equipment: number[];
  grade: number;
  preparationTime: number;
  mainTime: number;
  finishTime: number;
  preparationRoleId: number | null;
  mainRoleId: number | null;
  finishRoleId: number | null;
  selectedItems: {
    preparationItems: number[];
    mainItems: number[];
    finishItems: number[];
  };
}

export function useLessonState() {
  // School related state
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [grade, setGrade] = useState<number>(1);
  
  // Environment state
  const [environmentId, setEnvironmentId] = useState<number | null>(null);
  
  // Construct state
  const [constructId, setConstructId] = useState<number | null>(null);
  const [construct, setConstruct] = useState<string>('');
  
  // Equipment state
  const [equipment, setEquipment] = useState<number[]>([]);
  
  // Time values (in minutes)
  const [preparationTime, setPreparationTime] = useState(10);
  const [mainTime, setMainTime] = useState(25);
  const [finishTime, setFinishTime] = useState(10);
  
  // Teacher role IDs
  const [preparationRoleId, setPreparationRoleId] = useState<number | null>(null);
  const [mainRoleId, setMainRoleId] = useState<number | null>(null);
  const [finishRoleId, setFinishRoleId] = useState<number | null>(null);
  
  // Selected items for each phase
  const [selectedItems, setSelectedItems] = useState({
    preparationItems: [] as number[],
    mainItems: [] as number[],
    finishItems: [] as number[]
  });

  // Reset all data
  const resetData = () => {
    setSchoolId(null);
    setEnvironmentId(null);
    setConstructId(null);
    setConstruct('');
    setEquipment([]);
    setGrade(1);
    setPreparationTime(10);
    setMainTime(25);
    setFinishTime(10);
    setPreparationRoleId(null);
    setMainRoleId(null);
    setFinishRoleId(null);
    setSelectedItems({
      preparationItems: [],
      mainItems: [],
      finishItems: []
    });
  };

  return {
    // State values
    schoolId,
    environmentId,
    constructId,
    construct,
    equipment,
    grade,
    preparationTime,
    mainTime,
    finishTime,
    preparationRoleId,
    mainRoleId,
    finishRoleId,
    selectedItems,
    
    // State setters
    setSchoolId,
    setEnvironmentId,
    setConstructId,
    setConstruct,
    setEquipment,
    setGrade,
    setPreparationTime,
    setMainTime,
    setFinishTime,
    setPreparationRoleId,
    setMainRoleId,
    setFinishRoleId,
    setSelectedItems,
    
    // Utility functions
    resetData
  };
}
