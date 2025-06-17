
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface WeeklyPlanFinalStepProps {
  planState: {
    title: string;
    schoolId: number | null;
    grade: number;
    environments: number[];
    preparationItems: number[];
    mainItems: number[];
    finishItems: number[];
    equipment: number[];
    preparationTime: number;
    mainTime: number;
    finishTime: number;
    preparationRoleId: number | null;
    mainRoleId: number | null;
    finishRoleId: number | null;
    weeksCount: number;
    lessonsPerWeek: number;
  };
  handleCreate: () => void;
  goToPrevStep: () => void;
  isLoading: boolean;
}

const WeeklyPlanFinalStep: React.FC<WeeklyPlanFinalStepProps> = ({
  planState,
  handleCreate,
  goToPrevStep,
  isLoading
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Výpočet celkového počtu hodin
  const totalLessons = planState.weeksCount * planState.lessonsPerWeek;
  
  // Opravena implementace handleCreateClick - přidáno více logování
  const handleCreateClick = (e: React.MouseEvent) => {
    // Zabránit výchozímu chování
    e.preventDefault();
    
    console.log("Kliknuto na tlačítko vytvořit plán");
    
    try {
      // Zavolat funkci pro vytvoření plánu
      handleCreate();
      console.log("Funkce handleCreate byla zavolána");
    } catch (error) {
      console.error("Chyba při volání handleCreate:", error);
      toast({
        title: "Chyba při vytváření plánu",
        description: "Při pokusu o vytvoření plánu došlo k chybě.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Dokončení plánu</h2>
      <p className="text-gray-600 mb-4">
        Zkontrolujte nastavení vašeho více týdenního plánu a dokončete jeho vytvoření.
      </p>
      
      <Card className="p-4 mb-6">
        <h3 className="font-medium mb-2">Souhrn plánu</h3>
        <ul className="space-y-2">
          <li><span className="font-medium">Název plánu:</span> {planState.title}</li>
          <li><span className="font-medium">Ročník:</span> {planState.grade}. ročník</li>
          <li><span className="font-medium">Počet týdnů:</span> {planState.weeksCount}</li>
          <li><span className="font-medium">Počet hodin týdně:</span> {planState.lessonsPerWeek}</li>
          <li><span className="font-medium">Celkový počet hodin:</span> {totalLessons}</li>
          <li><span className="font-medium">Počet vybraných prostředí:</span> {planState.environments.length}</li>
          <li>
            <span className="font-medium">Vybrané aktivity:</span>
            <ul className="ml-4 list-disc">
              <li>Přípravná část: {planState.preparationItems.length} aktivit</li>
              <li>Hlavní část: {planState.mainItems.length} aktivit</li>
              <li>Závěrečná část: {planState.finishItems.length} aktivit</li>
            </ul>
          </li>
          <li><span className="font-medium">Počet vybraného vybavení:</span> {planState.equipment.length}</li>
          <li>
            <span className="font-medium">Časování:</span>
            <ul className="ml-4 list-disc">
              <li>Přípravná část: {planState.preparationTime} minut</li>
              <li>Hlavní část: {planState.mainTime} minut</li>
              <li>Závěrečná část: {planState.finishTime} minut</li>
            </ul>
          </li>
        </ul>
      </Card>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <p className="text-blue-800">
          Po vytvoření plánu budete přesměrováni na stránku generování plánu,
          kde budete moci vygenerovat jednotlivé hodiny a celý plán pomocí AI.
        </p>
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={goToPrevStep}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zpět
        </Button>
        <Button 
          onClick={handleCreateClick}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "Vytvářím plán..." : "Vytvořit plán"}
          {!isLoading && <Check className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default WeeklyPlanFinalStep;
