
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getEquipment, getSchoolEquipment, updateSchoolEquipment } from '@/services/supabaseService';

interface SchoolEquipmentManagerProps {
  schoolId: number;
  schoolName: string;
  isOpen: boolean;
  onClose: () => void;
}

const SchoolEquipmentManager: React.FC<SchoolEquipmentManagerProps> = ({
  schoolId,
  schoolName,
  isOpen,
  onClose
}) => {
  const { toast } = useToast();
  const [allEquipment, setAllEquipment] = useState<Array<{id: number, name: string}>>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, schoolId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [equipment, schoolEquipment] = await Promise.all([
        getEquipment(),
        getSchoolEquipment(schoolId)
      ]);
      
      setAllEquipment(equipment);
      setSelectedEquipment(schoolEquipment.map((item: any) => item.id));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEquipmentToggle = (equipmentId: number) => {
    setSelectedEquipment(prev => 
      prev.includes(equipmentId)
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateSchoolEquipment(schoolId, selectedEquipment);
      
      if (success) {
        toast({
          title: "Vybavení uloženo",
          description: `Vybavení pro školu "${schoolName}" bylo úspěšně aktualizováno.`,
        });
        onClose();
      } else {
        toast({
          title: "Chyba",
          description: "Nepodařilo se uložit vybavení",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit vybavení",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Vybavení pro školu: {schoolName}</h2>
          <Button variant="outline" onClick={onClose}>
            Zavřít
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Vyberte vybavení, které bude automaticky předvybráno při vytváření hodin a plánů pro tuto školu.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {allEquipment.map(equipment => (
                  <div key={equipment.id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                    <Checkbox
                      id={`equipment-${equipment.id}`}
                      checked={selectedEquipment.includes(equipment.id)}
                      onCheckedChange={() => handleEquipmentToggle(equipment.id)}
                    />
                    <label
                      htmlFor={`equipment-${equipment.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {equipment.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Zrušit
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Ukládání...' : 'Uložit vybavení'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SchoolEquipmentManager;
