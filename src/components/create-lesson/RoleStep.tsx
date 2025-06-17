
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleStepProps {
  lessonData: {
    preparationRoleId: number | null;
    mainRoleId: number | null;
    finishRoleId: number | null;
  };
  roles: Array<{
    id: number;
    name: string;
  }>;
  updateLessonData: (data: any) => void;
  goToNextStep: () => void;
  isStepComplete: () => boolean;
  setActiveTab: () => void;
  isLoading?: boolean;
}

const RoleStep: React.FC<RoleStepProps> = ({
  lessonData,
  roles,
  updateLessonData,
  goToNextStep,
  isStepComplete,
  setActiveTab,
  isLoading = false
}) => {
  const handleCreateLesson = () => {
    console.log("🎯 RoleStep - Kliknuto na tlačítko Vytvořit hodinu");
    console.log("🎯 RoleStep - lessonData:", lessonData);
    console.log("🎯 RoleStep - isLoading:", isLoading);
    
    try {
      goToNextStep();
      console.log("🎯 RoleStep - goToNextStep() zavoláno úspěšně");
    } catch (error) {
      console.error("🎯 RoleStep - Chyba při volání goToNextStep:", error);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Nastavení rolí</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role v přípravné části
            </label>
            <Select
              value={lessonData.preparationRoleId?.toString() || ""}
              onValueChange={(value) => {
                if (value !== "placeholder") {
                  const selectedId = parseInt(value);
                  updateLessonData({ preparationRoleId: selectedId });
                } else {
                  updateLessonData({ preparationRoleId: null });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte roli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Vyberte roli</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role v hlavní části
            </label>
            <Select
              value={lessonData.mainRoleId?.toString() || ""}
              onValueChange={(value) => {
                if (value !== "placeholder") {
                  const selectedId = parseInt(value);
                  updateLessonData({ mainRoleId: selectedId });
                } else {
                  updateLessonData({ mainRoleId: null });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte roli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Vyberte roli</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role v závěrečné části
            </label>
            <Select
              value={lessonData.finishRoleId?.toString() || ""}
              onValueChange={(value) => {
                if (value !== "placeholder") {
                  const selectedId = parseInt(value);
                  updateLessonData({ finishRoleId: selectedId });
                } else {
                  updateLessonData({ finishRoleId: null });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte roli" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Vyberte roli</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={setActiveTab}>
              Zpět
            </Button>
            <Button 
              onClick={handleCreateLesson}
              disabled={isLoading}
            >
              {isLoading ? 'Vytvářím...' : 'Vytvořit hodinu'}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default RoleStep;
