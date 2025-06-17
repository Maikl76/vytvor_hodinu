import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import WeeklyPlanCreationContainer from '@/components/weekly-plan/WeeklyPlanCreationContainer';
import { useLessonResources } from '@/hooks/lesson-creation/useLessonResources';
import { useToast } from '@/hooks/use-toast';
import { createWeeklyPlan } from '@/services/weeklyPlanService';

const CreateWeeklyPlan: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const editPlanId = searchParams.get('edit');
  
  const { schools, environments, constructs, availableEquipment, roles, isLoading, setIsLoading } = useLessonResources();
  
  const [currentStep, setCurrentStep] = useState(editPlanId ? 3 : 1); // Začneme na kroku 3 (přípravná část) při editaci
  const [title, setTitle] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [grade, setGrade] = useState<number>(5);
  const [selectedEnvironments, setSelectedEnvironments] = useState<number[]>([]);
  const [preparationItems, setPreparationItems] = useState<number[]>([]);
  const [mainItems, setMainItems] = useState<number[]>([]);
  const [finishItems, setFinishItems] = useState<number[]>([]);
  const [equipment, setEquipment] = useState<number[]>([]);
  const [preparationTime, setPreparationTime] = useState<number>(10);
  const [mainTime, setMainTime] = useState<number>(25);
  const [finishTime, setFinishTime] = useState<number>(10);
  const [preparationRoleId, setPreparationRoleId] = useState<number | null>(null);
  const [mainRoleId, setMainRoleId] = useState<number | null>(null);
  const [finishRoleId, setFinishRoleId] = useState<number | null>(null);
  const [weeksCount, setWeeksCount] = useState<number>(4);
  const [lessonsPerWeek, setLessonsPerWeek] = useState<number>(2);
  
  // Načtení dat existujícího plánu při editaci
  useEffect(() => {
    const loadPlanForEdit = async () => {
      if (!editPlanId) return;
      
      try {
        setIsLoading(true);
        const { getWeeklyPlanById } = await import('@/services/weeklyPlanService');
        const planData = await getWeeklyPlanById(editPlanId);
        
        if (planData) {
          console.log("📋 Načítám plán pro editaci:", planData);
          
          // Naplnění formuláře existujícími daty
          setTitle(planData.title);
          setSchoolId(planData.school_id);
          setGrade(planData.grade);
          setSelectedEnvironments(planData.weekly_plan_environments?.map((e: any) => e.environment_id) || []);
          
          // OPRAVA: Správné načítání aktivit z weekly_plan_items s item_id
          setPreparationItems(planData.weekly_plan_items?.filter((a: any) => a.phase === 'preparation').map((a: any) => a.item_id) || []);
          setMainItems(planData.weekly_plan_items?.filter((a: any) => a.phase === 'main').map((a: any) => a.item_id) || []);
          setFinishItems(planData.weekly_plan_items?.filter((a: any) => a.phase === 'finish').map((a: any) => a.item_id) || []);
          
          setEquipment(planData.weekly_plan_equipment?.map((e: any) => e.equipment_id) || []);
          setPreparationTime(planData.preparation_time);
          setMainTime(planData.main_time);
          setFinishTime(planData.finish_time);
          setPreparationRoleId(planData.preparation_role_id);
          setMainRoleId(planData.main_role_id);
          setFinishRoleId(planData.finish_role_id);
          setWeeksCount(planData.weeks_count);
          setLessonsPerWeek(planData.lessons_per_week);
          
          console.log("📋 Načtené aktivity:", {
            preparation: planData.weekly_plan_items?.filter((a: any) => a.phase === 'preparation').map((a: any) => a.item_id),
            main: planData.weekly_plan_items?.filter((a: any) => a.phase === 'main').map((a: any) => a.item_id),
            finish: planData.weekly_plan_items?.filter((a: any) => a.phase === 'finish').map((a: any) => a.item_id)
          });
          
          toast({
            title: "Plán načten",
            description: "Data existujícího plánu byla načtena pro úpravu.",
          });
        }
      } catch (error) {
        console.error("❌ Chyba při načítání plánu:", error);
        toast({
          title: "Chyba",
          description: "Nepodařilo se načíst plán pro úpravu",
          variant: "destructive"
        });
        navigate('/create-weekly-plan'); // Přesměrování na nový plán při chybě
      } finally {
        setIsLoading(false);
      }
    };

    loadPlanForEdit();
  }, [editPlanId, toast, navigate, setIsLoading]);
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleCreatePlan = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Začínám vytváření/úpravu plánu s daty:', {
        title,
        schoolId,
        grade,
        environments: selectedEnvironments,
        preparationItems,
        mainItems,
        finishItems,
        equipment,
        preparationTime,
        mainTime,
        finishTime,
        preparationRoleId,
        mainRoleId,
        finishRoleId,
        weeksCount,
        lessonsPerWeek,
        editMode: !!editPlanId
      });
      
      const planData = {
        title,
        schoolId,
        grade,
        environments: selectedEnvironments,
        preparationItems,
        mainItems,
        finishItems,
        equipment,
        preparationTime,
        mainTime,
        finishTime,
        preparationRoleId,
        mainRoleId,
        finishRoleId,
        weeksCount,
        lessonsPerWeek
      };
      
      try {
        let createdPlan;
        
        if (editPlanId) {
          // Úprava existujícího plánu
          const { updateWeeklyPlan } = await import('@/services/weeklyPlanService');
          createdPlan = await updateWeeklyPlan(editPlanId, planData);
          console.log("✅ Plán byl úspěšně upraven:", createdPlan);
        } else {
          // Vytvoření nového plánu
          const { createWeeklyPlan } = await import('@/services/weeklyPlanService');
          createdPlan = await createWeeklyPlan(planData);
          console.log("✅ Plán byl úspěšně vytvořen:", createdPlan);
        }
        
        if (createdPlan) {
          toast({
            title: editPlanId ? "Plán upraven" : "Plán vytvořen",
            description: editPlanId ? "Více týdenní plán byl úspěšně upraven." : "Více týdenní plán byl úspěšně vytvořen.",
          });
          // Oprava přesměrování na správnou cestu
          navigate(`/weekly-plan-generator/${editPlanId || createdPlan.id}`);
        } else {
          throw new Error("Nepodařilo se vytvořit/upravit více týdenní plán");
        }
      } catch (error: any) {
        console.error("❌ Error creating/updating weekly plan:", error);
        toast({
          title: editPlanId ? "Chyba při úpravě plánu" : "Chyba při vytváření plánu",
          description: error.message || "Nepodařilo se vytvořit/upravit více týdenní plán. Zkuste to prosím znovu.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <WeeklyPlanCreationContainer
        currentStep={currentStep}
        planState={{
          title,
          schoolId,
          grade,
          environments: selectedEnvironments,
          preparationItems,
          mainItems,
          finishItems,
          equipment,
          preparationTime,
          mainTime,
          finishTime,
          preparationRoleId,
          mainRoleId,
          finishRoleId,
          weeksCount,
          lessonsPerWeek
        }}
        resources={{
          schools,
          environments,
          constructs,
          availableEquipment,
          roles
        }}
        handlers={{
          setTitle,
          setSchoolId,
          setGrade,
          setEnvironments: setSelectedEnvironments,
          setPreparationItems,
          setMainItems,
          setFinishItems,
          setEquipment,
          setPreparationTime,
          setMainTime,
          setFinishTime,
          setPreparationRoleId,
          setMainRoleId,
          setFinishRoleId,
          setWeeksCount,
          setLessonsPerWeek,
          nextStep,
          prevStep,
          handleCreate: handleCreatePlan
        }}
        isLoading={isLoading}
      />
    </MainLayout>
  );
};

export default CreateWeeklyPlan;
