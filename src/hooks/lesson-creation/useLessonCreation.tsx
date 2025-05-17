
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLessonState } from './useLessonState';
import { useLessonResources } from './useLessonResources';
import { useStepNavigation } from './useStepNavigation';
import { useConstructDetails } from './useConstructDetails';

export function useLessonCreation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get state, resources and navigation hooks
  const lessonState = useLessonState();
  const resources = useLessonResources();
  const navigation = useStepNavigation();
  
  // Get construct details
  useConstructDetails(lessonState.constructId, lessonState.setConstruct);

  const handleCreate = async () => {
    if (!lessonState.schoolId || !lessonState.environmentId) {
      toast({
        title: "Neúplná data",
        description: "Prosím vyplňte všechny povinné údaje (škola a prostředí)",
        variant: "destructive"
      });
      return;
    }
    
    resources.setIsLoading(true);
    
    try {
      // Get role names
      const prepRoleName = lessonState.preparationRoleId 
        ? resources.roles.find((r: any) => r.id === lessonState.preparationRoleId)?.name || ''
        : '';
      const mainRoleName = lessonState.mainRoleId
        ? resources.roles.find((r: any) => r.id === lessonState.mainRoleId)?.name || ''
        : '';
      const finishRoleName = lessonState.finishRoleId
        ? resources.roles.find((r: any) => r.id === lessonState.finishRoleId)?.name || ''
        : '';

      // Create a combined array of all selected items for all phases (for backward compatibility)
      const allSelectedItems = [
        ...lessonState.selectedItems.preparationItems,
        ...lessonState.selectedItems.mainItems,
        ...lessonState.selectedItems.finishItems
      ];
      
      // Get the school and environment names
      const school = resources.schools.find(s => s.id === lessonState.schoolId)?.name || '';
      const environment = resources.environments.find(e => e.id === lessonState.environmentId)?.name || '';
      
      // Get the construct name if a construct is selected
      const constructName = lessonState.constructId 
        ? lessonState.construct
        : '';

      // Prepare the lesson data
      const lessonData = {
        schoolId: lessonState.schoolId,
        environmentId: lessonState.environmentId,
        school: school,
        environment: environment,
        constructId: lessonState.constructId,
        preparationTime: lessonState.preparationTime,
        mainTime: lessonState.mainTime,
        finishTime: lessonState.finishTime,
        preparationRoleId: lessonState.preparationRoleId,
        mainRoleId: lessonState.mainRoleId,
        finishRoleId: lessonState.finishRoleId,
        preparationRole: prepRoleName,
        mainRole: mainRoleName,
        finishRole: finishRoleName,
        construct: constructName,
        equipment: lessonState.equipment,
        grade: lessonState.grade,
        // Include separate item arrays for each phase
        selectedItems: {
          preparationItems: lessonState.selectedItems.preparationItems,
          mainItems: lessonState.selectedItems.mainItems,
          finishItems: lessonState.selectedItems.finishItems
        },
        // Add the combined array for backward compatibility
        constructItems: allSelectedItems
      };
      
      console.log("Navigating to preview with lesson data:", lessonData);
      
      // Navigate to preview with all data
      navigate('/preview-lesson', { state: { lessonData } });
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast({
        title: "Chyba",
        description: "Nastala chyba při vytváření hodiny",
        variant: "destructive"
      });
    } finally {
      resources.setIsLoading(false);
    }
  };

  return {
    // Step navigation
    currentStep: navigation.currentStep,
    setCurrentStep: navigation.setCurrentStep,
    nextStep: navigation.nextStep,
    prevStep: navigation.prevStep,
    
    // Lesson state
    ...lessonState,
    
    // Resources
    ...resources,
    
    // Actions
    handleCreate
  };
}
