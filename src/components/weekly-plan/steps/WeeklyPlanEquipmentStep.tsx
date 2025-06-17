
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, ArrowLeft } from 'lucide-react';
import { getEquipment, getSchoolEquipment } from '@/services/supabaseService';

interface WeeklyPlanEquipmentStepProps {
  planData: {
    equipment: number[];
    environments: number[];
    schoolId: number | null;
  };
  availableEquipment: any[];
  updatePlanData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isStepComplete: () => boolean;
}

const WeeklyPlanEquipmentStep: React.FC<WeeklyPlanEquipmentStepProps> = ({
  planData,
  availableEquipment: equipmentProp,
  updatePlanData,
  goToNextStep,
  goToPrevStep,
  isStepComplete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEquipment, setFilteredEquipment] = useState<any[]>([]);
  const [allEquipment, setAllEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Načtení vybavení z databáze
  useEffect(() => {
    const loadAllEquipment = async () => {
      try {
        setIsLoading(true);
        const equipment = await getEquipment();
        setAllEquipment(equipment);
      } catch (error) {
        console.error('Error loading equipment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllEquipment();
  }, []);

  // Automaticky načteme vybavení školy při změně školy
  useEffect(() => {
    if (planData.schoolId && planData.equipment.length === 0) {
      loadSchoolEquipment();
    }
  }, [planData.schoolId]);

  const loadSchoolEquipment = async () => {
    if (!planData.schoolId) return;
    
    try {
      const schoolEquipment = await getSchoolEquipment(planData.schoolId);
      const equipmentIds = schoolEquipment.map((item: any) => item.id);
      
      if (equipmentIds.length > 0) {
        updatePlanData({ 
          equipment: equipmentIds 
        });
      }
    } catch (error) {
      console.error('Error loading school equipment:', error);
    }
  };

  // Filtrování vybavení podle prostředí a vyhledávání
  useEffect(() => {
    let equipment = [...allEquipment];
    
    // Filtrování podle prostředí
    if (planData.environments && planData.environments.length > 0) {
      equipment = equipment.filter(item => {
        // Kontrola, zda vybavení patří alespoň k jednomu z vybraných prostředí
        if (!item.environment_ids) return true; // Pokud není přiřazeno k žádnému prostředí, zobrazit vždy
        return item.environment_ids.some((envId: number) => 
          planData.environments.includes(envId)
        );
      });
    }
    
    // Filtrování podle vyhledávání
    if (searchQuery) {
      equipment = equipment.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredEquipment(equipment);
  }, [searchQuery, allEquipment, planData.environments]);

  const handleEquipmentToggle = (equipmentId: number) => {
    const currentEquipment = [...planData.equipment];
    
    if (currentEquipment.includes(equipmentId)) {
      // Odstranění vybavení
      updatePlanData({
        equipment: currentEquipment.filter(id => id !== equipmentId)
      });
    } else {
      // Přidání vybavení
      updatePlanData({
        equipment: [...currentEquipment, equipmentId]
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Výběr vybavení</h2>
      <p className="text-gray-600">
        Vyberte vybavení, které budete potřebovat pro hodiny více týdenního plánu. Vybavení bylo automaticky předvybráno na základě vybrané školy, ale můžete ho upravit podle potřeby.
      </p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Hledat vybavení..."
          className="w-full px-4 py-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
        {isLoading ? (
          <div className="col-span-2 flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredEquipment.length > 0 ? (
          filteredEquipment.map(item => (
            <Card
              key={item.id}
              className={`p-4 cursor-pointer border-2 hover:bg-gray-50 ${
                planData.equipment.includes(item.id) ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => handleEquipmentToggle(item.id)}
            >
              <div className="flex items-start">
                {planData.equipment.includes(item.id) && (
                  <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500">
            {searchQuery ? "Žádné vybavení neodpovídá vašemu vyhledávání" : "Žádné vybavení není k dispozici"}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <Button 
          onClick={goToNextStep}
          disabled={!isStepComplete()}
        >
          Pokračovat
          <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanEquipmentStep;
