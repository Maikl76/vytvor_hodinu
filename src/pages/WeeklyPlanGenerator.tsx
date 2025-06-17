import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import WeeklyPlanPreview from '@/components/weekly-plan/WeeklyPlanPreview';
import WeeklyPlanGenerated from '@/components/weekly-plan/WeeklyPlanGenerated';
import { getWeeklyPlanById } from '@/services/weeklyPlanService';
import { generateWeeklyPlan, generateSingleLesson } from '@/services/weekly-plan';
import { useWeeklyPlanSaver } from '@/hooks/useWeeklyPlanSaver';
import { exportWeeklyPlanToDocument } from '@/services/weekly-plan';
import { WeeklyPlanLessonData } from '@/services/weekly-plan/types';

export default function WeeklyPlanGenerator() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonsData, setLessonsData] = useState<Record<string, WeeklyPlanLessonData>>({});
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const { saveWeeklyPlanExercises, isSaving } = useWeeklyPlanSaver();

  useEffect(() => {
    const loadPlan = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const planData = await getWeeklyPlanById(id);
        setPlan(planData);
        
        // Check if plan has generated lessons by checking weekly_plan_lessons table
        // Note: weekly_plan_lessons is a separate table, not a property of the plan
        // We'll check if we have saved lessons in a different way
        const existingLessons: Record<string, WeeklyPlanLessonData> = {};
        
        // For now, we'll assume no existing lessons since the property doesn't exist
        // This will show the preview by default
        setLessonsData(existingLessons);
        setShowPreview(true);
      } catch (error) {
        console.error('Error loading plan:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlan();
  }, [id]);

  const handleStartGeneration = async () => {
    if (!id || !plan) return;

    setIsGenerating(true);
    try {
      const generatedLessons = await generateWeeklyPlan(id, plan.weeks_count, plan.lessons_per_week);
      setLessonsData(generatedLessons);
      setShowPreview(false);
    } catch (error) {
      console.error('Error generating weekly plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSingleLesson = async (week: number, lessonNumber: number) => {
    if (!id) return;

    try {
      const generatedLesson = await generateSingleLesson(id, week, lessonNumber);
      setLessonsData(prev => ({
        ...prev,
        [`${week}-${lessonNumber}`]: generatedLesson
      }));
    } catch (error) {
      console.error('Error generating single lesson:', error);
    }
  };

  const handleSavePlan = async () => {
    if (!id) return;

    const success = await saveWeeklyPlanExercises(id, lessonsData);
    if (success) {
      setSavedPlanId(id);
    }
  };

  const handleExportPlan = async () => {
    if (!plan || !lessonsData) {
      console.error('❌ Nelze exportovat - chybí data plánu nebo hodin');
      return;
    }

    try {
      console.log('📥 Začínám export plánu:', plan.title);
      console.log('📊 Data hodin pro export:', lessonsData);
      
      await exportWeeklyPlanToDocument(plan, lessonsData);
      
      console.log('✅ Export dokončen úspěšně');
    } catch (error) {
      console.error('❌ Chyba při exportu plánu:', error);
      throw error; // Necháme chybu probublat do komponenty pro zobrazení
    }
  };

  const handleBackToPreview = () => {
    setShowPreview(true);
  };

  const handleBackToCreation = () => {
    navigate('/create-weekly-plan');
  };

  const handleEditActivities = () => {
    navigate(`/create-weekly-plan?edit=${id}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-gray-600">Načítám plán...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!plan) {
    return (
      <MainLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Plán nenalezen</h1>
          <p className="text-gray-600">Požadovaný více týdenní plán neexistuje.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {showPreview ? (
        <WeeklyPlanPreview
          planData={{
            title: plan.title,
            schoolName: plan.schools?.name || 'Neznámá škola',
            grade: plan.grade,
            weeksCount: plan.weeks_count,
            lessonsPerWeek: plan.lessons_per_week,
            environmentNames: plan.weekly_plan_environments?.map((e: any) => e.environments?.name).filter(Boolean) || [],
            selectedPreparationItems: plan.weekly_plan_items?.filter((a: any) => a.phase === 'preparation').map((a: any) => ({
              id: a.construct_items?.id,
              name: a.construct_items?.name,
              description: a.construct_items?.description
            })) || [],
            selectedMainItems: plan.weekly_plan_items?.filter((a: any) => a.phase === 'main').map((a: any) => ({
              id: a.construct_items?.id,
              name: a.construct_items?.name,
              description: a.construct_items?.description
            })) || [],
            selectedFinishItems: plan.weekly_plan_items?.filter((a: any) => a.phase === 'finish').map((a: any) => ({
              id: a.construct_items?.id,
              name: a.construct_items?.name,
              description: a.construct_items?.description
            })) || [],
            equipment: plan.weekly_plan_equipment?.map((e: any) => ({
              id: e.equipment?.id,
              name: e.equipment?.name
            })) || [],
            preparationTime: plan.preparation_time,
            mainTime: plan.main_time,
            finishTime: plan.finish_time,
            preparationRole: plan.preparation_roles?.name || 'Neurčeno',
            mainRole: plan.main_roles?.name || 'Neurčeno',
            finishRole: plan.finish_roles?.name || 'Neurčeno'
          }}
          isGenerating={isGenerating}
          onGenerate={handleStartGeneration}
          onBack={handleBackToCreation}
        />
      ) : (
        <WeeklyPlanGenerated
          planTitle={plan.title}
          weeks={plan.weeks_count}
          lessonsPerWeek={plan.lessons_per_week}
          lessonsData={lessonsData}
          onSavePlan={handleSavePlan}
          onExportPlan={handleExportPlan}
          onGenerateSingleLesson={handleGenerateSingleLesson}
          isSaved={!!savedPlanId}
          savedPlanId={savedPlanId}
          onBackToPreview={handleBackToPreview}
          onEditActivities={handleEditActivities}
        />
      )}
    </MainLayout>
  );
}
