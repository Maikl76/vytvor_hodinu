
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface BasicInfoStepProps {
  planData: {
    title: string;
    schoolId: number | null;
    grade: number;
  };
  schools: any[];
  updatePlanData: (data: any) => void;
  goToNextStep: () => void;
  isStepComplete: () => boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  planData,
  schools,
  updatePlanData,
  goToNextStep,
  isStepComplete
}) => {
  const grades = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Základní informace o plánu</h2>
      <p className="text-gray-600">
        Zadejte základní informace o více týdenním plánu, který chcete vytvořit.
      </p>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-1 block">Název plánu</Label>
            <input
              id="title"
              type="text"
              value={planData.title}
              onChange={(e) => updatePlanData({ title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Např. Atletika - začátečníci"
            />
          </div>

          <div>
            <Label htmlFor="school" className="mb-1 block">Škola</Label>
            <select
              id="school"
              value={planData.schoolId || ''}
              onChange={(e) => updatePlanData({ schoolId: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Vyberte školu</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="grade" className="mb-1 block">Ročník</Label>
            <select
              id="grade"
              value={planData.grade}
              onChange={(e) => updatePlanData({ grade: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-md"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>
                  {grade}. ročník
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
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

export default BasicInfoStep;
