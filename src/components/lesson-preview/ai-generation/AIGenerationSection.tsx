
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { GenerateFullPlan } from './GenerateFullPlan';
import { GeneratePartialPlan } from './GeneratePartialPlan';
import { LessonExerciseData, PromptData } from '@/services/aiService';

interface AIGenerationSectionProps {
  lessonData: any;
  equipmentNames: string[];
  onSuccess: (exerciseData: LessonExerciseData, promptData?: PromptData) => void;
}

const AIGenerationSection: React.FC<AIGenerationSectionProps> = ({
  lessonData,
  equipmentNames,
  onSuccess
}) => {
  return (
    <Card className="shadow-md mb-6">
      <CardHeader>
        <CardTitle>Generovat s pomocí AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 mb-4">
          Nechte si vygenerovat alternativní plán hodiny s pomocí umělé inteligence.
          AI použije vámi zadané parametry a navrhne další zajímavé aktivity.
        </p>
        <GenerateFullPlan
          lessonData={lessonData}
          equipmentNames={equipmentNames}
          onSuccess={onSuccess}
        />
        
        <GeneratePartialPlan 
          lessonData={lessonData}
          equipmentNames={equipmentNames}
          onSuccess={onSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default AIGenerationSection;
