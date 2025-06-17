
import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhaseTabs from './PhaseTabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ConstructStepProps {
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
  goToNextStep: () => void;
  setActiveTab: () => void;
}

const ConstructStep: React.FC<ConstructStepProps> = ({
  constructId,
  setConstructId,
  selectedItems,
  setSelectedItems,
  goToNextStep,
  setActiveTab
}) => {
  const [activePhase, setActivePhase] = useState('preparation');

  console.log("ConstructStep - Current constructId:", constructId);

  return (
    <>
      <CardHeader>
        <CardTitle>Výběr cvičebních aktivit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <PhaseTabs 
            activePhase={activePhase}
            setActivePhase={setActivePhase}
            constructId={constructId}
            setConstructId={setConstructId}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={setActiveTab}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Zpět
            </Button>
            <Button onClick={goToNextStep}>
              Pokračovat
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ConstructStep;
