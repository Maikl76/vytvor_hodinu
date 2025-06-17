
import React from 'react';
import { CheckIcon } from 'lucide-react';

interface WeeklyPlanStepHeaderProps {
  currentStep: number;
}

const WeeklyPlanStepHeader: React.FC<WeeklyPlanStepHeaderProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Škola' },
    { id: 2, name: 'Prostředí' },
    { id: 3, name: 'Přípravná' },
    { id: 4, name: 'Hlavní' },
    { id: 5, name: 'Závěrečná' },
    { id: 6, name: 'Vybavení' },
    { id: 7, name: 'Čas' },
    { id: 8, name: 'Role' },
    { id: 9, name: 'Plán' },
    { id: 10, name: 'Dokončit' },
  ];

  return (
    <ol className="flex space-x-2 md:space-x-4">
      {steps.map((step) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <li
            key={step.id}
            className={`flex items-center ${
              isActive
                ? 'text-primary font-medium'
                : isCompleted
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full border-2 ${
                isActive
                  ? 'border-primary bg-white'
                  : isCompleted
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {isCompleted ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span className="ml-2 hidden md:inline-block">{step.name}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default WeeklyPlanStepHeader;
