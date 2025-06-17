
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWeeklyPlanById } from '@/services/weeklyPlanService';

interface ActivityItem {
  id?: number;
  name: string;
  description?: string;
  duration?: number;
}

interface WeeklyPlanPreviewProps {
  planData: {
    title: string;
    schoolName: string;
    grade: number;
    weeksCount: number;
    lessonsPerWeek: number;
    environmentNames: string[];
    selectedPreparationItems: ActivityItem[];
    selectedMainItems: ActivityItem[];
    selectedFinishItems: ActivityItem[];
    equipment: any[];
    preparationTime: number;
    mainTime: number;
    finishTime: number;
    preparationRole: string;
    mainRole: string;
    finishRole: string;
  };
  isGenerating: boolean;
  onGenerate: () => void;
  onBack: () => void;
}

const WeeklyPlanPreview: React.FC<WeeklyPlanPreviewProps> = ({
  planData: initialPlanData,
  isGenerating,
  onGenerate,
  onBack
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [planData, setPlanData] = useState(initialPlanData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Znovu načteme data při mount komponenty pro případ, že se vrátíme z editace
  useEffect(() => {
    const refreshPlanData = async () => {
      if (!id) return;
      
      try {
        setIsRefreshing(true);
        const updatedPlan = await getWeeklyPlanById(id);
        
        const refreshedPlanData = {
          title: updatedPlan.title,
          schoolName: updatedPlan.schools?.name || 'Neznámá škola',
          grade: updatedPlan.grade,
          weeksCount: updatedPlan.weeks_count,
          lessonsPerWeek: updatedPlan.lessons_per_week,
          environmentNames: updatedPlan.weekly_plan_environments?.map((e: any) => e.environments?.name).filter(Boolean) || [],
          
          // OPRAVA: Správné načítání aktivit pomocí construct_items relace přes item_id
          selectedPreparationItems: updatedPlan.weekly_plan_items?.filter((a: any) => a.phase === 'preparation').map((a: any) => ({
            id: a.item_id,
            name: a.construct_items?.name || 'Neznámá aktivita',
            description: a.construct_items?.description
          })) || [],
          selectedMainItems: updatedPlan.weekly_plan_items?.filter((a: any) => a.phase === 'main').map((a: any) => ({
            id: a.item_id,
            name: a.construct_items?.name || 'Neznámá aktivita',
            description: a.construct_items?.description
          })) || [],
          selectedFinishItems: updatedPlan.weekly_plan_items?.filter((a: any) => a.phase === 'finish').map((a: any) => ({
            id: a.item_id,
            name: a.construct_items?.name || 'Neznámá aktivita',
            description: a.construct_items?.description
          })) || [],
          
          equipment: updatedPlan.weekly_plan_equipment?.map((e: any) => ({
            id: e.equipment?.id,
            name: e.equipment?.name
          })) || [],
          preparationTime: updatedPlan.preparation_time,
          mainTime: updatedPlan.main_time,
          finishTime: updatedPlan.finish_time,
          preparationRole: updatedPlan.preparation_roles?.name || 'Neurčeno',
          mainRole: updatedPlan.main_roles?.name || 'Neurčeno',
          finishRole: updatedPlan.finish_roles?.name || 'Neurčeno'
        };
        
        setPlanData(refreshedPlanData);
        console.log('🔄 Data plánu aktualizována:', refreshedPlanData);
        console.log('🎭 REFRESH - Aktivity po načtení:', {
          preparation: refreshedPlanData.selectedPreparationItems,
          main: refreshedPlanData.selectedMainItems,
          finish: refreshedPlanData.selectedFinishItems
        });
      } catch (error) {
        console.error('❌ Chyba při aktualizaci dat plánu:', error);
        // Fallback na původní data
        setPlanData(initialPlanData);
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshPlanData();
  }, [id, initialPlanData]);

  const totalTime = planData.preparationTime + planData.mainTime + planData.finishTime;
  const totalLessons = planData.weeksCount * planData.lessonsPerWeek;
  
  console.log('🎭 PREVIEW ZOBRAZUJE AKTIVITY:', {
    preparation: planData.selectedPreparationItems,
    main: planData.selectedMainItems,
    finish: planData.selectedFinishItems
  });

  const handleBackToCreation = () => {
    // Oprava: Přesměrování na úpravu stávajícího plánu místo vytvoření nového
    if (id) {
      navigate(`/create-weekly-plan?edit=${id}`);
    } else {
      navigate('/create-weekly-plan');
    }
  };
  
  if (isRefreshing) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
            <p className="mt-2 text-gray-600">Aktualizuji data plánu...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{planData.title}</h1>
        <p className="text-gray-600">
          Náhled více týdenního plánu před vygenerováním
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Základní údaje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Škola</h3>
              <p>{planData.schoolName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ročník</h3>
              <p>{planData.grade}. ročník</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Počet týdnů</h3>
              <p>{planData.weeksCount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Hodin týdně</h3>
              <p>{planData.lessonsPerWeek}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Celkem hodin</h3>
              <p>{totalLessons}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prostředí</h3>
              <p>{planData.environmentNames.join(', ') || 'Neurčeno'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Časové rozložení hodiny</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-1">Přípravná část</h3>
              <p className="text-sm text-gray-600">{planData.preparationTime} minut</p>
              <p className="text-xs text-gray-500 mt-2">
                Role: {planData.preparationRole || 'Neurčeno'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-medium mb-1">Hlavní část</h3>
              <p className="text-sm text-gray-600">{planData.mainTime} minut</p>
              <p className="text-xs text-gray-500 mt-2">
                Role: {planData.mainRole || 'Neurčeno'}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md">
              <h3 className="font-medium mb-1">Závěrečná část</h3>
              <p className="text-sm text-gray-600">{planData.finishTime} minut</p>
              <p className="text-xs text-gray-500 mt-2">
                Role: {planData.finishRole || 'Neurčeno'}
              </p>
            </div>
          </div>
          <div className="mt-2 p-2 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">Celkový čas hodiny: {totalTime} minut</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Vybrané aktivity pro AI generování</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> Po vygenerování první hodiny můžete kdykoliv upravit vybrané aktivity 
              pomocí tlačítka "Upravit aktivity pro AI", což vám umožní vytvořit více rozmanitý plán.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2 text-blue-700">Přípravná část</h3>
              {planData.selectedPreparationItems && planData.selectedPreparationItems.length > 0 ? (
                <div className="space-y-2">
                  {planData.selectedPreparationItems.slice(0, 5).map((item, index) => (
                    <div key={`prep-${item.id || index}`} className="bg-blue-50 p-2 rounded-md">
                      <div className="font-medium text-sm">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                      )}
                    </div>
                  ))}
                  {planData.selectedPreparationItems.length > 5 && (
                    <div className="text-xs text-gray-500">
                      a další {planData.selectedPreparationItems.length - 5} aktivit...
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                  ⚠️ Žádné vybrané aktivity - AI použije výchozí role
                </p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-green-700">Hlavní část</h3>
              {planData.selectedMainItems && planData.selectedMainItems.length > 0 ? (
                <div className="space-y-2">
                  {planData.selectedMainItems.slice(0, 5).map((item, index) => (
                    <div key={`main-${item.id || index}`} className="bg-green-50 p-2 rounded-md">
                      <div className="font-medium text-sm">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                      )}
                    </div>
                  ))}
                  {planData.selectedMainItems.length > 5 && (
                    <div className="text-xs text-gray-500">
                      a další {planData.selectedMainItems.length - 5} aktivit...
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                  ⚠️ Žádné vybrané aktivity - AI použije výchozí role
                </p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-yellow-700">Závěrečná část</h3>
              {planData.selectedFinishItems && planData.selectedFinishItems.length > 0 ? (
                <div className="space-y-2">
                  {planData.selectedFinishItems.slice(0, 5).map((item, index) => (
                    <div key={`finish-${item.id || index}`} className="bg-yellow-50 p-2 rounded-md">
                      <div className="font-medium text-sm">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-600 mt-1">{item.description}</div>
                      )}
                    </div>
                  ))}
                  {planData.selectedFinishItems.length > 5 && (
                    <div className="text-xs text-gray-500">
                      a další {planData.selectedFinishItems.length - 5} aktivit...
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                  ⚠️ Žádné vybrané aktivity - AI použije výchozí role
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {planData.equipment.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vybrané vybavení</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {planData.equipment.map((item, index) => (
                <span 
                  key={`eq-${index}`}
                  className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-green-50 p-4 rounded-md mb-6 border border-green-200">
        <h3 className="font-medium text-green-800 mb-2">🤖 AI Generování</h3>
        <p className="text-green-700 text-sm mb-2">
          Po kliknutí na "Vygenerovat plán" bude AI využívat výše vybrané aktivity a vybavení 
          k vytvoření konkrétních cvičení pro každou hodinu. Groq AI model bude volán pro každou 
          jednotlivou hodinu samostatně.
        </p>
        <p className="text-green-700 text-sm">
          <strong>Možnost úprav:</strong> Po vygenerování první hodiny budete moci kdykoliv upravit 
          vybrané aktivity pro další generování, což zajistí větší rozmanitost plánu.
        </p>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleBackToCreation}>
          Zpět k úpravám
        </Button>
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generuji plán pomocí AI...
            </>
          ) : (
            '🤖 Vygenerovat více týdenní plán pomocí AI'
          )}
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanPreview;
