
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
    console.log("🎯 useLessonCreation - handleCreate zavoláno");
    console.log("🎯 useLessonCreation - lessonState:", lessonState);
    
    if (!lessonState.title.trim()) {
      console.log("🎯 useLessonCreation - Chybí název hodiny");
      toast({
        title: "Neúplná data",
        description: "Prosím zadejte název hodiny",
        variant: "destructive"
      });
      return;
    }

    if (!lessonState.schoolId || !lessonState.environmentId) {
      console.log("🎯 useLessonCreation - Chybí škola nebo prostředí");
      toast({
        title: "Neúplná data",
        description: "Prosím vyplňte všechny povinné údaje (škola a prostředí)",
        variant: "destructive"
      });
      return;
    }
    
    console.log("🎯 useLessonCreation - Nastavuji loading na true");
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
      
      // Get construct name - prioritize construct from state, then try to find by construct_id from main items
      let constructName = lessonState.construct;
      
      if (!constructName && lessonState.selectedItems.mainItems.length > 0) {
        // Try to find construct from the first main item
        const firstMainItemId = lessonState.selectedItems.mainItems[0];
        const firstMainItem = resources.constructItems.find(item => item.id === firstMainItemId);
        if (firstMainItem && firstMainItem.construct_id) {
          const foundConstruct = resources.constructs.find(c => c.id === firstMainItem.construct_id);
          constructName = foundConstruct?.name || '';
        }
      }
      
      // Fallback to constructId if we still don't have a name
      if (!constructName && lessonState.constructId) {
        const foundConstruct = resources.constructs.find(c => c.id === lessonState.constructId);
        constructName = foundConstruct?.name || '';
      }

      console.log("Construct info:", {
        constructId: lessonState.constructId,
        constructFromState: lessonState.construct,
        constructName,
        mainItems: lessonState.selectedItems.mainItems,
        availableConstructs: resources.constructs,
        availableConstructItems: resources.constructItems
      });

      // Prepare the lesson data
      const lessonData = {
        title: lessonState.title,
        schoolId: lessonState.schoolId,
        environmentId: lessonState.environmentId,
        school: school,
        environment: environment,
        constructId: lessonState.constructId,
        construct: constructName, // Make sure construct name is included
        preparationTime: lessonState.preparationTime,
        mainTime: lessonState.mainTime,
        finishTime: lessonState.finishTime,
        preparationRoleId: lessonState.preparationRoleId,
        mainRoleId: lessonState.mainRoleId,
        finishRoleId: lessonState.finishRoleId,
        preparationRole: prepRoleName,
        mainRole: mainRoleName,
        finishRole: finishRoleName,
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
      
      console.log("🎯 useLessonCreation - Navigating to preview with lesson data:", lessonData);
      
      navigate('/preview-lesson', { state: { lessonData } });
    } catch (error) {
      console.error('🎯 useLessonCreation - Error creating lesson:', error);
      toast({
        title: "Chyba",
        description: "Nastala chyba při vytváření hodiny",
        variant: "destructive"
      });
    } finally {
      console.log("🎯 useLessonCreation - Nastavuji loading na false");
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
