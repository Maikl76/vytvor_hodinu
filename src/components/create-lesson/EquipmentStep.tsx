
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { getSchoolEquipment } from '@/services/supabaseService';

interface EquipmentStepProps {
  lessonData: {
    equipment: number[];
    environmentId: number | null;
    schoolId: number | null;
  };
  equipment: Array<{
    id: number;
    name: string;
    environment_ids?: number[];
  }>;
  updateLessonData: (data: any) => void;
  goToNextStep: (currentStep: string, nextStep: string) => void;
  isStepComplete: (step: string) => boolean;
  setActiveTab: (tab: string) => void;
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({ 
  lessonData, 
  equipment, 
  updateLessonData, 
  goToNextStep,
  isStepComplete,
  setActiveTab 
}) => {
  // Automaticky načteme vybavení školy při změně školy
  useEffect(() => {
    if (lessonData.schoolId && lessonData.equipment.length === 0) {
      loadSchoolEquipment();
    }
  }, [lessonData.schoolId]);

  const loadSchoolEquipment = async () => {
    if (!lessonData.schoolId) return;
    
    try {
      const schoolEquipment = await getSchoolEquipment(lessonData.schoolId);
      const equipmentIds = schoolEquipment.map((item: any) => item.id);
      
      if (equipmentIds.length > 0) {
        updateLessonData({ 
          equipment: equipmentIds 
        });
      }
    } catch (error) {
      console.error('Error loading school equipment:', error);
    }
  };

  // Filter equipment based on environment (if environment_ids metadata is available)
  // Otherwise, show all equipment
  const availableEquipment = lessonData.environmentId 
    ? equipment.filter(item => 
        !item.environment_ids || 
        item.environment_ids.includes(lessonData.environmentId as number)
      )
    : equipment;

  return (
    <>
      <CardHeader>
        <CardTitle>Výběr vybavení</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vybavení</label>
            <p className="text-sm text-gray-500 mb-4">
              Vyberte vybavení, které bude k dispozici pro hodinu. Vybavení bylo automaticky předvybráno na základě vybrané školy, ale můžete ho upravit podle potřeby.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableEquipment.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">
                  Pro vybrané prostředí není definováno žádné vybavení.
                </p>
              ) : (
                availableEquipment.map(item => (
                  <div key={item.id} className="flex items-center space-x-2 bg-white p-3 rounded-md border">
                    <Checkbox
                      id={`equipment-${item.id}`}
                      checked={lessonData.equipment.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateLessonData({ 
                            equipment: [...lessonData.equipment, item.id] 
                          });
                        } else {
                          updateLessonData({
                            equipment: lessonData.equipment.filter(i => i !== item.id)
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor={`equipment-${item.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setActiveTab('step3')}>
              Zpět
            </Button>
            <Button 
              onClick={() => goToNextStep('step4', 'step5')}
              disabled={!isStepComplete('step4')}
            >
              Pokračovat
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default EquipmentStep;
