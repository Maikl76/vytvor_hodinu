
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';

interface SchoolStepProps {
  lessonData: {
    title: string;
    school: string;
    schoolId: number | null;
    lessonsPerWeek: number;
    grade: number;
  };
  schools: Array<{
    id: number;
    name: string;
    lessons_per_week: number;
  }>;
  updateLessonData: (data: any) => void;
  goToNextStep: () => void;
  isStepComplete: () => boolean;
}

const SchoolStep: React.FC<SchoolStepProps> = ({ 
  lessonData, 
  schools, 
  updateLessonData, 
  goToNextStep,
  isStepComplete 
}) => {
  // Array of grades from 1 to 9
  const grades = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <>
      <CardHeader>
        <CardTitle>Základní informace o hodině</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Název hodiny
            </Label>
            <Input
              id="title"
              type="text"
              value={lessonData.title}
              onChange={(e) => updateLessonData({ title: e.target.value })}
              placeholder="Např. Základy atletiky - běh"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Škola</label>
            <Select 
              value={lessonData.schoolId?.toString() || ""}
              onValueChange={(value) => {
                if (value && value !== "placeholder") {
                  const selectedId = parseInt(value);
                  const selectedSchool = schools.find(s => s.id === selectedId);
                  if (selectedSchool) {
                    updateLessonData({ 
                      school: selectedSchool.name,
                      schoolId: selectedSchool.id,
                      lessonsPerWeek: selectedSchool.lessons_per_week
                    });
                  }
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte školu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Vyberte školu</SelectItem>
                {schools.map(school => (
                  <SelectItem key={school.id} value={school.id.toString()}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ročník</label>
            <Select
              value={lessonData.grade?.toString() || ""}
              onValueChange={(value) => {
                if (value && value !== "placeholder") {
                  updateLessonData({ grade: parseInt(value) });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vyberte ročník" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder">Vyberte ročník</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade.toString()}>
                    {grade}. ročník
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Počet tělovýchovných hodin týdně
            </label>
            <input 
              type="number" 
              min="1"
              max="10"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={lessonData.lessonsPerWeek}
              onChange={(e) => updateLessonData({ lessonsPerWeek: parseInt(e.target.value) || 0 })}
              readOnly={lessonData.schoolId !== null}
            />
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default SchoolStep;
