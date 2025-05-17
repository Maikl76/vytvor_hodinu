
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhaseItems from './PhaseItems';
import ConstructSelection from './ConstructSelection';
import { useConstructItems } from '@/hooks/useConstructItems';

interface PhaseTabsProps {
  activePhase: string;
  setActivePhase: (phase: string) => void;
  constructId: number | null;
  setConstructId: (id: number | null) => void;
  selectedItems: {
    preparationItems: number[];
    mainItems: number[];
    finishItems: number[];
  };
  setSelectedItems: React.Dispatch<React.SetStateAction<{
    preparationItems: number[];
    mainItems: number[];
    finishItems: number[];
  }>>;
}

const PhaseTabs: React.FC<PhaseTabsProps> = ({
  activePhase,
  setActivePhase,
  constructId,
  setConstructId,
  selectedItems,
  setSelectedItems
}) => {
  const {
    preparationItems,
    mainItems,
    finishItems,
    constructs,
    isLoading
  } = useConstructItems(constructId);

  // Handle item selection in different phases
  const handleConstructItemToggle = (itemId: number, phase: string) => {
    setSelectedItems(prevState => {
      const phaseKey = `${phase}Items` as keyof typeof prevState;
      const currentItems = [...prevState[phaseKey]];
      
      if (currentItems.includes(itemId)) {
        return {
          ...prevState,
          [phaseKey]: currentItems.filter(id => id !== itemId)
        };
      } else {
        return {
          ...prevState,
          [phaseKey]: [...currentItems, itemId]
        };
      }
    });
  };

  // Check if an item is selected in a specific phase
  const isItemSelectedInPhase = (itemId: number, phase: string) => {
    const phaseKey = `${phase}Items` as keyof typeof selectedItems;
    return selectedItems[phaseKey].includes(itemId);
  };

  return (
    <Tabs value={activePhase} onValueChange={setActivePhase} className="w-full">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="preparation" className="flex-1">Přípravná část</TabsTrigger>
        <TabsTrigger value="main" className="flex-1">Hlavní část</TabsTrigger>
        <TabsTrigger value="finish" className="flex-1">Závěrečná část</TabsTrigger>
      </TabsList>

      {/* Přípravná část */}
      <TabsContent value="preparation">
        <PhaseItems 
          items={preparationItems}
          isLoading={isLoading}
          isItemSelected={(itemId) => isItemSelectedInPhase(itemId, 'preparation')}
          onItemToggle={(itemId) => handleConstructItemToggle(itemId, 'preparation')}
          emptyMessage="Žádné položky pro přípravnou část nebyly nalezeny"
        />
      </TabsContent>

      {/* Hlavní část */}
      <TabsContent value="main">
        <div>
          <ConstructSelection
            constructId={constructId}
            setConstructId={setConstructId}
            constructs={constructs}
          />

          {constructId && (
            <>
              <label className="block text-sm font-medium text-gray-700 mb-2">Položky konstruktu</label>
              <PhaseItems 
                items={mainItems}
                isLoading={isLoading}
                isItemSelected={(itemId) => isItemSelectedInPhase(itemId, 'main')}
                onItemToggle={(itemId) => handleConstructItemToggle(itemId, 'main')}
                emptyMessage={constructId
                  ? "Žádné položky pro tento konstrukt nebyly nalezeny"
                  : "Nejprve vyberte cvičební konstrukt"
                }
              />
            </>
          )}
        </div>
      </TabsContent>

      {/* Závěrečná část */}
      <TabsContent value="finish">
        <PhaseItems 
          items={finishItems}
          isLoading={isLoading}
          isItemSelected={(itemId) => isItemSelectedInPhase(itemId, 'finish')}
          onItemToggle={(itemId) => handleConstructItemToggle(itemId, 'finish')}
          emptyMessage="Žádné položky pro závěrečnou část nebyly nalezeny"
        />
      </TabsContent>
    </Tabs>
  );
};

export default PhaseTabs;
