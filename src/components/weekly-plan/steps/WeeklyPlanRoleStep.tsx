
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, ArrowLeft } from 'lucide-react';

interface WeeklyPlanRoleStepProps {
  planData: {
    preparationRoleId: number | null;
    mainRoleId: number | null;
    finishRoleId: number | null;
  };
  roles: any[];
  updatePlanData: (data: any) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isStepComplete: () => boolean;
}

const WeeklyPlanRoleStep: React.FC<WeeklyPlanRoleStepProps> = ({
  planData,
  roles,
  updatePlanData,
  goToNextStep,
  goToPrevStep,
  isStepComplete
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Výběr rolí pro jednotlivé části hodiny</h2>
      <p className="text-gray-600">
        Zvolte, kdo povede jednotlivé části hodin více týdenního plánu.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div>
              <h3 className="font-medium mb-3">Přípravná část</h3>
              <RadioGroup
                value={planData.preparationRoleId?.toString() || ""}
                onValueChange={(value) => updatePlanData({ preparationRoleId: value ? parseInt(value) : null })}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={role.id.toString()} id={`prep-role-${role.id}`} />
                      <Label htmlFor={`prep-role-${role.id}`}>{role.name}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="prep-role-none" />
                    <Label htmlFor="prep-role-none">Neurčeno</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Hlavní část</h3>
              <RadioGroup
                value={planData.mainRoleId?.toString() || ""}
                onValueChange={(value) => updatePlanData({ mainRoleId: value ? parseInt(value) : null })}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={role.id.toString()} id={`main-role-${role.id}`} />
                      <Label htmlFor={`main-role-${role.id}`}>{role.name}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="main-role-none" />
                    <Label htmlFor="main-role-none">Neurčeno</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-3">Závěrečná část</h3>
              <RadioGroup
                value={planData.finishRoleId?.toString() || ""}
                onValueChange={(value) => updatePlanData({ finishRoleId: value ? parseInt(value) : null })}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={role.id.toString()} id={`finish-role-${role.id}`} />
                      <Label htmlFor={`finish-role-${role.id}`}>{role.name}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="finish-role-none" />
                    <Label htmlFor="finish-role-none">Neurčeno</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

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

export default WeeklyPlanRoleStep;
