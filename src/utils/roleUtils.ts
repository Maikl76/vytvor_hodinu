
import { RoleType } from "@/integrations/supabase/client";

/**
 * Gets a safe role object from a potentially null or invalid role input
 */
export const getSafeRole = (role: any): RoleType => {
  const defaultRole: RoleType = { id: undefined, name: '' };
  
  if (role === null || typeof role !== 'object' || !('name' in role)) {
    return defaultRole;
  }
  
  return role;
};

/**
 * Extracts all roles from a lesson history record
 */
export const extractRolesFromLesson = (historyLesson: any): { 
  prepRole: RoleType, 
  mainRole: RoleType, 
  finishRole: RoleType 
} => {
  return {
    prepRole: getSafeRole(historyLesson.preparation_role),
    mainRole: getSafeRole(historyLesson.main_role),
    finishRole: getSafeRole(historyLesson.finish_role)
  };
};
